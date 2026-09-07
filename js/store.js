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
        avatar: 'assets/images/avatar-alexander.webp'
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
    }
    // If not authenticated, ensure previous dashboard active tabs are cleared
    if (!isAuthenticated()) {
      localStorage.removeItem(STORAGE_KEY_ARCH_TAB);
      localStorage.removeItem(STORAGE_KEY_INT_TAB);
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
    // Always reset dashboard starting page to default overview on login
    localStorage.setItem(STORAGE_KEY_ARCH_TAB, 'overview');
    localStorage.setItem(STORAGE_KEY_INT_TAB, 'overview');
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  }

  function logout(redirectUrl = 'login.html') {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    // Clear last visited dashboard route/page state across logout
    localStorage.removeItem(STORAGE_KEY_ARCH_TAB);
    localStorage.removeItem(STORAGE_KEY_INT_TAB);
    try {
      sessionStorage.clear();
    } catch (e) {}
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
    if (!isAuthenticated()) return 'overview';
    return localStorage.getItem(STORAGE_KEY_ARCH_TAB) || 'overview';
  }

  function setArchTab(tab) {
    localStorage.setItem(STORAGE_KEY_ARCH_TAB, tab);
  }

  function getIntTab() {
    if (!isAuthenticated()) return 'overview';
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
