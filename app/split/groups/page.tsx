"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"
import { toast } from "sonner"

export default function GroupsDashboardPage() {
  const router = useRouter()
  const [groups, setGroups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/groups")
        const data = await res.json()
        if (res.ok) {
          setGroups(data.groups || [])
        }
      } catch (err) {
        toast.error("Failed to load your groups")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4ECE8] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <a href="/split" className="text-xs font-bold text-[#5A6B66] hover:text-[#0B7A66] transition-colors">
                Split
              </a>
              <span className="text-[#D5E0DB]">/</span>
              <span className="text-xs font-bold text-[#0B7A66]">Groups</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1A17] tracking-tight">
              Group Khatas
            </h1>
            <p className="text-xs text-[#5A6B66] mt-0.5">
              Keep a running tab for your trip, flat roommates, or office team.
            </p>
          </div>

          <Button
            onClick={() => router.push("/split/groups/new")}
            className="bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold text-xs h-11 px-5 rounded-[14px] shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <UL0Icon name="plus" size={14} />
            <span>New Group</span>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
            <div className="h-40 bg-white border border-[#E4ECE8] rounded-2xl" />
            <div className="h-40 bg-white border border-[#E4ECE8] rounded-2xl" />
          </div>
        ) : groups.length === 0 ? (
          // Empty State
          <div className="p-12 rounded-2xl border border-[#E4ECE8] bg-white text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EAF1EE] text-[#0B7A66] mx-auto flex items-center justify-center">
              <UL0Icon name="team" size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#0B1A17]">No groups yet</h3>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              Create a group for an upcoming trip, shared apartment, or event to track ongoing expenses and settle up with minimal UPI payments.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => router.push("/split/groups/new")}
                className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-10 px-5 rounded-xl font-bold cursor-pointer"
              >
                Create your first group
              </Button>
            </div>
          </div>
        ) : (
          // Groups Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => router.push(`/split/groups/${group.id}`)}
                className="p-5 rounded-2xl border border-[#E4ECE8] bg-white hover:border-[#3DDBB8] transition-all cursor-pointer shadow-[0_1px_2px_rgba(10,30,26,0.06)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0B1A17]">{group.name}</h3>
                  <span className="text-[11px] font-medium text-[#5A6B66] px-2 py-0.5 rounded-full bg-[#F7FAF8] border border-[#E4ECE8]">
                    {group.member_count || 1} members
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F7FAF8]">
                  <div>
                    <span className="text-[10px] text-[#5A6B66] block">Total Spent</span>
                    <span className="font-mono font-bold text-sm text-[#0B1A17]">
                      ₹{parseFloat(group.total_spent || "0").toFixed(2)}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#0B7A66] flex items-center gap-1">
                    <span>View Tab</span>
                    <UL0Icon name="arrowright" size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
