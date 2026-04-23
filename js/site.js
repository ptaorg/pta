
const mobileOverlay = document.getElementById('mobileOverlay');
const hamburger = document.getElementById('hamburger');
const closeOverlay = document.getElementById('closeOverlay');

if (hamburger && mobileOverlay) {
  hamburger.addEventListener('click', () => {
    const willOpen = !mobileOverlay.classList.contains('is-open');
    mobileOverlay.classList.toggle('is-open', willOpen);
    hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });
}
if (closeOverlay && mobileOverlay) {
  closeOverlay.addEventListener('click', () => {
    mobileOverlay.classList.remove('is-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  });
}
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) {
      mobileOverlay.classList.remove('is-open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Dropdown / mega-menu support on click and keyboard
const dropdownItems = document.querySelectorAll('.nav-item');
const closeAllDropdowns = (except = null) => {
  dropdownItems.forEach((item) => {
    if (item !== except) {
      item.classList.remove('is-open');
      const trigger = item.querySelector('.nav-link');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
};

dropdownItems.forEach((item) => {
  const menu = item.querySelector('.mega-menu');
  const trigger = item.querySelector('.nav-link');
  if (!menu || !trigger) return;

  item.classList.add('has-dropdown');
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', (e) => {
    const href = trigger.getAttribute('href') || '#';
    const isPlaceholder = href === '#' || href === '';
    const isOpen = item.classList.contains('is-open');

    if (isPlaceholder || !isOpen) {
      e.preventDefault();
      closeAllDropdowns(item);
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    }
  });

  item.addEventListener('mouseleave', () => {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.desktop-nav')) closeAllDropdowns();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    if (mobileOverlay) mobileOverlay.classList.remove('is-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('[data-modal-law]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-modal-law');
    if (!window.LAW_DATA || !window.LAW_DATA[key]) return;
    const data = window.LAW_DATA[key];
    const modal = document.getElementById('lawModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    const evidenceHtml = (data.evidence || []).map((item) =>
      `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.label} ↗</a>`
    ).join('');

    body.innerHTML = `
      <h2 style="color:var(--color-navy); margin-bottom:10px;">${data.title}</h2>
      ${data.body}
      ${evidenceHtml ? `<div class="evidence-links">${evidenceHtml}</div>` : ''}
    `;
    modal.classList.add('is-open');
  });
});

const modal = document.getElementById('lawModal');
const modalClose = document.getElementById('modalClose');
if (modalClose && modal) {
  modalClose.addEventListener('click', () => modal.classList.remove('is-open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
}

document.querySelectorAll('.egov-link').forEach((link) => {
  if (!link.textContent.includes('↗')) link.textContent = `${link.textContent} ↗`;
});
