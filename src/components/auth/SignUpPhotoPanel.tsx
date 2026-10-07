import { Heart, MapPin, Users } from "lucide-react";
import logo from "../../assets/theo-logo.svg";
import photo from "../../assets/signup-photo.webp";

// The three features listed on the photo
const FEATURES = [
  {
    icon: MapPin,
    title: "Discover hidden gems",
    text: "Real recommendations from people you trust.",
  },
  {
    icon: Users,
    title: "Connect with friends",
    text: "Share, recommend and explore together.",
  },
  {
    icon: Heart,
    title: "Build your travel story",
    text: "Save your favourite places and memories in one beautiful space.",
  },
];

// Left half of the sign-up page: photo with logo, headline, features and a handwritten note.
// Hidden on small screens (lg:block), where the form gets the whole width.
// The panel stretches to the full height of the form, so it's tall like the photo.
function SignUpPhotoPanel() {
  return (
    <aside className="relative hidden overflow-hidden lg:block lg:w-1/2">
      {/* The photo fills the whole panel; object-top keeps the sky and crops the bottom */}
      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />

      <div className="relative flex h-full flex-col p-10 xl:p-14">
        <img src={logo} alt="theo" className="w-40" />

        <p className="mt-8 max-w-lg font-display text-4xl leading-[1.05] tracking-tight text-forest">
          Remember where you've been. Discover where to go next.
        </p>
        <p className="mt-3 max-w-sm text-base text-ink">
          Save, share and discover incredible places with people who inspire you.
        </p>

        {/* Features on a soft beige panel, so they stay readable over the sea */}
        <ul className="mt-8 flex max-w-sm flex-col gap-4 rounded-3xl bg-cream/80 p-5 backdrop-blur-sm">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-1 size-6 shrink-0 text-forest" aria-hidden="true" />
              <div>
                <p className="font-heading text-lg font-semibold text-forest">{title}</p>
                <p className="text-sm text-ink">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Handwritten note over the sand */}
      <p className="absolute top-[62%] left-20 max-w-40 rotate-[-8deg] font-hand text-3xl leading-tight font-semibold text-forest">
        Little places. Lasting memories
      </p>
    </aside>
  );
}

export default SignUpPhotoPanel;