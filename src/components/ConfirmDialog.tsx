import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string; // e.g. "Delete place"
  busyLabel?: string; // e.g. "Deleting...", shown while waiting
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// "Are you sure?" pop-up for actions that can't be undone.
// Uses the browser's built-in <dialog>, styled with daisyUI's modal classes.
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busyLabel = "Please wait...",
  isBusy = false,
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open or close the browser dialog when `open` changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // onClose also runs when the user presses Escape
    <dialog ref={dialogRef} className="modal" onClose={onCancel}>
      <div className="modal-box bg-soft-white">
        <h3 className="text-2xl">{title}</h3>
        <p className="py-4 text-ink/80">{message}</p>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isBusy}>
            Cancel
          </button>
          <button type="button" className="btn btn-error" onClick={onConfirm} disabled={isBusy}>
            {isBusy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>

      {/* Clicking the dark background outside the box closes the dialog */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit">Close</button>
      </form>
    </dialog>
  );
}

export default ConfirmDialog;
