import type { Metadata } from "next";
import LandingInteractions from "@/components/LandingInteractions";
import SiteNavbar from "@/components/SiteNavbar";
import { HomeViewTracker } from "@/components/analytics/ViewTrackers";
import ContactRequestForm from "@/components/contact/ContactRequestForm";
import {
  HeartHandshake,
  ShieldCheck,
  UserRoundCheck,
  Sparkles,
  Clock3,
  MessageCircleHeart,
  Check,
  ClipboardList,
  AlarmClock,
  HandHeart,
  Camera,
  MessageCircle,
  Music2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Psychologue à Kinshasa | Consultations et thérapies | CRIPS",
  description:
    "Besoin d'un psychologue à Kinshasa ? Le CRIPS propose consultations psychologiques, thérapie individuelle, thérapie de couple et accompagnement familial.",
  keywords: [
    "psychologue à kinshasa",
    "consultation psychologique kinshasa",
    "thérapie individuelle kinshasa",
    "thérapie de couple kinshasa",
    "accompagnement familial kinshasa",
    "cabinet psychologie kinshasa",
    "centre santé mentale kinshasa",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Psychologue à Kinshasa | CRIPS",
    description:
      "Consultations psychologiques et accompagnement thérapeutique à Kinshasa pour enfants, adolescents, adultes, couples et familles.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/hero-therapy-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Accompagnement psychologique CRIPS Kinshasa",
      },
    ],
  },
};

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "CRIPS Kinshasa",
    description:
      "Centre de recherche et d'interventions psychologiques et sociales à Kinshasa.",
    areaServed: "Kinshasa",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/ Kintambo, Q/ Nganda, Av. Pintade n°5",
      addressLocality: "Kinshasa",
      addressCountry: "CD",
    },
    telephone: "+243818787174",
    email: "benmak265@gmail.com",
    image: "/logo-crips.png",
    url: "/",
  };

  return (
    <>
      {/* Interactions/animations (menu, FAQ, counters, etc.) */}
      <LandingInteractions />
      <HomeViewTracker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <SiteNavbar />

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-background">
          <div className="hero-image-overlay" />
        </div>
        <div className="hero-shape hero-shape-left" aria-hidden="true" />
        <div className="hero-shape hero-shape-right" aria-hidden="true" />
        <div className="container">
          <div className="hero-content-wrapper">
            <div className="hero-tags">
              <span className="hero-tag">Gagnez en clarté</span>
              <span className="hero-tag">Gérer le stress</span>
            </div>
            <h1 className="hero-title">
              Un accompagnement psychologique de qualité centré sur vous.
            </h1>
            <p className="hero-description">
              Reprenez le contrôle de votre bien-être et avancez avec plus de
              clarté, d&apos;équilibre et de sérénité au quotidien.
            </p>
            <div className="hero-cta-group">
              <a href="#contact" className="btn btn-hero-cta">
                Contacter un psy
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-intro fade-in">
            <h2>
              Nous vous aidons à retrouver
              <br /> clarté, équilibre et sérénité.
            </h2>
          </div>

          <div className="stats-showcase">
            <article className="stats-card-gradient fade-in">
              <div className="stats-icon-circle">✚</div>
              <h3>Excellence dans l&apos;accompagnement</h3>
              <a href="#contact">Réserver un appel</a>
            </article>

            <article className="stats-card-image fade-in" aria-hidden="true">
              <img
                src="https://images.pexels.com/photos/5336961/pexels-photo-5336961.jpeg"
                alt="Consultation psychologique"
              />
            </article>

            <article className="stats-card-metrics fade-in">
              <div className="stats-card stat-card-inline">
                <h3 className="stat-number">+3</h3>
                <p className="stat-label">Années d&apos;expérience</p>
              </div>
              <div className="stats-card stat-card-inline">
                <h3 className="stat-number">95%</h3>
                <p className="stat-label">Clients satisfaits</p>
              </div>
              <div className="stats-progress-list">
                <div>
                  <span>Écoute</span>
                  <div className="stats-progress"><i style={{ width: "90%" }} /></div>
                  <strong>90%</strong>
                </div>
                <div>
                  <span>Suivi</span>
                  <div className="stats-progress"><i style={{ width: "85%" }} /></div>
                  <strong>85%</strong>
                </div>
                <div>
                  <span>Résultats</span>
                  <div className="stats-progress"><i style={{ width: "75%" }} /></div>
                  <strong>75%</strong>
                </div>
              </div>
            </article>
          </div>
          <div className="stats-description stats-description-bottom fade-in">
            <p>
              Au CRIPS, nous nous engageons à aider
              les individus à mener des vies plus épanouissantes. Nos thérapeutes
              agréés apportent empathie, compassion et expertise professionnelle
              à chaque consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="reasons-section" id="about">
        <div className="container">
          <h2 className="section-title fade-in">
            <span className="reasons-title-animated">
              La mission du CRIPS
              <br /> en psychologie clinique
            </span>
          </h2>
          <div className="reasons-flow">
            <article className="reason-flow-item reason-flow-left fade-in">
              <div className="reason-flow-icon">
                <UserRoundCheck size={22} />
              </div>
              <h3>Services spécialisés en psychologie clinique</h3>
              <p>
                Offrir des services spécialisés pour l&apos;évaluation, le
                diagnostic et la prise en charge des troubles psychologiques.
              </p>
            </article>
            <article className="reason-flow-item reason-flow-right fade-in">
              <div className="reason-flow-icon">
                <ShieldCheck size={22} />
              </div>
              <h3>Recherche scientifique appliquée</h3>
              <p>
                Mener des recherches scientifiques pour améliorer la
                compréhension des troubles psychologiques et développer des
                interventions thérapeutiques adaptées.
              </p>
            </article>
            <article className="reason-flow-item reason-flow-left fade-in">
              <div className="reason-flow-icon">
                <HeartHandshake size={22} />
              </div>
              <h3>Production et diffusion des connaissances</h3>
              <p>
                Contribuer à la production et à la diffusion des savoirs à
                travers des ouvrages, articles scientifiques et travaux de
                recherche.
              </p>
            </article>
            <article className="reason-flow-item reason-flow-right fade-in">
              <div className="reason-flow-icon">
                <Sparkles size={22} />
              </div>
              <h3>Expertise au service des institutions</h3>
              <p>
                Mettre l&apos;expertise en psychologie clinique au service des
                hôpitaux, parquets et autres structures nécessitant une
                évaluation ou une intervention spécialisée.
              </p>
            </article>
            <article className="reason-flow-item reason-flow-left fade-in">
              <div className="reason-flow-icon">
                <Clock3 size={22} />
              </div>
              <h3>Formation et développement des compétences</h3>
              <p>
                Participer à la formation et au développement des compétences
                dans le domaine de la psychologie clinique.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section" id="services">
        <div className="services-shell">
          <div className="services-highlight fade-in">
            <div className="services-highlight-content">
              <h2 className="services-highlight-title">
                Types de consultations proposées
              </h2>
              <p className="services-highlight-text">
                Le CRIPS propose des consultations spécialisées adaptées aux
                besoins cliniques, scolaires, familiaux et institutionnels.
              </p>
              <ul className="services-highlight-list">
                <li>
                  <Check size={18} />
                  <span>Consultation individuelle</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Thérapie de couple</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Évaluation psychologique</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Thérapie familiale</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Attestation psychologique</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Refus scolaire et difficulté d&apos;apprentissage</span>
                </li>
              </ul>
              <a href="#contact" className="btn services-highlight-btn">
                Prendre rendez-vous
              </a>
            </div>

            <div className="services-highlight-visual" aria-hidden="true">
              <div className="phone-mockup">
                <div className="phone-notch" />
                <div className="phone-image-slides">
                  <img
                    src="/consult-slide-individuelle.png"
                    alt="Thérapie individuelle"
                    className="phone-image phone-image-1"
                  />
                  <img
                    src="/consult-slide-couple.png"
                    alt="Thérapie de couple"
                    className="phone-image phone-image-2"
                  />
                  <img
                    src="/consult-slide-familiale.png"
                    alt="Thérapie familiale"
                    className="phone-image phone-image-3"
                  />
                  <img
                    src="https://images.pexels.com/photos/5699431/pexels-photo-5699431.jpeg"
                    alt="Évaluation psychologique"
                    className="phone-image phone-image-4"
                  />
                  <img
                    src="/consult-slide-attestation.png"
                    alt="Attestation psychologique"
                    className="phone-image phone-image-5"
                  />
                  <img
                    src="/consult-slide-refus-scolaire.png"
                    alt="Refus scolaire et apprentissage"
                    className="phone-image phone-image-6"
                  />
                </div>
                <div className="phone-info-card">
                  <div className="phone-slides">
                    <div className="phone-slide phone-slide-1">
                      <h3>Thérapie individuelle</h3>
                      <p>
                        Séances en tête-à-tête pour travailler l&apos;anxiété, le
                        stress, l&apos;estime de soi et les transitions de vie.
                      </p>
                    </div>
                    <div className="phone-slide phone-slide-2">
                      <h3>Thérapie de couple</h3>
                      <p>
                        Un cadre neutre pour améliorer la communication, résoudre
                        les conflits et reconstruire la confiance.
                      </p>
                    </div>
                    <div className="phone-slide phone-slide-3">
                      <h3>Thérapie familiale</h3>
                      <p>
                        Accompagnement du système familial pour restaurer
                        l&apos;équilibre, l&apos;écoute et des relations plus saines.
                      </p>
                    </div>
                    <div className="phone-slide phone-slide-4">
                      <h3>Évaluation psychologique</h3>
                      <p>
                        Bilans cliniques approfondis pour mieux comprendre le
                        fonctionnement psychologique et orienter la prise en charge.
                      </p>
                    </div>
                    <div className="phone-slide phone-slide-5">
                      <h3>Attestation psychologique</h3>
                      <p>
                        Rédaction d&apos;attestations selon le cadre clinique, après
                        évaluation professionnelle et entretien personnalisé.
                      </p>
                    </div>
                    <div className="phone-slide phone-slide-6">
                      <h3>Refus scolaire et apprentissage</h3>
                      <p>
                        Accompagnement ciblé des difficultés scolaires, du refus
                        scolaire et des troubles liés à l&apos;apprentissage.
                      </p>
                    </div>
                  </div>
                  <div className="phone-dots">
                    <span className="dot-1" />
                    <span className="dot-2" />
                    <span className="dot-3" />
                    <span className="dot-4" />
                    <span className="dot-5" />
                    <span className="dot-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <div className="values-flow fade-in">
            <h2 className="values-flow-title">Autonomiser votre parcours de santé mentale</h2>
            <p className="values-flow-subtitle">En trois étapes simples.</p>
            <div className="values-steps">
              <article className="values-step">
                <span className="values-step-badge">Étape 01</span>
                <div className="values-step-icon">
                  <ClipboardList size={58} strokeWidth={1.8} />
                </div>
                <h3>Dites-nous ce dont vous avez besoin</h3>
                <p>
                  Partagez vos préoccupations et nous vous orientons vers le
                  thérapeute adapté à votre situation.
                </p>
              </article>

              <article className="values-step">
                <span className="values-step-badge">Étape 02</span>
                <div className="values-step-icon">
                  <AlarmClock size={58} strokeWidth={1.8} />
                </div>
                <h3>Choisissez le créneau idéal</h3>
                <p>
                  Consultez les disponibilités de nos spécialistes et planifiez
                  votre séance en présentiel ou en ligne.
                </p>
              </article>

              <article className="values-step">
                <span className="values-step-badge">Étape 03</span>
                <div className="values-step-icon">
                  <HandHeart size={58} strokeWidth={1.8} />
                </div>
                <h3>Recevez des soins sans stress</h3>
                <p>
                  Bénéficiez d&apos;un accompagnement bienveillant, confidentiel et
                  progressif vers un meilleur équilibre émotionnel.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Événements & Rencontres */}
      <section className="events-section" id="events">
        <div className="container">
          <h2 className="section-title events-title fade-in">CRIPS Événements</h2>
          <div className="events-gallery-auto fade-in" aria-label="Galerie des événements CRIPS">
            <div className="events-gallery-auto-track">
              <figure className="event-image-item">
              <img
                  src="/events-crips-1.png"
                  alt="Stand CRIPS lors d'un événement"
                className="event-image"
              />
              </figure>

              <figure className="event-image-item">
              <img
                  src="/events-crips-2.png"
                  alt="Présentation des services CRIPS en public"
                className="event-image"
              />
              </figure>

              <figure className="event-image-item">
              <img
                  src="/events-crips-3.png"
                  alt="Participation communautaire autour du stand CRIPS"
                className="event-image"
              />
              </figure>

              <figure className="event-image-item">
                <img
                  src="/events-crips-1.png"
                  alt="Activité CRIPS en sensibilisation"
                  className="event-image"
                />
              </figure>

              <figure className="event-image-item">
                <img
                  src="/events-crips-2.png"
                  alt="Rencontre d'information CRIPS"
                  className="event-image"
                />
              </figure>

              <figure className="event-image-item">
                <img
                  src="/events-crips-3.png"
                  alt="Échange communautaire avec le CRIPS"
                  className="event-image"
                />
              </figure>

              {/* Duplication pour boucle visuelle continue */}
              <figure className="event-image-item" aria-hidden="true">
                <img
                  src="/events-crips-1.png"
                  alt=""
                  className="event-image"
                />
              </figure>
              <figure className="event-image-item" aria-hidden="true">
                <img
                  src="/events-crips-2.png"
                  alt=""
                  className="event-image"
                />
              </figure>
              <figure className="event-image-item" aria-hidden="true">
                <img
                  src="/events-crips-3.png"
                  alt=""
                  className="event-image"
                />
              </figure>
              <figure className="event-image-item" aria-hidden="true">
                <img
                  src="/events-crips-1.png"
                  alt=""
                  className="event-image"
                />
              </figure>
              <figure className="event-image-item" aria-hidden="true">
                <img
                  src="/events-crips-2.png"
                  alt=""
                  className="event-image"
                />
              </figure>
              <figure className="event-image-item" aria-hidden="true">
                <img
                  src="/events-crips-3.png"
                  alt=""
                  className="event-image"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="reviews">
        <div className="container">
          <div className="testimonials-showcase fade-in">
            <p className="testimonials-kicker">Témoignages</p>
            <div className="testimonials-track">
              <article className="testimonial-slide testimonial-slide-1">
                <div className="testimonial-profile">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                    alt="Photo de client"
                    className="testimonial-avatar"
                  />
                  <p className="testimonial-name">Michael Turner</p>
                  <p className="testimonial-stars">★★★★★</p>
                </div>
                <blockquote className="testimonial-quote">
                  « En tant que patient confronté à des défis émotionnels
                  persistants, je suis reconnaissant du soutien reçu. Leur écoute
                  attentive et leurs méthodes concrètes m&apos;ont aidé à retrouver
                  plus de stabilité et une meilleure qualité de vie. »
                </blockquote>
              </article>
              <article className="testimonial-slide testimonial-slide-2">
                <div className="testimonial-profile">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                    alt="Photo de cliente"
                    className="testimonial-avatar"
                  />
                  <p className="testimonial-name">Sophie M.</p>
                  <p className="testimonial-stars">★★★★★</p>
                </div>
                <blockquote className="testimonial-quote">
                  « Le suivi m&apos;a permis de mieux comprendre mes émotions et de
                  poser des limites plus saines. Je me sens plus confiante et
                  mieux outillée dans mon quotidien. »
                </blockquote>
              </article>
              <article className="testimonial-slide testimonial-slide-3">
                <div className="testimonial-profile">
                  <img
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
                    alt="Photo de client"
                    className="testimonial-avatar"
                  />
                  <p className="testimonial-name">Patrick K.</p>
                  <p className="testimonial-stars">★★★★★</p>
                </div>
                <blockquote className="testimonial-quote">
                  « Grâce à l&apos;accompagnement, notre communication de couple a
                  évolué de façon profonde. Nous avançons avec plus d&apos;écoute,
                  de respect et de sérénité. »
                </blockquote>
              </article>
            </div>
            <div className="testimonial-dots" aria-hidden="true">
              <span className="t-dot t-dot-1" />
              <span className="t-dot t-dot-2" />
              <span className="t-dot t-dot-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section" id="team">
        <div className="container">
          <h2 className="section-title fade-in">Notre équipe</h2>
          <p className="section-subtitle fade-in">
            Vous pouvez personnaliser le ton en fonction de l&apos;identité de
            marque du cabinet - qu&apos;il soit chaleureux et personnel,
            professionnel ou clinique.
          </p>
          <div className="team-slider fade-in">
            <article className="team-member-panel">
              <img
                src="https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg"
                alt="Dr. James Carter"
                className="team-member-photo"
              />
              <div className="team-member-content">
                <h3>
                  Psychologue{" "}
                  <span className="team-member-name-highlight">NGOMBA MAKABU BÉNÉDICTE</span>
                </h3>
                <p>
                  Licence en psychologie clinique à l&apos;Université de Kinshasa,
                  avec une spécialisation en prise en charge psychosociale
                  d&apos;urgence.
                </p>
                <div className="team-member-grid">
                  <div><span>Formation</span><strong>Licence en psychologie clinique (UNIKIN)</strong></div>
                  <div><span>Certification</span><strong>Prise en charge psychosociale d&apos;urgence</strong></div>
                  <div><span>Approche</span><strong>Thérapie intégrative / multimodale</strong></div>
                  <div><span>Méthodes</span><strong>TCC, hypnose, psychanalyse</strong></div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-intro fade-in">
              <p className="faq-kicker">FAQ</p>
              <h2>Tout ce que vous devez savoir aujourd&apos;hui</h2>
              <p>
                Parcourez ces questions fréquentes pour mieux comprendre notre
                accompagnement psychologique centré sur vos besoins.
              </p>
              <div className="faq-intro-actions">
                <a href="#team" className="faq-btn faq-btn-primary">
                  Voir l&apos;équipe
                </a>
                <a href="#contact" className="faq-btn faq-btn-light">
                  Contactez-nous
                </a>
              </div>
            </div>

            <div className="faq-grid">
            <div className="faq-item fade-in">
              <button className="faq-question" type="button">
                <span>Quels types de thérapie proposez-vous ?</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Nous proposons des consultations individuelles, de couple, des
                  évaluations psychologiques, des thérapies familiales, des
                  attestations psychologiques ainsi que l&apos;accompagnement du
                  refus scolaire et des difficultés d&apos;apprentissage. Les séances
                  sont disponibles au cabinet et à domicile.
                </p>
              </div>
            </div>

            <div className="faq-item fade-in">
              <button className="faq-question" type="button">
                <span>Comment réserver un rendez-vous ?</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Vous pouvez réserver un rendez-vous en nous contactant par téléphone,
                  email ou en utilisant notre formulaire de contact en ligne. Nous
                  vous répondrons dans les plus brefs délais.
                </p>
              </div>
            </div>

            <div className="faq-item fade-in">
              <button className="faq-question" type="button">
                <span>Proposez-vous une thérapie virtuelle/en ligne ?</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Oui, nous proposons des consultations en ligne pour votre commodité.
                  Les séances virtuelles sont aussi efficaces que les séances en
                  personne et offrent plus de flexibilité.
                </p>
              </div>
            </div>

            <div className="faq-item fade-in">
              <button className="faq-question" type="button">
                <span>La thérapie est-elle confidentielle ?</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Absolument. Toutes les séances de thérapie sont strictement
                  confidentielles. Nous respectons votre vie privée et suivons
                  tous les protocoles de confidentialité professionnels.
                </p>
              </div>
            </div>

            <div className="faq-item fade-in">
              <button className="faq-question" type="button">
                <span>Quelle est la durée moyenne d&apos;une séance ?</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>La durée moyenne d&apos;une séance est de 50 minutes à 1 heure.</p>
              </div>
            </div>

            <div className="faq-item fade-in">
              <button className="faq-question" type="button">
                <span>Combien coûte une séance ?</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Le tarif d&apos;une consultation est compris entre 25$ et 35$.
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="contact-panel fade-in">
            <div className="contact-form-side">
              <h2>Parlons ensemble</h2>
              <p>
                Remplissez ce formulaire pour planifier votre rendez-vous.
                Nous vous contacterons rapidement pour confirmer votre demande.
              </p>
              <ContactRequestForm />

              <div className="contact-socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href="https://wa.me/243818787174" target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="contact-visual-side" aria-hidden="true">
              <img
                src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg"
                alt="Docteure avec stéthoscope"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="container">
          <div className="final-cta-content fade-in">
            <img
              src="https://images.pexels.com/photos/8376278/pexels-photo-8376278.jpeg"
              alt="Psychologue"
              className="final-cta-avatar final-cta-avatar-tl"
            />
            <img
              src="https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg"
              alt="Psychologue"
              className="final-cta-avatar final-cta-avatar-tr"
            />
            <img
              src="https://images.pexels.com/photos/6749779/pexels-photo-6749779.jpeg"
              alt="Psychologue"
              className="final-cta-avatar final-cta-avatar-bl"
            />
            <img
              src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg"
              alt="Psychologue"
              className="final-cta-avatar final-cta-avatar-br"
            />
            <h2>Prêt(e) à faire le premier pas vers la guérison ?</h2>
            <p className="final-cta-subtitle">
              Découvrez des professionnels qualifiés et avancez dans votre
              parcours de santé mentale dans un cadre sûr et bienveillant.
            </p>
            <div className="final-cta-actions">
              <a href="#services" className="final-cta-btn final-cta-btn-light">
                Explorer les services
              </a>
              <a href="#contact" className="final-cta-btn final-cta-btn-glass">
                Réserver un appel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-panel">
            <div className="footer-content">
              <div className="footer-brand">
                <a href="#home" className="footer-logo">
                  <img
                    src="/logo-crips.png"
                    alt="Logo CRIPS"
                    className="footer-logo-dot footer-logo-image"
                  />
                  <span>CRIPS</span>
                </a>
                <p>
                  C/ Kintambo, Q/ Nganda, Av. Pintade n°5
                  <br />
                  Tél: 0818787174 | Email: benmak265@gmail.com
                  <br />
                  Du lundi au vendredi de 9h à 17h (sur rendez-vous)
                </p>
                <form className="footer-newsletter" action="#">
                  <input type="email" placeholder="Entrez votre e-mail" aria-label="Entrez votre e-mail" />
                  <button type="submit">Envoyer</button>
                </form>
              </div>

              <div className="footer-links">
                <h4>Navigation</h4>
                <ul>
                  <li><a href="#home">Accueil</a></li>
                  <li><a href="#about">À propos</a></li>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#team">Équipe</a></li>
                  <li><a href="#reviews">Témoignages</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>

              <div className="footer-socials">
                <h4>Réseaux sociaux</h4>
                <ul>
                  <li>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                      <span className="social-icon" aria-hidden="true">
                        <Camera size={14} />
                      </span>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/243818787174" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                      <span className="social-icon" aria-hidden="true">
                        <MessageCircle size={14} />
                      </span>
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
                      <span className="social-icon" aria-hidden="true">
                        <Music2 size={14} />
                      </span>
                      TikTok
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 Crips. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
