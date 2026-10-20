export type Level = 1 | 2 | 3;

export interface Card {
  id: number;
  level: Level;
  title: string;
  desc: string;
  /** tempat yang cocok */
  where: string;
  /** kira-kira berapa lama */
  time: string;
}

export const LEVELS: { level: Level; label: string }[] = [
  { level: 1, label: 'Hangat' },
  { level: 2, label: 'Panas' },
  { level: 3, label: 'Nakal banget' },
];

/** 42 kartu. Tiap kocokan mengambil 5 yang belum keluar, jadi nggak ada yang kembar sampai tumpukannya habis. */
export const CARDS: Card[] = [
  // ---------- Hangat ----------
  { id: 1, level: 1, title: 'Ciuman Sepuluh Detik', desc: 'Cium aku, terus hitung sampai sepuluh. Kalau hitunganmu kacau, berarti ciumannya berhasil.', where: 'Dapur', time: '2 menit' },
  { id: 2, level: 1, title: 'Pijat Manja', desc: 'Sepuluh menit pijat punggung sama bahu. HP taruh dulu. Yang dipijat cuma boleh bilang "di situ" atau "jangan berhenti".', where: 'Kamar', time: '10 menit' },
  { id: 3, level: 1, title: 'Bisikan Nakal', desc: 'Bisikin satu hal yang kamu pengin malam ini. Dia nggak boleh jawab, senyum aja.', where: 'Di mana aja', time: '1 menit' },
  { id: 4, level: 1, title: 'Dansa Lampu Redup', desc: 'Satu lagu, lampu dimatiin, rapet banget. Lagunya kamu yang pilih.', where: 'Ruang tamu', time: '4 menit' },
  { id: 5, level: 1, title: 'Tatap Semenit', desc: 'Saling tatap satu menit penuh, nggak boleh ngomong. Yang ketawa duluan bayar satu ciuman di tempat pilihan lawannya.', where: 'Sofa', time: '2 menit' },
  { id: 6, level: 1, title: 'Peluk dari Belakang', desc: 'Pas dia lagi sibuk, peluk dari belakang, cium tengkuknya pelan-pelan. Abis itu bilang kamu lagi mikirin apa.', where: 'Dapur', time: '3 menit' },
  { id: 7, level: 1, title: 'Mandi Bareng', desc: 'Air hangat, saling sabunin punggung, nggak usah buru-buru. Siapin handuknya dari tadi.', where: 'Kamar mandi', time: '20 menit' },
  { id: 8, level: 1, title: 'Tulisan di Punggung', desc: 'Tulis satu kata di punggungnya pakai jari. Dia tebak. Kalau salah, kata berikutnya harus lebih nakal.', where: 'Kamar', time: '5 menit' },
  { id: 9, level: 1, title: 'Selimut Berdua', desc: 'Satu selimut buat berdua, lampu mati. Belum boleh tidur sebelum masing-masing bisikin satu rahasia kecil.', where: 'Kamar', time: '15 menit' },

  // ---------- Panas ----------
  { id: 10, level: 2, title: 'Mata Tertutup', desc: 'Tutup matanya pakai kain, terus cium atau sentuh tiga tempat. Dia tebak di mana. Yang meleset dapat ciuman bonus.', where: 'Kamar', time: '10 menit' },
  { id: 11, level: 2, title: 'Es Batu Pelan-Pelan', desc: 'Satu es batu dari leher ke pundak, pelan. Yang pegang es yang atur irama.', where: 'Kamar', time: '10 menit' },
  { id: 12, level: 2, title: 'Striptis Setengah Serius', desc: 'Satu lagu, satu penonton. Buka satu-satu pelan-pelan. Penonton belum boleh nyentuh sebelum lagunya abis.', where: 'Kamar', time: '5 menit' },
  { id: 13, level: 2, title: 'Kenalan Lagi', desc: 'Anggap kita orang asing yang ketemu di bar hotel. Kenalan dari nol, rayu sampai dia mau ikut naik.', where: 'Dari pintu depan', time: '20 menit' },
  { id: 14, level: 2, title: 'Pakai Bajuku', desc: 'Tukeran baju. Kamu pakai punyanya, dia pakai punyamu. Yang duluan nggak tahan, kalah.', where: 'Kamar', time: '10 menit' },
  { id: 15, level: 2, title: 'Sepuluh Kecupan', desc: 'Sepuluh kecupan di sepuluh tempat, urutannya rahasia. Dia harus nebak di mana yang terakhir.', where: 'Kamar', time: '10 menit' },
  { id: 16, level: 2, title: 'Nonton Cuma Alasan', desc: 'Putar film apa aja. Sepuluh menit pertama nonton beneran, abis itu filmnya jalan sendiri.', where: 'Sofa', time: '30 menit' },
  { id: 17, level: 2, title: 'Tanpa Kata', desc: 'Dua puluh menit cuma pakai sentuhan sama tatapan. Siapa yang bersuara duluan harus nurutin maunya lawan.', where: 'Kamar', time: '20 menit' },
  { id: 18, level: 2, title: 'Hukuman Manis', desc: 'Suit tiga kali. Yang kalah nurutin satu permintaan nakal dari yang menang. Kata "cukup" tetap berlaku.', where: 'Kamar', time: '10 menit' },
  { id: 19, level: 2, title: 'Kode Rahasia', desc: 'Pilih satu kata sandi. Sepanjang malam, tiap kata itu keluar, yang lagi sibuk wajib berhenti dan nyium dia.', where: 'Seluruh rumah', time: 'Sepanjang malam' },

  // ---------- Nakal banget ----------
  { id: 20, level: 3, title: 'Kamu Pegang Kendali', desc: 'Malam ini satu orang yang mimpin, satunya cuma boleh bilang "iya, sayang". Besok gantian.', where: 'Kamar', time: '45 menit' },
  { id: 21, level: 3, title: 'Kejutan di Balik Baju', desc: 'Pakai sesuatu yang belum pernah dia lihat, jangan kasih tahu apa. Biar dia nemuin sendiri.', where: 'Kamar', time: '30 menit' },
  { id: 22, level: 3, title: 'Peta Harta Karun', desc: 'Tulis petunjuk dari pintu depan sampai kamar. Tiap titik ada satu perintah nakal yang harus dituruti.', where: 'Seluruh rumah', time: '30 menit' },
  { id: 23, level: 3, title: 'Rayuan Tanpa Rem', desc: 'Lima belas menit kamu cuma boleh muji dan ngerayu dia, pakai kata paling berani yang kamu punya.', where: 'Kamar', time: '15 menit' },
  { id: 24, level: 3, title: 'Penginapan Kita Sendiri', desc: 'Pesan satu malam di penginapan kecil. Pesannya cuma satu: nggak usah bawa apa-apa selain diri sendiri.', where: 'Penginapan', time: 'Semalam' },
  { id: 25, level: 3, title: 'Jujur Jam Sebelas', desc: 'Tanya dia: apa yang paling pengin dicoba tapi masih malu ngomong? Dengerin tanpa nge-judge, terus pilih satu buat dicoba.', where: 'Kamar', time: '20 menit' },
  { id: 26, level: 3, title: 'Dua Pilihan Nakal', desc: 'Masing-masing tulis tiga ide nakal di kertas, lipat, acak. Tarik satu. Yang kena, langsung lakuin.', where: 'Kamar', time: '30 menit' },
  { id: 27, level: 3, title: 'Tengah Malam', desc: 'Bangunin dia jam dua pagi dengan cara paling manis sekaligus paling nakal yang kamu bisa.', where: 'Kamar', time: '15 menit' },
  { id: 28, level: 3, title: 'Bukan Cuma Kamar', desc: 'Malam ini kamar bukan satu-satunya tempat. Pilih ruangan lain, kunci pintu, matiin notifikasi.', where: 'Pilih sendiri', time: '40 menit' },
  { id: 29, level: 3, title: 'Pagi yang Telat', desc: 'Besok alarm dimatiin, HP dimatiin, dan kita nggak keluar kamar sebelum jam sepuluh.', where: 'Kamar', time: 'Sampai siang' },
  { id: 30, level: 3, title: 'Janji di Dompet', desc: 'Tulis satu janji nakal buat akhir pekan, lipat kecil, selipin di dompetnya. Dibukanya pas dia lagi sendirian.', where: 'Dompetnya', time: '3 menit' },
  { id: 31, level: 2, title: 'Pijat Minyak Hangat', desc: 'Minyak pijat hangat, mulai dari betis naik pelan-pelan. Yang dipijat nggak boleh protes arah tangannya.', where: 'Kamar', time: '20 menit' },
  { id: 32, level: 2, title: 'Cium dari Ujung ke Ujung', desc: 'Mulai dari jari tangan, naik ke pergelangan, lengan, pundak, leher. Berhenti kalau dia narik napas dalam.', where: 'Kamar', time: '10 menit' },
  { id: 33, level: 2, title: 'Duduk di Pangkuan', desc: 'Dia duduk di pangkuanmu, hadap-hadapan, tangan nggak boleh ke mana-mana selain di rambut. Lima menit, cuma ciuman.', where: 'Sofa', time: '5 menit' },
  { id: 34, level: 3, title: 'Lampu Mati, Telapak Ngomong', desc: 'Gelap total. Cuma telapak tangan yang boleh ngomong. Kenali lagi tiap lekuk yang kamu hafal.', where: 'Kamar', time: '25 menit' },
  { id: 35, level: 3, title: 'Tangan Diikat Syal', desc: 'Pergelangan dia diikat syal yang longgar, bisa lepas kapan aja. Selama itu kamu yang atur semuanya, pelan atau cepat.', where: 'Kamar', time: '30 menit' },
  { id: 36, level: 3, title: 'Depan Cermin', desc: 'Berdiri depan cermin. Dia lihat, kamu ceritain apa yang bakal kamu lakuin, terus lakuin satu-satu.', where: 'Kamar', time: '20 menit' },
  { id: 37, level: 3, title: 'Kamu Yang Dilayani', desc: 'Satu malam penuh dia nggak boleh ngapa-ngapain. Semua kamu yang layani, dari ujung kepala sampai ujung kaki.', where: 'Kamar', time: '60 menit' },
  { id: 38, level: 3, title: 'Cokelat dan Madu', desc: 'Sesuatu yang manis, lidah yang sabar, dan satu aturan: nggak ada yang boleh selesai sebelum dia minta.', where: 'Kamar', time: '30 menit' },
  { id: 39, level: 3, title: 'Peran Rahasia', desc: 'Pilih satu peran: bos dan sekretaris, tamu dan pemijat, atau pilih sendiri. Mainin dari pintu sampai pagi.', where: 'Kamar', time: '45 menit' },
  { id: 40, level: 3, title: 'Tiga Kali Minta', desc: 'Dia boleh minta tiga hal sepanjang malam, apa pun, dan kamu nurut tanpa nawar. Kata \"cukup\" tetap berlaku.', where: 'Kamar', time: 'Semalam' },
  { id: 41, level: 3, title: 'Pelan Sampai Subuh', desc: 'Nggak ada yang buru-buru. Tiap kali hampir, berhenti, tatap, ulang dari awal. Sampai dia nyerah dengan senyum.', where: 'Kamar', time: 'Sampai subuh' },
  { id: 42, level: 3, title: 'Giliran Dia Nulis Skenario', desc: 'Dia tulis skenario semalam di kertas, kamu nggak boleh intip. Kamu cuma boleh ikutin, satu adegan satu adegan.', where: 'Kamar', time: '60 menit' },
];
