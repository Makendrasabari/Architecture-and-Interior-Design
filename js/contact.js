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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalid = null;

    // Validate Name
    if (!nameInput || !nameInput.value.trim()) {
      if (groupName) groupName.classList.add('has-error');
      isValid = false;
      if (!firstInvalid && nameInput) firstInvalid = nameInput;
    } else if (groupName) {
      groupName.classList.remove('has-error');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      if (groupEmail) groupEmail.classList.add('has-error');
      if (emailMsg) emailMsg.textContent = 'Please enter email';
      isValid = false;
      if (!firstInvalid && emailInput) firstInvalid = emailInput;
    } else if (!emailRegex.test(emailVal)) {
      if (groupEmail) groupEmail.classList.add('has-error');
      if (emailMsg) emailMsg.textContent = 'Please enter a valid email';
      isValid = false;
      if (!firstInvalid && emailInput) firstInvalid = emailInput;
    } else if (groupEmail) {
      groupEmail.classList.remove('has-error');
    }

    // Validate Phone Number
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (!phoneVal) {
      if (groupPhone) groupPhone.classList.add('has-error');
      isValid = false;
      if (!firstInvalid && phoneInput) firstInvalid = phoneInput;
    } else if (groupPhone) {
      groupPhone.classList.remove('has-error');
    }

    // Validate Primary Discipline
    const disciplineVal = disciplineInput ? disciplineInput.value.trim() : '';
    if (!disciplineVal) {
      if (groupDiscipline) groupDiscipline.classList.add('has-error');
      isValid = false;
      if (!firstInvalid && disciplineInput) firstInvalid = disciplineInput;
    } else if (groupDiscipline) {
      groupDiscipline.classList.remove('has-error');
    }

    // Validate Project Location & Budget
    const locationVal = locationInput ? locationInput.value.trim() : '';
    if (!locationVal) {
      if (groupLocation) groupLocation.classList.add('has-error');
      isValid = false;
      if (!firstInvalid && locationInput) firstInvalid = locationInput;
    } else if (groupLocation) {
      groupLocation.classList.remove('has-error');
    }

    // Validate Project Vision & Timeline
    const messageVal = messageInput ? messageInput.value.trim() : '';
    if (!messageVal) {
      if (groupMessage) groupMessage.classList.add('has-error');
      isValid = false;
      if (!firstInvalid && messageInput) firstInvalid = messageInput;
    } else if (groupMessage) {
      groupMessage.classList.remove('has-error');
    }

    const statusMsg = document.getElementById('contact-status-msg');
    if (statusMsg) statusMsg.style.display = 'none';

    if (!isValid) {
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // When all details are filled out, navigate to 404 page
    window.location.href = '404.html';
  });
}

function initSalemMapInteractions() {
  const mapContainer = document.getElementById('salem-map');
  if (!mapContainer) return;

  mapContainer.style.cursor = 'pointer';

  const studioPin = mapContainer.querySelector('#salem-pin-point');
  if (studioPin) {
    studioPin.style.cursor = 'pointer';
  }
}
