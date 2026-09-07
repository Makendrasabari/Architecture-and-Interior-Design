/**
 * STACKLY Architecture & Interior Design Studio
 * Interior Design Studio Command Center (Pure Vanilla JS - Canvas 2D)
 */

document.addEventListener('DOMContentLoaded', () => {
  initInteriorDashboard();
});

let activeIntModule = 'overview';
let activeMaterialFilter = 'All';

function initInteriorDashboard() {
  // Restore active tab from store if saved
  if (window.STACKLY_STORE) {
    activeIntModule = window.STACKLY_STORE.getIntTab() || 'overview';
  }

  updateIntHeaderTitle(activeIntModule);
  setupUserProfileAndHeader();
  setupSidebarNav();
  setupBrandLogoHandler();
  renderIntModule(activeIntModule);
}

function setupBrandLogoHandler() {
  const brandLogos = document.querySelectorAll('.brand-logo, .dashboard-brand a, .navbar-brand');
  brandLogos.forEach((logo) => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      activeIntModule = 'overview';
      if (window.STACKLY_STORE) {
        window.STACKLY_STORE.setIntTab('overview');
      }
      updateIntHeaderTitle('overview');
      renderIntModule('overview');

      if (typeof window.STACKLY_RESET_SCROLL === 'function') {
        window.STACKLY_RESET_SCROLL();
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }

      const sidebar = document.getElementById('int-sidebar');
      const backdrop = document.querySelector('.dashboard-sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    });
  });
}

const INT_MODULE_TITLES = {
  'overview': 'Overview',
  'interior-projects': 'Projects',
  'moodboards': 'Moodboards',
  'materials': 'Materials',
  'design-reports': 'Reports'
};

function updateIntHeaderTitle(tabName) {
  const headingEl = document.getElementById('dashboard-active-heading');
  if (headingEl) {
    headingEl.innerText = INT_MODULE_TITLES[tabName] || 'Overview';
  }
}

function setupUserProfileAndHeader() {
  const user = window.STACKLY_STORE ? window.STACKLY_STORE.getUser() : null;
  const name = (user && user.name) ? user.name : 'Elena Rostova';
  const email = (user && user.email) ? user.email : 'elena.rostova@gmail.com';
  const role = (user && user.role) ? user.role : 'Interior Design Studio';
  const initial = name.trim().charAt(0).toUpperCase() || 'E';

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
  const navBtns = document.querySelectorAll('#int-nav-modules .dashboard-nav-btn');
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeIntModule = btn.getAttribute('data-int-tab');
      if (window.STACKLY_STORE) {
        window.STACKLY_STORE.setIntTab(activeIntModule);
      }
      updateIntHeaderTitle(activeIntModule);
      renderIntModule(activeIntModule);
    });
  });
}

