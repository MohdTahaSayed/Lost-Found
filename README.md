# Somaiya Lost & Found (Frontend)

Campus Lost & Found mini project — **frontend only** (HTML, CSS, JavaScript).

## Project structure

```
public/
  index.html          # Main page shell
  css/styles.css      # Styles
  js/
    app.js            # Screens, routing, UI logic
    api.js            # Data access (calls store.js)
    store.js          # Demo data in browser localStorage
    seed-data.json    # Initial sample items, users, claims
    auth.js           # Logged-in user (sessionStorage)
    ui.js, utils.js, locations.js
  images/             # Item photos
```

There is **no backend server code**. Data is stored in the browser with `localStorage` so you can demo login, reports, claims, and admin flows for your presentation.

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

**Demo logins:** `student@somaiya.edu` or `admin@somaiya.edu` (any password with 4+ characters).

## Reset demo data

Clear site data for localhost in your browser (or run `localStorage.removeItem('somaiya-lost-found-db')` in the dev console) and refresh to reload `seed-data.json`.
