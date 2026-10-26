"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, MessageSquare, ThumbsDown, ThumbsUp, Minus } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { type MatchFeedbackContext } from "@/lib/match-feedback";
import { cn } from "@/lib/utils";

const RATINGS = [
  { value: "yes", label: "Yes", Icon: ThumbsUp },
  { value: "unsure", label: "Not sure", Icon: Minus },
  { value: "no", label: "No", Icon: ThumbsDown },
] as const;

const REASONS = [
  { value: "poor_match", label: "Not similar enough" },
  { value: "already_known", label: "I know these games" },
  { value: "repetitive", label: "Same suggestions again" },
  { value: "other", label: "Something else" },
] as const;

type Rating = (typeof RATINGS)[number]["value"];

export function MatchFeedback({ context }: { context: MatchFeedbackContext }) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [finished, setFinished] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const shown = useRef(false);
  const rated = useRef(false);
  const detailsSent = useRef(false);
  const headingId = useId();
  const commentId = useId();

  const recordShown = () => {
    if (shown.current) return;
    shown.current = true;
    trackEvent("match_feedback_shown", { ...context });
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    // Count exposure only when the question actually enters the viewport.
    let inView = false;
    const recordExposure = () => {
      if (!inView || document.visibilityState !== "visible") return;
      if (!shown.current) {
        shown.current = true;
        trackEvent("match_feedback_shown", { ...context });
      }
      observer.disconnect();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      recordExposure();
    }, { threshold: 0.5 });
    observer.observe(panel);
    document.addEventListener("visibilitychange", recordExposure);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", recordExposure);
    };
  }, [context]);

  const chooseRating = (value: Rating) => {
    if (rated.current) return;
    rated.current = true;
    recordShown();
    trackEvent("match_feedback_rated", { ...context, rating: value });
    setRating(value);
    if (value === "yes") setFinished(true);
  };

  return (
    <div
      ref={panelRef}
      role="region"
      aria-labelledby={headingId}
      className="col-span-full rounded-2xl border border-primary/20 bg-linear-to-r from-primary/5 via-card to-secondary/5 p-4 sm:p-5"
    >
      {finished ? (
        <div role="status" className="flex items-center gap-3 py-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p id={headingId} className="text-sm font-medium">Thanks for your feedback!</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Your input helps us improve future matches.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 id={headingId} className="text-sm font-semibold">Did you find something you’d like to play?</h3>
                <p className="mt-1 text-xs text-muted-foreground">Help us make your next discovery better.</p>
              </div>
            </div>
            <div role="group" aria-label="Rate your matches" className="flex shrink-0 gap-2">
              {RATINGS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={rating === value}
                  disabled={rating !== null}
                  onClick={() => chooseRating(value)}
                  className={cn(
                    "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none",
                    rating === value
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-background/40 text-muted-foreground enabled:hover:border-primary/40 enabled:hover:text-foreground disabled:opacity-40",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          {rating && (
            <form
              className="mt-5 space-y-4 border-t border-border/70 pt-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (detailsSent.current || (!reason && !comment.trim())) return;
                detailsSent.current = true;
                trackEvent("match_feedback_details_submitted", {
                  ...context,
                  rating,
                  reason,
                  comment: comment.trim().slice(0, 500),
                });
                setFinished(true);
              }}
            >
              <fieldset>
                <legend className="mb-3 text-sm font-medium">What could be better? <span className="font-normal text-muted-foreground">(optional)</span></legend>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name={`feedback-reason-${headingId}`}
                        value={option.value}
                        checked={reason === option.value}
                        onChange={() => setReason(option.value)}
                        className="peer sr-only"
                      />
                      <span className="inline-flex min-h-10 items-center rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 peer-checked:border-primary/50 peer-checked:bg-primary/10 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor={commentId} className="mb-2 block text-xs text-muted-foreground">Anything else? (optional)</label>
                <textarea
                  id={commentId}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="What were you hoping to find?"
                  className="w-full resize-y rounded-xl border border-border bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">{comment.length}/500</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" disabled={!reason && !comment.trim()} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40">Send feedback</button>
                <button type="button" onClick={() => setFinished(true)} className="min-h-11 rounded-xl px-3 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Skip</button>
                <span className="text-xs text-muted-foreground" role="status">Your rating is saved.</span>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
