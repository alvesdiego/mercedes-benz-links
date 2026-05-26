import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Mercedes-Benz Links',
    template: '%s | Mercedes-Benz Links',
  },
  description: 'Cartões virtuais dos colaboradores Mercedes-Benz.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
