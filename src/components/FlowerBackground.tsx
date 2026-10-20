import { Flower, Heart, Sparkle } from './Icons';

interface Bit {
  Icon: typeof Flower;
  left: string;
  top: string;
  size: number;
  delay: number;
  dur: number;
}

const BITS: Bit[] = [
  { Icon: Flower, left: '4%', top: '8%', size: 72, delay: 0, dur: 16 },
  { Icon: Heart, left: '82%', top: '14%', size: 34, delay: 2, dur: 12 },
  { Icon: Sparkle, left: '64%', top: '30%', size: 28, delay: 4, dur: 10 },
  { Icon: Flower, left: '88%', top: '46%', size: 96, delay: 1, dur: 20 },
  { Icon: Heart, left: '10%', top: '52%', size: 40, delay: 3, dur: 14 },
  { Icon: Sparkle, left: '30%', top: '70%', size: 30, delay: 5, dur: 11 },
  { Icon: Flower, left: '70%', top: '84%', size: 64, delay: 2, dur: 18 },
  { Icon: Heart, left: '46%', top: '92%', size: 36, delay: 6, dur: 13 },
];

interface Props {
  /** light untuk latar terang, dark untuk latar gelap */
  tone?: 'light' | 'dark';
}

/** Bunga, hati, dan kilau yang melayang pelan di belakang isi. Taruh di dalam elemen yang position: relative. */
export default function FlowerBackground({ tone = 'light' }: Props) {
  return (
    <div className={`bits ${tone}`} aria-hidden="true">
      {BITS.map(({ Icon, left, top, size, delay, dur }, i) => (
        <Icon key={i} className="bit" style={{ left, top, fontSize: size, animationDelay: `-${delay}s`, animationDuration: `${dur}s` }} />
      ))}
    </div>
  );
}
