# OCNJ Complete Smart Planner V6

Static GitHub Pages-compatible planner with:

- Family and solo/couples modes
- Sunny/cloudy/rainy planner presets
- Editable time slots and durations
- Auto-repair scheduling that avoids recommending activities outside editable planning windows
- Activity hours stored in `data/hours.json`
- Admin hours dashboard at `admin.html`
- LocalStorage persistence for trip edits and local admin hours overrides
- Activity library, food finder, budget tracker, gas calculator, packing checklist, and print/PDF support

## Important GitHub Pages note

GitHub Pages is static hosting. Browser code cannot directly write changes back into `data/hours.json`.

To update hours without a backend:

1. Open `admin.html`.
2. Edit activity open/close/best-start/duration/buffer values.
3. Click **Save local override** to test on that device.
4. Click **Export hours.json**.
5. Replace `data/hours.json` in the repo with the exported file and commit/push.

Future upgrade path: Supabase/Firebase admin table for live shared edits, user accounts, and synced itineraries.

## Hours behavior

The planner no longer displays warning banners. Instead, it uses open/close/buffer values to avoid choosing poor activity times in the first place. Important activities use a larger close buffer so they are not suggested too close to closing.
