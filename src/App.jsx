import { useState, useEffect } from "react";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import SearchBar from "./components/SearchBar";
import "./App.css";

// ---------- localStorage helpers ----------
// These two functions are like a save/load system for your browser.
// localStorage is a mini database built into every browser.
// It stores data as text (strings), so we use JSON to convert
// our book objects to/from text.

function loadBooks() {
  const saved = localStorage.getItem("myBooks");
  // If nothing saved yet, return the starter books
  if (!saved) {
    return [
      { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", status: "Finished", rating: 5, cover: null, genre: "Fantasy", description: "A hobbit goes on an unexpected adventure.", notes: "" },
      { id: 2, title: "Dune", author: "Frank Herbert", status: "Reading", rating: 4, cover: null, genre: "Sci-Fi", description: "A epic tale of politics, religion, and survival on a desert planet.", notes: "" },
    ];
  }
  return JSON.parse(saved); // Convert text back to objects
}

function saveBooks(books) {
  localStorage.setItem("myBooks", JSON.stringify(books)); // Convert objects to text
}

// ------------------------------------------

export default function App() {
  // books state: the master list of all books you're tracking
  const [books, setBooks] = useState(loadBooks);

  // selectedBook: which book card is currently open in the modal (null = no modal)
  const [selectedBook, setSelectedBook] = useState(null);

  // activeFilter: which status tab is selected (All, Want to Read, Reading, Finished)
  const [activeFilter, setActiveFilter] = useState("All");

  // Whenever 'books' changes, save to localStorage automatically
  // useEffect runs the function inside it whenever the values in the
  // array at the end ([books]) change. So every time books updates, we save.
  useEffect(() => {
    saveBooks(books);
  }, [books]);

  // Called when user picks a book from the search dropdown
  function handleAddBook(bookData) {
    const newBook = {
      id: Date.now(), // Simple unique ID using current timestamp
      title: bookData.title,
      author: bookData.author,
      status: "Want to Read",
      rating: 0,
      cover: bookData.cover,
      genre: bookData.genre || "Unknown",
      description: bookData.description || "",
      notes: "",
    };
    const updated = [newBook, ...books]; // Add new book to front of list
    setBooks(updated);
  }

  // Called from the modal when user changes status or rating
  function handleUpdateBook(updatedBook) {
    const updated = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    setBooks(updated);
    setSelectedBook(updatedBook); // Keep modal in sync
  }

  // Called from the modal's delete button
  function handleDeleteBook(bookId) {
    const updated = books.filter((b) => b.id !== bookId);
    setBooks(updated);
    setSelectedBook(null); // Close the modal
  }

  // Filter books based on which tab is active
  const visibleBooks =
    activeFilter === "All" ? books : books.filter((b) => b.status === activeFilter);

  const filters = ["All", "Want to Read", "Reading", "Finished"];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-top">
            <h1 className="app-title">
              <span className="title-icon">◈</span>
              Shelf
            </h1>
            <p className="app-subtitle">your reading life, tracked</p>
          </div>
          <SearchBar onAddBook={handleAddBook} />
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

      {/* The modal only renders when a book is selected */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={handleUpdateBook}
          onDelete={handleDeleteBook}
        />
      )}
    </div>
  );
}