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
        (bookId) => {
          const book = bookLibrary.find(bookId);
          if (!book) return;

          if (book.isBorrowed) {
            const users = userLibrary.getAll();
            const borrowingUser = users.find((u) => u.borrowedBooks.includes(bookId));

            if (borrowingUser) {
              borrowingUser.borrowedBooks = borrowingUser.borrowedBooks.filter(
                (id) => id !== bookId,
              );
            }
            book.isBorrowed = false;
            saveData();
            updateLists();
            showModal('Возврат', `Книга "${book.title}" успешно возвращена.`);
          } else {
            const users = userLibrary.getAll();
            if (users.length === 0) {
              showModal('Ошибка', 'Нет зарегистрированных пользователей.');
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
                    'Лимит превышен',
                    `Пользователь ${user.name} уже взял максимальное количество книг (3).`,
                  );
                  return;
                }

                user.borrowedBooks.push(bookId);
                book.isBorrowed = true;
                saveData();
                updateLists();
                showModal('Успех', `Книга "${book.title}" выдана пользователю ${user.name}.`);
              };
              listGroup.appendChild(btn);
            });

            showModal('Выберите пользователя', listGroup);
          }
        },
      ),
    );

    userListCol.appendChild(
      createUserList(userLibrary.getAll(), (id) => {
        const user = userLibrary.find(id);
        if (user && user.borrowedBooks.length > 0) {
          showModal('Ошибка удаления', 'Нельзя удалить пользователя, пока он не вернул все книги.');
          return;
        }
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
