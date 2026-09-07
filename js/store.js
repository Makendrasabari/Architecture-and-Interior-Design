/**
 * STACKLY Architecture & Interior Design Studio
 * Store & Local State Management (Pure Vanilla JS)
 */

window.STACKLY_STORE = (function () {
  const STORAGE_KEY_AUTH = 'stackly_auth';
  const STORAGE_KEY_USER = 'stackly_user';
  const STORAGE_KEY_ROLE = 'stackly_role';
  const STORAGE_KEY_ARCH_TAB = 'stackly_arch_tab';
  const STORAGE_KEY_INT_TAB = 'stackly_int_tab';

  function init() {
    // Default initial user if not logged in
    if (!localStorage.getItem(STORAGE_KEY_USER)) {
      const defaultUser = {
        name: 'Alexander Wright',
        email: 'alexander.wright@stackly.com',
        title: 'Senior Partner Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
    }
  }

  init();

  function isAuthenticated() {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  }

  function getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      return data ? JSON.parse(data) : { name: 'Studio Member', email: 'atelier@gmail.com', role: 'Architecture Studio' };
    } catch (e) {
      return { name: 'Studio Member', email: 'atelier@gmail.com', role: 'Architecture Studio' };
    }
  }

  function login(user) {
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  }

  function logout(redirectUrl = 'login.html') {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 150);
  }

  function getRole() {
    return localStorage.getItem(STORAGE_KEY_ROLE) || 'architecture';
  }

  function setRole(role) {
    localStorage.setItem(STORAGE_KEY_ROLE, role);
  }

  function getArchTab() {
    return localStorage.getItem(STORAGE_KEY_ARCH_TAB) || 'overview';
  }

  function setArchTab(tab) {
    localStorage.setItem(STORAGE_KEY_ARCH_TAB, tab);
  }

  function getIntTab() {
    return localStorage.getItem(STORAGE_KEY_INT_TAB) || 'overview';
  }

  function setIntTab(tab) {
    localStorage.setItem(STORAGE_KEY_INT_TAB, tab);
  }

  function showToast(message, type = 'success') {
    // Alert popups disabled throughout the website per user specifications
  }

  return {
    isAuthenticated,
    getUser,
    login,
    logout,
    getRole,
    setRole,
    getArchTab,
    setArchTab,
    getIntTab,
    setIntTab,
    showToast
  };
})();
