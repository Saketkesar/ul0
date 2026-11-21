"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { UL0Icon } from "@/components/ul0-icon"
import { toast } from "sonner"

export default function NewGroupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerUpi, setOwnerUpi] = useState("")
  const [memberInput, setMemberInput] = useState("")
  const [members, setMembers] = useState<string[]>(["Rahul", "Priya"])
  const [allowMemberEntries, setAllowMemberEntries] = useState(false)
  const [iconUrl, setIconUrl] = useState("")
  const [bannerUrl, setBannerUrl] = useState("")
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingIcon, setIsUploadingIcon] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    try {
      const savedName = localStorage.getItem("ul0_split_collector_name")
      const savedUpi = localStorage.getItem("ul0_split_collector_upi")
      if (savedName) setOwnerName(savedName)
      if (savedUpi) setOwnerUpi(savedUpi)
    } catch {}
  }, [])

  const addMembers = () => {
    if (!memberInput.trim()) return
    const raw = memberInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    setMembers((prev) => Array.from(new Set([...prev, ...raw])))
    setMemberInput("")
  }

  const removeMember = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleImageUpload = async (file: File, type: "banner" | "icon") => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB")
      return
    }

    if (type === "banner") setIsUploadingBanner(true)
    else setIsUploadingIcon(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/groups/upload-image", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to upload image")

      if (type === "banner") {
        setBannerUrl(data.url)
        toast.success("Banner image uploaded!")
      } else {
        setIconUrl(data.url)
        toast.success("Group icon uploaded!")
      }
    } catch (err: any) {
      toast.error(err.message || "Image upload failed")
    } finally {
      if (type === "banner") setIsUploadingBanner(false)
      else setIsUploadingIcon(false)
    }
  }

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Group name is required")
      return
    }

    if (members.length === 0) {
      toast.error("Add at least one member to the group")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          currency: "INR",
          allowMemberEntries,
          memberNames: members,
          ownerName: ownerName.trim() || "You",
          ownerUpi: ownerUpi.trim().toLowerCase() || undefined,
          iconUrl: iconUrl.trim() || undefined,
          bannerUrl: bannerUrl.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create group")
      }

      toast.success("Group created!")
      router.push(`/split/groups/${data.group.id}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to create group")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <div className="border-b border-[#E4ECE8] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <a href="/split/groups" className="text-xs font-bold text-[#5A6B66] hover:text-[#0B7A66]">
              Groups
            </a>
            <span className="text-[#D5E0DB]">/</span>
            <span className="text-xs font-bold text-[#0B7A66]">New</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B1A17] tracking-tight">
            Create a Group Khata
          </h1>
          <p className="text-xs text-[#5A6B66] mt-0.5">
            Perfect for flatmates, ongoing trips, or recurring office lunch tabs.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4ECE8] bg-white p-6 space-y-5 shadow-[0_1px_2px_rgba(10,30,26,0.06)]">
          {/* Banner & Icon Live Preview */}
          {bannerUrl && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#E4ECE8] shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bannerUrl} alt="Group Banner Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                {iconUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={iconUrl} alt="Icon" className="w-10 h-10 rounded-lg border border-white object-cover bg-white" />
                ) : (
                  <div className="w-10 h-10 rounded-lg border border-white bg-[#0B7A66] text-white flex items-center justify-center font-bold text-sm">
                    {name ? name.slice(0, 2).toUpperCase() : "GR"}
                  </div>
                )}
                <div>
                  <span className="text-sm font-bold block">{name || "Group Name"}</span>
                  <span className="text-[10px] text-white/80 block">Banner Backdrop Live Preview</span>
                </div>
              </div>
            </div>
          )}

          {/* Group Name */}
          <div>
            <Label htmlFor="g-name" className="text-xs font-semibold text-[#5A6B66]">
              Group Name
            </Label>
            <Input
              id="g-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Goa Trip 2026, Flat 402 Roommates"
              className="mt-1 h-12 text-sm bg-white border-[#E4ECE8] text-[#0B1A17] rounded-xl"
            />
          </div>

          {/* Group Banner & Icon Images */}
          <div className="p-3.5 rounded-xl border border-[#D5E0DB] bg-[#F7FAF8] space-y-3">
            <span className="text-xs font-bold text-[#0B1A17] block">Group Banner & Icon (Free Image Host)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] text-[#5A6B66] block mb-1">Group Banner (Hero Backdrop)</Label>
                <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-[#CCD9D4] bg-white hover:bg-[#EAF7F3]/40 cursor-pointer text-xs font-medium text-[#0B1A17] transition-colors">
                  <UL0Icon name="upload" size={14} />
                  <span>{isUploadingBanner ? "Uploading..." : bannerUrl ? "Change Banner" : "Upload Banner"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleImageUpload(f, "banner")
                    }}
                  />
                </label>
              </div>

              <div>
                <Label className="text-[11px] text-[#5A6B66] block mb-1">Group Icon</Label>
                <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-[#CCD9D4] bg-white hover:bg-[#EAF7F3]/40 cursor-pointer text-xs font-medium text-[#0B1A17] transition-colors">
                  <UL0Icon name="upload" size={14} />
                  <span>{isUploadingIcon ? "Uploading..." : iconUrl ? "Change Icon" : "Upload Icon"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleImageUpload(f, "icon")
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="p-3.5 rounded-xl border border-[#D5E0DB] bg-[#F7FAF8] space-y-3">
            <span className="text-xs font-bold text-[#0B1A17] block">Your Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] text-[#5A6B66]">Your Name</Label>
                <Input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Saket"
                  className="mt-1 h-9 text-xs bg-white border-[#E4ECE8]"
                />
              </div>
              <div>
                <Label className="text-[11px] text-[#5A6B66]">Your UPI ID</Label>
                <Input
                  value={ownerUpi}
                  onChange={(e) => setOwnerUpi(e.target.value)}
                  placeholder="e.g. saket@oksbi"
                  className="mt-1 h-9 text-xs font-mono bg-white border-[#E4ECE8]"
                />
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-[#5A6B66]">
              Add Members
            </Label>

            <div className="flex gap-2">
              <Input
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addMembers()
                  }
                }}
                placeholder="Member name (or paste multiple names)"
                className="h-10 text-xs bg-white border-[#E4ECE8]"
              />
              <Button
                type="button"
                onClick={addMembers}
                className="bg-[#EAF1EE] hover:bg-[#DDF5EE] text-[#0B7A66] font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
              >
                Add
              </Button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 rounded-full bg-[#DDF5EE] text-[#0B7A66] text-xs font-semibold">
                {ownerName || "You"} (Organizer)
              </span>

              {members.map((m, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7FAF8] border border-[#E4ECE8] text-xs font-medium text-[#0B1A17]"
                >
                  <span>{m}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="text-[#5A6B66] hover:text-[#B3261E] cursor-pointer"
                  >
                    <UL0Icon name="trash" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Allow member entries toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E4ECE8] bg-[#F7FAF8]">
            <div>
              <div className="text-xs font-bold text-[#0B1A17]">Allow friends to add expenses?</div>
              <div className="text-[11px] text-[#5A6B66]">
                If turned on, anyone with the group link can log their own expenses.
              </div>
            </div>
            <Switch
              checked={allowMemberEntries}
              onCheckedChange={setAllowMemberEntries}
              className="data-[state=checked]:bg-[#0B7A66]"
            />
          </div>

          <Button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="w-full bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold text-sm h-12 rounded-[16px] cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Group Khata"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
