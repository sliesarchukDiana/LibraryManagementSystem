import { IBook } from '../../models/interfaces/IBook';

export function createBookList(
  books: IBook[],
  onDelete: (id: string) => void,
  onToggleBorrow: (id: string) => void,
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'card p-4 shadow-sm';

  const title = document.createElement('h4');
  title.textContent = 'Список книг';
  title.className = 'mb-3';
  container.appendChild(title);

  if (books.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Нет добавленных книг.';
    container.appendChild(empty);
    return container;
  }

  const list = document.createElement('ul');
  list.className = 'list-group';

  books.forEach((book) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const info = document.createElement('div');
    info.textContent = `${book.title} — ${book.author} (${book.year})`;
    if (book.isBorrowed) {
      info.classList.add('text-decoration-line-through', 'text-muted');
    }

    const actions = document.createElement('div');

    const borrowBtn = document.createElement('button');
    borrowBtn.className = `btn btn-sm me-2 ${book.isBorrowed ? 'btn-warning' : 'btn-success'}`;
    borrowBtn.textContent = book.isBorrowed ? 'Вернуть' : 'Взять';
    borrowBtn.onclick = () => onToggleBorrow(book.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.onclick = () => onDelete(book.id);

    actions.append(borrowBtn, deleteBtn);
    li.append(info, actions);
    list.appendChild(li);
  });

  container.appendChild(list);
  return container;
}
