
import { useTranslation } from "react-i18next";

function Contact() {
  const { i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  const email = "enockkanyinda01@gmail.com";

  const linkedinUrl =
    "https://www.linkedin.com/in/enock-kanyinda-522921348";

  const githubUrl = "https://github.com/Nocknata";

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        <div className="contact-content">
          <p className="section-label">
            {isFrench ? "CONTACTEZ-MOI" : "GET IN TOUCH"}
          </p>

          <h2>
            {isFrench
              ? "Construisons quelque chose ensemble."
              : "Let's build something meaningful."}
          </h2>

          <p className="contact-description">
            {isFrench
              ? "Je suis ouvert aux opportunités de stage, aux collaborations en recherche et aux projets en science des données, apprentissage automatique et analyse de données de santé."
              : "I'm open to internship opportunities, research collaborations, and projects involving data science, machine learning, and healthcare analytics."}
          </p>

          {/* EMAIL BUTTON */}
          <div className="contact-actions">
            <a
              href={`mailto:${email}`}
              className="contact-primary-btn"
            >
              ✉️{" "}
              {isFrench
                ? "Envoyez-moi un email"
                : "Send Me an Email"}{" "}
              ↗
            </a>
          </div>

          {/* LINKEDIN & GITHUB */}
          <div className="contact-socials">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              aria-label="LinkedIn profile"
            >
              <span className="contact-social-icon">in</span>
              LinkedIn ↗
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              aria-label="GitHub profile"
            >
              <span className="contact-social-icon">⌘</span>
              GitHub ↗
            </a>
          </div>

          {/* EMAIL INFORMATION CARD */}
          <div className="contact-email-card">
            <span className="contact-email-icon">✉️</span>

            <div>
              <span className="contact-email-label">
                {isFrench
                  ? "Adresse email"
                  : "Email Address"}
              </span>

              <a href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="contact-footer">
          <p>
            © {new Date().getFullYear()} Enock Kanyinda
          </p>

          <p>
            {isFrench
              ? "Conçu avec passion et React."
              : "Built with passion and React."}
          </p>
        </div>

      </div>
    </section>
  );
}

export default Contact;
