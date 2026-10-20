import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import Sticker, { type StickerName } from './Sticker';
import { Flower } from './Icons';

/** Estimasi tiba paket bunga: 22 Oktober 2026 jam 12:00 WIB */
const ETA = new Date('2026-10-22T12:00:00+07:00').getTime();

const TILES: { to: string; title: string; sub: string; sticker: StickerName; theme: 'rose' | 'ink' | 'soft' }[] = [
  { to: '/bunga', title: 'Surat', sub: 'Dibalik dulu baru kebaca', sticker: 'cat', theme: 'rose' },
  { to: '/game', title: 'Kartu', sub: '42 kartu, 5 keluar tiap kocok', sticker: 'mad', theme: 'ink' },
  { to: '/tracking', title: 'Resi', sub: 'Catatan kurir lengkap', sticker: 'run', theme: 'soft' },
];

const COUPONS = [
  { id: 'pijat', t: 'Pijat 20 menit', d: 'Tanpa HP, tanpa buru-buru.' },
  { id: 'film', t: 'Kamu pilih film', d: 'Aku nggak boleh protes.' },
  { id: 'peluk', t: 'Peluk tanpa batas', d: 'Sampai kamu yang bilang cukup.' },
  { id: 'sarapan', t: 'Sarapan dibikinin', d: 'Dibawa ke tempat tidur.' },
  { id: 'cium', t: 'Ciuman di mana aja', d: 'Kamu yang nentuin tempatnya.' },
  { id: 'manja', t: 'Sesi manja 30 menit', d: 'Kamu bos, aku nurut.' },
];

const KEY = 'kupon-nadya';
const load = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

export default function DashExtras() {
  const [now, setNow] = useState(() => Date.now());
  const [used, setUsed] = useState<string[]>(load);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const claim = (id: string) =>
    setUsed((u) => {
      const next = u.includes(id) ? u.filter((x) => x !== id) : [...u, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });

  const left = Math.max(0, ETA - now);
  const units = [
    ['Hari', Math.floor(left / 864e5)],
    ['Jam', Math.floor(left / 36e5) % 24],
    ['Menit', Math.floor(left / 6e4) % 60],
    ['Detik', Math.floor(left / 1e3) % 60],
  ] as const;

  return (
    <>
      {/* 1. Menu Cepat: 3 Kartu Berstiker */}
      <section className="quick-tiles-sec" aria-label="Menu cepat">
        <div className="quick-tiles-grid">
          {TILES.map((t, i) => (
            <Reveal key={t.to} delay={i * 0.08}>
              <Link to={t.to} className={`quick-tile tile-${t.theme} group`}>
                <Sticker name={t.sticker} size={76} className="tile-stk" />
                <Flower className="quick-tile-flower" />
                <b className="quick-tile-title">{t.title}</b>
                <span className="quick-tile-sub">{t.sub}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2. Hitung Mundur Paket Sampai 22 Oktober */}
      <section className="countdown-section" aria-labelledby="h-hitung">
        <div className="countdown-container">
          <div className="countdown-header">
            <h2 id="h-hitung">Bunganya tinggal sebentar lagi</h2>
            <p>
              {left > 0
                ? 'Hitung mundur ke estimasi tiba, 22 Okt.'
                : 'Estimasi paling cepat udah lewat. Cek pintu depan ya.'}
            </p>
          </div>
          <div className="countdown-blocks">
            {units.map(([label, v], i) => (
              <motion.div
                key={label}
                className={`countdown-pennant ${i % 2 === 0 ? 'paper' : 'rose'}`}
                whileHover={{ y: -6, rotate: i % 2 ? 3 : -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <span className="countdown-pennant-num">{String(v).padStart(2, '0')}</span>
                <small className="countdown-pennant-lbl">{label}</small>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Game Kupon Tiket Manja */}
      <section className="coupons-section" aria-labelledby="h-kupon">
        <Reveal>
          <div className="coupons-header">
            <h2 id="h-kupon">Kupon buat kamu</h2>
            <p>Pencet tiketnya buat dipakai. Pencet lagi kalau mau dibatalin.</p>
          </div>
        </Reveal>
        <div className="coupons-grid">
          {COUPONS.map((c, i) => {
            const on = used.includes(c.id);
            return (
              <Reveal key={c.id} delay={(i % 3) * 0.06}>
                <motion.button
                  type="button"
                  onClick={() => claim(c.id)}
                  aria-pressed={on}
                  className={`ticket-card ${on ? 'claimed' : ''}`}
                  whileTap={{ scale: 0.97 }}
                >
                  <b className="ticket-title">{c.t}</b>
                  <span className="ticket-desc">{c.d}</span>
                  {on && <span className="ticket-stamp">DIPAKAI</span>}
                </motion.button>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
