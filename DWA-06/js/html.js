// @ts-check

import { authors, books, genres } from "./data.js";
import {
  getCurrentPageRange,
  updateShowMoreButton,
  applyFilters,
} from "./view.js";

/**
 * An object that holds references to HTML elements used in the software.
 * @param {object} list - Elements related to displaying previews.
 * @param {object} search - Elements related to search functionality.
 * @param {object} settings - Elements related to theme settings.
 */
export const html = {
  list: {
    items: document.querySelector("[data-list-items]"),
    button: document.querySelector("[data-list-button]"),
    message: document.querySelector("[data-list-message]"),
    close: document.querySelector("[data-list-close]"),
    active: document.querySelector("[data-list-active]"),
  },
  search: {
    genres: document.querySelector("[data-search-genres]"),
    authors: document.querySelector("[data-search-authors]"),
    overlay: document.querySelector("[data-search-overlay]"),
    form: document.querySelector("[data-search-form]"),
    cancel: document.querySelector("[data-search-cancel]"),
  },
  settings: {
    theme: document.querySelector("[data-settings-theme]"),
    form: document.querySelector("[data-settings-form]"),
    overlay: document.querySelector("[data-settings-overlay]"),
    cancel: document.querySelector("[data-settings-cancel]"),
  },
  header: {
    search: document.querySelector("[data-header-search]"),
    settings: document.querySelector("[data-header-settings]"),
  },
};

/**
 * @typedef {Object} Book
 * @property {string} author - The author of the book.
 * @property {string} id - The unique identifier of the book.
 * @property {string} image - The URL of the book's image.
 * @property {string} title - The title of the book.
 */

/**
 *  A helper function that creates a book preview based on the provided book
 *  information.
 *
 * @param {Book} book An object containing book information
 * @returns {DocumentFragment}
 */
const createPreview = (book) => {
  const fragment = document.createDocumentFragment();

  const previewButton = document.createElement("button");
  previewButton.classList = "preview";
  previewButton.setAttribute("data-preview", book.id);

  previewButton.innerHTML = `
        <img
            class="preview__image"
            src="${book.image}"
        />
    
        <div class="preview__info">
            <h3 class="preview__title">${book.title}</h3>
            <div class="preview__author">${authors[book.author]}</div>
        </div>
    `;
  fragment.appendChild(previewButton);

  return fragment;
};

/**
 * A helper function that appends book previews based on the current page.
 * @param {object | Array} books An array of book objects to be displayed
 */
export const addPreview = (books, page) => {
  const { items } = html.list;
  const fragment = document.createDocumentFragment();

  const [startOfPage, endOfPage] = getCurrentPageRange(page);

  const booksArray = Object.values(books);

  for (const book of booksArray.slice(startOfPage, endOfPage)) {
    const previewElement = createPreview(book);
    fragment.appendChild(previewElement);
  }

  items.appendChild(fragment);
};

/**
 * a Helper function that creates an option element
 * @param {string} optionValue The value of the option
 * @param {string} text The text displayed
 */
const createOption = (optionValue, text) => {
  const option = document.createElement("option");
  option.value = optionValue;
  option.innerText = text;

  return option;
};

/**
 * A helper function that appends the values of options
 *
 * @param {object} data Contains data like genres and author
 * @param {HTMLElement} element Where the options need to be appended
 * @param {string} defaultOptionValue Default for all drop downs
 * @param {string} defaultOptionText Default for text fields
 */
const addOptions = (data, element, defaultOptionValue, defaultOptionText) => {
  const fragment = document.createDocumentFragment();

  const defaultOption = createOption(defaultOptionValue, defaultOptionText);
  fragment.appendChild(defaultOption);

  for (const [id, name] of Object.entries(data)) {
    const option = createOption(id, name);

    fragment.appendChild(option);
  }

  element.appendChild(fragment);
};

export const addOptionsToSearch = () => {
  addOptions(genres, html.search.genres, "any", "All Genres");
  addOptions(authors, html.search.authors, "any", "All Authors");
};

/**
 * Adds a click event listener to an element specified by the selector. When the
 * element is clicked, it toggles the 'open' property of the target element and
 * optionally focuses on it.
 *
 * @param {string} selector
 * @param {string} targetSelector - The selector for the target element
 * whose 'open' property will be toggled.
 * @param {boolean} [focus=false]
 */
export const addClickListener = (selector, targetSelector, focus = false) => {
  document.querySelector(selector).addEventListener("click", () => {
    const targetElement = document.querySelector(targetSelector);
    targetElement.open = !targetElement.open;

    if (focus) {
      targetElement.focus();
    }
  });
};

/**
 * A helper function that closes an overlay specified by the given selector.
 * @param {string} overlayElement
 */
export const closeOverlay = (overlayElement) => {
  const overlay = document.querySelector(overlayElement);
  if (overlay) {
    overlay.open = false;
  }
};

export const updateListMessage = (books, message) => {
  message.classList.toggle("list__message_show", books.length < 1);
};

/**
 * @param {object} books
 * @param {object} filters
 * @param {number} page
 */
export const updatePreviewBasedOnFilters = (books, filters, page) => {
  const { message } = html.list;
  const filteredBooks = applyFilters([...books], filters);

  addPreview(filteredBooks, page);
  updateShowMoreButton(filteredBooks, page);
  updateListMessage(filteredBooks, message);

  window.scrollTo({ top: 0, behavior: "smooth" });
  closeOverlay("[data-search-overlay]");

  return filteredBooks;
};
