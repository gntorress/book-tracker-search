Book Tracker Search App
=======================

Overview
--------
This project is a small React-based book management app built with Vite. It lets the user search for books via the Open Library API, add selected books to a personal shelf, filter by reading status, edit book details, rate books, write notes, and persist the shelf using browser localStorage.

Key features
------------
- Search for books using Open Library search.
- Add books from search results to a local shelf.
- Manually add a book when no search result exists.
- Filter shelf by status: All, Want to Read, Reading, Finished.
- Open book detail modal to update status, rating, and notes.
- Delete a book with confirmation.
- Light/dark theme toggle persisted in localStorage.
- Responsive UI with card grid and modal dialogs.

Project structure
-----------------
- `src/App.jsx` - Main application logic and state management.
- `src/App.css` - Global styling, layout, theme variables, and component styling.
- `src/components/bookcard.jsx` - Renders individual book cards in the shelf grid.
- `src/components/bookmodal.jsx` - Modal dialog for editing a selected book.
- `src/components/ManualAddModal.jsx` - Modal to manually add a book when no search result is available.
- `src/components/searchbar.jsx` - Search input and Open Library autocomplete dropdown.

Main app behavior
-----------------
- The app loads saved books from `localStorage` under the key `myBooks`.
- Theme preference is loaded from `localStorage` under `theme`, with a fallback to system preference.
- `books` state is stored in React state and synced back to `localStorage` whenever it changes.
- Selected book details are stored in `selectedBook` state, and opening a book card displays the `BookModal`.
- Manual add flows use `manualAddTitle` state to show the `ManualAddModal` prefilled with typed search text.
- `activeFilter` state controls visible books shown by status.

Search component
----------------
- `SearchBar` debounces user input for 400ms before querying the Open Library API.
- It fetches results from `https://openlibrary.org/search.json` and maps each result to the app's book shape.
- Search results display cover thumbnails, title, author, and genre.
- Selecting a result adds the book to the shelf immediately.
- If the typed query is not found, a manual-add button appears to add a book by title.

Book card and detail modal
--------------------------
- `BookCard` shows title, author, status badge, and star rating.
- When a card is clicked, `BookModal` opens for editing.
- `BookModal` lets users change status, set a rating, add notes, and delete the book.
- Deleting a book shows a confirmation state before removal.

Manual book entry
-----------------
- `ManualAddModal` shows a form with title, author, genre, cover URL, and description.
- Title is required before the book can be added.
- The manual add form initializes with the current search query as the title.

Styling and theme
-----------------
- `App.css` defines design tokens, dark mode variables, and responsive layout rules.
- The theme toggle updates a `data-theme` attribute on the `document.documentElement`.
- Dark mode overrides key colors for the app header, cards, dropdowns, modal backgrounds, and text.
- The layout includes a search header, filter bar, card grid, empty state, and modal overlay.

Dependencies and build
----------------------
- React 19 and React DOM 19.
- Vite for development and production build.
- `@emotion/react`, `@emotion/styled`, and `@mui/material` are declared dependencies, though the current source files only use React and vanilla CSS.
- Development dependencies include ESLint, Vite plugin React, and React type definitions.

Usage
-----
- Run `npm install` to install dependencies.
- Run `npm run dev` to start the development server.
- Run `npm run build` to build the production bundle.
- Run `npm run preview` to preview the production build.

Notes
-----
- The app is fully client-side and depends on browser storage; clearing site data will reset saved books and theme preference.
- The Open Library search response is transformed to the app's internal book model, so missing fields are replaced with default values.
- The project does not currently include a backend.

Possible Improvements
-----
- Better storage solution for device to device use
- Redesign to look like a shelf
- Shopping links for want to read
- Music player?
