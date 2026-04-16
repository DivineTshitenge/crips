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
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.transitionDelay = `${index * 0.1}s`;
        } else {
          // On ne rejoue l'effet "glissement" que pour les sections demandées.
          const inAllowedSection =
            !!el.closest("section.values-section") ||
            !!el.closest("section.team-section") ||
            !!el.closest("section.faq-section");

          if (inAllowedSection) {
            // Réinitialise l'état pour rejouer l'animation à chaque retour dans la section.
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transitionDelay = "0s";
          }
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll<HTMLElement>(".fade-in");
    animatedElements.forEach((el) => {
      const inAllowedSection =
        !!el.closest("section.values-section") ||
        !!el.closest("section.team-section") ||
        !!el.closest("section.faq-section");

      if (inAllowedSection) {
        // On applique l'effet seulement sur les sections demandées.
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        fadeObserver.observe(el);
        return;
      }

      // Ailleurs, on enlève l'effet : on force l'état visible sans animation.
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      el.style.transition = "none";
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
      const href = a.getAttribute("href") ?? "";
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

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    // Parallax hero background
    const onScrollParallax = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      if (!hero) return;
      const scrolled = window.pageYOffset;
      if (scrolled >= window.innerHeight && !hero.classList.contains("hero-modern")) return;
      const heroBg = hero.querySelector<HTMLElement>(".hero-background");
      if (!heroBg) return;
      const heroRect = hero.getBoundingClientRect();
      const progress = clamp((window.innerHeight - heroRect.bottom) / window.innerHeight, 0, 1);

      // Effet au scroll : on "sort" doucement du hero vers la section suivante
      if (hero.classList.contains("hero-modern")) {
        hero.style.opacity = String(1 - progress * 0.12);
        hero.style.transform = `translateY(${progress * -10}px)`;

        const child = hero.querySelector<HTMLElement>(".hero-kid-front");
        if (child) {
          child.style.transform = `translateX(-50%) translateY(${progress * 14}px) scale(${1 - progress * 0.04})`;
        }
      }

      heroBg.style.transform = `scale(${1.04 + progress * 0.01}) translateY(${scrolled * 0.18}px)`;
    };
    window.addEventListener("scroll", onScrollParallax, { passive: true });

    // Animation titre au scroll (agrandir en remontant / rétrécir en descendant)
    const heroTitle = document.querySelector<HTMLElement>(".hero-title-anim");
    const onScrollHeroTitle = () => {
      if (!heroTitle) return;
      const hero = document.querySelector<HTMLElement>(".hero");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const dy = window.scrollY - lastScrollY;
      if (Math.abs(dy) < 3) return;

      const target = dy < 0 ? 1.12 : 0.95;
      currentScale += (target - currentScale) * 0.12;
      heroTitle.style.transform = `scale(${currentScale})`;

      lastScrollY = window.scrollY;
    };
    let lastScrollY = window.scrollY;
    let currentScale = 1;
    window.addEventListener("scroll", onScrollHeroTitle, { passive: true });
    onScrollHeroTitle();

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

    // Effet de transition entre sections au scroll
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            section.classList.add("section-in-view");
          } else {
            section.classList.remove("section-in-view");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-8% 0px -8% 0px",
      }
    );

    // Sur la homepage, il n'y a pas de <main>, donc on cible toutes les sections directement.
    const pageSections = document.querySelectorAll<HTMLElement>("section");
    pageSections.forEach((section) => {
      section.classList.add("section-scroll-fx");
      sectionObserver.observe(section);
    });

    // MISSIONS - glissement latéral gauche/droite (rejouable au passage et au retour)
    const missionCards = document.querySelectorAll<HTMLElement>(
      ".reasons-flow .reason-flow-item.mission-slide-left, .reasons-flow .reason-flow-item.mission-slide-right"
    );

    // Etat initial (au cas où l'effet est évalué avant IntersectionObserver)
    missionCards.forEach((el) => {
      el.style.transition = "none";
      el.style.opacity = "0";
      // CSS définit déjà translateX via --mission-x
      el.style.transform = "";
    });

    const missionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
            el.style.opacity = "1";
            // On revient à la position neutre pour que :
            // - mission-slide-left (x négatif) glisse vers la droite
            // - mission-slide-right (x positif) glisse vers la gauche
            el.style.transform = "translateX(0)";
            el.style.transitionDelay = `${idx * 0.06}s`;
          } else {
            // Reset instantané pour rejouer au retour (pas d'animation inverse)
            el.style.transition = "none";
            el.style.transitionDelay = "0s";
            el.style.opacity = "0";
            const isLeft = el.classList.contains("mission-slide-left");
            el.style.transform = isLeft ? "translateX(-46px)" : "translateX(46px)";
          }
        });
      },
      { threshold: 0.25 }
    );

    missionCards.forEach((el) => missionObserver.observe(el));

    // SERVICES - liste animée type par type (passage + retour)
    const servicesSection = document.querySelector<HTMLElement>("section.services-section");
    const servicesTypeItems = document.querySelectorAll<HTMLElement>(".services-type-item");

    servicesTypeItems.forEach((item) => {
      item.style.transition = "none";
      item.style.opacity = "0";
      item.style.transform = "translateY(18px)";
      item.style.transitionDelay = "0s";
    });

    const runServicesAnimation = (visible: boolean) => {
      if (!servicesTypeItems.length) return;

      if (visible) {
        servicesTypeItems.forEach((item, idx) => {
          item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
          item.style.transitionDelay = `${idx * 0.12}s`;
          // Déclenche après le changement de transition pour garantir l'effet.
          window.requestAnimationFrame(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          });
        });
      } else {
        // Reset instantané pour rejouer au retour.
        servicesTypeItems.forEach((item) => {
          item.style.transition = "none";
          item.style.transitionDelay = "0s";
          item.style.opacity = "0";
          item.style.transform = "translateY(18px)";
        });
      }
    };

    const servicesTypesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== servicesSection) return;
          runServicesAnimation(entry.isIntersecting);
        });
      },
      // Plus permissif pour éviter les cas où l'intersection ne se déclenche pas.
      { threshold: 0.1 }
    );

    if (servicesSection) {
      servicesTypesObserver.observe(servicesSection);
      // Check immédiat : si la section est déjà visible au moment du montage,
      // on lance l'animation sans attendre.
      const rect = servicesSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
      if (inView) runServicesAnimation(true);
    }

    // HERO CONTENT - animations rejouables (passage + retour)
    const heroTitleSlide = document.querySelector<HTMLElement>(".hero-modern-title-slide");
    const heroSubtext = document.querySelector<HTMLElement>(".hero-modern-subtext-rise");
    const heroHighlight = document.querySelector<HTMLElement>(".hero-modern-highlight-slide");

    const heroAnimatedItems: Array<{
      el: HTMLElement;
      hiddenTransform: string;
      visibleTransform: string;
      durationMs: number;
      delayMs: number;
    }> = [];

    if (heroTitleSlide) {
      heroTitleSlide.style.transition = "none";
      heroTitleSlide.style.opacity = "0";
      heroTitleSlide.style.transform = "translateX(-36px)";
      heroAnimatedItems.push({
        el: heroTitleSlide,
        hiddenTransform: "translateX(-36px)",
        visibleTransform: "translateX(0)",
        durationMs: 920,
        delayMs: 0,
      });
    }

    if (heroSubtext) {
      heroSubtext.style.transition = "none";
      heroSubtext.style.opacity = "0";
      heroSubtext.style.transform = "translateY(16px)";
      heroAnimatedItems.push({
        el: heroSubtext,
        hiddenTransform: "translateY(16px)",
        visibleTransform: "translateY(0)",
        durationMs: 860,
        delayMs: 140,
      });
    }

    if (heroHighlight) {
      heroHighlight.style.transition = "none";
      heroHighlight.style.opacity = "0";
      heroHighlight.style.transform = "translateX(-28px)";
      heroAnimatedItems.push({
        el: heroHighlight,
        hiddenTransform: "translateX(-28px)",
        visibleTransform: "translateX(0)",
        durationMs: 860,
        delayMs: 260,
      });
    }

    const heroHighlightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroAnimatedItems.forEach((item) => {
              item.el.style.transition = `opacity ${item.durationMs}ms ease, transform ${item.durationMs}ms ease`;
              item.el.style.transitionDelay = `${item.delayMs}ms`;
              item.el.style.opacity = "1";
              item.el.style.transform = item.visibleTransform;
            });
          } else {
            // Reset pour rejouer en revenant sur la section.
            heroAnimatedItems.forEach((item) => {
              item.el.style.transition = "none";
              item.el.style.transitionDelay = "0ms";
              item.el.style.opacity = "0";
              item.el.style.transform = item.hiddenTransform;
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    const heroTrigger = heroSubtext ?? heroHighlight ?? heroTitleSlide;
    if (heroTrigger) {
      heroHighlightObserver.observe(heroTrigger);
    }

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
      window.removeEventListener("scroll", onScrollHeroTitle);
      document.removeEventListener("keydown", onKeyDown);
      anchorLinks.forEach((a) => a.removeEventListener("click", onAnchorClick));
      fadeObserver.disconnect();
      statsObserver.disconnect();
      metricsObserver.disconnect();
      sectionObserver.disconnect();
      missionObserver.disconnect();
      servicesTypesObserver.disconnect();
      heroHighlightObserver.disconnect();
    };
  }, []);

  return null;
}

