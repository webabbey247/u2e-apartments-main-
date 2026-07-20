# U2E Apartments (Guest-Facing App) — Implementation Checklist

Derived from `CLAUDE.md`. Greenfield build. Grouped by phase; each item is a discrete, verifiable unit of work.
Legend: `[ ]` todo · `[~]` in progress · `[x]` done · ⏳ blocked/awaiting input.

> **Home landing page** is ported from `index.html` (Oceanfye/Michelin Webflow export — GSAP 3.15 +
> ScrollTrigger/SplitText/CustomEase/Flip, Lenis smooth scroll). It must be re-themed to our design tokens/fonts
> with **every animation and transition reproduced exactly**, each section a separately exported component — see **Phase 2A**.

---

## Phase 0 — Project scaffold & tooling

- [x] Next.js **16.2.9** (Turbopack), App Router, TypeScript **strict**, Tailwind
- [x] `tailwind.config.ts` design tokens (per CLAUDE.md — reference tokens, never hard-code hex/fonts):
  - [x] Colors: `brand #C81E2A`, `ink #1E1F22`, `paper #FFFFFF`, `mist/mist2/mist3`, `gold #D4AF37`
  - [x] Fonts: `cinzel` (display/heading), `lato`, `montserrat` — loaded via `next/font`
  - [x] `transitionTimingFunction.brand` = `cubic-bezier(0.16,1,0.3,1)` for CTA/hover/nav
- [x] `tsconfig.json` strict mode, path alias `@/*` → `src/*`
- [x] Prisma **v7** installed; `prisma-client` generator → `src/generated/prisma`; `prisma.config.ts` (driver-adapter, url out of schema)
- [x] `lib/prisma.ts` — client singleton (via `@prisma/adapter-pg`)
- [x] React Query provider (`app/providers.tsx`) — *(Zustand base added per-store in later phases)*
- [x] `.env.example` — DB URL, Paystack pub/secret, email/SMTP, file-storage keys
- [x] Root `app/layout.tsx` + `globals.css`; **`next build` + TypeScript pass clean**

## Phase 1 — Data model & validation

- [ ] `prisma/schema.prisma` — all core entities:
  - [ ] `User`, `Unit`, `UnitPhoto`, `MenuItem`, `ExperienceService`
  - [ ] `EventSpace`, `EventEnquiry`, `GalleryImage`, `Offer`
  - [ ] `Booking`, `BookingDocument`, `Payment`, `ContactMessage`
- [ ] Enums: booking status (pending / awaiting-payment / confirmed / rejected / cancelled), payment method (card | bank_transfer), payment status
- [ ] First migration applied (`prisma migrate dev`) against Postgres
- [ ] `src/schemas/` — Zod schemas mirroring each entity (create/update inputs)
- [ ] `src/types/` — `z.infer` types re-exported; no hand-duplicated types

## Phase 2 — Shared layout & navigation

- [x] Marriott-style sticky top bar (`layout/navbar.tsx`): logo left, nav row, scroll show/hide + solid-on-scroll
- [x] Active-link underline/accent treatment (`brand` accent, `ease-brand` transition)
- [x] Persistent **"Book a Stay"** pill CTA (far right, `bg-brand`) → `/accommodation`
- [x] Phone shown near CTA on desktop
- [x] Mobile drawer nav; footer (`layout/footer.tsx`) with CTA band + link columns
- [~] `components/ui/` primitives: `BrandButton`, `RevealHeading` done; Input/Card/Modal/Badge pending
- [ ] ⏳ **Confirm final nav structure** — do Bookings/Contact stay as nav items? (open decision)

## Phase 2A — Landing page port (from Webflow `index.html`)

Port the Oceanfye/Michelin Webflow export into React (App Router) components. **Non-negotiable:** re-theme to our
design tokens/fonts, and reproduce **every animation and transition exactly** (same timings, easings, stagger,
scroll behavior). Each section is its own strictly-typed, individually **exported** component in `components/home/`.

