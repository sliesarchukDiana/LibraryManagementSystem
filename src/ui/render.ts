import { createBookForm } from './components/BookForm';
import { createUserForm } from './components/UserForm';
import { createBookList } from './components/BookList';
import { createUserList } from './components/UserList';
import { showModal } from './components/Modal';
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

function createPagination(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number,
  onPageChange: (page: number) => void,
): HTMLElement {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const nav = document.createElement('nav');
  if (totalPages <= 1) return nav;

  const ul = document.createElement('ul');
  ul.className = 'pagination justify-content-center mt-3 mb-0';

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    const btn = document.createElement('button');
    btn.className = 'page-link';
    btn.textContent = i.toString();
    btn.onclick = () => onPageChange(i);
    li.appendChild(btn);
    ul.appendChild(li);
  }
  nav.appendChild(ul);
  return nav;
}

export function renderApp(rootId: string): void {
  initData();

  const root = document.getElementById(rootId);
  if (!root) throw new Error(`Елемент з id "${rootId}" не знайдено`);
  root.innerHTML = '';

  let currentBookPage = 1;
  let currentUserPage = 1;
  let bookSearchQuery = '';
  const ITEMS_PER_PAGE = 5;

  const container = document.createElement('div');
  container.className = 'container mt-5 mb-5';

  const header = document.createElement('h2');
  header.className = 'text-center mb-4';
  header.textContent = 'Управління бібліотекою';

  const formsRow = document.createElement('div');
  formsRow.className = 'row mb-4 g-4';

  const bookCol = document.createElement('div');
  bookCol.className = 'col-md-6';
  const userCol = document.createElement('div');
  userCol.className = 'col-md-6';
  formsRow.append(bookCol, userCol);

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'row mb-3';
  const searchCol = document.createElement('div');
  searchCol.className = 'col-md-6';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control';
  searchInput.placeholder = 'Пошук книг (назва або автор)...';
  searchInput.addEventListener('input', (e) => {
    bookSearchQuery = (e.target as HTMLInputElement).value;
    currentBookPage = 1;
    updateLists();
  });
  searchCol.appendChild(searchInput);
  searchWrapper.appendChild(searchCol);

  const listsRow = document.createElement('div');
  listsRow.className = 'row g-4';

  const bookListCol = document.createElement('div');
  bookListCol.className = 'col-md-6';
  const userListCol = document.createElement('div');
  userListCol.className = 'col-md-6';
  listsRow.append(bookListCol, userListCol);

  container.append(header, formsRow, searchWrapper, listsRow);
  root.appendChild(container);

  function updateLists() {
    bookListCol.innerHTML = '';
    userListCol.innerHTML = '';

    const allBooks = bookLibrary.getAll();
    const filteredBooks = allBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearchQuery.toLowerCase()),
    );
    const paginatedBooks = filteredBooks.slice(
      (currentBookPage - 1) * ITEMS_PER_PAGE,
      currentBookPage * ITEMS_PER_PAGE,
    );

    const bookListEl = createBookList(
      paginatedBooks,
      (id) => {
        bookLibrary.remove(id);
        saveData();
        updateLists();
      },
      (bookId) => {
        const book = bookLibrary.find(bookId);
        if (!book) return;

        if (book.isBorrowed) {
          const users = userLibrary.getAll();
          const borrowingUser = users.find((u) => u.borrowedBooks.includes(bookId));
          if (borrowingUser) {
            borrowingUser.borrowedBooks = borrowingUser.borrowedBooks.filter((id) => id !== bookId);
          }
          book.isBorrowed = false;
          saveData();
          updateLists();
          showModal('Повернення', `Книгу "${book.title}" успішно повернуто.`);
        } else {
          const users = userLibrary.getAll();
          if (users.length === 0) {
            showModal('Упс...', 'Немає зареєстрованих користувачів.');
            return;
          }

          const listGroup = document.createElement('div');
          listGroup.className = 'list-group';
          users.forEach((user) => {
            const btn = document.createElement('button');
            btn.className =
              'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            btn.innerHTML = `<span>${user.name}</span> <span class="badge bg-secondary rounded-pill">${user.borrowedBooks.length}/3</span>`;

            btn.onclick = () => {
              document.querySelector('.modal-backdrop')?.remove();
              document.querySelector('.modal')?.remove();

              if (user.borrowedBooks.length >= 3) {
                showModal(
                  'Полегше, пупс!',
                  `Користувач ${user.name} вже взяв максимальну кількість книг (3).`,
                );
                return;
              }

              user.borrowedBooks.push(bookId);
              book.isBorrowed = true;
              saveData();
              updateLists();
              showModal('Успіх', `Книгу "${book.title}" видано користувачу ${user.name}.`);
            };
            listGroup.appendChild(btn);
          });
          showModal('Оберіть користувача', listGroup);
        }
      },
    );

    bookListCol.appendChild(bookListEl);
    bookListCol.appendChild(
      createPagination(currentBookPage, filteredBooks.length, ITEMS_PER_PAGE, (page) => {
        currentBookPage = page;
        updateLists();
      }),
    );

    const allUsers = userLibrary.getAll();
    const paginatedUsers = allUsers.slice(
      (currentUserPage - 1) * ITEMS_PER_PAGE,
      currentUserPage * ITEMS_PER_PAGE,
    );

    const userListEl = createUserList(paginatedUsers, (id) => {
      const user = userLibrary.find(id);
      if (user && user.borrowedBooks.length > 0) {
        showModal(
          'Упс... видалення',
          'Не можна видалити користувача, поки він не повернув усі книги.',
        );
        return;
      }
      userLibrary.remove(id);
      saveData();
      updateLists();
    });

    userListCol.appendChild(userListEl);
    userListCol.appendChild(
      createPagination(currentUserPage, allUsers.length, ITEMS_PER_PAGE, (page) => {
        currentUserPage = page;
        updateLists();
      }),
    );
  }

  bookCol.appendChild(
    createBookForm((title, author, year) => {
      bookLibrary.add(new Book(generateId(), title, author, year));
      saveData();
      updateLists();
    }),
  );

  userCol.appendChild(
    createUserForm((id, name, email) => {
      if (userLibrary.find(id)) {
        showModal('Упс...', 'Такий вумний кадр як ти вже вибрав цей ID');
        return;
      }
      userLibrary.add(new User(id, name, email));
      saveData();
      updateLists();
    }),
  );

  updateLists();
}
