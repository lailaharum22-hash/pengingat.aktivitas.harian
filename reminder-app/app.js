/* =====================================================
   REMINDER APP v2 — JavaScript Logic
   All 6 Revisions Applied
   ===================================================== */

// ============ STATE ============
let state = {
  userRole: 'umum',
  userName: '',
  userEmail: '',
  loginType: 'email',
  selectedSound: 'bell',
  remindBefore: 5,
  reminderActive: true,
  schedules: [],
  notifLog: [],
  activityHistory: [],
  customNotifs: [],
  streak: 0,
  darkMode: false,
  isLoggedIn: false
};

// ============ CONSTANTS ============
const roleEmoji = { umum: '🌟', pekerja: '💼', mahasiswa: '🎓', pelajar: '📚' };

const catEmoji = {
  kerja: '💼', pribadi: '🏠', kesehatan: '❤️',
  olahraga: '🏃', ibadah: '🕌', makan: '🍽️', lainnya: '📌'
};

const roleTips = {
  umum: [
    { icon: '🌅', text: 'Mulai hari dengan rutinitas pagi yang konsisten' },
    { icon: '⏰', text: 'Gunakan aturan 2 menit: jika bisa diselesaikan dalam 2 menit, lakukan sekarang' },
    { icon: '💧', text: 'Minum air putih minimal 8 gelas sehari' },
    { icon: '🌙', text: 'Tidur 7–8 jam semalam untuk produktivitas maksimal' }
  ],
  pekerja: [
    { icon: '📊', text: 'Gunakan teknik time blocking untuk fokus bekerja' },
    { icon: '☕', text: 'Ambil jeda 5 menit setiap jam untuk mencegah burnout' },
    { icon: '📧', text: 'Cek email hanya 2–3 kali sehari untuk menjaga fokus' },
    { icon: '🎯', text: 'Tentukan 3 prioritas utama di awal hari kerja' }
  ],
  mahasiswa: [
    { icon: '📖', text: 'Gunakan teknik Pomodoro: 25 menit belajar, 5 menit istirahat' },
    { icon: '📝', text: 'Review catatan kuliah dalam 24 jam setelah kelas' },
    { icon: '🗂️', text: 'Buat mind map untuk membantu memahami materi kompleks' },
    { icon: '👥', text: 'Belajar kelompok bisa meningkatkan pemahaman 40%' }
  ],
  pelajar: [
    { icon: '📚', text: 'Belajar di waktu yang sama setiap hari membentuk kebiasaan' },
    { icon: '🎮', text: 'Atur waktu bermain sebagai reward setelah belajar' },
    { icon: '✏️', text: 'Tulis ulang catatan untuk membantu daya ingat' },
    { icon: '🏃', text: 'Olahraga 30 menit meningkatkan konsentrasi belajar' }
  ]
};

