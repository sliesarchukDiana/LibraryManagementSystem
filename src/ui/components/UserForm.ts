import { Validation } from '../../utils/validators';
import { createInput } from './utils';

export function createUserForm(
  onSubmit: (id: string, name: string, email: string) => void,
): HTMLFormElement {
  const form = document.createElement('form');
  form.className = 'card p-4 shadow-sm';

  const titleEl = document.createElement('h4');
  titleEl.textContent = 'Додати користувача';
  titleEl.className = 'mb-3';

  const idInput = createInput('text', 'ID (тільки цифри)', 'user-id');
  const nameInput = createInput('text', "Ім'я", 'user-name');
  const emailInput = createInput('email', 'Email', 'user-email');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'text-danger mb-3 d-none';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-success w-100';
  submitBtn.textContent = 'Додати';

  form.append(titleEl, idInput.wrapper, nameInput.wrapper, emailInput.wrapper, errorDiv, submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = idInput.input.value;
    const name = nameInput.input.value;
    const email = emailInput.input.value;

    if (
      !Validation.isRequired(id) ||
      !Validation.isRequired(name) ||
      !Validation.isRequired(email)
    ) {
      errorDiv.textContent = "Всі поля обов'язкові для заповнення";
      errorDiv.classList.remove('d-none');
      return;
    }

    if (!Validation.isUserIdValid(id)) {
      errorDiv.textContent = 'Поле ID повинно містити тільки цифри';
      errorDiv.classList.remove('d-none');
      return;
    }

    errorDiv.classList.add('d-none');
    onSubmit(id, name, email);
    form.reset();
  });

  return form;
}
