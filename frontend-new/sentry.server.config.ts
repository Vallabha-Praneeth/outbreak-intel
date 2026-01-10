import * as Sentry from "@sentry/nextjs"

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Adjust sample rate in production
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Enable debug mode in development
    debug: process.env.NODE_ENV === "development",

    // Set environment
    environment: process.env.NODE_ENV,
})
