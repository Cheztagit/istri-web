import { Flower } from './Icons';

interface Props {
  items: string[];
}

/** Pita teks yang berjalan pelan. Isinya diulang dua kali supaya putarannya mulus. */
export default function Marquee({ items }: Props) {
  const group = (hidden: boolean) => (
    <div className="marq-group" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="marq-item">
          {t}
          <Flower />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marq">
      <div className="marq-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
