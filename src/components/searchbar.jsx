import { useState, useEffect, useRef } from "react";

// OPEN LIBRARY API
// This is a free, public API — no sign-up or key needed.
// We send it a search query and it returns book data.
// Example URL: https://openlibrary.org/search.json?q=dune&limit=5
// It returns an array of book objects with title, author, cover image ID, etc.

export default function SearchBar({ onAddBook }) {
  const [query, setQuery] = useState("");           // What the user is typing
  const [results, setResults] = useState([]);       // Books returned from API
  const [loading, setLoading] = useState(false);    // Show a loading state
  const [showDropdown, setShowDropdown] = useState(false);

  // useRef lets us store a value that doesn't cause a re-render when it changes.
  // We use it here to hold a "debounce timer" — explained below.
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown when user clicks outside the search box
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // This runs every time `query` changes (i.e., every keystroke)
  useEffect(() => {
    // Don't search if fewer than 2 characters typed
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // DEBOUNCING: Instead of firing a network request on every single keystroke
    // (which would be 10+ requests while typing "the hobbit"), we wait 400ms
    // after the user STOPS typing before searching. If they type again within
    // 400ms, we cancel the previous timer and start a new one.
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchBooks(query);
    }, 400);

    // Cleanup: cancel the timer if the component unmounts
    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  async function fetchBooks(searchQuery) {
    setLoading(true);
    try {
      // fetch() is how JavaScript talks to external APIs over the internet.
      // await means "wait for this to finish before moving on."
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=6&fields=key,title,author_name,cover_i,subject,first_sentence`
      );
      const data = await response.json(); // Convert the response to a JavaScript object

      // Transform the raw API data into a cleaner shape for our app
      const books = (data.docs || []).map((doc) => ({
        title: doc.title || "Unknown Title",
        author: doc.author_name?.[0] || "Unknown Author", // ?. means "if this exists"
        cover: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : null,
        genre: doc.subject?.[0] || "General",
        description: doc.first_sentence?.value || doc.first_sentence || "",
      }));

      setResults(books);
      setShowDropdown(true);
    } catch (error) {
      // If the network request fails, log it and show nothing
      console.error("Open Library search failed:", error);
      setResults([]);
    } finally {
      setLoading(false); // Always turn off loading spinner
    }
  }

  function handleSelect(book) {
    onAddBook(book);     // Tell App.jsx to add this book
    setQuery("");        // Clear the search box
    setResults([]);      // Clear results
    setShowDropdown(false);
  }

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-box">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a book to add…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        {loading && <span className="search-spinner" />}
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((book, i) => (
            <li key={i} className="search-result" onClick={() => handleSelect(book)}>
              {book.cover ? (
                <img src={book.cover} alt="" className="result-cover" />
              ) : (
                <div className="result-cover-placeholder">◻</div>
              )}
              <div className="result-info">
                <p className="result-title">{book.title}</p>
                <p className="result-author">{book.author}</p>
                {book.genre && <p className="result-genre">{book.genre}</p>}
              </div>
              <span className="result-add">+ Add</span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && query.length >= 2 && !loading && results.length === 0 && (
        <div className="search-empty">No results found for "{query}"</div>
      )}
    </div>
  );
}