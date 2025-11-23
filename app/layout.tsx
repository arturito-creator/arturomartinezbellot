import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import AnalyticsWrapper from '@/components/AnalyticsWrapper'
import CookieBanner from '@/components/CookieBanner'
import { CookieConsentProvider } from '@/contexts/CookieConsentContext'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arturomartinezbellot.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Arturo Martínez | AI & Marketing Expert | Consultoría Estratégica',
    template: '%s | Arturo Martínez',
  },
  description: 'Consultoría estratégica en AI Marketing, Growth y Transformación Digital. 10+ años impulsando growth y activaciones tecnológicas para marcas y startups. Expert en AI aplicada a negocio.',
  keywords: [
    'AI Marketing',
    'Marketing con Inteligencia Artificial',
    'Consultoría AI',
    'Growth Marketing',
    'Transformación Digital',
    'AI Strategy',
    'Marketing Automation',
    'The AI Lab',
    'Arturo Martínez',
    'Consultor Marketing',
    'AI Consultant',
    'Digital Marketing Expert',
    'Marketing Strategy',
    'AI para Negocios',
    'Computer Vision Retail',
    'Growth Hacking',
    'Marketing Tech',
  ],
  authors: [{ name: 'Arturo Martínez' }],
  creator: 'Arturo Martínez',
  publisher: 'Arturo Martínez',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
    url: siteUrl,
    siteName: 'Arturo Martínez - AI & Marketing Expert',
    title: 'Arturo Martínez | AI & Marketing Expert | Consultoría Estratégica',
    description: 'Consultoría estratégica en AI Marketing, Growth y Transformación Digital. 10+ años impulsando growth y activaciones tecnológicas para marcas y startups.',
    images: [
      {
        url: `${siteUrl}/Who_Arturo.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Arturo Martínez - AI & Marketing Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arturo Martínez | AI & Marketing Expert',
    description: 'Consultoría estratégica en AI Marketing, Growth y Transformación Digital. 10+ años de experiencia.',
    images: [`${siteUrl}/Who_Arturo.jpeg`],
    creator: '@arturo_martinez',
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
  alternates: {
    canonical: siteUrl,
    languages: {
      'es-ES': siteUrl,
      'en-US': `${siteUrl}?lang=en`,
    },
  },
  category: 'Marketing & Technology',
  classification: 'Portfolio & Professional Services',
  other: {
    'theme-color': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" itemScope itemType="https://schema.org/Person">
      <body className={manrope.variable}>
        <CookieConsentProvider>
          <StructuredData />
          <AnalyticsWrapper 
            gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-0T8YYKHSZV'} 
            hjid={process.env.NEXT_PUBLIC_HOTJAR_ID || 6583508} 
          />
          {children}
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  )
}

