import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Bookmark, Compass, Send, Users } from "lucide-react";

// The three cards that go somewhere
const LINKS = [
  {
    
    to: "/map?show=friends",
    icon: Compass,
    title: "Explore places",
    text: "Find new spots recommended by friends.",
  },
  {
    to: "/my-places",
    icon: Bookmark,
    title: "My places",
    text: "All your favourite places in one spot.",
  },
  {
    to: "/friends/activity",
    icon: Users,
    title: "Friends' activity",
    text: "Discover where your friends have been.",
  },
];

// Shared look for all four cards
const CARD =
  "flex flex-col gap-3 rounded-2xl border border-base-300 bg-soft-white p-5 text-left transition hover:border-forest";

// The icon in its little round badge
function IconBadge({ icon: Icon }: { icon: typeof Compass }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-full bg-peach text-forest">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

// Four shortcut cards under the greeting.
// "Plan your next trip" isn't built yet: it shows a short "Coming soon" message instead.
function QuickActions() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Hide the "Coming soon" message again after 2.5 seconds
  useEffect(() => {
    if (!showComingSoon) return;
    const timer = setTimeout(() => setShowComingSoon(false), 2500);
    return () => clearTimeout(timer); // clean up if the page is left early
  }, [showComingSoon]);

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {LINKS.map(({ to, icon, title, text }) => (
        <Link key={to} to={to} className={CARD}>
          <IconBadge icon={icon} />
          <span className="font-medium text-ink">{title}</span>
          <span className="text-sm text-ink/70">{text}</span>
        </Link>
      ))}

      {/* Not a link yet: later this opens the Want to Go list */}
      <button type="button" className={CARD} onClick={() => setShowComingSoon(true)}>
        <IconBadge icon={Send} />
        <span className="font-medium text-ink">Plan your next trip</span>
        <span className="text-sm text-ink/70">Start a list for your upcoming adventure.</span>
      </button>

      {/* daisyUI toast: a small message near the bottom of the screen */}
      {showComingSoon && (
        <div className="toast toast-center z-20" role="status">
          <div className="alert bg-forest text-cream">Coming soon: plan trips with a Want to Go list.</div>
        </div>
      )}
    </section>
  );
}

export default QuickActions;