import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

const MAX_TAGS = 20; // same limit as the API

// Tag chips with an × to remove, and a box to add new ones.
// A tag is added with Enter, a comma, the Add button, or by clicking away.
function TagsInput({ tags, onChange }: Props) {
  const [input, setInput] = useState("");

  // Adds several tags at once, skipping empty ones, duplicates and anything over the limit
  function addTags(values: string[]) {
    const next = [...tags];
    for (const value of values) {
      const tag = value.trim();
      if (tag && !next.includes(tag) && next.length < MAX_TAGS) {
        next.push(tag);
      }
    }
    // Only update if something was actually added
    if (next.length !== tags.length) onChange(next);
  }

  // Turns whatever is in the box into tags, then empties it
  function commitInput() {
    addTags(input.split(","));
    setInput("");
  }

  // While typing: everything before a comma becomes a tag straight away.
  // Also handles pasting "brunch, coffee, tea" in one go.
  function handleChange(value: string) {
    if (!value.includes(",")) {
      setInput(value);
      return;
    }
    const parts = value.split(",");
    const stillTyping = parts.pop() ?? ""; // the bit after the last comma
    addTags(parts);
    setInput(stillTyping.trimStart());
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // don't submit the whole form
      commitInput();
    }
  }

  function removeTag(tagToRemove: string) {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div className="flex flex-col gap-2">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="badge gap-1 bg-base-200 py-3">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* daisyUI "join": the input and the Add button share one rounded outline */}
      <div className="join w-full">
        <input
          className="input join-item w-full"
          placeholder="Type a tag, then press Enter or add a comma"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitInput}
        />
        <button
          type="button"
          className="btn join-item"
          onClick={commitInput}
          disabled={!input.trim()}
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}

export default TagsInput;
