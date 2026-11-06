/**
 * KIIT Event Management Platform (EVENTOS)
 * Application Engine
 * Implements Bento Stage, Campus Zone Matrix, Dual View Modes (Grid & Timeline),
 * Instant Search, Form Validation, Live Countdown Timers, and Persistent Pass Vault.
 */

import { CATEGORIES, CAMPUS_ZONES, EVENTS_DATA, getFormattedEvent } from './events-data.js';

// ============================================================================
// State Management
// ============================================================================
const state = {
  events: [...EVENTS_DATA],
  currentCategory: 'all',
  currentCampusZone: 'all',
  currentQuickFilter: 'all',
  searchQuery: '',
  priceFilter: 'all',
  sortBy: 'upcoming',
  viewMode: 'grid', // 'grid' | 'timeline'
  selectedEventForModal: null,
  selectedEventForReg: null,
  activeTicket: null,
  registrations: [],
  wishlist: new Set(),
  theme: 'dark'
};

// LocalStorage Keys
const STORAGE_KEYS = {
  THEME: 'kiit_event_mgmt_theme',
  LEGACY_THEME: 'k_explore_theme',
  REGISTRATIONS: 'kiit_event_mgmt_registrations',
  LEGACY_REGISTRATIONS: 'k_explore_registrations',
  WISHLIST: 'kiit_event_mgmt_wishlist',
  LEGACY_WISHLIST: 'k_explore_wishlist'
};

// ============================================================================
// Lifecycle Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  initTheme();
  renderCampusZones();
  renderCategories();
  renderSpotlightEvent();
  populateRegistrationEventDropdown();
  renderEvents();
  startGlobalCountdowns();
  initEventListeners();
  initStatsCounter();
  updateTicketsBadge();
});

function loadSavedState() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || localStorage.getItem(STORAGE_KEYS.LEGACY_THEME);
  if (savedTheme) {
    state.theme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    state.theme = 'light';
  } else {
    state.theme = 'dark';
  }

  try {
    const savedRegs = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || localStorage.getItem(STORAGE_KEYS.LEGACY_REGISTRATIONS);
    if (savedRegs) {
      state.registrations = JSON.parse(savedRegs);
    }
  } catch (err) {
    console.error('Failed to parse registrations', err);
    state.registrations = [];
  }

  try {
    const savedWish = localStorage.getItem(STORAGE_KEYS.WISHLIST) || localStorage.getItem(STORAGE_KEYS.LEGACY_WISHLIST);
    if (savedWish) {
      state.wishlist = new Set(JSON.parse(savedWish));
    }
  } catch (err) {
    console.error('Failed to parse wishlist', err);
    state.wishlist = new Set();
  }
}

// ============================================================================
// Theme Switcher (Obsidian Dark / Clean Studio Light)
// ============================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
  showToast(`Switched to ${state.theme === 'dark' ? 'Dark Obsidian' : 'Studio Light'} Mode`, 'info');
}

