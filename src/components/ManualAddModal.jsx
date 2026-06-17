import { useState } from "react";

export default function ManualAddModal({ initialTitle = "", onSave, onClose }) {
  const [form, setForm] = useState({
    title: initialTitle,
    author: "",
    genre: "",
    description: "",
    cover: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      cover: form.cover.trim() || null,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <h2 className="modal-title" style={{ marginBottom: "1.25rem" }}>Add a book</h2>

          <div className="modal-section">
            <label className="section-label">Title *</label>
            <input
              className="modal-notes"
              style={{ resize: "none" }}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Book title"
            />
          </div>

          <div className="modal-section">
            <label className="section-label">Author</label>
            <input
              className="modal-notes"
              style={{ resize: "none" }}
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Author name"
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="section-label">Genre</label>
              <input
                className="modal-notes"
                style={{ resize: "none" }}
                name="genre"
                value={form.genre}
                onChange={handleChange}
                placeholder="e.g. Fiction"
              />
            </div>
            <div className="modal-field">
              <label className="section-label">Cover URL</label>
              <input
                className="modal-notes"
                style={{ resize: "none" }}
                name="cover"
                value={form.cover}
                onChange={handleChange}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="modal-section">
            <label className="section-label">Description</label>
            <textarea
              className="modal-notes"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A short description…"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <div className="modal-actions-right">
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={!form.title.trim()}
              >
                Add book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}