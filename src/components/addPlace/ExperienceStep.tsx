import type { StepProps } from "./formTypes";

// Step 2: rating, what you had, and your memory of the place
function ExperienceStep({ form, updateForm }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Your experience</h2>

      {/* Rating: daisyUI star rating, built from radio buttons */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Your rating</legend>
        <div className="rating rating-lg">
          {[1, 2, 3, 4, 5].map((star) => (
            <input
              key={star}
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-amber-400"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              checked={form.rating === star}
              onChange={() => updateForm({ rating: star })}
            />
          ))}
        </div>
      </fieldset>

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
