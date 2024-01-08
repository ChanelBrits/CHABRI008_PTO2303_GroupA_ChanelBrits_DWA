// @ts-check
import { authors, books } from "./data.js";
import {
  html,
  addPreview,
  addOptionsToSearch,
  addClickListener,
  closeOverlay,
  updatePreviewBasedOnFilters,
} from "./html.js";

import {
  changeTheme,
  checkUserTheme,
  updateShowMoreButton,
  getFilters,
  applyFilters,
} from "./view.js";

let page = 1;
let matches = books;

const handleShowMoreButton = () => {
  page += 1;
  addPreview(matches, page);
  updateShowMoreButton(matches, page);
};

const handleSaveButton = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  changeTheme(theme);
  closeOverlay("[data-settings-overlay]");
};

const handleSearchSubmit = (event) => {
  event.preventDefault();
  const filters = getFilters(event.target);
  const updatedBooks = updatePreviewBasedOnFilters(books, filters, page);
  console.log(books);
};

const initializeApp = () => {
  addOptionsToSearch();
  addPreview(matches, page);
  checkUserTheme();
  updateShowMoreButton(matches, page);
};

addClickListener("[data-search-cancel]", "[data-search-overlay]");
addClickListener("[data-settings-cancel]", "[data-settings-overlay]");
addClickListener("[data-header-search]", "[data-search-overlay]", true);
addClickListener("[data-header-settings]", "[data-settings-overlay]");
addClickListener("[data-list-close]", "[data-list-active]");

html.list.button.addEventListener("click", handleShowMoreButton);
html.settings.form.addEventListener("submit", handleSaveButton);
html.search.form.addEventListener("submit", handleSearchSubmit);

initializeApp();

document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        let result = null;

        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }

        active = result;
      }
    }

    if (active) {
      document.querySelector("[data-list-active]").open = true;
      document.querySelector("[data-list-blur]").src = active.image;
      document.querySelector("[data-list-image]").src = active.image;
      document.querySelector("[data-list-title]").innerText = active.title;
      document.querySelector("[data-list-subtitle]").innerText = `${
        authors[active.author]
      } (${new Date(active.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText =
        active.description;
    }
  });
