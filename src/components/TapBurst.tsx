import { useEffect, useState, type CSSProperties } from 'react';
import { Flower, Heart } from './Icons';

interface Bit {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
  flower: boolean;
}

/** Tiap layar dipencet, keluar bunga dan hati kecil yang terbang ke sekitar. */
export default function TapBurst() {
  const [bits, setBits] = useState<Bit[]>([]);

  useEffect(() => {
    let id = 0;
    const on = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('.stk, .intro')) return;
      const made: Bit[] = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + Math.random();
        const d = 34 + Math.random() * 40;
        return { id: ++id, x: e.clientX, y: e.clientY, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 18, rot: (Math.random() - 0.5) * 120, flower: i % 2 === 0 };
      });
      setBits((c) => [...c, ...made]);
      setTimeout(() => setBits((c) => c.filter((b) => !made.some((m) => m.id === b.id))), 850);
    };
    document.addEventListener('pointerdown', on);
    return () => document.removeEventListener('pointerdown', on);
  }, []);

  return (
    <div className="burst" aria-hidden="true">
      {bits.map((b) => {
        const Ic = b.flower ? Flower : Heart;
        return <Ic key={b.id} className="bb" style={{ left: b.x, top: b.y, '--dx': `${b.dx}px`, '--dy': `${b.dy}px`, '--rot': `${b.rot}deg` } as CSSProperties} />;
      })}
    </div>
  );
}
