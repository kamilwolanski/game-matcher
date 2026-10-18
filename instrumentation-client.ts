import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (token && host && process.env.NODE_ENV === "production") {
  try {
    posthog.init(token, {
      api_host: host,
      ui_host: host.includes("eu.i.posthog.com")
        ? "https://eu.posthog.com"
        : "https://us.posthog.com",
      capture_pageview: "history_change",
      autocapture: false,
      disable_session_recording: true,
      person_profiles: "identified_only",
    });
  } catch {
    // Analytics must never prevent the application from loading.
  }
}
