-- LinkSplit Database Schema
-- All features are free with ads - no premium tiers

-- Users table (for authenticated users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  upi_default TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own data" ON public.users FOR DELETE USING (auth.uid() = id);

-- Links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expire_at TIMESTAMP WITH TIME ZONE,
  clicks_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_domain TEXT,
  meta_favicon_url TEXT,
  link_type TEXT DEFAULT 'normal' CHECK (link_type IN ('normal', 'payment')),
  payment_id UUID
);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Anyone can view links (for redirect functionality)
CREATE POLICY "Anyone can view links" ON public.links FOR SELECT USING (true);
-- Anyone can create links (anonymous shortening)
CREATE POLICY "Anyone can create links" ON public.links FOR INSERT WITH CHECK (true);
-- Only owners can update their links
CREATE POLICY "Owners can update links" ON public.links FOR UPDATE USING (auth.uid() = owner_id);
-- Only owners can delete their links
CREATE POLICY "Owners can delete links" ON public.links FOR DELETE USING (auth.uid() = owner_id);

-- Clicks table for analytics
CREATE TABLE IF NOT EXISTS public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT,
  country TEXT,
  device_type TEXT,
  referrer TEXT,
  user_agent TEXT
);

ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Anyone can insert clicks
CREATE POLICY "Anyone can insert clicks" ON public.clicks FOR INSERT WITH CHECK (true);
-- Link owners can view their clicks
CREATE POLICY "Owners can view clicks" ON public.clicks 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.links 
      WHERE links.id = clicks.link_id 
      AND links.owner_id = auth.uid()
    )
  );

-- Groups table for split-pay
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view groups" ON public.groups FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update groups" ON public.groups FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete groups" ON public.groups FOR DELETE USING (auth.uid() = owner_id);

-- Group members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT,
  upi_id TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group owners can view members" ON public.group_members 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_members.group_id 
      AND groups.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owners can insert members" ON public.group_members 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_members.group_id 
      AND groups.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owners can update members" ON public.group_members 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_members.group_id 
      AND groups.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owners can delete members" ON public.group_members 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_members.group_id 
      AND groups.owner_id = auth.uid()
    )
  );

-- Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  payer_member_id UUID REFERENCES public.group_members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group owners can view expenses" ON public.expenses 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = expenses.group_id 
      AND groups.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owners can insert expenses" ON public.expenses 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = expenses.group_id 
      AND groups.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owners can update expenses" ON public.expenses 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = expenses.group_id 
      AND groups.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owners can delete expenses" ON public.expenses 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = expenses.group_id 
      AND groups.owner_id = auth.uid()
    )
  );

-- Expense splits table
CREATE TABLE IF NOT EXISTS public.expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.group_members(id) ON DELETE CASCADE,
  amount_due NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  payment_link_id UUID REFERENCES public.links(id) ON DELETE SET NULL,
  qr_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed'))
);

ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;

-- Group owners can manage splits
CREATE POLICY "Group owners can view splits" ON public.expense_splits 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.expenses e
      JOIN public.groups g ON g.id = e.group_id
      WHERE e.id = expense_splits.expense_id 
      AND g.owner_id = auth.uid()
    )
  );
-- Public can view splits via payment link (for payment pages)
CREATE POLICY "Anyone can view splits for payment" ON public.expense_splits 
  FOR SELECT USING (payment_link_id IS NOT NULL);

CREATE POLICY "Group owners can insert splits" ON public.expense_splits 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.expenses e
      JOIN public.groups g ON g.id = e.group_id
      WHERE e.id = expense_splits.expense_id 
      AND g.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owners can update splits" ON public.expense_splits 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.expenses e
      JOIN public.groups g ON g.id = e.group_id
      WHERE e.id = expense_splits.expense_id 
      AND g.owner_id = auth.uid()
    )
  );
-- Anyone can update splits to mark as paid (via payment link)
CREATE POLICY "Anyone can mark splits paid" ON public.expense_splits 
  FOR UPDATE USING (payment_link_id IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_slug ON public.links(slug);
CREATE INDEX IF NOT EXISTS idx_links_owner ON public.links(owner_id);
CREATE INDEX IF NOT EXISTS idx_clicks_link ON public.clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_date ON public.clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_groups_owner ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_expenses_group ON public.expenses(group_id);
CREATE INDEX IF NOT EXISTS idx_splits_expense ON public.expense_splits(expense_id);
