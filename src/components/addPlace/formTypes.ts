import type { LocationResult } from "../../api/locationSearch";
import type { PlaceType } from "../../types/visit";

// A photo picked on this device but not uploaded yet
export type PhotoDraft = {
  file: File;
  previewUrl: string; // temporary local URL, so the preview shows instantly
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
  rating: number; // 0 = not rated yet
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
  whatIHad: "",
  memory: "",
  photos: [],
};

// Every step component receives the form and a way to change it
export type StepProps = {
  form: AddPlaceForm;
  updateForm: (changes: Partial<AddPlaceForm>) => void;
};
