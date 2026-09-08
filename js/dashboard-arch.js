/**
 * STACKLY Architecture & Interior Design Studio
 * Architecture Studio Command Center (Pure Vanilla JS - Canvas 2D)
 */

document.addEventListener('DOMContentLoaded', () => {
  initArchDashboard();
});

let activeArchModule = 'overview';
let activeSelectedRoom = null;

function initArchDashboard() {
  if (window.STACKLY_DATA && window.STACKLY_DATA.floorPlanData) {
    activeSelectedRoom = window.STACKLY_DATA.floorPlanData.rooms[0];
  }

  // Restore active tab from store if saved
  if (window.STACKLY_STORE) {
    activeArchModule = window.STACKLY_STORE.getArchTab() || 'overview';
    const user = window.STACKLY_STORE.getUser();
    const userBadge = document.getElementById('arch-active-user');
    if (userBadge && user) {
      userBadge.innerText = user.name || 'Alexander Wright';
    }
  }

  updateArchHeaderTitle(activeArchModule);
  setupUserProfileAndHeader();
  setupSidebarNav();
  setupBrandLogoHandler();
  renderArchModule(activeArchModule);
}

function setupBrandLogoHandler() {
  const brandLogos = document.querySelectorAll('.brand-logo, .dashboard-brand a, .navbar-brand');
  brandLogos.forEach((logo) => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      activeArchModule = 'overview';
      if (window.STACKLY_STORE) {
        window.STACKLY_STORE.setArchTab('overview');
      }
      updateArchHeaderTitle('overview');
      renderArchModule('overview');

      if (typeof window.STACKLY_RESET_SCROLL === 'function') {
        window.STACKLY_RESET_SCROLL();
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }

      const sidebar = document.getElementById('arch-sidebar');
      const backdrop = document.querySelector('.dashboard-sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    });
  });
}

const ARCH_MODULE_TITLES = {
  'overview': 'Overview',
  'projects': 'Projects',
  'floorplans': 'Floor Plans',
  'analytics': 'Analytics',
  'reports': 'Reports'
};

function updateArchHeaderTitle(tabName) {
  const headingEl = document.getElementById('dashboard-active-heading');
  if (headingEl) {
    headingEl.innerText = ARCH_MODULE_TITLES[tabName] || 'Overview';
  }
}

function setupUserProfileAndHeader() {
  const user = window.STACKLY_STORE ? window.STACKLY_STORE.getUser() : null;
  const name = (user && user.name) ? user.name : 'Alexander Wright';
  const email = (user && user.email) ? user.email : 'alexander.wright@gmail.com';
  const role = (user && user.role) ? user.role : 'Architecture Studio';
  const initial = name.trim().charAt(0).toUpperCase() || 'A';

  const navUsername = document.getElementById('dashboard-nav-username');
  if (navUsername) navUsername.innerText = name;

  const profileInitials = document.getElementById('profile-avatar-initials');
  if (profileInitials) profileInitials.innerText = initial;

  const dropdownInitials = document.getElementById('dropdown-avatar-initials');
  if (dropdownInitials) dropdownInitials.innerText = initial;

  const dropdownProfileName = document.getElementById('dropdown-profile-name');
  if (dropdownProfileName) dropdownProfileName.innerText = name;

  const dropdownUserName = document.getElementById('dropdown-user-name');
  if (dropdownUserName) dropdownUserName.innerText = name;

  const dropdownUserEmail = document.getElementById('dropdown-user-email');
  if (dropdownUserEmail) dropdownUserEmail.innerText = email;

  const dropdownUserRole = document.getElementById('dropdown-user-role');
  if (dropdownUserRole) dropdownUserRole.innerText = role;

  // Dropdown interactivity
  const notifBtn = document.getElementById('dashboard-notif-btn');
  const notifDropdown = document.getElementById('dashboard-notif-dropdown');
  const profileTrigger = document.getElementById('dashboard-profile-trigger');
  const profileDropdown = document.getElementById('dashboard-profile-dropdown');

  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = profileDropdown.classList.contains('active');
      if (notifDropdown) notifDropdown.classList.remove('active');
      profileDropdown.classList.toggle('active', !isOpen);
      profileTrigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBtn) {
      notifDropdown.classList.remove('active');
    }
    if (profileDropdown && !profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
      profileDropdown.classList.remove('active');
      if (profileTrigger) profileTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Sign out handlers (Sidebar and Dropdown)
  const performSignOut = () => {
    if (window.STACKLY_STORE) {
      window.STACKLY_STORE.logout('login.html');
    } else {
      window.location.href = 'login.html';
    }
  };

  const sidebarSignout = document.getElementById('sidebar-signout-btn');
  if (sidebarSignout) sidebarSignout.addEventListener('click', performSignOut);

  const dropdownSignout = document.getElementById('dropdown-signout-btn');
  if (dropdownSignout) dropdownSignout.addEventListener('click', performSignOut);
}

