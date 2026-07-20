"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { NavigationRefresh } from "@/components/providers/navigation-refresh";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import type { SiteConfig } from "@/lib/queries/site-config";

export function Providers({
  siteConfig,
  children,
}: {
  siteConfig: SiteConfig;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SiteConfigProvider value={siteConfig}>
        <LenisProvider>
          <NavigationRefresh />
          {children}
        </LenisProvider>
      </SiteConfigProvider>
    </QueryClientProvider>
  );
}
