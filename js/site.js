
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

document.addEventListener('click', (e) => { if (!e.target.closest('.desktop-nav')) closeAllDropdowns(); });
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
    const evidenceHtml = (data.evidence || []).map((item) => `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.label} ↗</a>`).join('');
    body.innerHTML = `<h2 style="color:var(--color-navy); margin-bottom:10px;">${data.title}</h2>${data.body}${evidenceHtml ? `<div class="evidence-links">${evidenceHtml}</div>` : ''}`;
    modal.classList.add('is-open');
  });
});

const modal = document.getElementById('lawModal');
const modalClose = document.getElementById('modalClose');
if (modalClose && modal) {
  modalClose.addEventListener('click', () => modal.classList.remove('is-open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });
}

document.querySelectorAll('.egov-link').forEach((link) => { if (!link.textContent.includes('↗')) link.textContent = `${link.textContent} ↗`; });

(function enhanceHomepageNationalMap(){
  const path = location.pathname.replace(/\/+/g,'/');
  const isHome = path.endsWith('/pta/') || path.endsWith('/pta/index.html') || path.endsWith('/index.html') || path === '/';
  if (!isHome) return;

  const style = document.createElement('style');
  style.textContent = `
    .pta-structure-entry,.national-map-entry{width:min(calc(100% - 40px),1200px);margin:28px auto 0;border-radius:26px;box-shadow:0 18px 48px rgba(10,25,47,.14);position:relative;overflow:hidden;}
    .pta-structure-entry{background:#fff;border:1px solid var(--color-line);padding:30px;}
    .pta-structure-entry .entry-kicker{display:inline-flex;padding:6px 12px;border-radius:999px;background:rgba(26,54,93,.08);color:var(--color-navy);font-size:.82rem;font-weight:900;letter-spacing:.08em;margin-bottom:12px;}
    .pta-structure-entry h2{font-family:'Noto Serif JP',serif;font-size:clamp(1.55rem,3vw,2.45rem);line-height:1.35;margin:0 0 10px;color:var(--color-navy);}
    .pta-structure-entry p{max-width:900px;color:var(--color-text-soft);line-height:1.9;margin:0 0 18px;}
    .structure-flow{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:20px;align-items:stretch;}
    .structure-step{background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid var(--color-line);border-radius:18px;padding:18px;position:relative;min-height:135px;}
    .structure-step:not(:last-child):after{content:'→';position:absolute;right:-15px;top:50%;transform:translateY(-50%);font-weight:900;color:var(--color-gold);font-size:1.4rem;z-index:2;}
    .structure-step b{display:block;color:var(--color-navy);font-size:1rem;line-height:1.45;margin-bottom:8px;}
    .structure-step span{font-size:.86rem;color:var(--color-text-soft);line-height:1.65;}
    .structure-step.alert{border-color:rgba(185,28,28,.25);background:linear-gradient(180deg,#fff,#fff5f5);}
    .structure-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px;}
    .structure-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 16px;border-radius:999px;text-decoration:none;font-weight:900;}
    .structure-actions .primary{background:var(--color-navy);color:#fff;}
    .structure-actions .secondary{border:1px solid var(--color-line);color:var(--color-navy);background:#fff;}
    .national-map-entry{background:linear-gradient(135deg,#0A192F,#1A365D);color:#fff;border:1px solid rgba(212,175,55,.35);padding:30px;}
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
    @media(max-width:980px){.structure-flow{grid-template-columns:1fr}.structure-step:not(:last-child):after{content:'↓';right:auto;left:50%;top:auto;bottom:-22px;transform:translateX(-50%)}.structure-step{min-height:auto}}
    @media(max-width:760px){.national-map-stats{grid-template-columns:repeat(2,1fr)}.national-map-entry,.pta-structure-entry{padding:22px}}
  `;
  document.head.appendChild(style);

  const structure = document.createElement('section');
  structure.className = 'pta-structure-entry';
  structure.innerHTML = `
    <div class="entry-kicker">STRUCTURE FIRST</div>
    <h2>PTA問題は、個別の不満ではなく構造問題です。</h2>
    <p>最初に見るべき起点は、加入意思確認の「記録」があるかどうかです。記録が曖昧なまま会員扱いが進むと、学校依存の運用に接続し、会費徴収・個人情報・教職員関与が混線しやすくなります。</p>
    <div class="structure-flow">
      <div class="structure-step alert"><b>加入意思確認の記録がない</b><span>申込書の有無ではなく、加入意思を確認した記録の有無が起点。</span></div>
      <div class="structure-step"><b>会員が確定できない</b><span>誰が会員か曖昧なまま、全員前提の運用が残る。</span></div>
      <div class="structure-step"><b>学校に依存した運用になる</b><span>配布、回収、集金、名簿などが学校経由になりやすい。</span></div>
      <div class="structure-step"><b>会費・個人情報・教職員関与が混線</b><span>私団体活動と学校事務の境界が見えにくくなる。</span></div>
      <div class="structure-step alert"><b>構造問題として表面化</b><span>個別トラブルではなく、制度上の境界問題として現れる。</span></div>
    </div>
    <div class="structure-actions">
      <a class="primary" href="national-map.html">全国の回答傾向を見る</a>
      <a class="secondary" href="membership.html">入会・意思確認を見る</a>
      <a class="secondary" href="law-map.html">関連法制度を見る</a>
    </div>
  `;

  const mapEntry = document.createElement('section');
  mapEntry.className = 'national-map-entry';
  mapEntry.innerHTML = `
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
    hero.insertAdjacentElement('afterend', mapEntry);
    hero.insertAdjacentElement('afterend', structure);
  } else {
    document.body.insertBefore(mapEntry, document.body.firstChild);
    document.body.insertBefore(structure, mapEntry);
  }

  document.querySelectorAll('a').forEach(a=>{
    const txt=(a.textContent||'').trim();
    const href=a.getAttribute('href')||'';
    if(txt.includes('調査マップ') || txt.includes('全国PTAマップ')){
      a.textContent='全国PTA実態マップ';
      a.setAttribute('href','national-map.html');
    }
    if(href.includes('national-map.html')) a.setAttribute('href','national-map.html');
  });
})();
