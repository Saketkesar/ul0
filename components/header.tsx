import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Link2, QrCode, Users, Timer, FileJson, LinkIcon, Clock, Volume2, Hourglass, Quote, Globe, ShoppingCart, GitCompare, Award } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center" aria-label="ul0 - Free URL Shortener Home">
          <Image
            src="/ul0.png"
            alt="ul0 - Free URL Shortener Logo"
            width={100}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Shortener
          </Link>
          <Link
            href="/qr"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            QR Code
          </Link>
          <Link
            href="/split"
            className="hidden sm:block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Split
          </Link>
          
          {/* More Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground flex items-center gap-1">
              Tools
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Developer Tools</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/utm" className="flex items-center gap-2 cursor-pointer">
                  <LinkIcon className="h-4 w-4" />
                  UTM Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  JSON Formatter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compare" className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                  <GitCompare className="h-4 w-4 text-primary" />
                  Compare AI
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Study & Desk Setup</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/examcrack" className="flex items-center gap-2 cursor-pointer font-semibold text-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  Examcrack OS
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/clock" className="flex items-center gap-2 cursor-pointer">
                  <Clock className="h-4 w-4" />
                  Aesthetic Clock
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ambient" className="flex items-center gap-2 cursor-pointer">
                  <Volume2 className="h-4 w-4" />
                  Ambient Sounds
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/countdown" className="flex items-center gap-2 cursor-pointer">
                  <Hourglass className="h-4 w-4" />
                  Countdown Creator
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/quotes" className="flex items-center gap-2 cursor-pointer">
                  <Quote className="h-4 w-4" />
                  Motivational Quotes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/worldclock" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="h-4 w-4" />
                  World Clock
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pomodoro" className="flex items-center gap-2 cursor-pointer">
                  <Timer className="h-4 w-4" />
                  Pomodoro Timer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Other</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/buy" className="flex items-center gap-2 cursor-pointer">
                  <ShoppingCart className="h-4 w-4" />
                  Should I Buy This?
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="sm:hidden">
                <Link href="/split" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Split Expenses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wifi" className="flex items-center gap-2 cursor-pointer">
                  <QrCode className="h-4 w-4" />
                  WiFi QR Generator
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
