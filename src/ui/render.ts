import { createBookForm } from './components/BookForm';
import { createUserForm } from './components/UserForm';
import { createBookList } from './components/BookList';
import { createUserList } from './components/UserList';
import { Library } from '../services/Library';
import { Storage } from '../services/Storage';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { generateId } from '../utils/idGenerator';
import { IBook } from '../models/interfaces/IBook';
import { IUser } from '../models/interfaces/IUser';

const bookLibrary = new Library<IBook>();
const userLibrary = new Library<IUser>();

function initData() {
  const books = Storage.load<IBook[]>('books') || [];
  const users = Storage.load<IUser[]>('users') || [];
  bookLibrary.setItems(books);
  userLibrary.setItems(users);
}

function saveData() {
  Storage.save('books', bookLibrary.getAll());
  Storage.save('users', userLibrary.getAll());
}

export function renderApp(rootId: string): void {
  initData();

  const root = document.getElementById(rootId);
  if (!root) throw new Error(`Элемент с id "${rootId}" не найден`);
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container mt-5 mb-5';

  const header = document.createElement('h2');
  header.className = 'text-center mb-4';
  header.textContent = 'Управление библиотекой';

  const formsRow = document.createElement('div');
  formsRow.className = 'row mb-4 g-4';

  const bookCol = document.createElement('div');
  bookCol.className = 'col-md-6';

  const userCol = document.createElement('div');
  userCol.className = 'col-md-6';

  formsRow.append(bookCol, userCol);

  const listsRow = document.createElement('div');
  listsRow.className = 'row g-4';

  const bookListCol = document.createElement('div');
  bookListCol.className = 'col-md-6';

  const userListCol = document.createElement('div');
  userListCol.className = 'col-md-6';

  listsRow.append(bookListCol, userListCol);
  container.append(header, formsRow, listsRow);
  root.appendChild(container);

  function updateLists() {
    bookListCol.innerHTML = '';
    userListCol.innerHTML = '';

    bookListCol.appendChild(
      createBookList(
        bookLibrary.getAll(),
        (id) => {
          bookLibrary.remove(id);
          saveData();
          updateLists();
        },
        (id) => {
          const book = bookLibrary.find(id);
          if (book) {
            book.isBorrowed = !book.isBorrowed;
            saveData();
            updateLists();
          }
        },
      ),
    );

    userListCol.appendChild(
      createUserList(userLibrary.getAll(), (id) => {
        userLibrary.remove(id);
        saveData();
        updateLists();
      }),
    );
  }

  bookCol.appendChild(
    createBookForm((title, author, year) => {
      const newBook = new Book(generateId(), title, author, year);
      bookLibrary.add(newBook);
      saveData();
      updateLists();
    }),
  );

  userCol.appendChild(
    createUserForm((id, name, email) => {
      if (userLibrary.find(id)) {
        alert('Пользователь с таким ID уже существует');
        return;
      }
      const newUser = new User(id, name, email);
      userLibrary.add(newUser);
      saveData();
      updateLists();
    }),
  );

  updateLists();
}
