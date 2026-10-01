import { Heart } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import StarRating from "../StarRating";
import type { AddPlaceForm } from "./formTypes";

type Props = {
  form: AddPlaceForm;
  goToStep: (step: number) => void;
};

// Step 4: everything at a glance, with links back to each step
function ReviewStep({ form, goToStep }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Review</h2>
      <p className="text-ink/70">Check everything looks right, then save your place.</p>

      {/* Details */}
      <section className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl">Details</h3>
          <button type="button" className="link text-sm" onClick={() => goToStep(1)}>
            Edit
          </button>
        </div>
        <p className="font-medium">{form.name}</p>
        <p className="text-sm text-ink/70">{form.location?.label}</p>
        {form.visitDate && <p className="text-sm">Visited {formatDate(form.visitDate)}</p>}
      </section>

      {/* Experience */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl">Your experience</h3>
          <button type="button" className="link text-sm" onClick={() => goToStep(2)}>
            Edit
          </button>
        </div>

        <StarRating rating={form.rating} />

        {form.rating === 11 && form.exceptionalReason && (
          <p className="text-sm italic text-terracotta">
            Exceptional because: {form.exceptionalReason}
          </p>
        )}

        {form.isFavourite && (
          <p className="flex items-center gap-1 text-sm">
            <Heart className="h-4 w-4 fill-terracotta text-terracotta" />
            In your favourites
          </p>
        )}

        {form.whatIHad && (
          <p>
            <span className="font-medium">What I had:</span> {form.whatIHad}
          </p>
        )}
        {form.memory && <p className="whitespace-pre-line italic">"{form.memory}"</p>}
      </section>

      {/* Photos */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl">Photos ({form.photos.length})</h3>
          <button type="button" className="link text-sm" onClick={() => goToStep(3)}>
            Edit
          </button>
        </div>
        {form.photos.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {form.photos.map((photo, index) => (
              <img
                key={photo.previewUrl}
                src={photo.previewUrl}
                alt={`Photo ${index + 1}`}
                className="aspect-square w-full rounded-box object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/70">No photos added.</p>
        )}
      </section>
    </div>
  );
}

export default ReviewStep;
