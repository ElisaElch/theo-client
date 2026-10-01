// Matches the API's Place and Visit models

export type PlaceType = "cafe" | "restaurant" | "hotel";

export type Photo = {
  url: string;
  publicId: string;
};

export type Place = {
  _id: string;
  externalId: string;
  type: PlaceType;
  name: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
};

export type Visit = {
  _id: string;
  user: string;
  place: Place; // filled in by populate("place") on the API
  type: PlaceType; // this person's own category (the API falls back to the place's type)
  status: "visited" | "wantToGo";
  visitDate?: string; // dates arrive as text in JSON, e.g. "2025-03-12T00:00:00.000Z"
  rating?: number; // 1–10, or 11 for an exceptional place
  exceptionalReason: string; // why it earned the 11th star ("" otherwise)
  isFavourite: boolean;
  whatIHad: string;
  memory: string;
  tags: string[];
  photos: (Photo & { _id: string })[];
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
};
