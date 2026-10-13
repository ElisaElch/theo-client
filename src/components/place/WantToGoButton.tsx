import { useState } from "react";
import { Link } from "react-router";
import { Check, Heart, Pencil } from "lucide-react";
import { saveFriendPlace } from "../../api/friends";
import type { MyVisitSummary } from "../../types/friends";

type Props = {
  friendId: string;
  visitId: string; // the friend's visit
  myVisit: MyVisitSummary | null; // do I already have this place, and how?
};

// On a friend's place: "I want to go here" (one tap saves it to your Want to go list),
// or a link to your own place if you already have it
function WantToGoButton({ friendId, visitId, myVisit: initialMyVisit }: Props) {
  const [myVisit, setMyVisit] = useState(initialMyVisit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setIsSaving(true);
    setError("");

    try {
      const result = await saveFriendPlace(friendId, visitId);
      setMyVisit(result.myVisit); // the button switches to "On your Want to go list"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save this place. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // Already been there: link to your own visit
  if (myVisit?.status === "visited") {
    return (
      <Link
        to={`/places/${myVisit.id}`}
        className="btn btn-ghost btn-sm self-start border border-base-300"
      >
        <Check className="h-4 w-4" />
        You've been here
      </Link>
    );
  }

  // Already on your list: link to it, and a quick way to add a note
  if (myVisit?.status === "wantToGo") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={`/places/${myVisit.id}`}
          className="btn btn-sm border-none bg-peach text-forest hover:bg-peach/80"
        >
          <Heart className="h-4 w-4 fill-current" />
          On your Want to go list
        </Link>
        <Link to={`/places/${myVisit.id}/edit`} className="btn btn-ghost btn-sm">
          <Pencil className="h-4 w-4" />
          Add a note
        </Link>
      </div>
    );
  }

  // Not saved yet
  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        className="btn btn-sm border-none bg-sage/40 text-forest hover:bg-sage/60"
        onClick={handleSave}
        disabled={isSaving}
      >
        <Heart className="h-4 w-4" />
        {isSaving ? "Saving..." : "I want to go here"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default WantToGoButton;