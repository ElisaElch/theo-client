import { useSearchParams } from "react-router";
import FindFriend from "../components/friends/FindFriend";
import { useFriendsData } from "../components/friends/friendsData";
import InviteLinkButton from "../components/friends/InviteLinkButton";

// Find people by their exact username, or share your invite link
function FindFriendsPage() {
  const { reload } = useFriendsData();
  const [searchParams] = useSearchParams();
  const inviteUsername = searchParams.get("add") ?? ""; // from an invite link

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <header>
        <h1 className="text-5xl">Find friends</h1>
        <p className="mt-2 text-lg text-ink/70">
          Theo only finds people by their exact username, so nobody can browse who's here.
        </p>
      </header>

      {/* Reuses the search from before; reload() updates the sidebar's request badge too */}
      <FindFriend initialUsername={inviteUsername} onChanged={reload} />

      <section className="card flex flex-col gap-3 bg-soft-white p-6">
        <h2 className="text-2xl">Invite a friend</h2>
        <p className="text-sm text-ink/70">
          Not on Theo yet? Send them your link. After signing up, they'll land right here with your
          username ready to add.
        </p>
        <InviteLinkButton className="btn btn-secondary self-start" />
      </section>
    </div>
  );
}

export default FindFriendsPage;
