import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { useAuth } from "../../context/useAuth";

// Copies a link like https://theo-client.vercel.app/friends/find?add=USERNAME
function InviteLinkButton({ className = "btn btn-secondary" }: { className?: string }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  async function copyInviteLink() {
    if (!user) return;
    const link = `${window.location.origin}/friends/find?add=${user.username}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // "Copied!" for 2 seconds
  }

  return (
    <button type="button" className={className} onClick={copyInviteLink}>
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy my invite link"}
    </button>
  );
}

export default InviteLinkButton;
