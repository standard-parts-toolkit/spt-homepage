// Site-wide constants.

// Shopify App Store listing — target for the "Install on Shopify" CTAs.
// Overridable at build time via PUBLIC_SHOPIFY_APP_URL; defaults to the live listing.
export const SHOPIFY_APP_URL =
  import.meta.env.PUBLIC_SHOPIFY_APP_URL || 'https://apps.shopify.com/standard-parts-toolkit';

// Formspree form IDs (these are public — they appear in the form `action` URL).
// Overridable at build time via the matching PUBLIC_FORMSPREE_* vars.
export const FORMSPREE_CONTACT_ID =
  import.meta.env.PUBLIC_FORMSPREE_CONTACT_ID || 'mrevqgnr';
export const FORMSPREE_DEMO_ID =
  import.meta.env.PUBLIC_FORMSPREE_DEMO_ID || 'mgobkegl';

// GA4 measurement ID (public — exposed client-side by design).
// Overridable via PUBLIC_GA4_ID; set to '' to disable analytics + consent banner.
export const GA4_ID =
  import.meta.env.PUBLIC_GA4_ID ?? 'G-N1T9TZ6921';
