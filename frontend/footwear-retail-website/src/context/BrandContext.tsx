import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
} from "react";
import type { TenantConfig } from "../config/tenants";
import { resolveTenant } from "../config/tenants";

const BrandContext = createContext<TenantConfig | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const tenant = useMemo(() => resolveTenant(), []);

  useEffect(() => {
    document.title = tenant.brandName;

    let link = document.querySelector(
      'link[rel="icon"]',
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = tenant.faviconUrl;
  }, [tenant]);

  return (
    <BrandContext.Provider value={tenant}>{children}</BrandContext.Provider>
  );
}

export function useBrand(): TenantConfig {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return ctx;
}
