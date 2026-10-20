import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import FlowerPage from './pages/FlowerPage';
import CardGame from './pages/CardGame';
import TrackingPage from './pages/TrackingPage';
import Intro from './components/Intro';
import TapBurst from './components/TapBurst';
import MusicPlayer from './components/MusicPlayer';

/** Pembuka cuma sekali tiap web dibuka, bukan tiap pindah halaman. */
let introSeen = false;

export default function App() {
  const location = useLocation();
  const [intro, setIntro] = useState(!introSeen);
  const [reveal, setReveal] = useState(introSeen);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <TapBurst />
      <MusicPlayer />
      {intro && (
        <Intro
          onReveal={() => setReveal(true)}
          onDone={() => {
            introSeen = true;
            setIntro(false);
          }}
        />
      )}
      {reveal && (
        <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bunga" element={<FlowerPage />} />
            <Route path="/game" element={<CardGame />} />
            <Route path="/tracking" element={<TrackingPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
        </>
      )}
    </MotionConfig>
  );
}
