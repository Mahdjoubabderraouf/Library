function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "already read" : "not read yet"
    }`;
  };
}

const myLibrary = [
  new Book("The Hobbit", "J.R.R. Tolkien", 295, true),
  new Book("The Lord of the Rings", "J.R.R. Tolkien", 1178, false),
  new Book("The Silmarillion", "J.R.R. Tolkien", 365, false),
  new Book("The Children of Hurin", "J.R.R. Tolkien", 313, false),
];

// get elements from DOM
const addButtonOpenDialog = document.getElementById("add");
const dialoge = document.querySelector("dialog");
const closeDialog = document.getElementById("close");
const submitDialog = document.getElementById("submit");
const table = document.querySelector("table");
const remove = document.getElementById("remove");
const read = document.getElementById("read");
const notYet = document.getElementById("not-yet");

/*************************Events Listeners*************************/

// hundel submit form
submitDialog.addEventListener("click", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  let bookStatus;

  // for read i had use radio button to get the value of the selected radio button one is yes and the other is no
  const read = document.querySelector('input[name="read"]:checked').value;
  if (read === "yes") {
    bookStatus = true;
  } else {
    bookStatus = false;
  }
  const book = new Book(title, author, pages, bookStatus);
  myLibrary.push(book);
  addBookToLibrary(myLibrary.length, title, author, pages, bookStatus);
  dialoge.close();
});

// close dialog for X button
closeDialog.addEventListener("click", (closeDialog) => {
  dialoge.close();
});

addButtonOpenDialog.addEventListener("click", (addBookToLibrary) => {
  dialoge.showModal();
});

remove.addEventListener("click", () => operation("delete"));
read.addEventListener("click", () => operation("read"));
notYet.addEventListener("click", () => operation("not-yet"));

// close the selected row when click outside the table

document.addEventListener("click", (event) => {
  const table = document.querySelector("table");
  if (!table.contains(event.target)) {
    const rows = table.querySelectorAll("tr.selected");
    rows.forEach((row) => {
      row.classList.remove("selected");
      const checkbox = row.querySelector(".select-row");
      if (checkbox) checkbox.checked = false;
    });
  }
});

/***************************Functions******************************/

// add book to library and update the table
function addBookToLibrary(index, title, author, pages, bookStatus) {
  const row = table.querySelector("tbody").insertRow();
  const checkCell = row.insertCell(0);
  const idCell = row.insertCell(1);
  const titleCell = row.insertCell(2);
  const authorCell = row.insertCell(3);
  const pagesCell = row.insertCell(4);
  const readCell = row.insertCell(5);
  const deleteCell = row.insertCell(6);

  const checkbox = document.createElement("input");

  checkbox.type = "checkbox";
  checkbox.className = "select-row";

  row.addEventListener("click", () => {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      row.classList.add("selected");
    } else {
      row.classList.remove("selected");
    }
  });

  checkCell.appendChild(checkbox);

  idCell.innerHTML = index;
  idCell.className = "id";
  titleCell.innerHTML = title;
  authorCell.innerHTML = author;
  pagesCell.innerHTML = pages;

  const readButton = document.createElement("button");
  readButton.className = bookStatus ? "status read" : "status not-yet";
  readButton.textContent = bookStatus ? "Read" : "Not yet";

  readButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (readButton.classList.contains("read")) {
      readButton.textContent = "Not yet";
      readButton.className = "status not-yet";
      myLibrary[row.rowIndex - 1].read = false;
    } else {
      readButton.textContent = "Read";
      readButton.className = "status read";
      myLibrary[row.rowIndex - 1].read = true;
    }
  });

  readCell.appendChild(readButton);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", () => {
    row.remove();
    myLibrary.splice(row.rowIndex - 1, 1);
    console.log(myLibrary);
    IDUpdate();
  });

  deleteCell.appendChild(deleteButton);
}

// function get selected rows and operate them (delete or read or not yet)

const operation = (operation) => {
  const selectedRows = document.querySelectorAll(".selected");
  if (selectedRows.length === 0) {
    alert("Please select a row");
    return;
  }

  selectedRows.forEach((element) => {
    const index =
      Number(element.getElementsByClassName("id")[0].textContent) - 1;
    if (operation === "delete") {
      element.remove();
      myLibrary.splice(index, 1);
      IDUpdate();
    } else {
      const readButton = element.querySelector(".status");
      if (operation === "read") {
        readButton.textContent = "Read";
        readButton.className = "status read";
        myLibrary[index].read = true;
      } else if (operation === "not-yet") {
        readButton.textContent = "Not yet";
        readButton.className = "status not-yet";
        myLibrary[index].read = false;
      }
    }
  });
};

// update IDS in the table
function IDUpdate() {
  for (let i = 1; i < table.rows.length; i++) {
    table.rows[i].cells[1].textContent = i;
  }
}

// render the books in the table
function render() {
  myLibrary.forEach((book, index) => {
    addBookToLibrary(index + 1, book.title, book.author, book.pages, book.read);
  });
}

render();
