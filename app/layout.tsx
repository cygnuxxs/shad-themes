import type { Metadata } from "next";
import { Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  preload : true,
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display : 'swap',
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display : 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luminaui.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shad Themes - AI Theme Generator for Shadcn/UI | Image to Design System",
    template: "%s | Shad Themes"
  },
  description: "Transform any image into beautiful, accessible design systems for shadcn/ui. Generate semantic color themes with automatic dark mode using OKLCH color space. No LCH guesswork needed.",
  keywords: [
    "shadcn ui theme generator",
    "design system generator",
    "color palette generator",
    "theme generator",
    "OKLCH color space",
    "dark mode generator",
    "image to theme",
    "semantic colors",
    "tailwind theme",
    "radix ui theme",
    "accessible design",
    "color extraction",
    "design tokens",
    "css variables generator"
  ],
  authors: [{ name: "Cygnuxxs" }],
  creator: "Cygnuxxs",
  publisher: "Shad Themes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Shad Themes",
    title: "Shad Themes - AI Theme Generator for Shadcn/UI",
    description: "Transform any image into beautiful, accessible design systems. Generate semantic color themes with automatic dark mode using OKLCH color space.",
    images: ["/og"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Shad Themes - AI Theme Generator for Shadcn/UI",
    description: "Transform any image into beautiful, accessible design systems with automatic dark mode.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@cygnuxxs",
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
  icons: {
    icon: [
      { url: '/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/icons/icon-48x48.png',
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  verification : {
    google : "5t4zBjhovVUsu3rVsR2HSiuUOu6yqVbHSusUkSFdnjY"
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Shad Themes',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    description: 'Transform any image into beautiful, accessible design systems for shadcn/ui. Generate semantic color themes with automatic dark mode using OKLCH color space.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: 'Cygnuxxs',
    },
    featureList: [
      'Intelligent Color Extraction',
      'Semantic Theme Generation',
      'Automatic Dark Mode',
      'WCAG Accessibility',
      'Real-time Preview',
      'Export to Multiple Formats',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${geistMono.variable} ${inter.variable} font-jetbrains-mono antialiased`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <div className="pt-16 px-4 max-sm:px-2">
          {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
