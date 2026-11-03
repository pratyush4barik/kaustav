/**
 * K-Explore Events Platform
 * Main Application Logic
 * Implements search, filtering, modern form validation, dialog management,
 * live countdown timers, theme switcher, ticket generation, and LocalStorage data management.
 */

import { CATEGORIES, EVENTS_DATA, getFormattedEvent } from './events-data.js';

// ============================================================================
// State Management
// ============================================================================
const state = {
  events: [...EVENTS_DATA],
  currentCategory: 'all',
  searchQuery: '',
  priceFilter: 'all',
  sortBy: 'upcoming',
  selectedEventForModal: null,
  selectedEventForReg: null,
  activeTicket: null,
  registrations: [],
  wishlist: new Set(),
  theme: 'light'
};

// LocalStorage Keys
const STORAGE_KEYS = {
  THEME: 'k_explore_theme',
  REGISTRATIONS: 'k_explore_registrations',
  WISHLIST: 'k_explore_wishlist'
};

// ============================================================================
// Initialization & LocalStorage Load
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  initTheme();
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
  // Load Theme
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    state.theme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    state.theme = 'dark';
  }

  // Load Registrations
  try {
    const savedRegs = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (savedRegs) {
      state.registrations = JSON.parse(savedRegs);
    }
  } catch (err) {
    console.error('Failed to parse registrations from localStorage', err);
    state.registrations = [];
  }

  // Load Wishlist
  try {
    const savedWish = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (savedWish) {
      state.wishlist = new Set(JSON.parse(savedWish));
    }
  } catch (err) {
    console.error('Failed to parse wishlist from localStorage', err);
    state.wishlist = new Set();
  }
}

// ============================================================================
// Theme Switcher (Dark / Light Mode)
// ============================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
  showToast(`Theme switched to ${state.theme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
}

// ============================================================================
// Live Countdown Timers
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
  // Update spotlight countdown and modal countdown every second
  setInterval(() => {
    // 1. Spotlight Event
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

    // 2. Event Details Modal (if open and active)
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
// Spotlight Event Setup
// ============================================================================
function renderSpotlightEvent() {
  const spotlight = state.events.find(e => e.featured) || state.events[0];
  if (!spotlight) return;

  const fEvent = getFormattedEvent(spotlight);
  document.getElementById('spotlightTitle').textContent = fEvent.title;
  document.getElementById('spotlightDesc').textContent = fEvent.shortDescription;
  document.getElementById('spotlightCategory').textContent = fEvent.categoryLabel;
  document.getElementById('spotlightVenue').textContent = fEvent.locationShort;
  document.getElementById('spotlightImg').src = fEvent.image;
  document.getElementById('spotlightImg').alt = fEvent.title;

  document.getElementById('spotlightDetailsBtn').onclick = () => openEventDetailsModal(spotlight.id);
  document.getElementById('spotlightRegisterBtn').onclick = () => openRegistrationModal(spotlight.id);
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
      <button type="button" class="category-pill ${isActive ? 'active' : ''}" data-category="${cat.id}" role="tab" aria-selected="${isActive}">
        <span>${cat.label}</span>
      </button>
    `;
  }).join('');

  row.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-category');
      state.currentCategory = catId;
      renderCategories();
      renderEvents();
    });
  });
}