// ============================================================================
// Live Flip Countdown Timers
// ============================================================================
function calculateTimeRemaining(targetDate) {
  const total = Date.parse(targetDate) - Date.parse(new Date());
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

function formatTwoDigits(n) {
  return n < 10 ? '0' + n : String(n);
}

function startGlobalCountdowns() {
  setInterval(() => {
    // 1. Spotlight Event in Hero Bento
    const spotlightEvent = state.events.find(e => e.featured) || state.events[0];
    if (spotlightEvent) {
      const t = calculateTimeRemaining(spotlightEvent.targetDate);
      const daysEl = document.getElementById('spotlightDays');
      const hoursEl = document.getElementById('spotlightHours');
      const minsEl = document.getElementById('spotlightMins');
      const secsEl = document.getElementById('spotlightSecs');

      if (daysEl) daysEl.textContent = formatTwoDigits(t.days);
      if (hoursEl) hoursEl.textContent = formatTwoDigits(t.hours);
      if (minsEl) minsEl.textContent = formatTwoDigits(t.minutes);
      if (secsEl) secsEl.textContent = formatTwoDigits(t.seconds);
    }

    // 2. Modal Countdown (if open)
    if (state.selectedEventForModal) {
      const tModal = calculateTimeRemaining(state.selectedEventForModal.targetDate);
      const mDays = document.getElementById('modalCountdownDays');
      const mHours = document.getElementById('modalCountdownHours');
      const mMins = document.getElementById('modalCountdownMins');
      const mSecs = document.getElementById('modalCountdownSecs');

      if (mDays) mDays.textContent = formatTwoDigits(tModal.days);
      if (mHours) mHours.textContent = formatTwoDigits(tModal.hours);
      if (mMins) mMins.textContent = formatTwoDigits(tModal.minutes);
      if (mSecs) mSecs.textContent = formatTwoDigits(tModal.seconds);
    }
  }, 1000);
}

// ============================================================================
// Render Spotlight in Hero Bento
// ============================================================================
function renderSpotlightEvent() {
  const spotlight = state.events.find(e => e.featured) || state.events[0];
  if (!spotlight) return;

  const fEvent = getFormattedEvent(spotlight);
  const titleEl = document.getElementById('spotlightTitle');
  const descEl = document.getElementById('spotlightDesc');
  const catEl = document.getElementById('spotlightCategory');
  const venueEl = document.getElementById('spotlightVenue');
  const imgEl = document.getElementById('spotlightImg');

  if (titleEl) titleEl.textContent = fEvent.title;
  if (descEl) descEl.textContent = fEvent.shortDescription;
  if (catEl) catEl.textContent = fEvent.categoryLabel;
  if (venueEl) venueEl.textContent = fEvent.locationShort;
  if (imgEl) {
    imgEl.src = fEvent.image;
    imgEl.alt = fEvent.title;
  }

  const detailsBtn = document.getElementById('spotlightDetailsBtn');
  const regBtn = document.getElementById('spotlightRegisterBtn');
  if (detailsBtn) detailsBtn.onclick = () => openEventDetailsModal(spotlight.id);
  if (regBtn) regBtn.onclick = () => openRegistrationModal(spotlight.id);
}

// ============================================================================
// Render Campus Zone Matrix Selector
// ============================================================================
function renderCampusZones() {
  const row = document.getElementById('campusZonePillsRow');
  if (!row) return;

  row.innerHTML = CAMPUS_ZONES.map(zone => {
    const isActive = state.currentCampusZone === zone.id;
    return `
      <button type="button" class="campus-zone-pill ${isActive ? 'active' : ''}" data-zone="${zone.id}">
        <span class="zone-pill-title">${zone.name}</span>
        <span class="zone-pill-sub">${zone.label}</span>
      </button>
    `;
  }).join('');

  row.querySelectorAll('.campus-zone-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const zId = btn.getAttribute('data-zone');
      state.currentCampusZone = zId;
      renderCampusZones();
      renderEvents();
      document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ============================================================================
// Render Category Filter Pills
// ============================================================================
function renderCategories() {
  const row = document.getElementById('categoryPillsRow');
  if (!row) return;

  row.innerHTML = CATEGORIES.map(cat => {
    const isActive = state.currentCategory === cat.id;
    return `
      <button type="button" class="category-filter-btn ${isActive ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
      </button>
    `;
  }).join('');

  row.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentCategory = btn.getAttribute('data-category');
      renderCategories();
      renderEvents();
    });
  });
}

// ============================================================================
// Filter, Search, Sort & Render Engine
// ============================================================================
function getFilteredAndSortedEvents() {
  let list = [...state.events];

  // 1. Campus Zone Filter
  if (state.currentCampusZone !== 'all') {
    list = list.filter(e => e.campusZone === state.currentCampusZone);
  }

  // 2. Category Filter
  if (state.currentCategory !== 'all') {
    list = list.filter(e => e.category === state.currentCategory);
  }

  // 3. Price Filter
  if (state.priceFilter === 'free') {
    list = list.filter(e => e.isFree);
  } else if (state.priceFilter === 'paid') {
    list = list.filter(e => !e.isFree);
  }

  // 4. Quick Filter
  if (state.currentQuickFilter === 'free') {
    list = list.filter(e => e.isFree);
  } else if (state.currentQuickFilter === 'week') {
    list = list.filter(e => getFormattedEvent(e).daysLeft <= 7);
  } else if (state.currentQuickFilter === 'fast') {
    list = list.filter(e => e.registeredCount / e.capacity >= 0.8);
  }

  // 5. Search Query Filter
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.categoryLabel.toLowerCase().includes(q) ||
      e.shortDescription.toLowerCase().includes(q)
    );
  }

  // 6. Sorting
  if (state.sortBy === 'upcoming') {
    list.sort((a, b) => a.targetDate - b.targetDate);
  } else if (state.sortBy === 'popular') {
    list.sort((a, b) => b.registeredCount - a.registeredCount);
  } else if (state.sortBy === 'title') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sortBy === 'seats') {
    list.sort((a, b) => (a.capacity - a.registeredCount) - (b.capacity - b.registeredCount));
  }

  return list;
}

