export function createInput(type: string, placeholder: string, id: string) {
  const wrapper = document.createElement('div');
  wrapper.className = 'mb-3';

  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.className = 'form-control';
  input.placeholder = placeholder;

  wrapper.appendChild(input);
  return { wrapper, input };
}
