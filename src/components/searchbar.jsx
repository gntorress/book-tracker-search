import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onAddBook }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchBooks(query);
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  async function fetchBooks(searchQuery) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=6&fields=key,title,author_name,cover_i,subject,first_sentence`
      );
      const data = await response.json();

      const books = (data.docs || []).map((doc) => ({
        title: doc.title || "Unknown Title",
        author: doc.author_name?.[0] || "Unknown Author",
        cover: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : null,
        genre: doc.subject?.[0] || "General",
        description: doc.first_sentence?.value || doc.first_sentence || "",
      }));

      setResults(books);
      setShowDropdown(true);
    } catch (error) {
      console.error("Open Library search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(book) {
    onAddBook(book);
    setQuery("");
    setResults([]);
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
