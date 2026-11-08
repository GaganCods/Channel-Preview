/**
 * Channel Preview — Creator Store Logic
 * Handles real-time search, category filtering, tabs (All Products / Saved Products),
 * bookmarking with localStorage persistence, sorting, and dynamic card generation.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'channelpreview_saved_products';

  // State
  let currentCategory = 'all';
  let activeTab = 'all'; // 'all' or 'saved'
  let searchQuery = '';
  let currentSort = 'featured';
  let savedProductIds = loadSavedProducts();

  // Load saved products from localStorage
  function loadSavedProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Could not read localStorage:', e);
      return [];
    }
  }

  // Persist saved products to localStorage
  function persistSavedProducts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProductIds));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
  }

  // Toggle saved state
  function toggleSaveProduct(productId) {
    const idx = savedProductIds.indexOf(productId);
    if (idx > -1) {
      savedProductIds.splice(idx, 1);
    } else {
      savedProductIds.push(productId);
    }
    persistSavedProducts();
    updateTabCounts();
    updateBookmarkButtons();

    // If currently viewing the saved tab, re-render
    if (activeTab === 'saved') {
      filterAndRenderProducts();
    }
  }

  // SVG Icons for Category Buttons
  const CATEGORY_BUTTON_ICONS = {
    'all': `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    'creator-essentials': `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="12" rx="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>`,
    'cameras-photography': `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
    'audio-microphones': `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
    'lighting-equipment': `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    'desk-setup': `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
    'accessories': `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
  };

  // HTML Escape Helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Mini SVGs for Feature Chips inside Cards
  function renderChipIcon(iconType) {
    switch (iconType) {
      case 'wave':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2l3-7 4 14 3-10 2 5 2-2h4"></path></svg>`;
      case 'shield':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
      case 'plug':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="12"></line><circle cx="12" cy="16" r="4"></circle></svg>`;
      case 'target':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`;
      case 'mute':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      case 'bolt':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
      case 'headphones':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`;
      case 'diamond':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"></path></svg>`;
      case 'video':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`;
      case 'screen':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
      case 'eye':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      case 'sun':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>`;
      case 'wifi':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
      case 'grid':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`;
      case 'monitor':
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
      case 'check':
      default:
        return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }
  }

  // Parse chip data with creator icon inference
  function getChipData(chip) {
    if (typeof chip === 'string') {
      const lower = chip.toLowerCase();
      let icon = 'check';
      if (lower.includes('dpi') || lower.includes('sensor') || lower.includes('lens')) icon = 'target';
      else if (lower.includes('quiet') || lower.includes('click') || lower.includes('mute')) icon = 'mute';
      else if (lower.includes('scroll') || lower.includes('wheel') || lower.includes('rotat')) icon = 'bolt';
      else if (lower.includes('key') || lower.includes('macro') || lower.includes('shortcut')) icon = 'grid';
      else if (lower.includes('usb') || lower.includes('port') || lower.includes('cable') || lower.includes('hub')) icon = 'plug';
      else if (lower.includes('rugged') || lower.includes('ip65') || lower.includes('shield') || lower.includes('waterproof')) icon = 'shield';
      else if (lower.includes('4k') || lower.includes('5.3k') || lower.includes('6k') || lower.includes('video') || lower.includes('hdr') || lower.includes('fps')) icon = 'video';
      else if (lower.includes('screen') || lower.includes('oled') || lower.includes('monitor') || lower.includes('ips') || lower.includes('display')) icon = 'screen';
      else if (lower.includes('mic') || lower.includes('audio') || lower.includes('vocal') || lower.includes('float') || lower.includes('gain')) icon = 'wave';
      else if (lower.includes('headphone') || lower.includes('driver') || lower.includes('isolation')) icon = 'headphones';
      else if (lower.includes('lumen') || lower.includes('light') || lower.includes('temp') || lower.includes('rgb') || lower.includes('daylight')) icon = 'sun';
      else if (lower.includes('wireless') || lower.includes('wi-fi') || lower.includes('bluetooth') || lower.includes('range')) icon = 'wifi';
      else if (lower.includes('mount') || lower.includes('arm') || lower.includes('tripod') || lower.includes('cage') || lower.includes('pan')) icon = 'diamond';
      return { label: chip, icon };
    }
    return {
      label: chip.label || '',
      icon: chip.icon || 'check'
    };
  }

  // Fallback category icons for image loading errors
  const FALLBACK_CATEGORY_ICONS = {
    'creator-essentials': CATEGORY_BUTTON_ICONS['creator-essentials'],
    'cameras-photography': CATEGORY_BUTTON_ICONS['cameras-photography'],
    'audio-microphones': CATEGORY_BUTTON_ICONS['audio-microphones'],
    'lighting-equipment': CATEGORY_BUTTON_ICONS['lighting-equipment'],
    'desk-setup': CATEGORY_BUTTON_ICONS['desk-setup'],
    'accessories': CATEGORY_BUTTON_ICONS['accessories']
  };

  // DOM Elements
  const searchInput = document.getElementById('store-search');
  const searchClear = document.getElementById('store-search-clear');
  const categoryNav = document.getElementById('store-category-row');
  const productGrid = document.getElementById('store-product-grid');
  const tabAllBtn = document.getElementById('tab-all-products');
  const tabSavedBtn = document.getElementById('tab-saved-products');
  const tabAllCount = document.getElementById('tab-all-count');
  const tabSavedCount = document.getElementById('tab-saved-count');
  const sortSelect = document.getElementById('store-sort-select');

  // Render Product Card HTML
  function renderProductCard(product) {
    const isSaved = savedProductIds.includes(product.id);
    const fallbackIcon = FALLBACK_CATEGORY_ICONS[product.categorySlug] || CATEGORY_BUTTON_ICONS['accessories'];

    const badgeHtml = product.badge
      ? `<span class="product-badge-highlight">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>${escapeHtml(product.badge)}</span>
        </span>`
      : '';

    // Exactly up to 3 feature chips
    const chipsHtml = (product.chips || []).slice(0, 3).map(chip => {
      const { label, icon } = getChipData(chip);
      return `
        <div class="product-chip">
          <span class="product-chip-icon">${renderChipIcon(icon)}</span>
          <span class="product-chip-label">${escapeHtml(label)}</span>
        </div>
      `;
    }).join('');

    // Image & Placeholder Handling
    const imgUrl = (product.imageUrl || product.image || '').trim();
    const hasImage = Boolean(imgUrl);

    const imageHtml = hasImage
      ? `<img 
          src="${escapeHtml(imgUrl)}" 
          alt="${escapeHtml(product.name)}" 
          class="product-img" 
          loading="lazy" 
          onerror="this.onerror=null; this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"
        />
        <div class="product-img-fallback product-img-placeholder" style="display: none;" aria-hidden="true">
          <div class="placeholder-icon-wrap">${fallbackIcon}</div>
          <span class="placeholder-brand">${escapeHtml(product.brand || 'Creator Gear')}</span>
          <span class="placeholder-title">${escapeHtml(product.name)}</span>
        </div>`
      : `<div class="product-img-fallback product-img-placeholder" aria-label="${escapeHtml(product.name)} placeholder">
          <div class="placeholder-icon-wrap">${fallbackIcon}</div>
          <span class="placeholder-brand">${escapeHtml(product.brand || 'Creator Gear')}</span>
          <span class="placeholder-title">${escapeHtml(product.name)}</span>
        </div>`;

    // Affiliate Link / View Product Button Handling
    const affUrl = (product.affiliateUrl || '').trim();
    const hasAffiliateLink = Boolean(affUrl);

    const actionButtonHtml = hasAffiliateLink
      ? `<a 
          href="${escapeHtml(affUrl)}" 
          target="_blank" 
          rel="noopener noreferrer sponsored" 
          class="product-btn"
          aria-label="View ${escapeHtml(product.name)} on Amazon"
        >
          <svg class="btn-cart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>View Product</span>
          <svg class="btn-arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>`
      : `<button 
          type="button" 
          class="product-btn product-btn-disabled" 
          disabled 
          aria-disabled="true"
          title="Direct product link coming soon"
        >
          <svg class="btn-cart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>View Product</span>
          <span class="btn-coming-soon">(Soon)</span>
        </button>`;

    return `
      <article class="product-card" data-id="${escapeHtml(product.id)}" data-category="${escapeHtml(product.categorySlug)}">
        <div class="product-img-wrap">
          <span class="product-badge-category">${escapeHtml(product.category)}</span>
          ${badgeHtml}
          
          <button 
            type="button" 
            class="product-bookmark-btn ${isSaved ? 'saved' : ''}" 
            data-bookmark-id="${escapeHtml(product.id)}"
            title="${isSaved ? 'Remove from Saved' : 'Save Product'}"
            aria-label="${isSaved ? 'Remove from Saved' : 'Save Product'}"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          ${imageHtml}
        </div>

        <div class="product-content">
          <div class="product-brand">${escapeHtml(product.brand || 'Creator Gear')}</div>
          <h3 class="product-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
          <p class="product-desc">${escapeHtml(product.description)}</p>

          <div class="product-chips-row">
            ${chipsHtml}
          </div>

          <div class="product-footer">
            ${actionButtonHtml}
          </div>
        </div>
      </article>
    `;
  }

  let isCategoryDragging = false;
  let categoryDragSuppressed = false;

  // Scroll Category Tab smoothly into view centered
  function scrollCategoryIntoView(btn, smooth = true) {
    if (!categoryNav || !btn) return;
    const navRect = categoryNav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const currentNavCenter = navRect.left + (navRect.width / 2);
    const currentBtnCenter = btnRect.left + (btnRect.width / 2);
    const offsetFromCenter = currentBtnCenter - currentNavCenter;

    const targetScrollLeft = categoryNav.scrollLeft + offsetFromCenter;

    categoryNav.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  // Update Edge Fade Indicators based on horizontal scroll position
  function updateCategoryFades() {
    if (!categoryNav) return;
    const fadeLeft = document.getElementById('category-fade-left');
    const fadeRight = document.getElementById('category-fade-right');

    const scrollLeft = categoryNav.scrollLeft;
    const maxScroll = categoryNav.scrollWidth - categoryNav.clientWidth;
    const canScroll = maxScroll > 2;

    if (fadeLeft) {
      fadeLeft.classList.toggle('is-visible', canScroll && scrollLeft > 8);
    }
    if (fadeRight) {
      fadeRight.classList.toggle('is-visible', canScroll && (maxScroll - scrollLeft) > 8);
    }
  }

  // Render Horizontal Category Row Buttons
  function renderCategoryButtons() {
    if (!categoryNav || typeof CATEGORIES === 'undefined') return;

    categoryNav.innerHTML = CATEGORIES.map(cat => {
      const isActive = currentCategory === cat.slug ? 'active' : '';
      const iconSvg = CATEGORY_BUTTON_ICONS[cat.slug] || CATEGORY_BUTTON_ICONS['accessories'];

      return `
        <button 
          type="button" 
          class="category-pill-btn ${isActive}" 
          data-category="${cat.slug}"
          aria-pressed="${isActive ? 'true' : 'false'}"
        >
          <span class="category-pill-icon">${iconSvg}</span>
          <span class="category-pill-name">${cat.name}</span>
        </button>
      `;
    }).join('');

    // Attach click events
    categoryNav.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (categoryDragSuppressed || isCategoryDragging) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const cat = btn.getAttribute('data-category');
        setCategory(cat);
      });
    });

    updateCategoryFades();
  }

  // Update Tab Counts
  function updateTabCounts() {
    if (tabAllCount && typeof PRODUCTS !== 'undefined') {
      tabAllCount.textContent = `(${PRODUCTS.length})`;
    }
    if (tabSavedCount) {
      tabSavedCount.textContent = `(${savedProductIds.length})`;
    }
  }

  // Update bookmark button icons across existing rendered cards
  function updateBookmarkButtons() {
    document.querySelectorAll('.product-bookmark-btn').forEach(btn => {
      const id = btn.getAttribute('data-bookmark-id');
      const isSaved = savedProductIds.includes(id);
      btn.classList.toggle('saved', isSaved);
      btn.setAttribute('title', isSaved ? 'Remove from Saved' : 'Save Product');
      btn.setAttribute('aria-label', isSaved ? 'Remove from Saved' : 'Save Product');
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
      }
    });
  }

  // Sort function
  function sortProducts(list) {
    const items = [...list];
    switch (currentSort) {
      case 'name':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case 'featured':
      default:
        return items.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.badge && !b.badge) return -1;
          if (!a.badge && b.badge) return 1;
          return 0;
        });
    }
  }

  // Main Filter and Render Pipeline
  function filterAndRenderProducts() {
    if (!productGrid || typeof PRODUCTS === 'undefined') return;

    const q = searchQuery.trim().toLowerCase();

    // Base product list: all products vs saved products
    let list = activeTab === 'saved'
      ? PRODUCTS.filter(p => savedProductIds.includes(p.id))
      : PRODUCTS;

    // Filter by Category
    if (currentCategory !== 'all') {
      list = list.filter(p => p.categorySlug === currentCategory);
    }

    // Filter by Search Query
    if (q) {
      list = list.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const brandMatch = (p.brand || '').toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const tagMatch = (p.tags || []).some(t => t.toLowerCase().includes(q));
        const chipMatch = (p.chips || []).some(c => {
          const text = typeof c === 'string' ? c : (c.label || '');
          return text.toLowerCase().includes(q);
        });

        return nameMatch || descMatch || brandMatch || catMatch || tagMatch || chipMatch;
      });
    }

    // Sort
    list = sortProducts(list);

    // Render Grid
    if (list.length === 0) {
      if (activeTab === 'saved') {
        productGrid.innerHTML = `
          <div class="store-empty-state">
            <div class="store-empty-icon-wrap">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 class="store-empty-title">No saved products yet</h3>
            <p class="store-empty-text">
              Save your favorite YouTube gear by clicking the bookmark icon on any product card to build your setup list.
            </p>
            <button type="button" class="store-empty-btn" id="store-browse-all-btn">
              <span>Browse All Gear</span>
            </button>
          </div>
        `;

        const browseBtn = document.getElementById('store-browse-all-btn');
        if (browseBtn) {
          browseBtn.addEventListener('click', () => {
            setActiveTab('all');
          });
        }
      } else {
        productGrid.innerHTML = `
          <div class="store-empty-state">
            <div class="store-empty-icon-wrap">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 class="store-empty-title">No matching gear found</h3>
            <p class="store-empty-text">
              We couldn't find any creator gear matching "${q}". Try broader keywords like "mic", "camera", or reset filters.
            </p>
            <button type="button" class="store-empty-btn" id="store-empty-reset">
              <span>Reset Search & Filters</span>
            </button>
          </div>
        `;

        const resetBtn = document.getElementById('store-empty-reset');
        if (resetBtn) {
          resetBtn.addEventListener('click', resetAll);
        }
      }
    } else {
      productGrid.innerHTML = list.map(p => renderProductCard(p)).join('');

      // Attach bookmark listeners to newly rendered cards
      productGrid.querySelectorAll('.product-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-bookmark-id');
          toggleSaveProduct(id);
        });
      });
    }
  }

  // Switch Tab (All Products / Saved Products)
  function setActiveTab(tab) {
    activeTab = tab;

    if (tabAllBtn) {
      tabAllBtn.classList.toggle('active', activeTab === 'all');
      tabAllBtn.setAttribute('aria-selected', activeTab === 'all' ? 'true' : 'false');
    }
    if (tabSavedBtn) {
      tabSavedBtn.classList.toggle('active', activeTab === 'saved');
      tabSavedBtn.setAttribute('aria-selected', activeTab === 'saved' ? 'true' : 'false');
    }

    filterAndRenderProducts();
  }

  // Set Category
  function setCategory(catSlug) {
    currentCategory = catSlug || 'all';

    // Update active class on category buttons and scroll active tab into view
    if (categoryNav) {
      let activeBtn = null;
      categoryNav.querySelectorAll('.category-pill-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-category') === currentCategory;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (isActive) {
          activeBtn = btn;
        }
      });
      if (activeBtn) {
        scrollCategoryIntoView(activeBtn, true);
      }
    }

    // Update URL param cleanly without reload
    const url = new URL(window.location);
    if (currentCategory === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', currentCategory);
    }
    window.history.replaceState({}, '', url);

    filterAndRenderProducts();
    requestAnimationFrame(updateCategoryFades);
  }

  // Reset All
  function resetAll() {
    searchQuery = '';
    currentCategory = 'all';
    activeTab = 'all';
    currentSort = 'featured';

    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.classList.remove('visible');
    if (sortSelect) sortSelect.value = 'featured';

    setActiveTab('all');
    setCategory('all');
  }

  // Initialize from URL
  function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam && CATEGORIES.some(c => c.slug === catParam)) {
      currentCategory = catParam;
    }

    const tabParam = params.get('tab');
    if (tabParam === 'saved') {
      activeTab = 'saved';
    }

    const searchParam = params.get('q');
    if (searchParam) {
      searchQuery = searchParam;
      if (searchInput) {
        searchInput.value = searchParam;
        if (searchClear) searchClear.classList.add('visible');
      }
    }
  }

  // Event Listeners
  function initEvents() {
    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (searchClear) {
          searchClear.classList.toggle('visible', searchQuery.length > 0);
        }
        filterAndRenderProducts();
      });
    }

    // Search clear button
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchQuery = '';
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClear.classList.remove('visible');
        filterAndRenderProducts();
      });
    }

    // Tab buttons
    if (tabAllBtn) {
      tabAllBtn.addEventListener('click', () => setActiveTab('all'));
    }
    if (tabSavedBtn) {
      tabSavedBtn.addEventListener('click', () => setActiveTab('saved'));
    }

    // Sorting dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndRenderProducts();
      });
    }

    // Mobile Explore Collection button smooth scroll
    const exploreBtn = document.getElementById('hero-explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        const catalog = document.getElementById('store-catalog');
        if (catalog) {
          e.preventDefault();
          catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Category row interactions (drag to scroll, wheel scroll, focus auto-scroll, edge fades)
    initCategoryRowInteractions();

    // Global keyboard shortcut: Ctrl+K or Cmd+K focuses search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  }

  // Category Row Interactions: Drag-to-scroll, wheel scroll, keyboard focus, and fade indicators
  function initCategoryRowInteractions() {
    if (!categoryNav) return;

    let isDown = false;
    let startX = 0;
    let scrollStartLeft = 0;

    // Mouse drag scrolling for desktop
    categoryNav.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left click only
      isDown = true;
      categoryDragSuppressed = false;
      startX = e.pageX - categoryNav.offsetLeft;
      scrollStartLeft = categoryNav.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        categoryNav.classList.remove('is-dragging');
        if (isCategoryDragging) {
          categoryDragSuppressed = true;
          setTimeout(() => {
            isCategoryDragging = false;
            categoryDragSuppressed = false;
          }, 60);
        }
      }
    });

    categoryNav.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - categoryNav.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 5) {
        isCategoryDragging = true;
        categoryNav.classList.add('is-dragging');
        categoryNav.scrollLeft = scrollStartLeft - walk;
      }
    });

    categoryNav.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        categoryNav.classList.remove('is-dragging');
        setTimeout(() => {
          isCategoryDragging = false;
          categoryDragSuppressed = false;
        }, 60);
      }
    });

    // Mouse wheel horizontal scrolling when hovering over tabs
    categoryNav.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && categoryNav.scrollWidth > categoryNav.clientWidth) {
        e.preventDefault();
        categoryNav.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Keyboard focus auto-scroll
    categoryNav.addEventListener('focusin', (e) => {
      if (e.target && e.target.classList.contains('category-pill-btn')) {
        scrollCategoryIntoView(e.target, true);
      }
    });

    // Update edge fades on scroll
    categoryNav.addEventListener('scroll', () => {
      requestAnimationFrame(updateCategoryFades);
    }, { passive: true });

    // Update edge fades on window resize
    window.addEventListener('resize', () => {
      requestAnimationFrame(updateCategoryFades);
    });

    window.addEventListener('load', () => {
      updateCategoryFades();
    });
  }

  // Initialize
  function init() {
    initFromUrl();
    renderCategoryButtons();
    updateTabCounts();
    initEvents();
    if (tabAllBtn && tabSavedBtn) {
      tabAllBtn.classList.toggle('active', activeTab === 'all');
      tabSavedBtn.classList.toggle('active', activeTab === 'saved');
    }
    filterAndRenderProducts();

    // Scroll pre-selected category into view on load
    if (categoryNav && currentCategory !== 'all') {
      const activeBtn = categoryNav.querySelector(`.category-pill-btn[data-category="${currentCategory}"]`);
      if (activeBtn) {
        scrollCategoryIntoView(activeBtn, false);
      }
    }
    updateCategoryFades();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