**Animation infrastructure (foundation — do first):**
- [x] Add libs: `gsap` **3.15.0** (+ `ScrollTrigger`, `SplitText`, `CustomEase`, `Flip`) and `lenis` **1.3.17**
- [x] `lib/animation/gsap.ts` — GSAP plugin registration (client-only), `brand`/`brandOut` `CustomEase` curves, `TIMING` constants
- [x] `LenisProvider` (client) — smooth scroll wired into `ScrollTrigger.update` + `gsap.ticker`
- [x] Reusable hooks (`hooks/use-animations.ts`): `useSplitTextStagger`, `useParallax`, `useImageScale`, `useMoveY`
- [x] **No** jQuery / Webflow runtime / WebFont-Inter loader — clean React + `next/font` (Cinzel/Lato/Montserrat)
- [x] Respect `prefers-reduced-motion` (hooks + Lenis + preloader settle/skip)

**Re-theme (apply tokens, drop template palette/fonts):**
- [x] Inter → `cinzel`/`lato`/`montserrat`; heading vs body mapped per section
- [x] Template colors → `brand / ink / paper / mist* / gold`; CTAs use `bg-brand` + `ease-brand`
- [~] Images point at template CDN as **documented placeholders** (`lib/content/home.ts`); swap for final U2E assets later

**Section components (each exported, exact animation preserved):**
- [x] `Preloader` (`home/preloader.tsx`) — letter stagger + panel wipe, then unlock scroll
- [x] `Navbar` (`layout/navbar.tsx`) — sticky, `Book a Stay`, scroll show/hide + mobile drawer
- [x] `Hero` (`home/hero.tsx`) — overlay, `title-stagger` + `move-y` entrance, bg image-scale
- [x] `Marquee` (`home/marquee.tsx`) — continuous seamless loop, pause-on-hover
- [x] `About` (`home/about.tsx`) — forward/reverse parallax image columns
- [x] `Amenities` (`home/amenities.tsx`) — image-scale tiles with overlaid labels
- [x] `RoomsSlider` (`home/rooms-slider.tsx`) — card slider, arrows/dots, cross-fade + scale
- [x] `Quote` (`home/quote.tsx`) — stagger heading band
- [x] `Wellness` (`home/wellness.tsx`) — split layout, image-scale reveal (yoga)
- [x] `Experiences` (`home/experiences.tsx`) — seasonal cards, image-scale + hover
- [x] `Events` (`home/events.tsx`) — personalized-event cards, hover reveal
- [x] `Journal` (`home/journal.tsx`) — blog cards, scroll-in image-scale
- [x] `Gallery` (`home/gallery.tsx`) — asymmetric grid, image-scale + hover zoom
- [x] `Footer` (`layout/footer.tsx`) — CTA band + link columns with hover transitions
- [x] `InstagramMarquee` (`home/instagram.tsx`) — hover-overlay feed strip, `marquee-track` loop, pause-on-hover
- [x] `Faq` (`home/faq.tsx`) — single-open accordion, grid-rows answer transition + `+`→`×` arrow rotate
- [x] Composed into `app/(public)/page.tsx` (Home) in template order
- [x] `RevealHeading` primitive wraps `SplitText` stagger for all section headings

**Verify:** `next build` + TypeScript clean; dev server renders **HTTP 200** with all sections in server HTML, no runtime errors.
- [ ] ⏳ Remaining: **visual side-by-side in a browser** (entrance staggers, parallax, slider, marquee timing feel) — needs a manual run.

## Phase 2B — Accommodation page port (from Webflow `room.html`)

Same template family, same GSAP/Lenis stack — **reuses the Phase 2A animation infrastructure** (hooks, `LenisProvider`,
`RevealHeading`) and shared chrome (`Navbar`, `Footer`). Re-theme to our tokens/fonts; reproduce **every animation and
transition exactly**; each section a separately **exported** component. Route: `app/(public)/accommodation/page.tsx`.
Copy adapted to U2E (single-location serviced apartments — "Suites & Villas" → unit types).

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, all animation hooks reused as-is
- [x] `Faq` + `Wellness` refactored to accept `content` props → reused with accommodation copy
- [x] Content/assets centralized in `lib/content/accommodation.ts` (template CDN images as documented placeholders)

