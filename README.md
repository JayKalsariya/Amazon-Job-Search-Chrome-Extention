# Amazon Canada Shift Helper (Chrome Extension)

A beginner-friendly Chrome extension starter that monitors supported Amazon jobs pages and alerts you when job cards mention your selected cities.

## What this extension does

- Saves your preferred city list (for example: Toronto, Brampton).
- Watches supported Amazon jobs pages for new matching cards.
- Sends desktop notifications for matching shifts.
- Highlights matched cards directly on the page.

## What this extension does **not** do

- It does not bypass CAPTCHA.
- It does not bypass site protections, licenses, or anti-bot systems.
- It does not auto-apply on your behalf.

This project is designed as a human-assisted helper so account actions remain in your control.

## Installation (Developer Mode)

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder.

## Usage

1. Open an Amazon jobs page on:
   - `https://hiring.amazon.ca/...`
   - `https://www.amazon.jobs/...`
2. Click the extension icon.
3. Add cities in comma-separated format.
4. (Optional) Add keywords.
5. Keep monitoring enabled.
6. Leave the page open; you will receive notifications for matches.

## Project structure

- `manifest.json` - extension configuration (Manifest V3).
- `popup.html`, `popup.css`, `popup.js` - settings UI.
- `content.js` - scans page content for city/keyword matches.
- `background.js` - creates notifications.
- `icons/` - extension icons.
