# 🏋️ FitTrack Pro — Personal Wellness & Fitness Tracker PWA

> SENG 41293 – Mobile Web Application Development | Track C | University of Kelaniya

A fully functional **Progressive Web Application (PWA)** built with **React 19 + Vite** for tracking daily water intake, calories, workouts, and fitness progress — all offline-capable with IndexedDB persistence.

---

## 🚀 Technologies Used

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router v6 (SPA, lazy-loaded) |
| PWA | vite-plugin-pwa + Workbox |
| Offline DB | Dexie.js (IndexedDB wrapper) |
| Charts | Chart.js + react-chartjs-2 |
| Forms | React Hook Form (client-side validation) |
| Persistence | IndexedDB (logs) + LocalStorage (preferences) |
| API | JSONPlaceholder (Fetch API + async/await) |
| Styling | Custom CSS with CSS Variables |
| Fonts | Google Fonts (Syne + DM Sans) |

---

## ⚙️ Installation & Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
npm run preview
```

---

## 📲 PWA Installation

**Chrome Desktop:** Install icon (➕) in address bar → "Install FitTrack Pro"  
**Android Chrome:** Menu → "Add to Home Screen"  
**iOS Safari:** Share → "Add to Home Screen"

---

## 🌐 Browser Compatibility

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, Samsung Internet 14+

---

## ✅ Features Implemented

- Mobile-first responsive design (320px–480px)
- React SPA with lazy-loaded routes
- LocalStorage (theme, goals, profile)
- IndexedDB via Dexie.js (all logs)
- Fetch API + async/await (wellness tips from JSONPlaceholder)
- Offline Service Worker (Workbox)
- PWA manifest — installable on device
- Background sync on reconnect
- Stopwatch + Countdown timer
- Interactive sliders for water input
- Chart.js line + bar charts (7-day history)
- React Hook Form client-side validation
- Dark / Light theme toggle
- Circular SVG progress indicators
- Code splitting with React.lazy

---

