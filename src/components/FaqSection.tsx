'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: 'What services do you offer?',
    answer:
      "At Animae Caribe House, we offer full-spectrum creative services - from ideation to final production. We help shape your concept, guide you through development, and push it all the way to a polished output. Whether it's animation, digital content, or collaborative projects, we bring bold ideas to life with real production power. We're not just a space - we're your creative launchpad, connecting talent and studios across the Caribbean and the world. Let's build something groundbreaking!",
  },
  {
    question: 'How do I schedule an appointment?',
    answer:
      "Scheduling an appointment is easy! Just shoot us an email at info@animaecaribehouse.com or fill out the contact form above. We're all about making connections simple and fast - hit us up, and let's get your ideas moving. Your next big project starts with a click!",
  },
  {
    question: 'What is your studio capacity?',
    answer:
      'Our studio capacity is super flexible! We work with a network of independent animators and artists across the Caribbean and Asia, building teams from 5 to 50 depending on the project. With fresh talent constantly joining from graduating classes, our creative workforce keeps growing - ready to scale with your vision!',
  },
  {
    question: 'Do you offer services other than animation?',
    answer:
      "Absolutely! Beyond animation, we dive into VR, augmented reality, and experimental AI. Our young, fearless team is always pushing new tech boundaries. We've already led projects creating AR filters and AI-driven videos, keeping us at the cutting edge of digital innovation. If it's emerging tech - we're on it!",
  },
];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="faq-chevron">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-shell">
        <div className="faq-intro reveal-up">
          <span className="section-kicker">FAQ</span>
          <h2>Answers for ambitious projects, studio partnerships and big creative plans.</h2>
          <p>Everything here is built to make the next conversation easier, faster and clearer.</p>
        </div>

        <div className="faq-list reveal-up">
          {faqItems.map((item, index) => {
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            const isOpen = openIndex === index;

            return (
              <article className={isOpen ? 'faq-item is-open glass-card' : 'faq-item glass-card'} key={item.question}>
                <h3 className="faq-heading">
                  <button
                    id={buttonId}
                    className="faq-trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index))}
                  >
                    <span className="faq-question">{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <ChevronIcon />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={isOpen ? 'faq-panel is-open' : 'faq-panel'}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-panel-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
