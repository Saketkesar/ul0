import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <UL0Icon name="notfound" className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">Link Not Found</h1>
      <p className="mb-6 text-center text-muted-foreground text-sm max-w-sm">This link may have expired, reached its click limit, or been removed.</p>
      <Link href="/">
        <Button className="rounded-full px-6">Create a New Link</Button>
      </Link>
    </div>
  )
}
