
const mobileOverlay = document.getElementById('mobileOverlay');
const hamburger = document.getElementById('hamburger');
const closeOverlay = document.getElementById('closeOverlay');

if (hamburger && mobileOverlay) {
  hamburger.addEventListener('click', () => {
    const willOpen = !mobileOverlay.classList.contains('is-open');
    mobileOverlay.classList.toggle('is-open', willOpen);
    hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });
}
if (closeOverlay && mobileOverlay) {
  closeOverlay.addEventListener('click', () => {
    mobileOverlay.classList.remove('is-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  });
}
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) {
      mobileOverlay.classList.remove('is-open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Dropdown / mega-menu support on click and keyboard
const dropdownItems = document.querySelectorAll('.nav-item');
const closeAllDropdowns = (except = null) => {
  dropdownItems.forEach((item) => {
    if (item !== except) {
      item.classList.remove('is-open');
      const trigger = item.querySelector('.nav-link');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
};

dropdownItems.forEach((item) => {
  const menu = item.querySelector('.mega-menu');
  const trigger = item.querySelector('.nav-link');
  if (!menu || !trigger) return;

  item.classList.add('has-dropdown');
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', (e) => {
    const href = trigger.getAttribute('href') || '#';
    const isPlaceholder = href === '#' || href === '';
    const isOpen = item.classList.contains('is-open');

    if (isPlaceholder || !isOpen) {
      e.preventDefault();
      closeAllDropdowns(item);
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    }
  });

  item.addEventListener('mouseleave', () => {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.desktop-nav')) closeAllDropdowns();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    if (mobileOverlay) mobileOverlay.classList.remove('is-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('[data-modal-law]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-modal-law');
    if (!window.LAW_DATA || !window.LAW_DATA[key]) return;
    const data = window.LAW_DATA[key];
    const modal = document.getElementById('lawModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    const evidenceHtml = (data.evidence || []).map((item) =>
      `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.label} ↗</a>`
    ).join('');

    body.innerHTML = `
      <h2 style="color:var(--color-navy); margin-bottom:10px;">${data.title}</h2>
      ${data.body}
      ${evidenceHtml ? `<div class="evidence-links">${evidenceHtml}</div>` : ''}
    `;
    modal.classList.add('is-open');
  });
});

const modal = document.getElementById('lawModal');
const modalClose = document.getElementById('modalClose');
if (modalClose && modal) {
  modalClose.addEventListener('click', () => modal.classList.remove('is-open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
}

document.querySelectorAll('.egov-link').forEach((link) => {
  if (!link.textContent.includes('↗')) link.textContent = `${link.textContent} ↗`;
});

// Homepage enhancement: prioritize the national map without rewriting the large index.html.
(function enhanceHomepageNationalMap(){
  const path = location.pathname.replace(/\/+/g,'/');
  const isHome = path.endsWith('/pta/') || path.endsWith('/pta/index.html') || path.endsWith('/index.html') || path === '/';
  if (!isHome) return;

  const style = document.createElement('style');
  style.textContent = `
    .national-map-entry{
      width:min(calc(100% - 40px),1200px);
      margin:28px auto 0;
      background:linear-gradient(135deg,#0A192F,#1A365D);
      color:#fff;
      border:1px solid rgba(212,175,55,.35);
      border-radius:26px;
      box-shadow:0 18px 48px rgba(10,25,47,.18);
      padding:30px;
      position:relative;
      overflow:hidden;
    }
    .national-map-entry:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 90% 10%,rgba(212,175,55,.18),transparent 36%);pointer-events:none;}
    .national-map-entry>*{position:relative;z-index:1;}
    .national-map-entry .entry-kicker{display:inline-flex;padding:6px 12px;border-radius:999px;background:rgba(212,175,55,.16);color:#F4E7A6;font-size:.82rem;font-weight:900;letter-spacing:.08em;margin-bottom:12px;}
    .national-map-entry h2{font-family:'Noto Serif JP',serif;font-size:clamp(1.55rem,3vw,2.45rem);line-height:1.35;margin:0 0 10px;color:#fff;}
    .national-map-entry p{max-width:860px;color:rgba(255,255,255,.86);line-height:1.9;margin:0 0 18px;}
    .national-map-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px;}
    .national-map-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;text-decoration:none;font-weight:900;}
    .national-map-actions .primary{background:#D4AF37;color:#08111f;}
    .national-map-actions .secondary{border:1px solid rgba(255,255,255,.45);color:#fff;background:rgba(255,255,255,.06);}
    .national-map-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:22px;}
    .national-map-stat{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px;}
    .national-map-stat b{display:block;color:#F4E7A6;font-size:1.5rem;line-height:1;}
    .national-map-stat span{font-size:.84rem;color:rgba(255,255,255,.72);}
    @media(max-width:760px){.national-map-stats{grid-template-columns:repeat(2,1fr)}.national-map-entry{padding:22px}}
  `;
  document.head.appendChild(style);

  const entry = document.createElement('section');
  entry.className = 'national-map-entry';
  entry.innerHTML = `
    <div class="entry-kicker">NATIONAL EVIDENCE MAP</div>
    <h2>全国PTA実態マップ</h2>
    <p>教育委員会回答101件を、日本地図・論点タグ・公開用要約で整理しています。個別自治体の順位付けではなく、学校とPTAの境界に関する全国的な回答傾向を俯瞰するための入口です。</p>
    <div class="national-map-actions">
      <a class="primary" href="national-map.html">全国PTA実態マップを見る</a>
      <a class="secondary" href="national-archive.html">全国PTA資料館を見る</a>
      <a class="secondary" href="law-map.html">法制度マップを見る</a>
    </div>
    <div class="national-map-stats">
      <div class="national-map-stat"><b>101</b><span>教育委員会回答</span></div>
      <div class="national-map-stat"><b>4</b><span>主要論点</span></div>
      <div class="national-map-stat"><b>地図</b><span>地域別に俯瞰</span></div>
      <div class="national-map-stat"><b>資料</b><span>原資料へ接続</span></div>
    </div>
  `;

  const hero = document.querySelector('.hero-v2') || document.querySelector('.hero') || document.querySelector('main');
  if (hero && hero.parentNode) {
    hero.insertAdjacentElement('afterend', entry);
  } else {
    document.body.insertBefore(entry, document.body.firstChild);
  }

  document.querySelectorAll('a').forEach(a=>{
    const txt=(a.textContent||'').trim();
    const href=a.getAttribute('href')||'';
    if(txt.includes('調査マップ') || txt.includes('全国PTAマップ')){
      a.textContent='全国PTA実態マップ';
      a.setAttribute('href','national-map.html');
    }
    if(href.includes('national-map.html')){
      a.setAttribute('href','national-map.html');
    }
  });
})();