function setupSidebarNav() {
  const navBtns = document.querySelectorAll('#arch-nav-modules .dashboard-nav-btn');
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeArchModule = btn.getAttribute('data-arch-tab');
      if (window.STACKLY_STORE) {
        window.STACKLY_STORE.setArchTab(activeArchModule);
      }
      updateArchHeaderTitle(activeArchModule);
      renderArchModule(activeArchModule);
    });
  });
}

function renderArchModule(moduleName) {
  const container = document.getElementById('arch-module-container');
  if (!container) return;

  // Immediately reset scroll position to the top of the viewport
  if (typeof window.STACKLY_RESET_SCROLL === 'function') {
    window.STACKLY_RESET_SCROLL();
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    container.scrollTop = 0;
  }

  // Update active state in sidebar
  document.querySelectorAll('#arch-nav-modules .dashboard-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-arch-tab') === moduleName);
  });

  switch (moduleName) {
    case 'overview':
      container.innerHTML = getOverviewHTML();
      initOverviewCharts();
      break;
    case 'projects':
      container.innerHTML = getProjectsHTML();
      initProjectsModuleEvents();
      break;
    case 'floorplans':
      container.innerHTML = getFloorPlansHTML();
      initFloorPlanEvents();
      break;
    case 'analytics':
      container.innerHTML = getAnalyticsHTML();
      break;
    case 'reports':
      container.innerHTML = getReportsHTML();
      initReportsEvents();
      break;
    default:
      container.innerHTML = getOverviewHTML();
      initOverviewCharts();
  }

  // Ensure scroll is at 0 after rendering content
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  container.scrollTop = 0;

  // Trigger smooth motion animations for newly injected tab content
  if (window.STACKLY_MOTION && window.STACKLY_MOTION.animateContainer) {
    window.STACKLY_MOTION.animateContainer(container);
  }
}

/**
 * MODULE 1: OVERVIEW
 */
