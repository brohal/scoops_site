# Scoops Yard Service

A fresh rebuild of [scoopsyardservice.com](https://www.scoopsyardservice.com/) for hosting on Coolify. The site is static HTML, CSS, and JavaScript served by nginx.

The home page includes the four-step instant quote. Scheduling a cleanup posts the lead to a Google Sheet once `window.SCOOPS_LEAD_URL` in `public/js/config.js` is set. Until that URL is filled in, the form still confirms on the page and does not open an email app.

To connect the sheet, create a spreadsheet, paste `scripts/quote-to-sheet.gs` into Extensions → Apps Script, and deploy it as a web app with access set to Anyone. Copy the web app URL into `public/js/config.js`.

## Coolify on Hostinger

1. Push this repo and create a Coolify application from it.
2. Leave the build pack on Dockerfile.
3. Publish port **80**. No environment variables are required.
4. Point the domain at the Coolify app.

`/scoops-yard-service/privacy` and `/scoops-yard-service/terms` redirect to the new pages.

## Local preview

From `public`:

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173