function renderIntModule(moduleName) {
  const container = document.getElementById('int-module-container');
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
  document.querySelectorAll('#int-nav-modules .dashboard-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-int-tab') === moduleName);
  });

  switch (moduleName) {
    case 'overview':
      container.innerHTML = getOverviewHTML();
      initDonutChart();
      break;
    case 'interior-projects':
      container.innerHTML = getInteriorProjectsHTML();
      break;
    case 'moodboards':
      container.innerHTML = getMoodboardsHTML();
      initMoodboardEvents();
      break;
    case 'materials':
      container.innerHTML = getMaterialsHTML();
      initMaterialFilters();
      break;
    case 'design-reports':
      container.innerHTML = getDesignReportsHTML();
      initReportEvents();
      break;
    default:
      container.innerHTML = getOverviewHTML();
      initDonutChart();
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
  const intProjects = window.STACKLY_DATA ? window.STACKLY_DATA.interiorProjectsList : [];

  return `
    <div class="module-view module-overview">
      <div style="margin-bottom: 2rem;">
        <span class="eyebrow">Tactile Curation Summary</span>
        <h2 style="font-size: 2rem;">Interior Design Atelier Operations</h2>
      </div>

      <!-- 4 Overview Metric Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Active FF&E Suites</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"></path><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"></path><line x1="6" y1="18" x2="6" y2="21"></line><line x1="18" y1="18" x2="18" y2="21"></line></svg></div>
          </div>
          <div class="metric-value">04</div>
          <div class="metric-change">3 Bespoke Commissions In Fabrication</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Curated Materials</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>
          </div>
          <div class="metric-value">12</div>
          <div class="metric-change">Rare Stones, Woods & Custom Textiles</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Procurement Spend</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
          </div>
          <div class="metric-value">$4.85M</div>
          <div class="metric-change">Within 2.4% Projected Variance</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Client Sign-Off Rate</span>
            <div class="metric-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
          </div>
          <div class="metric-value">98%</div>
          <div class="metric-change">First-Pass Material Approval</div>
        </div>
      </div>

      <!-- Charts & Material Breakdown -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <span class="eyebrow" style="margin-bottom: 0.25rem;">Spatial Materiality</span>
              <h3 style="font-size: 1.25rem;">FF&E Material Composition</h3>
            </div>
            <span class="badge badge-red">Portfolio Weight</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-evenly; flex-wrap: wrap; gap: 1.5rem; padding: 1rem 0; min-height: 240px;">
            <div style="flex-shrink: 0; display: flex; justify-content: center; align-items: center;">
              <canvas id="int-donut-canvas" width="220" height="220"></canvas>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-mono); font-size: 0.8125rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="width: 12px; height: 12px; background: #d92638; border-radius: 2px; flex-shrink: 0;"></span>
                <span>Natural Wood (35%)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="width: 12px; height: 12px; background: #8b0e1e; border-radius: 2px; flex-shrink: 0;"></span>
                <span>Monolithic Stone (30%)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="width: 12px; height: 12px; background: #27272a; border-radius: 2px; flex-shrink: 0;"></span>
                <span>Patinated Metal (15%)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="width: 12px; height: 12px; background: #64646b; border-radius: 2px; flex-shrink: 0;"></span>
                <span>Architectural Glass (10%)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="width: 12px; height: 12px; background: #c5c5cb; border-radius: 2px; flex-shrink: 0;"></span>
                <span>Luxury Textiles (10%)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span class="eyebrow" style="margin-bottom: 0.25rem;">Director's Curation</span>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">Atelier Material Ethics</h3>
            <p style="font-size: 0.9375rem; color: var(--color-charcoal-muted); line-height: 1.7;">
              "Every surface must tell a geological story. We do not use faux veneers or imitation stones. Only genuine Roman travertine, fumed European oak, and hand-patinated German bronze enter STACKLY spaces."
            </p>
          </div>
          <div style="background: var(--color-off-white); padding: 1.25rem; border-radius: var(--radius-xs); border-left: 3px solid var(--color-red-primary);">
            <strong style="font-size: 0.875rem;">Lead Interior Principal:</strong>
            <span style="display: block; font-size: 0.875rem; color: var(--color-charcoal-muted);">Elena Rostova, ASID • Milan Master of Arts</span>
          </div>
        </div>
      </div>

      <!-- Active Interior Commissions List -->
      <div class="dashboard-table-card" style="margin-top: 2rem;">
        <div style="margin-bottom: 1.5rem;">
          <span class="eyebrow" style="margin-bottom: 0.25rem;">Live Interior Projects</span>
          <h3 style="font-size: 1.35rem;">Active Commission Spaces</h3>
        </div>

        <div class="table-responsive">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Interior Suite</th>
                <th>Client / Commission</th>
                <th>Location</th>
                <th>Primary Materials</th>
                <th>Progress</th>
                <th style="text-align: right;">Budget</th>
              </tr>
            </thead>
            <tbody>
              ${intProjects.map(p => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <img src="${p.image}" alt="${p.roomType}" onerror="this.style.display='none'" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0;" />
                      <strong style="font-weight: 700; color: var(--color-near-black);">${p.roomType}</strong>
                    </div>
                  </td>
                  <td>${p.client}</td>
                  <td style="color: var(--color-charcoal-muted);">${p.location}</td>
                  <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-charcoal-muted);">${p.materials}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                      <div style="width: 70px; height: 6px; background: rgba(20,20,22,0.1); border-radius: 3px; overflow: hidden; flex-shrink: 0;">
                        <div style="width: ${p.progress}%; height: 100%; background: var(--gradient-red-primary);"></div>
                      </div>
                      <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; min-width: 32px;">${p.progress}%</span>
                    </div>
                  </td>
                  <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-red-primary); text-align: right;">${p.budget}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function initDonutChart() {
  const canvas = document.getElementById('int-donut-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 220;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  ctx.scale(dpr, dpr);

  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = 90;
  const innerRadius = 55;

  const segments = [
    { label: 'Wood', pct: 0.35, color: '#d92638' },
    { label: 'Stone', pct: 0.30, color: '#8b0e1e' },
    { label: 'Metal', pct: 0.15, color: '#27272a' },
    { label: 'Glass', pct: 0.10, color: '#64646b' },
    { label: 'Textiles', pct: 0.10, color: '#c5c5cb' }
  ];

  ctx.clearRect(0, 0, size, size);

  let startAngle = -Math.PI / 2;
  segments.forEach(seg => {
    const sliceAngle = seg.pct * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    ctx.fillStyle = seg.color;
    ctx.fill();

    startAngle = endAngle;
  });

  // Center text
  ctx.fillStyle = '#141416';
  ctx.font = '800 18px "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FF&E', centerX, centerY - 8);

  ctx.fillStyle = '#64646b';
  ctx.font = '600 10px "Space Grotesk", monospace';
  ctx.fillText('100% SPEC', centerX, centerY + 12);
}

/**
 * MODULE 2: INTERIOR PROJECTS
 */
function getInteriorProjectsHTML() {
  const intProjects = window.STACKLY_DATA.interiorProjectsList;

  return `
    <div class="module-view module-interior-projects">
      <div style="margin-bottom: 2rem;">
        <span class="eyebrow">Commissions &amp; Environments</span>
        <h2 style="font-size: 2rem;">Active Interior Architectural Suites</h2>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${intProjects.map(p => {
          const chips = p.materials.split(',').map(m => `<span class="interior-material-chip">${m.trim()}</span>`).join(' ');
          return `
          <div class="project-card horizontal interior-project-card">
            <div class="project-image-wrapper">
              <img
                src="${p.image}"
                alt="${p.roomType}"
                class="project-image"
                onerror="this.style.display='none'"
              />
              <div class="project-overlay"></div>
              <div class="project-meta-floating">
                <span class="badge badge-dark" style="font-size:0.65rem;">${p.client}</span>
                <span class="badge badge-red" style="font-size:0.65rem;">${p.status}</span>
              </div>
            </div>

            <div class="project-body">
              <div>
                <span class="eyebrow" style="margin-bottom:0.3rem;">${p.location}</span>
                <h3 class="project-name" style="font-size:1.35rem;font-weight:700;color:var(--color-near-black);margin-bottom:0.75rem;line-height:1.25;">${p.roomType}</h3>

                <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:1rem;">
                  ${chips}
                </div>
              </div>

              <div>
                <div style="margin-bottom:0.85rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
                    <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--color-charcoal-muted);text-transform:uppercase;letter-spacing:0.06em;">Completion Progress</span>
                    <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--color-near-black);">${p.progress}%</span>
                  </div>
                  <div style="height:5px;background:rgba(20,20,22,0.08);border-radius:4px;overflow:hidden;">
                    <div style="width:${p.progress}%;height:100%;background:var(--gradient-red-primary);border-radius:4px;transition:width 0.8s ease;"></div>
                  </div>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(20,20,22,0.06);padding-top:0.85rem;">
                  <div>
                    <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--color-charcoal-muted);display:block;text-transform:uppercase;letter-spacing:0.06em;">Total Budget</span>
                    <strong style="font-family:var(--font-mono);font-size:1.1rem;color:var(--color-red-primary);">${p.budget}</strong>
                  </div>
                  <div style="text-align:right;">
                    <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--color-charcoal-muted);display:block;text-transform:uppercase;letter-spacing:0.06em;">Phase</span>
                    <span style="font-size:0.8125rem;font-weight:600;color:var(--color-near-black);">${p.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `}).join('')}
      </div>
    </div>
  `;
}

/**
 * MODULE 3: MOODBOARDS
 */
function getMoodboardsHTML() {
  const moodboards = window.STACKLY_DATA.moodboardItems;

  return `
    <div class="module-view module-moodboards">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="eyebrow">Sensory Inspiration</span>
          <h2 style="font-size: 2rem;">Curated Studio Moodboards & Palettes</h2>
        </div>
        <button class="btn btn-primary btn-sm" id="new-moodboard-btn">
          <span>+ Create New Concept Board</span>
        </button>
      </div>

      <div class="moodboards-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${moodboards.map((m, idx) => `
          <article class="moodboard-item-card" data-moodboard-index="${idx}">
            <div class="project-image-wrapper">
              <img src="${m.image}" alt="${m.title}" class="project-image" />
              <div class="project-overlay"></div>
            </div>
            <div class="project-body">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; gap: 0.5rem; flex-wrap: wrap;">
                  <span class="eyebrow">Concept Board #${idx + 1}</span>
                  <span class="badge badge-red-solid">${m.category}</span>
                </div>
                <h3 class="project-name" style="font-size: 1.25rem; font-weight: 700; color: var(--color-near-black); margin-bottom: 0.4rem; line-height: 1.3;">${m.title}</h3>
                <p class="project-description" style="font-size: 0.875rem; color: var(--color-charcoal-muted); line-height: 1.55; margin-bottom: 0.75rem;">${m.details}</p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(20,20,22,0.06); padding-top: 0.85rem; margin-top: 0.5rem; flex-wrap: wrap; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--color-red-primary); text-transform: uppercase; letter-spacing: 0.06em;">Sensory Palette:</span>
                  <span style="display: inline-flex; gap: 4px; align-items: center;">
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #D92638; display: inline-block;" title="Primary Red"></span>
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #8B0E1E; display: inline-block;" title="Deep Wine"></span>
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #141416; display: inline-block;" title="Charcoal"></span>
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #F1F1F4; border: 1px solid #ccc; display: inline-block;" title="Chalk"></span>
                  </span>
                </div>
                <span class="badge badge-outline moodboard-inspect-btn" style="cursor: pointer;">Inspect Textures & Palette →</span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function initMoodboardEvents() {
  const cards = document.querySelectorAll('.moodboard-item-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.moodboard-inspect-btn') || e.target.closest('.badge-outline')) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '404.html';
        return;
      }
      cards.forEach(c => c.style.borderColor = 'rgba(20,20,22,0.08)');
      card.style.borderColor = 'var(--color-red-primary)';
    });
  });

  const newBtn = document.getElementById('new-moodboard-btn');
  if (newBtn) {
    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }
}

