import { ImageIcon, MapPin, CalendarDays } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import type { AddPlaceForm } from "./formTypes";

const TYPE_LABELS = { cafe: "Café", restaurant: "Restaurant", hotel: "Hotel" };

// Live preview of the place card, shown next to the form
function PlacePreview({ form }: { form: AddPlaceForm }) {
  const coverPhoto = form.photos[0]?.previewUrl;

  return (
    <div className="card overflow-hidden bg-soft-white">
      {/* Cover photo, or a placeholder until one is added */}
      {coverPhoto ? (
        <img src={coverPhoto} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-base-200">
          <ImageIcon className="h-10 w-10 text-ink/30" />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl">{form.name || "Your place"}</h3>
          {form.type && <span className="badge badge-secondary">{TYPE_LABELS[form.type]}</span>}
        </div>

        {form.location && (
          <p className="flex items-center gap-1 text-sm text-ink/70">
            <MapPin className="h-4 w-4" />
            {[form.location.city, form.location.country].filter(Boolean).join(", ")}
          </p>
        )}

        {form.rating > 0 && (
          <p className="text-amber-400" aria-label={`${form.rating} out of 5 stars`}>
            {"★".repeat(form.rating)}
            <span className="text-base-300">{"★".repeat(5 - form.rating)}</span>
          </p>
        )}

        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {form.tags.map((tag) => (
              <span key={tag} className="badge bg-base-200">
                {tag}
              </span>
            ))}
          </div>
        )}

        {form.visitDate && (
          <p className="flex items-center gap-1 text-sm text-ink/70">
            <CalendarDays className="h-4 w-4" />
            {formatDate(form.visitDate)}
          </p>
        )}
      </div>
    </div>
  );
}

export default PlacePreview;
