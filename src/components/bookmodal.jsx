import { useState } from "react";

// BookModal shows all the book's details in an overlay.
// It receives the current book data, plus three callback functions:
//   onClose  — close the modal without saving changes
//   onUpdate — save changes back to App.jsx
//   onDelete — remove the book from the list

export default function BookModal({ book, onClose, onUpdate, onDelete }) {
  // We make a LOCAL copy of the book inside this modal.
  // This means the user can edit things without affecting the main list
  // until they explicitly save.
  const [draft, setDraft] = useState({ ...book }); // spread operator makes a copy
  const [confirmDelete, setConfirmDelete] = useState(false);

  // A helper to update one field on our draft book.
  // e.g. updateField("status", "Finished") updates just the status.
  function updateField(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    onUpdate(draft); // Send updated book up to App.jsx
  }

  // Close modal when clicking the dark background behind it
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-label={book.title}>

        {/* ── Header ── */}
        <div className="modal-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Book Info ── */}
        <div className="modal-body">
          <div className="modal-book-info">
            <div className="modal-cover">
              {draft.cover ? (
                <img src={draft.cover} alt={draft.title} />
              ) : (
                <div className="modal-cover-placeholder">
                  {draft.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="modal-meta">
              <h2 className="modal-title">{draft.title}</h2>
              <p className="modal-author">by {draft.author}</p>
              {draft.genre && (
                <span className="modal-genre">{draft.genre}</span>
              )}
            </div>
          </div>

          {/* ── Description ── */}
          {draft.description && (
            <div className="modal-section">
              <label className="section-label">Description</label>
              <p className="modal-description">{draft.description}</p>
            </div>
          )}

          {/* ── Status ── */}
          <div className="modal-section modal-row">
            <div className="modal-field">
              <label className="section-label">Status</label>
              <select
                value={draft.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="modal-select"
              >
                <option value="Want to Read">Want to Read</option>
                <option value="Reading">Reading</option>
                <option value="Finished">Finished</option>
              </select>
            </div>

            {/* ── Star Rating ── */}
            <div className="modal-field">
              <label className="section-label">Your Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star ${draft.rating >= star ? "filled" : ""}`}
                    onClick={() =>
                      // If user clicks the same star twice, clear rating
                      updateField("rating", draft.rating === star ? 0 : star)
                    }
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="modal-section">
            <label className="section-label">Your Notes</label>
            <textarea
              className="modal-notes"
              placeholder="Thoughts, quotes, favourite passages…"
              value={draft.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={5}
            />
          </div>

          {/* ── Actions ── */}
          <div className="modal-actions">
            {!confirmDelete ? (
              <>
                <button className="btn-delete" onClick={() => setConfirmDelete(true)}>
                  Remove book
                </button>
                <div className="modal-actions-right">
                  <button className="btn-cancel" onClick={onClose}>Cancel</button>
                  <button className="btn-save" onClick={handleSave}>Save changes</button>
                </div>
              </>
            ) : (
              // Two-step delete: user must confirm before the book is removed
              <div className="confirm-delete">
                <p>Remove <strong>{draft.title}</strong> from your shelf?</p>
                <button className="btn-delete" onClick={() => onDelete(book.id)}>Yes, remove</button>
                <button className="btn-cancel" onClick={() => setConfirmDelete(false)}>Keep it</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}