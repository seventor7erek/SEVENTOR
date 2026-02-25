import type { Metadata, Viewport } from "next"
import { Playfair_Display, Cormorant_Garamond, Outfit } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "SEVENTOR | AI Concierge",
  description:
    "World-class luxury entertainment and events in Dubai. Speak to our AI Concierge to craft extraordinary experiences.",
}

export const viewport: Viewport = {
  themeColor: "#040F0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${outfit.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
