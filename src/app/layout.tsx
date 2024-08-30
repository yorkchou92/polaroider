import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { ReactNode } from 'react'

import '../../node_modules/cropperjs/dist/cropper.css'

import './globals.css'

const roboto = Roboto({ subsets: ['latin'], weight: ['500', '700', '900'] })

export const metadata: Metadata = {
  title: 'P.OLARO.ID',
  description: 'A simple app to create Polaroid photos.',
  openGraph: {
    siteName: 'P.OLARO.ID',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://P.OLARO.ID',
    images: [
      {
        url: 'https://p.olaro.id/og-image.png',
        width: 1080,
        height: 540,
        alt: 'Polaroider',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
    <body className={roboto.className}>{children}</body>
    </html>
  )
}
