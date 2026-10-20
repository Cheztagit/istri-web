import { Link } from 'react-router-dom';
import { ArrowUpRight } from './Icons';

interface Props {
  to: string;
  word: string;
  text: string;
}

/** Satu kata besar yang jadi tombolnya. Seluruh pita bisa disentuh. */
export default function CtaBand({ to, word, text }: Props) {
  return (
    <Link className="cta" to={to}>
      <span className="cta-text">{text}</span>
      <ArrowUpRight className="cta-arrow" />
      <span className="cta-word">{word}</span>
    </Link>
  );
}
