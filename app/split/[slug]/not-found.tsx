import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

export default function SplitNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted/60 border border-border p-5">
            <UL0Icon name="clock" className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Split Session Expired or Not Found
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            This split link has expired (links are valid for 24 hours) or doesn&apos;t exist. 
            Create a new split to share expenses with your group.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href="/split">
              Create New Split
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="rounded-full px-6 border-border/80">
            <Link href="/">
              <UL0Icon name="home" className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-8 text-sm text-muted-foreground">
          <Image
            src="/ul0.png"
            alt="ul0 logo"
            width={20}
            height={20}
            className="h-5 w-5 rounded"
          />
          <span className="font-semibold">ul0</span>
        </div>
      </div>
    </div>
  )
}
