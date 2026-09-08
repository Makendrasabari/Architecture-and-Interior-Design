/**
 * STACKLY Architecture & Interior Design Studio
 * Salem Atelier & Contact Form Interactions (Pure Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initSalemMapInteractions();
});

function initContactForm() {
  const form = document.getElementById('contact-inquiry-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const disciplineInput = document.getElementById('contact-discipline');
  const locationInput = document.getElementById('contact-location');
  const messageInput = document.getElementById('contact-message');

  const groupName = document.getElementById('group-name');
  const groupEmail = document.getElementById('group-email');
  const groupPhone = document.getElementById('group-phone');
  const groupDiscipline = document.getElementById('group-discipline');
  const groupLocation = document.getElementById('group-location');
  const groupMessage = document.getElementById('group-message');

  const emailMsg = document.getElementById('msg-email');

  // Real-time error dismissal on input
  if (nameInput && groupName) {
    nameInput.addEventListener('input', () => groupName.classList.remove('has-error'));
  }
  if (emailInput && groupEmail) {
    emailInput.addEventListener('input', () => groupEmail.classList.remove('has-error'));
  }
  if (phoneInput && groupPhone) {
    phoneInput.addEventListener('input', () => groupPhone.classList.remove('has-error'));
  }
  if (disciplineInput && groupDiscipline) {
    disciplineInput.addEventListener('change', () => groupDiscipline.classList.remove('has-error'));
  }
  if (locationInput && groupLocation) {
    locationInput.addEventListener('input', () => groupLocation.classList.remove('has-error'));
  }
  if (messageInput && groupMessage) {
    messageInput.addEventListener('input', () => groupMessage.classList.remove('has-error'));
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      try {
        sessionStorage.setItem('stackly_saved_scroll', String(scrollY));
        sessionStorage.setItem('stackly_returning_from_404', 'true');
        sessionStorage.setItem('stackly_source_page', window.location.pathname);
      } catch (err) {}
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    try {
      sessionStorage.setItem('stackly_saved_scroll', String(scrollY));
      sessionStorage.setItem('stackly_returning_from_404', 'true');
      sessionStorage.setItem('stackly_source_page', window.location.pathname);
    } catch (err) {}

    window.location.href = '404.html';
  });
}

function initSalemMapInteractions() {
  const mapSection = document.querySelector('.salem-map-section');
  const mapContainer = document.getElementById('salem-map');
  if (!mapContainer && !mapSection) return;

  const targetElement = mapSection || mapContainer;
  targetElement.style.cursor = 'pointer';

  const googleMapsUrl = 'https://maps.google.com/?q=142+Washington+Street+Salem+MA+01970';

  targetElement.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')) {
      return; // allow default anchor navigation to Google Maps
    }
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  });
}
