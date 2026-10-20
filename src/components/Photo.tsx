import { useState } from 'react';
import { Flower } from './Icons';
import type { Shot } from '../config';

interface Props {
  shot: Shot;
  className?: string;
  eager?: boolean;
}

/**
 * Foto dengan tiga lapis cadangan: foto sendiri di public/foto, lalu foto suasana,
 * lalu bunga gambar. Pemotongan (crop) dan bentuk bunga diatur lewat CSS.
 */
export default function Photo({ shot, className = '', eager = false }: Props) {
  const [stage, setStage] = useState(0);

  if (stage > 1) {
    return (
      <span className={`photo photo-draw ${className}`} role="img" aria-label={shot.alt}>
        <Flower />
      </span>
    );
  }

  return (
    <img
      className={`photo ${className}`}
      src={stage === 0 ? shot.src : shot.fallback}
      alt={shot.alt}
      width={1000}
      height={1250}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setStage((n) => n + 1)}
    />
  );
}