/**
 * MODULE 4: MATERIAL LIBRARY
 */
function getMaterialsHTML() {
  const materials = window.STACKLY_DATA.materialsData;
  const categories = ['All', 'Wood', 'Stone', 'Metal', 'Glass', 'Fabric'];

  const filtered = activeMaterialFilter === 'All' 
    ? materials 
    : materials.filter(m => m.category === activeMaterialFilter);

  return `
    <div class="module-view module-materials">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem;">
        <div>
          <span class="eyebrow">Tactile Library</span>
          <h2 style="font-size: 2rem;">Physical Architectural Materials</h2>
        </div>
        <div class="blog-categories" id="mat-filter-bar">
          ${categories.map(cat => `
            <button class="blog-filter-btn ${activeMaterialFilter === cat ? 'active' : ''}" data-mat-cat="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="dashboard-3col-grid" id="materials-display-grid">
        ${filtered.map(m => `
          <div class="metric-card" style="display: flex; flex-direction: column; overflow: hidden; padding: 0;">
            <div style="height: 180px; width: 100%; overflow: hidden; position: relative;">
              <img src="${m.image}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; top: 1rem; left: 1rem;">
                <span class="badge badge-red-solid">${m.category}</span>
              </div>
            </div>
            <div style="padding: 1.75rem; display: flex; flex-direction: column; flex-grow: 1;">
              <h3 style="font-size: 1.3rem; margin-bottom: 0.35rem;">${m.name}</h3>
              <p style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-red-primary); margin-bottom: 1rem;">${m.origin}</p>
              
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.8125rem; color: var(--color-charcoal-muted); margin-bottom: 1.5rem; border-top: 1px solid rgba(20,20,22,0.06); padding-top: 1rem;">
                <div><strong style="color: var(--color-near-black);">Finish:</strong> ${m.finish}</div>
                <div><strong style="color: var(--color-near-black);">Durability:</strong> ${m.durability}</div>
                <div><strong style="color: var(--color-near-black);">Specs:</strong> ${m.specs}</div>
              </div>

              <div style="margin-top: auto; border-top: 1px solid rgba(20,20,22,0.06); padding-top: 1rem;">
                <span style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--color-charcoal-muted); display: block;">Typical Applications</span>
                <span style="font-size: 0.875rem; color: var(--color-near-black);">${m.applications}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function initMaterialFilters() {
  const btns = document.querySelectorAll('#mat-filter-bar .blog-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMaterialFilter = btn.getAttribute('data-mat-cat') || 'All';
      renderIntModule('materials');
    });
  });
}

/**
 * MODULE 5: DESIGN REPORTS
 */
function getDesignReportsHTML() {
  return `
    <div class="module-view module-design-reports">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="eyebrow">FF&E Schedules</span>
          <h2 style="font-size: 2rem;">Interior Specifications & Procurement Logs</h2>
        </div>
        <button class="btn btn-primary btn-sm" id="export-all-ffe-btn">
          <span>Export Master FF&E Schedule (.XLSX)</span>
          <span class="btn-icon">↓</span>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Card 1: Penthouse Living -->
        <div class="metric-card report-dossier-card">
          <div class="report-content-group">
            <div class="report-thumbnail-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" 
                alt="Penthouse Living & Hearth Suite" 
                class="report-thumbnail-img" 
              />
              <span class="report-thumbnail-tag">PDF • 18 MB</span>
            </div>
            <div class="report-info">
              <div><span class="badge badge-red-solid" style="margin-bottom: 0.4rem;">Procurement Schedule</span></div>
              <h3 class="report-title">Penthouse Living & Hearth Suite — Complete Millwork Specs</h3>
              <p class="report-desc">American Walnut Joinery, Bookmatched Travertine, Custom Firebox Hearth • 18 MB PDF</p>
              <div class="report-meta-specs">
                <span>Ref: #FFE-PNT-01</span>
                <span>•</span>
                <span>Joinery Lead: Elena Rostova</span>
              </div>
            </div>
          </div>
          <div class="report-action-wrap">
            <button class="btn btn-secondary btn-sm ffe-dl-btn" data-ffe="Penthouse Living Millwork">
              <span>Download Schedule</span>
              <span class="btn-icon">↓</span>
            </button>
          </div>
        </div>

        <!-- Card 2: Culinary Suite Lighting -->
        <div class="metric-card report-dossier-card">
          <div class="report-content-group">
            <div class="report-thumbnail-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80" 
                alt="Culinary Suite Architectural Lighting" 
                class="report-thumbnail-img" 
              />
              <span class="report-thumbnail-tag">PDF • 12 MB</span>
            </div>
            <div class="report-info">
              <div><span class="badge badge-dark" style="margin-bottom: 0.4rem;">Lighting Matrix</span></div>
              <h3 class="report-title">Culinary Suite — Task, Ambient & Cove Architectural Lighting</h3>
              <p class="report-desc">DALI 2700K Warm Dim Specifications, Flos Magnetics & Fixture Schedules • 12 MB PDF</p>
              <div class="report-meta-specs">
                <span>Ref: #LGT-CUL-04</span>
                <span>•</span>
                <span>DALI Protocol: 4 Channels</span>
              </div>
            </div>
          </div>
          <div class="report-action-wrap">
            <button class="btn btn-secondary btn-sm ffe-dl-btn" data-ffe="Culinary Lighting Schedule">
              <span>Download Schedule</span>
              <span class="btn-icon">↓</span>
            </button>
          </div>
        </div>

        <!-- Card 3: Global Luxury Fabrics -->
        <div class="metric-card report-dossier-card">
          <div class="report-content-group">
            <div class="report-thumbnail-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Luxury Fabrics & Drapery" 
                class="report-thumbnail-img" 
              />
              <span class="report-thumbnail-tag">PDF • 8 MB</span>
            </div>
            <div class="report-info">
              <div><span class="badge badge-outline" style="margin-bottom: 0.4rem;">Textile Audit</span></div>
              <h3 class="report-title">Global Luxury Fabrics & Drapery Martindale Test Certificates</h3>
              <p class="report-desc">Belgian Linen, Italian Alpaca Bouclé & Flame Retardant Certifications • 8 MB PDF</p>
              <div class="report-meta-specs">
                <span>Ref: #MAT-TXT-77</span>
                <span>•</span>
                <span>Martindale: 60,000 Rubs</span>
              </div>
            </div>
          </div>
          <div class="report-action-wrap">
            <button class="btn btn-secondary btn-sm ffe-dl-btn" data-ffe="Textile Certification Dossier">
              <span>Download Schedule</span>
              <span class="btn-icon">↓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initReportEvents() {
  const dlBtns = document.querySelectorAll('.ffe-dl-btn');
  dlBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  const exportAllBtn = document.getElementById('export-all-ffe-btn');
  if (exportAllBtn) {
    exportAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }
}