function getOverviewHTML() {
  const projects = window.STACKLY_DATA ? window.STACKLY_DATA.projects : [];

  return `
    <div class="module-view module-overview">
      <div class="welcome-note-card" style="background: linear-gradient(135deg, rgba(20, 20, 22, 0.03) 0%, rgba(217, 38, 56, 0.05) 100%); border: 1px solid rgba(20, 20, 22, 0.08); border-left: 4px solid var(--color-red-primary); border-radius: var(--radius-sm); padding: 1.5rem 1.75rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
          <span class="badge badge-red-solid" style="font-size: 0.7rem;">Studio Command</span>
          <span style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-charcoal-muted);">Architecture Portal</span>
        </div>
        <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--color-near-black);">Welcome to STACKLY Architecture Studio Command Center</h3>
        <p style="font-size: 0.9375rem; color: var(--color-charcoal-muted); margin: 0; line-height: 1.6;">
          Your centralized workspace for tracking active master commissions, structural BIM floor plans, budget allocations, and milestone analytical dossiers.
        </p>
      </div>

      <div style="margin-bottom: 2rem;">
        <span class="eyebrow">Studio Executive Summary</span>
        <h2 style="font-size: 2rem;">Active Architecture Commissions</h2>
      </div>

      <!-- 4 Overview Metric Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Active Projects</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="20" x2="22" y2="20"></line><line x1="4" y1="10" x2="20" y2="10"></line><polygon points="12 2 2 10 22 10 12 2"></polygon><line x1="6" y1="10" x2="6" y2="20"></line><line x1="10" y1="10" x2="10" y2="20"></line><line x1="14" y1="10" x2="14" y2="20"></line><line x1="18" y1="10" x2="18" y2="20"></line></svg></div>
          </div>
          <div class="metric-value">04</div>
          <div class="metric-change">
            <span>↑ 2 Under Active Construction</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Total Managed Budget</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
          </div>
          <div class="metric-value">$89.2M</div>
          <div class="metric-change">
            <span>↑ +14.2% YoY Capital Value</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Permits Approved</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 3 21 21 3 21 3 3"></polygon><line x1="9" y1="15" x2="9" y2="21"></line><line x1="15" y1="15" x2="15" y2="21"></line><line x1="9" y1="18" x2="12" y2="18"></line></svg></div>
          </div>
          <div class="metric-value">06</div>
          <div class="metric-change">
            <span>100% Zoning Compliance</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Net-Zero Efficiency</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg></div>
          </div>
          <div class="metric-value">94%</div>
          <div class="metric-change">
            <span>Geothermal & Passive Envelope</span>
          </div>
        </div>
      </div>

      <!-- Two Native Canvas 2D Charts -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <span class="eyebrow" style="margin-bottom: 0.25rem;">Milestone Progress</span>
              <h3 style="font-size: 1.25rem;">Construction Stage Completion</h3>
            </div>
            <span class="badge badge-red">Live Schedule</span>
          </div>
          <div style="height: 280px; position: relative;">
            <canvas id="arch-progress-canvas" width="600" height="280"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <div>
              <span class="eyebrow" style="margin-bottom: 0.25rem;">Capital Stewardship</span>
              <h3 style="font-size: 1.25rem;">Budget Allocation by Commission</h3>
            </div>
            <span class="badge badge-outline">$ Millions USD</span>
          </div>
          <div style="height: 280px; position: relative;">
            <canvas id="arch-budget-canvas" width="600" height="280"></canvas>
          </div>
        </div>
      </div>

      <!-- Priority Projects Table -->
      <div class="dashboard-table-card" style="margin-top: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <span class="eyebrow" style="margin-bottom: 0.25rem;">Commissions Ledger</span>
            <h3 style="font-size: 1.35rem;">Active Commission Details</h3>
          </div>
          <button class="btn btn-secondary btn-sm" id="view-all-projects-btn">
            <span>View Full Directory</span>
            <span class="btn-icon">→</span>
          </button>
        </div>

        <div class="table-responsive">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Commission Name</th>
                <th>Typology</th>
                <th>Location</th>
                <th>Handover</th>
                <th>Progress</th>
                <th style="text-align: right;">Capital</th>
                <th style="text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${projects.slice(0, 4).map((p) => `
                <tr style="cursor: pointer;" data-project-id="${p.id}">
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <img src="${p.image}" alt="${p.name}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0;" />
                      <strong style="font-weight: 700; color: var(--color-near-black);">${p.name}</strong>
                    </div>
                  </td>
                  <td><span class="badge badge-outline">${p.category}</span></td>
                  <td style="color: var(--color-charcoal-muted);">${p.location}</td>
                  <td style="font-family: var(--font-mono); font-size: 0.8125rem;">${p.completion}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                      <div style="width: 80px; height: 6px; background: rgba(20,20,22,0.1); border-radius: 3px; overflow: hidden; flex-shrink: 0;">
                        <div style="width: ${p.progress}%; height: 100%; background: var(--gradient-red-primary);"></div>
                      </div>
                      <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; min-width: 32px;">${p.progress}%</span>
                    </div>
                  </td>
                  <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-red-primary); text-align: right;">${p.budget}</td>
                  <td style="text-align: right;">
                    <span class="badge ${p.progress === 100 ? 'badge-dark' : 'badge-red'}">${p.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function initOverviewCharts() {
  const progressCanvas = document.getElementById('arch-progress-canvas');
  const budgetCanvas = document.getElementById('arch-budget-canvas');
  const viewAllBtn = document.getElementById('view-all-projects-btn');

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  const renderAll = () => {
    if (progressCanvas && document.body.contains(progressCanvas)) {
      drawProgressCanvas(progressCanvas);
    }
    if (budgetCanvas && document.body.contains(budgetCanvas)) {
      drawBudgetCanvas(budgetCanvas);
    }
  };

  renderAll();
  window.removeEventListener('resize', renderAll);
  window.addEventListener('resize', renderAll);
}

function drawProgressCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
  const width = Math.max(300, rect.width);
  const height = Math.max(240, rect.height || 280);
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Villa Aurelia', val: 100 },
    { label: 'Salem Res.', val: 100 },
    { label: 'Urban House', val: 82 },
    { label: 'Horizon Off.', val: 64 },
    { label: 'Kyoto Court', val: 45 }
  ];

  ctx.clearRect(0, 0, width, height);

  const padLeft = 100;
  const padRight = 50;
  const padTop = 25;
  const padBottom = 25;
  const chartWidth = Math.max(100, width - padLeft - padRight);
  const chartHeight = Math.max(100, height - padTop - padBottom);
  const rowHeight = chartHeight / data.length;

  data.forEach((item, index) => {
    const y = padTop + index * rowHeight;
    const barHeight = 18;

    // Label
    ctx.fillStyle = '#27272a';
    ctx.font = '600 12px "Space Grotesk", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, padLeft - 14, y + barHeight / 2);

    // Track Background
    ctx.fillStyle = '#f1f1f4';
    ctx.beginPath();
    ctx.roundRect(padLeft, y, chartWidth, barHeight, 4);
    ctx.fill();

    // Value Bar Gradient
    const fillWidth = (item.val / 100) * chartWidth;
    const grad = ctx.createLinearGradient(padLeft, y, padLeft + fillWidth, y);
    grad.addColorStop(0, '#d92638');
    grad.addColorStop(1, '#8b0e1e');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(padLeft, y, fillWidth, barHeight, 4);
    ctx.fill();

    // Value Text
    ctx.fillStyle = '#141416';
    ctx.font = '700 11px "Space Grotesk", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.val}%`, padLeft + fillWidth + 8, y + barHeight / 2);
  });
}

function drawBudgetCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
  const width = Math.max(300, rect.width);
  const height = Math.max(240, rect.height || 280);
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Villa Aurelia', budget: 18.4 },
    { label: 'Salem Res.', budget: 9.2 },
    { label: 'Urban House', budget: 12.1 },
    { label: 'Horizon Off.', budget: 42.0 },
    { label: 'Terra Retreat', budget: 26.5 }
  ];

  ctx.clearRect(0, 0, width, height);

  const padLeft = 48;
  const padRight = 48;
  const padTop = 30;
  const padBottom = 45;
  const chartWidth = Math.max(100, width - padLeft - padRight);
  const chartHeight = Math.max(100, height - padTop - padBottom);

  const maxVal = 50; // $50M ceiling
  const gap = chartWidth / data.length;
  const barWidth = Math.max(16, Math.min(38, gap - 16));

  // Background grid lines
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 1;
  [0, 10, 20, 30, 40, 50].forEach(val => {
    const y = padTop + chartHeight - (val / maxVal) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(padLeft + chartWidth, y);
    ctx.stroke();

    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px "Space Grotesk", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${val}M`, padLeft - 6, y);
  });

  // Bars
  data.forEach((item, index) => {
    const x = padLeft + index * gap + (gap - barWidth) / 2;
    const barHeight = (item.budget / maxVal) * chartHeight;
    const y = padTop + chartHeight - barHeight;

    const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
    grad.addColorStop(0, '#d92638');
    grad.addColorStop(1, '#610913');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Value on top
    ctx.fillStyle = '#141416';
    ctx.font = '700 11px "Space Grotesk", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`$${item.budget}M`, x + barWidth / 2, y - 8);

    // Label below
    ctx.fillStyle = '#64646b';
    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(item.label, x + barWidth / 2, padTop + chartHeight + 18);
  });
}

/**
 * MODULE 2: PROJECTS
 */
function getProjectsHTML() {
  const projects = window.STACKLY_DATA ? window.STACKLY_DATA.projects : [];

  return `
    <div class="module-view module-projects">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="eyebrow">Studio Portfolio Directory</span>
          <h2 style="font-size: 2rem;">All Master Commissions</h2>
        </div>
      </div>

      <div class="projects-grid" id="arch-projects-grid" style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${projects.map(p => `
          <article class="project-card horizontal" data-project-id="${p.id}">
            <div class="project-image-wrapper">
              <img src="${p.image}" alt="${p.name}" class="project-image" />
              <div class="project-overlay"></div>
              <div class="project-meta-floating">
                <span class="project-tag-pill">${p.category}</span>
                <span class="project-year">${p.year}</span>
              </div>
            </div>
            <div class="project-body">
              <div>
                <div class="project-location">${p.location}</div>
                <h3 class="project-name">${p.name}</h3>
                <p class="project-description">${p.headline}</p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(20,20,22,0.06); padding-top: 1rem; margin-top: 1rem;">
                <span style="font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 700; color: var(--color-red-primary);">${p.budget}</span>
                <span class="badge ${p.progress === 100 ? 'badge-dark' : 'badge-red'}">${p.status}</span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function initProjectsModuleEvents() {
  const searchInput = document.getElementById('arch-proj-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const projects = window.STACKLY_DATA.projects.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    const grid = document.getElementById('arch-projects-grid');
    if (!grid) return;

    grid.innerHTML = projects.map(p => `
      <article class="project-card horizontal" data-project-id="${p.id}">
        <div class="project-image-wrapper">
          <img src="${p.image}" alt="${p.name}" class="project-image" />
          <div class="project-overlay"></div>
          <div class="project-meta-floating">
            <span class="project-tag-pill">${p.category}</span>
            <span class="project-year">${p.year}</span>
          </div>
        </div>
        <div class="project-body">
          <div>
            <div class="project-location">${p.location}</div>
            <h3 class="project-name">${p.name}</h3>
            <p class="project-description">${p.headline}</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(20,20,22,0.06); padding-top: 1rem; margin-top: 1rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 700; color: var(--color-red-primary);">${p.budget}</span>
            <span class="badge ${p.progress === 100 ? 'badge-dark' : 'badge-red'}">${p.status}</span>
          </div>
        </div>
      </article>
    `).join('');
  });
}

/**
 * MODULE 3: INTERACTIVE FLOOR PLANS
 */
function getFloorPlansHTML() {
  const fp = window.STACKLY_DATA.floorPlanData;
  const currentRoom = activeSelectedRoom || fp.rooms[0];

  return `
    <div class="module-view module-floorplans">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="eyebrow">CAD & BIM Integrated Viewer</span>
          <h2 style="font-size: 2rem;">${fp.projectTitle}</h2>
          <p style="font-size: 0.9375rem; color: var(--color-charcoal-muted); margin-top: 0.25rem;">
            Scale: <strong>${fp.scale}</strong> • Area: <strong>${fp.totalSquareFootage}</strong> • <strong>${fp.orientation}</strong>
          </p>
        </div>
      </div>

      <div class="floorplan-workspace-grid">
        <!-- Interactive SVG Plan Container -->
        <div class="chart-card" style="padding: 1.5rem; background: #151619; border-color: rgba(255,255,255,0.1); color: #fff;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-family: var(--font-mono); font-size: 0.75rem; color: rgba(255,255,255,0.6);">
            <span>CLICK ANY ROOM TO INSPECT ARCHITECTURAL SPECIFICATIONS</span>
            <span>VECTOR CAD LAYER: ACTIVE</span>
          </div>

          <div style="width: 100%; height: 500px; position: relative; background: #101114; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
            <svg id="arch-floorplan-svg" viewBox="0 0 540 520" style="width: 100%; height: 100%; display: block;">
              <!-- Grid background -->
              <defs>
                <pattern id="fpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#fpGrid)" />

              <!-- Outer Boundary Wall -->
              <rect x="40" y="40" width="460" height="470" fill="none" stroke="#d92638" stroke-width="2" stroke-dasharray="6,4" opacity="0.6" />

              <!-- Interactive Rooms -->
              ${fp.rooms.map(r => {
                const isSelected = r.id === currentRoom.id;
                const { x, y, width, height } = r.svgProps;
                return `
                  <g class="fp-room-group" data-room-id="${r.id}" style="cursor: pointer;">
                    <rect 
                      x="${x}" 
                      y="${y}" 
                      width="${width}" 
                      height="${height}" 
                      fill="${isSelected ? 'rgba(217, 38, 56, 0.45)' : 'rgba(255, 255, 255, 0.06)'}" 
                      stroke="${isSelected ? '#d92638' : 'rgba(255, 255, 255, 0.35)'}" 
                      stroke-width="${isSelected ? '2.5' : '1.2'}" 
                      rx="3"
                    />
                    <text 
                      x="${x + width / 2}" 
                      y="${y + height / 2 - 8}" 
                      fill="#ffffff" 
                      font-family="Syne, sans-serif" 
                      font-size="12" 
                      font-weight="700" 
                      text-anchor="middle"
                    >
                      ${r.name.split('&')[0]}
                    </text>
                    <text 
                      x="${x + width / 2}" 
                      y="${y + height / 2 + 12}" 
                      fill="rgba(255,255,255,0.7)" 
                      font-family="Space Grotesk, monospace" 
                      font-size="10" 
                      text-anchor="middle"
                    >
                      ${r.area}
                    </text>
                  </g>
                `;
              }).join('')}

              <!-- Circulation Arrows -->
              <path d="M 180, 70 L 180, 390" stroke="rgba(217,38,56,0.5)" stroke-width="2" stroke-dasharray="4,4" />
              <path d="M 310, 125 L 330, 125" stroke="rgba(217,38,56,0.5)" stroke-width="2" />
            </svg>
          </div>
        </div>

        <!-- Room Detail Inspection Card -->
        <div id="arch-room-detail-panel" class="metric-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span class="badge badge-red-solid">${currentRoom.zone}</span>
              <span style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-charcoal-muted);">${currentRoom.area}</span>
            </div>

            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${currentRoom.name}</h3>
            <p style="font-size: 0.875rem; color: var(--color-charcoal-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              ${currentRoom.description}
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.875rem; border-top: 1px solid rgba(20,20,22,0.08); padding-top: 1.25rem;">
              <div>
                <strong style="color: var(--color-near-black); display: block; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;">Dimensions</strong>
                <span>${currentRoom.dimensions}</span>
              </div>
              <div>
                <strong style="color: var(--color-near-black); display: block; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;">Ceiling Specification</strong>
                <span>${currentRoom.ceilingHeight}</span>
              </div>
              <div>
                <strong style="color: var(--color-near-black); display: block; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;">Flooring Material</strong>
                <span>${currentRoom.flooring}</span>
              </div>
              <div>
                <strong style="color: var(--color-near-black); display: block; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;">Architectural Glazing</strong>
                <span>${currentRoom.glazing}</span>
              </div>
              <div>
                <strong style="color: var(--color-near-black); display: block; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;">Acoustic & Controls</strong>
                <span>${currentRoom.lighting}</span>
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-sm" id="export-room-cad-btn" style="margin-top: 2rem;">
            <span>Export Room BIM Data (.DXF)</span>
            <span class="btn-icon">↓</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function initFloorPlanEvents() {
  const svg = document.getElementById('arch-floorplan-svg');
  if (!svg) return;

  const roomGroups = svg.querySelectorAll('.fp-room-group');
  roomGroups.forEach((group) => {
    group.addEventListener('click', () => {
      const roomId = group.getAttribute('data-room-id');
      const fp = window.STACKLY_DATA.floorPlanData;
      const found = fp.rooms.find(r => r.id === roomId);
      if (found) {
        activeSelectedRoom = found;
        renderArchModule('floorplans');
      }
    });
  });

  const exportCadBtn = document.getElementById('export-room-cad-btn');
  if (exportCadBtn) {
    exportCadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }
}

/**
 * MODULE 4: DESIGN ANALYTICS
 */
function getAnalyticsHTML() {
  return `
    <div class="module-view module-analytics">
      <div style="margin-bottom: 2rem;">
        <span class="eyebrow">Parametric Performance Indices</span>
        <h2 style="font-size: 2rem;">Environmental & Structural Analytics</h2>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Solar Energy Autonomy</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div>
          </div>
          <div class="metric-value">88.4%</div>
          <div class="metric-change">Rooftop Photovoltaic Solar Matrix</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Embodied Carbon Offset</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"></path><path d="M17 8a5 5 0 0 0-10 0c0 4 5 7 5 7s5-3 5-7z"></path></svg></div>
          </div>
          <div class="metric-value">-420 t</div>
          <div class="metric-change">Mass Timber & Low-Clinker Concrete</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Thermal U-Value Target</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg></div>
          </div>
          <div class="metric-value">0.14</div>
          <div class="metric-change">W/m²K Passive House Standard</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Cantilever Deflection Safety</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 3 21 21 3 21 3 3"></polygon><line x1="9" y1="15" x2="9" y2="21"></line><line x1="15" y1="15" x2="15" y2="21"></line></svg></div>
          </div>
          <div class="metric-value">L/680</div>
          <div class="metric-change">Post-Tension Tendon Load Rating</div>
        </div>
      </div>

      <div class="charts-row" style="margin-top: 2rem;">
        <div class="chart-card">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Annual Energy Intensity Simulation</h3>
          <p style="font-size: 0.9375rem; color: var(--color-charcoal-muted); line-height: 1.7; margin-bottom: 1.5rem;">
            Through computational daylight analysis and geothermal earth loop integration, STACKLY residential commissions consume 68% less peak grid energy than standard architectural baselines.
          </p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.25rem;">
                <span>Geothermal Heating & Radiant Slabs</span>
                <strong>42 kWh/m²</strong>
              </div>
              <div style="width: 100%; height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="width: 42%; height: 100%; background: var(--gradient-red-primary);"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.25rem;">
                <span>Passive Solar Shading & Envelope</span>
                <strong>18 kWh/m²</strong>
              </div>
              <div style="width: 100%; height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="width: 18%; height: 100%; background: var(--gradient-red-dark);"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.25rem;">
                <span>Automated DALI LED Integration</span>
                <strong>12 kWh/m²</strong>
              </div>
              <div style="width: 100%; height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="width: 12%; height: 100%; background: #141416;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Wind Load & Seismic Calculations</h3>
          <p style="font-size: 0.9375rem; color: var(--color-charcoal-muted); line-height: 1.7; margin-bottom: 1.5rem;">
            Full aerodynamic CFD testing completed for coastal cliffs (Villa Aurelia) and high-altitude desert topography (Terra Retreat).
          </p>
          <div style="background: var(--color-off-white); padding: 1.5rem; border-radius: var(--radius-xs); border-left: 3px solid var(--color-red-primary);">
            <div style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-near-black);">
              PEAK GUST RESISTANCE: 165 MPH (Category 5 Resilient)<br>
              FOUNDATION ANCHORAGE: 18M DEEP ROCK SOCKET PIN PILES<br>
              CERTIFIED STRUCTURAL PE: JULIAN CHEN, AIA
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * MODULE 5: REPORTS & HANDOVERS
 */
function getReportsHTML() {
  return `
    <div class="module-view module-reports">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="eyebrow">Document Vault</span>
          <h2 style="font-size: 2rem;">Studio Handover Reports & Dossiers</h2>
        </div>
        <button class="btn btn-primary btn-sm" id="generate-full-dossier-btn">
          <span>Generate Full Atelier Dossier</span>
          <span class="btn-icon">→</span>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Card 1: Villa Aurelia -->
        <div class="metric-card report-dossier-card">
          <div class="report-content-group">
            <div class="report-thumbnail-wrapper">
              <img 
                src="assets/images/villa-aurelia.webp" 
                alt="Villa Aurelia Architectural Closeout" 
                class="report-thumbnail-img" 
              />
              <span class="report-thumbnail-tag">PDF • 48 MB</span>
            </div>
            <div class="report-info">
              <div><span class="badge badge-red-solid" style="margin-bottom: 0.4rem;">Official Handover</span></div>
              <h3 class="report-title">Villa Aurelia — Final Closeout Dossier & As-Built Drawings</h3>
              <p class="report-desc">Approved by Amalfi Municipal Building Bureau • 48 MB PDF</p>
              <div class="report-meta-specs">
                <span>Ref: #AMF-2025-HO</span>
                <span>•</span>
                <span>Structural PE: Julian Chen, AIA</span>
              </div>
            </div>
          </div>
          <div class="report-action-wrap">
            <button class="btn btn-secondary btn-sm report-download-btn" data-doc="Villa Aurelia Final As-Built">
              <span>Download Dossier</span>
              <span class="btn-icon">↓</span>
            </button>
          </div>
        </div>

        <!-- Card 2: Salem Residence -->
        <div class="metric-card report-dossier-card">
          <div class="report-content-group">
            <div class="report-thumbnail-wrapper">
              <img 
                src="assets/images/horizon-office.webp" 
                alt="Salem Residence Heritage Clearance" 
                class="report-thumbnail-img" 
              />
              <span class="report-thumbnail-tag">PDF • 14 MB</span>
            </div>
            <div class="report-info">
              <div><span class="badge badge-dark" style="margin-bottom: 0.4rem;">Zoning Permit</span></div>
              <h3 class="report-title">Salem Residence — Historical Architectural Commission Clearance</h3>
              <p class="report-desc">City of Salem Massachusetts Preservation Board • 14 MB PDF</p>
              <div class="report-meta-specs">
                <span>Ref: #SLM-HIST-412</span>
                <span>•</span>
                <span>Zoning Code: Historic District 3</span>
              </div>
            </div>
          </div>
          <div class="report-action-wrap">
            <button class="btn btn-secondary btn-sm report-download-btn" data-doc="Salem Residence Historic Clearance">
              <span>Download Dossier</span>
              <span class="btn-icon">↓</span>
            </button>
          </div>
        </div>

        <!-- Card 3: Horizon Office -->
        <div class="metric-card report-dossier-card">
          <div class="report-content-group">
            <div class="report-thumbnail-wrapper">
              <img 
                src="assets/images/vance-horizon.webp" 
                alt="Horizon Office Geothermal Engineering" 
                class="report-thumbnail-img" 
              />
              <span class="report-thumbnail-tag">PDF • 22 MB</span>
            </div>
            <div class="report-info">
              <div><span class="badge badge-outline" style="margin-bottom: 0.4rem;">Engineering Audit</span></div>
              <h3 class="report-title">Horizon Office — Geothermal Sub-Slab Thermodynamic Analysis</h3>
              <p class="report-desc">Nordic Energy Commission & Reykjavik Municipal Code • 22 MB PDF</p>
              <div class="report-meta-specs">
                <span>Ref: #RVK-GEO-880</span>
                <span>•</span>
                <span>Net-Zero Model: 98.4% Efficiency</span>
              </div>
            </div>
          </div>
          <div class="report-action-wrap">
            <button class="btn btn-secondary btn-sm report-download-btn" data-doc="Horizon Office Geothermal Audit">
              <span>Download Dossier</span>
              <span class="btn-icon">↓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initReportsEvents() {
  const downloadBtns = document.querySelectorAll('.report-download-btn');
  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  const generateBtn = document.getElementById('generate-full-dossier-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }
}
