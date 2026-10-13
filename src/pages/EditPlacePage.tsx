import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { preparePhotos } from "../api/uploads";
import { getVisit, updateVisit } from "../api/visits";
import ExperienceStep from "../components/addPlace/ExperienceStep";
import { emptyForm, type AddPlaceForm } from "../components/addPlace/formTypes";
import PhotosStep from "../components/addPlace/PhotosStep";
import TagsInput from "../components/TagsInput";
import TypePicker from "../components/TypePicker";
import type { Visit } from "../types/visit";
import { todayLocal } from "../utils/today";

// Links must be web addresses (the API checks this too)
const LINK_PATTERN = /^https?:\/\//i;

// Edit your visit: your type, date, tags, rating, favourite, what you had, memory, photos.
// For a Want to go place: your type, note, link and tags instead.
// With ?visited=1 ("I've been here"), a Want to go place becomes a visited one.
// The place itself (name, location) isn't editable, because it's shared with others.
function EditPlacePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
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
          status: visit.status,
          type: visit.type, // your own category
          visitDate: visit.visitDate?.slice(0, 10) ?? "", // "2025-03-12T00:00..." → "2025-03-12"
          tags: visit.tags,
          rating: visit.rating ?? 0,
          exceptionalReason: visit.exceptionalReason,
          isFavourite: visit.isFavourite,
          whatIHad: visit.whatIHad,
          memory: visit.memory,
          wantToGoNote: visit.wantToGoNote,
          link: visit.links[0]?.url ?? "", // one link in the form for now
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

  // Which version of the page to show
  const isWantToGoPlace = visit?.status === "wantToGo";
  const isMarkingVisited = isWantToGoPlace && searchParams.get("visited") === "1";
  const isEditingWantToGo = isWantToGoPlace && !isMarkingVisited;

  // --- Save a Want to go place: type, note, link and tags ---
  async function saveWantToGo(visitId: string) {
    const link = form.link.trim();
    if (link && !LINK_PATTERN.test(link)) {
      return setError("Links must start with https:// or http://");
    }

    await updateVisit(visitId, {
      type: form.type || undefined,
      tags: form.tags,
      wantToGoNote: form.wantToGoNote.trim(),
      links: link ? [{ url: link }] : [],
    });
    navigate(`/places/${visitId}`, { replace: true });
  }

  // --- Save a visit (or "I've been here"): same rules as adding a place ---
  async function saveVisited(visitId: string) {
    if (!form.visitDate) return setError("Please add the date you visited.");
    if (form.visitDate > todayLocal()) return setError("The visit date can't be in the future.");
    if (form.rating === 0) return setError("Please add a rating.");
    if (form.rating === 11 && !form.exceptionalReason.trim()) {
      return setError("Tell us what made it exceptional, or remove the 11th star.");
    }

    const photos = await preparePhotos(form.photos);

    await updateVisit(visitId, {
      status: "visited", // turns a Want to go place into a visited one; no change otherwise
      type: form.type || undefined,
      visitDate: form.visitDate,
      tags: form.tags,
      rating: form.rating,
      exceptionalReason: form.rating === 11 ? form.exceptionalReason.trim() : "",
      isFavourite: form.isFavourite,
      whatIHad: form.whatIHad,
      memory: form.memory,
      photos, // the full new list: the API deletes any removed photos from Cloudinary
      // The note and link aren't sent, so they're kept exactly as they were
    });
    navigate(`/places/${visitId}`, { replace: true });
  }

  async function handleSave() {
    if (!id) return;
    if (!form.type) return setError("Please choose a type of place.");

    setIsSaving(true);
    setError("");

    try {
      if (isEditingWantToGo) {
        await saveWantToGo(id);
      } else {
        await saveVisited(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false); // also when a check above stopped the save
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

  const today = todayLocal(); // in the user's own time zone
  const placeLocation = [visit.place.city, visit.place.country].filter(Boolean).join(", ");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header>
        <h1>
          {isMarkingVisited ? `You've been to ${visit.place.name}!` : `Edit ${visit.place.name}`}
        </h1>
        <p className="mt-2 text-ink/70">
          {isMarkingVisited ? "Add your visit and memories." : placeLocation}
        </p>
      </header>

      {/* Type, and date or note + link, and tags */}
      <section className="card flex flex-col gap-6 bg-soft-white p-6">
        <h2 className="text-3xl">Details</h2>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">What type of place is it for you?</legend>
          <TypePicker value={form.type} onChange={(type) => updateForm({ type })} />
        </fieldset>

        {isEditingWantToGo ? (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Why do you want to go? (optional)</span>
              <textarea
                className="textarea w-full"
                rows={3}
                maxLength={300}
                placeholder="e.g. Lena says the cardamom buns are amazing"
                value={form.wantToGoNote}
                onChange={(e) => updateForm({ wantToGoNote: e.target.value })}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Link (optional)</span>
              <input
                type="url"
                className="input w-full"
                placeholder="e.g. an Instagram reel or Google Maps link"
                value={form.link}
                onChange={(e) => updateForm({ link: e.target.value })}
              />
            </label>
          </>
        ) : (
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
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tags (optional)</span>
          <TagsInput tags={form.tags} onChange={(tags) => updateForm({ tags })} />
        </div>
      </section>

      {/* Rating, memory and photos: only for places you've been to */}
      {!isEditingWantToGo && (
        <>
          {/* Reused from Add a Place */}
          <section className="card bg-soft-white p-6">
            <ExperienceStep form={form} updateForm={updateForm} />
          </section>

          <section className="card bg-soft-white p-6">
            <PhotosStep form={form} updateForm={updateForm} />
          </section>
        </>
      )}

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
          {isSaving ? "Saving..." : isMarkingVisited ? "Save my visit" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default EditPlacePage;
