// Sticky header offset for anchor scrolling
const header = document.querySelector(".navwrap");

function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;

  // HOME should always go to absolute top
  if (hash === "#home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const y = el.getBoundingClientRect().top + window.pageYOffset;
  const offset = header ? header.offsetHeight : 0;

  window.scrollTo({
    top: y - offset - 6,
    behavior: "smooth"
  });
}


// Mobile menu toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // close menu when clicking a link
  navLinks.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
}

// Intercept same-page anchor clicks to apply offset
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const hash = a.getAttribute("href");
  if (!hash || hash === "#") return;

  // allow external "#" links in footer if you keep them
  if (!document.querySelector(hash)) return;

  e.preventDefault();
  history.pushState(null, "", hash);
  scrollToHash(hash);
});

// On page load with a hash
window.addEventListener("load", () => {
  if (location.hash) scrollToHash(location.hash);
});

// Active nav link highlighting (based on scroll position)
const sections = ["#home", "#services", "#rentals", "#about", "#contact"]
  .map((id) => document.querySelector(id))
  .filter(Boolean);

const navA = Array.from(document.querySelectorAll(".nav__link"));

function setActive(id) {
  navA.forEach((a) => {
    const match = a.getAttribute("href") === id;
    a.classList.toggle("is-active", match);
  });
}

function onScroll() {
  const offset = (header?.offsetHeight || 0) + 20;
  const y = window.scrollY + offset;

  let current = "#home";
  for (const s of sections) {
    if (s.offsetTop <= y) current = "#" + s.id;
  }
  setActive(current);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// REAL form handler – sends data to /api/quote
const form = document.getElementById("quoteForm");
const note = document.getElementById("formNote");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    note.textContent = "Sending...";

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error("Failed");
      }

      note.textContent = "Thanks! Your request has been sent. We’ll contact you shortly.";
      form.reset();
    } catch (err) {
      console.error(err);
      note.textContent =
        "Sorry, something went wrong. Please email maxgenpower@gmail.com directly.";
    }
  });
}

// Demo form handler (replace with your backend/email service)
//const form = document.getElementById("quoteForm");
//const note = document.getElementById("formNote");

//if (form) {
 // form.addEventListener("submit", (e) => {
  //  e.preventDefault();
 //   const data = Object.fromEntries(new FormData(form).entries());

 //   console.log("Quote request:", data);
//    note.textContent = "Thanks! We received your request. (Connect this to email or a backend next.)";
//    form.reset();
//  });
//}

