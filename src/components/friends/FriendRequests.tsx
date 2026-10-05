import type { IncomingRequest, OutgoingRequest } from "../../types/friends";

type Props = {
  incoming: IncomingRequest[];
  outgoing: OutgoingRequest[];
  busyId: string | null; // the request currently being accepted, declined or cancelled
  onAccept: (connectionId: string) => void;
  onRemove: (connectionId: string) => void; // decline (incoming) or cancel (outgoing)
};

// Requests sent to me (full name) and requests I've sent (first name only)
function FriendRequests({ incoming, outgoing, busyId, onAccept, onRemove }: Props) {
  // Nothing to show: don't take up space on the page
  if (incoming.length === 0 && outgoing.length === 0) return null;

  return (
    <section className="card flex flex-col gap-6 bg-soft-white p-6">
      {/* Sent to me */}
      {incoming.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl">Friend requests ({incoming.length})</h2>
          {incoming.map((request) => (
            <div
              key={request.connectionId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-box bg-base-200 p-4"
            >
              <div>
                <p className="font-medium">{request.user.name}</p>
                <p className="text-sm text-ink/60">@{request.user.username}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={busyId === request.connectionId}
                  onClick={() => onAccept(request.connectionId)}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={busyId === request.connectionId}
                  onClick={() => onRemove(request.connectionId)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sent by me */}
      {outgoing.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl">Sent requests</h2>
          {outgoing.map((request) => (
            <div
              key={request.connectionId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-box bg-base-200 p-4"
            >
              <div>
                <p className="font-medium">{request.user.firstName}</p>
                <p className="text-sm text-ink/60">@{request.user.username} · waiting</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busyId === request.connectionId}
                onClick={() => onRemove(request.connectionId)}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FriendRequests;
