import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Link2, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/ul0.png"
            alt="ul0 logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/split">
              <Link2 className="mr-2 h-4 w-4" />
              Split Expenses
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
