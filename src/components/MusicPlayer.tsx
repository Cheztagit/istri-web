import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Flower } from './Icons';
import { SONG } from '../config';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;

    // Upayakan langsung play saat pertama kali halaman terbuka
    const tryPlay = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    };

    tryPlay();

    // Fallback: Jika kebijakan autoplay browser menahan audio sebelum ada interaksi,
    // begitu pengguna menggerakkan mouse, menyentuh layar, atau scroll sedikit saja, langsung play otomatis!
    const events = ['pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown', 'click', 'pointermove'];
    const handleGesture = () => {
      if (audio && audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      events.forEach((ev) => window.removeEventListener(ev, handleGesture));
    };

    events.forEach((ev) => {
      window.addEventListener(ev, handleGesture, { passive: true, once: true });
    });

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleGesture));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <div className="music-container" role="region" aria-label="Lagu Spesial">
      <audio
        ref={audioRef}
        src={SONG.src}
        autoPlay
        preload="auto"
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <motion.button
        type="button"
        className={`music-special-pill ${isPlaying ? 'on' : ''}`}
        onClick={togglePlay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Pencet untuk jeda' : 'Pencet untuk putar'}
        aria-label={isPlaying ? 'Jeda lagu Our Special Song' : 'Putar lagu Our Special Song'}
      >
        <span className={`pill-flower ${isPlaying ? 'spinning' : ''}`}>
          <Flower />
        </span>
        <span className="pill-text">Our Special Song</span>
        <span className={`pill-bars ${isPlaying ? 'active' : ''}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </motion.button>
    </div>
  );
}