// ============================================================================
// Filter, Search, Sort & Render Event Cards
// ============================================================================
function getFilteredAndSortedEvents() {
  let list = [...state.events];

  // 1. Category Filter
  if (state.currentCategory !== 'all') {
    list = list.filter(e => e.category === state.currentCategory);
  }

  // 2. Price Filter
  if (state.priceFilter === 'free') {
    list = list.filter(e => e.isFree);
  } else if (state.priceFilter === 'paid') {
    list = list.filter(e => !e.isFree);
  }

  // 3. Search Query Filter
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.categoryLabel.toLowerCase().includes(q) ||
      e.shortDescription.toLowerCase().includes(q)
    );
  }

  // 4. Sorting
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
  const grid = document.getElementById('eventsGrid');
  const countEl = document.getElementById('visibleEventsCount');
  const totalEl = document.getElementById('totalEventsCount');
  const resetBtn = document.getElementById('resetFiltersBtn');

  const filteredEvents = getFilteredAndSortedEvents();

  if (countEl) countEl.textContent = filteredEvents.length;
  if (totalEl) totalEl.textContent = state.events.length;

  const hasActiveFilters = state.currentCategory !== 'all' || 
                           state.priceFilter !== 'all' || 
                           state.searchQuery.trim() !== '' || 
                           state.sortBy !== 'upcoming';
  if (resetBtn) {
    resetBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
  }

  if (filteredEvents.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3 class="empty-state-title">No Events Found</h3>
        <p class="empty-state-desc">We couldn't find any events matching your selected criteria. Try adjusting your search term or filters.</p>
        <button type="button" class="btn btn-primary" id="emptyStateResetBtn">Reset All Filters</button>
      </div>
    `;
    const emptyBtn = document.getElementById('emptyStateResetBtn');
    if (emptyBtn) emptyBtn.addEventListener('click', resetAllFilters);
    return;
  }

  grid.innerHTML = filteredEvents.map(event => {
    const fEvent = getFormattedEvent(event);
    const isSaved = state.wishlist.has(event.id);
    const badgeClass = event.featured ? 'badge-featured' : (event.registeredCount > event.capacity * 0.85 ? 'badge-selling' : 'badge-soon');
    const priceBadge = event.isFree ? '<span class="badge badge-price-free">Free</span>' : `<span class="badge badge-price-paid">${event.price}</span>`;

    return `
      <article class="event-card" data-id="${event.id}">
        <div class="event-card-media">
          <img src="${event.image}" alt="${event.title}" class="event-card-img" loading="lazy">
          <div class="event-card-tags">
            <span class="badge ${badgeClass}">${event.badge}</span>
            ${priceBadge}
          </div>
          <button type="button" class="bookmark-btn ${isSaved ? 'saved' : ''}" data-wishlist-id="${event.id}" aria-label="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}" title="${isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="event-card-content">
          <div class="event-date-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${fEvent.formattedDate} • ${fEvent.formattedTime}</span>
          </div>

          <h3 class="event-card-title">${event.title}</h3>

          <div class="event-venue-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${event.locationShort}</span>
          </div>

          <p class="event-card-desc">${event.shortDescription}</p>

          <div class="capacity-container">
            <div class="capacity-meta">
              <span>Capacity</span>
              <span><strong>${fEvent.seatsRemaining}</strong> seats left (${fEvent.percentFull}% full)</span>
            </div>
            <div class="capacity-bar-track">
              <div class="capacity-bar-fill" style="width: ${fEvent.percentFull}%"></div>
            </div>
          </div>

          <div class="event-card-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-view-details" data-id="${event.id}">
              Details
            </button>
            <button type="button" class="btn btn-primary btn-sm btn-quick-reg" data-id="${event.id}">
              Register
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach card button handlers
  grid.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => openEventDetailsModal(btn.getAttribute('data-id')));
  });

  grid.querySelectorAll('.btn-quick-reg').forEach(btn => {
    btn.addEventListener('click', () => openRegistrationModal(btn.getAttribute('data-id')));
  });

  grid.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-wishlist-id');
      toggleWishlist(id);
    });
  });
}

function resetAllFilters() {
  state.currentCategory = 'all';
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

  renderCategories();
  renderEvents();
  showToast('All filters have been reset', 'info');
}

// ============================================================================
// Wishlist / Bookmarking
// ============================================================================
function toggleWishlist(eventId) {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  if (state.wishlist.has(eventId)) {
    state.wishlist.delete(eventId);
    showToast(`Removed "${event.title.substring(0, 24)}..." from saved events`, 'info');
  } else {
    state.wishlist.add(eventId);
    showToast(`Saved "${event.title.substring(0, 24)}..." to your wishlist! ❤️`, 'success');
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

  // Fill in modal details
  document.getElementById('modalEventTitle').textContent = fEvent.title;
  document.getElementById('modalEventBanner').src = fEvent.image;
  document.getElementById('modalEventBanner').alt = fEvent.title;
  document.getElementById('modalEventBadge').textContent = fEvent.badge;
  document.getElementById('modalEventCategory').textContent = fEvent.categoryLabel;
  document.getElementById('modalEventPriceBadge').textContent = fEvent.isFree ? 'Free Entry' : fEvent.price;
  document.getElementById('modalEventDate').textContent = fEvent.formattedDate;
  document.getElementById('modalEventTime').textContent = fEvent.timeRange;
  document.getElementById('modalEventVenue').textContent = fEvent.venue;
  document.getElementById('modalEventSeats').textContent = `${fEvent.seatsRemaining} of ${fEvent.capacity} remaining`;
  document.getElementById('modalEventFullDesc').textContent = fEvent.fullDescription;
  document.getElementById('modalEventEligibility').textContent = fEvent.eligibility;
  document.getElementById('modalFooterPrice').textContent = fEvent.isFree ? 'Free Entry' : fEvent.price;

  // Render Highlights
  const highlightsEl = document.getElementById('modalEventHighlights');
  highlightsEl.innerHTML = fEvent.highlights.map(h => `
    <div class="highlight-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${h}</span>
    </div>
  `).join('');

  // Render Schedule
  const scheduleEl = document.getElementById('modalEventSchedule');
  scheduleEl.innerHTML = fEvent.schedule.map(s => `
    <div class="schedule-item">
      <div class="schedule-time">${s.time}</div>
      <div class="schedule-act">${s.activity}</div>
    </div>
  `).join('');

  // Render Speakers
  const speakersEl = document.getElementById('modalEventSpeakers');
  speakersEl.innerHTML = fEvent.speakers.map(sp => `
    <div class="speaker-card">
      <img src="${sp.avatar}" alt="${sp.name}" class="speaker-avatar">
      <div>
        <div class="speaker-name">${sp.name}</div>
        <div class="speaker-role">${sp.role}</div>
      </div>
    </div>
  `).join('');

  // Primary Register CTA in Modal Footer
  document.getElementById('modalOpenRegisterBtn').onclick = () => {
    modal.close();
    openRegistrationModal(event.id);
  };

  // Open modal native
  modal.showModal();
}

// ============================================================================
// MODAL 2: Interactive Registration Modal & JavaScript Form Validation
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
  form.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));
}