function renderEvents() {
  const container = document.getElementById('eventsGrid');
  const countEl = document.getElementById('visibleEventsCount');
  const totalEl = document.getElementById('totalEventsCount');
  const resetBtn = document.getElementById('resetFiltersBtn');

  const filteredEvents = getFilteredAndSortedEvents();

  if (countEl) countEl.textContent = filteredEvents.length;
  if (totalEl) totalEl.textContent = state.events.length;

  const hasActiveFilters = state.currentCategory !== 'all' || 
                           state.currentCampusZone !== 'all' || 
                           state.priceFilter !== 'all' || 
                           state.currentQuickFilter !== 'all' || 
                           state.searchQuery.trim() !== '' || 
                           state.sortBy !== 'upcoming';
  if (resetBtn) {
    resetBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
  }

  // Apply container class for Grid vs Timeline View
  container.className = `events-display-container ${state.viewMode === 'grid' ? 'grid-mode' : 'timeline-mode'}`;

  if (filteredEvents.length === 0) {
    container.innerHTML = `
      <div class="empty-events-box">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No Events Found</h3>
        <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem auto;">
          We couldn't locate any events matching your selected campus or search filters.
        </p>
        <button type="button" class="btn-card-primary" style="display: inline-block; padding: 0.75rem 1.5rem;" id="emptyResetBtn">
          Reset All Filters
        </button>
      </div>
    `;
    const emptyBtn = document.getElementById('emptyResetBtn');
    if (emptyBtn) emptyBtn.addEventListener('click', resetAllFilters);
    return;
  }

  // RENDER VIEW 1: Grid Mode
  if (state.viewMode === 'grid') {
    container.innerHTML = filteredEvents.map(event => {
      const fEvent = getFormattedEvent(event);
      const isSaved = state.wishlist.has(event.id);
      const tagClass = event.featured ? 'tag-flagship' : (fEvent.percentFull > 85 ? 'tag-selling' : 'tag-paid');
      const priceTag = event.isFree ? '<span class="cyber-tag tag-free">Free Pass</span>' : `<span class="cyber-tag tag-paid">${event.price}</span>`;

      return `
        <article class="cyber-card" data-id="${event.id}">
          <div class="cyber-card-media">
            <img src="${event.image}" alt="${event.title}" class="cyber-card-img" loading="lazy">
            <div class="cyber-card-media-overlay">
              <div class="cyber-card-top-tags">
                <div class="date-calendar-pill">
                  <span class="date-pill-day">${fEvent.dayNumber}</span>
                  <span class="date-pill-month">${fEvent.monthShort}</span>
                </div>
                <button type="button" class="cyber-card-bookmark ${isSaved ? 'saved' : ''}" data-wishlist-id="${event.id}" title="${isSaved ? 'Remove Bookmark' : 'Bookmark Event'}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              <div class="cyber-card-bottom-tags">
                <span class="cyber-tag ${tagClass}">${event.badge}</span>
                ${priceTag}
              </div>
            </div>
          </div>

          <div class="cyber-card-body">
            <div class="cyber-card-meta">
              <span>${fEvent.categoryLabel}</span>
              <span>•</span>
              <span>${fEvent.formattedTime}</span>
            </div>

            <h3 class="cyber-card-title">${event.title}</h3>

            <div class="cyber-card-venue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${event.locationShort}</span>
            </div>

            <p class="cyber-card-desc">${event.shortDescription}</p>

            <div class="cyber-capacity-block">
              <div class="capacity-head-row">
                <span>Capacity</span>
                <span><strong>${fEvent.seatsRemaining}</strong> left (${fEvent.percentFull}% full)</span>
              </div>
              <div class="capacity-track">
                <div class="capacity-progress" style="width: ${fEvent.percentFull}%"></div>
              </div>
            </div>

            <div class="cyber-card-actions">
              <button type="button" class="btn-card-outline btn-view-details" data-id="${event.id}">
                Details
              </button>
              <button type="button" class="btn-card-primary btn-quick-reg" data-id="${event.id}">
                Register
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  } 
  // RENDER VIEW 2: Timeline / List Mode
  else {
    container.innerHTML = filteredEvents.map(event => {
      const fEvent = getFormattedEvent(event);
      return `
        <article class="timeline-event-row" data-id="${event.id}">
          <div class="timeline-row-media">
            <img src="${event.image}" alt="${event.title}" class="timeline-row-img" loading="lazy">
          </div>
          <div class="timeline-row-info">
            <div class="timeline-row-time">
              📅 ${fEvent.formattedDate} • ⏰ ${fEvent.timeRange}
            </div>
            <h3 class="timeline-row-title">${event.title}</h3>
            <div class="timeline-row-venue">
              📍 ${event.venue} &nbsp;|&nbsp; 🎫 ${event.isFree ? 'Free Access' : event.price} &nbsp;|&nbsp; ⚡ ${fEvent.seatsRemaining} seats left
            </div>
          </div>
          <div class="timeline-row-actions">
            <button type="button" class="btn-card-outline btn-view-details" data-id="${event.id}" style="padding: 0.6rem 1rem;">
              Details
            </button>
            <button type="button" class="btn-card-primary btn-quick-reg" data-id="${event.id}" style="padding: 0.6rem 1.25rem;">
              Get Pass
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // Attach card interaction listeners
  container.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => openEventDetailsModal(btn.getAttribute('data-id')));
  });

  container.querySelectorAll('.btn-quick-reg').forEach(btn => {
    btn.addEventListener('click', () => openRegistrationModal(btn.getAttribute('data-id')));
  });

  container.querySelectorAll('.cyber-card-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-wishlist-id');
      toggleWishlist(id);
    });
  });
}

