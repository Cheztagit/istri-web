import { useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Heart } from './Icons';

export const STIKER = {
  biu: '/stiker/dudu.gif',
  rose: '/stiker/dudu2.gif',
  mad: '/stiker/dudu3.gif',
  run: '/stiker/dudu4.gif',
  cat: '/stiker/kucing1.gif',
} as const;
export type StickerName = keyof typeof STIKER;

interface Props {
  name: StickerName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  flip?: boolean;
}

/** Stiker gif. Dipencet bakal mantul dan ngeluarin hati kecil. */
export default function Sticker({ name, size = 110, className = '', style, flip }: Props) {
  const [hearts, setHearts] = useState<number[]>([]);
  const n = useRef(0);

  const tap = () => {
    const id = ++n.current;
    setHearts((h) => [...h.slice(-5), id]);
    setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 900);
  };

  return (
    <motion.button
      type="button"
      className={`stk ${className}`}
      style={{ width: size, ...style }}
      whileHover={{ rotate: -6, scale: 1.06 }}
      whileTap={{ scale: 0.86, rotate: 6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 14 }}
      onClick={tap}
      aria-label="Stiker lucu, pencet aja"
    >
      <img src={STIKER[name]} alt="" draggable={false} style={flip ? { transform: 'scaleX(-1)' } : undefined} />
      {hearts.map((id, i) => (
        <Heart key={id} className="stk-h" style={{ '--dx': `${(i % 2 ? 1 : -1) * (8 + i * 8)}px` } as CSSProperties} />
      ))}
    </motion.button>
  );
}
