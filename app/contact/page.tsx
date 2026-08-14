import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | ul0 - Free URL Shortener",
  description: "Get in touch with ul0 team. Contact us for support, feedback, or business inquiries.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Email Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For all inquiries, support requests, feedback, or business proposals, please email us at:
                </p>
                <a 
                  href="mailto:getul0site@gmail.com" 
                  className="text-xl font-semibold text-primary hover:underline"
                >
                  getul0site@gmail.com
                </a>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We typically respond within 24-48 hours. For urgent matters, please mention "URGENT" in the subject line.
                </p>
              </CardContent>
            </Card>

            {/* Common Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  What You Can Contact Us About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Report a malicious or spam link</li>
                  <li>• Request link removal</li>
                  <li>• Bug reports and feedback</li>
                  <li>• Business inquiries and partnerships</li>
                  <li>• Advertising and sponsorship</li>
                  <li>• General questions about ul0</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
