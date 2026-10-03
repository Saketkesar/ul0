import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, ShieldCheck, Zap, Globe, QrCode, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Cómo Acortar Links Gratis en 2026: Guía Sin Registro",
  description: "Aprende cómo acortar un link gratis en 2026 paso a paso sin registro. Compara ul0, Bitly y TinyURL. Mejora tu CTR en WhatsApp, Instagram y TikTok.",
  keywords: [
    "acortar link gratis",
    "cortar link",
    "recortar link",
    "acortar links gratis",
    "acortador de enlaces gratis",
    "acortador de url gratis",
    "acortar link whatsapp",
    "acortar link sin registro",
    "cortar enlaces gratis",
    "bitly alternativa gratis",
    "como acortar un link gratis",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/acortar-link-gratis-guia-completa",
  },
  openGraph: {
    title: "Cómo Acortar Links Gratis en 2026: Guía Completa Sin Registro",
    description: "Guía definitiva para cortar y acortar enlaces largos gratis sin necesidad de cuenta. Conoce por qué los enlaces cortos aumentan hasta 34% los clics.",
    url: "https://ul0.site/blog/acortar-link-gratis-guia-completa",
    type: "article",
    images: [{ url: "https://ul0.site/ul0.png" }],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Acortar Links Gratis en 2026: Guía Completa Sin Registro",
  description: "Guía completa para acortar enlaces largos gratis, crear códigos QR y rastrear analíticas de clics sin registrarse.",
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
      name: "¿Cómo acortar un link gratis en ul0.site?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Solo debes copiar tu enlace largo, pegarlo en la barra de ul0.site en la página de inicio, y pulsar 'Shorten URL'. Obtendrás tu link corto en menos de 1 segundo sin necesidad de crear cuenta.",
      },
    },
    {
      "@type": "Question",
      name: "¿Los links acortados en ul0 caducan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Todos los enlaces generados en ul0 son permanentes y utilizan redirecciones HTTP 301 directas que funcionan de por vida.",
      },
    },
    {
      "@type": "Question",
      name: "¿Por qué es mejor acortar links para WhatsApp e Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los links largos con parámetros de rastreo y caracteres extraños se ven poco profesionales y generan desconfianza. Los links cortos aumentan la tasa de clics (CTR) hasta un 34% y lucen limpios en biografías y mensajes.",
      },
    },
  ],
}

