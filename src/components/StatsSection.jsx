'use client';

import { useEffect, useRef, useState } from 'react';
import { stats } from '../data/stats';

function useCountUp(targetValue, duration = 1400) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return undefined;

    let animationFrame;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, hasStarted, targetValue]);

  return { ref, value };
}

function StatCard({ stat }) {
  const { ref, value } = useCountUp(stat.value);

  return (
    <article className="stat-card" ref={ref}>
      <strong>
        {value}
        {stat.suffix}
      </strong>
      <span>{stat.label}</span>
    </article>
  );
}

export default function StatsSection() {
  return (
    <section className="section stats-section">
      <div className="container narrow-heading centered stats-intro">
        <span className="section-kicker">Reach and impact</span>
        <h2>Numbers that can grow with the story.</h2>
        <p>
          Replace these starter values with confirmed figures for years, creators, countries, completed projects or hours of animation produced.
        </p>
      </div>
      <div className="container stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
