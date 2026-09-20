import { IUser } from '../../models/interfaces/IUser';

export function createUserList(users: IUser[], onDelete: (id: string) => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'card p-4 shadow-sm';

  const title = document.createElement('h4');
  title.textContent = 'Список пользователей';
  title.className = 'mb-3';
  container.appendChild(title);

  if (users.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Нет добавленных пользователей.';
    container.appendChild(empty);
    return container;
  }

  const list = document.createElement('ul');
  list.className = 'list-group';

  users.forEach((user) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const info = document.createElement('div');
    info.textContent = `ID: ${user.id} | ${user.name} | Книг на руках: ${user.borrowedBooks?.length || 0}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.onclick = () => onDelete(user.id);

    li.append(info, deleteBtn);
    list.appendChild(li);
  });

  container.appendChild(list);
  return container;
}
