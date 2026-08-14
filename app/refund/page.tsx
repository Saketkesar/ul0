import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy — ul0",
  description: "Refund and cancellation guidelines for paid subscriptions on ul0.",
  alternates: {
    canonical: "https://ul0.site/refund",
  },
}

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans antialiased selection:bg-gray-200">
        <div className="container mx-auto px-6 py-20 max-w-3xl">
          
          <div className="text-left mb-12 pb-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="mt-2 text-xs text-gray-400 font-mono">
              Last updated: July 5, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 font-mono">1. Subscriptions &amp; Billing Cycles</h2>
              <p>
                ul0 offers monthly and annual subscription plans. Payments are processed securely via our billing partner, Polar.sh, and Stripe. Your billing cycle begins on the day you upgrade and automatically renews at the end of each period unless canceled.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 font-mono">2. Cancellation Policy</h2>
              <p>
                You can cancel your subscription at any time. To cancel:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Go to the <Link href="/pricing" className="underline hover:text-gray-950">Pricing Page</Link> and click <strong>"Go to Billing Portal"</strong>.</li>
                <li>Inside the billing portal, click <strong>"Cancel Subscription"</strong>.</li>
              </ul>
              <p>
                Upon cancellation, your subscription remains active until the end of your current billing period. Once the period ends:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Your account plan will revert to the <strong>Free Plan</strong> limits.</li>
                <li>Your existing custom domain short links will remain active and continue to redirect correctly, but you will not be able to create new custom domain links exceeding the free limit.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 font-mono">3. Refund Policy</h2>
              <p>
                We want you to be completely satisfied with our service. We offer a <strong>14-day refund window</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>If you cancel within 14 days of your initial purchase or renewal, you are eligible for a full refund.</li>
                <li>To request a refund, please send an email to <a href="mailto:getul0site@gmail.com" className="underline hover:text-gray-950">getul0site@gmail.com</a> with your account email address and checkout details.</li>
                <li>Refunds are processed within 5 to 10 business days and returned to your original payment method.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 font-mono">4. Past Due Accounts</h2>
              <p>
                If a renewal payment fails, we will attempt to charge your card again over a 7-day grace period. If payment is not completed after this period, your subscription will be paused and your account will revert to the Free Plan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 font-mono">5. Contact</h2>
              <p>
                If you have any questions or require assistance with cancellations or refunds, please contact us at{" "}
                <a href="mailto:getul0site@gmail.com" className="underline hover:text-gray-950 font-medium">
                  getul0site@gmail.com
                </a>.
              </p>
            </section>

          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
