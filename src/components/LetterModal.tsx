import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flower } from './Icons';
import Sticker from './Sticker';
import { LETTER } from '../config';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Pop-up Kartu Surat 3D (Bisa Muter):
 * - Sisi Depan: GIF kartun lucu + tulisan "i love kak nadya" + petunjuk ketuk
 * - Sisi Belakang: Isi surat cinta romantis yang bisa di-scroll dengan nyaman
 * - Animasi 3D Flip: Berputar 180° secara 3D saat kartu dipencet
 * - Anti-stuck scroll: Memulihkan overflow halaman seketika saat ditutup
 */
export default function LetterModal({ open, onClose }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFlipped(false);
    
    // Simpan overflow asli dan kunci scroll hanya saat modal terbuka
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow || '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="letter-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Surat Spesial Buat Kak Nadya"
        >
          <motion.div
            className="letter-card-perspective"
            initial={{ scale: 0.7, y: 70, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.75, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kartu 3D yang berputar dengan Framer Motion */}
            <motion.div
              className="letter-card-inner"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14 }}
              onClick={() => setFlipped((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label={flipped ? 'Putar balik kartu ke depan' : 'Putar kartu untuk membaca isi surat'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFlipped((prev) => !prev);
                }
              }}
            >
              {/* SISI DEPAN (FRONT) */}
              <div className="letter-card-face letter-card-front">
                <Flower className="absolute -left-10 -top-10 size-32 rotate-12 text-rose-hi/25 pointer-events-none" />
                <Flower className="absolute -bottom-12 -right-10 size-40 -rotate-12 text-soft/30 pointer-events-none" />
                
                <span className="letter-love-sub">🌸 Surat Spesial Buatmu 🌸</span>
                
                {/* GIF Kartun Lucu dengan animasi melayang */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="letter-front-gif"
                >
                  <Sticker name="rose" size={132} />
                </motion.div>

                {/* Tulisan sesuai permintaan user */}
                <h2 className="letter-love-title">
                  i love kak nadya 💕
                </h2>

                <div className="letter-tap-hint">
                  <span>💌 Ketuk kartu untuk baca isi suratnya ↻</span>
                </div>
              </div>

              {/* SISI BELAKANG (BACK) */}
              <div className="letter-card-face letter-card-back">
                <div
                  className="letter-scroll-area"
                  onClick={(e) => {
                    // Mencegah klik di teks membuat kartu langsung terputar balik
                    e.stopPropagation();
                  }}
                >
                  <div className="letter-back-header">
                    <h3>Dari Hatiku yang Terdalam 🌸</h3>
                    <p className="text-xs text-muted mt-1">Buat Kak Nadya cantiku</p>
                  </div>

                  {LETTER.map((paragraph, idx) => (
                    <p key={idx} className="letter-para">
                      {paragraph}
                    </p>
                  ))}

                  <div className="letter-sign">
                    <p>Dengan segenap rasa sayangku,</p>
                    <p className="mt-1 font-bold text-rose">Selalu untukmu, Kak Nadya 💕</p>
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      className="btn rose small mx-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(false);
                      }}
                    >
                      ↺ Putar balik ke depan
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tombol flip di bawah kartu */}
            <motion.button
              type="button"
              className="letter-flip-pill"
              onClick={() => setFlipped((prev) => !prev)}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
            >
              {flipped ? '↺ Putar ke Depan' : '💌 Buka Isi Surat (Putar)'}
            </motion.button>

            {/* Tombol tutup di pojok atas */}
            <motion.button
              type="button"
              className="letter-close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Tutup surat"
            >
              ✕
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
