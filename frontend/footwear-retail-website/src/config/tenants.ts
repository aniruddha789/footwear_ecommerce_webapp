export type TenantSocialLinks = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
};

export type TenantConfig = {
  id: string;
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  searchPlaceholder: string;
  tagline: string;
  contactEmail: string;
  /** Shown in footer contact block */
  phoneFooter: string;
  /** Shown on Contact Us page (can list multiple numbers) */
  phoneContactLine: string;
  /** Single line for footer and contact page address */
  addressLine: string;
  social: TenantSocialLinks;
  legalEntityName: string;
  publicDomain: string;
  /** Lead copy on the About Us page */
  aboutLead: string;
};

const myurbankicks: TenantConfig = {
  id: "myurbankicks",
  brandName: "Urban Kicks",
  logoUrl: "/brands/myurbankicks/logo.png",
  faviconUrl: "/brands/myurbankicks/favicon.png",
  searchPlaceholder: "Search on Urban Kicks",
  tagline:
    "Step into style with Urban Kicks - your destination for premium footwear and apparel.",
  contactEmail: "info@myurbankicks.in",
  phoneFooter: "+91 7721906862",
  phoneContactLine: "7721906862 | 8308633021",
  addressLine: "Shivaji Commercial Complex, Amravati, MH - 444601",
  social: {
    instagram: "https://instagram.com/urban_kicks_amt",
    facebook: "https://www.facebook.com/profile.php?id=61557063887144",
    twitter: "https://x.com/MyUrbanKicks",
  },
  legalEntityName: "URBAN KICKS",
  publicDomain: "myurbankicks.in",
  aboutLead:
    "Urban Kicks incorporated in 2023 is a fashion brand where you get latest of the trends, be it footwear, clothing or accessories.",
};

const dripshop: TenantConfig = {
  id: "dripshop",
  brandName: "Drip Shop",
  logoUrl: "/brands/dripshop/logo.png",
  faviconUrl: "/brands/dripshop/favicon.png",
  searchPlaceholder: "Search on Drip Shop",
  tagline:
    "The ultimate destination for streetwear, sneakers, and accessories.",
  contactEmail: "contact@dripshop.in",
  phoneFooter: "+91 8766628629",
  phoneContactLine: "8766628629 | 7721906862",
  addressLine: "Radha Nagar, Lane 5, Near City Centre, Gadge Nagar, Amravati, MH - 444601",
  social: {
    instagram: "https://instagram.com/dripshop_in",
    facebook: "https://www.facebook.com/dripshop_in",
    twitter: "https://x.com/dripshop_in",
  },
  legalEntityName: "DRIP SHOP",
  publicDomain: "dripshop.in",
  aboutLead:
    "Drip Shop incorporated in 2023 is a fashion brand where you get latest of the trends, be it footwear, clothing or accessories.",
};

export const TENANTS: Record<string, TenantConfig> = {
  myurbankicks,
  dripshop,
};

/** Hostname (lowercase, no www) → tenant id */
export const TENANT_BY_HOST: Record<string, keyof typeof TENANTS> = {
  "myurbankicks.in": "myurbankicks",
  "dripshop.in": "dripshop",
};

export const DEFAULT_TENANT_ID: keyof typeof TENANTS = "dripshop";

export function normalizeHostname(hostname: string): string {
  const h = hostname.trim().toLowerCase();
  return h.startsWith("www.") ? h.slice(4) : h;
}

export function resolveTenant(): TenantConfig {
  const devTenant = import.meta.env.VITE_DEV_TENANT;
  if (import.meta.env.DEV && devTenant && TENANTS[devTenant]) {
    return TENANTS[devTenant];
  }

  if (typeof window === "undefined") {
    return TENANTS[DEFAULT_TENANT_ID];
  }

  const host = normalizeHostname(window.location.hostname);
  if (host === "localhost" || host === "127.0.0.1") {
    return TENANTS[DEFAULT_TENANT_ID];
  }

  const id = TENANT_BY_HOST[host];
  if (!id) {
    console.warn(
      `[tenant] Unknown host "${host}", using default tenant "${DEFAULT_TENANT_ID}"`,
    );
    return TENANTS[DEFAULT_TENANT_ID];
  }
  return TENANTS[id];
}
