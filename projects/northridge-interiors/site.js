/* ============================================================
   BUSINESS DETAILS — edit these and the whole site updates.
   ============================================================ */
const BUSINESS = {
  phone: "",            // e.g. "(306) 555-0123"
  email: "",            // e.g. "info@northridgeinteriors.ca" — quote requests go here
  area:  "",            // e.g. "Saskatoon & surrounding area"
  hours: "",            // e.g. "Mon–Sat · 7am – 6pm"
  // Optional: paste a Formspree (or similar) endpoint to receive quotes
  // without the customer's email app, e.g. "https://formspree.io/f/xxxxxxx"
  formEndpoint: ""
};

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Fill business details
  if (BUSINESS.phone) {
    const tel = "tel:" + BUSINESS.phone.replace(/[^\d+]/g, "");
    $$("[data-phone-link]").forEach(a => a.href = tel);
    $$("[data-phone]").forEach(el => el.textContent = BUSINESS.phone);
  } else {
    $$("[data-phone-link]").forEach(a => { a.href = "contact.html"; });
  }
  if (BUSINESS.email) {
    $$("[data-email-link]").forEach(a => a.href = "mailto:" + BUSINESS.email);
    $$("[data-email]").forEach(el => el.textContent = BUSINESS.email);
  } else {
    $$("[data-email-link]").forEach(a => { a.href = "contact.html"; });
  }
  if (BUSINESS.area) $$("[data-area]").forEach(el => el.textContent = BUSINESS.area);
  if (BUSINESS.hours) $$("[data-hours]").forEach(el => el.textContent = BUSINESS.hours);
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  // Mobile menu
  const btn = $(".menu-btn"), list = $("#nav-list");
  btn.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$("#nav-list a").forEach(a => a.addEventListener("click", () => {
    list.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
  }));

  // Scroll reveal
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$(".reveal").forEach(el => io.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));
  }

  // Quote form
  const form = $("#quote-form");
  if (form) {
  const setInvalid = (input, bad) => input.closest(".field").classList.toggle("invalid", bad);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const services = $$('input[name="services"]:checked', form).map(i => i.value);

    let ok = true;
    const badName = name.length < 2;
    const badPhone = phone.replace(/\D/g, "").length < 7;
    const badEmail = email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setInvalid(form.name, badName);
    setInvalid(form.phone, badPhone);
    setInvalid(form.email, badEmail);
    $("#services-error").style.display = services.length ? "none" : "block";
    if (badName || badPhone || badEmail || !services.length) ok = false;
    if (!ok) {
      const first = form.querySelector(".invalid input") || (!services.length && form.querySelector('input[name="services"]'));
      if (first) first.focus();
      return;
    }

    const data = {
      name, phone, email,
      location: form.city.value.trim(),
      services: services.join(", "),
      projectType: form.type.value,
      details: form.details.value.trim()
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    let sent = false;
    if (BUSINESS.formEndpoint) {
      try {
        const res = await fetch(BUSINESS.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        sent = res.ok;
      } catch (_) { sent = false; }
    }

    if (!sent && BUSINESS.email) {
      const body =
        `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || "-"}\n` +
        `Location: ${data.location || "-"}\nServices: ${data.services}\n` +
        `Project type: ${data.projectType}\n\nDetails:\n${data.details || "-"}`;
      window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Quote request — " + data.name)}&body=${encodeURIComponent(body)}`;
      $("#success-msg").textContent = "Your email app should open with the details filled in — just hit send and we'll be in touch.";
    } else if (!sent) {
      console.warn("Northridge: set BUSINESS.email or BUSINESS.formEndpoint so quote requests are delivered.");
    }

    form.classList.add("sent");
    submitBtn.disabled = false;
  });

  // Clear errors as user types
  ["name", "phone", "email"].forEach(n => form[n].addEventListener("input", () => setInvalid(form[n], false)));
  $$('input[name="services"]', form).forEach(i => i.addEventListener("change", () => $("#services-error").style.display = "none"));
  }
})();
