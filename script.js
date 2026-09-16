const root = document.documentElement;
const header = document.querySelector(".site-header");
const navLinks = document.querySelector(".nav-links");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  root.dataset.theme = "light";
  themeIcon.textContent = "◑";
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  themeIcon.textContent = nextTheme === "light" ? "◑" : "◐";
  localStorage.setItem("portfolio-theme", nextTheme);
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-shell")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navigationItems = [...document.querySelectorAll(".nav-links a")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navigationItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-25% 0px -60%", threshold: [0.08, 0.25, 0.5] }
);

sections.forEach((section) => sectionObserver.observe(section));

const roles = [
  "إدارة المشاريع البرمجية",
  "منهجية Agile",
  "قيادة المنتجات الرقمية",
  "الإشراف على الفرق التقنية",
];
const typeTarget = document.querySelector(".type-text");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  const typeLoop = () => {
    const current = roles[roleIndex];
    typeTarget.textContent = current.slice(0, charIndex);

    if (deleting) {
      charIndex -= 1;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    } else {
      charIndex += 1;
      if (charIndex > roles[roleIndex].length) {
        deleting = true;
        window.setTimeout(typeLoop, 1400);
        return;
      }
    }

    window.setTimeout(typeLoop, deleting ? 45 : 75);
  };

  window.setTimeout(typeLoop, 1400);
}
