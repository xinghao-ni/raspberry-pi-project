// ── Shared JS for all pages ──

// ── Apply theme before first paint ──
(function () {
  if (localStorage.getItem('tonitruum-theme') === 'light')
    document.documentElement.classList.add('light-mode');
})();

// ── Theme toggle ──
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  localStorage.setItem('tonitruum-theme', isLight ? 'light' : 'dark');
  _updateThemeBtns(isLight);
}
function _updateThemeBtns(isLight) {
  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.innerHTML = isLight
      ? '<span style="font-size:12px">◑</span>&nbsp;Night Mode'
      : '<span style="font-size:12px">☀</span>&nbsp;Day Mode';
  });
}
document.addEventListener('DOMContentLoaded', function () {
  _updateThemeBtns(document.documentElement.classList.contains('light-mode'));
});

// ── Minimal mode toggle ──
function toggleMinimal() {
  const isMinimal = document.documentElement.classList.toggle('minimal-mode');
  const btn = document.getElementById('minimalBtn');
  if (btn) btn.innerHTML = isMinimal
    ? '<span style="opacity:.7">◧</span>&nbsp;Full View'
    : '<span style="opacity:.7">◫</span>&nbsp;Minimal';

  if (isMinimal) {
    // Wait two frames so the panel's display:block is painted before animating
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const cards = document.querySelectorAll('.minimal-panel .m-card');
      cards.forEach((card, i) => {
        card.classList.remove('animating');
        void card.offsetWidth; // force reflow
        card.style.animationDelay = (i * 0.07) + 's';
        card.classList.add('animating');
      });
      const dur = 420 + (cards.length - 1) * 70;
      setTimeout(() => {
        cards.forEach(c => { c.classList.remove('animating'); c.style.animationDelay = ''; });
      }, dur + 60);
    }));
  }
}

// Sidebar clock
function updateClock() {
  const el = document.getElementById('sidebarTime');
  if (el) el.textContent = new Date().toLocaleString('en-US', {
    hour12: false, year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit'
  });
}
updateClock();
setInterval(updateClock, 30000);

// Toast notification
function showToast(msg, type = 'success') {
  const colors = { success:'#4a8c68', warning:'#d96e28', error:'#b84a3a', info:'#6b9eb8' };
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:#1a1918;border:1px solid ${colors[type]};color:${colors[type]};padding:10px 16px;border-radius:5px;font-size:11px;letter-spacing:.04em;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.6);transition:opacity 0.3s;max-width:300px;font-family:-apple-system,sans-serif;`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; setTimeout(()=>toast.remove(),300); }, 3500);
}

// Tab switching
function switchTab(btn, tabId) {
  const parent = btn.closest('[data-tabs]') || document;
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const allPanels = parent.querySelectorAll('.tab-panel');
  allPanels.forEach(p => { p.style.display = p.id === tabId ? 'block' : 'none'; });
}

// Smooth number counter
function animateNumber(el, target, duration=1000, decimals=0) {
  if (!el) return;
  const start = parseFloat(el.textContent)||0;
  const diff = target - start;
  const t0 = performance.now();
  const step = now => {
    const p = Math.min((now-t0)/duration,1);
    el.textContent = (start + diff*(1-Math.pow(1-p,3))).toFixed(decimals);
    if(p<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Chart.js defaults
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#5a5855';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "-apple-system,'Helvetica Neue',sans-serif";
  Chart.defaults.font.size = 11;
}

// ── Mobile top bar injection ──
(function(){
  if(window.innerWidth > 600) return;
  // Inject overlay
  const overlay = document.createElement('div');
  overlay.className = 'mob-overlay';
  overlay.id = 'mobOverlay';
  document.body.appendChild(overlay);

  // Inject top bar
  const bar = document.createElement('div');
  bar.className = 'mob-topbar';
  bar.innerHTML = `
    <span class="mob-topbar-logo">⬡</span>
    <span class="mob-topbar-title">TONITRUUM</span>
    <button class="mob-burger" id="mobBurger" aria-label="Menu">☰</button>
  `;
  document.body.appendChild(bar);

  const sidebar = document.querySelector('.sidebar');
  const burger  = document.getElementById('mobBurger');

  function openNav(){
    if(sidebar){ sidebar.classList.add('mob-open'); }
    overlay.classList.add('open');
    burger.textContent = '✕';
  }
  function closeNav(){
    if(sidebar){ sidebar.classList.remove('mob-open'); }
    overlay.classList.remove('open');
    burger.textContent = '☰';
  }
  burger.addEventListener('click', ()=> overlay.classList.contains('open') ? closeNav() : openNav());
  overlay.addEventListener('click', closeNav);
})();
