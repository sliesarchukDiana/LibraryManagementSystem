export function showModal(
  title: string,
  content: HTMLElement | string,
  actions?: HTMLElement,
): void {
  const overlay = document.createElement('div');
  overlay.className = 'modal-backdrop fade show';

  const modal = document.createElement('div');
  modal.className = 'modal fade show d-block';
  modal.tabIndex = -1;

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog modal-dialog-centered';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const header = document.createElement('div');
  header.className = 'modal-header';
  const titleEl = document.createElement('h5');
  titleEl.className = 'modal-title';
  titleEl.textContent = title;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-close';
  closeBtn.onclick = closeModal;
  header.append(titleEl, closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';
  if (typeof content === 'string') {
    body.textContent = content;
  } else {
    body.appendChild(content);
  }

  modalContent.append(header, body);

  if (actions) {
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.appendChild(actions);
    modalContent.appendChild(footer);
  }

  dialog.appendChild(modalContent);
  modal.appendChild(dialog);

  document.body.append(overlay, modal);

  function closeModal() {
    overlay.remove();
    modal.remove();
  }
}
