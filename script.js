“use strict”;

document.addEventListener(“DOMContentLoaded”, () => {
const prefersReducedMotion = window.matchMedia(
“(prefers-reduced-motion: reduce)”
).matches;

document.documentElement.classList.add("js-enabled");
const yearElement = document.querySelector("#year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
const typingElement = document.querySelector("#typing-text");
if (typingElement) {
    const phrases = [
        "Desenvolvedor Front-end",
        "Estudante de Informática",
        "Desenvolvedor Web",
        "Montagem e manutenção de PCs"
    ];
    if (prefersReducedMotion) {
        typingElement.textContent = phrases[0];
    } else {
        let phraseIndex = 0;
        let charIndex = phrases[0].length;
        let deleting = true;
        let timeoutId;
        function typeEffect() {
            const phrase = phrases[phraseIndex];
            charIndex += deleting ? -1 : 1;
            typingElement.textContent = phrase.slice(
                0,
                Math.max(0, charIndex)
            );
            let delay = deleting ? 35 : 75;
            if (!deleting && charIndex >= phrase.length) {
                deleting = true;
                delay = 1600;
            } else if (deleting && charIndex <= 0) {
                charIndex = 0;
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 350;
            }
            timeoutId = setTimeout(typeEffect, delay);
        }
        timeoutId = setTimeout(typeEffect, 1800);
        document.addEventListener("visibilitychange", () => {
            clearTimeout(timeoutId);
            if (!document.hidden) {
                timeoutId = setTimeout(typeEffect, 300);
            }
        });
    }
}
const revealElements = document.querySelectorAll(
    ".reveal, .project-card, .skill-card"
);
if (prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add("revealed");
    });
} else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );
    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("revealed");
    });
}
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
        card.classList.add("hovered");
    });
    card.addEventListener("pointerleave", () => {
        card.classList.remove("hovered");
    });
    card.addEventListener("focusin", () => {
        card.classList.add("hovered");
    });
    card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) {
            card.classList.remove("hovered");
        }
    });
});
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
    const updateBackToTop = () => {
        backToTop.classList.toggle(
            "visible",
            window.scrollY > 350
        );
    };
    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });
    updateBackToTop();
    backToTop.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });
}
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") {
            return;
        }
        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }
        event.preventDefault();
        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });
        history.replaceState(null, "", targetId);
    });
});
const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
if (menuButton && navMenu) {
    menuButton.setAttribute("aria-expanded", "false");
    function closeMenu() {
        navMenu.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
    }
    menuButton.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");
        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });
    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuButton.focus();
        }
    });
    document.addEventListener("click", (event) => {
        if (
            !navMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeMenu();
        }
    });
}
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(
    '.nav-menu a[href^="#"]'
);
if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                const sectionId = entry.target.id;
                navLinks.forEach((link) => {
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );
    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}
document.dispatchEvent(new CustomEvent("portfolio:ready"));
console.info("Portfólio Ray Enio carregado com sucesso.");

});