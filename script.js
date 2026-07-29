const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const slides = document.querySelectorAll(".slide");

const routes = {
  home: { path: "/", title: "SOLVS Ventures" },
  "one-of-none": { path: "/", title: "SOLVS Ventures" },
  investments: { path: "/investments", title: "Investments | SOLVS Ventures" },
  company: { path: "/about-us", title: "About Us | SOLVS Ventures" },
  about: { path: "/team", title: "Team | SOLVS Ventures" },
  contact: { path: "/contact", title: "Contact | SOLVS Ventures" }
};

const pathToSlide = {
  "/": "home",
  "/investments": "investments",
  "/about-us": "company",
  "/team": "about",
  "/contact": "contact"
};

let navigationTarget = null;

const normalizedPath = () => {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path || "/";
};

const setRoute = (slideId, mode = "replace") => {
  const route = routes[slideId] || routes.home;
  const method = mode === "push" ? "pushState" : "replaceState";

  if (normalizedPath() !== route.path) {
    window.history[method]({ slideId }, "", route.path);
  }

  document.title = route.title;
};

const scrollToSlide = (slideId, behavior = "smooth") => {
  const target = document.getElementById(slideId);
  if (!target) return;

  navigationTarget = slideId;

  if (behavior === "auto") {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    target.scrollIntoView({ behavior: "auto", block: "start" });

    window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      navigationTarget = null;
      updateHeader();
    });
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    navigationTarget = null;
    updateHeader();
  }, 900);
};

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  const activeSlide = [...slides].reduce((closest, slide) => {
    const distance = Math.abs(slide.getBoundingClientRect().top);
    return distance < closest.distance ? { slide, distance } : closest;
  }, { slide: slides[0], distance: Infinity }).slide;

  document.body.classList.toggle("is-logo-slide", activeSlide?.id === "home");
  document.body.classList.toggle("is-dark-slide", activeSlide?.classList.contains("investments-section"));

  if (!navigationTarget && activeSlide?.id) {
    setRoute(activeSlide.id);
  }
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll("[data-route]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const slideId = link.dataset.route;
    if (!routes[slideId]) return;

    event.preventDefault();
    setRoute(slideId, "push");
    scrollToSlide(slideId);
  });
});

window.addEventListener("popstate", () => {
  const slideId = pathToSlide[normalizedPath()] || "home";
  scrollToSlide(slideId);
});

window.addEventListener("scroll", updateHeader, { passive: true });

const initialSlide = pathToSlide[normalizedPath()] || "home";
setRoute(initialSlide);
scrollToSlide(initialSlide, "auto");
updateHeader();
