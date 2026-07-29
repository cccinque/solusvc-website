const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const slides = document.querySelectorAll(".slide");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  const activeSlide = [...slides].reduce((closest, slide) => {
    const distance = Math.abs(slide.getBoundingClientRect().top);
    return distance < closest.distance ? { slide, distance } : closest;
  }, { slide: slides[0], distance: Infinity }).slide;

  document.body.classList.toggle("is-logo-slide", activeSlide?.id === "home");
  document.body.classList.toggle("is-dark-slide", activeSlide?.classList.contains("investments-section"));
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
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
