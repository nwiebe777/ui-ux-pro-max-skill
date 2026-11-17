# Cortez Hair Salon — website

A static, six-page website for a hair salon in Winnipeg, Manitoba. There's no build step and no framework: open `index.html` in a browser, or upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel).

| Page | What it does |
|---|---|
| `index.html` | Hero, studio intro, signature services, "the ritual", stylists, recent work, hours with a live open/closed status |
| `services.html` | Full service menu with prices and durations, filterable by category; each service links straight into booking |
| `team.html` | Stylist profiles with specialities and working days; filterable; "Book with …" links |
| `gallery.html` | Filterable gallery with a keyboard-navigable lightbox and "Book this look" |
| `book.html` | 4-step booking: services → stylist → calendar & time slots → details. It checks opening hours, stylist days, appointment length and slots already taken. It ends with a reference number, an `.ics` calendar download, and a list of upcoming requests that the visitor can cancel |
| `contact.html` | Hours, map, validated contact form, FAQ |

## Before launch — replace the sample content

All of the following is **placeholder content** and must be replaced with the salon's real details:

- **Phone number** — `(204) 555-0142` is a fictional 555 number
- **Street address** — the site currently says only "Winnipeg, Manitoba"; add the street address and update the map query
- **Stylists** — names, roles, bios and working days are invented
- **Prices, durations, hours and FAQ answers**

Almost all of it lives in **one file: `assets/js/data.js`**, so editing it there updates every page. The hours summary in each page's footer is plain HTML, so update it as well.

**Photos:** the arch artwork is generated in the browser (abstract "hair strand" art in each look's colours) so the site looks finished without stock photos. To use real photos, replace a `data-art` element with an `<img>` (keep the `arch` class for the shape).

## Receiving bookings and messages

By default, booking requests and contact messages are confirmed on screen and kept in the visitor's own browser only. **The salon does not receive them until an endpoint is set.** Set `bookingEndpoint` and `contactEndpoint` in `data.js` to any URL that accepts a JSON `POST`, such as a [Formspree](https://formspree.io) form, a Netlify function or your own API. Each request is then sent there. If sending fails, the visitor is asked to phone instead.

To use a full booking system (Fresha, Vagaro, Square Appointments), point the "Book" buttons at its booking link.

## Accessibility and performance

- Semantic landmarks, a skip link, visible focus styles and labelled controls
- Inline form errors that are announced to screen readers
- A keyboard-operable menu, calendar, filters and lightbox
- Respects `prefers-reduced-motion`
- No horizontal scrolling at 390px wide
- No JavaScript dependencies; the only external requests are Google Fonts and the map embed
