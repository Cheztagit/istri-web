import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower, Heart } from './Icons';
import Sticker from './Sticker';
import { SHOTS, NAME } from '../config';

const COLORS = ['var(--accent)', 'var(--rose)', 'var(--soft)', 'var(--rose-hi)', 'var(--accent)'];
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

interface Props {
  onReveal: () => void;
  onDone: () => void;
}

/**
 * Pembuka Baru:
 * 1. Sebelum bunga ganti ke foto: pengguna HARUS TAP DULU (menjamin autoplay musik 100% jalan di semua browser)
 * 2. Pas di-tap: Musik langsung play, kelopak bunga berputar, foto ceweknya jatuh dari atas dengan efek spring bounce
 * 3. Foto morphing mengecil & geser ke dashboard dengan transisi fluent
 */
export default function Intro({ onReveal, onDone }: Props) {
  const [phase, setPhase] = useState<'wait-tap' | 'photo-drop' | 'morph-out' | 'done'>('wait-tap');
  const started = useRef(false);
  const timers = useRef<number[]>([]);

  /* ---------- kelopak bunga melayang ---------- */
  const flowers = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        left: rnd(-2, 96),
        size: rnd(28, 90),
        color: COLORS[i % COLORS.length],
        rest: rnd(22, 82),
        delay: rnd(0, 1.2),
        dur: rnd(1.8, 2.6),
        sway: rnd(-24, 24),
        r0: rnd(-50, 50),
        spin: rnd(-100, 100),
        rd: rnd(0, 0.35),
      })),
    []
  );

  const heroPhoto = SHOTS[3]; // Foto ke-4 Nadya (senyum manis tangan di dagu)

  // Dipanggil saat pengguna melakukan TAP / KLIK pertama kali
  const handleStart = () => {
    if (started.current) return;
    started.current = true;

    // Putar musik langsung (dijamin 100% berhasil oleh browser karena ada aksi user gesture)
    const audio = document.querySelector('audio');
    if (audio) {
      audio.play().catch(() => {});
    }

    // Fase 2: Foto jatuh dari atas
    setPhase('photo-drop');

    // Fase 3: Morphing ke dashboard
    timers.current.push(
      window.setTimeout(() => {
        setPhase('morph-out');
        onReveal();
      }, 2200)
    );

    // Selesai
    timers.current.push(
      window.setTimeout(() => {
        setPhase('done');
        onDone();
      }, 3400)
    );
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = document.querySelector('audio');
    if (audio) audio.play().catch(() => {});
    onReveal();
    onDone();
  };

  if (phase === 'done') return null;

  const isWaiting = phase === 'wait-tap';
  const isMorphing = phase === 'morph-out';
  const isDropping = phase === 'photo-drop' || isMorphing;

  return (
    <div
      className={`intro-overlay ${isMorphing ? 'fading' : ''}`}
      role="presentation"
      onClick={isWaiting ? handleStart : undefined}
    >
      {/* Kelopak bunga jatuh & melayang */}
      {flowers.map((f, i) => (
        <motion.span
          key={i}
          className="intro-petal"
          style={{ left: `${f.left}%`, fontSize: f.size, color: f.color }}
          initial={{ y: '-20vh', rotate: f.r0, opacity: 1 }}
          animate={
            isDropping
              ? { y: '-140vh', rotate: f.r0 + 180, opacity: [1, 1, 0] }
              : {
                  y: `${f.rest}vh`,
                  rotate: f.r0 + f.spin,
                  x: [0, f.sway, -f.sway, 0],
                }
          }
          transition={
            isDropping
              ? { duration: 1.1, delay: f.rd, ease: [0.55, 0, 0.9, 0.6] }
              : {
                  duration: f.dur,
                  delay: f.delay,
                  ease: [0.2, 0.65, 0.35, 1],
                  repeat: Infinity,
                  repeatType: 'reverse',
                }
          }
        >
          <Flower />
        </motion.span>
      ))}

      {/* Fase 1: Menunggu di-tap */}
      {isWaiting && (
        <motion.div
          className="intro-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sticker name="rose" size={130} />
          </motion.div>

          <p className="intro-text">
            Ada sesuatu buat {NAME} <Heart className="inline size-5 text-rose ml-1" />
          </p>

          <motion.button
            type="button"
            className="btn rose intro-tap-btn"
            onClick={handleStart}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(178, 58, 82, 0.4)',
                '0 0 0 16px rgba(178, 58, 82, 0)',
              ],
            }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <Flower className="size-5" /> Ketuk untuk Membuka
          </motion.button>
          <small className="intro-hint">Ketuk di mana saja untuk mulai</small>
        </motion.div>
      )}

      {/* Fase 2: Foto Nadya jatuh dari langit */}
      <AnimatePresence>
        {isDropping && (
          <motion.div
            className="intro-photo-container"
            initial={{
              y: '-100vh',
              rotate: -20,
              scale: 1.15,
              opacity: 0,
            }}
            animate={
              isMorphing
                ? {
                    y: '100vh',
                    rotate: 8,
                    scale: 0.15,
                    opacity: [1, 1, 0],
                    x: '30vw',
                  }
                : {
                    y: 0,
                    rotate: rnd(-3, 3),
                    scale: 1,
                    opacity: 1,
                  }
            }
            exit={{
              y: '100vh',
              scale: 0.1,
              opacity: 0,
            }}
            transition={
              isMorphing
                ? {
                    duration: 1.1,
                    ease: [0.4, 0, 0.2, 1],
                  }
                : {
                    type: 'spring',
                    stiffness: 85,
                    damping: 14,
                    mass: 1.2,
                  }
            }
          >
            {/* Polaroid frame */}
            <motion.div
              className="intro-polaroid"
              animate={
                !isMorphing
                  ? {
                      boxShadow: [
                        '0 20px 60px rgba(0,0,0,0.3)',
                        '0 30px 80px rgba(0,0,0,0.4)',
                        '0 20px 60px rgba(0,0,0,0.3)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="intro-photo-mask">
                <motion.img
                  src={heroPhoto.src}
                  alt={heroPhoto.alt}
                  className="intro-photo-img"
                  draggable={false}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: isMorphing ? 1.4 : 1 }}
                  transition={{ duration: isMorphing ? 1 : 1.5, ease: 'easeOut' }}
                />
              </div>
              {!isMorphing && (
                <motion.p
                  className="intro-photo-caption"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {heroPhoto.caption}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol Lewati */}
      <button type="button" className="chipbtn intro-skip-btn" onClick={handleSkip}>
        Lewati
      </button>
    </div>
  );
}