**New section components (each exported, exact animation preserved):**
- [x] `AccommodationHero` (`accommodation/accommodation-hero.tsx`) — big image + `title-stagger` heading, `image-scale` + `move-y`
- [x] `SuitesListing` (`accommodation/suites-listing.tsx`) — "All Suites" alternating rows (image, name, blurb, **View Room** → `[unitSlug]`), `images-scale` + `move-y`
- [x] `ReasonsToStay` (`accommodation/reasons-to-stay.tsx`) — numbered reasons list + parallax feature image + **Book Now** CTA
- [x] `ResidencesGrid` (`accommodation/residences-grid.tsx`) — "All Residences" cards with specs (beds / baths / sq ft) + **View more**, `images-scale`
- [x] `Wellness` (reused, `content={ACC_WELLNESS}`) — `section_global_yoga`
- [x] `Faq` (reused, `content={ACC_FAQ}`) — accommodation Q&A (check-in, cancellation, servicing), `section_global_faq`
- [x] Composed into `app/(public)/accommodation/page.tsx` in template order

**Wire-up (deferred to data phases, stubbed now):**
- [x] `View Room` / `View more` link to `/accommodation/[unitSlug]` (target page built in Phase 3)
- [ ] Replace static listing with `GET /api/units` data once Phase 1 model + Phase 3 API exist

**Verify:** `next build` + TypeScript clean; `/accommodation` renders **HTTP 200** with all 6 sections, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs `room.html`.

## Phase 2C — Unit-detail page port (from Webflow `suites.html`)

Single unit-detail view. Same template family / GSAP+Lenis stack — **reuses Phase 2A/2B infra + chrome**. Re-theme to our
tokens/fonts; reproduce **every animation and transition exactly**; each section a separately **exported** component.
Dynamic route: `app/(public)/accommodation/[unitSlug]/page.tsx` with `generateStaticParams` from the suite/residence slugs.
Copy adapted to U2E. Makes the **View Room** links from Phase 2B resolve.

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Wellness` (`content={ACC_WELLNESS}`), `SuitesListing` (related "All Suites"), `InstagramMarquee` (`section_instagram_slider`)
- [x] Content/assets in `lib/content/units.ts`, keyed by slug (template CDN images as documented placeholders)

**New section components (each exported, exact animation preserved):**
- [x] `UnitHero` (`units/unit-hero.tsx`) — breadcrumb + `title-stagger` title, **then full-width room image with specs overlay** (beds / baths / size / from-price), `image-scale`
- [x] `RoomDetailsInfo` (`units/room-details-info.tsx`) — 2-col "The Details" + highlight blocks, `move-y` (specs/title live on hero, no duplication)
- [x] `AmenitiesChecklist` (`units/amenities-checklist.tsx`) — **centered heading + subtitle** over a 4-column amenity grid, `move-y`
- [x] `ImageSlider` (`units/image-slider.tsx`) — full-width slider, cross-fade+scale slides, counter, arrows centered at bottom edge
- [x] `ReservationCta` (`units/reservation-cta.tsx`) — bed-config note + bordered **Make Reservation** CTA beside a feature image (2-col)
- [x] Composed into `app/(public)/accommodation/[unitSlug]/page.tsx` — **strict template order**: hero(image+specs) → details → amenities → image slider → reservation → related suites → instagram → footer
- [x] **Structural correction**: matched template order/hero exactly (removed off-template spa section, no duplicate title/specs)
- [x] **Reveal safety net** (`use-animations.ts`): scroll-reveal content force-reveals after 1.6s if never scrolled into view — fixes blank below-fold sections in full-page captures

**Wire-up (deferred to data phases, stubbed now):**
- [x] **Make Reservation** → `/bookings?unit=<slug>` (booking wizard target — Phase 5)
- [ ] Replace static per-slug content with `GET /api/units/[id]` once Phase 1 model + Phase 3 API exist
- [x] `generateStaticParams` over all slugs (7 pages SSG); `notFound()` for unknown slugs

**Verify:** `next build` + TypeScript clean; valid slug renders **HTTP 200** with all sections, unknown slug **404**, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs `suites.html`.

## Phase 2D — Dining page port (from Webflow `restaurant.html`)

Same template family / GSAP+Lenis stack — **reuses Phase 2A–2C infra + chrome**. Re-theme to our tokens/fonts;
reproduce **every animation and transition exactly**; each section a separately **exported** component.
Route: `app/(public)/dining/page.tsx`. Copy adapted to U2E (in-house restaurant + orderable menu per CLAUDE.md).

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Wellness` (`content={POOLSIDE}` → poolside feature w/ Menus CTA), `ImageSlider` (Explore gallery), `InstagramMarquee`
- [x] Content/assets in `lib/content/dining.ts` (template CDN images as documented placeholders)

