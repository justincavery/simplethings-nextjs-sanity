import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { absoluteUrl, site } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s | ${site.title}`,
    default: site.title,
  },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    images: [
      {
        url: absoluteUrl("/og/simplethings.svg"),
        width: 1200,
        height: 630,
        alt: "Simple Things Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [absoluteUrl("/og/simplethings.svg")],
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <meta name="apple-mobile-web-app-title" content="Simple Things" />
      <body>
        <section className="min-h-screen pt-24">
          <Header />
          <main className="">{children}</main>
          <Footer />
        </section>
      </body>
    </html>
  );
}
