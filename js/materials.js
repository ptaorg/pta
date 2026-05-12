(function(){
  const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  async function loadJson(url){
    try{
      const res = await fetch(url, {cache:"no-store"});
      if(!res.ok) return null;
      return await res.json();
    }catch(e){ return null; }
  }
  function badges(values){
    if(!Array.isArray(values)) return "";
    return values.filter(Boolean).slice(0,8).map(v=>`<span class="source-badge">${esc(v)}</span>`).join("");
  }
  function actionLabel(file){
    if(/\.pdf($|\?)/i.test(file)) return "PDFを開く";
    if(/\.xlsx?($|\?)/i.test(file)) return "Excelを開く";
    if(/\.json($|\?)/i.test(file)) return "JSONを開く";
    if(/\.js($|\?)/i.test(file)) return "データを開く";
    if(/\.html?($|\?)/i.test(file)) return "ページを開く";
    return "資料を開く";
  }
  function iconFor(file, type){
    if(/\.pdf($|\?)/i.test(file)) return "📄";
    if(/\.xlsx?($|\?)/i.test(file)) return "📊";
    if(/\.json($|\?)|\.js($|\?)/i.test(file)) return "🗂️";
    if(/\.html?($|\?)/i.test(file)) return "🔎";
    if(String(type || "").includes("動画")) return "🎞️";
    return "📁";
  }
  function materialCard(item){
    const file = item.file || "";
    const thumb = item.thumbnail || "";
    const image = thumb
      ? `<a href="${esc(file || thumb)}" target="_blank" rel="noopener"><img src="${esc(thumb)}" alt="${esc(item.title || '資料画像')}" loading="lazy"></a>`
      : `<div class="material-placeholder__icon"><span>${iconFor(file, item.type)}</span><small>${esc(actionLabel(file || item.id || '資料'))}</small></div>`;
    const action = file ? `<a class="mini-link" href="${esc(file)}" target="_blank" rel="noopener">${esc(actionLabel(file))}</a>` : "";
    return `<article class="material-card material-card--live"><div class="material-placeholder material-placeholder--image">${image}</div><div class="material-card-body"><h3>${esc(item.title || item.id || '無題資料')}</h3><p>${esc(item.summary || '資料概要は未入力です。')}</p><dl class="material-meta"><div><dt>種別</dt><dd>${esc(item.type || '未分類')}</dd></div><div><dt>出典</dt><dd>${esc(item.source || '未記入')}</dd></div><div><dt>年度</dt><dd>${esc(item.year || '未記入')}</dd></div><div><dt>状態</dt><dd>${esc(item.status || '未確認')}</dd></div></dl><div class="source-badges">${badges(item.issues)}</div>${item.analysis ? `<p class="material-analysis"><strong>確認ポイント：</strong>${esc(item.analysis)}</p>` : ""}${action}</div></article>`;
  }
  function mediaCard(item){
    const file = item.file || "";
    const thumb = item.thumbnail || "";
    const media = file ? (thumb ? `<video controls preload="metadata" poster="${esc(thumb)}"><source src="${esc(file)}"></video>` : `<video controls preload="metadata"><source src="${esc(file)}"></video>`) : `<div><span>🎞️</span><small>動画未設定</small></div>`;
    return `<article class="material-card material-card--live"><div class="material-placeholder material-placeholder--image">${media}</div><div class="material-card-body"><h3>${esc(item.title || item.id || '無題動画')}</h3><p>${esc(item.summary || '概要は未入力です。')}</p><dl class="material-meta"><div><dt>時間</dt><dd>${esc(item.duration || '未記入')}</dd></div><div><dt>公開確認</dt><dd>${esc(item.privacy || '未確認')}</dd></div></dl>${item.caption ? `<a class="mini-link" href="${esc(item.caption)}" target="_blank" rel="noopener">字幕・要約を開く</a>` : ""}</div></article>`;
  }
  async function render(){
    const materialGrid = document.getElementById("materialsManifestGrid");
    const mediaGrid = document.getElementById("mediaManifestGrid");
    if(materialGrid){
      const data = await loadJson("data/materials-manifest.json");
      const items = Array.isArray(data?.items) ? data.items : [];
      materialGrid.innerHTML = items.length ? items.map(materialCard).join("") : '<div class="manifest-empty">公開用manifestには、まだ実物文書が登録されていません。資料を追加する場合は <code>data/materials-manifest.json</code> に追記します。</div>';
    }
    if(mediaGrid){
      const data = await loadJson("data/media-manifest.json");
      const items = Array.isArray(data?.items) ? data.items : [];
      mediaGrid.innerHTML = items.length ? items.map(mediaCard).join("") : '<div class="manifest-empty">現時点で公開用manifestに動画・音声は登録していません。動画・音声を追加する場合は、顔・音声・学校名・児童名等の公開可否を確認してから <code>data/media-manifest.json</code> に追記します。</div>';
    }
  }
  document.addEventListener("DOMContentLoaded", render);
})();
