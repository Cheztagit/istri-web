import { Link } from 'react-router-dom';
import { CREDITS, NAME } from '../config';
import { RESI } from '../data';
import { Shuffle } from './Icons';
import Sticker from './Sticker';

const HEIGHTS = [86, 100, 72, 94, 80];

/** Penutup halaman: nama dibangun dari balok warna dengan tinggi berbeda, huruf dilubangi di dalamnya. */
export default function Footer() {
  const letters = NAME.split(' ')[0].toUpperCase().split('');

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="markwrap">
        <Sticker name="rose" size={92} />
        <p className="mark" role="img" aria-label={NAME}>
          {letters.map((ch, i) => (
            <span key={i} className={`blk b${i % 5}`} style={{ height: `${HEIGHTS[i % HEIGHTS.length]}%` }} aria-hidden="true">
              {ch}
            </span>
          ))}
        </p>
        </div>

        <div className="foot-cols">
          <nav className="foot-links" aria-label="Pintasan">
            <Link to="/">Peta</Link>
            <Link to="/bunga">Surat</Link>
            <Link to="/game">Kartu</Link>
            <Link to="/tracking">Resi</Link>
          </nav>
          <div className="foot-info">
            <p>Resi {RESI}</p>
            <p>Jampang Kulon ke Blitar, via Pantura</p>
          </div>
        </div>

        <div className="foot-last">
          <p>Dibuat buat {NAME}.</p>
          <Link className="btn small" to="/game">
            <Shuffle /> Kocok kartu
          </Link>
        </div>
        <p className="credit">{CREDITS}</p>
      </div>
    </footer>
  );
}
