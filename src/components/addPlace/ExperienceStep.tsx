import { useState } from "react";
import { Heart, Star } from "lucide-react";
import type { StepProps } from "./formTypes";

// Step 2: rating (1–10, plus the exceptional 11th star), favourite,
// what you had, and your memory of the place
function ExperienceStep({ form, updateForm }: StepProps) {
  // The star the mouse is over, to preview a rating before clicking
  const [hoverRating, setHoverRating] = useState(0);
  const shownRating = hoverRating || form.rating;

  // Clicking the same star again clears the rating
  function handleStarClick(star: number) {
    updateForm({ rating: form.rating === star ? 0 : star });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Your experience</h2>

      {/* Rating */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Your rating</legend>

        <div className="flex flex-wrap items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
          {/* Stars 1–10 */}
          {Array.from({ length: 10 }, (_, index) => {
            const star = index + 1;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                aria-label={`${star} out of 10`}
                aria-pressed={form.rating === star}
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= Math.min(shownRating, 10)
                      ? "fill-amber-400 text-amber-400"
                      : "text-base-300"
                  }`}
                />
              </button>
            );
          })}

          {/* The 11th star: unlocks once a place gets 10/10 */}
          <button
            type="button"
            onClick={() => handleStarClick(11)}
            onMouseEnter={() => form.rating >= 10 && setHoverRating(11)}
            disabled={form.rating < 10}
            aria-label="Exceptional: the 11th star"
            aria-pressed={form.rating === 11}
            title={form.rating < 10 ? "Give it 10 stars first" : "Better than perfect"}
            className="ml-2 disabled:opacity-30"
          >
            <Star
              className={`h-9 w-9 ${
                shownRating === 11 ? "fill-terracotta text-terracotta" : "text-terracotta"
              }`}
            />
          </button>

          {form.rating > 0 && (
            <span className="ml-3 text-sm text-ink/70">
              {form.rating === 11 ? "Exceptional" : `${form.rating}/10`}
            </span>
          )}
        </div>
      </fieldset>

      {/* Why it's exceptional (only for the 11th star) */}
      {form.rating === 11 && (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">What made it exceptional?</span>
          <input
            className="input w-full"
            placeholder="e.g. The best chai latte I've ever had"
            maxLength={150}
            value={form.exceptionalReason}
            onChange={(e) => updateForm({ exceptionalReason: e.target.value })}
          />
        </label>
      )}

      {/* Favourite: separate from the rating */}
      <button
        type="button"
        onClick={() => updateForm({ isFavourite: !form.isFavourite })}
        aria-pressed={form.isFavourite}
        className="btn btn-ghost self-start"
      >
        <Heart className={`h-5 w-5 ${form.isFavourite ? "fill-terracotta text-terracotta" : ""}`} />
        {form.isFavourite ? "In your favourites" : "Add to favourites"}
      </button>

      {/* What I had */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">What did you have?</span>
        <input
          className="input w-full"
          placeholder="e.g. Flat white + banana bread"
          maxLength={300}
          value={form.whatIHad}
          onChange={(e) => updateForm({ whatIHad: e.target.value })}
        />
      </label>

      {/* Memory */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Your memory</span>
        <textarea
          className="textarea h-36 w-full"
          placeholder="What made it special? Who were you with? How did it feel?"
          maxLength={2000}
          value={form.memory}
          onChange={(e) => updateForm({ memory: e.target.value })}
        />
        <span className="self-end text-xs text-ink/60">{form.memory.length}/2000</span>
      </label>
    </div>
  );
}

export default ExperienceStep;
