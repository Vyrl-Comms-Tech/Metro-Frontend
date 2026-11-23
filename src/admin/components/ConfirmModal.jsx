import Modal from "./Modal";

// Confirmation dialog for destructive actions. onConfirm is async: the button shows
// the busy label while it runs, the dialog closes when it resolves and shows the
// error if it throws.
export default function ConfirmModal({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  busyLabel = "Deleting…",
  onConfirm,
  onClose,
}) {
  return (
    <Modal title={title} onClose={onClose} onSave={onConfirm} saveLabel={confirmLabel} savingLabel={busyLabel} danger>
      <p style={{ margin: 0 }}>{message}</p>
    </Modal>
  );
}
