import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Be_Vietnam_Pro, Literata } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Toaster } from 'sonner'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CartProvider } from '@/components/cart/CartProvider'
import { getCart } from '@/lib/data/cart'

const bodyFont = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

const headingFont = Literata({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const cart = await getCart()
  const cartCount = cart.filter((item) => item.farmId).length

  return (
    <html
      className={cn(bodyFont.variable, headingFont.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <CartProvider initialCount={cartCount}>
            <Header />
            {children}
            <Toaster richColors />
          </CartProvider>
        </Providers>
        <Footer />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
