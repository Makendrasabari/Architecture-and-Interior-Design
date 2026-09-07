/**
 * STACKLY Architecture & Interior Design Studio
 * Design Monograph & Blog Module (Pure Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlogFilters();
  initArticleReader();
  initBlogNewsletter();
});

let currentCategory = 'All';
let searchQuery = '';

function initBlogFilters() {
  const catButtons = document.querySelectorAll('#blog-cat-filters .blog-filter-btn');
  const searchInput = document.getElementById('blog-search-input');

  catButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat') || 'All';
      renderFilteredPosts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderFilteredPosts();
    });
  }
}

function renderFilteredPosts() {
  const grid = document.getElementById('blog-articles-grid');
  const featured = document.getElementById('featured-article');
  if (!grid || !window.STACKLY_DATA || !window.STACKLY_DATA.blogPosts) return;

  const allPosts = window.STACKLY_DATA.blogPosts;

  // Control featured article visibility (only show when All and no search query)
  if (featured) {
    featured.style.display = (currentCategory === 'All' && searchQuery === '') ? 'grid' : 'none';
  }

  const filtered = allPosts.filter((post) => {
    const matchesCat = currentCategory === 'All' || post.category === currentCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.category.toLowerCase().includes(searchQuery) ||
      post.author.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 2rem; background: var(--color-pure-white); border-radius: var(--radius-sm); border: 1px dashed rgba(20,20,22,0.15);">
        <p style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--color-charcoal-muted); margin-bottom: 1.25rem;">
          No architectural monographs match your current filter or query.
        </p>
        <button class="btn btn-secondary btn-sm" id="reset-blog-filter-btn">
          <span>Reset All Filters</span>
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('reset-blog-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'All';
        searchQuery = '';
        const searchInput = document.getElementById('blog-search-input');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('#blog-cat-filters .blog-filter-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-cat') === 'All');
        });
        renderFilteredPosts();
      });
    }
    return;
  }

  grid.innerHTML = filtered.map((post) => `
    <article class="blog-card" data-article-id="${post.id}">
      <img src="${post.image}" alt="${post.title}" class="blog-card-img" loading="lazy" />
      <div class="blog-card-body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
          <span class="badge badge-red">${post.category}</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-charcoal-muted);">${post.readTime}</span>
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 0.85rem; line-height: 1.35;">${post.title}</h3>
        <p style="font-size: 0.9rem; color: var(--color-charcoal-muted); margin-bottom: 1.5rem; line-height: 1.65;">${post.excerpt}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid rgba(20,20,22,0.06); padding-top: 1rem;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-charcoal-muted);">${post.author}</span>
          <span style="font-family: var(--font-sans); font-size: 0.8125rem; font-weight: 700; color: var(--color-red-primary); display: inline-flex; align-items: center; gap: 0.35rem;">
            <span>Read</span>
          </span>
        </div>
      </div>
    </article>
  `).join('');

  if (window.STACKLY_MOTION && typeof window.STACKLY_MOTION.animateThreeCardGrids === 'function') {
    window.STACKLY_MOTION.animateThreeCardGrids(grid);
  }
}

function initArticleReader() {
  document.addEventListener('click', (e) => {
    // If the click is on "Read Full Essay" or any navigation button/link, do NOT open modal
    const btn = e.target.closest('a, button, .btn');
    const text = (e.target.textContent || '').toLowerCase().trim();
    const btnText = btn ? (btn.textContent || '').toLowerCase().trim() : '';

    if (
      text.includes('read full essay') ||
      btnText.includes('read full essay') ||
      (btn && btn.getAttribute('href') === '404.html')
    ) {
      return;
    }

    const card = e.target.closest('.blog-card, .featured-article-card, [data-article-id]');
    if (!card) return;

    const articleId = card.getAttribute('data-article-id');
    if (!articleId || !window.STACKLY_DATA || !window.STACKLY_DATA.blogPosts) return;

    const post = window.STACKLY_DATA.blogPosts.find((p) => p.id === articleId);
    if (!post) return;

    openArticleModal(post);
  });
}

function openArticleModal(post) {
  let modal = document.getElementById('article-reader-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'article-reader-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-card" id="article-modal-content"></div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  const modalContent = document.getElementById('article-modal-content');
  const formattedContent = post.content
    .split('\n\n')
    .map(para => {
      if (para.startsWith('### ')) {
        return `<h3 style="font-size: 1.4rem; margin: 1.75rem 0 0.75rem; color: var(--color-near-black);">${para.replace('### ', '')}</h3>`;
      }
      return `<p style="font-size: 1.0625rem; line-height: 1.85; color: var(--color-charcoal-deep); margin-bottom: 1.25rem;">${para}</p>`;
    })
    .join('');

  modalContent.innerHTML = `
    <button class="modal-close" id="close-article-modal" aria-label="Close modal">×</button>
    
    <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1.25rem;">
      <span class="badge badge-red-solid">${post.category}</span>
      <span style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-charcoal-muted);">${post.date} • ${post.readTime}</span>
    </div>

    <h1 style="font-size: clamp(2rem, 3.5vw, 2.75rem); line-height: 1.2; margin-bottom: 1.5rem;">${post.title}</h1>

    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(20,20,22,0.1); padding-bottom: 1.5rem;">
      <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-red-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-family: var(--font-editorial);">
        ${post.author.charAt(0)}
      </div>
      <div>
        <strong style="display: block; font-size: 0.9375rem;">${post.author}</strong>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-charcoal-muted);">STACKLY Architectural Monograph</span>
      </div>
    </div>

    <div style="margin-bottom: 2.5rem; border-radius: var(--radius-sm); overflow: hidden; max-height: 440px;">
      <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>

    <div class="article-essay-body">
      ${formattedContent}
    </div>

    <div style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid rgba(20,20,22,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <a href="contact.html" class="btn btn-primary">
        <span>Commission Architectural Study</span>
        <span class="btn-icon">→</span>
      </a>
      <button class="btn btn-secondary" id="reader-close-action">
        <span>Close Monograph</span>
      </button>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const closeBtn = document.getElementById('close-article-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const closeAction = document.getElementById('reader-close-action');
  if (closeAction) closeAction.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 3. STACKLY Monograph Research Newsletter Subscription
 * Validates email input:
 * - Empty/invalid: shows red horizontal line and 'Please enter email'
 * - Valid: navigates directly to 404.html
 */
function initBlogNewsletter() {
  const form = document.getElementById('blog-subscribe-form');
  if (!form || form.dataset.listenerBound) return;
  form.dataset.listenerBound = 'true';

  const emailInput = document.getElementById('blog-subscribe-email');
  const errorWrapper = document.getElementById('sub-error-wrapper');
  const errorMsg = document.getElementById('sub-error');
  const successMsg = document.getElementById('sub-success');

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (errorWrapper) errorWrapper.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';
      emailInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailVal || !emailRegex.test(emailVal)) {
      if (errorWrapper) errorWrapper.style.display = 'block';
      if (errorMsg) errorMsg.style.display = 'block';
      if (successMsg) successMsg.style.display = 'none';
      if (emailInput) {
        emailInput.style.borderColor = '#ef4444';
        emailInput.focus();
      }
      return;
    }

    if (errorWrapper) errorWrapper.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
    if (emailInput) emailInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';

    window.location.href = '404.html';
  });
}
