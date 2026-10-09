import type { Metadata } from "next";
import { Orbitron, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { readResume } from "@/lib/resume";
import BackgroundDots from "@/components/BackgroundDots";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const { frontmatter, about } = readResume();
  return {
    title: frontmatter.name
      ? `${frontmatter.name} | ${frontmatter.role}`
      : "Portfolio",
    description: about || frontmatter.tagline || "Personal portfolio",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="antialiased">
        <BackgroundDots />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