// Form validation rules adhering to modern web guidance
function validateFormInputs(formData) {
  const errors = {};
  const name = formData.get('fullName')?.trim() || '';
  const email = formData.get('email')?.trim() || '';
  const phone = formData.get('phone')?.trim() || '';
  const rollNo = formData.get('rollNo')?.trim() || '';
  const terms = formData.get('terms');

  // Name validation: min 3 chars, letters/spaces only
  const nameRegex = /^[A-Za-z\s.]{3,60}$/;
  if (!name || !nameRegex.test(name)) {
    errors.fullName = 'Please enter a valid full name (at least 3 alphabetic characters).';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  // Phone validation: 10 digit Indian number
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.phone = 'Please provide a valid 10-digit Indian phone number (starting with 6-9).';
  }

  // Roll number validation
  if (!rollNo || rollNo.length < 3) {
    errors.rollNo = 'Please enter your student roll number or ID.';
  }

  // Terms agreement validation
  if (!terms) {
    errors.terms = 'You must agree to the event attendance terms.';
  }

  return errors;
}

function handleRegistrationSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('registrationForm');
  const formData = new FormData(form);
  const errors = validateFormInputs(formData);

  // Clear previous inline errors
  clearFormValidationFeedback();

  if (Object.keys(errors).length > 0) {
    // Show errors on matching fields
    for (const [fieldName, message] of Object.entries(errors)) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const group = field.closest('.form-group');
        if (group) {
          group.classList.add('has-error');
          const errorMsg = group.querySelector('.field-error-msg');
          if (errorMsg) errorMsg.innerHTML = `<span>⚠️</span> ${message}`;
        }
      }
    }
    // Focus first invalid element
    const firstInvalid = form.querySelector('.has-error input, .has-error select');
    if (firstInvalid) firstInvalid.focus();
    showToast('Please correct the highlighted fields before submitting', 'error');
    return;
  }

  // Submit button visual feedback
  const submitBtn = document.getElementById('submitRegBtn');
  const submitText = document.getElementById('submitBtnText');
  submitBtn.disabled = true;
  submitText.textContent = 'Generating Secure Pass...';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitText.textContent = 'Complete Registration';

    const eventId = formData.get('selectedEventId');
    const registeredEvent = state.events.find(ev => ev.id === eventId) || state.selectedEventForReg;
    const bookingCode = `KE-2026-${Math.floor(10000 + Math.random() * 90000)}`;

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

    // Save ticket to state & LocalStorage
    state.registrations.unshift(newTicket);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(state.registrations));

    // Increment event attendee count
    registeredEvent.registeredCount = Math.min(registeredEvent.capacity, registeredEvent.registeredCount + 1);

    // Close registration modal & reset form
    form.reset();
    document.getElementById('registrationModal').close();

    // Re-render UI & counters
    renderEvents();
    updateTicketsBadge();

    // Show Confirmation Modal with Ticket & trigger confetti
    state.activeTicket = newTicket;
    openConfirmationModal(newTicket);
    triggerCelebratoryConfetti();
    showToast(`Registration Successful! Pass ${bookingCode} issued.`, 'success');
  }, 600);
}

// ============================================================================
// MODAL 3: Confirmation Screen & Digital Boarding Pass
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

  // Render SVG QR Code
  renderSvgQrCode('ticketQrContainer', ticket.bookingCode);

  modal.showModal();
}

