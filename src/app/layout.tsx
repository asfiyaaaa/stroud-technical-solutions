import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://stroudtechnicalsolutions.com'),
  title: {
    default: 'Stroud Technical Solutions | Pharma & Life Sciences Engineering',
    template: '%s | Stroud Technical Solutions',
  },
  description:
    'Engineering and technical consulting services for pharmaceutical, life sciences, and biotech industries. Specializing in automation, validation, quality engineering, and regulatory compliance.',
  keywords: [
    'pharmaceutical consulting',
    'life sciences engineering',
    'biotech consulting',
    'process validation',
    'cleaning validation',
    'automation engineering',
    'quality engineering',
    'cGMP compliance',
    'pharmaceutical manufacturing',
    'metrology',
    'instrumentation',
    'CAPA',
    'FDA compliance',
  ],
  authors: [{ name: 'Stroud Technical Solutions LLC' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Stroud Technical Solutions',
    title: 'Stroud Technical Solutions | Pharma & Life Sciences Engineering',
    description:
      'Engineering and technical consulting services for pharmaceutical, life sciences, and biotech industries.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stroud Technical Solutions',
    description:
      'Engineering and technical consulting for pharma, life sciences, and biotech.',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
