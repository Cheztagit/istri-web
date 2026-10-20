import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from '../components/Icons';
import { EVENTS, RESI } from '../data';
import { NAME } from '../config';
import Sticker from '../components/Sticker';

const COURIER_QUOTES = [
  'Siap bos! Paket bunga Kak Nadya dikawal ketat nyusur Pantura!',
  'Gaspol rem blong! Bunga cinta ini prioritas nomor 1 sampai Blitar!',
  'Bentar lagi sampai ya Kak Nadya! Tenang, bunganya masih segar wangi!',
  'Kurir auto tancap gigi 5! Semangat dari kamu bikin motor kurir makin melaju!',
  'Paket aman terkendali! Pas buka nanti jangan lupa senyum manis ya!',
];

export default function TrackingPage() {
  const [cheers, setCheers] = useState(() => {
    return parseInt(localStorage.getItem('kurir-cheers') || '0', 10);
  });
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [speedUp, setSpeedUp] = useState(false);

  const boostCourier = () => {
    const next = cheers + 1;
    setCheers(next);
    try {
      localStorage.setItem('kurir-cheers', String(next));
    } catch {
      /* abaikan */
    }
    setQuoteIdx((prev) => (prev + 1) % COURIER_QUOTES.length);
    setShowQuote(true);
    setSpeedUp(true);
    setTimeout(() => setSpeedUp(false), 2400);
  };

  return (
    <main className="pg">
      <div className="wrap rel">
        <h1 className="title sm">
          Paketnya
          <br />
          {NAME}
        </h1>
        <p className="lead">Dari dibungkus sampai nyampe. Baris paling bawah cuma perkiraan, jamnya belum pasti.</p>

        {/* 1. Lintasan Beruang Lari & Tombol Semangatin Kurir */}
        <div className="courier-boost-wrap">
          <AnimatePresence mode="wait">
            {showQuote && (
              <motion.div
                key={quoteIdx}
                className="courier-quote-bubble"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                💬 <span>"{COURIER_QUOTES[quoteIdx]}"</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="runlane tall" aria-hidden="true">
            <Sticker
              name="run"
              size={88}
              className={`go ${speedUp ? 'speedy' : ''}`}
              style={speedUp ? { animationDuration: '3.5s' } : undefined}
            />
          </div>

          <div className="mt-3">
            <motion.button
              type="button"
              className="boost-btn"
              onClick={boostCourier}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              title="Kirim klakson cinta biar kurir makin semangat"
            >
              <span>🚚💨 Semangatin Kurirnya</span>
              {cheers > 0 && <span className="bg-paper/20 text-paper px-2 py-0.5 rounded-full text-xs">+{cheers}</span>}
            </motion.button>
          </div>
        </div>

        {/* 2. Riwayat Perjalanan Paket SPX */}
        <section className="paper resi tall" aria-label="Riwayat paket">
          <div className="resi-head">
            <span>SPX Hemat</span>
            <span>{RESI}</span>
          </div>
          <ol className="timeline">
            {EVENTS.map((e) => (
              <li key={e.title} className={e.estimate ? 'est' : 'on'}>
                <i>{!e.estimate && <Check />}</i>
                <time>{e.time}</time>
                <div>
                  <b>{e.title}</b>
                  <p>{e.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="barcode" aria-hidden="true" />
        </section>

        {/* 3. Manifest Muatan Paket Spesial (Vintage Invoice) */}
        <section className="manifest-card" aria-label="Manifest muatan paket">
          <div className="manifest-title">
            <span>📜 Manifest Muatan Paket VVIP</span>
            <span className="manifest-badge">Prioritas Penuh</span>
          </div>
          <div className="manifest-grid">
            <div className="manifest-item">
              <small>📍 Rute Pengiriman</small>
              <b>Jampang Kulon (Jabar) ➔ Blitar (Jatim)</b>
            </div>
            <div className="manifest-item">
              <small>🛣️ Jalur Lintas</small>
              <b>Pantura (~780 km)</b>
            </div>
            <div className="manifest-item">
              <small>📦 Isi Muatan</small>
              <b>1 Ikat Bunga Pilihan + Surat Kasih Sayang</b>
            </div>
            <div className="manifest-item">
              <small>⚖️ Berat Paket</small>
              <b>0.5 kg Bunga + 1.000 Ton Rasa Kangen</b>
            </div>
            <div className="manifest-item">
              <small>🛡️ Penjamin / Pengirim</small>
              <b>Chezta (Dijamin Asli & Tulus)</b>
            </div>
            <div className="manifest-item">
              <small>⚠️ Instruksi Khusus Kurir</small>
              <b>Jangan dibanting, nanti cintanya tumpah. Wajib diterima dengan senyuman.</b>
            </div>
          </div>
        </section>

        <div className="actions center mt-12">
          <Link className="btn" to="/">
            Lihat di peta <ArrowRight />
          </Link>
        </div>
      </div>
    </main>
  );
}
