import { useState } from "react";

export default function BookModal({ book, onClose, onUpdate, onDelete }) {
  const [draft, setDraft] = useState({ ...book });
  const [confirmDelete, setConfirmDelete] = useState(false);

  function updateField(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    onUpdate(draft);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-label={book.title}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

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
              {draft.genre && <span className="modal-genre">{draft.genre}</span>}
            </div>
          </div>

          {draft.description && (
            <div className="modal-section">
              <label className="section-label">Description</label>
              <p className="modal-description">{draft.description}</p>
            </div>
          )}

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

            <div className="modal-field">
              <label className="section-label">Your Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star ${draft.rating >= star ? "filled" : ""}`}
                    onClick={() =>
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

          <div className="modal-actions">
            {!confirmDelete ? (
              <>
                <button
                  className="btn-delete"
                  onClick={() => setConfirmDelete(true)}
                >
                  Remove book
                </button>
                <div className="modal-actions-right">
                  <button className="btn-cancel" onClick={onClose}>
                    Cancel
                  </button>
                  <button className="btn-save" onClick={handleSave}>
                    Save changes
                  </button>
                </div>
              </>
            ) : (
              <div className="confirm-delete">
                <p>
                  Remove <strong>{draft.title}</strong> from your shelf?
                </p>
                <button className="btn-delete" onClick={() => onDelete(book.id)}>
                  Yes, remove
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setConfirmDelete(false)}
                >
                  Keep it
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}