// ============ DEFAULT DAILY ACTIVITIES (bangun tidur → tidur) ============
const defaultDailyActivities = [
  { title: 'Bangun Tidur', category: 'pribadi', startTime: '05:00', endTime: '05:15', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: 'Mulai hari dengan penuh semangat!' },
  { title: 'Mandi Pagi', category: 'kesehatan', startTime: '05:15', endTime: '05:35', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: '' },
  { title: 'Sholat Subuh', category: 'ibadah', startTime: '05:35', endTime: '06:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: '' },
  { title: 'Olahraga / Stretching', category: 'olahraga', startTime: '06:00', endTime: '06:30', days: ['Sen','Rab','Jum'], priority: 'sedang', note: 'Ringan saja, yang penting konsisten' },
  { title: 'Sarapan Pagi', category: 'makan', startTime: '06:30', endTime: '07:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: 'Jangan skip sarapan!' },
  { title: 'Minum Vitamin / Suplemen', category: 'kesehatan', startTime: '07:00', endTime: '07:05', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'sedang', note: '' },
  { title: 'Aktivitas Utama (Kerja/Kuliah/Sekolah)', category: 'kerja', startTime: '08:00', endTime: '12:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'tinggi', note: '' },
  { title: 'Sholat Dhuhur', category: 'ibadah', startTime: '12:10', endTime: '12:25', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: '' },
  { title: 'Makan Siang', category: 'makan', startTime: '12:25', endTime: '13:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'sedang', note: '' },
  { title: 'Istirahat Siang', category: 'pribadi', startTime: '13:00', endTime: '13:30', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'rendah', note: 'Power nap 20–30 menit sangat dianjurkan' },
  { title: 'Aktivitas Siang (Lanjutan)', category: 'kerja', startTime: '13:30', endTime: '15:30', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'tinggi', note: '' },
  { title: 'Sholat Ashar', category: 'ibadah', startTime: '15:30', endTime: '15:50', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: '' },
  { title: 'Minum Air Putih / Snack Sore', category: 'makan', startTime: '16:00', endTime: '16:15', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'rendah', note: 'Tetap terhidrasi di sore hari' },
  { title: 'Me Time / Hobi', category: 'pribadi', startTime: '16:30', endTime: '17:30', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'rendah', note: 'Lakukan sesuatu yang kamu suka' },
  { title: 'Sholat Maghrib', category: 'ibadah', startTime: '18:05', endTime: '18:20', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: '' },
  { title: 'Makan Malam', category: 'makan', startTime: '18:30', endTime: '19:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'sedang', note: '' },
  { title: 'Sholat Isya', category: 'ibadah', startTime: '19:30', endTime: '19:45', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: '' },
  { title: 'Belajar / Review Hari Ini', category: 'kerja', startTime: '20:00', endTime: '21:30', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'sedang', note: 'Review materi atau rencana besok' },
  { title: 'Waktu Keluarga / Bersantai', category: 'pribadi', startTime: '20:00', endTime: '21:00', days: ['Sab','Min'], priority: 'sedang', note: 'Quality time bersama keluarga' },
  { title: 'Persiapan Tidur', category: 'kesehatan', startTime: '21:30', endTime: '21:45', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'sedang', note: 'Skincare, gosok gigi, siapkan pakaian besok' },
  { title: 'Refleksi Harian', category: 'pribadi', startTime: '21:45', endTime: '22:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'rendah', note: 'Tulis 3 hal yang disyukuri hari ini' },
  { title: 'Tidur Malam', category: 'kesehatan', startTime: '22:00', endTime: '05:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi', note: 'Tidur cukup 7–8 jam untuk kesehatan optimal' }
];

const scheduleTemplates = {
  umum: [
    { title: 'Bangun Pagi', category: 'pribadi', startTime: '05:30', endTime: '06:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' },
    { title: 'Olahraga Pagi', category: 'olahraga', startTime: '06:00', endTime: '06:45', days: ['Sen','Rab','Jum'], priority: 'sedang' },
    { title: 'Sarapan', category: 'makan', startTime: '07:00', endTime: '07:30', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' },
    { title: 'Makan Siang', category: 'makan', startTime: '12:00', endTime: '13:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'sedang' },
    { title: 'Tidur Malam', category: 'pribadi', startTime: '22:00', endTime: '22:30', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' }
  ],
  pekerja: [
    { title: 'Morning Briefing', category: 'kerja', startTime: '08:00', endTime: '08:30', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'tinggi' },
    { title: 'Deep Work Session', category: 'kerja', startTime: '09:00', endTime: '12:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'tinggi' },
    { title: 'Makan Siang', category: 'makan', startTime: '12:00', endTime: '13:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'sedang' },
    { title: 'Email & Meeting', category: 'kerja', startTime: '14:00', endTime: '16:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'sedang' },
    { title: 'Wrap Up & Planning', category: 'kerja', startTime: '16:30', endTime: '17:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'rendah' }
  ],
  mahasiswa: [
    { title: 'Kuliah Pagi', category: 'kerja', startTime: '07:30', endTime: '09:30', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'tinggi' },
    { title: 'Belajar Mandiri', category: 'kerja', startTime: '10:00', endTime: '12:00', days: ['Sen','Rab','Jum'], priority: 'sedang' },
    { title: 'Makan Siang', category: 'makan', startTime: '12:00', endTime: '13:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'sedang' },
    { title: 'Mengerjakan Tugas', category: 'kerja', startTime: '19:00', endTime: '21:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'tinggi' },
    { title: 'Review Materi', category: 'kerja', startTime: '21:00', endTime: '21:30', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'rendah' }
  ],
  pelajar: [
    { title: 'Bangun & Mandi', category: 'pribadi', startTime: '05:30', endTime: '06:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab'], priority: 'tinggi' },
    { title: 'Sarapan', category: 'makan', startTime: '06:00', endTime: '06:30', days: ['Sen','Sel','Rab','Kam','Jum','Sab'], priority: 'tinggi' },
    { title: 'Sekolah', category: 'kerja', startTime: '07:00', endTime: '13:00', days: ['Sen','Sel','Rab','Kam','Jum','Sab'], priority: 'tinggi' },
    { title: 'Belajar Sore', category: 'kerja', startTime: '15:30', endTime: '17:00', days: ['Sen','Sel','Rab','Kam','Jum'], priority: 'sedang' },
    { title: 'Makan Malam & Istirahat', category: 'makan', startTime: '18:00', endTime: '18:30', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'sedang' }
  ]
};

// ============ AUDIO ENGINE ============
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playSound(type) {
  if (type === 'silent') return;
  const ctx = getAudioCtx();

  const sounds = {
    bell: () => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.type = 'sine'; osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8);
    },
    chime: () => {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = 'sine';
        const t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.start(t); osc.stop(t + 0.5);
      });
    },
    digital: () => {
      [1000, 1500, 1000].forEach((freq, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = 'square';
        const t = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.2, t); gain.gain.setValueAtTime(0, t + 0.1);
        osc.start(t); osc.stop(t + 0.12);
      });
    },
    nature: () => {
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.05;
      const source = ctx.createBufferSource(); source.buffer = buffer;
      const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      source.start(); source.stop(ctx.currentTime + 0.5);
      const osc = ctx.createOscillator(); const g2 = ctx.createGain();
      osc.connect(g2); g2.connect(ctx.destination);
      osc.frequency.value = 440; osc.type = 'sine';
      g2.gain.setValueAtTime(0.2, ctx.currentTime + 0.05);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime + 0.05); osc.stop(ctx.currentTime + 0.6);
    }
  };

  if (sounds[type]) try { sounds[type](); } catch(e) { console.warn('Audio error:', e); }
}

// ============ LOGIN ============
let loginTab = 'email';

function switchLoginTab(tab) {
  loginTab = tab;
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.querySelectorAll('.login-form-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`login-form-${tab}`).classList.add('active');
}

function togglePassword(id) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function handleLogin() {
  let displayName = '';
  if (loginTab === 'email') {
    const email = document.getElementById('login-email').value.trim();
    const pw = document.getElementById('login-password').value;
    if (!email || !email.includes('@')) { showToast('⚠️ Masukkan email yang valid!'); return; }
    if (!pw || pw.length < 4) { showToast('⚠️ Kata sandi minimal 4 karakter!'); return; }
    displayName = email.split('@')[0];
    state.userEmail = email;
  } else {
    const name = document.getElementById('login-username').value.trim();
    const pin = document.getElementById('login-pin').value;
    if (!name || name.length < 2) { showToast('⚠️ Nama pengguna minimal 2 karakter!'); return; }
    if (!pin || pin.length < 4) { showToast('⚠️ PIN harus 4 digit!'); return; }
    displayName = name;
  }

  state.userName = displayName;
  state.loginType = loginTab;
  state.isLoggedIn = true;
  saveState();

  // Animate out
  const card = document.querySelector('.login-card');
  card.style.transition = 'all 0.4s ease';
  card.style.opacity = '0';
  card.style.transform = 'translateY(-30px) scale(0.95)';

  setTimeout(() => {
    document.getElementById('login-page').style.display = 'none';
    // Show onboarding only if first time
    if (!state.hasCompletedOnboarding) {
      document.getElementById('onboarding-overlay').classList.remove('hidden');
      document.getElementById('ob-welcome-name').textContent = displayName;
    } else {
      document.getElementById('main-app').classList.remove('hidden');
      initApp();
    }
  }, 400);
}

// ============ ONBOARDING ============
let selectedRole = null;

function goStep(step) {
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`ob-step-${step}`).classList.add('active');
}

function selectRole(el) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedRole = el.dataset.role;
  document.getElementById('btn-next-role').disabled = false;
}

function selectSound(el) {
  document.querySelectorAll('#ob-step-3 .sound-item').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedSound = el.dataset.sound;
}

function previewSound(type, event) {
  event.stopPropagation();
  playSound(type);
}

function finishOnboarding() {
  if (selectedRole) state.userRole = selectedRole;
  state.hasCompletedOnboarding = true;
  saveState();

  const ol = document.getElementById('onboarding-overlay');
  ol.style.opacity = '0';
  ol.style.transform = 'scale(1.05)';
  ol.style.transition = 'all 0.4s ease';
  setTimeout(() => {
    ol.classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    initApp();
  }, 400);
}

// ============ MAIN APP INIT ============
function initApp() {
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(checkReminders, 30000);
  setInterval(checkCustomNotifs, 30000);

  applyRole();
  updateSidebarUser();
  renderDashboard();
  renderScheduleList();
  renderUpcoming();
  renderTips();
  renderTemplates();
  renderNotifLog();
  renderCustomNotifList();
  renderHistory();
  syncSoundSettings();
  syncRoleSettings();

  if (state.darkMode) {
    document.body.classList.add('dark-mode');
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) toggle.checked = true;
  }
  const reminderToggle = document.getElementById('reminder-toggle');
  if (reminderToggle) reminderToggle.checked = state.reminderActive;
  const remindBefore = document.getElementById('set-remind-before');
  if (remindBefore) remindBefore.value = state.remindBefore || 5;
  const setName = document.getElementById('set-name');
  if (setName) setName.value = state.userName || '';

  if ('Notification' in window && Notification.permission === 'granted') {
    const btn = document.getElementById('btn-enable-notif');
    if (btn) btn.textContent = '✅ Notifikasi Aktif';
  }
}

function updateSidebarUser() {
  const un = document.getElementById('sidebar-username');
  const av = document.getElementById('sidebar-avatar');
  if (un) un.textContent = state.userName || 'Pengguna';
  if (av) av.textContent = (state.userName || 'U').charAt(0).toUpperCase();
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  const el = document.getElementById('sidebar-clock');
  if (el) el.textContent = `${h}:${m}:${s}`;

  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const dateEl = document.getElementById('sidebar-date');
  if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const hour = now.getHours();
  let greeting = 'Selamat Pagi! 🌅';
  if (hour >= 12 && hour < 15) greeting = 'Selamat Siang! ☀️';
  else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore! 🌤️';
  else if (hour >= 18) greeting = 'Selamat Malam! 🌙';

  const grEl = document.getElementById('greeting-title');
  if (grEl) grEl.textContent = `${greeting}`;
  const grSub = document.getElementById('greeting-sub');
  if (grSub) grSub.textContent = `Halo, ${state.userName || 'Pengguna'}! Ini ringkasan aktivitasmu hari ini.`;
}

function applyRole() {
  const badge = document.getElementById('sidebar-role-badge');
  if (badge) badge.textContent = `${roleEmoji[state.userRole]} ${state.userRole.charAt(0).toUpperCase() + state.userRole.slice(1)}`;
  const tipLabel = document.getElementById('tips-role-label');
  if (tipLabel) tipLabel.textContent = state.userRole.charAt(0).toUpperCase() + state.userRole.slice(1);
}

// ============ PAGES ============
function showPage(pageName, linkEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const page = document.getElementById(`page-${pageName}`);
  if (page) page.classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  else {
    const link = document.querySelector(`[data-page="${pageName}"]`);
    if (link) link.classList.add('active');
  }

  document.getElementById('sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay')?.classList.remove('show');

  if (pageName === 'dashboard') renderDashboard();
  if (pageName === 'reminder') { renderUpcoming(); renderCustomNotifList(); renderNotifLog(); }
  if (pageName === 'history') renderHistory();
  if (pageName === 'settings') { syncSoundSettings(); syncRoleSettings(); renderTemplates(); }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); };
    document.body.appendChild(overlay);
  }
  overlay.classList.toggle('show', sidebar.classList.contains('open'));
}

function logoutApp() {
  if (!confirm('Keluar dari akun?')) return;
  state.isLoggedIn = false;
  saveState();
  location.reload();
}

// ============ DASHBOARD ============
function renderDashboard() {
  const today = getTodayShort();
  const todaySchedules = state.schedules.filter(s => s.days.includes(today));

  document.getElementById('stat-total').textContent = state.schedules.length;
  document.getElementById('stat-done').textContent = todaySchedules.filter(s => s.done).length;
  document.getElementById('stat-pending').textContent = todaySchedules.filter(s => !s.done).length;
  document.getElementById('stat-streak').textContent = state.streak;

  const listEl = document.getElementById('today-list');
  if (!listEl) return;
  if (todaySchedules.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>Belum ada jadwal hari ini</p><button class="btn-primary" onclick="showPage('schedule', document.querySelector('[data-page=schedule]'))">Tambah Sekarang</button></div>`;
  } else {
    const sorted = [...todaySchedules].sort((a,b) => a.startTime.localeCompare(b.startTime));
    listEl.innerHTML = sorted.map(s => `
      <div class="today-item ${s.done ? 'done' : ''}" id="today-${s.id}">
        <div class="today-item-check" onclick="toggleDone('${s.id}')">
          ${s.done ? '✓' : ''}
        </div>
        <div class="today-item-info">
          <div class="today-item-title">${s.title}</div>
          <div class="today-item-time">⏰ ${s.startTime}${s.endTime ? ' – ' + s.endTime : ''} · ${catEmoji[s.category] || '📌'} ${s.category}</div>
        </div>
        <div class="priority-dot ${s.priority}" title="${s.priority}"></div>
      </div>
    `).join('');
  }

  const total = todaySchedules.length;
  const done = todaySchedules.filter(s => s.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const fillEl = document.getElementById('progress-fill');
  const pctEl = document.getElementById('progress-pct');
  const msgEl = document.getElementById('progress-msg');
  if (fillEl) fillEl.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
  if (msgEl) {
    const msgs = ['Tambahkan jadwal untuk mulai melacak progresmu!', 'Semangat! Kamu baru memulai 🔥', 'Bagus! Terus lanjutkan 💪', 'Hampir selesai! Luar biasa 🎯', 'Semua selesai! Keren sekali ⭐'];
    const idx = total === 0 ? 0 : pct < 25 ? 1 : pct < 60 ? 2 : pct < 100 ? 3 : 4;
    msgEl.textContent = msgs[idx];
  }
}

function renderTips() {
  const tips = roleTips[state.userRole] || roleTips.umum;
  const el = document.getElementById('tips-list');
  if (el) el.innerHTML = tips.map(t => `<div class="tip-item"><span class="tip-icon">${t.icon}</span><span>${t.text}</span></div>`).join('');
}

function toggleDone(id) {
  const sched = state.schedules.find(s => s.id === id);
  if (!sched) return;
  const wasNotDone = !sched.done;
  sched.done = !sched.done;

  if (wasNotDone) {
    // Add to history
    state.activityHistory.unshift({
      id: 'hist_' + Date.now(),
      scheduleId: sched.id,
      title: sched.title,
      category: sched.category,
      priority: sched.priority,
      startTime: sched.startTime,
      endTime: sched.endTime,
      completedAt: new Date().toISOString(),
      date: new Date().toDateString()
    });
    state.streak = (state.streak || 0) + 1;
  } else {
    // Remove from history (last added)
    const idx = state.activityHistory.findIndex(h => h.scheduleId === id);
    if (idx >= 0) state.activityHistory.splice(idx, 1);
    if (state.streak > 0) state.streak--;
  }

  saveState();
  renderDashboard();
  showToast(sched.done ? '✅ Aktivitas selesai! Tersimpan di Riwayat.' : '↩️ Ditandai belum selesai');
}

// ============ SCHEDULE ============
let selectedDays = [];
let selectedPriority = 'rendah';

function toggleDay(el) {
  el.classList.toggle('active');
  const day = el.dataset.day;
  if (el.classList.contains('active')) { if (!selectedDays.includes(day)) selectedDays.push(day); }
  else { selectedDays = selectedDays.filter(d => d !== day); }
}

function selectPriority(el) {
  document.querySelectorAll('#schedule-form-card .priority-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedPriority = el.dataset.priority;
}

function saveSchedule() {
  const editId = document.getElementById('sched-edit-id').value;
  const title = document.getElementById('sched-title').value.trim();
  const category = document.getElementById('sched-category').value;
  const startTime = document.getElementById('sched-start').value;
  const endTime = document.getElementById('sched-end').value;
  const note = document.getElementById('sched-note').value.trim();
  const notifMsg = document.getElementById('sched-notif-msg').value.trim();

  if (!title) { showToast('⚠️ Nama aktivitas tidak boleh kosong!'); return; }
  if (!startTime) { showToast('⚠️ Waktu mulai harus diisi!'); return; }
  if (selectedDays.length === 0) { showToast('⚠️ Pilih minimal satu hari!'); return; }

  if (editId) {
    // Editing existing
    const sched = state.schedules.find(s => s.id === editId);
    if (sched) {
      Object.assign(sched, { title, category, startTime, endTime, days: [...selectedDays], priority: selectedPriority, note, notifMsg });
      showToast('✏️ Jadwal berhasil diperbarui!');
    }
    document.getElementById('sched-edit-id').value = '';
    document.getElementById('form-card-title').textContent = '➕ Tambah Jadwal Baru';
    document.getElementById('btn-save-schedule').textContent = '💾 Simpan Jadwal';
  } else {
    state.schedules.push({
      id: 'sched_' + Date.now(),
      title, category, startTime, endTime,
      days: [...selectedDays], priority: selectedPriority,
      note, notifMsg, done: false,
      createdAt: new Date().toISOString()
    });
    showToast('✅ Jadwal berhasil ditambahkan!');
  }

  saveState();
  clearForm();
  renderScheduleList();
  renderDashboard();
  renderUpcoming();
}

function clearForm() {
  document.getElementById('sched-title').value = '';
  document.getElementById('sched-start').value = '';
  document.getElementById('sched-end').value = '';
  document.getElementById('sched-note').value = '';
  document.getElementById('sched-notif-msg').value = '';
  document.getElementById('sched-edit-id').value = '';
  document.getElementById('form-card-title').textContent = '➕ Tambah Jadwal Baru';
  document.getElementById('btn-save-schedule').textContent = '💾 Simpan Jadwal';
  document.querySelectorAll('#day-picker .day-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#schedule-form-card .priority-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('#schedule-form-card .priority-btn[data-priority="rendah"]').classList.add('active');
  selectedDays = [];
  selectedPriority = 'rendah';
}

function deleteSchedule(id) {
  if (!confirm('Hapus jadwal ini?')) return;
  state.schedules = state.schedules.filter(s => s.id !== id);
  saveState();
  renderScheduleList();
  renderDashboard();
  renderUpcoming();
  showToast('🗑️ Jadwal dihapus');
}

function renderScheduleList() {
  const filterCat = document.getElementById('filter-cat')?.value || 'all';
  const listEl = document.getElementById('schedule-list');
  if (!listEl) return;

  let schedules = state.schedules;
  if (filterCat !== 'all') schedules = schedules.filter(s => s.category === filterCat);
  const sorted = [...schedules].sort((a,b) => a.startTime.localeCompare(b.startTime));

  if (sorted.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>Belum ada jadwal tersimpan</p></div>`;
    return;
  }

  listEl.innerHTML = sorted.map(s => `
    <div class="schedule-item" id="si-${s.id}">
      <div class="sched-cat-icon">${catEmoji[s.category] || '📌'}</div>
      <div class="sched-info">
        <div class="sched-title">${s.title}</div>
        <div class="sched-meta">
          <span class="sched-time">⏰ ${s.startTime}${s.endTime ? ' – ' + s.endTime : ''}</span>
          <span class="sched-days">📆 ${s.days.join(', ')}</span>
          <span class="priority-dot ${s.priority}" title="${s.priority}"></span>
        </div>
        ${s.note ? `<div class="sched-time" style="margin-top:0.3rem">📝 ${s.note}</div>` : ''}
        ${s.notifMsg ? `<div class="sched-time" style="margin-top:0.2rem;color:var(--primary)">🔔 ${s.notifMsg}</div>` : ''}
      </div>
      <div class="sched-actions">
        <button class="btn-icon" onclick="openEditModal('${s.id}')" title="Edit">✏️</button>
        <button class="btn-icon del" onclick="deleteSchedule('${s.id}')" title="Hapus">🗑️</button>
      </div>
    </div>
  `).join('');
}

// ============ IMPORT DEFAULT DAILY ============
function importDailyDefault() {
  if (!confirm(`Import ${defaultDailyActivities.length} aktivitas harian dari bangun tidur sampai tidur malam?`)) return;
  let added = 0;
  defaultDailyActivities.forEach(t => {
    if (!state.schedules.find(s => s.title === t.title)) {
      state.schedules.push({
        id: 'sched_' + Date.now() + '_' + Math.random().toString(36).substr(2,9),
        title: t.title, category: t.category,
        startTime: t.startTime, endTime: t.endTime || '',
        days: t.days, priority: t.priority,
        note: t.note || '', notifMsg: '',
        done: false, createdAt: new Date().toISOString()
      });
      added++;
    }
  });
  saveState();
  renderScheduleList();
  renderDashboard();
  renderUpcoming();
  showToast(`✅ ${added} aktivitas harian berhasil ditambahkan!`);
}

// ============ EDIT MODAL ============
let editDays = [];
let editPriority = 'rendah';

function openEditModal(id) {
  const sched = state.schedules.find(s => s.id === id);
  if (!sched) return;

  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = sched.title;
  document.getElementById('edit-category').value = sched.category;
  document.getElementById('edit-start').value = sched.startTime;
  document.getElementById('edit-end').value = sched.endTime || '';
  document.getElementById('edit-note').value = sched.note || '';
  document.getElementById('edit-notif-msg').value = sched.notifMsg || '';

  editDays = [...sched.days];
  editPriority = sched.priority;

  document.querySelectorAll('#edit-day-picker .day-btn').forEach(btn => {
    btn.classList.toggle('active', editDays.includes(btn.dataset.day));
  });
  document.querySelectorAll('#edit-priority-picker .priority-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.priority === editPriority);
  });

  document.getElementById('edit-modal').classList.remove('hidden');
}

function toggleEditDay(el) {
  el.classList.toggle('active');
  const day = el.dataset.day;
  if (el.classList.contains('active')) { if (!editDays.includes(day)) editDays.push(day); }
  else { editDays = editDays.filter(d => d !== day); }
}

function selectEditPriority(el) {
  document.querySelectorAll('#edit-priority-picker .priority-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  editPriority = el.dataset.priority;
}

function saveEdit() {
  const id = document.getElementById('edit-id').value;
  const sched = state.schedules.find(s => s.id === id);
  if (!sched) return;

  const title = document.getElementById('edit-title').value.trim();
  if (!title) { showToast('⚠️ Nama aktivitas tidak boleh kosong!'); return; }
  if (editDays.length === 0) { showToast('⚠️ Pilih minimal satu hari!'); return; }

  sched.title = title;
  sched.category = document.getElementById('edit-category').value;
  sched.startTime = document.getElementById('edit-start').value;
  sched.endTime = document.getElementById('edit-end').value;
  sched.days = [...editDays];
  sched.priority = editPriority;
  sched.note = document.getElementById('edit-note').value.trim();
  sched.notifMsg = document.getElementById('edit-notif-msg').value.trim();

  saveState();
  closeEditModal();
  renderScheduleList();
  renderDashboard();
  renderUpcoming();
  showToast('✏️ Jadwal berhasil diperbarui!');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
}

// ============ CUSTOM NOTIFICATIONS ============
let customNotifDays = [];

function toggleCustomDay(el) {
  el.classList.toggle('active');
  const day = el.dataset.day;
  if (el.classList.contains('active')) { if (!customNotifDays.includes(day)) customNotifDays.push(day); }
  else { customNotifDays = customNotifDays.filter(d => d !== day); }
}

function addCustomNotif() {
  const time = document.getElementById('custom-notif-time').value;
  const msg = document.getElementById('custom-notif-msg').value.trim();
  if (!time) { showToast('⚠️ Waktu notifikasi harus diisi!'); return; }
  if (!msg) { showToast('⚠️ Pesan notifikasi harus diisi!'); return; }
  if (customNotifDays.length === 0) { showToast('⚠️ Pilih minimal satu hari!'); return; }

  state.customNotifs.push({
    id: 'cn_' + Date.now(),
    time, msg, days: [...customNotifDays],
    active: true, createdAt: new Date().toISOString()
  });

  saveState();
  document.getElementById('custom-notif-time').value = '';
  document.getElementById('custom-notif-msg').value = '';
  document.querySelectorAll('#custom-day-picker .day-btn').forEach(b => b.classList.remove('active'));
  customNotifDays = [];
  renderCustomNotifList();
  showToast('✅ Notifikasi kustom ditambahkan!');
}

function deleteCustomNotif(id) {
  state.customNotifs = state.customNotifs.filter(n => n.id !== id);
  saveState();
  renderCustomNotifList();
  showToast('🗑️ Notifikasi dihapus');
}

function renderCustomNotifList() {
  const el = document.getElementById('custom-notif-list');
  if (!el) return;
  if (!state.customNotifs || state.customNotifs.length === 0) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">Belum ada notifikasi kustom.</p>`;
    return;
  }
  el.innerHTML = state.customNotifs.map(n => `
    <div class="custom-notif-item">
      <span class="custom-notif-time">🕐 ${n.time}</span>
      <div style="flex:1">
        <div class="custom-notif-msg">${n.msg}</div>
        <div class="custom-notif-days">📆 ${n.days.join(', ')}</div>
      </div>
      <button class="btn-icon del" onclick="deleteCustomNotif('${n.id}')">🗑️</button>
    </div>
  `).join('');
}

function checkCustomNotifs() {
  if (!state.reminderActive || !state.customNotifs) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const currentTime = `${hh}:${mm}`;
  const todayShort = getTodayShort();

  state.customNotifs.forEach(cn => {
    if (!cn.days.includes(todayShort) || !cn.active) return;
    if (cn.time === currentTime) {
      const key = `${cn.id}_${currentTime}`;
      if (!state.notifLog.find(l => l.key === key)) {
        playSound(state.selectedSound);
        if (Notification.permission === 'granted') {
          new Notification('🔔 Pengingat Kustom', { body: cn.msg, icon: 'logo.png' });
        }
        const popup = { title: '🔔 Pengingat Kustom', body: cn.msg };
        document.getElementById('popup-title').textContent = popup.title;
        document.getElementById('popup-body').textContent = popup.body;
        document.getElementById('reminder-popup').classList.remove('hidden');
        state.notifLog.unshift({ key, time: currentTime, text: `Kustom: ${cn.msg}`, timestamp: Date.now() });
        saveState();
        renderNotifLog();
      }
    }
  });
}

// ============ REMINDER ENGINE ============
let currentPopupSchedule = null;
let snoozeTimeout = null;

function checkReminders() {
  if (!state.reminderActive) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const currentTime = `${hh}:${mm}`;
  const todayShort = getTodayShort();
  const remindBefore = parseInt(state.remindBefore || 5);

  state.schedules.forEach(sched => {
    if (!sched.days.includes(todayShort)) return;
    const [sh, sm] = sched.startTime.split(':').map(Number);
    const schedMin = sh * 60 + sm;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const diff = schedMin - nowMin;

    if (diff === remindBefore || diff === 0) {
      const logKey = `${sched.id}_${currentTime}`;
      if (!state.notifLog.find(l => l.key === logKey)) {
        triggerReminder(sched, diff);
        state.notifLog.unshift({ key: logKey, time: currentTime, text: `Pengingat: ${sched.title}`, timestamp: Date.now() });
        saveState();
        renderNotifLog();
      }
    }
  });
}

function triggerReminder(sched, diff) {
  playSound(state.selectedSound);
  if (Notification.permission === 'granted') {
    const msg = diff > 0 ? `${diff} menit lagi` : 'Sekarang waktunya!';
    const body = sched.notifMsg || `${msg} — ${sched.startTime} (${catEmoji[sched.category] || ''} ${sched.category})`;
    new Notification(`🔔 ${sched.title}`, { body, icon: 'logo.png' });
  }
  showReminderPopup(sched, diff);
}

function showReminderPopup(sched, diff) {
  currentPopupSchedule = sched;
  document.getElementById('popup-title').textContent = `🔔 ${sched.title}`;
  const customMsg = sched.notifMsg;
  document.getElementById('popup-body').textContent = customMsg ||
    (diff > 0 ? `${diff} menit lagi – ${sched.startTime}` : `Sekarang waktunya! – ${sched.startTime}`);
  document.getElementById('reminder-popup').classList.remove('hidden');
}

function dismissReminder() {
  document.getElementById('reminder-popup').classList.add('hidden');
  if (currentPopupSchedule) {
    if (!currentPopupSchedule.done) toggleDone(currentPopupSchedule.id);
    currentPopupSchedule = null;
  }
}

function snoozeReminder() {
  document.getElementById('reminder-popup').classList.add('hidden');
  if (snoozeTimeout) clearTimeout(snoozeTimeout);
  showToast('😴 Ditunda 5 menit...');
  const sched = currentPopupSchedule;
  snoozeTimeout = setTimeout(() => {
    if (state.reminderActive && sched) { playSound(state.selectedSound); showReminderPopup(sched, 0); }
  }, 5 * 60 * 1000);
  currentPopupSchedule = null;
}

function toggleReminder(checkbox) {
  state.reminderActive = checkbox.checked;
  saveState();
  const icon = document.getElementById('reminder-status-icon');
  const title = document.getElementById('reminder-status-title');
  const sub = document.getElementById('reminder-status-sub');
  if (state.reminderActive) {
    if (icon) icon.textContent = '🔔';
    if (title) title.textContent = 'Reminder Aktif';
    if (sub) sub.textContent = 'Sistem sedang memantau jadwalmu';
    showToast('🔔 Reminder diaktifkan');
  } else {
    if (icon) icon.textContent = '🔕';
    if (title) title.textContent = 'Reminder Nonaktif';
    if (sub) sub.textContent = 'Aktifkan kembali untuk menerima pengingat';
    showToast('🔕 Reminder dinonaktifkan');
  }
}

function renderUpcoming() {
  const listEl = document.getElementById('upcoming-list');
  if (!listEl) return;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const todayShort = getTodayShort();

  const upcoming = state.schedules
    .filter(s => s.days.includes(todayShort) && !s.done)
    .map(s => {
      const [sh, sm] = s.startTime.split(':').map(Number);
      const diff = sh * 60 + sm - nowMin;
      return { ...s, diff };
    })
    .filter(s => s.diff >= 0 && s.diff <= 480)
    .sort((a,b) => a.diff - b.diff);

  // Also include custom notifs
  const customUpcoming = (state.customNotifs || [])
    .filter(cn => cn.days.includes(todayShort))
    .map(cn => {
      const [ch, cm] = cn.time.split(':').map(Number);
      const diff = ch * 60 + cm - nowMin;
      return { ...cn, title: cn.msg, category: 'lainnya', diff, isCustom: true };
    })
    .filter(cn => cn.diff >= 0 && cn.diff <= 480);

  const all = [...upcoming, ...customUpcoming].sort((a,b) => a.diff - b.diff);

  if (all.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">⏰</div><p>Tidak ada reminder mendatang hari ini</p></div>`;
    return;
  }

  listEl.innerHTML = all.map(s => `
    <div class="upcoming-item">
      <div style="font-size:1.5rem">${s.isCustom ? '🔔' : (catEmoji[s.category] || '📌')}</div>
      <div style="flex:1">
        <div style="font-weight:700;color:var(--text)">${s.title}</div>
        <div style="font-size:0.78rem;color:var(--text-muted)">⏰ ${s.isCustom ? s.time : s.startTime}${s.endTime && !s.isCustom ? ' – '+s.endTime : ''}${s.isCustom ? ' · Notifikasi Kustom' : ''}</div>
      </div>
      <div class="upcoming-countdown">${s.diff === 0 ? 'Sekarang!' : s.diff < 60 ? s.diff+'m lagi' : Math.floor(s.diff/60)+'j '+s.diff%60+'m'}</div>
    </div>
  `).join('');
}

function renderNotifLog() {
  const el = document.getElementById('notif-log');
  if (!el) return;
  if (!state.notifLog || state.notifLog.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>Belum ada notifikasi</p></div>`;
    return;
  }
  el.innerHTML = state.notifLog.slice(0,20).map(l => `
    <div class="notif-log-item">
      <span class="notif-time">🕐 ${l.time}</span>
      <span class="notif-text">${l.text}</span>
    </div>
  `).join('');
}

function clearLog() {
  state.notifLog = [];
  saveState();
  renderNotifLog();
  showToast('🗑️ Riwayat notifikasi dihapus');
}

function requestNotifPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(p => {
      showToast(p === 'granted' ? '✅ Notifikasi browser diaktifkan!' : '⚠️ Izin notifikasi ditolak');
      document.getElementById('btn-enable-notif').textContent = p === 'granted' ? '✅ Notifikasi Aktif' : '🔔 Aktifkan Notifikasi Browser';
    });
  } else {
    showToast('❌ Browser tidak mendukung notifikasi');
  }
}

// ============ HISTORY PAGE ============
function renderHistory() {
  const hist = state.activityHistory || [];
  const filter = document.getElementById('history-filter')?.value || 'all';
  const now = new Date();

  let filtered = hist;
  if (filter === 'today') {
    filtered = hist.filter(h => h.date === now.toDateString());
  } else if (filter === 'week') {
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    filtered = hist.filter(h => new Date(h.completedAt) >= weekAgo);
  }

  // Stats
  document.getElementById('hist-total-done').textContent = hist.length;
  const uniqueDays = [...new Set(hist.map(h => h.date))].length;
  document.getElementById('hist-days').textContent = uniqueDays;
  document.getElementById('hist-streak').textContent = state.streak || 0;

  const listEl = document.getElementById('history-list');
  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>Belum ada riwayat aktivitas</p><p style="font-size:0.8rem;color:var(--text-light)">Tandai aktivitas sebagai selesai untuk melihat riwayat</p></div>`;
    return;
  }

  listEl.innerHTML = filtered.map(h => {
    const d = new Date(h.completedAt);
    const dateStr = d.toLocaleDateString('id-ID', { weekday:'short', day:'numeric', month:'short' });
    const timeStr = d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
    return `
      <div class="history-item">
        <div class="history-item-icon">${catEmoji[h.category] || '✅'}</div>
        <div class="history-item-info">
          <div class="history-item-title">✅ ${h.title}</div>
          <div class="history-item-meta">⏰ ${h.startTime}${h.endTime ? ' – '+h.endTime : ''} · ${dateStr}, diselesaikan ${timeStr}</div>
        </div>
        <div class="history-badge">Selesai</div>
      </div>
    `;
  }).join('');
}

function clearHistory() {
  if (!confirm('Hapus semua riwayat aktivitas?')) return;
  state.activityHistory = [];
  saveState();
  renderHistory();
  showToast('🗑️ Riwayat dihapus');
}

// ============ SETTINGS ============
function selectSoundSettings(el) {
  document.querySelectorAll('#page-settings .sound-item').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedSound = el.dataset.sound;
  saveState();
  showToast('✅ Nada disimpan: ' + el.querySelector('.sound-name').textContent);
}

function syncSoundSettings() {
  document.querySelectorAll('#page-settings .sound-item').forEach(s => {
    s.classList.toggle('selected', s.dataset.sound === state.selectedSound);
  });
}

function syncRoleSettings() {
  const sel = document.getElementById('set-role');
  if (sel) sel.value = state.userRole;
}

function changeRole() {
  state.userRole = document.getElementById('set-role').value;
  saveState(); applyRole(); renderTips(); renderTemplates();
}

function toggleDarkMode(checkbox) {
  state.darkMode = checkbox.checked;
  document.body.classList.toggle('dark-mode', state.darkMode);
  saveState();
  showToast(state.darkMode ? '🌙 Mode gelap aktif' : '☀️ Mode terang aktif');
}

function saveSettings() {
  state.userName = document.getElementById('set-name').value.trim();
  state.remindBefore = parseInt(document.getElementById('set-remind-before').value);
  saveState();
  updateSidebarUser();
  showToast('💾 Pengaturan disimpan!');
  applyRole();
}

function resetApp() {
  if (!confirm('Yakin ingin menghapus semua data? Ini tidak bisa dibatalkan.')) return;
  localStorage.removeItem('reminderAppState');
  location.reload();
}

// ============ TEMPLATES ============
function renderTemplates() {
  const grid = document.getElementById('template-grid');
  if (!grid) return;
  const templates = [
    { key: state.userRole, icon: roleEmoji[state.userRole], title: 'Template ' + state.userRole.charAt(0).toUpperCase() + state.userRole.slice(1), sub: 'Jadwal standar untuk ' + state.userRole },
    { key: 'daily', icon: '🌅', title: 'Aktivitas Harian Lengkap', sub: 'Dari bangun tidur sampai tidur' },
    { key: 'ibadah', icon: '🕌', title: 'Ibadah Lengkap', sub: 'Sholat 5 waktu & dzikir' },
    { key: 'olahraga', icon: '🏋️', title: 'Rutin Olahraga', sub: 'Jadwal olahraga mingguan' }
  ];
  grid.innerHTML = templates.map(t => `
    <div class="template-card" onclick="importTemplate('${t.key}')">
      <div class="template-card-icon">${t.icon}</div>
      <div class="template-card-title">${t.title}</div>
      <div class="template-card-sub">${t.sub}</div>
    </div>
  `).join('');
}

function importTemplate(key) {
  const extra = {
    daily: defaultDailyActivities,
    ibadah: [
      { title: 'Sholat Subuh', category: 'ibadah', startTime: '04:45', endTime: '05:15', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' },
      { title: 'Sholat Dhuhur', category: 'ibadah', startTime: '12:05', endTime: '12:20', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' },
      { title: 'Sholat Ashar', category: 'ibadah', startTime: '15:30', endTime: '15:45', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' },
      { title: 'Sholat Maghrib', category: 'ibadah', startTime: '18:05', endTime: '18:20', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' },
      { title: 'Sholat Isya', category: 'ibadah', startTime: '19:30', endTime: '19:45', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'tinggi' }
    ],
    olahraga: [
      { title: 'Jogging Pagi', category: 'olahraga', startTime: '06:00', endTime: '06:45', days: ['Sen','Rab','Jum'], priority: 'sedang' },
      { title: 'Gym / Fitness', category: 'olahraga', startTime: '07:00', endTime: '08:00', days: ['Sel','Kam'], priority: 'sedang' },
      { title: 'Stretching', category: 'olahraga', startTime: '21:00', endTime: '21:15', days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], priority: 'rendah' }
    ]
  };

  const templates = scheduleTemplates[key] || extra[key] || [];
  let added = 0;
  templates.forEach(t => {
    if (!state.schedules.find(s => s.title === t.title)) {
      state.schedules.push({
        id: 'sched_' + Date.now() + '_' + Math.random().toString(36).substr(2,9),
        title: t.title, category: t.category, startTime: t.startTime,
        endTime: t.endTime || '', days: t.days, priority: t.priority,
        note: t.note || '', notifMsg: '', done: false, createdAt: new Date().toISOString()
      });
      added++;
    }
  });
  saveState();
  renderScheduleList();
  renderDashboard();
  renderUpcoming();
  showToast(`✅ ${added} jadwal berhasil diimport!`);
}

// ============ SHARE ============
function shareApp() {
  const url = window.location.href;
  document.getElementById('share-url-text').textContent = url;
  document.getElementById('share-modal').classList.remove('hidden');
}

function closeShareModal() {
  document.getElementById('share-modal').classList.add('hidden');
}

function copyShareUrl() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast('📋 Link berhasil disalin!');
  }).catch(() => {
    const el = document.getElementById('share-url-text');
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    showToast('📋 Salin teks yang terpilih!');
  });
}

function shareViaWA() {
  const url = encodeURIComponent(window.location.href);
  const msg = encodeURIComponent('🔔 Coba aplikasi Pengingat Aktivitas Harian ini! Atur jadwal dari bangun tidur sampai tidur malam. ');
  window.open(`https://wa.me/?text=${msg}${url}`, '_blank');
}

function shareViaTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('🔔 Aplikasi Pengingat Aktivitas Harian yang keren! Atur jadwalmu & dapatkan notifikasi otomatis! #Reminder #Produktivitas');
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

// ============ HELPERS ============
function getTodayShort() {
  const days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  return days[new Date().getDay()];
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============ PERSISTENCE ============
function saveState() {
  localStorage.setItem('reminderAppState_v2', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('reminderAppState_v2');
  if (saved) {
    try { state = { ...state, ...JSON.parse(saved) }; return true; }
    catch(e) { return false; }
  }
  // Migrate from old key
  const oldSaved = localStorage.getItem('reminderAppState');
  if (oldSaved) {
    try {
      const old = JSON.parse(oldSaved);
      state = { ...state, ...old };
      state.activityHistory = state.activityHistory || [];
      state.customNotifs = state.customNotifs || [];
      saveState();
      return true;
    } catch(e) { return false; }
  }
  return false;
}

// ============ BOOT ============
window.addEventListener('DOMContentLoaded', () => {
  const hasSaved = loadState();

  if (hasSaved && state.isLoggedIn) {
    // Already logged in, skip login & onboarding
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('onboarding-overlay').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    if (state.darkMode) document.body.classList.add('dark-mode');
    initApp();
  }
  // else show login page by default

  // Close modals on overlay click
  document.getElementById('edit-modal').addEventListener('click', function(e) {
    if (e.target === this) closeEditModal();
  });
  document.getElementById('share-modal').addEventListener('click', function(e) {
    if (e.target === this) closeShareModal();
  });
});
