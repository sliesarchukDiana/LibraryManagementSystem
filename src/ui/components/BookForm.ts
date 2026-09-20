import { Validation } from '../../utils/validators';
import { createInput } from './utils';

export function createBookForm(
  onSubmit: (title: string, author: string, year: number) => void,
): HTMLFormElement {
  const form = document.createElement('form');
  form.className = 'card p-4 shadow-sm';

  const titleEl = document.createElement('h4');
  titleEl.textContent = 'Додати книгу';
  titleEl.className = 'mb-3';

  const titleInput = createInput('text', 'Назва книги', 'book-title');
  const authorInput = createInput('text', 'Автор', 'book-author');
  const yearInput = createInput('text', 'Рік видання', 'book-year');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'text-danger mb-3 d-none';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary w-100';
  submitBtn.textContent = 'Додати';

  form.append(
    titleEl,
    titleInput.wrapper,
    authorInput.wrapper,
    yearInput.wrapper,
    errorDiv,
    submitBtn,
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.input.value;
    const author = authorInput.input.value;
    const year = yearInput.input.value;

    if (
      !Validation.isRequired(title) ||
      !Validation.isRequired(author) ||
      !Validation.isRequired(year)
    ) {
      errorDiv.textContent = "Всі поля обов'язкові для заповнення";
      errorDiv.classList.remove('d-none');
      return;
    }

    if (!Validation.isYearValid(year)) {
      errorDiv.textContent = 'Некоректний рік видання (очікується 4 цифри, не більше поточного)';
      errorDiv.classList.remove('d-none');
      return;
    }

    errorDiv.classList.add('d-none');
    onSubmit(title, author, parseInt(year, 10));
    form.reset();
  });

  return form;
}
