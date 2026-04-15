"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Barre de navigation du site (accueil + pages blog).
 * Les ancres utilisent # sur la home et /#section depuis le blog.
 */
export default function SiteNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBlog = pathname?.startsWith("/blog") ?? false;

  const homeHref = isHome ? "#home" : "/#home";
  const aboutHref = isHome ? "#about" : "/#about";
  const servicesHref = isHome ? "#services" : "/#services";
  const reviewsHref = isHome ? "#reviews" : "/#reviews";
  const contactHref = isHome ? "#contact" : "/#contact";

  return (
    <nav className="navbar" id="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <Link href="/" className="logo">
            <img
              src="/logo-crips.png"
              alt="Logo CRIPS"
              className="logo-icon logo-image"
            />
            <span className="logo-text">CRIPS</span>
          </Link>
          <button className="hamburger" id="hamburger" type="button" aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
          <ul className="nav-menu" id="navMenu">
            <li>
              <Link href={homeHref}>Accueil</Link>
            </li>
            <li>
              <Link href={aboutHref}>À propos</Link>
            </li>
            <li>
              <Link href={servicesHref}>Services</Link>
            </li>
            <li>
              <Link href={reviewsHref}>Avis</Link>
            </li>
            <li>
              <Link href="/blog" className={isBlog ? "active" : undefined}>
                Blog
              </Link>
            </li>
            <li>
              <Link href={contactHref}>Contact</Link>
            </li>
          </ul>
          <div className="nav-actions">
            <Link href={contactHref} className="btn-nav-cta">
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
