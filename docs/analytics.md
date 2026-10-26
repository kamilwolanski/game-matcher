# Product analytics

PostHog initializes in `instrumentation-client.ts` in production builds only.
Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (the public project token) and
`NEXT_PUBLIC_POSTHOG_HOST` (`https://eu.i.posthog.com` for EU) before building.
Changing these variables on Vercel requires a new deployment. Development mode
does not send events. Existing Vercel Analytics remains enabled.

Page views include client-side navigation. Autocapture and session replay are
disabled. Custom properties contain game searches (trimmed, up to 200 characters),
game IDs/names, selected tags, result counts, positions, durations, feedback
ratings/reasons, and explicitly submitted feedback comments. No user
identification is performed; the SDK uses its anonymous browser identity.

| Event | When / useful properties |
| --- | --- |
| `search_completed` | Successful results remain unchanged for 1.2 seconds; query, result_count, duration_ms. Zero results are included. Intermediate requests cancelled by typing are excluded. |
| `search_failed` | Search request fails; query, duration_ms. Aborted requests are excluded. |
| `game_selected` | Game picked from search; query, game_id, game_name, position (1-based). Includes the query even when selected before search_completed fires. |
| `game_removed` | Selected game removed; game_id. |
| `game_analysis_failed` | Loading/analyzing a selected game fails; game_id, game_name. |
| `matching_started` | Find matches clicked; game_names, game_count, tags. |
| `matching_completed` | Matches returned; same inputs plus result_count, strong_result_count (similarity >= 0.5), duration_ms. |
| `matching_failed` | Matching request fails; same inputs, duration_ms. |
| `recommendation_clicked` | Matcher result opened by mouse or keyboard; game_id, game_name, similarity, position within section (1-based), section, sort. |
| `results_sorted` | Sort selected; sort. |
| `match_feedback_shown` | At least half of the inline feedback panel enters the viewport in a visible tab, or a rating is clicked; once per completed matching request. |
| `match_feedback_rated` | Immediate Yes / Not sure / No answer; rating (`yes`, `unsure`, `no`). One answer per completed request. |
| `match_feedback_details_submitted` | Optional follow-up explicitly submitted after Not sure / No; rating, reason, comment (trimmed, max 500 characters). Skipping does not discard the initial rating. |

Matching events include a `match_id`. All feedback events include this same ID,
the original `game_names`, `game_count`, `tags`, `result_count`, and
`strong_result_count`. These are snapshots from the completed request, so editing
the inputs afterwards does not change the feedback context. New successful
requests allow a new rating; sorting and loading more results preserve the rating.
Feedback is also available for completed requests with no results. No database
or additional API is used; feedback follows the existing PostHog production-only
configuration. Comments are sent only on explicit submission, never while typing.

## Feedback dashboard

- Rating distribution: Trends, `match_feedback_rated`, Total count, breakdown by
  `rating`, total-value bar chart. This measures answers, not all visitors.
- Response rate: a funnel from `match_feedback_shown` to `match_feedback_rated`.
  Match `match_id` across steps to keep each response tied to its exposure.
- Causes of dissatisfaction: `match_feedback_details_submitted`, breakdown by
  `reason`. Filter out empty reasons (comment-only submissions).
- Written feedback: inspect `match_feedback_details_submitted` events and their
  `comment`, alongside `game_names` and `tags`.

For manual verification, complete a match, scroll to the panel after the first
five cards, and rate it. Check that the exposure fires once, the rating fires
immediately, and details fire only after Send feedback. Sort or load more results:
the answer must remain saved without new exposure/rating events. Change the input
tags without matching again: feedback must still carry the old input snapshot.
Run matching again to see a fresh panel with a new `match_id`. Also check the
no-results state, Skip, whitespace-only comments, and the 500-character limit.

## Verify after deployment

Open PostHog's live activity view, then open the deployed site with analytics
requests allowed by the browser. Search for a game, pause on results, select it,
find matches, and open a result. Check the events and their properties. This
requires a production build; `npm run dev` intentionally sends no analytics.

Suggested dashboard: most popular search queries, queries with zero results,
selected games, matching duration, failures, and a funnel from pageview to
game_selected to matching_completed to recommendation_clicked. Search events
measure pauses on results rather than every keystroke; use game_selected.query
to analyze searches that immediately led to selection.
