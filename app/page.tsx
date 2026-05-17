import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IPL 2026 Playoff Predictor',
  description:
    'Explore every IPL playoff qualification scenario.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