function renderSvgQrCode(containerId, code) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Generate crisp deterministic 2D QR pattern in pure SVG
  let path = '';
  const size = 15;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Deterministic pseudo-random pattern based on code chars + row/col
      const hash = (code.charCodeAt((r + c) % code.length) * 31 + r * 17 + c * 7) % 100;
      // Keep QR corners solid positioning blocks
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

  // Create .ics calendar file content
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KIIT University//K-Explore Events//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${t.eventTitle}`,
    `DESCRIPTION:Registration Code: ${t.bookingCode}\\nAttendee: ${t.fullName}\\nPass: ${t.ticketType}`,
    `LOCATION:${t.eventVenue}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${t.bookingCode}-event.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Calendar invite (.ics) downloaded!', 'success');
}

// ============================================================================
// MODAL 4: "My Tickets" Management (Stored in LocalStorage)
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
    counter.textContent = `${state.registrations.length} pass${state.registrations.length === 1 ? '' : 'es'} stored in browser`;
  }

  if (state.registrations.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 3rem 1rem;">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <h3 class="empty-state-title">No Registered Tickets Yet</h3>
        <p class="empty-state-desc">You haven't registered for any events yet. Explore upcoming campus hackathons and fests to book your spot!</p>
        <button type="button" class="btn btn-primary btn-sm" id="emptyExploreBtn">Explore Events Now</button>
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
      <div class="my-ticket-card">
        <div class="my-ticket-info">
          <div class="my-ticket-title">${ticket.eventTitle}</div>
          <div class="my-ticket-meta">
            <span>📅 ${ticket.eventDate}</span>
            <span>📍 ${ticket.eventVenue}</span>
            <span>🎫 ${ticket.bookingCode}</span>
          </div>
        </div>
        <div class="my-ticket-actions">
          <button type="button" class="btn btn-secondary btn-sm btn-view-pass" data-index="${index}">
            View Pass
          </button>
          <button type="button" class="btn btn-outline btn-sm btn-cancel-ticket" data-index="${index}" style="color: var(--brand-accent); border-color: var(--brand-accent);">
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
    openMyTicketsModal(); // re-render list
    showToast(`Cancelled registration for ${ticket.bookingCode}`, 'info');
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
        let start = 0;
        const duration = 1400;
        const startTime = performance.now();

        function updateNumber(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const current = Math.floor(progress * target);
          if (target === 500000) {
            el.textContent = `₹${(current / 100000).toFixed(1)}L+`;
          } else if (target === 15000) {
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

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const confettiCount = 140;
  const particles = [];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: canvas.width * 0.5,
      y: canvas.height * 0.4,
      w: Math.random() * 9 + 4,
      h: Math.random() * 9 + 4,
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
      p.vy += 0.35; // gravity
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
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-body">
      <div class="toast-title">${type.toUpperCase()}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

// ============================================================================
// Event Listeners & Light Dismiss Handling
// ============================================================================
function initEventListeners() {
  // Theme Toggle Button
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Search Input
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', state.searchQuery.length > 0);
      }
      renderEvents();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClearBtn.classList.remove('visible');
      renderEvents();
    });
  }

  // Price Filter
  const priceFilter = document.getElementById('priceFilter');
  if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
      state.priceFilter = e.target.value;
      renderEvents();
    });
  }

  // Sort Selector
  const sortSelector = document.getElementById('sortSelector');
  if (sortSelector) {
    sortSelector.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderEvents();
    });
  }

  // Reset Filters Button
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // Hero Quick Register
  const heroQuickReg = document.getElementById('heroQuickRegisterBtn');
  if (heroQuickReg) {
    heroQuickReg.addEventListener('click', () => openRegistrationModal());
  }

  // My Tickets Nav Buttons
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
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMobileDrawer());
    });
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileToggle) {
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Footer Category Links
  document.querySelectorAll('[data-category-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-category-link');
      state.currentCategory = cat;
      renderCategories();
      renderEvents();
      document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Modal Close Buttons
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

  // Registration Form Synchronizer
  const regSelect = document.getElementById('regSelectedEvent');
  if (regSelect) {
    regSelect.addEventListener('change', (e) => {
      const ev = state.events.find(item => item.id === e.target.value);
      if (ev) updateRegistrationPreview(ev);
    });
  }

  // Registration Form Submit
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', handleRegistrationSubmit);
  }

  // Ticket Actions (Print & Calendar)
  const printBtn = document.getElementById('printTicketBtn');
  if (printBtn) printBtn.addEventListener('click', printCurrentTicket);

  const calBtn = document.getElementById('calendarTicketBtn');
  if (calBtn) calBtn.addEventListener('click', addCurrentTicketToCalendar);

  // Modern input interaction validation feedback (clearing error as user types)
  if (regForm) {
    regForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }
}

// Light dismiss: closes modal when user clicks backdrop outside container
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