**New section components (each exported, exact animation preserved):**
- [x] `DiningHero` (`dining/dining-hero.tsx`) — "Restaurant & Food" big image + `title-stagger` + `move-y` + `image-scale`
- [x] `DiningFeature` (`dining/dining-feature.tsx`) — restaurant intro + **Reserve a Table** CTA, parallax + `image-scale`
- [x] `RestaurantHours` (`dining/restaurant-hours.tsx`) — hours block (Restaurant + Bar hours), stagger + `move-y` columns
- [x] **Dining Menus** CTA delivered via the reused `Wellness`/poolside block → `/dining/menu`
- [x] Composed into `app/(public)/dining/page.tsx` in template order

**Menu sub-page (`/dining/menu`) — scaffolding now, data later:**
- [x] `app/(public)/dining/menu/page.tsx` + `MenuList` — categorized list (Starters / Mains / Desserts / Drinks; name, desc, price, photo), `move-y` rows
- [x] Add-to-order affordance stubbed/disabled (dining cart is Phase 5 / `diningCartStore`)

**Wire-up (deferred to data phases, stubbed now):**
- [x] **Reserve a Table** → `/contact` (placeholder); **Dining Menus** → `/dining/menu`
- [ ] Replace static content with `GET /api/dining` + `GET /api/menus` once Phase 1 model + Phase 3 API exist

**Verify:** `next build` + TypeScript clean; `/dining` and `/dining/menu` render **HTTP 200** with all sections, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs `restaurant.html`.

## Phase 2E — Experience page port (from Webflow `seasonal-experiences.html`)

Same template family / GSAP+Lenis stack — **reuses Phase 2A–2D infra + chrome**. Re-theme to our tokens/fonts;
reproduce **every animation and transition exactly**; each section a separately **exported** component.
Route: `app/(public)/experience/page.tsx`. Copy adapted to U2E (on-site experiences: fitness, spa/relaxation, leisure).

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Wellness` (`content={EXP_WELLNESS}`), `InstagramMarquee`
- [x] Content/assets in `lib/content/experience.ts` (template CDN images as documented placeholders)

**New section components (each exported, exact animation preserved):**
- [x] `ExperienceHero` (`experience/experience-hero.tsx`) — centered breadcrumb + `title-stagger` title + `move-y` intro (centered-content hero, not full-bleed)
- [x] `SeasonalListing` (`experience/seasonal-listing.tsx`) — interactive activity index: hover/select an activity → cross-fades the paired image (`image-scale`) + swaps headline/description; active item highlighted; keyboard + pointer accessible
- [x] Composed into `app/(public)/experience/page.tsx` in template order

**Wire-up (deferred to data phases, stubbed now):**
- [ ] Replace static content with `GET /api/experience` once Phase 1 model + Phase 3 API exist

**Verify:** `next build` + TypeScript clean; `/experience` renders **HTTP 200** with all sections, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs `seasonal-experiences.html`.

## Phase 2F — Meetings & Events page port (from Webflow `meeting-event.html`)

Same template family / GSAP+Lenis stack — **reuses Phase 2A–2E infra + chrome**. Re-theme to our tokens/fonts;
reproduce **every animation and transition exactly**; each section a separately **exported** component.
Route: `app/(public)/meetings-events/page.tsx`. Copy adapted to U2E. **Enquiry-based** per CLAUDE.md (lead capture).

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Wellness` (`content={EVENTS_FEATURE}`), `InstagramMarquee`
- [x] Content/assets in `lib/content/meetings.ts` (template CDN images as documented placeholders)

