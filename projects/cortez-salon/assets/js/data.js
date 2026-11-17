/*
 * Cortez Hair Salon — site content.
 *
 * Every page (services, team, gallery, booking, hours) reads from this one
 * file, so updating the salon's details here updates the whole site.
 *
 * NOTE: phone number, street address, staff, prices and hours below are
 * SAMPLE CONTENT. Replace them with the salon's real details before launch.
 */
window.CORTEZ = {
  name: "Cortez",
  tagline: "Hair Salon · Winnipeg",
  phone: "(204) 555-0142",
  phoneHref: "tel:+12045550142",
  address: ["Winnipeg, Manitoba"],
  mapQuery: "Winnipeg, MB",
  timeZone: "America/Winnipeg",
  instagram: "#",

  // Optional: set to a form endpoint (Formspree, Netlify, your own API) to
  // receive bookings and messages. Left empty, requests are kept in the
  // visitor's browser and confirmed on screen.
  bookingEndpoint: "",
  contactEndpoint: "",

  // 0 = Sunday … 6 = Saturday. null = closed. Times are 24h "HH:MM".
  hours: {
    0: null,
    1: null,
    2: ["10:00", "19:00"],
    3: ["10:00", "19:00"],
    4: ["10:00", "20:00"],
    5: ["10:00", "20:00"],
    6: ["09:00", "17:00"],
  },

  categories: [
    { id: "cut", name: "Cut & Style" },
    { id: "colour", name: "Colour" },
    { id: "care", name: "Treatments" },
    { id: "event", name: "Bridal & Events" },
  ],

  services: [
    { id: "signature-cut", cat: "cut", name: "Signature Cut", price: 85, mins: 60, desc: "Consultation, ritual wash, precision cut and a finished blowout tailored to how you actually wear your hair." },
    { id: "short-cut", cat: "cut", name: "Short Cut & Finish", price: 55, mins: 45, desc: "Crops, pixies and tapered shapes — detailed clipper and scissor work with a styled finish." },
    { id: "restyle", cat: "cut", name: "Complete Restyle", price: 110, mins: 90, desc: "A full change of shape. Extended consultation, cut, and a lesson in styling it at home." },
    { id: "blowout", cat: "cut", name: "The Blowout", price: 55, mins: 45, desc: "Wash and volume-first blowout. Sleek, bouncy, or undone — finished to last." },
    { id: "curl-cut", cat: "cut", name: "Curl & Texture Cut", price: 95, mins: 75, desc: "Dry, curl-by-curl shaping that respects your pattern, with a hydrating diffuse finish." },

    { id: "balayage", cat: "colour", name: "Hand-Painted Balayage", price: 240, mins: 180, desc: "Soft, lived-in brightness painted freehand. Includes toner, treatment and blowout." },
    { id: "full-colour", cat: "colour", name: "Single-Process Colour", price: 120, mins: 90, desc: "Root-to-end colour for rich, glossy, even tone. Grey coverage included." },
    { id: "foils", cat: "colour", name: "Dimensional Highlights", price: 190, mins: 150, desc: "Fine foils for depth and brightness, placed to frame the face." },
    { id: "gloss", cat: "colour", name: "Gloss & Tone", price: 70, mins: 45, desc: "Refresh brassy or faded colour and restore a mirror shine between appointments." },
    { id: "colour-correct", cat: "colour", name: "Colour Correction", price: 300, mins: 240, desc: "Corrective work by consultation. Priced from — final quote given in person." },

    { id: "bond", cat: "care", name: "Bond Repair Ritual", price: 65, mins: 30, desc: "Rebuilds broken bonds after colour or heat. Stronger, softer hair from the first visit." },
    { id: "scalp", cat: "care", name: "Scalp Reset", price: 60, mins: 40, desc: "Exfoliating scalp treatment and massage. Quiet, warm, and deeply restorative." },
    { id: "keratin", cat: "care", name: "Smoothing Treatment", price: 280, mins: 180, desc: "Frizz-free, faster-drying hair for up to three months — even through a Winnipeg winter." },

    { id: "bridal-trial", cat: "event", name: "Bridal Trial", price: 120, mins: 90, desc: "Design your wedding-day hair together, photographed and noted for the big day." },
    { id: "bridal-day", cat: "event", name: "Wedding-Day Styling", price: 160, mins: 90, desc: "In-salon styling on the day, with a calm, timed schedule for you and your party." },
    { id: "updo", cat: "event", name: "Event Up-do", price: 95, mins: 60, desc: "Galas, grads and evenings out. Polished chignons to soft, romantic texture." },
  ],

  team: [
    { id: "isla", name: "Isla Moreau", role: "Creative Colour Director", tags: ["colour", "event"], days: [2, 3, 4, 5, 6], palette: ["#3b2418", "#a5683c", "#e7c49a"], bio: "Fifteen years of colour. Isla is known for blondes that stay soft and brunettes that glow." },
    { id: "marco", name: "Marco Reyes", role: "Senior Cutter", tags: ["cut"], days: [2, 3, 4, 5], palette: ["#151110", "#3e2c22", "#8b6a52"], bio: "Precision shapes, short cuts and the cleanest tapers in the city. Quiet hands, sharp lines." },
    { id: "noor", name: "Noor Haddad", role: "Balayage Specialist", tags: ["colour", "cut"], days: [3, 4, 5, 6], palette: ["#4a2a1c", "#c08552", "#f2d9b5"], bio: "Freehand painter. Noor's balayage grows out so gracefully you'll forget to rebook." },
    { id: "elena", name: "Elena Park", role: "Texture & Curl Stylist", tags: ["cut", "care"], days: [2, 4, 5, 6], palette: ["#1d1411", "#5b3324", "#b06c4a"], bio: "Curly, coily, wavy — Elena cuts for your pattern and teaches you to love it." },
    { id: "sasha", name: "Sasha Kowalchuk", role: "Bridal & Event Stylist", tags: ["event", "cut"], days: [3, 5, 6], palette: ["#2c1b17", "#7d4b3c", "#e3bfae"], bio: "Wedding seasons are Sasha's favourite. Romantic texture, pinned to last past midnight." },
  ],

  gallery: [
    { title: "Honey Balayage", cat: "colour", palette: ["#4a2c1a", "#b77a3f", "#f1d3a1"], note: "Hand-painted ribbons over a deep base, toned honey-warm." },
    { title: "Glass Bob", cat: "cut", palette: ["#120e0c", "#2f2420", "#6b5244"], note: "Blunt, chin-length and polished to a mirror finish." },
    { title: "Copper Melt", cat: "colour", palette: ["#3d150c", "#a3431f", "#e8925a"], note: "Root-melted copper with a glossy autumn tone." },
    { title: "Soft Chignon", cat: "event", palette: ["#3a2a22", "#9b7a63", "#e9d6c4"], note: "A low, loose bridal chignon with face-framing tendrils." },
    { title: "Defined Curls", cat: "cut", palette: ["#1a110d", "#4f2e20", "#a0623f"], note: "Curl-by-curl shaping, diffused for definition and volume." },
    { title: "Icy Platinum", cat: "colour", palette: ["#6d6a6a", "#c9c4c0", "#f6f3ef"], note: "Lifted and toned to a cool, clean platinum." },
    { title: "Curtain Layers", cat: "cut", palette: ["#2b1a12", "#6f4630", "#c79670"], note: "Long, airy layers with a soft curtain fringe." },
    { title: "Old-Hollywood Waves", cat: "event", palette: ["#1f1210", "#6b2b22", "#b85d47"], note: "Sculpted, glossy waves for an evening event." },
    { title: "Mushroom Brunette", cat: "colour", palette: ["#2a201c", "#6d5a4f", "#b5a294"], note: "Cool, ashy brunette with subtle dimension." },
  ],

  faqs: [
    { q: "How far ahead should I book?", a: "Colour and longer services fill up one to two weeks ahead, especially Fridays and Saturdays. Cuts and blowouts often have space within a few days." },
    { q: "What is your cancellation policy?", a: "We ask for 24 hours' notice to cancel or move an appointment, so we can offer the time to someone on our waitlist." },
    { q: "Do I need a consultation before colour?", a: "For major changes and colour correction, yes — consultations are free and take about 15 minutes. For everything else, we'll consult at the start of your appointment." },
    { q: "Is there parking?", a: "Yes — street parking is available nearby. Give yourself a few extra minutes in winter." },
    { q: "Do you offer gift cards?", a: "Yes, in any amount. Call or stop by the salon and we'll wrap one for you." },
  ],
};
