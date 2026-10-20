import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from '../components/Icons';
import FlowerBackground from '../components/FlowerBackground';
import LetterModal from '../components/LetterModal';
import Sticker from '../components/Sticker';

const REACTIONS = [
  { emoji: '🙈', label: 'Salting Parah', feedback: 'Hihi salting ya! Chezta di Jampang Kulon pasti ikut senyum-senyum sendiri 💕' },
  { emoji: '🥺', label: 'Kangen Banget', feedback: 'Samaa, Chezta juga kangennya udah nggak ketolong lagi! Peluk virtual dulu 🤗' },
  { emoji: '🤗', label: 'Mau Peluk Erat', feedback: 'Peluk hangat terkirim! Nanti pas ketemu langsung peluk yang lama ya!' },
  { emoji: '💋', label: 'Kirim Ciuman', feedback: 'Muach! Ciuman sayang buat Kak Nadya yang paling manis sedunia! 😘' },
];

export default function FlowerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [chosenReaction, setChosenReaction] = useState<string>(() => {
    return localStorage.getItem('reaksi-nadya') || '';
  });
  const [feedback, setFeedback] = useState<string>('');

  const handleOpenLetter = () => {
    setOpen(true);
    setModalOpen(true);
  };

  const handleSelectReaction = (label: string, text: string) => {
    setChosenReaction(label);
    setFeedback(text);
    try {
      localStorage.setItem('reaksi-nadya', label);
    } catch {
      /* abaikan */
    }
  };

  return (
    <main className="pg pg-letter">
      <FlowerBackground tone="light" />
      <div className="wrap rel">
        <h1 className="title sm">
          Ada surat
          <br />
          buat kamu
        </h1>
        <p className="lead">Bunganya masih di jalan. Suratnya udah duluan sampai.</p>

        <section className="envstage" aria-label="Surat">
          <div className="env-wrap">
            {/* Stiker Kucing duduk manis pas di pojok atas amplop dengan animasi waggle */}
            <motion.div
              animate={{ rotate: [6, 12, 6], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="env-perch"
            >
              <Sticker name="cat" size={92} />
            </motion.div>

            {/* Stiker Beruang mengintip dari pojok bawah amplop saat amplop dibuka */}
            {open && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 1, rotate: -9 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className="env-peek"
              >
                <Sticker name="rose" size={88} />
              </motion.div>
            )}

            {/* Tombol Amplop */}
            <motion.button
              type="button"
              className={`env ${open ? 'open' : ''}`}
              onClick={handleOpenLetter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={open}
              aria-label="Pencet amplop buat buka surat pop-up"
            >
              <span className="env-back" />
              <span className="env-front" />
              <span className="env-flap" />
              <span className="env-seal">
                <Heart />
              </span>
            </motion.button>
          </div>

          <p className="envhint" aria-live="polite">
            {open
              ? 'Pencet amplop atau tombol di bawah buat baca suratnya lagi.'
              : 'Pencet amplopnya buat buka suratnya.'}
          </p>

          <div className="envpals">
            <motion.button
              type="button"
              className="btn rose"
              onClick={handleOpenLetter}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              💌 Buka Suratnya
            </motion.button>
          </div>
        </section>

        {/* Pop-up Kartu Surat 3D (Bisa Muter Depan-Belakang) */}
        <LetterModal open={modalOpen} onClose={() => setModalOpen(false)} />

        {/* Reaksi Cepat Kak Nadya */}
        <section className="reaction-bar-wrap" aria-label="Kirim reaksi surat">
          <p className="reaction-bar-title">💬 Reaksi Kak Nadya Buat Surat Ini</p>
          <p className="reaction-bar-sub">Pencet salah satu buat ngasih tahu apa yang kamu rasain:</p>
          <div className="reaction-pills-grid">
            {REACTIONS.map((r) => (
              <motion.button
                key={r.label}
                type="button"
                className={`reaction-pill ${chosenReaction === r.label ? 'selected' : ''}`}
                onClick={() => handleSelectReaction(r.label, r.feedback)}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{r.emoji}</span>
                <span>{r.label}</span>
              </motion.button>
            ))}
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="reaction-feedback"
            >
              {feedback}
            </motion.div>
          )}
        </section>

        <div className="actions center mt-12">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link className="btn" to="/game">
              Main kartu <ArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
