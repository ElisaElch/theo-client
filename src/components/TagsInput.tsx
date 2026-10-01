import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

const MAX_TAGS = 20; // same limit as the API

// Tag chips with an × to remove, and a box to add new ones (Enter or click away)
function TagsInput({ tags, onChange }: Props) {
  const [input, setInput] = useState("");

  function addTag() {
    const tag = input.trim();
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS) {
      onChange([...tags, tag]);
    }
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
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
      <input
        className="input w-full"
        placeholder="Type a tag and press Enter, e.g. Brunch"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
    </div>
  );
}

export default TagsInput;