export default function AcortarLinkGratisPage() {
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
              <ArrowLeft className="h-3 w-3" /> Volver al blog
            </Link>
            <span>/</span>
            <span className="text-foreground">Guía en Español</span>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-3 w-3" />
              Guía Oficial de Acortamiento 2026
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              Cómo Acortar Links Gratis en 2026: La Guía Definitiva Sin Registro
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ¿Tienes una URL kilométrica y necesitas cortarla para compartirla en WhatsApp, Instagram, TikTok o correos? Aprende cómo funciona un acortador de enlaces, sus ventajas de CTR y por qué <strong>ul0</strong> es la alternativa más rápida y segura frente a herramientas de pago como Bitly.
            </p>
          </div>

          {/* CTA Box */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span>¿Necesitas acortar un enlace ahora mismo?</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Puedes acortar cualquier link de YouTube, Amazon, Google Drive o WhatsApp gratis en nuestra página principal en 1 clic.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
            >
              Acortar mi link gratis ahora →
            </Link>
          </div>

          {/* Section 1 */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              1. ¿Qué significa cortar o acortar un link?
            </h2>
            <p>
              Acortar un link (también conocido popularmente como <em>cortar link</em> o <em>recortar link</em>) es el proceso mediante el cual una dirección web extensa y compleja —por ejemplo, un enlace de producto de Amazon con 150 caracteres y parámetros de afiliados— se convierte en una dirección compacta y legible como <code className="text-primary font-mono font-bold bg-muted px-1.5 py-0.5 rounded">ul0.site/r/xyz</code>.
            </p>
            <p>
              Técnicamente, este proceso funciona mediante una redirección estándar <strong>HTTP 301 Permanente</strong>. Cuando una persona hace clic en el enlace corto, los servidores en el borde (edge) de <strong>ul0</strong> resuelven la URL de destino en menos de 10 milisegundos y redirigen al visitante de forma invisible y segura.
            </p>
          </section>

          {/* Section 2: Step-by-Step */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              2. Cómo acortar un link gratis paso a paso (Sin cuenta ni registro)
            </h2>
            <p>
              A diferencia de plataformas antiguas que te obligan a crear una cuenta y verificar tu correo, en <strong>ul0.site</strong> el proceso requiere únicamente 3 pasos:
            </p>

            <div className="grid gap-3 pt-2">
              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Copia tu enlace original</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Copia la URL larga que deseas compartir (desde tu navegador, aplicación o archivo).
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Pégalo en ul0.site y pulsa &quot;Shorten URL&quot;</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Entra a la página de inicio de ul0.site, pega el enlace y haz clic en el botón.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Copia tu nuevo link corto o descarga el QR</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ¡Listo! Tu enlace corto está activo al instante. Puedes copiarlo o generar un código QR vectorial listo para imprimir.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Comparison Table */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              3. Comparativa: ul0 vs. Bitly vs. TinyURL
            </h2>
            <p>
              Muchos usuarios buscan alternativas gratuitas porque servicios tradicionales como Bitly han restringido severamente sus planes gratuitos a un puñado de links por mes.
            </p>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Característica</th>
                    <th className="p-3 text-primary">ul0.site</th>
                    <th className="p-3">Bitly (Free)</th>
                    <th className="p-3">TinyURL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="p-3 font-medium text-foreground">Límite de links gratis</td>
                    <td className="p-3 font-bold text-emerald-600">Ilimitados</td>
                    <td className="p-3">10 / mes</td>
                    <td className="p-3">Básico</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">¿Requiere registro?</td>
                    <td className="p-3 font-bold text-emerald-600">No (Instantáneo)</td>
                    <td className="p-3 text-rose-500">Sí obligatorio</td>
                    <td className="p-3">No</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Dominio personalizado gratis</td>
                    <td className="p-3 font-bold text-emerald-600">1 Dominio Gratis</td>
                    <td className="p-3 text-rose-500">$35/mes</td>
                    <td className="p-3 text-rose-500">$12.99/mes</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Códigos QR vectoriales</td>
                    <td className="p-3 font-bold text-emerald-600">Incluido</td>
                    <td className="p-3 text-rose-500">Limitado</td>
                    <td className="p-3">Básico</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Herramientas extras (Split, PDF)</td>
                    <td className="p-3 font-bold text-emerald-600">Incluidas 100%</td>
                    <td className="p-3 text-rose-500">Ninguna</td>
                    <td className="p-3 text-rose-500">Ninguna</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Security */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              4. Seguridad y protección contra fraudes
            </h2>
            <p>
              Uno de los mayores temores al utilizar enlaces cortos es que oculten sitios de phishing o descargas de malware. En <strong>ul0</strong>, todos los destinos son examinados contra bases de datos globales de amenazas en tiempo real.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-foreground">Radar de Amenazas Activo</span>
                <p>
                  Si un enlace de destino es reportado como fraudulento o sospechoso, es bloqueado de inmediato para proteger tanto a tu marca como a tus visitantes.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground">Preguntas Frecuentes (FAQ)</h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  ¿Es realmente gratis acortar links en ul0?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sí, el servicio básico de acortamiento, generación de códigos QR y redirecciones 301 es y será 100% gratuito. No hay costos ocultos ni tarjetas de crédito requeridas.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  ¿Cómo puedo conectar mi propio dominio personalizado?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Puedes registrarte gratis y conectar tu subdominio (como <code className="font-mono">link.tuempresa.com</code>) agregando un registro DNS CNAME apuntando a ul0. ¡Ofrecemos 1 dominio gratis para cada usuario!
                </p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  ¿Puedo dividir gastos o usar otras herramientas en ul0?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sí. Además del acortador, en la navegación superior puedes acceder a nuestro <strong>Split Expenses</strong> (divisor de cuentas con código UPI), <strong>PDF Page Splitter</strong> (para extraer hojas de un PDF) y verificadores de redirección.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3 mt-10">
            <h3 className="text-xl font-bold text-foreground">Comienza a acortar tus links ahora</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Únete a miles de creadores de contenido, agencias y emprendedores en todo el mundo hispanohablante.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/"
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
              >
                Acortar link gratis
              </Link>
              <Link
                href="/split"
                className="rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-bold text-foreground hover:bg-accent transition-all"
              >
                Probar Split Expenses
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
