/* PTA適正化推進委員会 — site.js v3 */
const SITE_INDEX=[
  {title:'トップページ',url:'index.html',desc:'サイト全体の入口。今何が起きているか、立場別ガイド、監査システム。みなし加入 強制加入 横領 個人情報'},
  {title:'静岡市・9200人分個人情報無断提供事案',url:'shizuoka-incident.html',desc:'2026年4月発覚。静岡市立20校で保護者の同意なく個人情報をPTAに提供。教育長「法律と学校文化にずれ」。構造的分析。'},
  {title:'保護者の方へ',url:'guide-parent.html',desc:'入会・会費・個人情報。絵で直感的に理解できるガイド。みなし加入 退会 返還請求 テンプレートPDF'},
  {title:'PTA役員の方へ',url:'guide-pta.html',desc:'就任直後の確認・適正化ロードマップ・PDF雛形。役員 リスク 会計 入会届'},
  {title:'教育委員会・学校の方へ',url:'guide-board.html',desc:'職務専念義務・渉外業務・覚書問題。校長 教頭 教職員 地公法35条'},
  {title:'研究者・記者の方へ',url:'guide-research.html',desc:'全国公文書・教委回答・一次資料へのアクセスガイド。取材 問い合わせ'},
  {title:'教育委員会の回答',url:'board-responses.html',desc:'全国の教育委員会への照会結果・地図。全国50自治体 強制加入違法 横浜市通知'},
  {title:'全国資料館',url:'national-archive.html',desc:'開示請求で収集した全国のPTA関連公文書。入会届 会費 名簿 覚書'},
  {title:'論考・調査報告',url:'journal.html',desc:'法律論考・調査報告・行政動向の分析。スライド 会費徴収パラドックス'},
  {title:'監査システム',url:'audit/index.html',desc:'5軸・3立場でPTA運営のリスクを自動診断。保護者 役員 学校管理職'},
  {title:'入会手続・オプトアウト',url:'membership.html',desc:'みなし加入・オプトアウト方式の法的無効性。民法522条 不当利得 沈黙は承諾ではない'},
  {title:'個人情報提供',url:'privacy.html',desc:'学校からPTAへの名簿提供の違法性。個人情報保護法69条 第三者提供 オプトイン'},
  {title:'会費徴収',url:'fee-collection.html',desc:'学校徴収金との混在・無権代理・不当利得。抱き合わせ徴収 給食費 口座引落'},
  {title:'教職員関与・職務専念義務',url:'personnel.html',desc:'地公法35条・PTA事務への恒常的従事の問題。担任 集金 配布 渉外業務'},
  {title:'施設利用',url:'facilities.html',desc:'学校教育法137条・公私境界の整理。PTA室 コピー機 光熱費 鍵'},
  {title:'法制度マップ',url:'law-map.html',desc:'憲法・民法・個人情報保護法・地公法・地方財政法の論点別整理。条文 e-Gov'},
  {title:'判例整理',url:'cases.html',desc:'PTA関連の裁判例・学説の整理。熊本地裁 大阪地裁 黙示の承諾'},
  {title:'行政資料整理',url:'administrative-materials.html',desc:'文科省通知・教委回答・行政実例の整理。1964年行政実例 横浜市通知'},
  {title:'総合分析レポート',url:'report.html',desc:'全国調査に基づく構造分析・提言。法的枠組み 歴史 適正化の方向性'},
];
function initSearch(){
  document.querySelectorAll('.search-input').forEach(input=>{
    const dd=input.closest('.header-search')?.querySelector('.search-results-dropdown');
    if(!dd)return;
    input.addEventListener('input',()=>{
      const q=input.value.trim().toLowerCase();
      if(q.length<2){dd.classList.remove('is-open');return;}
      const hits=SITE_INDEX.filter(p=>p.title.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)).slice(0,6);
      dd.innerHTML=hits.length?hits.map(p=>`<a href="${p.url}" class="srd-item"><div class="srd-item-title">${p.title}</div><div class="srd-item-desc">${p.desc}</div></a>`).join(''):`<div class="srd-empty">「${input.value}」に一致するページが見つかりません</div>`;
      dd.classList.add('is-open');
    });
    document.addEventListener('click',e=>{if(!input.closest('.header-search').contains(e.target))dd.classList.remove('is-open');});
    input.addEventListener('keydown',e=>{if(e.key==='Escape')dd.classList.remove('is-open');});
  });
}
function initHamburger(){
  const btn=document.getElementById('hamburger'),ol=document.getElementById('mobileOverlay'),cl=document.getElementById('closeOverlay');
  if(!btn||!ol)return;
  btn.addEventListener('click',()=>{ol.classList.add('is-open');btn.setAttribute('aria-expanded','true');});
  cl?.addEventListener('click',()=>{ol.classList.remove('is-open');btn.setAttribute('aria-expanded','false');});
}
function initMegaMenu(){
  document.querySelectorAll('.nav-item.has-dropdown>.nav-link').forEach(link=>{
    link.addEventListener('click',e=>{
      const item=link.closest('.nav-item');
      if(window.innerWidth>860){e.preventDefault();item.classList.toggle('is-open');document.querySelectorAll('.nav-item.is-open').forEach(i=>{if(i!==item)i.classList.remove('is-open');});}
    });
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-item'))document.querySelectorAll('.nav-item.is-open').forEach(i=>i.classList.remove('is-open'));});
}
function initFAQ(){
  document.querySelectorAll('.faq-item').forEach(item=>{
    const q=item.querySelector('.faq-q');
    if(!q)return;
    q.addEventListener('click',()=>{const o=item.classList.toggle('is-open');const t=item.querySelector('.faq-toggle');if(t)t.textContent=o?'▲':'▼';});
  });
}
function initChecklist(){
  document.querySelectorAll('.check-box').forEach(box=>{
    box.addEventListener('click',()=>{box.classList.toggle('checked');box.textContent=box.classList.contains('checked')?'✓':'';});
  });
}
document.addEventListener('DOMContentLoaded',()=>{initSearch();initHamburger();initMegaMenu();initFAQ();initChecklist();});
