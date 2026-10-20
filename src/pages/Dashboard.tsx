import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, ArrowRight, Check, MapPin, Flower } from '../components/Icons';
import { EVENTS, RESI } from '../data';
import { ASPECT, GRID, LAND, OVERVIEW, ROUTE, px, py } from '../geo';
import { NAME } from '../config';
import Sticker from '../components/Sticker';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import Gallery from '../components/Gallery';
import CtaBand from '../components/CtaBand';
import DashExtras from '../components/DashExtras';

const FOLLOW_W = 120; // lebar pandang kamera saat mengikuti kurir (unit peta)

export default function Dashboard() {
  const route = ROUTE;
  const destName = route.stops[route.stops.length - 1].name;

  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const parcelRef = useRef<SVGGElement>(null);
  const goalRef = useRef<SVGGElement>(null);
  const cityEls = useRef<(SVGGElement | null)[]>([]);

  const camRef = useRef({ x: OVERVIEW.x, y: OVERVIEW.y, w: OVERVIEW.w });
  const progRef = useRef(0);
  const playRef = useRef(false);
  const followRef = useRef(true);
  const lastPct = useRef(0);
  const kick = useRef<() => void>(() => {});

  const [pct, setPct] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [follow, setFollow] = useState(true);
  const [fracs, setFracs] = useState<number[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    const base = baseRef.current;
    const trail = trailRef.current;
    const parcel = parcelRef.current;
    const goal = goalRef.current;
    if (!svg || !base || !trail || !parcel || !goal) return;

    const len = base.getTotalLength();
    const duration = Math.min(30000, 9000 + len * 28);

    // letak tiap kota sepanjang rute (0..1): titik sampel terdekat
    const N = 500;
    const samples: { x: number; y: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const p = base.getPointAtLength((len * i) / N);
      samples.push({ x: p.x, y: p.y });
    }
    const fr = route.stops.map((c, idx) => {
      if (idx === 0) return 0;
      if (idx === route.stops.length - 1) return 1;
      const cx = px(c.lon);
      const cy = py(c.lat);
      let best = 0;
      let bd = Infinity;
      samples.forEach((p, i) => {
        const d = (p.x - cx) ** 2 + (p.y - cy) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return best / N;
    });
    setFracs(fr);

    progRef.current = 0;
    playRef.current = false;
    lastPct.current = 0;
    setPct(0);
    setPlaying(false);

    const cam = camRef.current;
    let heading = 0;
    let headingReady = false;
    let raf = 0;
    let last = 0;
    let lastW = -1;

    const draw = () => {
      const prog = progRef.current;
      const w = cam.w;
      const h = w * ASPECT;
      svg.setAttribute('viewBox', `${(cam.x - w / 2).toFixed(2)} ${(cam.y - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
      const u = w / 100; // 1 unit lokal = 1% lebar layar

      if (Math.abs(w - lastW) > w * 0.002) {
        lastW = w;
        route.stops.forEach((c, i) => {
          const el = cityEls.current[i];
          if (el) el.setAttribute('transform', `translate(${px(c.lon).toFixed(2)} ${py(c.lat).toFixed(2)}) scale(${u.toFixed(4)})`);
        });
        goal.setAttribute('transform', `translate(${route.end[0].toFixed(2)} ${route.end[1].toFixed(2)}) scale(${u.toFixed(4)})`);
        trail.setAttribute('stroke-width', (u * 1.1).toFixed(3));
        base.setAttribute('stroke-width', (u * 0.7).toFixed(3));
        base.setAttribute('stroke-dasharray', `0.01 ${(u * 2.1).toFixed(3)}`);
      }

      const L = len * prog;
      trail.setAttribute('stroke-dasharray', `${L.toFixed(2)} ${(len + 10).toFixed(2)}`);
      const p = base.getPointAtLength(L);
      parcel.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${heading.toFixed(1)}) scale(${(u * 0.19).toFixed(4)})`);
      route.stops.forEach((_, i) => {
        const el = cityEls.current[i];
        if (el) el.classList.toggle('reached', fr[i] <= prog + 1e-6);
      });
      goal.classList.toggle('arrived', prog >= 1);
    };

    const frame = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;

      if (playRef.current) {
        let d = 1;
        for (const f of fr) d = Math.min(d, Math.abs(progRef.current - f));
        const k = 0.3 + 0.7 * Math.min(1, d / 0.03); // melambat saat mendekati kota
        progRef.current = Math.min(1, progRef.current + (dt / duration) * k);
        const pc = Math.floor(progRef.current * 100);
        if (pc !== lastPct.current) {
          lastPct.current = pc;
          setPct(pc);
        }
        if (progRef.current >= 1) {
          playRef.current = false;
          setPlaying(false);
        }
      }

      const L = len * progRef.current;
      const p = base.getPointAtLength(L);
      const a = base.getPointAtLength(Math.max(0, L - 1.5));
      const b = base.getPointAtLength(Math.min(len, L + 1.5));
      const th = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      if (!headingReady) {
        heading = th;
        headingReady = true;
      } else {
        const diff = ((th - heading + 540) % 360) - 180;
        heading += diff * (1 - Math.exp(-dt / 140));
      }

      const tracking = followRef.current && (playRef.current || (progRef.current > 0 && progRef.current < 1));
      const tx = tracking ? p.x : OVERVIEW.x;
      const ty = tracking ? p.y : OVERVIEW.y;
      const tw = tracking ? FOLLOW_W : OVERVIEW.w;
      const kp = 1 - Math.exp(-dt / (tracking ? 260 : 420));
      const kz = 1 - Math.exp(-dt / 480);
      cam.x += (tx - cam.x) * kp;
      cam.y += (ty - cam.y) * kp;
      cam.w = Math.exp(Math.log(cam.w) + (Math.log(tw) - Math.log(cam.w)) * kz);

      draw();

      const settled =
        !playRef.current &&
        Math.abs(tx - cam.x) < cam.w * 0.0008 &&
        Math.abs(ty - cam.y) < cam.w * 0.0008 &&
        Math.abs(Math.log(tw / cam.w)) < 0.002;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };

    kick.current = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    kick.current();

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      kick.current = () => {};
    };
  }, [route]);

  const done = pct >= 100;
  const toggle = () => {
    if (progRef.current >= 1) {
      progRef.current = 0;
      lastPct.current = 0;
      setPct(0);
    }
    playRef.current = !playRef.current;
    setPlaying(playRef.current);
    kick.current();
  };
  const restart = () => {
    playRef.current = false;
    progRef.current = 0;
    lastPct.current = 0;
    setPlaying(false);
    setPct(0);
    kick.current();
  };
  const toggleFollow = () => {
    followRef.current = !followRef.current;
    setFollow(followRef.current);
    kick.current();
  };

  const labeled = route.stops.map((c, i) => ({ c, i })).filter(({ c }) => c.label);
  const progress = pct / 100;
  let here = route.stops[0].name;
  labeled.forEach(({ c, i }) => {
    if (fracs[i] !== undefined && progress >= fracs[i]) here = c.name;
  });
  const ovH = OVERVIEW.w * ASPECT;
  const status = done ? 'Udah sampai' : playing ? 'Jalan' : pct > 0 ? 'Dijeda' : 'Belum jalan';

  const ticker = [...route.stops.map((c) => c.name), 'Estimasi 21 sampai 23 Okt', RESI];

  return (
    <main>
      <section className="hero2">
        <div className="hero2-pos" aria-hidden="true">
          <motion.div initial={{ scale: 0.55, rotate: -28 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.1, ease: 'easeOut' }}>
            <div className="flower-shape" />
          </motion.div>
        </div>
        <div className="hero2-copy">
          <h1 className="title">
            Bunga buat
            <br />
            {NAME}
          </h1>
          <p className="lead">
            Udah lewat Cikarang, tinggal nyusur Pantura ke {destName}. Katanya nyampe tanggal 21 sampai 23 Okt, sabar ya.
          </p>
          <div className="actions hero-actions-wrap">
            <a className="btn" href="#peta">
              Lihat jalannya <ArrowRight />
            </a>
            <Link className="btn ghost" to="/bunga">
              Buka suratnya
            </Link>
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-4, -1, -4] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="inline-block"
            >
              <Sticker name="biu" size={78} className="hero-cute-bear" />
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee items={ticker} />

      <section className="wrap statement-sec">
        <h2 className="sr">Pesan dari bunganya</h2>
        <Reveal>
          <p className="statement">
            Bunga ini berangkat dari Jampang Kulon <Flower className="inl text-accent" /> nyusur Pantura <Flower className="inl text-accent" /> sampai ke {destName}.
            Bawa satu pesan doang <Flower className="inl text-accent" />: aku kangen kamu, {NAME}.
          </p>
        </Reveal>
      </section>

      <DashExtras />

      <section id="peta" className="wrap sec" aria-labelledby="h-peta">
        <Reveal>
          <h2 id="h-peta" className="sec-head">
            Jalannya bunga
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="runlane" aria-hidden="true">
            <Sticker name="run" size={84} className={playing ? 'go' : ''} />
          </div>
          <div className="mapcard" aria-label="Peta perjalanan paket">
            <div className="mapbar">
              <span>Jampang Kulon ke Blitar</span>
              <span className="chip">{status}</span>
            </div>
            <div className="mapwrap">
              <svg
                ref={svgRef}
                className="map"
                viewBox={`${OVERVIEW.x - OVERVIEW.w / 2} ${OVERVIEW.y - ovH / 2} ${OVERVIEW.w} ${ovH}`}
                preserveAspectRatio="xMidYMid slice"
                role="img"
                aria-label={`Rute paket dari Jampang Kulon ke ${destName}`}
              >
                <path d={GRID} className="grid" />
                {LAND.map((d, i) => (
                  <g key={i}>
                    <path d={d} className="land" />
                  </g>
                ))}
                <text x={px(109.6)} y={py(-5.55)} className="sea">Laut Jawa</text>
                <text x={px(108.2)} y={py(-8.95)} className="sea">Samudra Hindia</text>

                <path ref={baseRef} d={route.d} className="route-base" />
                <path ref={trailRef} d={route.d} className="route-trail" strokeDasharray="0 99999" />

                {route.stops.map((c, i) =>
                  c.label ? (
                    <g key={c.name} ref={(el) => { cityEls.current[i] = el; }} className="cityg" transform={`translate(${px(c.lon)} ${py(c.lat)})`}>
                      <circle r="1.1" />
                      <text x={c.side === 'l' ? -2.2 : 2.2} y="1" fontSize="3" textAnchor={c.side === 'l' ? 'end' : 'start'}>{c.name}</text>
                    </g>
                  ) : null
                )}

                <g ref={goalRef} className="goal" transform={`translate(${route.end[0]} ${route.end[1]})`}>
                  <circle className="pulse" r="7" />
                  <path className="scrawl-line" d="M-6.5 -5.2Q-4.6 -1.6 -2 -0.6M-3.6 -0.5L-2 -0.6L-2.6 -2.3" />
                  <text className="scrawl" x="-7" y="-6" textAnchor="end" fontSize="4.6">sampai sini</text>
                </g>

                <g ref={parcelRef} transform={`translate(${route.start[0]} ${route.start[1]}) scale(0.2)`}>
                  <ellipse cx="0" cy="3" rx="19" ry="10" fill="#000" opacity=".18" />
                  <rect x="-15" y="-10" width="30" height="20" rx="3" fill="var(--soft)" stroke="var(--ink)" strokeWidth="1.2" />
                  <path d="M-15 0H15M0-10V10" stroke="var(--accent)" strokeWidth="4" />
                  <circle r="4.6" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.6" />
                </g>
              </svg>

              <svg className="compass" viewBox="-20 -20 40 40" aria-hidden="true">
                <circle r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M0-13 3.5 0H-3.5Z" fill="var(--accent)" />
                <path d="M0 13 3.5 0H-3.5Z" fill="currentColor" opacity=".35" />
                <text y="-16.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor">U</text>
              </svg>

              <div className="mapctl">
                <button className="chipbtn" onClick={toggle} aria-label={playing ? 'Jeda' : 'Mulai'}>
                  {playing ? <Pause /> : <Play />}
                  {playing ? 'Jeda' : done ? 'Putar lagi' : pct > 0 ? 'Lanjut' : 'Putar'}
                </button>
                <button className="chipbtn" onClick={toggleFollow} aria-pressed={follow}>
                  <MapPin /> {follow ? 'Ikut paket' : 'Satu Jawa'}
                </button>
                {pct > 0 && (
                  <button className="chipbtn" onClick={restart}>
                    Ulang
                  </button>
                )}
              </div>
            </div>

            <div className="mapstatus">
              <div>
                <small>Lagi di</small>
                <strong>{done ? destName : here}</strong>
              </div>
              <div className="meter" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <b>{pct}%</b>
            </div>
            <ul className="passed">
              {labeled.map(({ c, i }) => (
                <li key={c.name} className={fracs[i] !== undefined && progress >= fracs[i] ? 'on' : ''}>
                  {fracs[i] !== undefined && progress >= fracs[i] && <Check />}
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="band soft" aria-labelledby="h-foto">
        <div className="wrap gal">
          <div>
            <Reveal>
              <h2 id="h-foto">Sambil nunggu</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead big">Pencet bingkainya buat ganti foto.</p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <Gallery />
          </Reveal>
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="h-resi">
        <Reveal>
          <h2 id="h-resi" className="sec-head">
            Catatan kurirnya
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="paper resi">
            <div className="resi-head">
              <span>SPX Hemat</span>
              <span>{RESI}</span>
            </div>
            <ol className="timeline">
              {EVENTS.map((e) => {
                const isDone = e.at === 0 || progress >= e.at;
                return (
                  <li key={e.title} className={isDone ? 'on' : ''}>
                    <i>{isDone && <Check />}</i>
                    <time>{e.time}</time>
                    <div>
                      <b>{e.title}</b>
                      <p>{e.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="barcode" aria-hidden="true" />
          </div>
        </Reveal>
      </section>

      <CtaBand to="/game" word="KOCOK" text="Malam ini, kartu yang milih." />
    </main>
  );
}
