document.addEventListener("DOMContentLoaded", () => {
// 1. Light Mode / Dark Mode
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".moon-icon");

function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-mode", isLight);

    if (themeIcon) {
        themeIcon.textContent = isLight ? "☀" : "☾";
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark mode" : "Switch to light mode"
        );

        themeToggle.setAttribute("aria-pressed", String(isLight));
    }
}

try {
    applyTheme(localStorage.getItem("amir-theme") || "dark");
} catch (error) {
    applyTheme("dark");
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("light-mode")
            ? "dark"
            : "light";

        applyTheme(newTheme);

        try {
            localStorage.setItem("amir-theme", newTheme);
        } catch (error) {
            // Theme switching works even if storage is unavailable.
        }
    });
}

// 2. Scroll Reveal Animations
const revealElements = document.querySelectorAll(`
    #home .home-content,
    #home .home-image,
    #projects .section-heading,
    #projects .view-all,
    .project-card,
    #skills .section-heading,
    .skill-card,
    #contact .section-heading,
    #contact .contact-info,
    #contact .contact-cta,
    #footer .container
`);

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element, index) => {
        element.classList.add("js-reveal");

        if (
            element.classList.contains("project-card") ||
            element.classList.contains("skill-card")
        ) {
            element.style.setProperty(
                "--reveal-delay",
                `${(index % 5) * 90}ms`
            );
        }

        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}

// 3. Header Scroll Effect
const header = document.querySelector("#header");

function updateHeader() {
    if (header) {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
}

let scrollScheduled = false;

function handleScroll() {
    if (scrollScheduled) return;

    scrollScheduled = true;

    window.requestAnimationFrame(() => {
        updateHeader();
        scrollScheduled = false;
    });
}

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", handleScroll);

updateHeader();

// 4. Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start"
        });
    });
});

});