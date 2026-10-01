import type { LocationResult } from "../../api/locationSearch";
import type { PlaceType, Photo } from "../../types/visit";

// A photo in the form: either new (a file on this device, not uploaded yet)
// or existing (already uploaded to Cloudinary, when editing a visit)
export type PhotoDraft = {
  previewUrl: string; // what the <img> shows
  file?: File; // only for new photos
  uploaded?: Photo; // only for existing photos: { url, publicId }
};

// Everything the Add a Place form collects across its four steps
export type AddPlaceForm = {
  // Step 1: Details
  type: PlaceType | ""; // "" = not chosen yet
  location: LocationResult | null; // chosen search result
  name: string; // starts as the search result's name, can be edited
  visitDate: string; // "2025-03-12", the format <input type="date"> uses
  tags: string[];
  // Step 2: Your experience
  rating: number; // 0 = not rated yet, 1–10, or 11 = exceptional
  exceptionalReason: string; // only used when rating is 11
  isFavourite: boolean;
  whatIHad: string;
  memory: string;
  // Step 3: Photos
  photos: PhotoDraft[];
};

export const emptyForm: AddPlaceForm = {
  type: "",
  location: null,
  name: "",
  visitDate: "",
  tags: [],
  rating: 0,
  exceptionalReason: "",
  isFavourite: false,
  whatIHad: "",
  memory: "",
  photos: [],
};

// Every step component receives the form and a way to change it
export type StepProps = {
  form: AddPlaceForm;
  updateForm: (changes: Partial<AddPlaceForm>) => void;
};
