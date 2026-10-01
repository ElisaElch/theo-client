import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { preparePhotos } from "../api/uploads";
import { createVisit } from "../api/visits";
import DetailsStep from "../components/addPlace/DetailsStep";
import ExperienceStep from "../components/addPlace/ExperienceStep";
import { emptyForm, type AddPlaceForm } from "../components/addPlace/formTypes";
import PhotosStep from "../components/addPlace/PhotosStep";
import PlacePreview from "../components/addPlace/PlacePreview";
import ReviewStep from "../components/addPlace/ReviewStep";

const STEPS = ["Details", "Your experience", "Photos", "Review"];

function AddPlacePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AddPlaceForm>(emptyForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Steps send only what changed; merge it into the form
  function updateForm(changes: Partial<AddPlaceForm>) {
    setForm((current) => ({ ...current, ...changes }));
  }

  // --- Free the temporary preview URLs of new photos when leaving the page ---
  const photosRef = useRef(form.photos);
  useEffect(() => {
    photosRef.current = form.photos;
  }, [form.photos]);
  useEffect(() => {
    return () =>
      photosRef.current.forEach((photo) => {
        if (photo.file) URL.revokeObjectURL(photo.previewUrl);
      });
  }, []);

  // --- What's still missing on the current step? ("" = nothing) ---
  function missingOnStep(stepNumber: number): string {
    if (stepNumber === 1) {
      if (!form.type) return "Please choose a type of place.";
      if (!form.location) return "Please find the place, or use your current location.";
      if (!form.name.trim()) return "Please give the place a name.";
      if (!form.visitDate) return "Please add the date you visited.";
    }
    if (stepNumber === 2) {
      if (form.rating === 0) return "Please add a rating.";
      if (form.rating === 11 && !form.exceptionalReason.trim()) {
        return "Tell us what made it exceptional, or remove the 11th star.";
      }
    }
    return "";
  }

  function goToStep(target: number) {
    setError("");
    setStep(target);
  }

  function handleNext() {
    const missing = missingOnStep(step);
    if (missing) {
      setError(missing);
      return;
    }
    goToStep(step + 1);
  }

  // --- Save: upload photos first, then create the visit ---
  async function handleSave() {
    if (!form.location || !form.type) return;

    setIsSaving(true);
    setError("");

    try {
      const photos = await preparePhotos(form.photos);

      const { visit } = await createVisit({
        place: {
          externalId: form.location.externalId,
          type: form.type,
          name: form.name.trim(),
          city: form.location.city,
          country: form.location.country,
          coordinates: form.location.coordinates,
        },
        visitDate: form.visitDate,
        rating: form.rating,
        exceptionalReason: form.rating === 11 ? form.exceptionalReason.trim() : "",
        isFavourite: form.isFavourite,
        whatIHad: form.whatIHad,
        memory: form.memory,
        tags: form.tags,
        photos,
      });

      navigate(`/places/${visit._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
      {/* Left: the form */}
      <div className="flex flex-col gap-6">
        <div>
          <h1>Add a place</h1>
          <p className="mt-2 text-ink/70">Capture the places that make life richer.</p>
        </div>

        {/* Step indicator (daisyUI steps) */}
        <ul className="steps w-full">
          {STEPS.map((label, index) => (
            <li key={label} className={`step ${index + 1 <= step ? "step-primary" : ""}`}>
              {label}
            </li>
          ))}
        </ul>

        {/* The current step */}
        <div className="card bg-soft-white p-6">
          {step === 1 && <DetailsStep form={form} updateForm={updateForm} />}
          {step === 2 && <ExperienceStep form={form} updateForm={updateForm} />}
          {step === 3 && <PhotosStep form={form} updateForm={updateForm} />}
          {step === 4 && <ReviewStep form={form} goToStep={goToStep} />}
        </div>

        {error && (
          <div role="alert" className="alert alert-error">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => goToStep(step - 1)}
              disabled={isSaving}
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next: {STEPS[step]}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save place"}
            </button>
          )}
        </div>
      </div>

      {/* Right: live preview (desktop only) */}
      <aside className="hidden lg:block">
        <div className="sticky top-8 flex flex-col gap-3">
          <h2 className="text-2xl">Preview</h2>
          <p className="text-sm text-ink/70">This is how your place will look.</p>
          <PlacePreview form={form} />
        </div>
      </aside>
    </div>
  );
}

export default AddPlacePage;
