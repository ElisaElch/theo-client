import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { preparePhotos } from "../api/uploads";
import { getVisit, updateVisit } from "../api/visits";
import ExperienceStep from "../components/addPlace/ExperienceStep";
import { emptyForm, type AddPlaceForm } from "../components/addPlace/formTypes";
import PhotosStep from "../components/addPlace/PhotosStep";
import TagsInput from "../components/TagsInput";
import type { Visit } from "../types/visit";

// Edit your visit: date, tags, rating, favourite, what you had, memory, photos.
// The place itself (name, location, type) isn't editable, because it's shared with others.
function EditPlacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [form, setForm] = useState<AddPlaceForm>(emptyForm);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- Load the visit and fill the form with its current values ---
  useEffect(() => {
    if (!id) return;
    let ignore = false;

    getVisit(id)
      .then(({ visit }) => {
        if (ignore) return;
        setVisit(visit);
        setForm({
          ...emptyForm,
          visitDate: visit.visitDate?.slice(0, 10) ?? "", // "2025-03-12T00:00..." → "2025-03-12"
          tags: visit.tags,
          rating: visit.rating ?? 0,
          exceptionalReason: visit.exceptionalReason,
          isFavourite: visit.isFavourite,
          whatIHad: visit.whatIHad,
          memory: visit.memory,
          // Existing photos: shown from Cloudinary, kept as they are unless removed
          photos: visit.photos.map((photo) => ({
            previewUrl: photo.url,
            uploaded: { url: photo.url, publicId: photo.publicId },
          })),
        });
      })
      .catch((err) => {
        if (!ignore) setLoadError(err instanceof Error ? err.message : "Couldn't load this place");
      });

    return () => {
      ignore = true;
    };
  }, [id]);

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

  // --- Save: same rules as adding a place ---
  async function handleSave() {
    if (!id) return;

    if (!form.visitDate) return setError("Please add the date you visited.");
    if (form.rating === 0) return setError("Please add a rating.");
    if (form.rating === 11 && !form.exceptionalReason.trim()) {
      return setError("Tell us what made it exceptional, or remove the 11th star.");
    }

    setIsSaving(true);
    setError("");

    try {
      const photos = await preparePhotos(form.photos);

      await updateVisit(id, {
        visitDate: form.visitDate,
        tags: form.tags,
        rating: form.rating,
        exceptionalReason: form.rating === 11 ? form.exceptionalReason.trim() : "",
        isFavourite: form.isFavourite,
        whatIHad: form.whatIHad,
        memory: form.memory,
        photos, // the full new list: the API deletes any removed photos from Cloudinary
      });

      navigate(`/places/${id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSaving(false);
    }
  }

  // --- Error and loading states ---
  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h1>Place not found</h1>
        <p className="text-ink/70">{loadError}</p>
        <Link to="/my-places" className="btn btn-primary">
          Back to My Places
        </Link>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header>
        <h1>Edit {visit.place.name}</h1>
        <p className="mt-2 text-ink/70">
          {[visit.place.city, visit.place.country].filter(Boolean).join(", ")}
        </p>
      </header>

      {/* Date and tags */}
      <section className="card flex flex-col gap-6 bg-soft-white p-6">
        <h2 className="text-3xl">Details</h2>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Date visited</span>
          <input
            type="date"
            className="input w-full"
            value={form.visitDate}
            max={today}
            onChange={(e) => updateForm({ visitDate: e.target.value })}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tags (optional)</span>
          <TagsInput tags={form.tags} onChange={(tags) => updateForm({ tags })} />
        </div>
      </section>

      {/* Reused from Add a Place */}
      <section className="card bg-soft-white p-6">
        <ExperienceStep form={form} updateForm={updateForm} />
      </section>

      <section className="card bg-soft-white p-6">
        <PhotosStep form={form} updateForm={updateForm} />
      </section>

      {error && (
        <div role="alert" className="alert alert-error">
          {error}
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Link to={`/places/${visit._id}`} className="btn btn-ghost">
          Cancel
        </Link>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default EditPlacePage;
