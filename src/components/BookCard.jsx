const STATUS_STYLES = {
  "Want to Read": { label: "Want to Read", cls: "status-want" },
  "Reading": { label: "Reading", cls: "status-reading" },
  "Finished": { label: "Finished", cls: "status-finished" },
};

export default function BookCard({ book, onClick }) {
  const status = STATUS_STYLES[book.status] || STATUS_STYLES["Want to Read"];

  return (
    <div
      className="book-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="card-cover-area">
        {book.cover ? (
          <img src={book.cover} alt={book.title} className="card-cover-img" />
        ) : (
          <div className="card-cover-placeholder">
            <span>{book.title.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <p className="card-title">{book.title}</p>
        <p className="card-author">{book.author}</p>
        <div className="card-footer">
          <span className={`status-badge ${status.cls}`}>{status.label}</span>
          {book.rating > 0 && (
            <span className="card-rating">{"★".repeat(book.rating)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
