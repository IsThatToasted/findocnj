# OCNJ Complete Smart Planner

A full static web app for planning Ocean City, NJ trips.

## Features
- Family and solo/couples modes
- Sunny, cloudy, and rainy weather plans
- Editable time slots with auto-shifting
- Activity swap dropdowns
- Hours/conflict warnings
- LocalStorage autosave
- Favorites
- Build My Day generator
- Activity library and restaurant finder
- Budget tracker and gas calculator
- Parking, restroom, beach tag, and map helper links
- Autosaved packing checklist
- Mobile-first bottom nav

## Deploy
Upload the full folder to GitHub Pages, Netlify, Vercel, or your static web host. Do not upload only index.html; the app needs css/, js/, and data/ folders.

## Future DB Upgrade
Replace localStorage in js/storage.js with Supabase/Firebase calls. The app state is already centralized for easier migration.
