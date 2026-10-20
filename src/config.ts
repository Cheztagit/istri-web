/** Nama yang muncul di semua halaman. Ganti di sini kalau mau. */
export const NAME = 'Nadya cantiku';

/**
 * Isi surat di halaman Surat. Satu elemen = satu paragraf.
 * Kalau tulisannya panjang, kotak suratnya bisa digulir.
 */
export const LETTER: string[] = [
  'Di antara riuhnya dunia yang tak henti berputar, aku ingin jujur bahwa Kak Nadya adalah satu-satunya nama yang selalu berhasil menenangkan setiap detak jantungku yang gentar,',
  'karena bagiku, hadirmu bukan sekadar sosok yang kukagumi melainkan cahaya tak pudar sekaligus pelabuhan ternyaman saat hatiku terasa kasar, bahkan setiap tutur katamu terasa seperti embun pagi yang menyembuhkan jiwaku yang sepi,',
  'maka izinkan aku mengakui dari lubuk hati terdalam bahwa aku benar-benar menyayangimu dan sangat bersyukur atas anugerah kehadiranmu yang menjadi pelita di waktu kelamku,',
  'sehingga doa yang selalu kupanjatkan dengan sabar hanyalah agar semesta mendekapmu dalam damai, menjauhkanmu dari segala duka, serta memastikan senyummu terus berpijar karena melihatmu bahagia adalah satu-satunya hal yang paling berarti bagiku saat ini.',
];

export interface Shot {
  /** Foto kalian sendiri. Taruh di folder public/foto dengan nama ini. */
  src: string;
  /** Foto suasana yang dipakai sampai foto sendiri ada. */
  fallback: string;
  alt: string;
  caption: string;
}

const atmos = (id: number) => `https://picsum.photos/id/${id}/1000/1250`;

/**
 * Foto-foto Nadya. Sudah ada di public/foto/.
 */
export const SHOTS: Shot[] = [
  { src: '/foto/1.jpg', fallback: atmos(641), alt: 'Nadya selfie dengan senyum manis', caption: 'Senyum yang selalu bikin kangen' },
  { src: '/foto/2.jpg', fallback: atmos(853), alt: 'Nadya cantik di malam hari', caption: 'Cantik mau gelap mau terang' },
  { src: '/foto/3.jpg', fallback: atmos(626), alt: 'Nadya pose lucu dengan tangan', caption: 'Lucunya nggak habis-habis' },
  { src: '/foto/4.jpg', fallback: atmos(640), alt: 'Nadya senyum dengan tangan di dagu', caption: 'Tenang, kayak kalau ada kamu' },
  { src: '/foto/5.jpg', fallback: atmos(77), alt: 'Nadya cantik dengan kacamata', caption: 'Pake kacamata makin cantik' },
  { src: '/foto/6.jpg', fallback: atmos(1049), alt: 'Nadya selfie manis', caption: 'Yang paling aku rinduin' },
];

export const CREDITS =
  'Dibuat dengan penuh cinta buat Nadya.';

export interface SongConfig {
  title: string;
  artist: string;
  src: string;
}

/** Lagu latar yang otomatis diputar. Simpan file di public/audio/ */
export const SONG: SongConfig = {
  title: 'Our Special Song',
  artist: 'Playing for you 💕',
  src: '/audio/lagu.mp3',
};