**New section components (each exported, exact animation preserved):**
- [x] `EventsHero` (`meetings/events-hero.tsx`) — "Meetings & Events" big image + `title-stagger` + `move-y` + `image-scale`
- [x] `EventsIntro` (`meetings/events-intro.tsx`) — "Gather in an Elegant Setting" + capacity intro + **Request Proposal** CTA, parallax + `image-scale`
- [x] `EventEssentials` (`meetings/event-essentials.tsx`) — "The Essentials" numbered list + enquiry CTA, `move-y` rows
- [x] `EventOccasions` (`meetings/event-occasions.tsx`) — "Spaces for All Occasions" capacity copy + occasions list, `move-y`
- [x] `EventSpaces` (`meetings/event-spaces.tsx`) — venue cards (Rooftop Terrace / Garden Pavilion / The Boardroom), `image-scale` + hover zoom
- [x] `EnquiryForm` (`meetings/enquiry-form.tsx`) — **EventEnquiry** lead capture (name, email, phone, event type, date, guests, message); **Zod + react-hook-form** validation; thank-you state
- [x] Composed into `app/(public)/meetings-events/page.tsx` in template order
- [x] Zod schema `src/schemas/enquiry.ts` (`eventEnquirySchema` + `EventEnquiryInput`) — reused by form now, API route later

**Space detail (`[spaceSlug]`) — optional, deferred:**
- [ ] `app/(public)/meetings-events/[spaceSlug]/page.tsx` — per-space detail (capacity, photos, enquiry) if design calls for it

**Wire-up (deferred to data phases, stubbed now):**
- [x] `EnquiryForm` client-side validated; submit resolves to thank-you state (endpoint stubbed with `TODO(Phase 3)`)
- [ ] Submit → `POST /api/meetings-events` (Phase 3 API + `EventEnquiry` model); *(Zustand `enquiryStore` deferred — react-hook-form covers form state for now)*
- [ ] Replace static content with `GET /api/meetings-events` once Phase 1 model + Phase 3 API exist

**Verify:** `next build` + TypeScript clean; `/meetings-events` renders **HTTP 200** with all sections + enquiry form, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs `meeting-event.html`.

## Phase 2G — Gallery page port (from Webflow `gallery.html`)

Same template family / GSAP+Lenis stack — **reuses Phase 2A–2F infra + chrome**. Re-theme to our tokens/fonts;
reproduce **every animation and transition exactly**; each section a separately **exported** component.
Route: `app/(public)/gallery/page.tsx`. Copy adapted to U2E.

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Wellness` (`content={GALLERY_WELLNESS}`), `InstagramMarquee`
- [x] Content/assets in `lib/content/gallery.ts` (template CDN images as documented placeholders; `category` tags: Rooms / Dining / Events / Wellness)

**New section components (each exported, exact animation preserved):**
- [x] `GalleryHero` (`gallery/gallery-hero.tsx`) — big-image page hero + `title-stagger` + `move-y` + `image-scale`
- [x] `GalleryGrid` (`gallery/gallery-grid.tsx`) — **category tab filter** (All / Rooms / Dining / Events / Wellness) over a CSS masonry grid; hover zoom + "View" overlay; filtered set drives the lightbox
- [x] `Lightbox` (`gallery/lightbox.tsx`) — fullscreen overlay, prev/next + close, keyboard (Esc / ← / →), body scroll-lock, counter
- [x] Composed into `app/(public)/gallery/page.tsx` in template order

**Wire-up (deferred to data phases, stubbed now):**
- [ ] Replace static images with `GET /api/gallery` (with `category` tag) once Phase 1 model + Phase 3 API exist

**Verify:** `next build` + TypeScript clean; `/gallery` renders **HTTP 200** with all sections + tab filter + lightbox, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs `gallery.html`.

## Phase 2H — Journal page port (from Webflow `blog.html`)

Same template family / GSAP+Lenis stack — **reuses Phase 2A–2G infra + chrome**. Re-theme to our tokens/fonts;
reproduce **every animation and transition exactly**; each section a separately **exported** component.
Route: `app/(public)/journal/page.tsx` (linked from the footer). Copy adapted to U2E.
> **New entity note:** introduces a `JournalPost` (title, slug, category, excerpt, image, date) — not in CLAUDE.md's data model; add in Phase 1 (alongside the `Event` entity from Phase 2F's Upcoming Events).

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Wellness` (`content={JOURNAL_WELLNESS}`), `InstagramMarquee`
- [x] Content/assets in `lib/content/journal.ts` (template CDN images as documented placeholders)

