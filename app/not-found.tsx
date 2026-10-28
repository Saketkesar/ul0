import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Link2, Search, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/ul0.png"
            alt="UL0"
            width={72}
            height={26}
            className="h-6 w-auto object-contain"
            priority
          />
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-xs font-semibold text-primary">404 — Not Found</span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Page or Link Not Found
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page or short link you requested does not exist, has been moved, or was removed by its creator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Button asChild size="sm" className="flex-1 text-xs font-semibold">
            <Link href="/">
              <Link2 className="h-3.5 w-3.5 mr-1" />
              <span>Shorten a link</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
            <Link href="/tools">
              <Search className="h-3.5 w-3.5 mr-1" />
              <span>Browse tools</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
