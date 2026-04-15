import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://psychologue-kinshasa.vercel.app"
  ),
  title: {
    default: "CRIPS Kinshasa | Psychologue et accompagnement psychologique",
    template: "%s | CRIPS Kinshasa",
  },
  description:
    "CRIPS Kinshasa accompagne enfants, adolescents, adultes, couples et familles: psychologue clinicien, thérapie, évaluation psychologique et suivi personnalisé à Kinshasa.",
  applicationName: "CRIPS Kinshasa",
  category: "Santé mentale",
  keywords: [
    "psychologue kinshasa",
    "centre de psychologie kinshasa",
    "thérapie kinshasa",
    "santé mentale kinshasa",
    "consultation psychologique kinshasa",
    "thérapie de couple kinshasa",
    "thérapie familiale kinshasa",
    "refus scolaire kinshasa",
    "attestation psychologique kinshasa",
    "CRIPS kinshasa",
    "psychologue rdc",
  ],
  authors: [{ name: "CRIPS Kinshasa" }],
  creator: "CRIPS Kinshasa",
  publisher: "CRIPS Kinshasa",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CRIPS Kinshasa | Psychologue et accompagnement psychologique",
    description:
      "Centre de recherche et d'interventions psychologiques et sociales à Kinshasa: consultations, thérapie individuelle, couple et famille.",
    url: "/",
    siteName: "CRIPS Kinshasa",
    locale: "fr_CD",
    type: "website",
    images: [
      {
        url: "/logo-crips.png",
        width: 512,
        height: 512,
        alt: "Logo CRIPS Kinshasa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRIPS Kinshasa | Psychologue et accompagnement psychologique",
    description:
      "Consultations psychologiques à Kinshasa: suivi clinique, thérapie de couple, accompagnement familial et bien-être mental.",
    images: ["/logo-crips.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
