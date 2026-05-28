# SPT — Marketing Website Project Proposal

> A complete implementation brief for the **SPT** marketing website. SPT (short for *Standard Parts Toolkit*) is the canonical product name going forward, aligned with how peer products brand themselves (Convermax, PDM Automotive, WHI Solutions / eBay Link). This document is the source of truth for an implementing developer or LLM agent. Every decision below was confirmed by the project owner; deviations should be raised before implementation.

---

## 1. Product Context

**SPT** (the product formerly known as *Standard Parts Toolkit*) is an all-in-one Shopify app for stores selling automotive parts. A product of **No Fixed Plans**. Capabilities:

- **YMM (Year-Make-Model) Fitment Search** — data-powered, with the merchant's choice of backing data source:
  - ACES/PIES XML files
  - ShowMeTheParts API
  - Raw CSV uploads
- **VIN Lookup** — shoppers who don't know their Year/Make/Model can find fitting parts via VIN (data-source dependent).
- **License-plate lookup** — where the underlying data source supports it.
- **Catalog Parts Sync** — bulk product/variant sync, including Product Description, Product Specs, **Buyer's Guide**, and Product Item Attributes.
- **PDP Product Information** — enriched product detail page content (attributes, fitment, specs, Buyer's Guide) sourced from the same data layer.
- **In-Cart Fitment & Fulfillment Handoff** — vehicle/fitment selection follows the shopper through cart and checkout, and is surfaced to the fulfillment team during shipment review.
- **Price & Inventory Sync** — inbound feeds via FTP or email.
- **Order Export** — outbound order delivery via Email, FTP, or API to existing fulfillment systems.
- **Merchant of Record (sales-tax service)** — separately offered service in which SPT acts as the seller of record, collecting and remitting US sales tax on behalf of the merchant. *Distinct from the Shopify app modules above.*
- **Configuration & Styling** — heavily customizable search/result UX and per-merchant configuration.

### 1.1 Positioning shift from the current site

The current `standardpartstoolkit.com` positions the product as **a Shopify integration powered by ShowMeTheParts** (1,000+ supplier brands, ShowMeTheParts as the canonical data layer). The new site repositions the product as **data-source agnostic** — ACES/PIES files, ShowMeTheParts, or CSV — and adds modules that don't appear on the current site (P&I sync, order export, multi-vehicle garage).

**Single-store model — important.** SPT is purchased and installed per merchant, per Shopify store. One install = one store. The product is store-side, not a data-syndication platform. The manufacturer audience pitch is **direct-to-consumer Shopify** (a manufacturer building their own D2C store on their authoritative catalog data), NOT pushing data into dealer storefronts. Do not use "syndicate to multiple stores" or "multi-store" language anywhere in copy.

**Capability scope at launch: everything ships.** All six Shopify-app modules plus the Merchant of Record service are claimed as live. The owner has committed to closing any operational gap within the launch window.

---

## 2. Audience & Positioning

**Primary audience: Enterprise Shopify merchants in automotive — leaning toward parts manufacturers, with retailer support as a secondary path.**

- Hero / homepage messaging should lead with manufacturer-relevant value props for the direct-to-consumer case: ACES/PIES catalog → faithful Shopify storefront without a custom build, P&I sync from upstream feeds, order export to downstream systems. Do not pitch data syndication or multi-store — SPT is one install per store.
- A clearly visible secondary path / page for retailers (single-store ecom merchants) so they don't bounce.
- Tone: confident, technically credible, plain-English benefits-led copy. Avoid pure dev jargon on marketing pages — keep that for an "Integrations" deep-dive.

### Conversion Goals (dual primary CTA + tertiary)

Every page surfaces both primary CTAs:
1. **Primary CTA — "Book a Demo"** (handled by Formspree form; no calendar widget at launch).
2. **Secondary CTA — "Install on Shopify"** (deep link to Shopify App Store listing).

Plus a tertiary CTA where space allows (hero, final CTA band, YMM feature page):
3. **Tertiary CTA — "View Demo Site"** linking to the live demo store at `https://carmenspartdepot.com` (confirm the store stays publicly accessible).

Place the two primary CTAs in the global header, the homepage hero, the end of every feature page, and a final-CTA section above the footer. The "View Demo Site" link is most valuable in contexts where shoppers/buyers want to see real fitment-search UX without scheduling a call.

---

## 3. Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Static site generator | **Astro** | Content-first, ships zero JS by default, MDX support, easy GH Pages deploy |
| Styling | **Tailwind CSS + shadcn-style component patterns** | shadcn/ui is React-first; for Astro use Tailwind primitives and hand-rolled components inspired by shadcn's design tokens. If interactive islands are needed, add `@astrojs/react` and use the real shadcn/ui there. |
| Content authoring | **Markdown / MDX in the repo** | Authors edit `.md` / `.mdx` via the GitHub web UI or locally; everything version-controlled. Use Astro Content Collections for type-safe frontmatter. |
| Forms | **Formspree** (or Web3Forms as fallback) | Drop-in endpoint; free tier covers expected marketing volume. |
| Analytics | **Google Analytics 4** | Free, ubiquitous, finance/ops familiar with it. ⚠️ See compliance note in §11. |
| Search (on-site) | **Pagefind** | Static, client-side full-text search. Indexes blog + marketing copy + changelog. |
| Hosting | **GitHub Pages on a custom domain** | Free; GitHub Actions builds Astro and deploys to `gh-pages` branch; CNAME file points the custom domain at GH Pages. |

### Repository Layout (target)
```
/
├─ src/
│  ├─ pages/                 # Astro page routes
│  ├─ layouts/               # Base, Marketing, Blog, Legal layouts
│  ├─ components/            # Header, Footer, CTA, FeatureCard, LogoWall, etc.
│  ├─ content/
│  │  ├─ blog/               # Blog posts (.mdx)
│  │  ├─ changelog/          # Release notes (.mdx)
│  │  └─ caseStudies/        # Case studies (.mdx)
│  ├─ styles/                # Tailwind entry, design tokens
│  └─ assets/                # Logo, screenshots, OG images
├─ public/
│  ├─ CNAME                  # Custom domain
│  ├─ robots.txt
│  └─ favicons/
├─ astro.config.mjs
├─ tailwind.config.cjs
├─ .github/workflows/deploy.yml
└─ README.md
```

---

## 4. Site Map & Navigation

### Global Header
```
Logo | Products ▼ | Features ▼ | Integrations | Why Shopify | Pricing | Blog | About    [Book a Demo] [Install on Shopify]
```
- The **Products** dropdown lists the two distinct product offerings:
  - **SPT for Shopify** (the toolkit app) → `/features/`
  - **Merchant of Record** (the sales-tax service) → `/merchant-of-record/`
  Items render with a short tagline beneath each name.
- The **Features** dropdown lists the **six** modules within SPT for Shopify (YMM Search, Catalog Sync, PDP, In-Cart Fitment, P&I Sync, Order Export).
- **Customers** is intentionally NOT in the top nav (deferred until enough case studies exist to merit prominence). The `/customers/` URL remains; the link lives in the footer.
- **Knowledge Base** is intentionally NOT in the top nav. Link lives in the footer only — an external link (`↗`) to `https://kb.standardpartstoolkit.com`.
- **Docs is NOT in the launch nav as a built page** — we link to the external KB instead. See §6.

### Page Inventory

| Path | Purpose | Source |
|---|---|---|
| `/` | Homepage — manufacturer-led hero, social proof, feature overview, dual CTA | Astro page |
| `/features/` | Features overview, links to all sub-pages | Astro page |
| `/features/ymm-search/` | YMM Fitment Search deep dive | Astro page |
| `/features/catalog-sync/` | Catalog Parts Sync deep dive | Astro page |
| `/features/pdp-enrichment/` | PDP product information deep dive (incl. Buyer's Guide) | Astro page |
| `/features/in-cart-fitment/` | In-cart fitment + fulfillment handoff | Astro page |
| `/features/price-inventory-sync/` | Inbound P&I sync (FTP / email) | Astro page |
| `/features/order-export/` | Outbound order export (Email / FTP / API) | Astro page |
| `/merchant-of-record/` | Merchant of Record service (sales tax) | Astro page |
| `/why-shopify/` | Comparison vs custom builds, Adobe Commerce, BigCommerce | Astro page |
| `/integrations/` | Data sources index — ACES/PIES, ShowMeTheParts, CSV, FTP, email, API | Astro page |
| `/integrations/aces-pies/` | ACES/PIES detail | Astro page |
| `/integrations/showmetheparts/` | ShowMeTheParts API detail | Astro page |
| `/integrations/csv/` | CSV ingestion detail | Astro page |
| `/pricing/` | Pricing tiers (or "Contact for pricing" if not public) | Astro page |
| `/customers/` | Logo wall + case study listing | Content collection |
| `/customers/[slug]/` | Individual case study | MDX in `caseStudies/` |
| `/blog/` | Blog index, paginated | Content collection |
| `/blog/[slug]/` | Blog post | MDX in `blog/` |
| `/blog/tags/[tag]/` | Tag pages | Content collection |
| `/changelog/` | Release notes index | Content collection |
| `/changelog/[slug]/` | Individual release notes entry | MDX in `changelog/` |
| `/about/` | About + team + brand story | Astro page |
| `/contact/` | Contact form + email + addresses | Astro page (Formspree) |
| `/demo/` | Book-a-demo form (long-form lead capture) | Astro page (Formspree) |
| `/legal/privacy/` | Privacy Policy | MDX |
| `/legal/terms/` | Terms of Service | MDX |
| `/legal/security/` | Security & Data Handling | MDX |
| `/404` | Custom not-found | Astro page |

### Footer
- Columns: **Product** (six feature links + Merchant of Record), **Integrations**, **Company** (About / Customers / Blog / Changelog / Contact / Knowledge Base ↗), **Legal** (Privacy / Terms / Security).
- Bottom line: "SPT is a product of [No Fixed Plans](https://nofixedplans.xyz/)."
- Includes a small newsletter signup (Formspree endpoint), social links, copyright, and the real company address: **1449 S Michigan Ave STE 13288, Chicago, IL 60605**.

---

## 5. Page-by-Page Content Requirements

Each page below should be drafted with placeholder copy by the implementer, ready for the owner to refine. Voice: confident, manufacturer-aware, retailer-inclusive.

### 5.1 Homepage (`/`)
1. **Hero** — Single-store-ownership headline ("Run a real automotive parts store on Shopify"), subhead naming the modules and audiences (manufacturers selling D2C, retailers), with the reduce-returns angle. Triple CTA (Book a Demo · Install on Shopify · View Demo Site).
2. **Compatibility badge row** — "Shopify Online Store 2.0 compatible · No custom dev work required · One install per store — yours." (Do NOT name ShowMeTheParts here — the homepage positions SPT as data-source agnostic; ShowMeTheParts is one of three sources.)
3. **Trust strip** — Placeholder "trusted by" logo wall (grey silhouettes until real logos exist).
4. **Six-feature grid** — One card per module: YMM Fitment Search + VIN, Catalog Sync, PDP Enrichment, In-Cart Fitment, P&I Sync, Order Export. Each with name, 2-line description, "Learn more" link.
5. **Data Sources section** — Three equally-weighted cards for ACES/PIES, ShowMeTheParts, and CSV — each with a tag (Manufacturer-grade / API-driven / Lightweight), a short paragraph, a feature bullet list, and a link to the integration sub-page. Headed "Bring the data you already have."
6. **Reduce-returns band** — "Stop refunding parts that didn't fit," with a 4-step ladder (Search → Product page → Cart → Fulfillment).
7. **Manufacturer vs Retailer split** — Two parallel cards. Manufacturer pitch is direct-to-consumer (NOT syndication / dealer push); retailer pitch is single-store fitment search.
8. **Screenshots row** — Annotated product screenshots (placeholders for now), plus a "View Demo Site" link to `https://carmenspartdepot.com`.
9. **By-the-numbers** — "3 data sources, your choice · 24/7 updates from your data feed · 0 hours managing fitment data." (Data-source-agnostic stats. Do NOT use ShowMeTheParts-specific claims like "1,000+ part brands" here.)
10. **Real testimonial** — Luke Smith, CEO, Momentum USA, Inc. (quote pulled from current site — see §10 for usage-rights confirmation).
11. **Merchant of Record callout** — One-line band linking to `/merchant-of-record/`: "Selling across state lines? We can be your merchant of record."
12. **Final CTA band** — "See it on your data — book a demo." With "View Demo Site" as a secondary link.
13. **Footer.**

### 5.2 Features Overview (`/features/`)
Hero + the same six-card grid as the homepage, but each card expands inline with more detail. Links to per-feature sub-pages. The Merchant of Record service is **not** a feature card here — it has its own top-level page at `/merchant-of-record/`.

### 5.3 Per-Feature Sub-Pages
Each follows the same template for consistency:
- Hero with feature name, one-line value prop, dual CTA.
- "How it works" — 3-step illustrated flow.
- "What you can configure" — bulleted capabilities (especially important for YMM Search and PDP).
- Screenshots (placeholders).
- Integration callout — which data sources power this feature.
- FAQ — 3–5 questions.
- Final CTA.

Feature-specific notes:

- **YMM Fitment Search** — emphasize configurability of dropdown order, result layout, styling, multi-vehicle garage support, performance. **Explicitly name VIN Lookup and License-plate lookup as included capabilities** (data-source dependent), each with its own subsection — they are visible, distinct features on the current site.
- **Catalog Sync** — full vs incremental sync, scheduling, conflict resolution, attribute mapping. Call out Product Description, Product Specs, **Buyer's Guide**, and Product Item Attributes as the data types brought into Shopify.
- **PDP Enrichment** — attribute templates, theme integration approach, performance. Include a Buyer's Guide block as a distinct PDP element. Frame value with a returns-reduction angle.
- **In-Cart Fitment & Fulfillment Handoff** — vehicle/fitment persists through Shopify cart and checkout via line-item properties and order metafields; fulfillment team sees the fitment record on the order. Avoid fulfilling the wrong part.
- **Price & Inventory Sync** — FTP & email ingestion, format support, scheduling, error reporting.
- **Order Export** — Email / FTP / API destinations, mapping, retries, audit trail.

#### 5.3.x In-Cart Fitment (new)
A standalone feature page. Mirror the standard template (hero, how-it-works, configurable options, integration callout, FAQ, final CTA). Key copy points:
- Fitment selection captured at search time travels with the shopper through PDP → cart → checkout.
- Stored as Shopify line-item properties and order metafields so it's queryable, exportable, and visible in the Shopify admin.
- Surfaces in the order detail view for fulfillment-team review before pick/pack.
- Optional: rendered on the printed packing slip via a theme app extension.

### 5.4 Integrations (`/integrations/`)
Hero positioning SPT as data-source agnostic. Three primary tiles (ACES/PIES, ShowMeTheParts, CSV) plus an "ingest channels" row (FTP, email, API). Each tile links to a deeper sub-page.

### 5.5 Merchant of Record (`/merchant-of-record/`)
A standalone service page describing the Merchant of Record offering — distinct from the Shopify app modules. Faithfully port the structure of the current `/merchant-of-record` page:
- Hero: **Sales Tax Simplified** — reduce sales tax headaches so the merchant can focus on growing their parts business.
- "What is a Merchant of Record?" explainer.
- Three-step flow: **Collection → Remittance → Payment.**
- Three benefits: **Tracking & Reporting · Simplicity · Reduced Liability.**
- "Powered by Shopify, BigCommerce, and Stripe" badge row. *Note: BigCommerce mention on the current site suggests the MoR service supports BigCommerce stores even though the app is Shopify-focused. Confirm.*
- FAQ section (preserve the 6 existing FAQs from the current site).
- Primary CTA: Book a Demo.

### 5.6 Pricing (`/pricing/`)
**Two-tier published pricing.** No "Contact for pricing" tier for the Shopify-app modules.

- **Free** — capped at **100 searches/month**. Includes YMM Search + VIN Lookup, Catalog Sync, PDP Enrichment, In-Cart Fitment. **Does NOT include** automatic Price & Inventory sync or Order Export.
- **$300/month** — all features unlocked, no search cap, includes automatic Price & Inventory sync and Order Export.

Page layout: two cards side-by-side, "$300/month" marked as the primary/recommended tier. Feature comparison table below. The Merchant of Record service is referenced as a separately priced offering with a "Contact us" CTA (MoR pricing is transaction-based and quoted per merchant).

### 5.7 Customers (`/customers/`)
Logo wall + grid of case study cards. **One real testimonial is already available** and must be wired in:

> "Vertical Development has been ingesting and publishing my content for years. Plugging their ShowMeTheParts API service directly into Shopify via Standard Parts Toolkit is a brilliant way to leverage the strengths of both worlds — like chocolate and peanut butter."
> — **Luke Smith, CEO, Momentum USA, Inc.**

Plus 1–2 placeholder case studies authored as MDX to establish the case-study template, ready to be filled with real customers later. **Confirm usage rights for the Luke Smith quote before launch** (likely already cleared since it's published on the current site, but worth verifying).

### 5.8 Blog
- Paginated index (10/page).
- Tag system via frontmatter; auto-generated tag pages.
- Post template: hero image, title, author, date, reading time, table of contents (for long posts), body, related posts, CTA band at the end.
- Content collections schema: `title`, `description`, `publishDate`, `author`, `tags[]`, `heroImage`, `draft`.

### 5.9 Changelog (`/changelog/`)
Reverse-chronological index of release notes entries. Each entry: `version`, `date`, sections for **New**, **Improved**, **Fixed**. Used for enterprise buyer trust signal.

> ⚠️ The SEO essentials chosen don't include RSS by default, but the changelog and blog meaningfully benefit from feeds. Recommend including blog + changelog Atom feeds anyway — they're trivial to add in Astro and useful for enterprise buyers monitoring releases. Flag with owner.

### 5.10 About (`/about/`)
Company story, mission, founding team placeholder, values, optional press / contact-press section. **Must reflect the real organizational structure:** SPT is a product of **No Fixed Plans** (https://nofixedplans.xyz/). ShowMeTheParts (operated by Vertical Development) is referenced where relevant **only as one of the supported data sources** — not as a partner or operator of SPT. Confirm exact wording with owner.

### 5.11 Contact (`/contact/`) and Demo (`/demo/`)
Two distinct Formspree-backed forms:
- **Contact**: generic — name, company, email, message.
- **Demo**: lead-qualifying — name, company, role, Shopify store URL, current data source, number of SKUs, primary goal, message.

Both forms must:
- Validate client-side.
- Show a success state on submission (no redirect, in-place).
- Send to a configurable Formspree endpoint (env var or `astro.config` constant).

### 5.12 Legal Pages
- **Privacy Policy** — covers GA4 cookies, Formspree data handling, Shopify App data scopes. **Preserve existing privacy-policy content** from `https://www.standardpartstoolkit.com/privacy-policy` as a starting point.
- **Terms of Service** — standard SaaS template tailored for SPT.
- **Security & Data Handling** — enterprise-friendly description of how customer data, ACES/PIES feeds, P&I sync, and order export are handled. Must reference: data residency, encryption in transit, retention, third-party processors. The implementer should write a credible template; the owner must legally review before launch.

---

## 6. Documentation Scope

**No new public documentation built as part of this site.** Instead, the existing **Knowledge Base** at `https://kb.standardpartstoolkit.com` is linked from the top nav (external link with `↗`) and from the footer. This honors the original "no public docs at launch" decision while preserving the real, already-published help content.

> The original answer "no docs at launch" was made before the KB subdomain was surfaced. Linking to an externally hosted KB is consistent with that answer — it isn't a built documentation section in the new site's codebase.

---

## 7. Brand Direction (to be proposed by implementer)

The owner has no logo, color palette, typography, or screenshots yet. The implementer should propose:

### 7.1 Logo
- Wordmark using the product name "SPT."
- Optional monogram "SPT" mark for favicon, app icon, social avatars.
- Provide SVG sources (light + dark variants).

### 7.2 Color System
**Confirmed palette: green / orange / yellow** — evoking automotive workshops, tool brands, and heavy-equipment industries (think John Deere, Caterpillar, Snap-on energy). Implementer to refine specific shades, but the directional weights:

- **Primary — Green.** A deep, confident industrial green (Tailwind `green-700`–`green-800` range, e.g. `#15803D` / `#166534`, or an olive-leaning forest green). Used for the brand mark, headings accents, links, primary surfaces.
- **Secondary — Orange.** A warm safety/construction orange (Tailwind `orange-500`–`orange-600`, e.g. `#F97316` / `#EA580C`). Used for primary CTAs ("Book a Demo" buttons) — orange-on-green is high-contrast and reads as urgent/actionable.
- **Tertiary — Yellow.** A muted amber/mustard yellow used sparingly (badge highlights, accent strokes, "new" tags). NOT at equal weight to green and orange — too much yellow reads juvenile.
- **Neutrals** — Warm greys (Tailwind `stone` scale) rather than cool greys, to harmonize with the green/orange warmth. Off-white background.
- **Semantic** — Reserve standard red for error states (don't reuse orange for errors); use a brighter green for success; yellow for warnings.
- Implement as Tailwind theme tokens; mirror them as CSS variables so the dark-mode toggle can swap them cleanly.

**Avoid:** flat primary green + flat primary orange + flat primary yellow at equal sizes — reads like a fast-food chain. Lead with green as the dominant brand color, orange as the action color, yellow as the spice.

### 7.3 Typography
- **Headings** — A geometric/industrial sans (e.g. Inter Tight, Space Grotesk, or Manrope) for confidence.
- **Body** — A highly legible neutral sans (e.g. Inter or system stack) at 16–17px base.
- **Mono** — JetBrains Mono or similar for code, version numbers, file format snippets.
- Self-host via `@fontsource` packages to keep the site fast and avoid third-party requests (better for GH Pages + EU traffic).

### 7.4 Imagery
- Until real screenshots exist, generate clean **placeholder UI screenshots** (annotated mocks) for each feature page.
- Avoid stock automotive photography clichés (hands on steering wheels, generic engines). Prefer abstract data-visualization motifs, parts-diagram line art, or actual UI screenshots.

### 7.5 Component Conventions
- Rounded corners: medium (`rounded-xl`).
- Soft elevation shadows; no heavy drop shadows.
- Generous whitespace; section padding `py-20` minimum on desktop.
- Buttons: solid primary, outlined secondary, ghost tertiary.

---

## 8. Functional Requirements

### 8.1 Dark Mode
- System-preference aware via `prefers-color-scheme`.
- Manual toggle persisted to `localStorage`.
- All colors driven by CSS variables so a single class flip swaps themes.

### 8.2 On-Site Search (Pagefind)
- Built at the end of the Astro build, indexes blog + marketing pages + changelog.
- Floating search trigger in the header (cmd/ctrl-K).
- Results modal styled to match the design system.

### 8.3 Performance & Accessibility Targets
- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on the homepage and one representative feature page.
- All images served with explicit dimensions and lazy-loaded below the fold.
- WCAG 2.1 AA contrast across both themes.
- All interactive elements keyboard-accessible; skip-to-content link in the global layout.

### 8.4 Responsive Design
- Breakpoints follow Tailwind defaults.
- Mobile-first; verify the five-feature grid, header/nav, and forms on `375px`, `768px`, `1024px`, `1440px`.

### 8.5 Forms (Formspree)
- All forms POST to Formspree.
- Implement a single `<ContactForm>` Astro component that accepts a `formId` and a field schema, so Contact / Demo / Newsletter share one implementation.
- Honeypot field + basic spam-trap heuristic before POST.

### 8.6 Analytics (GA4)
- GA4 script loaded site-wide via the base layout.
- Configurable measurement ID via environment variable.
- Track outbound clicks to Shopify App Store as a conversion event.
- Track demo form submissions as a conversion event.

### 8.7 SEO
Confirmed:
- `sitemap.xml` via `@astrojs/sitemap`.
- `robots.txt` (allow all, point to sitemap).
- Canonical URLs in the base layout.

> ⚠️ Strongly recommended additions even though not selected: **Open Graph + Twitter card meta tags per page** and **JSON-LD structured data** (Organization on every page, BlogPosting on blog posts, Product/SoftwareApplication on the homepage). These cost almost nothing in Astro and materially affect social-share appearance and rich-result eligibility. Implement them by default; flag to the owner that they're included.

---

## 9. Deployment

- Repository hosted on GitHub.
- GitHub Actions workflow on push to `main`:
  1. Checkout
  2. Set up Node 20
  3. `npm ci`
  4. `npm run build` (Astro build → `dist/`)
  5. Run Pagefind to index `dist/`
  6. Deploy `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages` (or `actions/deploy-pages`)
- `public/CNAME` contains the production custom domain (TBD — confirm with owner; suggested: `standardpartstoolkit.com`).
- DNS: ALIAS/ANAME `@` to GH Pages IPs + CNAME `www` to `<org>.github.io`. Enable enforced HTTPS in repo Pages settings.
- Preview environments: enable GitHub Pages PR previews via a separate workflow (optional v1.x; nice-to-have).

---

## 10. Open Items / Recommendations to Confirm

Before kicking off implementation, the owner should confirm or override these:

**Confirmed at kickoff**
- **Capability scope:** Everything ships at launch — no "coming soon" labels. Owner committed to closing operational gaps within the launch window.
- **Deployment:** Preview URL first (GitHub Pages on `*.github.io` or staging subdomain), DNS cutover to `standardpartstoolkit.com` after owner review.
- **Pricing:** Two tiers — Free (100 searches/month, no P&I/Order Export) and $300/month (everything).
- **Brand palette:** Green (primary) / Orange (CTAs) / Yellow (accent). Implementer chooses specific shades.

**Still needed (can be supplied during the build)**
1. **Shopify App Store install URL** (placeholder until app is listed).
2. **Formspree project / endpoint IDs** for Contact, Demo, Newsletter forms.
3. **GA4 measurement ID**.
4. **BigCommerce support** — the current MoR page lists BigCommerce alongside Shopify. Is the MoR service multi-platform while the app is Shopify-only? Confirm the wording.
5. **Redirect map** for any deep links from the current site that don't map 1:1 (current `/blog` posts, current `/merchant-of-record`, current `/privacy-policy`).

**Brand, identity & assets**
9. **Organizational wording** — confirm "a product of No Fixed Plans" as the canonical phrase for footer and About. ShowMeTheParts (operated by Vertical Development) appears in copy only as one of the supported data sources, not as a partner or operator.
10. **Real testimonial usage rights** — confirm Luke Smith / Momentum USA quote can be carried into the new site.
11. **Real demo store** — confirm `https://carmenspartdepot.com` stays publicly accessible and is OK to link.
12. **Real Knowledge Base** — confirm `https://kb.standardpartstoolkit.com` stays live and is OK to link from the top nav.
13. **Real company address** — confirmed as `1449 S Michigan Ave STE 13288, Chicago, IL 60605`. Will be used in footer and contact page.

**SEO & compliance**
14. **Whether to include RSS feeds** for blog + changelog (recommended yes).
15. **Whether to include Open Graph + JSON-LD** despite not being in the initial selection (recommended yes — implementer should add by default and flag).
16. **Cookie consent banner** — GA4 + any EU/UK traffic effectively requires one. See §11.
17. **Existing blog content** — the current site has a `/blog`. Should existing posts be ported to the new MDX-based blog, or does the new site launch with the placeholder posts only? Confirm migration scope.

---

## 11. Compliance Note (GA4 + EU/UK)

GA4 sets cookies and processes IP data classified as personal data under GDPR. If any meaningful EU/UK traffic is expected, the site needs either:
- A GDPR-compliant cookie consent banner that **blocks GA4 until consent**, or
- A switch from GA4 to a cookieless analytics tool (Plausible / Fathom / Simple Analytics).

The owner did not select a consent banner. **Implementer should still ship a minimal, accessible consent banner that defers GA4 loading until the visitor accepts**, even if not strictly required by the chosen feature set, to keep launch defensible. Flag with owner.

---

## 12. Implementation Phases

Recommended order for an LLM-driven implementation:

**Phase 1 — Scaffold & Foundations**
- Astro project, Tailwind, content collections schemas, base layouts, design tokens, dark mode toggle, GH Actions deploy pipeline, CNAME, Pagefind wired in.

**Phase 2 — Brand & Components**
- Logo (wordmark + mark), color palette, type system, button/card/section primitives, header, footer, dual-CTA component.

**Phase 3 — Marketing Pages**
- Homepage, Features overview, **six** feature sub-pages (YMM Search, Catalog Sync, PDP, **In-Cart Fitment**, P&I Sync, Order Export), Integrations index + three sub-pages, **Merchant of Record**, Pricing, About, Contact, Demo.

**Phase 4 — Content Surfaces**
- Blog (index, post, tag) with 2 placeholder posts; Changelog (index, entry) with 2 placeholder entries; Customers (logo wall + 2 placeholder case studies).

**Phase 5 — Forms, Analytics, SEO Polish**
- Formspree wiring for all three forms; GA4; sitemap; robots; canonical URLs; OG/Twitter cards; JSON-LD; consent banner; RSS feeds; 404 page.

**Phase 6 — Legal & QA**
- Privacy, Terms, Security pages (templates); accessibility audit; Lighthouse pass; cross-browser/responsive QA; placeholder→real-content swap checklist.

---

## 13. Definition of Done

- Site builds and deploys to GitHub Pages on the custom domain via the Actions workflow.
- All pages in §4 exist and render with placeholder content where real content is not yet supplied.
- Both CTAs (Book a Demo, Install on Shopify) are present in the header, hero, end-of-page band, and footer.
- Dark mode works site-wide and persists.
- Pagefind search returns results across blog, changelog, and marketing content.
- All three Formspree forms successfully submit to a configured endpoint.
- GA4 fires page views and the two conversion events (App Store outbound click, Demo form submit).
- Lighthouse targets met on homepage and one feature page.
- The owner has been handed a checklist of items to swap from placeholder to real (logos, screenshots, copy refinements, legal review).
