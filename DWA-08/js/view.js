// @ts-check

import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
import { html } from "./html.js";

export const getCurrentPageRange = (page) => {
  const startOfPage = page === 1 ? 0 : (page - 1) * BOOKS_PER_PAGE;
  const endOfPage = startOfPage + BOOKS_PER_PAGE;

  return [startOfPage, endOfPage];
};

const getNextPageRange = (page) => {
  const [endOfPage] = getCurrentPageRange(page);

  return [endOfPage, endOfPage + BOOKS_PER_PAGE];
};

const themeColorValues = {
  day: {
    "--color-dark": "10, 10, 20",
    "--color-light": "255, 255, 255",
  },
  night: {
    "--color-dark": "255, 255, 255",
    "--color-light": "10, 10, 20",
  },
};

/**
 * A helper function that changes the theme colors based on the provided theme.
 * @param {string} theme - The theme value ('day' or 'night').
 */
export const changeTheme = (theme) => {
  const colors = themeColorValues[theme];

  for (const property in colors) {
    if (colors.hasOwnProperty(property)) {
      document.documentElement.style.setProperty(property, colors[property]);
    }
  }
};

/**
 * a Helper function that changes the theme based on the users preference
 */
export const checkUserTheme = () => {
  const { theme } = html.settings;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    theme.value = "night";
  } else {
    theme.value = "day";
  }

  changeTheme(theme);
};

/**
 * Updates the "Show more" button based on the current page and
 * available books.
 *
 * @param {Book[]} matches - An array of book objects.
 * @param {number} page - The current page number.
 */
export const updateShowMoreButton = (matches, page) => {
  const { button: showMoreButton } = html.list;

  const [endOfPage] = getCurrentPageRange(page);

  const remainingBooks = Math.max(matches.length - endOfPage, 0);

  showMoreButton.innerText = `Show more (${remainingBooks})`;
  showMoreButton.disabled = remainingBooks < 0;
  showMoreButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      remainingBooks > 0 ? remainingBooks : 0
    })</span>
  `;
};

/**
 * Extracts filters from the form data.
 * @param {HTMLFormElement} form - The form element.
 * @returns {object} - Filters object.
 */
export const getFilters = (form) => {
  const formData = new FormData(form);
  return Object.fromEntries(formData);
};

/**
 * @param {object} book
 * @param {string} selectedGenre
 * @returns {boolean} - Whether the book matches the genre filter
 */
const filterByGenre = (book, selectedGenre) => {
  return (
    selectedGenre === "any" ||
    (book.genres && book.genres.includes(selectedGenre))
  );
};

/**
 * @param {object} book
 * @param {string} titleFilter
 * @returns {boolean} - Whether the book matches the title filter.
 */
const filterByTitle = (book, titleFilter) => {
  return (
    titleFilter.trim() === "" ||
    book.title.toLowerCase().includes(titleFilter.toLowerCase())
  );
};

/**
 * @param {object} book
 * @param {string} selectedAuthor
 * @returns {boolean} - Whether the book matches the author filter.
 */
const filterByAuthor = (book, selectedAuthor) => {
  return selectedAuthor === "any" || book.author === selectedAuthor;
};

/**
 * Applies filters to the book data.
 * @param {object} bookData
 * @param {object} filters - The filters to be applied.

 */
export const applyFilters = (bookData, filters) => {
  if (!bookData || typeof bookData !== "object") {
    console.error("Invalid bookData:", bookData);
    return [];
  }

  const booksArray = Object.values(bookData);

  const filteredBooks = booksArray.filter((book) => {
    return (
      filterByGenre(book, filters.genre) &&
      filterByTitle(book, filters.title) &&
      filterByAuthor(book, filters.author)
    );
  });
};
