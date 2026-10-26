"use client";

import posthog from "posthog-js";

type AnalyticsEvent =
  | "search_completed"
  | "search_failed"
  | "game_selected"
  | "game_removed"
  | "game_analysis_failed"
  | "matching_started"
  | "matching_completed"
  | "matching_failed"
  | "match_feedback_shown"
  | "match_feedback_rated"
  | "match_feedback_details_submitted"
  | "recommendation_clicked"
  | "results_sorted";

type AnalyticsProperties = Record<string, string | number | boolean | string[]>;

export function trackEvent(event: AnalyticsEvent, properties: AnalyticsProperties) {
  if (
    process.env.NODE_ENV !== "production" ||
    !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    !process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) return;

  try {
    posthog.capture(event, properties);
  } catch {
    // Tracking failures must not affect searching or selecting a game.
  }
}