**New section components (each exported, exact animation preserved):**
- [x] `JournalHero` (`journal/journal-hero.tsx`) — "Our Journal" big-image hero + `title-stagger` + `move-y` + `image-scale`
- [x] `FeaturedPost` (`journal/featured-post.tsx`) — large featured article (category, title, excerpt, **Read More**), parallax + `image-scale`
- [x] `JournalListing` (`journal/journal-listing.tsx`) — **category tab filter** (All / News / Event / Culture / Experience) over a post-card grid; `image-scale` + hover; **Explore** → `[postSlug]`
- [x] Composed into `app/(public)/journal/page.tsx` in template order

**Post detail (`[postSlug]`) — optional, deferred:**
- [ ] `app/(public)/journal/[postSlug]/page.tsx` — article detail (hero, body, related) if design calls for it

**Wire-up (deferred to data phases, stubbed now):**
- [x] `Explore` / `Read More` link to `/journal/[postSlug]` (target page optional/deferred — 404 until built)
- [ ] Replace static posts with `GET /api/journal` (+ `category`) once Phase 1 `JournalPost` model + Phase 3 API exist

**Verify:** `next build` + TypeScript clean; `/journal` renders **HTTP 200** with all sections + tab filter, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs `blog.html`.

## Phase 2I — Journal article detail port (from Webflow `best-caribbean-all-inclusive-resorts.html`)

