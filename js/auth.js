/**
 * STACKLY Architecture & Interior Design Studio
 * Authentication & Role Selection (Pure Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initSignUpForm();
  initRoleSelect();
});

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  // Studio Role Cards interaction
  const roleCards = form.querySelectorAll('.auth-role-card');
  roleCards.forEach((card) => {
    card.addEventListener('click', () => {
      roleCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');

    let isValid = true;
    const email = emailInput.value.trim();
    const pass = passInput.value;

    // Email validation: must be @gmail.com format
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(email)) {
      document.getElementById('login-field-email').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('login-field-email').classList.remove('has-error');
    }

    // Password validation: required
    if (!pass) {
      document.getElementById('login-field-password').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('login-field-password').classList.remove('has-error');
    }

    if (!isValid) return;

    // Read selected studio role directly from login form
    const checkedRole = form.querySelector('input[name="studio_role"]:checked');
    const role = checkedRole ? checkedRole.value : 'architecture';

    const userName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const roleLabel = role === 'interior' ? 'Interior Design Studio' : 'Architecture Studio';

    if (window.STACKLY_STORE) {
      window.STACKLY_STORE.login({
        name: userName || (role === 'interior' ? 'Elena Rostova' : 'Alexander Wright'),
        email: email,
        role: roleLabel,
        title: role === 'architecture' ? 'Senior Partner Architect' : 'Senior Interior Designer'
      });
      window.STACKLY_STORE.setRole(role);
    }

    // Direct dashboard navigation based on selected role (no separate role selector page needed)
    setTimeout(() => {
      if (role === 'interior') {
        window.location.href = 'interior-dashboard.html';
      } else {
        window.location.href = 'architecture-dashboard.html';
      }
    }, 200);
  });
}

function initSignUpForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm-password');

    let isValid = true;

    if (!nameInput.value.trim()) {
      document.getElementById('signup-field-name').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('signup-field-name').classList.remove('has-error');
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(emailInput.value.trim())) {
      document.getElementById('signup-field-email').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('signup-field-email').classList.remove('has-error');
    }

    if (!passInput.value) {
      document.getElementById('signup-field-password').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('signup-field-password').classList.remove('has-error');
    }

    if (!confirmInput || !confirmInput.value || confirmInput.value !== passInput.value) {
      const confirmField = document.getElementById('signup-field-confirm-password');
      if (confirmField) confirmField.classList.add('has-error');
      isValid = false;
    } else {
      const confirmField = document.getElementById('signup-field-confirm-password');
      if (confirmField) confirmField.classList.remove('has-error');
    }

    if (!isValid) return;

    if (window.STACKLY_STORE) {
      window.STACKLY_STORE.login({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        title: 'Client Partner'
      });
    }

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
  });
}

function initRoleSelect() {
  const archCard = document.getElementById('select-architecture-role');
  const interiorCard = document.getElementById('select-interior-role');

  if (archCard) {
    archCard.addEventListener('click', () => {
      if (window.STACKLY_STORE) {
        window.STACKLY_STORE.setRole('architecture');
      }
      setTimeout(() => {
        window.location.href = 'architecture-dashboard.html';
      }, 150);
    });
  }

  if (interiorCard) {
    interiorCard.addEventListener('click', () => {
      if (window.STACKLY_STORE) {
        window.STACKLY_STORE.setRole('interior');
      }
      setTimeout(() => {
        window.location.href = 'interior-dashboard.html';
      }, 150);
    });
  }
}
