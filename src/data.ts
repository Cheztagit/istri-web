export const RESI = 'SPXID06453753216A';

export interface TrackEvent {
  time: string;
  title: string;
  desc: string;
  /** posisi di rute (0..1) saat peta diputar ulang; 0 = sudah lewat sebelum berangkat */
  at: number;
  estimate?: boolean;
}

export const EVENTS: TrackEvent[] = [
  { time: '19 Okt, 12:30', title: 'Pesanan dibuat', desc: 'Bunganya udah dibungkus.', at: 0 },
  { time: '19 Okt, 13:04', title: 'Diserahkan ke kurir', desc: 'Nunggu kurir SPX ambil.', at: 0 },
  { time: '19 Okt, 18:23', title: 'Sampai di hub Jampang Kulon', desc: 'Sukabumi, Jampang Kulon First Mile Hub.', at: 0 },
  { time: '19 Okt, 20:50', title: 'Berangkat dari hub', desc: 'Menuju Transit Point Bogor.', at: 0.001 },
  { time: '20 Okt, 02:47', title: 'Disortir di Bogor', desc: 'Lanjut ke Cikarang Barat lewat darat.', at: 0.12 },
  { time: '20 Okt, 05:58', title: 'Sampai di Cikarang Barat', desc: 'Kab. Bekasi, Cikarang Barat DC.', at: 0.2 },
  { time: '20 Okt, 08:28', title: 'Diproses di Cikarang Barat', desc: 'Lagi disortir, abis ini jalan ke Jawa Timur.', at: 0.201 },
  { time: '21 sampai 23 Okt', title: 'Sampai di Kab. Blitar', desc: 'Perkiraan dari SPX, bukan jam pasti.', at: 1, estimate: true },
];
