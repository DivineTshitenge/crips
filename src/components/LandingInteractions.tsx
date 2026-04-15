"use client";

import { useEffect } from "react";

/**
 * Reprend les interactions/animations du site statique (menu, FAQ, scroll, counters)
 * en version compatible Next.js (client component).
 */
export default function LandingInteractions() {
  useEffect(() => {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    const onHamburgerClick = () => {
      hamburger?.classList.toggle("active");
      navMenu?.classList.toggle("active");
    };

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const isClickInsideNav = !!navMenu?.contains(target);
      const isClickOnHamburger = !!hamburger?.contains(target);

      if (!isClickInsideNav && !isClickOnHamburger && navMenu?.classList.contains("active")) {
        hamburger?.classList.remove("active");
        navMenu?.classList.remove("active");
      }
    };

    const onScrollNavbar = () => {
      const navbar = document.getElementById("navbar");
      if (!navbar) return;
      navbar.style.boxShadow =
        window.scrollY > 50 ? "0 4px 15px rgba(0, 0, 0, 0.3)" : "0 2px 10px rgba(0, 0, 0, 0.2)";
    };

    const closeMobileMenu = () => {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
    };

    // Hamburger
    hamburger?.addEventListener("click", onHamburgerClick);

    // Fermer menu mobile quand clique sur lien
    const navLinks = navMenu?.querySelectorAll("a") ?? [];
    navLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

    // Fermer menu quand clique dehors
    document.addEventListener("click", onDocClick);

    // Navbar scroll
    window.addEventListener("scroll", onScrollNavbar, { passive: true });

    // Intersection Observer pour fade-in
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.transitionDelay = `${index * 0.1}s`;
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll<HTMLElement>(".fade-in");
    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      fadeObserver.observe(el);
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll<HTMLElement>(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector<HTMLButtonElement>(".faq-question");
      if (!question) return;
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((other) => {
          if (other !== item) other.classList.remove("active");
        });
        item.classList.toggle("active", !isActive);
      });
    });

    // Smooth scroll ancres (home : #section ; depuis blog : /#section → navigation laissée à Next si hors home)
    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]:not([href="#"]), a[href^="/#"]'
    );
    const onAnchorClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      let href = a.getAttribute("href") ?? "";
      if (href === "#" || href === "#!") return;
      let hash = href;
      if (href.startsWith("/#")) {
        hash = href.slice(1);
      }
      if (!hash.startsWith("#")) return;
      if (window.location.pathname !== "/") {
        return;
      }
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      closeMobileMenu();
    };
    anchorLinks.forEach((a) => a.addEventListener("click", onAnchorClick));

    // Active nav on scroll (uniquement sur la page d'accueil)
    const onScrollActiveNav = () => {
      if (window.location.pathname !== "/") return;
      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      const links = document.querySelectorAll<HTMLAnchorElement>('.nav-menu a[href^="#"]');
      let current = "";
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 100) current = section.id;
      });
      links.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
      });
    };
    window.addEventListener("scroll", onScrollActiveNav, { passive: true });
    onScrollActiveNav();
    requestAnimationFrame(() => onScrollActiveNav());

    // Parallax hero background
    const onScrollParallax = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      const scrolled = window.pageYOffset;
      if (!hero || scrolled >= window.innerHeight) return;
      const heroBg = hero.querySelector<HTMLElement>(".hero-background");
      if (!heroBg) return;
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.5}px)`;
    };
    window.addEventListener("scroll", onScrollParallax, { passive: true });

    // Counter animation pour stats
    const animateCounter = (
      element: HTMLElement,
      target: number,
      duration = 2000,
      suffix = "",
      prefix = ""
    ) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = window.setInterval(() => {
        start += increment;
        if (start >= target) {
          element.textContent = `${prefix}${target}${suffix}`;
          window.clearInterval(timer);
        } else {
          element.textContent = `${prefix}${Math.floor(start)}${suffix}`;
        }
      }, 16);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target as HTMLElement;
          if (card.classList.contains("counted")) return;
          card.classList.add("counted");
          const numberEl = card.querySelector<HTMLElement>(".stat-number");
          if (!numberEl) return;
          const raw = numberEl.textContent ?? "";
          const num = parseInt(raw.replace(/\\D/g, ""), 10);
          if (!Number.isFinite(num) || num <= 0) return;
          const prefix = raw.trim().startsWith("+") ? "+" : "";
          const suffix = raw.includes("%") ? "%" : "+";
          if (prefix) {
            numberEl.textContent = `${prefix}0`;
            animateCounter(numberEl, num, 2000, "", prefix);
          } else {
            numberEl.textContent = `0${suffix}`;
            animateCounter(numberEl, num, 2000);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll<HTMLElement>(".stats-card").forEach((card) => statsObserver.observe(card));

    // Animation des barres + pourcentages (Écoute/Suivi/Résultats)
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const metrics = entry.target as HTMLElement;
          if (metrics.classList.contains("stats-animated")) return;
          metrics.classList.add("stats-animated");

          const bars = metrics.querySelectorAll<HTMLElement>(".stats-progress i");
          bars.forEach((bar) => {
            const inlineWidth = bar.style.width || "0%";
            const target = Number.parseInt(inlineWidth.replace(/\D/g, ""), 10);
            bar.style.width = "0%";
            bar.style.transition = "width 1.2s ease";
            window.requestAnimationFrame(() => {
              bar.style.width = `${Number.isFinite(target) ? target : 0}%`;
            });
          });

          const values = metrics.querySelectorAll<HTMLElement>(".stats-progress-list strong");
          values.forEach((value, index) => {
            const target = Number.parseInt((value.textContent ?? "").replace(/\D/g, ""), 10);
            value.textContent = "0%";
            window.setTimeout(() => {
              if (Number.isFinite(target) && target > 0) {
                animateCounter(value, target, 900, "%");
              }
            }, index * 140);
          });
        });
      },
      { threshold: 0.45 }
    );

    document
      .querySelectorAll<HTMLElement>(".stats-card-metrics")
      .forEach((el) => metricsObserver.observe(el));

    // Escape key: fermer menu + FAQ
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (navMenu?.classList.contains("active")) {
        closeMobileMenu();
        (hamburger as HTMLButtonElement | null)?.focus?.();
      }
      const activeFaq = document.querySelector<HTMLElement>(".faq-item.active");
      activeFaq?.classList.remove("active");
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      hamburger?.removeEventListener("click", onHamburgerClick);
      navLinks.forEach((link) => link.removeEventListener("click", closeMobileMenu));
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("scroll", onScrollNavbar);
      window.removeEventListener("scroll", onScrollActiveNav);
      window.removeEventListener("scroll", onScrollParallax);
      document.removeEventListener("keydown", onKeyDown);
      anchorLinks.forEach((a) => a.removeEventListener("click", onAnchorClick));
      fadeObserver.disconnect();
      statsObserver.disconnect();
      metricsObserver.disconnect();
    };
  }, []);

  return null;
}

