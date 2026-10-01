import { BedDouble, Coffee, UtensilsCrossed } from "lucide-react";
import type { PlaceType } from "../types/visit";

type Props = {
  value: PlaceType | ""; // "" = nothing chosen yet
  onChange: (type: PlaceType) => void;
};

const PLACE_TYPES: { value: PlaceType; label: string; Icon: typeof Coffee }[] = [
  { value: "cafe", label: "Café", Icon: Coffee },
  { value: "restaurant", label: "Restaurant", Icon: UtensilsCrossed },
  { value: "hotel", label: "Hotel", Icon: BedDouble },
];

// The three big type buttons (Café, Restaurant, Hotel)
function TypePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {PLACE_TYPES.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`flex flex-col items-center gap-2 rounded-box border-2 p-4 font-medium ${
            value === option.value
              ? "border-forest bg-soft-white"
              : "border-transparent bg-base-200 hover:border-base-300"
          }`}
        >
          <option.Icon className="h-6 w-6 text-forest" />
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TypePicker;
