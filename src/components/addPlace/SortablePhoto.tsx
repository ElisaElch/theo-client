import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

type Props = {
  id: string; // unique id dnd-kit uses to track this photo
  src: string;
  alt: string;
  isCover: boolean; // the first photo is shown everywhere first
  onRemove: () => void;
};

// One photo tile that can be dragged to a new position
function SortablePhoto({ id, src, alt, isCover, onRemove }: Props) {
  // dnd-kit gives back everything needed to make this tile draggable
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  // Moves the tile visually while it's being dragged
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative cursor-grab active:cursor-grabbing ${
        isDragging ? "z-10 opacity-70 shadow-lg" : ""
      }`}
    >
      <img
        src={src}
        alt={alt}
        draggable={false} // stops the browser's own image dragging from interfering
        className="aspect-square w-full rounded-box object-cover"
      />

      {isCover && <span className="badge badge-primary absolute bottom-2 left-2">Cover</span>}

      <button
        type="button"
        onClick={onRemove}
        // Without this, pressing the × would start dragging the tile instead
        onPointerDown={(e) => e.stopPropagation()}
        className="btn btn-circle btn-sm absolute top-2 right-2"
        aria-label={`Remove ${alt}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default SortablePhoto;
