"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "@/lib/queries/site-config";

const SiteConfigContext = createContext<SiteConfig | null>(null);

/**
 * Holds the CRM site configuration (contact, socials, bank accounts, map) in
 * client state, hydrated from server-fetched data in the root layout. Consume
 * via `useSiteConfig()` from any client component (Navbar, Footer, Contact…).
 */
export function SiteConfigProvider({
  value,
  children,
}: {
  value: SiteConfig;
  children: React.ReactNode;
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig(): SiteConfig {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return ctx;
}