function resetAllFilters() {
  state.currentCategory = 'all';
  state.currentCampusZone = 'all';
  state.currentQuickFilter = 'all';
  state.priceFilter = 'all';
  state.sortBy = 'upcoming';
  state.searchQuery = '';

  const searchInput = document.getElementById('searchInput');
  const priceSelect = document.getElementById('priceFilter');
  const sortSelect = document.getElementById('sortSelector');
  const clearBtn = document.getElementById('searchClearBtn');

  if (searchInput) searchInput.value = '';
  if (priceSelect) priceSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'upcoming';
  if (clearBtn) clearBtn.classList.remove('visible');

  renderCampusZones();
  renderCategories();
  renderEvents();
  showToast('All filters have been reset', 'info');
}

// ============================================================================
// Wishlist Bookmark Management
// ============================================================================
function toggleWishlist(eventId) {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  if (state.wishlist.has(eventId)) {
    state.wishlist.delete(eventId);
    showToast(`Removed "${event.title.substring(0, 20)}..." from saved events`, 'info');
  } else {
    state.wishlist.add(eventId);
    showToast(`Saved "${event.title.substring(0, 20)}..." to your vault! ❤️`, 'success');
  }

  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(Array.from(state.wishlist)));
  renderEvents();
}

// ============================================================================
// MODAL 1: Event Details Modal
// ============================================================================
function openEventDetailsModal(eventId) {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  state.selectedEventForModal = event;
  const fEvent = getFormattedEvent(event);
  const modal = document.getElementById('eventDetailsModal');

  document.getElementById('modalEventTitle').textContent = fEvent.title;
  document.getElementById('modalEventBanner').src = fEvent.image;
  document.getElementById('modalEventBanner').alt = fEvent.title;
  document.getElementById('modalEventBadge').textContent = fEvent.badge;
  document.getElementById('modalEventCategory').textContent = fEvent.categoryLabel;
  document.getElementById('modalEventPriceBadge').textContent = fEvent.isFree ? 'Free Pass' : fEvent.price;
  document.getElementById('modalEventDate').textContent = fEvent.formattedDate;
  document.getElementById('modalEventTime').textContent = fEvent.timeRange;
  document.getElementById('modalEventVenue').textContent = fEvent.venue;
  document.getElementById('modalEventSeats').textContent = `${fEvent.seatsRemaining} of ${fEvent.capacity} remaining`;
  document.getElementById('modalEventFullDesc').textContent = fEvent.fullDescription;
  document.getElementById('modalEventEligibility').textContent = fEvent.eligibility;
  document.getElementById('modalFooterPrice').textContent = fEvent.isFree ? 'Free Access' : fEvent.price;

  // Highlights
  const highlightsEl = document.getElementById('modalEventHighlights');
  highlightsEl.innerHTML = fEvent.highlights.map(h => `
    <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.92rem; color: var(--text-secondary);">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${h}</span>
    </div>
  `).join('');

  // Schedule Timeline
  const scheduleEl = document.getElementById('modalEventSchedule');
  scheduleEl.innerHTML = fEvent.schedule.map(s => `
    <div>
      <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--accent-cyan);">${s.time}</div>
      <div style="font-size: 0.92rem; color: var(--text-main);">${s.activity}</div>
    </div>
  `).join('');

  // Speakers
  const speakersEl = document.getElementById('modalEventSpeakers');
  speakersEl.innerHTML = fEvent.speakers.map(sp => `
    <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-md);">
      <img src="${sp.avatar}" alt="${sp.name}" style="width: 2.75rem; height: 2.75rem; border-radius: 50%; object-fit: cover;">
      <div>
        <div style="font-weight: 700; font-size: 0.92rem;">${sp.name}</div>
        <div style="font-size: 0.76rem; color: var(--text-muted);">${sp.role}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('modalOpenRegisterBtn').onclick = () => {
    modal.close();
    openRegistrationModal(event.id);
  };

  modal.showModal();
}

// ============================================================================
// MODAL 2: Interactive Registration Modal & Validation
// ============================================================================
function populateRegistrationEventDropdown() {
  const select = document.getElementById('regSelectedEvent');
  if (!select) return;

  select.innerHTML = state.events.map(e => `
    <option value="${e.id}">${e.title} (${e.isFree ? 'Free' : e.price})</option>
  `).join('');
}

function openRegistrationModal(eventId = null) {
  const targetId = eventId || state.events[0].id;
  const event = state.events.find(e => e.id === targetId) || state.events[0];
  state.selectedEventForReg = event;

  const modal = document.getElementById('registrationModal');
  const select = document.getElementById('regSelectedEvent');
  if (select) select.value = event.id;

  updateRegistrationPreview(event);
  clearFormValidationFeedback();

  modal.showModal();
}

function updateRegistrationPreview(event) {
  if (!event) return;
  const fEvent = getFormattedEvent(event);
  const imgEl = document.getElementById('formPreviewImg');
  const titleEl = document.getElementById('formPreviewTitle');
  const dateEl = document.getElementById('formPreviewDate');

  if (imgEl) {
    imgEl.src = fEvent.image;
    imgEl.alt = fEvent.title;
  }
  if (titleEl) titleEl.textContent = fEvent.title;
  if (dateEl) dateEl.textContent = `${fEvent.formattedDate} • ${fEvent.locationShort}`;
}

function clearFormValidationFeedback() {
  const form = document.getElementById('registrationForm');
  if (!form) return;
  form.querySelectorAll('.field-group').forEach(grp => grp.classList.remove('has-error'));
}

function validateFormInputs(formData) {
  const errors = {};
  const name = formData.get('fullName')?.trim() || '';
  const email = formData.get('email')?.trim() || '';
  const phone = formData.get('phone')?.trim() || '';
  const rollNo = formData.get('rollNo')?.trim() || '';
  const terms = formData.get('terms');

  const nameRegex = /^[A-Za-z\s.]{3,60}$/;
  if (!name || !nameRegex.test(name)) {
    errors.fullName = 'Please enter a valid full name.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.phone = 'Please provide a valid 10-digit Indian phone number.';
  }

  if (!rollNo || rollNo.length < 3) {
    errors.rollNo = 'Please enter valid student ID.';
  }

  if (!terms) {
    errors.terms = 'You must agree to the attendance terms.';
  }

  return errors;
}

function handleRegistrationSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('registrationForm');
  const formData = new FormData(form);
  const errors = validateFormInputs(formData);

  clearFormValidationFeedback();

  if (Object.keys(errors).length > 0) {
    for (const [fieldName, message] of Object.entries(errors)) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const group = field.closest('.field-group');
        if (group) {
          group.classList.add('has-error');
          const errorMsg = group.querySelector('.field-error');
          if (errorMsg) errorMsg.innerHTML = `<span>⚠️</span> ${message}`;
        }
      }
    }
    const firstInvalid = form.querySelector('.has-error input, .has-error select');
    if (firstInvalid) firstInvalid.focus();
    showToast('Please correct highlighted fields before submitting', 'error');
    return;
  }

  const submitBtn = document.getElementById('submitRegBtn');
  const submitText = document.getElementById('submitBtnText');
  submitBtn.disabled = true;
  submitText.textContent = 'Minting Secure Pass...';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitText.textContent = 'Complete Registration';

    const eventId = formData.get('selectedEventId');
    const registeredEvent = state.events.find(ev => ev.id === eventId) || state.selectedEventForReg;
    const bookingCode = `EM-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTicket = {
      bookingCode,
      createdAt: new Date().toISOString(),
      eventId: registeredEvent.id,
      eventTitle: registeredEvent.title,
      eventDate: getFormattedEvent(registeredEvent).formattedDate,
      eventTime: registeredEvent.timeRange,
      eventVenue: registeredEvent.venue,
      price: registeredEvent.price,
      fullName: formData.get('fullName').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      college: formData.get('college'),
      rollNo: formData.get('rollNo').trim(),
      ticketType: formData.get('ticketType'),
      year: formData.get('year')
    };

    state.registrations.unshift(newTicket);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(state.registrations));

    registeredEvent.registeredCount = Math.min(registeredEvent.capacity, registeredEvent.registeredCount + 1);

    form.reset();
    document.getElementById('registrationModal').close();

    renderEvents();
    updateTicketsBadge();

    state.activeTicket = newTicket;
    openConfirmationModal(newTicket);
    triggerCelebratoryConfetti();
    showToast(`Pass ${bookingCode} issued successfully!`, 'success');
  }, 600);
}

