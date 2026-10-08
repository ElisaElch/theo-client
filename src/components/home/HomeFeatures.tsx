import { Heart, Map, MapPin, Users } from "lucide-react";

// The four features, each with its own blob colour and shape (like the mockup).
// The shapes are made with uneven rounded corners, so no two blobs look the same.
const FEATURES = [
  {
    icon: MapPin,
    title: "Discover",
    text: "Find amazing cafés, restaurants and hotels, recommended by people you trust.",
    blob: "bg-sage text-forest rounded-[60%_40%_55%_45%/55%_45%_60%_40%]",
  },
  {
    icon: Heart,
    title: "Remember",
    text: "Save the places you've been, with your photos, notes and memories.",
    blob: "bg-lavender text-forest rounded-[45%_55%_40%_60%/60%_40%_55%_45%]",
  },
  {
    icon: Users,
    title: "Share",
    text: "See where your friends have been and get inspired for your next trip.",
    blob: "bg-terracotta text-soft-white rounded-[55%_45%_60%_40%/45%_60%_40%_55%]",
  },
  {
    icon: Map,
    title: "Map",
    text: "See every place you've saved on one map, wherever in the world it is.",
    blob: "bg-peach text-forest rounded-[40%_60%_45%_55%/55%_40%_60%_45%]",
  },
];

// "A better way to explore": four features in a row (two per row on tablets, one on phones)
function HomeFeatures() {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="text-center font-sans text-xs font-medium tracking-[0.3em] text-ink/70 uppercase">
        A better way to explore
      </h2>

      <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text, blob }) => (
          <li key={title} className="flex flex-col items-center gap-3 text-center">
            <div className={`flex h-20 w-24 items-center justify-center ${blob}`}>
              <Icon className="size-8" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-3xl font-semibold text-forest">{title}</h3>
            <p className="max-w-60 text-ink">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HomeFeatures;