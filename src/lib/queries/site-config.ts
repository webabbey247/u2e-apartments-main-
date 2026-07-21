import "server-only";
import { prisma } from "@/lib/prisma";
import { CONTACT_PHONE } from "@/lib/content/home";
import { CONTACT_DETAILS, CONTACT_MAP_EMBED } from "@/lib/content/contact";
import { SOCIAL, type SocialSource } from "@/lib/content/home";

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

/** A card in the home-page social marquee. */
export type SocialPost = {
  key: string;
  src: string;
  source: SocialSource;
  caption: string;
  /** Deep link to the post itself; null → fall back to the profile link. */
  postUrl: string | null;
};

export type SiteConfig = {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  socials: SocialLinks;
  bankAccounts: BankAccount[];
  socialPosts: SocialPost[];
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
  socialPosts: SOCIAL.posts.map((p, i) => ({
    key: `static-${i}`,
    src: p.src,
    source: p.source,
    caption: "U2E Apartments",
    postUrl: null,
  })),
};

/**
 * Site-wide configuration read from the CRM: contact info + map (`crm.ContactInfo`,
 * singleton), social links (`crm.SocialMedia`, singleton), and bank accounts
 * (`crm.BankAccount`, non-archived), and the social marquee feed (`crm.SocialPost`,
 * active, capped at 10). Falls back to static defaults per-field so the chrome
 * always renders.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const [contact, social, banks, posts] = await Promise.all([
      prisma.contactInfo.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.socialMedia.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.bankAccount.findMany({
        where: { archived: false },
        orderBy: { createdAt: "asc" },
        select: { bankName: true, accountName: true, accountNumber: true },
      }),
      prisma.socialPost.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 10,
        select: { id: true, source: true, image: true, caption: true, postUrl: true },
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
      socialPosts:
        posts.length > 0
          ? posts.map((p) => ({
              key: p.id,
              src: p.image,
              source: p.source === "TIKTOK" ? ("tiktok" as const) : ("instagram" as const),
              caption: p.caption,
              postUrl: p.postUrl,
            }))
          : FALLBACK.socialPosts,
    };
  } catch (err) {
    console.error("[getSiteConfig] falling back to static config:", err);
    return FALLBACK;
  }
}