// ============================================================================
// MODAL 3: VIP Cyber Boarding Pass Modal
// ============================================================================
function openConfirmationModal(ticket) {
  state.activeTicket = ticket;
  const modal = document.getElementById('confirmationModal');

  document.getElementById('ticketPassType').textContent = ticket.ticketType;
  document.getElementById('ticketEventName').textContent = ticket.eventTitle;
  document.getElementById('ticketAttendeeName').textContent = ticket.fullName;
  document.getElementById('ticketCollege').textContent = ticket.college;
  document.getElementById('ticketDateTime').textContent = `${ticket.eventDate} (${ticket.eventTime.split('(')[0]})`;
  document.getElementById('ticketVenue').textContent = ticket.eventVenue;
  document.getElementById('ticketEmail').textContent = ticket.email;
  document.getElementById('ticketPhone').textContent = ticket.phone;
  document.getElementById('ticketRefCode').textContent = ticket.bookingCode;

  renderSvgQrCode('ticketQrContainer', ticket.bookingCode);

  modal.showModal();
}

function renderSvgQrCode(containerId, code) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let path = '';
  const size = 15;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const hash = (code.charCodeAt((r + c) % code.length) * 31 + r * 17 + c * 7) % 100;
      const isCorner1 = r < 4 && c < 4;
      const isCorner2 = r < 4 && c >= size - 4;
      const isCorner3 = r >= size - 4 && c < 4;
      if (isCorner1 || isCorner2 || isCorner3 || hash > 48) {
        path += `M${c},${r}h1v1h-1z `;
      }
    }
  }

  container.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" fill="currentColor">
      <path d="${path}" />
    </svg>
  `;
}

function printCurrentTicket() {
  window.print();
}

function addCurrentTicketToCalendar() {
  if (!state.activeTicket) return;
  const t = state.activeTicket;

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KIIT University//Event Management Portal//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${t.eventTitle}`,
    `DESCRIPTION:Pass: ${t.bookingCode}\\nAttendee: ${t.fullName}\\nPass Type: ${t.ticketType}`,
    `LOCATION:${t.eventVenue}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${t.bookingCode}-pass.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Calendar invite (.ics) downloaded!', 'success');
}

// ============================================================================
// MODAL 4: Digital Passes Vault Drawer
// ============================================================================
function updateTicketsBadge() {
  const count = state.registrations.length;
  const badge1 = document.getElementById('myTicketsBadge');
  const badge2 = document.getElementById('mobileTicketsBadge');
  if (badge1) badge1.textContent = count;
  if (badge2) badge2.textContent = count;
}

function openMyTicketsModal() {
  const modal = document.getElementById('myTicketsModal');
  const container = document.getElementById('myTicketsList');
  const counter = document.getElementById('ticketsSavedCounter');

  if (counter) {
    counter.textContent = `${state.registrations.length} pass${state.registrations.length === 1 ? '' : 'es'} in your browser vault`;
  }

  if (state.registrations.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3.5rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎟️</div>
        <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">No Passes Claimed Yet</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 400px; margin: 0 auto 1.5rem auto;">
          Browse upcoming campus hackathons and conclaves to reserve your delegate pass.
        </p>
        <button type="button" class="btn-card-primary" id="emptyExploreBtn" style="display: inline-block; padding: 0.75rem 1.5rem;">
          Explore Events Now
        </button>
      </div>
    `;
    const exploreBtn = document.getElementById('emptyExploreBtn');
    if (exploreBtn) {
      exploreBtn.onclick = () => {
        modal.close();
        document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
      };
    }
  } else {
    container.innerHTML = state.registrations.map((ticket, index) => `
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.1rem;">${ticket.eventTitle}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">
              📅 ${ticket.eventDate} &nbsp;|&nbsp; 📍 ${ticket.eventVenue}
            </div>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700;">
            ${ticket.bookingCode}
          </span>
        </div>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem;">
          <button type="button" class="btn-card-outline btn-view-pass" data-index="${index}" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
            View QR Pass
          </button>
          <button type="button" class="btn-card-outline btn-cancel-ticket" data-index="${index}" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.4);">
            Cancel
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-view-pass').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        modal.close();
        openConfirmationModal(state.registrations[idx]);
      };
    });

    container.querySelectorAll('.btn-cancel-ticket').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        cancelRegistration(idx);
      };
    });
  }

  modal.showModal();
}

function cancelRegistration(index) {
  const ticket = state.registrations[index];
  if (!ticket) return;

  if (confirm(`Are you sure you want to cancel your pass for "${ticket.eventTitle}"?`)) {
    state.registrations.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(state.registrations));
    updateTicketsBadge();
    openMyTicketsModal();
    showToast(`Cancelled pass ${ticket.bookingCode}`, 'info');
  }
}

// ============================================================================
// Interactive Stats Counter Animation
// ============================================================================
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-value');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1400;
        const startTime = performance.now();

        function updateNumber(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const current = Math.floor(progress * target);
          if (target >= 500000) {
            el.textContent = `₹${(current / 100000).toFixed(1)}L+`;
          } else if (target >= 10000) {
            el.textContent = `${(current / 1000).toFixed(0)},000+`;
          } else if (target === 100) {
            el.textContent = `${current}%`;
          } else {
            el.textContent = `${current}+`;
          }
          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          }
        }

        requestAnimationFrame(updateNumber);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

// ============================================================================
// Confetti Animation Canvas
// ============================================================================
function triggerCelebratoryConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#06b6d4', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
  const confettiCount = 150;
  const particles = [];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: canvas.width * 0.5,
      y: canvas.height * 0.4,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    });
  }

  let startTime = performance.now();
  function renderConfetti(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rot += p.vrot;
      if (elapsed > 1800) {
        p.opacity -= 0.02;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < 3000) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(renderConfetti);
}

// ============================================================================
// Toast Notification Engine
// ============================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `cyber-toast toast-${type}`;
  
  const icon = type === 'success' ? '⚡' : (type === 'error' ? '❌' : 'ℹ️');

  toast.innerHTML = `
    <span>${icon}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

// ============================================================================
// Event Listeners & Interactions
// ============================================================================
function initEventListeners() {
  // Theme Toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // View Switcher (Grid vs Timeline)
  const gridBtn = document.getElementById('viewModeGridBtn');
  const listBtn = document.getElementById('viewModeListBtn');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      renderEvents();
    });

    listBtn.addEventListener('click', () => {
      state.viewMode = 'timeline';
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      renderEvents();
    });
  }

  // Hero Fast Search Input & Button
  const heroFastInput = document.getElementById('heroFastSearchInput');
  const heroFastBtn = document.getElementById('heroFastSearchBtn');
  const mainSearchInput = document.getElementById('searchInput');

  function triggerHeroSearch() {
    if (heroFastInput && mainSearchInput) {
      state.searchQuery = heroFastInput.value.trim();
      mainSearchInput.value = state.searchQuery;
      renderEvents();
      document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (heroFastBtn) heroFastBtn.addEventListener('click', triggerHeroSearch);
  if (heroFastInput) {
    heroFastInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerHeroSearch();
    });
  }

  // Hot Tag Chips
  document.querySelectorAll('.hero-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag');
      state.searchQuery = tag;
      if (mainSearchInput) mainSearchInput.value = tag;
      if (heroFastInput) heroFastInput.value = tag;
      renderEvents();
      document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Dock Search Input
  const searchClearBtn = document.getElementById('searchClearBtn');
  if (mainSearchInput) {
    mainSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', state.searchQuery.length > 0);
      }
      renderEvents();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      mainSearchInput.value = '';
      state.searchQuery = '';
      searchClearBtn.classList.remove('visible');
      renderEvents();
    });
  }

  // Price & Sort Dropdowns
  const priceFilter = document.getElementById('priceFilter');
  if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
      state.priceFilter = e.target.value;
      renderEvents();
    });
  }

  const sortSelector = document.getElementById('sortSelector');
  if (sortSelector) {
    sortSelector.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderEvents();
    });
  }

  // Quick Filter Badges
  document.querySelectorAll('.quick-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.quick-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.currentQuickFilter = chip.getAttribute('data-quick');
      renderEvents();
    });
  });

  // Reset Filters
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // My Passes Buttons
  const myTicketsBtn = document.getElementById('myTicketsBtn');
  if (myTicketsBtn) myTicketsBtn.addEventListener('click', openMyTicketsModal);

  const mobileMyTicketsBtn = document.getElementById('mobileMyTicketsBtn');
  if (mobileMyTicketsBtn) {
    mobileMyTicketsBtn.addEventListener('click', () => {
      closeMobileDrawer();
      openMyTicketsModal();
    });
  }

  // Mobile Hamburger Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMobileDrawer());
    });
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
  }

  // Footer Category Links
  document.querySelectorAll('[data-category-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentCategory = link.getAttribute('data-category-link');
      renderCategories();
      renderEvents();
      document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Modal Dismiss Listeners
  setupModalDismiss('eventDetailsModal', 'closeDetailsModalBtn');
  setupModalDismiss('registrationModal', 'closeRegModalBtn');
  setupModalDismiss('confirmationModal', 'closeConfirmModalBtn');
  setupModalDismiss('myTicketsModal', 'closeMyTicketsModalBtn');

  const cancelRegBtn = document.getElementById('cancelRegBtn');
  if (cancelRegBtn) cancelRegBtn.addEventListener('click', () => document.getElementById('registrationModal').close());

  const doneConfirmBtn = document.getElementById('doneConfirmBtn');
  if (doneConfirmBtn) doneConfirmBtn.addEventListener('click', () => document.getElementById('confirmationModal').close());

  const closeMyTicketsActionBtn = document.getElementById('closeMyTicketsActionBtn');
  if (closeMyTicketsActionBtn) closeMyTicketsActionBtn.addEventListener('click', () => document.getElementById('myTicketsModal').close());

  // Form Synchronizer
  const regSelect = document.getElementById('regSelectedEvent');
  if (regSelect) {
    regSelect.addEventListener('change', (e) => {
      const ev = state.events.find(item => item.id === e.target.value);
      if (ev) updateRegistrationPreview(ev);
    });
  }

  // Form Submit
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', handleRegistrationSubmit);
    regForm.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.field-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  // Ticket Actions (Print & Calendar)
  const printBtn = document.getElementById('printTicketBtn');
  if (printBtn) printBtn.addEventListener('click', printCurrentTicket);

  const calBtn = document.getElementById('calendarTicketBtn');
  if (calBtn) calBtn.addEventListener('click', addCurrentTicketToCalendar);
}

function setupModalDismiss(modalId, closeBtnId) {
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  }
}