Single article page. Same template family / GSAP+Lenis stack — **reuses Phase 2A–2H infra + chrome**. Re-theme to our
tokens/fonts; reproduce **every animation and transition exactly**; each section a separately **exported** component.
Dynamic route: `app/(public)/journal/[postSlug]/page.tsx` with `generateStaticParams` from post slugs. Makes the
`Explore`/`Read More` links from Phase 2H resolve. **Extends `JournalPost`** with `author` + rich-text `body` blocks.

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Wellness` (`content={JOURNAL_WELLNESS}`), `InstagramMarquee`
- [x] Content in `lib/content/journal.ts` — added `ALL_POSTS`, `getPost`, `getRelatedPosts`, `JOURNAL_SLUGS`, `Author` + `ArticleBlock` types, `SAMPLE_ARTICLE_BODY` (original U2E prose)

**New section components (each exported, exact animation preserved):**
- [x] `ArticleHero` (`journal/article-hero.tsx`) — breadcrumb + category + `title-stagger` title + date, cover image `image-scale`
- [x] `ArticleBody` (`journal/article-body.tsx`) — author strip + **share buttons** (X / Facebook / LinkedIn + copy-link) + rich-text prose (headings / paragraphs / figures), `move-y` per block
- [x] `RelatedPosts` (`journal/related-posts.tsx`) — "More Stories" grid (same-category preferred), `image-scale` + hover
- [x] Composed into `app/(public)/journal/[postSlug]/page.tsx` in template order

**Wire-up (deferred to data phases, stubbed now):**
- [x] `generateStaticParams` over all post slugs (SSG); `notFound()` for unknown slugs; **Explore/Read More links now resolve**
- [ ] Replace static article body with `GET /api/journal/[slug]` once Phase 1 `JournalPost` model + Phase 3 API exist

**Verify:** `next build` + TypeScript clean; valid slug renders **HTTP 200** with all sections, unknown slug **404**, share + copy-link work, no runtime errors.
- [ ] ⏳ Browser visual side-by-side vs the article template.

## Phase 2J — Contact page (no template — original design)

**No Webflow reference** — designed from scratch on our design system, reusing the site's animation infra + chrome.
Re-theme to tokens/fonts; keep the same animation vocabulary (`title-stagger`, `move-y`, `image-scale`, `ease-brand`
transitions) so it feels native. Route: `app/(public)/contact/page.tsx`. Resolves the **Contact** nav link.

**Reuse (no rebuild):**
- [x] `Navbar`, `Footer`, `RevealHeading`, animation hooks; `Faq` accordion (`content={CONTACT_FAQ}`)
- [x] `ContactMessage` Zod schema `src/schemas/contact.ts` (`contactMessageSchema` + `ContactMessageInput`) — reused by form now, API route later

**New section components (each exported, exact animation preserved):**
- [x] `ContactHero` (`contact/contact-hero.tsx`) — default page hero, mirrors `AccommodationHero` (full-bleed image + overlay + eyebrow + `title-stagger` + `move-y`)
- [x] `ContactSplit` (`contact/contact-split.tsx`) — **left** = details (visit / call / email / front-desk) + "View on Google Maps" + social links; **right** = `ContactForm`
  - [x] `ContactForm` (`contact/contact-form.tsx`) — name, email, reason (Inquiry / Complaint / Suggestion), message; **Zod + react-hook-form**; thank-you state
  - [x] Detail rows reveal with `move-y`; social links slide a brand underline on hover (`ease-brand`)
- [x] `ContactMap` (`contact/contact-map.tsx`) — responsive **Google Maps `<iframe>`** (`loading="lazy"`), framed + rounded, `move-y` reveal, grayscale→color on hover
- [x] FAQs via reused `Faq` (`content={CONTACT_FAQ}`)
- [x] Composed into `app/(public)/contact/page.tsx`: hero → split (info + form) → FAQs → map → footer

**Wire-up (deferred to data phases, stubbed now):**
- [x] `ContactForm` client-validated; submit resolves to thank-you state (`TODO(Phase 3)` → `POST /api/contact`)
- [ ] Real address / phone / email / map coordinates — placeholders until provided

**Verify:** `next build` + TypeScript clean; `/contact` renders **HTTP 200** with all sections + map iframe, form validates client-side, no runtime errors.
- [ ] ⏳ Browser pass for feel (hero, form reveal, social hovers, map).

## Phase 3 — Public content screens (read-only)

- [ ] **Home** — assembled in **Phase 2A** (Webflow port, re-themed, exact animations)
- [ ] **Accommodation** list (`/accommodation`) — UI ported in **Phase 2B**; wire to `GET /api/units` + price/amenities here
- [ ] **Unit detail** (`/accommodation/[unitSlug]`) — UI ported in **Phase 2C**; wire to `GET /api/units/[id]` + price/Book CTA here
- [ ] **Dining** (`/dining`) + **Menu** (`/dining/menu`) — UI ported in **Phase 2D**; wire to `GET /api/dining`, `/api/menus` here
- [ ] **Experience** (`/experience`) — UI ported in **Phase 2E**; wire to `GET /api/experience` here
- [ ] **Meetings & Events** (`/meetings-events` + `[spaceSlug]`) — UI + enquiry form ported in **Phase 2F**; wire to `POST/GET /api/meetings-events` here
- [ ] **Gallery** (`/gallery`) — UI ported in **Phase 2G** (tab filter + lightbox); wire to `GET /api/gallery` here
- [ ] **Offers** (`/offers` + `[offerSlug]`) — promos/packages; `GET /api/offers`
- [ ] **Contact** (`/contact`) — UI + form designed in **Phase 2J** (hero, info+form split, FAQs, map); wire to `POST /api/contact` here
- [ ] Server Components fetch via Prisma directly; client views use React Query hooks (`hooks/`)

## Phase 4 — Pricing engine

- [ ] `lib/pricing.ts` — resolve price per unit type (flat/per-unit), no per-location logic
- [ ] Apply active applicable **Offer** discount before final price
- [ ] `POST /api/pricing/quote` (or server action) — **server-authoritative**, client never computes total
- [ ] Isolated resolver (future multi-location safe, not over-engineered)

## Phase 5 — Booking wizard (within Accommodation)

- [ ] `stores/bookingWizardStore` (Zustand) — step state, selections, upload progress
- [ ] **Step 1 — Select unit + dates/preferences**
- [ ] **Step 2 — Personal info** — Zod + react-hook-form resolver
- [ ] **Step 3 — Document upload** — client + server-side file type/size validation
- [ ] **Step 4 — Payment** (see Phase 6)
- [ ] `POST /api/bookings` — server-generates unique **`BKG-XXXXXX`** reference; stores amount from quote
- [ ] Booking status page `/bookings/[bookingRef]` — `GET /api/bookings/[ref]`
- [ ] ⏳ **Confirm file storage** — S3 / Cloudinary / UploadThing / blob (open decision)

## Phase 6 — Payments

- [ ] **Card — Paystack Checkout**
  - [ ] Initialize/inline checkout, amount in **kobo**, from backend
  - [ ] `POST /api/payments` + `POST /api/payments/webhook` — verify server-side (status + amount)
  - [ ] Verified → booking `confirmed`; reference + status persisted
- [ ] **Bank transfer (offline)**
  - [ ] Show bank details + booking reference; booking stays `awaiting-payment`
  - [ ] Guest emails receipt + reference; app exposes status change from CMS (shared DB/webhook/API)
- [ ] `lib/payments/` — Paystack integration + bank-transfer confirmation logic
- [ ] `lib/email.ts` — transactional email (booking confirmation, bank-transfer instructions)
- [ ] ⏳ **Confirm email provider / SMTP** (open decision)

## Phase 7 — Meetings & Events enquiry

- [ ] Enquiry form → `POST /api/meetings-events` (EventEnquiry lead capture)
- [ ] `stores/enquiryStore`
- [ ] ⏳ **Confirm** enquiry-only vs. deposit/payment flow (open decision)

## Phase 8 — CMS integration (read + status sync)

- [ ] ⏳ **Confirm integration mechanism** — shared DB / REST / GraphQL / webhooks (open decision)
- [ ] Pull unit/menu/gallery/offer content from separate CMS
- [ ] Receive booking + payment status changes (webhook or shared DB)

## Cross-cutting

- [ ] Every API route/server action parses input with Zod → 400 + field errors on failure
- [ ] No Prisma calls in client bundle
- [ ] Auth strategy for guest accounts (`lib/auth.ts`) — ⏳ **TBD**
- [ ] Loading / empty / error states across data views
- [ ] Responsive + accessible (keyboard nav, alt text, focus states)

## Verification gates

- [ ] `tsc --noEmit` clean
- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds
- [ ] Booking end-to-end: quote → create (`BKG-` ref) → upload → Paystack test card → confirmed
- [ ] Bank-transfer path leaves booking `awaiting-payment`
- [ ] Webhook on unpaid/invalid ref → no crash, correct status

---

## Open decisions to resolve (from CLAUDE.md)

1. Final nav: keep **Contact** + top-level **Bookings** as nav items, or collapse?
2. CMS integration mechanism (shared DB / API / webhooks)?
3. Meetings & Events — enquiry-only or its own deposit/payment flow?
4. File storage for photos + verification documents?
5. Email delivery provider?
6. Guest auth strategy?
