import "server-only";
import { prisma } from "@/lib/prisma";
import { CONTACT_PHONE } from "@/lib/content/home";
import { CONTACT_DETAILS, CONTACT_MAP_EMBED } from "@/lib/content/contact";

export type SocialLinks = {
  facebook: string;
  instagram: string;
  x: string;
  tiktok: string;
};

export type BankAccount = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export type SiteConfig = {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  socials: SocialLinks;
  bankAccounts: BankAccount[];
};

/** Static fallback so the site always renders even if the CRM config is empty. */
const FALLBACK: SiteConfig = {
  phone: CONTACT_PHONE,
  email: "hello@u2eapartments.com",
  address: CONTACT_DETAILS.items[0].value,
  mapUrl: CONTACT_MAP_EMBED,
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    x: "https://x.com",
    tiktok: "https://tiktok.com",
  },
  bankAccounts: [],
};

/**
 * Site-wide configuration read from the CRM: contact info + map (`crm.ContactInfo`,
 * singleton), social links (`crm.SocialMedia`, singleton), and bank accounts
 * (`crm.BankAccount`, non-archived). Falls back to static defaults per-field so
 * the chrome always renders.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const [contact, social, banks] = await Promise.all([
      prisma.contactInfo.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.socialMedia.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.bankAccount.findMany({
        where: { archived: false },
        orderBy: { createdAt: "asc" },
        select: { bankName: true, accountName: true, accountNumber: true },
      }),
    ]);

    return {
      phone: contact?.mobile || FALLBACK.phone,
      email: contact?.email || FALLBACK.email,
      address: contact?.address || FALLBACK.address,
      mapUrl: contact?.mapUrl || FALLBACK.mapUrl,
      socials: {
        facebook: social?.facebook || FALLBACK.socials.facebook,
        instagram: social?.instagram || FALLBACK.socials.instagram,
        x: social?.x || FALLBACK.socials.x,
        tiktok: social?.tiktok || FALLBACK.socials.tiktok,
      },
      bankAccounts: banks,
    };
  } catch (err) {
    console.error("[getSiteConfig] falling back to static config:", err);
    return FALLBACK;
  }
}
