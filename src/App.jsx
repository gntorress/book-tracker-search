import { useState, useEffect } from "react";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import SearchBar from "./components/SearchBar";
import ManualAddModal from "./components/ManualAddModal";
import "./App.css";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/><path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/><path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function loadBooks() {
  const saved = localStorage.getItem("myBooks");
  if (!saved) return [];
  return JSON.parse(saved);
}

function saveBooks(books) {
  localStorage.setItem("myBooks", JSON.stringify(books));
}

export default function App() {
  const [books, setBooks] = useState(loadBooks);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [manualAddTitle, setManualAddTitle] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  function handleAddBook(bookData) {
    const newBook = {
      id: Date.now(),
      title: bookData.title,
      author: bookData.author,
      status: "Want to Read",
      rating: 0,
      cover: bookData.cover,
      genre: bookData.genre || "Unknown",
      description: bookData.description || "",
      notes: "",
    };
    setBooks([newBook, ...books]);
  }

  function handleUpdateBook(updatedBook) {
    const updated = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    setBooks(updated);
    setSelectedBook(updatedBook);
  }

  function handleDeleteBook(bookId) {
    setBooks(books.filter((b) => b.id !== bookId));
    setSelectedBook(null);
  }

  function handleManualSave(bookData) {
    handleAddBook(bookData);
    setManualAddTitle(null);
  }

  const visibleBooks =
    activeFilter === "All" ? books : books.filter((b) => b.status === activeFilter);

  const filters = ["All", "Want to Read", "Reading", "Finished"];

  return (
    <div className="app">
      <header className="app-header">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
        <div className="header-inner">
          <div className="header-top">
            <h1 className="app-title">
              <span className="title-icon">◈</span>
              Shelf
            </h1>
            <p className="app-subtitle">What are we reading today?</p>
          </div>
          <SearchBar onAddBook={handleAddBook} onManualAdd={setManualAddTitle} />
        </div>
      </header>

      <main className="main-content">
        <div className="filter-bar">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
              <span className="filter-count">
                {f === "All" ? books.length : books.filter((b) => b.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {visibleBooks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">◻</p>
            <p>No books here yet. Search above to add one.</p>
          </div>
        ) : (
          <div className="book-grid">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={handleUpdateBook}
          onDelete={handleDeleteBook}
        />
      )}

      {manualAddTitle !== null && (
        <ManualAddModal
          initialTitle={manualAddTitle}
          onSave={handleManualSave}
          onClose={() => setManualAddTitle(null)}
        />
      )}
    </div>
  );
}