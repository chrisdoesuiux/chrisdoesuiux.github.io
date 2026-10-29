# Munch Timer product page assets

Asset directory: `assets/munchTimer/`. Page: `/munchTimer/`.

All imagery comes from the Munch Timer project at `/Users/chris/code/munchTimer/assets/`.
- `woodland.webp`: resized from `app-store/creative/header-en-US-3840x1646.png`; decorative marketing illustration, not an app screenshot.
- `en-*` / `ja-*`: resized factual screenshots from `app-store/en-US/` and `app-store/ja-JP/`, respectively. Phone screenshots are 603 × 1311; iPad captures are 1032 × 1376.
- `mouse.webp`: front pose cropped from `mouse/mouse-illustrated-poses.png`.
- `dog.webp`: front pose cropped from `dog/shiba-drawn-cycles.png` (the current Shiba artwork).
- `rabbit.webp`: complete front pose cropped from `rabbit/rabbit-rounded-poses.png`.
- `app-icon.png`: resized from `icons/Icons.xcassets/AppIcon.appiconset/AppIcon.png`.

The app's existing source/license notes remain in its asset folders. No new generated artwork is included. Buddy cutouts use a shared 300 × 270 transparent canvas and foot baseline for consistent alignment.

## Preview and release

Run a static server from the portfolio checkout: `python3 -m http.server 8000 --bind 127.0.0.1`.
Open `http://localhost:8000/munchTimer/`; Japanese is directly accessible at `?lang=ja`.

This is a standalone buildless page; it does not change the portfolio homepage, global CSS, privacy copy, or JavaScript. Publication approved by the owner on 29 October 2026. Keep this page directly accessible at `/munchTimer/` without adding a link on the portfolio homepage.

Before publication, confirm App Store availability and replace the coming-soon link/release message with the verified product URL. Current product facts follow `docs/app-store-listing-draft.md` in the app project. No fixed Premium price is shown.
