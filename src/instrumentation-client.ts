// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // thebearingsapp project DSN — must match sentry.server/edge configs.
  // (Was the legacy cohort DSN until 2026-07-11 — client errors went to a dead project.)
  dsn: "https://2c9fd98e5532f30fb97564401b17e3f9@o4511715266723840.ingest.us.sentry.io/4511715268952064",

  // Dev noise + overhead off — Sentry only observes production.
  enabled: process.env.NODE_ENV === "production",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Privacy-first product — never send default PII (IP, user info) to Sentry.
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
