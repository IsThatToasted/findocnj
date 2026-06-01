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


## V7 notes
- `data/hours.json` now supports `allDay: true` / `hoursMode: "24h"` for area-level activities like Atlantic City.
- The planner no longer renders warning banners. It auto-adjusts or swaps activities that do not fit the selected weather, mode, or editable hours window.
- Beach tag links now point to the official OCNJ online store: https://store.ocnj.us/.
- The admin dashboard can edit/export 24-hour flags, but GitHub Pages cannot write directly to the repo without a backend or GitHub API/OAuth flow.


## V8 event engine
- Added `data/events.json` with July 2026 OCNJ events from the official 2026 calendar PDF and Ocean City Vacation July calendar.
- The home page now has a **2026 Event Suggestions & Quick Swaps** dashboard under the planner.
- Set `Trip dates`, choose a day, then event suggestions filter to that exact date.
- Use **+ Add event** to append an event to the selected day or **Swap slot** to replace an existing block.
- Events are also converted into planner activities at runtime, so they can be saved in localStorage and printed.
- This is static GitHub Pages friendly; update `data/events.json` and push changes for public updates.

## V9 Event Library Upgrade

- `data/events.json` now includes enriched 2026 event metadata: dates, time ranges, venue names, address/map targets, directions URLs, planner notes, cost labels, and source links.
- The Events section displays a richer card with venue, address, best-fit audience, planner notes, and one-tap Add/Swap controls.
- Because this is hosted on GitHub Pages, live edits from visitors are saved with `localStorage`. To permanently change event details, edit `data/events.json` and push the update to GitHub.
- Good future DB path: Supabase table for `events`, `venues`, and `saved_trips` once you want user accounts or shared itineraries.
