/* Cortez Hair Salon — site behaviour. Depends on data.js (window.CORTEZ). */
(function () {
  "use strict";
  const D = window.CORTEZ;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.documentElement.classList.add("js");

  const store = {
    get(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + n.toLocaleString("en-CA");
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmtTime = (mins) => { let h = Math.floor(mins / 60), m = mins % 60; const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + (m ? ":" + String(m).padStart(2, "0") : "") + " " + ap; };
  const fmtDur = (m) => (m >= 60 ? Math.floor(m / 60) + " hr" + (m % 60 ? " " + (m % 60) + " min" : "") : m + " min");
  const ymd = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3600);
  }

  /* ---------- Salon time (Winnipeg) ---------- */
  function salonNow() {
    try {
      const p = new Intl.DateTimeFormat("en-CA", { timeZone: D.timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
      const g = (t) => p.find((x) => x.type === t).value;
      const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
      return { dow, mins: Number(g("hour")) * 60 + Number(g("minute")), date: g("year") + "-" + g("month") + "-" + g("day") };
    } catch (e) { const d = new Date(); return { dow: d.getDay(), mins: d.getHours() * 60 + d.getMinutes(), date: ymd(d) }; }
  }
  function openStatus() {
    const n = salonNow(), h = D.hours[n.dow];
    if (h && n.mins >= toMin(h[0]) && n.mins < toMin(h[1])) return { open: true, text: "Open now · until " + fmtTime(toMin(h[1])) };
    for (let i = 0; i < 8; i++) {
      const d = (n.dow + i) % 7, hh = D.hours[d];
      if (!hh) continue;
      if (i === 0 && n.mins >= toMin(hh[0])) continue;
      const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DOW[d];
      return { open: false, text: "Closed · opens " + when + " at " + fmtTime(toMin(hh[0])) };
    }
    return { open: false, text: "Closed" };
  }

  /* ---------- Generative hair-strand art ---------- */
  function rng(seed) { let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  let artId = 0;
  function strandArt(el) {
    const pal = (el.dataset.palette || "#2a1b14,#9b6a42,#efd2a8").split(",");
    const seed = el.dataset.seed || pal.join("");
    const R = rng(seed), W = 300, H = 400, id = "a" + (++artId);
    const count = Number(el.dataset.count || 46), flow = Number(el.dataset.flow || 1);
    let paths = "";
    for (let g = 0; g < 3; g++) {
      let grp = "";
      for (let i = 0; i < count / 3; i++) {
        const x0 = -40 + R() * (W + 80), amp = (30 + R() * 90) * flow, ph = R() * 6.28;
        const pts = [];
        for (let k = 0; k <= 6; k++) {
          const y = -20 + (k / 6) * (H + 40);
          const x = x0 + Math.sin(ph + k * (0.9 + R() * 0.25)) * amp * (0.4 + k / 9) + (k / 6) * (R() - 0.5) * 60;
          pts.push([x, y]);
        }
        let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
        for (let k = 1; k < pts.length; k++) {
          const [px, py] = pts[k - 1], [x, y] = pts[k], my = (py + y) / 2;
          d += " C" + px.toFixed(1) + " " + my.toFixed(1) + " " + x.toFixed(1) + " " + my.toFixed(1) + " " + x.toFixed(1) + " " + y.toFixed(1);
        }
        const w = (0.4 + R() * (g === 2 ? 1.2 : 3.2)).toFixed(2), o = (0.25 + R() * 0.65).toFixed(2);
        grp += '<path d="' + d + '" stroke="url(#' + id + "g" + (i % 3) + ')" stroke-width="' + w + '" opacity="' + o + '" fill="none" stroke-linecap="round"/>';
      }
      paths += '<g class="sway">' + grp + "</g>";
    }
    const grads = [0, 1, 2].map((k) => '<linearGradient id="' + id + "g" + k + '" x1="0" y1="0" x2="' + (k * 0.3) + '" y2="1"><stop offset="0" stop-color="' + pal[0] + '"/><stop offset="' + (0.45 + k * 0.1) + '" stop-color="' + pal[1] + '"/><stop offset="1" stop-color="' + pal[2] + '"/></linearGradient>').join("");
    el.innerHTML = '<svg class="art strands" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>' + grads +
      '<radialGradient id="' + id + 'r" cx="' + (0.3 + R() * 0.4) + '" cy="' + (0.25 + R() * 0.3) + '" r="0.8"><stop offset="0" stop-color="' + pal[2] + '" stop-opacity=".55"/><stop offset=".55" stop-color="' + pal[1] + '" stop-opacity=".18"/><stop offset="1" stop-color="' + pal[0] + '" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'b"><feGaussianBlur stdDeviation="0.35"/></filter></defs>' +
      '<rect width="100%" height="100%" fill="' + pal[0] + '"/><rect width="100%" height="100%" fill="url(#' + id + 'r)"/>' +
      '<g filter="url(#' + id + 'b)">' + paths + "</g></svg>";
  }
  function paintArt(root = document) { $$("[data-art]", root).forEach(strandArt); }

  /* ---------- Chrome ---------- */
  function chrome() {
    const page = document.body.dataset.page;
    $$(".nav a, .drawer nav a").forEach((a) => { if (a.dataset.nav === page) a.setAttribute("aria-current", "page"); });
    const hdr = $(".hdr");
    const onScroll = () => hdr && hdr.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    const burger = $(".burger"), drawer = $(".drawer");
    if (burger && drawer) {
      const set = (open) => {
        document.body.classList.toggle("menu-open", open);
        burger.setAttribute("aria-expanded", String(open));
        burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        drawer.setAttribute("aria-hidden", String(!open));
        drawer.inert = !open;
        document.body.style.overflow = open ? "hidden" : "";
        if (open) { const f = $("a", drawer); f && f.focus(); }
      };
      drawer.inert = true;
      burger.addEventListener("click", () => set(!document.body.classList.contains("menu-open")));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { set(false); burger.focus(); } });
      $$("a", drawer).forEach((a) => a.addEventListener("click", () => set(false)));
      window.addEventListener("resize", () => { if (window.innerWidth > 1080) set(false); });
    }

    // Contact details from data.js
    $$("[data-phone]").forEach((a) => { a.textContent = D.phone; a.href = D.phoneHref; });
    $$("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));
    const st = openStatus();
    $$("[data-status]").forEach((e) => { e.textContent = st.text; e.classList.toggle("open", st.open); });
    $$("[data-hours]").forEach((tbl) => {
      const today = salonNow().dow;
      tbl.innerHTML = "<caption class='sr-only'>Opening hours</caption><tbody>" + [2, 3, 4, 5, 6, 0, 1].map((d) => {
        const h = D.hours[d];
        return "<tr" + (d === today ? " class='today'" : "") + "><th scope='row'>" + DOW[d] + (d === today ? " · today" : "") + "</th><td>" + (h ? fmtTime(toMin(h[0])) + " – " + fmtTime(toMin(h[1])) : "Closed") + "</td></tr>";
      }).join("") + "</tbody>";
    });
  }

  function reveal() {
    const els = $$(".rv, .rv-img");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    // A fully clipped element never reports an intersection, so clip-reveals
    // are observed through their parent and then revealed together.
    const targets = new Map();
    els.forEach((e) => {
      const t = e.classList.contains("rv-img") ? e.parentElement : e;
      if (!targets.has(t)) targets.set(t, []);
      targets.get(t).push(e);
    });
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      targets.get(en.target).forEach((e) => e.classList.add("in"));
      io.unobserve(en.target);
    }), { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });
    targets.forEach((_, t) => io.observe(t));
  }

  function filters(container, items, attr) {
    if (!container) return;
    const chips = $$(".chip", container);
    chips.forEach((c) => c.addEventListener("click", () => {
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
      const f = c.dataset.filter;
      items().forEach((it) => it.classList.toggle("is-hidden", f !== "all" && !(it.dataset[attr] || "").split(" ").includes(f)));
      const live = $("[data-filter-live]");
      if (live) live.textContent = items().filter((i) => !i.classList.contains("is-hidden")).length + " shown";
    }));
  }

  /* ---------- Services page ---------- */
  function servicesPage() {
    const root = $("#menu");
    if (!root) return;
    const pals = { cut: ["#1b1310", "#5a3a2a", "#c69a72"], colour: ["#3a1f12", "#b0703b", "#f0cf9c"], care: ["#232020", "#6d625a", "#d8cdc2"], event: ["#2a1716", "#7d4540", "#e6c1b2"] };
    root.innerHTML = D.categories.map((c, i) => {
      const list = D.services.filter((s) => s.cat === c.id);
      return '<section class="menu-sec" id="' + c.id + '" data-cat="' + c.id + '"><div class="menu-sec__head rv"><span class="num">0' + (i + 1) + '</span><h2>' + esc(c.name) + '</h2><p class="muted">' + list.length + ' services · prices from</p><div class="arch" data-art data-palette="' + pals[c.id].join(",") + '" data-seed="' + c.id + '"></div></div><div>' +
        list.map((s) => '<article class="svc rv"><h3>' + esc(s.name) + ' <small>' + fmtDur(s.mins) + '</small></h3><div class="svc__price"><small>from</small>' + money(s.price) + "</div><p>" + esc(s.desc) + '</p><a class="link" href="book.html?service=' + s.id + '">Book <span aria-hidden="true">→</span></a></article>').join("") +
        "</div></section>";
    }).join("");
    filters($(".chips"), () => $$(".menu-sec"), "cat");
  }

  /* ---------- Team ---------- */
  function teamHTML(list, full) {
    return list.map((m, i) => {
      const initials = m.name.split(" ").map((p) => p[0]).join("");
      return '<article class="member rv rv-d' + (i % 3) + '" data-tags="' + m.tags.join(" ") + '"><div class="arch rv-img" data-art data-palette="' + m.palette.join(",") + '" data-seed="' + m.id + '" data-flow="1.3"></div>' +
        '<div><div class="member__role">' + esc(m.role) + '</div><h3>' + esc(m.name) + "</h3></div>" +
        (full ? "<p>" + esc(m.bio) + "</p>" : "") +
        '<div class="member__foot"><div class="days" aria-label="Works ' + m.days.map((d) => DOW[d]).join(", ") + '">' + [2, 3, 4, 5, 6].map((d) => '<i class="' + (m.days.includes(d) ? "on" : "") + '" aria-hidden="true">' + DOW[d].slice(0, 2) + "</i>").join("") + "</div>" +
        '<a class="link" href="book.html?stylist=' + m.id + '">Book ' + esc(m.name.split(" ")[0]) + "</a></div></article>";
    }).join("");
  }
  function teamPage() {
    const t = $("#team"); if (!t) return;
    const full = t.dataset.full !== undefined;
    t.innerHTML = teamHTML(full ? D.team : D.team.slice(0, 3), full);
    // add initials inside each arch after painting
    if (full) filters($(".chips"), () => $$(".member", t), "tags");
  }

  /* ---------- Gallery ---------- */
  function galleryPage() {
    const g = $("#gallery"); if (!g) return;
    const limit = Number(g.dataset.limit || 99);
    const items = D.gallery.slice(0, limit);
    const ratios = ["3 / 4.2", "1 / 1", "3 / 4", "4 / 5", "3 / 4.6", "1 / 1.1"];
    g.innerHTML = items.map((it, i) => '<button class="gitem rv" type="button" data-cat="' + it.cat + '" data-i="' + i + '" aria-label="View ' + esc(it.title) + '"><div class="arch arch--sq" style="aspect-ratio:' + ratios[i % ratios.length] + '" data-art data-palette="' + it.palette.join(",") + '" data-seed="' + it.title + '" data-count="54"><div class="arch__cap"><b>' + esc(it.title) + "</b><small>" + esc(it.cat === "event" ? "Event" : it.cat === "cut" ? "Cut" : "Colour") + "</small></div></div></button>").join("");
    filters($(".chips"), () => $$(".gitem", g), "cat");

    const dlg = $("#lightbox"); if (!dlg || typeof dlg.showModal !== "function") return;
    let cur = 0;
    const visible = () => $$(".gitem", g).filter((b) => !b.classList.contains("is-hidden")).map((b) => Number(b.dataset.i));
    const show = (i) => {
      cur = i; const it = items[i];
      $(".lightbox__art", dlg).innerHTML = '<div class="art" data-art data-palette="' + it.palette.join(",") + '" data-seed="' + it.title + 'xl" data-count="70"></div>';
      paintArt(dlg);
      $("h2", dlg).textContent = it.title;
      $("[data-lb-cat]", dlg).textContent = it.cat === "event" ? "Bridal & Events" : it.cat === "cut" ? "Cut & Style" : "Colour";
      $("[data-lb-note]", dlg).textContent = it.note;
      $("[data-lb-book]", dlg).href = "book.html?look=" + encodeURIComponent(it.title);
    };
    const step = (d) => { const v = visible(); const k = v.indexOf(cur); show(v[(k + d + v.length) % v.length]); };
    g.addEventListener("click", (e) => { const b = e.target.closest(".gitem"); if (!b) return; show(Number(b.dataset.i)); dlg.showModal(); });
    $("[data-lb-prev]", dlg).addEventListener("click", () => step(-1));
    $("[data-lb-next]", dlg).addEventListener("click", () => step(1));
    $("[data-lb-close]", dlg).addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
  }

  /* ---------- Forms ---------- */
  function validate(form) {
    let ok = true, first = null;
    $$("[data-req]", form).forEach((inp) => {
      const f = inp.closest(".field"), err = f && $(".err", f), v = inp.value.trim();
      let msg = "";
      if (!v) msg = "Please fill this in.";
      else if (inp.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = "That email doesn't look quite right.";
      else if (inp.type === "tel" && v.replace(/\D/g, "").length < 10) msg = "Please enter a 10-digit phone number.";
      if (f) f.classList.toggle("has-error", !!msg);
      if (err) err.textContent = msg;
      inp.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { ok = false; first = first || inp; }
    });
    if (first) first.focus();
    return ok;
  }
  async function send(endpoint, payload) {
    if (!endpoint) return true;
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      return r.ok;
    } catch (e) { return false; }
  }
  function contactPage() {
    const form = $("#contact-form"); if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const data = Object.fromEntries(new FormData(form));
      const btn = $("button[type=submit]", form); btn.disabled = true;
      const ok = await send(D.contactEndpoint, data);
      btn.disabled = false;
      if (!ok) { toast("We couldn't send that — please call us at " + D.phone + "."); return; }
      const msgs = store.get("cortez.messages", []); msgs.push({ ...data, at: new Date().toISOString() }); store.set("cortez.messages", msgs);
      form.outerHTML = '<div class="form-ok" role="status" tabindex="-1"><span class="eyebrow">Message received</span><h3 class="h3">Thank you, ' + esc(data.name.split(" ")[0]) + ".</h3><p class='muted' style='margin-top:12px'>We'll reply within one business day. For anything urgent, call <a class='link' href='" + D.phoneHref + "'>" + D.phone + "</a>.</p></div>";
      $(".form-ok").focus();
    });
    const faq = $("#faq");
    if (faq) faq.innerHTML = D.faqs.map((f, i) => "<details" + (i === 0 ? " open" : "") + "><summary>" + esc(f.q) + '<i aria-hidden="true"></i></summary><p>' + esc(f.a) + "</p></details>").join("");
  }

  /* ---------- Booking ---------- */
  function bookingPage() {
    const root = $("#booking"); if (!root) return;
    const q = new URLSearchParams(location.search);
    const state = { services: [], stylist: "any", date: null, time: null, month: null };
    if (q.get("service") && D.services.some((s) => s.id === q.get("service"))) state.services = [q.get("service")];
    if (q.get("stylist") && D.team.some((m) => m.id === q.get("stylist"))) state.stylist = q.get("stylist");
    let stepIdx = 0;
    const steps = $$(".bstep", root), prog = $$(".progress li", root);

    // Step 1: services
    $("#svc-opts").innerHTML = D.categories.map((c) => '<fieldset class="opt-group" style="border:0;padding:0;margin:0 0 34px"><legend class="flabel">' + esc(c.name) + "</legend>" +
      D.services.filter((s) => s.cat === c.id).map((s) => '<label class="opt"><input type="checkbox" name="svc" value="' + s.id + '"' + (state.services.includes(s.id) ? " checked" : "") + '><span class="opt__t"><b>' + esc(s.name) + "</b><small>" + fmtDur(s.mins) + '</small></span><span class="opt__p"><small>from</small>' + money(s.price) + "</span></label>").join("") + "</fieldset>").join("");
    $("#svc-opts").addEventListener("change", () => { state.services = $$("input[name=svc]:checked", root).map((i) => i.value); state.time = null; render(); });

    // Step 2: stylist
    function renderStylists() {
      const cats = new Set(state.services.map((id) => D.services.find((s) => s.id === id).cat));
      const opts = [{ id: "any", name: "First available", role: "We'll match you with the right stylist" }].concat(D.team);
      $("#sty-opts").innerHTML = opts.map((m) => {
        const fit = m.id === "any" || [...cats].every((c) => m.tags.includes(c) || c === "care");
        return '<label class="opt' + (fit ? "" : " is-disabled") + '"><input type="radio" name="sty" value="' + m.id + '"' + (state.stylist === m.id ? " checked" : "") + (fit ? "" : " disabled") + '><span class="opt__t"><b>' + esc(m.name) + "</b><small>" + esc(m.role) + (fit ? "" : " · not offering your selected services") + "</small></span><span class='opt__p'><small>" + (m.days ? m.days.map((d) => DOW[d].slice(0, 3)).join(" ") : "Tue – Sat") + "</small></span></label>";
      }).join("");
      const sel = D.team.find((m) => m.id === state.stylist);
      if (sel && ![...cats].every((c) => sel.tags.includes(c) || c === "care")) { state.stylist = "any"; $("input[value=any]", root).checked = true; }
    }
    $("#sty-opts").addEventListener("change", (e) => { state.stylist = e.target.value; state.date = null; state.time = null; render(); });

    // Step 3: date & time
    const totalMins = () => state.services.reduce((a, id) => a + D.services.find((s) => s.id === id).mins, 0);
    const totalPrice = () => state.services.reduce((a, id) => a + D.services.find((s) => s.id === id).price, 0);
    const worksOn = (dow) => D.hours[dow] && (state.stylist === "any" || D.team.find((m) => m.id === state.stylist).days.includes(dow));
    const booked = () => store.get("cortez.bookings", []);
    function slotsFor(dateStr) {
      const d = parseYmd(dateStr), h = D.hours[d.getDay()]; if (!h) return [];
      const open = toMin(h[0]), close = toMin(h[1]), len = Math.max(totalMins(), 30), now = salonNow();
      const taken = booked().filter((b) => b.date === dateStr && b.status !== "cancelled" && (state.stylist === "any" || b.stylist === state.stylist || b.stylist === "any"));
      const out = [];
      for (let t = open; t + len <= close; t += 30) {
        let dis = dateStr === now.date && t <= now.mins + 60;
        if (state.stylist !== "any") dis = dis || taken.some((b) => t < b.start + b.mins && b.start < t + len);
        else {
          const avail = D.team.filter((m) => m.days.includes(d.getDay()) && !taken.some((b) => b.stylist === m.id && t < b.start + b.mins && b.start < t + len));
          dis = dis || avail.length === 0;
        }
        out.push({ t, dis });
      }
      return out;
    }
    function renderCal() {
      const today = parseYmd(salonNow().date);
      if (!state.month) state.month = new Date(today.getFullYear(), today.getMonth(), 1);
      const m = state.month, first = new Date(m.getFullYear(), m.getMonth(), 1), days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 90);
      $("#cal-title").textContent = MON[m.getMonth()] + " " + m.getFullYear();
      $("#cal-prev").disabled = m <= new Date(today.getFullYear(), today.getMonth(), 1);
      $("#cal-next").disabled = new Date(m.getFullYear(), m.getMonth() + 1, 1) > maxDate;
      let html = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => '<div class="cal__dow" aria-hidden="true">' + d + "</div>").join("");
      for (let i = 0; i < first.getDay(); i++) html += "<div></div>";
      for (let day = 1; day <= days; day++) {
        const dt = new Date(m.getFullYear(), m.getMonth(), day), s = ymd(dt);
        const ok = dt >= today && dt <= maxDate && worksOn(dt.getDay()) && slotsFor(s).some((x) => !x.dis);
        html += '<button type="button" class="cal__day' + (s === ymd(today) ? " today" : "") + '" data-date="' + s + '" aria-pressed="' + (state.date === s) + '" aria-label="' + DOW[dt.getDay()] + " " + MON[dt.getMonth()] + " " + day + (ok ? "" : ", unavailable") + '"' + (ok ? "" : " disabled") + ">" + day + "</button>";
      }
      $("#cal-grid").innerHTML = html;
      const sl = $("#slots");
      if (!state.date) { sl.innerHTML = '<p class="muted" style="grid-column:1/-1;margin:0">Choose a day to see available times.</p>'; return; }
      const list = slotsFor(state.date);
      sl.innerHTML = list.length ? list.map((x) => '<button type="button" class="slot" data-t="' + x.t + '" aria-pressed="' + (state.time === x.t) + '"' + (x.dis ? " disabled" : "") + ">" + fmtTime(x.t) + "</button>").join("") : '<p class="muted">No times available.</p>';
    }
    $("#cal-prev").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderCal(); });
    $("#cal-next").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderCal(); });
    $("#cal-grid").addEventListener("click", (e) => { const b = e.target.closest(".cal__day"); if (!b || b.disabled) return; state.date = b.dataset.date; state.time = null; render(); const s = $("#slots .slot:not([disabled])"); s && s.focus({ preventScroll: true }); });
    $("#slots").addEventListener("click", (e) => { const b = e.target.closest(".slot"); if (!b || b.disabled) return; state.time = Number(b.dataset.t); render(); });

    // Summary
    function renderSummary() {
      const svcs = state.services.map((id) => D.services.find((s) => s.id === id));
      const sty = state.stylist === "any" ? "First available" : D.team.find((m) => m.id === state.stylist).name;
      const when = state.date ? DOW[parseYmd(state.date).getDay()] + ", " + MON[parseYmd(state.date).getMonth()] + " " + parseYmd(state.date).getDate() + (state.time != null ? " · " + fmtTime(state.time) : "") : "—";
      $("#sum").innerHTML = "<dt>Services</dt><dd>" + (svcs.length ? svcs.map((s) => esc(s.name)).join("<br>") : "—") + "</dd><dt>Stylist</dt><dd>" + esc(sty) + "</dd><dt>When</dt><dd>" + when + "</dd><dt>Duration</dt><dd>" + (svcs.length ? "About " + fmtDur(totalMins()) : "—") + "</dd>";
      $("#sum-total").textContent = svcs.length ? money(totalPrice()) : "$0";
    }

    function canNext(i) {
      if (i === 0) return state.services.length > 0;
      if (i === 1) return !!state.stylist;
      if (i === 2) return !!state.date && state.time != null;
      return true;
    }
    function render() {
      if (stepIdx === 1) renderStylists();
      if (stepIdx === 2) renderCal();
      steps.forEach((s, i) => s.classList.toggle("cur", i === stepIdx));
      prog.forEach((p, i) => { p.classList.toggle("cur", i === stepIdx); p.classList.toggle("done", i < stepIdx); if (i === stepIdx) p.setAttribute("aria-current", "step"); else p.removeAttribute("aria-current"); });
      $$("[data-next]", root).forEach((b) => (b.disabled = !canNext(stepIdx)));
      renderSummary();
    }
    function go(i) {
      stepIdx = i; render();
      const h = $(".bstep.cur h2", root); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      const top = root.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    }
    $$("[data-next]", root).forEach((b) => b.addEventListener("click", () => canNext(stepIdx) && go(stepIdx + 1)));
    $$("[data-back]", root).forEach((b) => b.addEventListener("click", () => go(stepIdx - 1)));

    // Step 4: details + submit
    const look = q.get("look");
    if (look) $("#b-notes").value = "Inspired by: " + look;
    $("#book-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate(e.target)) return;
      const f = Object.fromEntries(new FormData(e.target));
      let stylist = state.stylist;
      if (stylist === "any") {
        const dow = parseYmd(state.date).getDay(), len = Math.max(totalMins(), 30);
        const free = D.team.find((m) => m.days.includes(dow) && !booked().some((b) => b.date === state.date && b.status !== "cancelled" && b.stylist === m.id && state.time < b.start + b.mins && b.start < state.time + len));
        stylist = free ? free.id : "any";
      }
      const ref = "CZ-" + Math.random().toString(36).slice(2, 6).toUpperCase() + String(Date.now()).slice(-3);
      const bk = { ref, services: state.services, stylist, date: state.date, start: state.time, mins: Math.max(totalMins(), 30), price: totalPrice(), name: f.name, email: f.email, phone: f.phone, notes: f.notes || "", status: "requested", at: new Date().toISOString() };
      const btn = $("button[type=submit]", e.target); btn.disabled = true;
      const ok = await send(D.bookingEndpoint, bk);
      btn.disabled = false;
      if (!ok) { toast("We couldn't reach the salon — please call " + D.phone + "."); return; }
      const all = booked(); all.push(bk); store.set("cortez.bookings", all);
      showConfirm(bk);
    });

    function stylistName(id) { return id === "any" ? "First available" : D.team.find((m) => m.id === id).name; }
    function ics(bk) {
      const d = parseYmd(bk.date), pad = (n) => String(n).padStart(2, "0");
      const st = (mins) => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(Math.floor(mins / 60)) + pad(mins % 60) + "00";
      const names = bk.services.map((id) => D.services.find((s) => s.id === id).name).join(", ");
      const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Cortez Hair Salon//Booking//EN", "BEGIN:VEVENT", "UID:" + bk.ref + "@cortez", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
        "DTSTART;TZID=" + D.timeZone + ":" + st(bk.start), "DTEND;TZID=" + D.timeZone + ":" + st(bk.start + bk.mins), "SUMMARY:" + names + " — Cortez Hair Salon",
        "DESCRIPTION:Ref " + bk.ref + " · with " + stylistName(bk.stylist) + ". To change\\, call " + D.phone + ".", "LOCATION:Cortez Hair Salon\\, " + D.address.join("\\, "),
        "BEGIN:VALARM", "TRIGGER:-PT24H", "ACTION:DISPLAY", "DESCRIPTION:Cortez appointment tomorrow", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      return URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    }
    function showConfirm(bk) {
      const d = parseYmd(bk.date);
      root.innerHTML = '<div class="confirm" role="status"><div class="confirm__seal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg></div>' +
        '<span class="eyebrow">Request received</span><h2 class="h2" tabindex="-1">See you soon, <em>' + esc(bk.name.split(" ")[0]) + "</em>.</h2>" +
        '<p class="lede" style="margin:24px auto 10px">' + DOW[d.getDay()] + ", " + MON[d.getMonth()] + " " + d.getDate() + " at " + fmtTime(bk.start) + " with " + esc(stylistName(bk.stylist)) + ". We'll confirm by text or email within a few business hours.</p>" +
        '<p class="confirm__ref">' + bk.ref + "</p>" +
        '<div class="bnav"><a class="btn" download="cortez-appointment.ics" href="' + ics(bk) + '">Add to calendar</a><a class="btn btn--ghost" href="index.html">Back home</a></div></div>';
      $(".confirm h2", root).focus();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      renderMine();
    }

    function renderMine() {
      const box = $("#mybook"); if (!box) return;
      const today = salonNow().date;
      const list = booked().filter((b) => b.date >= today && b.status !== "cancelled").sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
      if (!list.length) { box.hidden = true; return; }
      box.hidden = false;
      $("#mybook-list").innerHTML = list.map((b) => { const d = parseYmd(b.date); return '<div class="mybook__item"><div><b>' + b.services.map((id) => esc(D.services.find((s) => s.id === id).name)).join(" + ") + "</b><small>" + DOW[d.getDay()] + ", " + MON[d.getMonth()] + " " + d.getDate() + " · " + fmtTime(b.start) + " · " + esc(stylistName(b.stylist)) + " · " + b.ref + '</small></div><button class="btn btn--ghost btn--sm" type="button" data-cancel="' + b.ref + '">Cancel</button></div>'; }).join("");
    }
    $("#mybook") && $("#mybook").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cancel]"); if (!b) return;
      if (!confirm("Cancel this appointment request?")) return;
      store.set("cortez.bookings", booked().map((x) => (x.ref === b.dataset.cancel ? { ...x, status: "cancelled" } : x)));
      renderMine(); toast("Appointment cancelled. The time is free again.");
      if ($("#cal-grid")) renderCal();
    });

    if (state.services.length) stepIdx = q.get("stylist") ? 2 : 1;
    else if (q.get("stylist")) stepIdx = 0;
    render(); renderMine();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    chrome();
    servicesPage();
    teamPage();
    galleryPage();
    contactPage();
    bookingPage();
    paintArt();
    reveal();
  });
})();
