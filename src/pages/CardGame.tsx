import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Flower, Heart, Shuffle } from '../components/Icons';
import FlowerBackground from '../components/FlowerBackground';
import Sticker from '../components/Sticker';
import { CARDS, LEVELS, type Card, type Level } from '../cards';

const HAND = 5;
const ZERO = Array.from({ length: HAND }, () => ({ x: 0, r: 0 }));
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const REACT: Record<Level, { name: 'biu' | 'cat' | 'mad'; say: string }> = {
  1: { name: 'biu', say: 'ciee, manis' },
  2: { name: 'cat', say: 'aduh, malu aku' },
  3: { name: 'mad', say: 'hmph, nakal ya' },
};

function mix<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const buzz = (ms: number) => {
  try {
    if ('vibrate' in navigator) navigator.vibrate(ms);
  } catch {
    /* nggak semua HP bisa getar */
  }
};

const Hearts = ({ n }: { n: number }) => (
  <span className="hearts" aria-hidden="true">
    {[1, 2, 3].map((k) => (
      <Heart key={k} className={k <= n ? 'on' : ''} fill={k <= n ? 'currentColor' : 'none'} />
    ))}
  </span>
);

export default function CardGame() {
  const [levels, setLevels] = useState<Level[]>([1, 2, 3]);
  const [hand, setHand] = useState<Card[]>(() => CARDS.slice(0, HAND));
  const [stacked, setStacked] = useState(true);
  const [shuffling, setShuffling] = useState(false);
  const [dealt, setDealt] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [faceUp, setFaceUp] = useState(false);
  const [offsets, setOffsets] = useState(ZERO);
  const [left, setLeft] = useState(CARDS.length);
  const [w, setW] = useState(() => window.innerWidth);
  const alive = useRef(true);
  const pile = useRef<Card[]>([]);
  const flipTimer = useRef(0);

  // Misi Kita Malam Ini (Tersimpan di browser)
  const [quests, setQuests] = useState<{ id: number; title: string; where: string; done: boolean }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('misi-malam-ini') || '[]');
    } catch {
      return [];
    }
  });

  const addQuest = (c: Card) => {
    setQuests((prev) => {
      if (prev.some((q) => q.id === c.id)) return prev;
      const next = [...prev, { id: c.id, title: c.title, where: c.where, done: false }];
      try {
        localStorage.setItem('misi-malam-ini', JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });
  };

  const toggleQuest = (id: number) => {
    setQuests((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, done: !q.done } : q));
      try {
        localStorage.setItem('misi-malam-ini', JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });
  };

  const removeQuest = (id: number) => {
    setQuests((prev) => {
      const next = prev.filter((q) => q.id !== id);
      try {
        localStorage.setItem('misi-malam-ini', JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });
  };

  const pool = useMemo(() => CARDS.filter((c) => levels.includes(c.level)), [levels]);

  useEffect(() => {
    alive.current = true;
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => {
      alive.current = false;
      clearTimeout(flipTimer.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ganti tingkat = tumpukan dikocok dari awal
  useEffect(() => {
    pile.current = [];
    setLeft(pool.length);
  }, [pool]);

  const small = w < 560;
  const cw = small ? Math.min(138, Math.round((w - 24) / 2.45)) : 196;
  const ch = Math.round(cw * 1.5);
  const gap = Math.min(cw * 0.96, (Math.min(w, 940) - 32 - cw) / (HAND - 1));
  const mid = (hand.length - 1) / 2;
  const grow = small ? 1.22 : 1.3;

  /** Ambil lima kartu berikutnya. Yang sudah keluar nggak muncul lagi sampai tumpukannya habis. */
  const take = (): Card[] => {
    if (pile.current.length < HAND) {
      const keep = pile.current;
      const keepIds = new Set(keep.map((c) => c.id));
      pile.current = [...keep, ...mix(pool.filter((c) => !keepIds.has(c.id)))];
    }
    const next = pile.current.slice(0, HAND);
    pile.current = pile.current.slice(HAND);
    setLeft(pile.current.length);
    return next;
  };

  const reset = () => {
    clearTimeout(flipTimer.current);
    setPicked(null);
    setFaceUp(false);
  };

  const shuffle = async () => {
    if (shuffling) return;
    setShuffling(true);
    reset();
    setStacked(true);
    buzz(20);
    await sleep(650);
    for (let i = 0; i < 4; i++) {
      if (!alive.current) return;
      setOffsets(ZERO.map((_, k) => ({ x: (k % 2 ? 1 : -1) * (40 + Math.random() * 110), r: (Math.random() - 0.5) * 36 })));
      await sleep(260);
      setOffsets(ZERO);
      await sleep(210);
    }
    if (!alive.current) return;
    setHand(take());
    setStacked(false);
    setDealt(true);
    await sleep(750);
    if (!alive.current) return;
    setShuffling(false);
  };

  const pick = (slot: number) => {
    if (shuffling || !dealt || picked !== null) return;
    setPicked(slot);
    buzz(35);
    // muka kartu ditukar pas kartunya lagi tipis di tengah putaran
    flipTimer.current = window.setTimeout(() => setFaceUp(true), 280);
  };

  const toggleLevel = (lv: Level) => {
    if (shuffling) return;
    setLevels((cur) => {
      const next = cur.includes(lv) ? cur.filter((x) => x !== lv) : [...cur, lv];
      return next.length ? next : cur;
    });
    setDealt(false);
    setStacked(true);
    reset();
  };

  const chosen = picked !== null ? hand[picked] : null;
  const lead = !dealt ? 'Kocok dulu, terus pilih satu. Jangan ngintip.' : picked === null ? 'Pilih satu dari lima.' : 'Nah, itu kartu kalian malam ini.';
  const re = chosen ? REACT[chosen.level] : null;

  return (
    <main className="pg night">
      <FlowerBackground tone="dark" />
      <div className="wrap rel">
        <h1 className="title sm">
          Malam ini,
          <br />
          kartu yang milih
        </h1>
        <p className="lead">{lead}</p>

        <div className="chips" role="group" aria-label="Tingkat kartu">
          {LEVELS.map(({ level, label }) => (
            <button key={level} type="button" className="chipbtn" aria-pressed={levels.includes(level)} onClick={() => toggleLevel(level)} disabled={shuffling}>
              {label}
            </button>
          ))}
        </div>

        <div className="actions">
          <button type="button" className="btn rose" onClick={shuffle} disabled={shuffling}>
            <Shuffle /> {shuffling ? 'Lagi dikocok…' : dealt ? 'Kocok lagi' : 'Kocok kartu'}
          </button>
        </div>

        <section className="deck" style={{ height: ch * grow + 120 }} aria-label="Kartu">
          {picked === null && !shuffling && (
            <>
              <Sticker name="cat" size={small ? 82 : 112} className="deck-pal l" />
              <Sticker name="biu" size={small ? 82 : 112} className="deck-pal r" />
            </>
          )}
          {shuffling && (
            <motion.div className="runner" style={{ top: ch + 46 }} initial={{ x: '-24vw' }} animate={{ x: '112vw' }} transition={{ duration: 1.7, ease: 'linear', repeat: Infinity }}>
              <img src="/stiker/dudu4.gif" alt="" width={small ? 74 : 96} draggable={false} />
            </motion.div>
          )}

          {hand.map((card, slot) => {
            const isPicked = picked === slot;
            const fade = picked !== null && !isPicked;
            const off = offsets[slot] ?? ZERO[0];
            const d = slot - mid;
            const x = isPicked ? 0 : stacked ? off.x : d * gap;
            const y = isPicked ? 4 : stacked ? -slot * 1.5 : d * d * (small ? 6 : 8);
            const rot = isPicked ? 0 : stacked ? off.r : d * (small ? 6.5 : 7);
            const open = isPicked && faceUp;
            return (
              <motion.button
                key={slot}
                type="button"
                className="pcard"
                style={{ width: cw, height: ch, marginLeft: -cw / 2, zIndex: isPicked ? 20 : slot, ['--cw' as string]: `${cw}px` }}
                animate={{ x, y: fade ? y + 34 : y, rotate: rot, scale: isPicked ? grow : 1, opacity: fade ? 0.16 : 1 }}
                transition={{ type: 'spring', stiffness: 230, damping: 21 }}
                whileHover={!shuffling && dealt && picked === null ? { y: y - 22, rotate: rot * 0.35, scale: 1.05, zIndex: 15 } : undefined}
                whileTap={!shuffling && dealt && picked === null ? { scale: 0.97 } : undefined}
                onClick={() => pick(slot)}
                aria-label={open ? card.title : `Kartu tertutup nomor ${slot + 1}`}
              >
                <motion.div className="flip" animate={{ scaleX: isPicked ? [1, 0, 1] : 1 }} transition={{ duration: 0.56, times: [0, 0.5, 1], ease: 'easeInOut' }}>
                  {open ? (
                    <div className="face front">
                      <span className="ftop">
                        <span>No. {String(card.id).padStart(2, '0')}</span>
                        <Hearts n={card.level} />
                      </span>
                      <b style={{ fontSize: Math.round(cw * 0.135) }}>{card.title}</b>
                      <span className="fwhere">{card.where}</span>
                    </div>
                  ) : (
                    <div className="face back">
                      <i className="cr tl"><Flower /></i>
                      <i className="cr tr"><Flower /></i>
                      <i className="cr bl"><Flower /></i>
                      <i className="cr br"><Flower /></i>
                      <span className="badge">
                        <Flower />
                      </span>
                    </div>
                  )}
                </motion.div>
              </motion.button>
            );
          })}
        </section>

        {chosen && re && (
          <motion.section className="chosen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} aria-live="polite">
            <motion.div className="react" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 14 }}>
              <span className="bubble">{re.say}</span>
              <Sticker name={re.name} size={small ? 92 : 116} />
            </motion.div>
            <p className="lvl">
              <Hearts n={chosen.level} />
              {LEVELS.find((l) => l.level === chosen.level)?.label}
            </p>
            <h2>{chosen.title}</h2>
            <p className="desc">{chosen.desc}</p>
            <p className="meta">
              Di {chosen.where.toLowerCase()}. Kira-kira {chosen.time.toLowerCase()}.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button
                type="button"
                className="btn rose small"
                onClick={() => addQuest(chosen)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {quests.some((q) => q.id === chosen.id) ? '✓ Sudah Masuk Agenda' : '📌 Jadikan Misi Malam Ini'}
              </motion.button>
              <button type="button" className="btn ghost small" onClick={shuffle}>
                Kocok kartu lain
              </button>
            </div>
          </motion.section>
        )}

        {/* Nampan Misi Kita Malam Ini */}
        {quests.length > 0 && (
          <section className="quests-tray" aria-label="Misi kita malam ini">
            <div className="quests-header">
              <h3>✨ Misi Kita Malam Ini</h3>
              <span className="quests-count">
                {quests.filter((q) => q.done).length} / {quests.length} Selesai
              </span>
            </div>
            <div className="quests-list">
              {quests.map((q) => (
                <div key={q.id} className={`quest-item ${q.done ? 'done' : ''}`}>
                  <div className="quest-info" onClick={() => toggleQuest(q.id)}>
                    <div className="quest-checkbox" aria-hidden="true">
                      {q.done && '✓'}
                    </div>
                    <div className="quest-text">
                      <b>{q.title}</b>
                      <span>{q.where} • {q.done ? 'Sudah dijalani bareng 💕' : 'Belum dijalani'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="quest-del-btn"
                    onClick={() => removeQuest(q.id)}
                    aria-label={`Hapus misi ${q.title}`}
                    title="Hapus misi"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {quests.length > 0 && quests.every((q) => q.done) && (
              <p className="mt-4 text-center font-head font-bold text-sm text-soft">
                🎉 Semua misi malam ini selesai dijalani! Kalian emang pasangan paling seru! 🥰
              </p>
            )}
          </section>
        )}

        <p className="deckinfo">Sisa {left} kartu. Aturannya satu aja: kalau ada yang bilang "cukup", ya berhenti. Titik.</p>
      </div>
    </main>
  );
}
