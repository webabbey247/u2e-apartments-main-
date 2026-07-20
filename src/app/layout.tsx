import type { Metadata } from "next";
import { Cinzel, Lato, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteConfig } from "@/lib/queries/site-config";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "U2E Apartments",
  description:
    "Serviced apartments, in-house dining, curated experiences, and event spaces — book your stay.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const siteConfig = await getSiteConfig();
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${lato.variable} ${montserrat.variable}`}
    >
      <body>
        <Providers siteConfig={siteConfig}>{children}</Providers>
      </body>
    </html>
  );
}
