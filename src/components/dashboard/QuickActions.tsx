import { Link } from "react-router";
import { Bookmark, Compass, Send, Users } from "lucide-react";

// The four shortcut cards
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
  {
    to: "/my-places?tab=want-to-go",
    icon: Send,
    title: "Plan your next trip",
    text: "Your Want to go list, for wherever you're heading next.",
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

// Four shortcut cards under the greeting
function QuickActions() {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {LINKS.map(({ to, icon, title, text }) => (
        <Link key={to} to={to} className={CARD}>
          <IconBadge icon={icon} />
          <span className="font-medium text-ink">{title}</span>
          <span className="text-sm text-ink/70">{text}</span>
        </Link>
      ))}
    </section>
  );
}

export default QuickActions;