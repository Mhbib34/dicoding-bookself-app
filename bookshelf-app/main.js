const bookForm = document.getElementById("bookForm");
const bookFormTitle = document.getElementById("bookFormTitle");
const bookFormAuthor = document.getElementById("bookFormAuthor");
const bookFormYear = document.getElementById("bookFormYear");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");
const bookFormSubmit = document.getElementById("bookFormSubmit");
const searchBook = document.getElementById("searchBook");
const searchBookTitle = document.getElementById("searchBookTitle");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];
let isEditMode = false;
let bookIdToEdit = null;

const loadBooks = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }

  renderBooks();
};

const saveBooks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  renderBooks();
};

const renderBooks = (filteredBooks = null) => {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const booksToRender = filteredBooks || books;

  booksToRender.forEach((book) => {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
};

const createBookElement = (book) => {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  const titleElement = document.createElement("h3");
  titleElement.innerText = book.title;
  titleElement.setAttribute("data-testid", "bookItemTitle");

  const authorElement = document.createElement("p");
  authorElement.innerText = `Penulis: ${book.author}`;
  authorElement.setAttribute("data-testid", "bookItemAuthor");

  const yearElement = document.createElement("p");
  yearElement.innerText = `Tahun: ${book.year}`;
  yearElement.setAttribute("data-testid", "bookItemYear");

  const buttonContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", () => {
    toggleBookStatus(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", () => {
    deleteBook(book.id);
  });

  const editButton = document.createElement("button");
  editButton.innerText = "Edit Buku";
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.addEventListener("click", () => {
    editBook(book.id);
  });

  buttonContainer.append(toggleButton, deleteButton, editButton);
  bookItem.append(titleElement, authorElement, yearElement, buttonContainer);

  return bookItem;
};

const addBook = () => {
  const title = bookFormTitle.value.trim();
  const author = bookFormAuthor.value.trim();
  const year = parseInt(bookFormYear.value);
  const isComplete = bookFormIsComplete.checked;

  if (!title || !author || !year) {
    alert("Semua field harus diisi!");
    return;
  }

  const id = Date.now();
  const newBook = { id, title, author, year, isComplete };

  books.push(newBook);
  saveBooks();
  resetForm();
};

const updateBook = () => {
  const title = bookFormTitle.value.trim();
  const author = bookFormAuthor.value.trim();
  const year = parseInt(bookFormYear.value);
  const isComplete = bookFormIsComplete.checked;

  if (!title || !author || !year) {
    alert("Semua field harus diisi!");
    return;
  }

  const bookIndex = books.findIndex((book) => book.id === bookIdToEdit);

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      title,
      author,
      year,
      isComplete,
    };

    saveBooks();
    resetForm();
    exitEditMode();
  }
};

const toggleBookStatus = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      isComplete: !books[bookIndex].isComplete,
    };

    saveBooks();
  }
};

const deleteBook = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const bookTitle = books[bookIndex].title;

    const confirmation = confirm(
      `Apakah anda yakin ingin menghapus buku "${bookTitle}"?`
    );

    if (confirmation) {
      books.splice(bookIndex, 1);
      saveBooks();
    }
  }
};

const editBook = (bookId) => {
  const book = books.find((book) => book.id === bookId);

  if (book) {
    bookFormTitle.value = book.title;
    bookFormAuthor.value = book.author;
    bookFormYear.value = book.year;
    bookFormIsComplete.checked = book.isComplete;

    bookFormSubmit.innerHTML = "Edit Buku";
    bookFormSubmit.classList.add("edit-mode");

    isEditMode = true;
    bookIdToEdit = book.id;

    bookForm.scrollIntoView({ behavior: "smooth" });
  }
};

const exitEditMode = () => {
  isEditMode = false;
  bookIdToEdit = null;
  bookFormSubmit.innerHTML =
    "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
  bookFormSubmit.classList.remove("edit-mode");
};

const resetForm = () => {
  bookForm.reset();
  updateSubmitButtonText();
};

const searchBookByTitle = (keyword) => {
  if (keyword) {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(keyword.toLowerCase())
    );
    renderBooks(filteredBooks);
  } else {
    renderBooks();
  }
};

const updateSubmitButtonText = () => {
  const status = bookFormIsComplete.checked
    ? "Selesai dibaca"
    : "Belum selesai dibaca";

  if (!isEditMode) {
    bookFormSubmit.innerHTML = `Masukkan Buku ke rak <span>${status}</span>`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateBook();
    } else {
      addBook();
    }
  });

  bookFormIsComplete.addEventListener("change", updateSubmitButtonText);

  searchBook.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBookByTitle(searchBookTitle.value);
  });
});
