import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Arturo | AI & Marketing Expert',
  description: 'Portfolio de Arturo Martínez - AI & Marketing Expert',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={manrope.variable}>{children}</body>
    </html>
  )
}

