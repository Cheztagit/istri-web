/** Peta Jawa: 1 derajat = 100 unit. x = bujur, y = lintang (utara di atas). */
export type XY = [number, number];
type LL = [number, number]; // [bujur, lintang]

export const px = (lon: number) => (lon - 105) * 100;
export const py = (lat: number) => (-5.7 - lat) * 100;
const proj = (a: LL[]): XY[] => a.map(([lo, la]) => [px(lo), py(la)]);

/** Kurva halus (Catmull-Rom) lewat semua titik. */
export function smooth(pts: XY[], closed = false): string {
  const n = pts.length;
  const get = (i: number): XY => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

const JAVA: LL[] = [
  // pantai utara, barat ke timur (Merak sampai Banyuwangi)
  [105.99, -5.92], [106.12, -5.9], [106.3, -5.93], [106.5, -6.0], [106.7, -6.05], [106.85, -6.1], [107.0, -5.95],
  [107.3, -6.0], [107.65, -6.2], [107.95, -6.28], [108.3, -6.33], [108.45, -6.42], [108.57, -6.72], [108.7, -6.8],
  [109.0, -6.85], [109.3, -6.88], [109.68, -6.87], [109.95, -6.88], [110.2, -6.92], [110.42, -6.94], [110.55, -6.9],
  [110.6, -6.7], [110.7, -6.52], [110.95, -6.42], [111.1, -6.55], [111.5, -6.7], [111.85, -6.75], [112.15, -6.9],
  [112.5, -6.9], [112.65, -7.12], [112.78, -7.2], [112.85, -7.5], [113.0, -7.65], [113.4, -7.72], [113.9, -7.65],
  [114.15, -7.8], [114.4, -8.15], [114.43, -8.4],
  // pantai selatan, timur ke barat (Banyuwangi sampai Ujung Kulon)
  [114.4, -8.7], [114.1, -8.65], [113.9, -8.5], [113.45, -8.4], [113.0, -8.25], [112.6, -8.38], [112.2, -8.3],
  [111.7, -8.3], [111.1, -8.2], [110.7, -8.18], [110.3, -8.0], [110.0, -7.95], [109.65, -7.75], [109.2, -7.7],
  [108.9, -7.7], [108.45, -7.72], [108.0, -7.75], [107.75, -7.5], [107.2, -7.4], [106.85, -7.35], [106.45, -7.4],
  [106.6, -7.0], [106.4, -6.95], [106.3, -6.9], [106.0, -6.8], [105.65, -6.75], [105.3, -6.8], [105.25, -6.75],
  [105.35, -6.5], [105.65, -6.45], [105.85, -6.3], [106.05, -6.05],
];
const MADURA: LL[] = [[112.72, -7.02], [113.3, -6.9], [113.9, -6.9], [114.15, -7.05], [113.7, -7.2], [113.2, -7.18], [112.8, -7.12]];
const BALI: LL[] = [[114.6, -8.15], [115.1, -8.07], [115.55, -8.2], [115.7, -8.45], [115.7, -8.75], [115.2, -8.85], [114.85, -8.75], [114.6, -8.45]];

export const LAND = [JAVA, MADURA, BALI].map((a) => smooth(proj(a), true));

export interface City {
  name: string;
  lon: number;
  lat: number;
  /** false = hanya titik lewat, tidak diberi label */
  label: boolean;
  /** sisi label terhadap titik, supaya tidak saling tumpuk */
  side: 'l' | 'r';
}

const C = (name: string, lon: number, lat: number, side: 'l' | 'r' = 'r', label = true): City => ({ name, lon, lat, label, side });

/** Rute paket: Jampang Kulon, Bogor, Cikarang, lewat Pantura ke Semarang, lalu ke selatan-timur sampai Blitar. */
export const STOPS: City[] = [
  C('Jampang Kulon', 106.6, -7.12, 'r'),
  C('Bogor', 106.8, -6.6, 'l'),
  C('Cikarang', 107.15, -6.3, 'r'),
  C('Karawang', 107.5, -6.38, 'r', false),
  C('Indramayu', 108.2, -6.45, 'r', false),
  C('Cirebon', 108.55, -6.72, 'r'),
  C('Tegal', 109.14, -6.87, 'r', false),
  C('Pekalongan', 109.68, -6.92, 'r', false),
  C('Semarang', 110.42, -6.99, 'r'),
  C('Solo', 110.83, -7.57, 'r'),
  C('Madiun', 111.52, -7.63, 'r', false),
  C('Kediri', 112.02, -7.82, 'r', false),
  C('Blitar', 112.17, -8.1, 'r'),
];

export interface Route {
  d: string;
  stops: City[];
  start: XY;
  end: XY;
}

const pts: XY[] = STOPS.map((c) => [px(c.lon), py(c.lat)]);
export const ROUTE: Route = { d: smooth(pts), stops: STOPS, start: pts[0], end: pts[pts.length - 1] };

/** Tampilan seluruh pulau; ASPECT harus sama dengan rasio kotak peta di CSS (.mapwrap). */
export const ASPECT = 0.55;
export const OVERVIEW = { x: 505, y: 150, w: 1130 };

/** Garis bujur dan lintang tiap 1 derajat, gaya peta lama. */
export const GRID = [106, 108, 110, 112, 114]
  .map((lon) => `M${px(lon)} -200V600`)
  .concat([-6, -7, -8, -9].map((lat) => `M-100 ${py(lat)}H1200`))
  .join('');
