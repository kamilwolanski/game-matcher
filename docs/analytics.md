# Product analytics

PostHog initializes in `instrumentation-client.ts` in production builds only.
Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (the public project token) and
`NEXT_PUBLIC_POSTHOG_HOST` (`https://eu.i.posthog.com` for EU) before building.
Changing these variables on Vercel requires a new deployment. Development mode
does not send events. Existing Vercel Analytics remains enabled.

Page views include client-side navigation. Autocapture and session replay are
disabled. Custom properties contain game searches (trimmed, up to 200 characters),
game IDs/names, selected tags, result counts, positions, and durations. No user
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
