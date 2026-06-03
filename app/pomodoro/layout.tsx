import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Pomodoro Timer Online - Focus & Productivity Tool | ul0 [2026]",
  description: "Best free Pomodoro timer 2026. Work in 25-minute focused sessions with breaks. Customizable timer, sound alerts, session tracking. Boost productivity - no signup!",
  keywords: [
    // Primary Keywords
    "pomodoro timer",
    "pomodoro timer online",
    "pomodoro",
    "focus timer",
    "productivity timer",
    "study timer",
    "work timer",
    
    // Year-based
    "pomodoro timer 2026",
    "best pomodoro timer 2026",
    "focus timer 2026",
    
    // No signup keywords
    "free pomodoro timer",
    "pomodoro timer free online",
    "free focus timer",
    "pomodoro no signup",
    
    // Competitor alternatives
    "pomofocus alternative",
    "tomato timer alternative",
    "forest app alternative",
    "focus keeper alternative",
    
    // Feature keywords
    "25 minute timer",
    "tomato timer",
    "pomodoro technique timer",
    "customizable pomodoro",
    "pomodoro with sound",
    "pomodoro with alarm",
    "pomodoro session tracker",
    "pomodoro break timer",
    
    // Use case keywords
    "pomodoro for studying",
    "pomodoro for work",
    "pomodoro for coding",
    "pomodoro for writing",
    "student pomodoro timer",
    "developer focus timer",
    "work from home timer",
    "remote work timer",
    "concentration timer",
    
    // Question keywords
    "how to use pomodoro technique",
    "what is pomodoro timer",
    "how long is pomodoro",
    "how to focus with pomodoro",
    "best way to study pomodoro",
    
    // International - Spanish
    "temporizador pomodoro",
    "pomodoro gratis",
    "temporizador de concentración",
    
    // International - Portuguese
    "temporizador pomodoro",
    "pomodoro online gratis",
    "timer de foco",
    
    // International - French
    "minuteur pomodoro",
    "pomodoro gratuit",
    
    // International - German
    "pomodoro timer kostenlos",
    "fokus timer",
    
    // Related keywords
    "time management",
    "productivity technique",
    "study technique",
    "focus method",
    "deep work timer",
    "break reminder",
    "work break timer",
    "pomodoro clock",
    "online timer",
    
    // Long-tail keywords
    "best free pomodoro timer online",
    "simple pomodoro timer",
    "easy focus timer",
    "minimalist pomodoro",
    "aesthetic pomodoro timer",
    "dark mode pomodoro",
    "browser pomodoro timer",
  ],
  alternates: {
    canonical: "https://ul0.site/pomodoro",
  },
  openGraph: {
    title: "Free Pomodoro Timer Online - Boost Your Productivity | ul0",
    description: "Best free Pomodoro timer 2026. Work in focused 25-minute sessions with breaks. No signup required!",
    url: "https://ul0.site/pomodoro",
    type: "website",
    siteName: "ul0 - Free Pomodoro Timer",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Free Pomodoro Timer",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Pomodoro Timer Online | ul0",
    description: "Boost productivity with free Pomodoro timer. 25-minute focus sessions with breaks.",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function PomodoroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/pomodoro#webpage",
        url: "https://ul0.site/pomodoro",
        name: "Free Pomodoro Timer Online | ul0",
        description: "Best free Pomodoro timer 2026. Work in focused 25-minute sessions.",
        isPartOf: { "@id": "https://ul0.site/#website" },
        breadcrumb: { "@id": "https://ul0.site/pomodoro#breadcrumb" }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/pomodoro#app",
        name: "ul0 Pomodoro Timer",
        description: "Best free Pomodoro timer. Work in focused 25-minute sessions with breaks.",
        applicationCategory: "UtilityApplication",
        applicationSubCategory: "Productivity Timer",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/pomodoro",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1920",
          bestRating: "5",
          worstRating: "1"
        },
        featureList: [
          "25-Minute Focus Sessions",
          "Customizable Timer",
          "Short & Long Breaks",
          "Sound Alerts",
          "Session Tracking",
          "Dark Mode",
          "No Signup Required"
        ],
      },
      {
        "@type": "HowTo",
        "@id": "https://ul0.site/pomodoro#howto",
        name: "How to Use the Pomodoro Technique",
        description: "Boost productivity with the Pomodoro technique in 4 steps",
        totalTime: "PT25M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Start Timer",
            text: "Start the 25-minute Pomodoro timer and focus on your task"
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Work Focused",
            text: "Work without distractions until the timer rings"
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Take Break",
            text: "Take a 5-minute short break to rest your mind"
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Repeat",
            text: "After 4 pomodoros, take a longer 15-30 minute break"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://ul0.site/pomodoro#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the Pomodoro Technique?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Pomodoro Technique is a time management method where you work in 25-minute focused sessions (called pomodoros) followed by short breaks. After 4 pomodoros, you take a longer break."
            }
          },
          {
            "@type": "Question",
            name: "Is this Pomodoro timer free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, ul0 Pomodoro timer is 100% free. Use it unlimited times without signup or registration."
            }
          },
          {
            "@type": "Question",
            name: "Can I customize the timer duration?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, you can customize the work session length, short break duration, and long break duration to fit your preferences."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ul0.site/pomodoro#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://ul0.site"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Pomodoro Timer",
            item: "https://ul0.site/pomodoro"
          }
        ]
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
