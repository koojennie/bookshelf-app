document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const STORAGE_KEY = "BOOKSHELF_APP";
  let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function generateBookId() {
    return new Date().getTime();
  }

  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.classList.add("item-buku");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div class="aksi">
          <button class="selesai" data-testid="bookItemIsCompleteButton">${
            book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
          }</button>
          <button class="hapus" data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button class="edit" data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

    bookItem.querySelector(".selesai").addEventListener("click", () => {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    });

    bookItem.querySelector(".hapus").addEventListener("click", () => {
      books = books.filter((b) => b.id !== book.id);
      saveBooks();
      renderBooks();
    });

    bookItem.querySelector(".edit").addEventListener("click", () => {
      const newTitle = prompt("Masukkan judul baru:", book.title);
      const newAuthor = prompt("Masukkan penulis baru:", book.author);
      const newYear = prompt("Masukkan tahun baru:", book.year);

      if (newTitle && newAuthor && newYear) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = Number(newYear);
        saveBooks();
        renderBooks();
      }
    });

    return bookItem;
  }

  function renderBooks(filteredBooks = null) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    const bookData = filteredBooks || books;

    bookData.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const newBook = {
      id: generateBookId(),
      title,
      author,
      year,
      isComplete,
    };

    books.push(newBook);
    saveBooks();
    renderBooks();
    bookForm.reset();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );
    renderBooks(filteredBooks);
  });

  renderBooks();
});
