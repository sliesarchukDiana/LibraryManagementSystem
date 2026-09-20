import { createBookForm } from './components/BookForm';
import { createUserForm } from './components/UserForm';

export function renderApp(rootId: string): void {
  const root = document.getElementById(rootId);
  if (!root) throw new Error(`Елемент з id "${rootId}" не знайдено`);

  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container mt-5';

  const header = document.createElement('h2');
  header.className = 'text-center mb-4';
  header.textContent = 'Управління бібліотекою';

  const formsRow = document.createElement('div');
  formsRow.className = 'row mb-4 g-4';

  const bookCol = document.createElement('div');
  bookCol.className = 'col-md-6';
  bookCol.appendChild(
    createBookForm((title, author, year) => {
      console.log('Додано книгу:', { title, author, year });
    }),
  );

  const userCol = document.createElement('div');
  userCol.className = 'col-md-6';
  userCol.appendChild(
    createUserForm((id, name, email) => {
      console.log('Додано користувача:', { id, name, email });
    }),
  );

  formsRow.append(bookCol, userCol);

  const listsRow = document.createElement('div');
  listsRow.className = 'row g-4';

  const bookListCol = document.createElement('div');
  bookListCol.className = 'col-md-6';
  bookListCol.id = 'book-list-container';

  const userListCol = document.createElement('div');
  userListCol.className = 'col-md-6';
  userListCol.id = 'user-list-container';

  listsRow.append(bookListCol, userListCol);

  container.append(header, formsRow, listsRow);
  root.appendChild(container);
}
