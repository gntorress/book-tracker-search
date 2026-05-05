import { useState, useEffect } from "react";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import SearchBar from "./components/SearchBar";
import "./App.css";


function loadBooks() {
  const saved = localStorage.getItem("myBooks");
  // If nothing saved yet, return the starter books
  if (!saved) {
    return [
      { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", status: "Finished", rating: 5, cover: null, genre: "Fantasy", description: "A hobbit goes on an unexpected adventure.", notes: "" },
      { id: 2, title: "Dune", author: "Frank Herbert", status: "Reading", rating: 4, cover: null, genre: "Sci-Fi", description: "A epic tale of politics, religion, and survival on a desert planet.", notes: "" },
    ];
  }
  return JSON.parse(saved); 
}

function saveBooks(books) {
  localStorage.setItem("myBooks", JSON.stringify(books));
}

// ------------------------------------------

export default function App() {
  const [books, setBooks] = useState(loadBooks);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

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
    const updated = [newBook, ...books]; 
    setBooks(updated);
  }

  function handleUpdateBook(updatedBook) {
    const updated = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    setBooks(updated);
    setSelectedBook(updatedBook);
  }

  function handleDeleteBook(bookId) {
    const updated = books.filter((b) => b.id !== bookId);
    setBooks(updated);
    setSelectedBook(null);
  }

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