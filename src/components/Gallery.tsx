import { useEffect, useState } from 'react';
import { SHOTS } from '../config';
import Photo from './Photo';

const HOLD = 2600;

/** Satu bingkai berbentuk bunga, isinya berganti. Disentuh = langsung ganti ke foto berikutnya. */
export default function Gallery() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % SHOTS.length), HOLD);
    return () => window.clearInterval(t);
  }, [idx]);

  const next = () => setIdx((i) => (i + 1) % SHOTS.length);

  return (
    <div className="frame-wrap">
      <button type="button" className="frame-btn" onClick={next} aria-label="Ganti foto">
        <span className="frame">
          {SHOTS.map((shot, i) => (
            <Photo key={shot.src} shot={shot} className={i === idx ? 'on' : ''} />
          ))}
        </span>
      </button>
      <p className="cap" aria-live="polite">
        {SHOTS[idx].caption}
      </p>
    </div>
  );
}
