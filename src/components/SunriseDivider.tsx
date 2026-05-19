'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

export default function SunriseDivider() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      frameRef.current = 0;

      const node = sectionRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travel = viewportHeight + rect.height;
      const rawProgress = (viewportHeight - rect.top) / travel;
      const nextProgress = Math.max(0, Math.min(1, rawProgress));

      setProgress((current) => (Math.abs(current - nextProgress) < 0.002 ? current : nextProgress));
    };

    const requestUpdate = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const visualProgress = Math.min(1, progress * 1.18);

  return (
    <section
      ref={sectionRef}
      className="sunrise-divider"
      aria-label="We Animate in Sunshine"
      style={{
        '--sunrise-progress': visualProgress,
        '--sunrise-skyline-progress': progress,
      } as CSSProperties}
    >
      <div className="container sunrise-divider-copy">
        <span className="section-kicker">We Animate in Sunshine</span>
      </div>
      <img className="sunrise-sun" src="/assets/sunrise/sun.webp" alt="" aria-hidden="true" />
      <img className="sunrise-cloud sunrise-cloud-left" src="/assets/sunrise/cloud-left.webp" alt="" aria-hidden="true" />
      <img className="sunrise-cloud sunrise-cloud-right" src="/assets/sunrise/cloud-right.webp" alt="" aria-hidden="true" />
      <img className="sunrise-skyline" src="/assets/sunrise/skyline.webp" alt="" aria-hidden="true" />
    </section>
  );
}
