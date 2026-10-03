import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Link kürzen ohne Anmeldung: Beste URL-Shortener 2026",
  description: "Erfahren Sie, wie Sie lange Links ohne Registrierung kostenlos kürzen. DSGVO-konform, permanent und blitzschnell mit ul0.site.",
  keywords: [
    "link kürzen ohne anmeldung",
    "link kürzen kostenlos",
    "kostenloser url verkürzer",
    "url shortener ohne registrierung",
    "url kürzen deutschland",
    "link verkürzen gratis",
    "bitly alternative deutsch",
    "dsgvo url shortener",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/link-kuerzen-ohne-anmeldung-kostenlos",
  },
  openGraph: {
    title: "Link kürzen ohne Anmeldung 2026: Kostenlose URL-Shortener",
    description: "So kürzen Sie Links in Sekundenschnelle ohne Account. Höhere Klickraten für WhatsApp, LinkedIn und E-Mails.",
    url: "https://ul0.site/blog/link-kuerzen-ohne-anmeldung-kostenlos",
    type: "article",
    images: [{ url: "https://ul0.site/ul0.png" }],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Link kürzen ohne Anmeldung 2026: Die besten kostenlosen URL-Shortener",
  description: "Praxisratgeber zum Kürzen von URLs ohne Benutzerkonto mit Fokus auf Datenschutz und DSGVO-Konformität.",
  author: { "@type": "Organization", name: "ul0" },
  publisher: {
    "@type": "Organization",
    name: "ul0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  datePublished: "2026-10-01",
  dateModified: "2026-10-03",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Ist das Linkkürzen auf ul0.site wirklich ohne Registrierung möglich?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Auf ul0.site können Sie jede URL direkt im Eingabefeld auf der Startseite einfügen und in unter einer Sekunde kürzen – ganz ohne Anmeldung oder Angabe persönlicher Daten.",
      },
    },
    {
      "@type": "Question",
      name: "Wie steht es um Datenschutz und DSGVO bei ul0?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ul0 speichert keine invasiven Tracking-Cookies und arbeitet mit datenschutzfreundlichen Analysen ohne Speicherung persönlicher IP-Adressen.",
      },
    },
    {
      "@type": "Question",
      name: "Bleiben gekürzte Links dauerhaft aktiv?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, alle Links nutzen HTTP 301 Permanent Redirects und laufen nicht ab.",
      },
    },
  ],
}

export default function LinkKuerzenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="min-h-screen bg-background py-10 px-4 sm:px-6">
        <article className="mx-auto max-w-3xl space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Zurück zum Blog
            </Link>
            <span>/</span>
            <span className="text-foreground">Ratgeber auf Deutsch</span>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              URL-Management Ratgeber 2026
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              Link kürzen ohne Anmeldung: Die besten kostenlosen URL-Shortener
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Unübersichtliche, lange Weblinks wirken unprofessionell und senken das Vertrauen von Empfängern. Erfahren Sie, wie Sie Links in 3 Sekunden kürzen, Klickraten um bis zu 34 % steigern und QR-Codes ohne Registrierung erstellen.
            </p>
          </div>

          {/* CTA Box */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span>Jetzt Link in 3 Sekunden kürzen</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fügen Sie Ihre lange URL ein und erhalten Sie sofort einen sauberen, werbefreien Kurzlink.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
            >
              Link jetzt kostenlos kürzen →
            </Link>
          </div>

          {/* Section 1 */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              1. Warum lange URLs problematisch sind
            </h2>
            <p>
              Ob Affiliate-Links, Tracking-Parameter für Google Ads oder komplexe Shop-URLs: Lange Links mit Sonderzeichen brechen in WhatsApp-Nachrichten häufig um, wirken auf Social Media wie Spam und lassen sich auf Flyern oder Visitenkarten nicht abtippen.
            </p>
            <p>
              Kurze Links mit einer klaren Struktur (z. B. <code className="font-mono text-primary font-semibold">ul0.site/r/...</code>) sehen vertrauenswürdig aus und erhöhen die Klickrate (Click-Through-Rate) signifikant.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              2. So kürzen Sie Ihren Link auf ul0.site
            </h2>
            <div className="grid gap-3 pt-2">
              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Lange URL kopieren</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kopieren Sie den gewünschten Link aus der Adresszeile Ihres Browsers.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Auf ul0.site einfügen</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fügen Sie den Link in das Hauptfeld ein und klicken Sie auf &quot;Shorten URL&quot;.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Kurzlink teilen oder QR-Code herunterladen</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ihr Link ist ab sofort weltweit mit Sub-Millisekunden-Latenz erreichbar.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              3. Datenschutz &amp; Sicherheit (DSGVO)
            </h2>
            <p>
              In Deutschland und der EU ist der Schutz von Nutzerdaten essenziell. <strong>ul0</strong> verzichtet bei Standard-Redirects auf invasive Drittanbieter-Tracker und prüft alle Ziel-URLs in Echtzeit auf Phishing und Schadsoftware.
            </p>
          </section>

          {/* Bottom CTA */}
          <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3 mt-10">
            <h3 className="text-xl font-bold text-foreground">Jetzt direkt ausprobieren</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Keine Registrierung erforderlich. 100 % kostenloser Service.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/"
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
              >
                Link jetzt kürzen
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
