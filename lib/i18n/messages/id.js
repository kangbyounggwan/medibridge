const id = {
  language: { title: "Bahasa" },
  exitHint: "Tekan sekali lagi untuk keluar",

  nav: {
    home: "Beranda",
    consult: "Konsultasi AI",
    hospitals: "Klinik",
    emergency: "Darurat",
  },

  title: {
    home: "MediBridge",
    chat: "Konsultasi Medis AI",
    hospitalList: "Cari Klinik",
    hospitalChat: "Obrolan Klinik",
    emergency: "Cari UGD",
  },

  common: {
    back: "Kembali",
    retry: "Coba lagi",
    loadMore: "Muat lainnya",
    loadingMore: "Memuat...",
    noticeTitle: "Perhatian",
  },

  home: {
    heroA: "Untuk warga asing di Korea,",
    heroHighlight: "platform AI",
    heroB: "penghubung rumah sakit",
    subtitle: "AI-based Hospital Linking Platform for Foreigners in Korea",
    consultTitle: "Mulai konsultasi AI",
    consultDesc: "Masukkan gejala, AI akan memandu Anda",
    hospitalTitle: "Cari klinik",
    hospitalDesc: "Klinik di dekat Anda",
    emergencyTitle: "UGD",
    emergencyDesc: "Tempat yang bisa dituju sekarang",
    clinicTitle: "Anda mengelola klinik?",
    clinicDesc: "Daftarkan dan terima laporan bulanan",
  },

  chat: {
    subtitle: "Masukkan gejala Anda dan AI akan membantu konsultasi.",
    disclaimer:
      "Untuk diagnosis yang akurat, Anda harus diperiksa oleh tenaga medis.",
    label: "Jelaskan gejala Anda secara rinci",
    placeholder:
      "Contoh: Sejak kemarin kepala saya sakit, demam, dan batuk parah...",
    submit: "Dapatkan konsultasi AI",
    submitting: "Sedang berkonsultasi...",
    clear: "Hapus",
    errorTitle: "Kesalahan",
    emptyError: "Silakan masukkan gejala Anda.",
    resultTitle: "Hasil konsultasi AI",
    sourceTitle: "Referensi",
    warningTitle: "Pemberitahuan penting",
    warning1:
      "Konsultasi ini hanya sebagai referensi dan tidak dapat menggantikan diagnosis medis.",
    warning2:
      "Jika gejala parah atau diduga darurat, segera hubungi 119 atau kunjungi UGD.",
    warning3:
      "Untuk diagnosis dan pengobatan yang akurat, Anda harus diperiksa oleh tenaga medis.",
    nextTitle: "Ingin rekomendasi klinik di dekat Anda?",
    nextLink: "Ya, tolong rekomendasikan",
  },

  hospitals: {
    symptomsTitle: "Gejala yang dikonsultasikan",
    count: "{count} dalam radius {km}km",
    loading: "Mencari klinik terdekat...",
    locationError: "Lokasi tidak terdeteksi. Mohon izinkan akses lokasi.",
    networkError: "Gagal memuat data klinik. Periksa koneksi Anda.",
    empty: "Tidak ada klinik terdaftar dalam radius {km}km.",
    refind: "Cari lagi",
    notice1: "Informasi klinik dapat berubah sewaktu-waktu.",
    notice2: "Periksa jam praktik dan ketersediaan janji temu terlebih dahulu.",
    notice3: "Dalam keadaan darurat, hubungi 119.",
  },

  emergency: {
    callTitle: "Hubungi 119",
    callDesc: "Jika nyawa terancam, hubungi lebih dulu",
    nearby: "UGD terdekat",
    count: "{count} dalam radius {km}km",
    loading: "Mencari UGD terdekat...",
    locationError: "Lokasi tidak terdeteksi. Mohon izinkan akses lokasi.",
    networkError: "Gagal memuat data UGD. Periksa koneksi Anda.",
    empty: "Tidak ada fasilitas gawat darurat dalam radius {km}km.",
    refind: "Cari lagi",
    pendingHint:
      "Daftar akan muncul otomatis setelah akses disetujui. Sementara itu, gunakan tombol 119 di atas.",
    notice1: "Ketersediaan tempat tidur berubah secara real-time.",
    notice2: "Lebih aman menelepon UGD sebelum berangkat.",
    notice3:
      "Jika pasien tidak sadar atau pendarahan hebat, jangan dipindahkan — hubungi 119.",
  },

  hospitalChat: {
    loadingHospital: "Memuat informasi klinik...",
    placeholder: "Ketik pertanyaan Anda...",
    inputLabel: "Masukan pesan",
    send: "Kirim",
    reserve: "Ya, saya ingin memesan",
    kakao: "Terima notifikasi via KakaoTalk",
    kakaoDone: "Notifikasi KakaoTalk telah diatur.",
    reserveTitle: "Pilih jadwal",
    datetime: "Pilih tanggal dan waktu",
    cancel: "Batal",
    confirm: "Konfirmasi pemesanan",
    greeting: "Halo, ini {name}.",
    specialties: "Kami mengkhususkan diri pada {list}.",
    typeIs: "Kami adalah {type}.",
    doctor: "{doctor} yang menangani pemeriksaan.",
    hours: "Jam praktik: {hours}",
    symptomNote:
      'Kami melihat Anda datang dengan gejala "{symptoms}" dari konsultasi AI.',
    askAnything: "Jangan ragu bertanya kapan saja!",
    fallback: "Maaf, kami belum menyiapkan jawaban untuk pertanyaan tersebut.",
  },
};

export default id;
