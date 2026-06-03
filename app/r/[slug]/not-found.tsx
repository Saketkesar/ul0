import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-2xl font-bold text-foreground">Link Not Found</h1>
      <p className="mb-6 text-center text-muted-foreground">This link may have expired or been removed.</p>
      <Link href="/">
        <Button>Create a New Link</Button>
      </Link>
    </div>
  )
}
