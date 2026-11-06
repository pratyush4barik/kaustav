# 🌟 KIIT Event Management — Professional Campus Event Platform

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript ES6+](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)]()

> A modern, visually stunning, accessible, and fully responsive **Event Management and Registration** platform designed for students, faculty, and collegiate communities at **KIIT Deemed to be University**. Built with vanilla **HTML5**, **CSS3 (Custom Properties, Glassmorphism, & Modern Typography)**, and **Modern ES6+ JavaScript**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Core Functionality](#1-core-functionality)
  - [2. Bonus Challenges & Advanced Capabilities](#2-bonus-challenges--advanced-capabilities)
- [UI/UX & Design Philosophy](#-uiux--design-philosophy)
- [System Architecture & File Structure](#-system-architecture--file-structure)
- [Form Validation Rules](#-form-validation-rules)
- [Digital Boarding Pass Ticket & Calendar Integration](#-digital-boarding-pass-ticket--calendar-integration)
- [Getting Started Locally](#-getting-started-locally)
- [Deployment Guide](#-deployment-guide)
- [Browser Compatibility & Performance](#-browser-compatibility--performance)
- [Evaluation Checklist](#-evaluation-checklist)
- [License](#-license)

---

## 🚀 Overview

**Event Management** is a responsive web application tailored for discovering, exploring, and registering for university events — spanning national hackathons, star-studded cultural fests, AI & robotics conclaves, esports tournaments, cricket championships, TEDx conferences, and hands-on masterclasses.

Users can seamlessly:
1. **Discover** upcoming and featured events with real-time live countdown timers.
2. **Search and filter** events dynamically by keywords, domains, pricing, and upcoming dates.
3. **Inspect detailed schedules, speakers, rules, and live capacity bars** via accessible native `<dialog>` modals.
4. **Register with real-time JavaScript-validated forms** that enforce data integrity with modern user feedback.
5. **Receive a digital boarding pass ticket** complete with a deterministic SVG QR code, booking reference code, calendar (.ics) download, and clean print stylesheet.
6. **Manage personal registrations & wishlists** stored persistently in `localStorage`.

---

## ✨ Key Features

### 1. Core Functionality

- **Hero & Live Campus Statistics**:
  - Gradient aura hero section with animated statistics counter (28+ Events, 18,000+ Attendees, ₹7,50,000+ Prizes & Grants, 100% Verified Experience).
  - Quick action buttons ("Browse Upcoming Events" and "Quick Event Pass").
- **Live Campus Ticker Tape Banner**:
  - Continuous animated ticker showing real-time campus announcements, seat availability alerts, and headline news.
- **Featured Spotlight Banner**:
  - Highlights the season's flagship event (e.g., HackSprint X 36-Hour Hackathon).
  - Features a **live ticking countdown timer** displaying Days, Hours, Minutes, and Seconds.
- **Dynamic Search & Filtering System**:
  - **Instant Real-Time Search**: Filters events on-the-fly as the user types (searching title, venue, category, and keywords).
  - **Category Pills**: Filter by *All Events*, *Tech & Coding*, *Cultural & Arts*, *Music & Concerts*, *Workshops & Seminars*, *Gaming & Esports*, and *Sports & Athletics*.
  - **Price Filter**: Instant toggle between *All Prices*, *Free Events Only*, and *Paid Passes Only*.
  - **Smart Sorting**: Sort by *Date (Upcoming)*, *Most Popular (Attendee count)*, *Title (A-Z)*, and *Seats Remaining*.
  - **Live Filter Feedback**: Dynamic counter (`Showing X of Y events`) with a 1-click `Reset All Filters` button and empty state illustration.
- **Rich Event Cards**:
  - High-resolution curated imagery with fallback placeholders.
  - Event title, category pill, status badge (*Flagship*, *Selling Fast*, *Starting Soon*, *Almost Full*).
  - Interactive **Wishlist / Bookmark button** (heart icon) saved persistently in `localStorage`.
  - Date, time, venue, and concise description.
  - **Live Capacity Progress Bar** indicating exact seats remaining and percentage full.
- **Detailed Event Information Modal (`<dialog>`)**:
  - High-res banner preview.
  - Full multi-paragraph background story and eligibility criteria.
  - Interactive **perks and highlights grid** (certificates, cash prizes, free meals, internship tracks).
  - **Chronological schedule & timeline breakdown**.
  - **Speaker and mentor profiles** with high-resolution avatars and roles.
  - Live modal countdown timer showing the exact remaining time until the event starts.
  - Direct "Register for This Event" primary CTA.
- **Registration Form with Real-Time Validation**:
  - Collects: Full Name, Email, Phone Number, Institution, Student ID / Roll Number, Event Selection, Pass Type, Year of Study, Special Notes, and Terms Acceptance.
  - Inline error feedback with clear warning messages and icons.
  - Submitting state with button disable and loading indicator to prevent duplicate submissions.
- **Digital Boarding Pass Ticket & Confirmation**:
  - Displays animated celebration checkmark.
  - Distinctive perforated boarding pass layout with header, event details, attendee profile, and booking reference.
  - Deterministic **SVG QR code** generated on the fly.
  - Realistic barcode visual.
  - Dedicated **Print / Save as PDF** stylesheet (`@media print`) that isolates the ticket cleanly.
  - **"Add to Calendar"** button generating an RFC-compliant `.ics` calendar invite.
- **Campus Venues Showcase**:
  - Highlights iconic university venues including Campus 6 Auditorium, Campus 13 Sports Complex, Chintan Hall, and KIIT-TBI Innovation Hub.
- **Portal Ecosystem / Key Perks Section**:
  - 4 foundational feature pillars: Instant Digital Passes, Live Seat Tracking, One-Click Calendar Sync, and Zero-Paperwork Entry.

---

### 2. Bonus Challenges & Advanced Capabilities

| Feature | Implementation Details |
| :--- | :--- |
| **🌓 Dark / Light Mode** | System preference detection (`prefers-color-scheme`) + interactive navbar toggle button with smooth icon rotation; persistent theme state in `localStorage` (`kiit_event_mgmt_theme`). |
| **⏱️ Live Countdown Timers** | Real-time JavaScript timers (updated every 1,000ms) for the Hero Spotlight event and inside the Event Details modal showing Days, Hours, Minutes, and Seconds. |
| **🎉 Animations & Micro-interactions** | Confetti canvas particle explosion on successful registration, card hover elevation and image zoom, pulsing status badges, smooth modal entrance transitions, and toast alerts. |
| **💾 Local Storage Data Management** | All user registrations are saved to `kiit_event_mgmt_registrations`. Users can access the "My Passes" modal to review bookings, reopen digital passes, or cancel registrations. Wishlisted events are preserved in `kiit_event_mgmt_wishlist`. |

---

## 🎨 UI/UX & Design Philosophy

1. **Executive University Aesthetic**: Crafted with typography pairings of Google Fonts *Outfit* (display headers) and *Plus Jakarta Sans* (interface & body).
2. **Glassmorphism & Frosted Glass**: Uses `backdrop-filter: blur(18px)` across sticky navigation and floating cards for depth and sophistication.
3. **Responsive Grid**: CSS Grid with `auto-fit` and flexbox ensures seamless scaling from 320px mobile screens to 4K displays.
4. **Accessible Semantics**: High-contrast ratios, native `<dialog>` modals with keyboard Escape dismiss, aria attributes, and focus indicators.

---

## 📁 System Architecture & File Structure

```
├── index.html            # Main semantic HTML5 markup and dialog modals
├── css/
│   └── styles.css        # Design tokens, themes, layout, typography, animations, & print CSS
├── js/
│   ├── app.js            # Main application logic, form validation, modals, and storage
│   └── events-data.js    # Master event dataset, categories, and dynamic date helpers
├── README.md             # Project documentation and deployment instructions
├── LICENSE               # MIT License
├── netlify.toml          # Netlify configuration
└── vercel.json           # Vercel deployment configuration
```

---

## 📋 Form Validation Rules

| Field | Rule | Feedback |
| :--- | :--- | :--- |
| **Full Name** | Min 3 chars, letters, spaces & periods only (`^[A-Za-z\s.]{3,60}$`) | "Please enter a valid full name (at least 3 alphabetic characters)." |
| **Email Address** | Valid RFC-compliant email regex (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) | "Please provide a valid email address." |
| **Phone Number** | 10-digit Indian mobile number (`^[6-9]\d{9}$`) | "Please provide a valid 10-digit Indian phone number (starting with 6-9)." |
| **Roll Number** | Min 3 alphanumeric characters | "Please enter your student roll number or ID." |
| **Terms Agreement** | Mandatory checkbox checked | "You must agree to the event attendance terms." |

---

## 🎫 Digital Boarding Pass Ticket & Calendar Integration

When a registration is submitted:
1. A unique booking reference (e.g. `EM-2026-84912`) is generated.
2. A deterministic 15x15 SVG QR code matrix is computed directly in the DOM without external image requests.
3. Users can click **Print / Save Pass** to invoke the browser print dialog, styled via `@media print`.
4. Users can click **Add to Calendar** to download an `.ics` file containing VCALENDAR event specifications.

---

## 💻 Getting Started Locally

No npm build steps or bundlers required. Run with any local HTTP server:

### Using Python:
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### Using Node / npx:
```bash
npx serve .
```

---

## 🌐 Deployment Guide

### Deploying to GitHub Pages
1. Push your repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** (`main` / root).
4. Your site will be live in 1–2 minutes.

---

## 📊 Browser Compatibility & Performance

- **Supported Browsers**: Google Chrome 100+, Microsoft Edge 100+, Mozilla Firefox 98+, Apple Safari 15.4+.
- **Zero Heavy Dependencies**: Pure vanilla JavaScript, CSS3, and HTML5 ensuring near-zero bundle overhead and sub-second First Contentful Paint.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Built with ❤️ for the KIIT University Event Management Assessment.
