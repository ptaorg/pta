const AUDIT_BANKS={
  parent:[
    {axis:"入会",q:"入会届・申込フォームなど、本人の加入意思を示す記録がありますか。",choices:[["ある",0],["不明・確認中",2],["ないが加入扱い",5]]},
    {axis:"会費",q:"PTA会費の請求主体と金額が、学校徴収金とは別に示されていますか。",choices:[["明示されている",0],["一部曖昧",2],["学校徴収金と一体に見える",5]]},
    {axis:"個人情報",q:"学校保有の児童・保護者情報をPTAへ提供する同意を取られていますか。",choices:[["同意記録がある",0],["不明",3],["同意なく提供されている可能性",5]]},
    {axis:"非会員",q:"非会員児童に不利益な扱いがないと説明されていますか。",choices:[["説明あり",0],["不明",2],["不利益が示唆される",4]]},
    {axis:"相談導線",q:"学校・教育委員会へ確認できる窓口が明示されていますか。",choices:[["明示あり",0],["探せば分かる",1],["不明",3]]}
  ],
  pta:[
    {axis:"会員管理",q:"入会申込書・同意記録に基づく会員名簿として整理され、非会員と混在していませんか。",choices:[["同意記録に基づき整理",0],["一部不明・古い名簿が残る",3],["加入意思記録なしに全員名簿化",5]]},
    {axis:"会計開示",q:"会費の収入・支出・残高・証憑を、会員が確認できる形で保存・開示していますか。",choices:[["総会資料と証憑確認の導線あり",0],["概要のみ・証憑導線が弱い",3],["詳細開示できない",5]]},
    {axis:"学校依存",q:"会費徴収・督促・名簿作成・配布を学校や教職員へ委ねていませんか。",choices:[["PTA側で分離運用",0],["一部学校協力あり",3],["恒常的に学校・教職員へ依存",5]]},
    {axis:"個人情報",q:"学校から提供された児童・保護者情報を、本人同意や提供根拠を確認せずPTA活動に使っていませんか。",choices:[["同意・根拠を確認し最小限",0],["経緯が不明なデータがある",4],["慣例で学校情報を利用",5]]},
    {axis:"規約・選出",q:"規約、役員選出、委任、議決、退会手続が会員に明示され、記録として残っていますか。",choices:[["明示・記録あり",0],["一部不明",2],["慣例運用で記録が乏しい",5]]}
  ],
  principal:[
    {axis:"校内事務",q:"PTA会費・名簿・役員選出を学校事務と分離していますか。",choices:[["分離済み",0],["一部混在",3],["混在している",5]]},
    {axis:"教職員関与",q:"教職員が勤務時間中にPTAの会計・督促・名簿作成をしていませんか。",choices:[["していない",0],["臨時的にある",3],["恒常的にある",5]]},
    {axis:"学校徴収金",q:"PTA会費を学校徴収金・教材費等と分けて扱っていますか。",choices:[["分離",0],["説明上は分けている",2],["一括徴収",5]]},
    {axis:"個人情報",q:"学校保有情報をPTAへ渡さない運用が校内で徹底されていますか。",choices:[["徹底",0],["一部不明",3],["慣例提供あり",5]]},
    {axis:"媒体・施設",q:"学校HP・配布物・施設利用で、PTAを学校制度のように扱っていませんか。",choices:[["区別している",0],["曖昧",2],["学校制度のように見える",4]]}
  ],
  board:[
    {axis:"方針",q:"PTA会費・学校徴収金・個人情報提供の分離方針がありますか。",choices:[["明確にある",0],["検討中",2],["ない",5]]},
    {axis:"通知",q:"各学校へ文書で周知・指導していますか。",choices:[["実施済み",0],["予定あり",2],["未実施",4]]},
    {axis:"個人情報",q:"学校保有情報をPTAへ提供しない手順を教育委員会として示していますか。",choices:[["示している",0],["学校判断",3],["示していない",5]]},
    {axis:"教職員",q:"勤務時間中のPTA事務従事を防ぐ運用・確認項目がありますか。",choices:[["ある",0],["一部曖昧",3],["ない",5]]},
    {axis:"監査耐性",q:"住民監査請求・開示請求に耐える資料保存と説明整理がありますか。",choices:[["ある",0],["不十分",3],["ない",5]]}
  ]
};

const PROFILE_LABELS={parent:"保護者向け監査",pta:"PTA役員向け監査",principal:"学校管理職向け監査",board:"教育委員会向け監査"};
const PROFILE=window.AUDIT_PROFILE||"parent";
const AUDIT_QUESTIONS=AUDIT_BANKS[PROFILE]||AUDIT_BANKS.parent;
let auditIndex=0, answers=[];

const PROFILE_RESOURCES={
  parent:{
    records:["入会申込書・加入意思確認記録","PTA会費の案内文・請求資料","学校徴収金とPTA会費の内訳資料","個人情報提供・利用に関する同意文書","退会・非加入時の扱いに関する説明資料"],
    ask:"PTA加入意思、会費徴収、個人情報利用について、記録と根拠資料を確認したいので、関係資料の提示または確認可能な窓口を教えてください。"
  },
  pta:{
    records:["会員名簿の作成根拠・入会申込書の保管状況","会計帳簿・予算決算資料・領収書等証憑","学校との委託・協力関係を示す文書","個人情報の取得元・利用目的・同意記録","規約・総会議事録・役員選出記録・退会手続資料"],
    ask:"PTA運営を任意団体として適正化するため、会員管理、会計開示、学校依存、個人情報、規約・役員選出に関する現行資料を確認したいです。"
  },
  principal:{
    records:["校務分掌・事務分担表","PTA会費と学校徴収金の徴収・管理区分資料","勤務時間中のPTA事務従事に関する取扱資料","学校保有個人情報の外部提供に関する手順書","PTA配布物・学校HP・施設利用に関する取扱記録"],
    ask:"学校業務とPTA事務の分離状況を確認するため、校務分掌、学校徴収金、個人情報提供、学校媒体・施設利用に関する現行資料を確認したいです。"
  },
  board:{
    records:["PTA会費・学校徴収金・個人情報提供に関する教育委員会方針","各学校への通知・事務連絡・指導記録","学校保有個人情報のPTA提供に関する手順書","教職員のPTA事務従事に関する確認項目","開示請求・監査請求に対応できる保存資料一覧"],
    ask:"公立学校におけるPTA運営の適正化状況を確認するため、教育委員会としての方針、各学校への通知、個人情報提供、教職員関与、資料保存体制に関する文書を確認したいです。"
  }
};

function escapeHtml(value){
  return String(value).replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch]));
}

function resultLevel(total){
  if(total>=18) return {label:"高リスク", cls:"danger", note:"早急に記録・同意・徴収・学校関与の確認が必要です。"};
  if(total>=9) return {label:"中リスク", cls:"warn", note:"一部に不明確な運用があります。原資料と運用実態を確認してください。"};
  return {label:"低リスク", cls:"success", note:"大きな危険信号は少ない状態です。ただし記録保存と継続点検が必要です。"};
}

function renderAudit(){
  const q=AUDIT_QUESTIONS[auditIndex], box=document.getElementById("auditQuestionBox"), steps=document.getElementById("auditSteps");
  if(!box||!steps)return;
  const title=document.getElementById("auditProfileTitle");
  if(title)title.textContent=PROFILE_LABELS[PROFILE]||"監査";
  steps.innerHTML=AUDIT_QUESTIONS.map((x,i)=>`<li class="${i===auditIndex?'is-active':''}">${i+1}. ${escapeHtml(x.axis)}</li>`).join("");
  box.innerHTML=`<div class="audit-question">${escapeHtml(q.q)}</div><p class="section-lead">論点：${escapeHtml(q.axis)}</p>${q.choices.map((c,i)=>`<button class="audit-choice ${answers[auditIndex]?.choice===i?'is-selected':''}" data-choice="${i}">${escapeHtml(c[0])}</button>`).join("")}<div class="audit-actions"><button class="btn-soft" id="auditPrev"${auditIndex===0?' disabled':''}>戻る</button><button class="btn-navy" id="auditNext">${auditIndex===AUDIT_QUESTIONS.length-1?'結果を見る':'次へ'}</button></div>`;
  const result=document.getElementById("auditResult");
  if(result) result.innerHTML="";
  document.querySelectorAll(".audit-choice").forEach(btn=>btn.onclick=()=>{answers[auditIndex]={choice:+btn.dataset.choice,score:q.choices[+btn.dataset.choice][1],text:q.choices[+btn.dataset.choice][0],axis:q.axis};renderAudit()});
  document.getElementById("auditPrev").onclick=()=>{if(auditIndex>0){auditIndex--;renderAudit()}};
  document.getElementById("auditNext").onclick=()=>{if(!answers[auditIndex]){alert("回答を選択してください。");return} if(auditIndex<AUDIT_QUESTIONS.length-1){auditIndex++;renderAudit()}else renderResult()};
  updateProgress();
}

function updateProgress(){
  const total=answers.reduce((s,a)=>s+(a?.score||0),0), max=AUDIT_QUESTIONS.length*5;
  const bar=document.getElementById("riskBar");
  if(bar)bar.style.width=Math.round(total/max*100)+"%";
}

function renderPriorityItems(){
  const riskItems=answers.map((a,i)=>({answer:a,question:AUDIT_QUESTIONS[i]})).filter(x=>x.answer && x.answer.score>=3);
  if(!riskItems.length){
    return `<p>今回の回答では、点数上の優先確認項目は限定的です。下の確認資料リストに沿って、記録の有無を保存してください。</p>`;
  }
  return `<ol>${riskItems.map(x=>`<li><strong>${escapeHtml(x.question.axis)}</strong>：${escapeHtml(x.answer.text)}<br><span>確認対象：${escapeHtml(x.question.q)}</span></li>`).join("")}</ol>`;
}

function renderResult(){
  const total=answers.reduce((s,a)=>s+(a?.score||0),0);
  const level=resultLevel(total);
  const result=document.getElementById("auditResult");
  const box=document.getElementById("auditQuestionBox");
  const meta=PROFILE_RESOURCES[PROFILE]||PROFILE_RESOURCES.parent;
  const today=new Date().toLocaleDateString('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit'});
  if(box) box.innerHTML="";
  if(!result) return;
  result.innerHTML=`
  <div class="audit-result-box audit-print-area">
    <div class="audit-result-head">
      <div>
        <p class="audit-result-kicker">${escapeHtml(PROFILE_LABELS[PROFILE]||"監査")} / ${escapeHtml(today)}</p>
        <h3>総合評価：${escapeHtml(level.label)}</h3>
        <p>リスク点：${total}点</p>
      </div>
      <div class="audit-score-badge ${level.cls}">${escapeHtml(level.label)}</div>
    </div>
    <div class="alert ${level.cls}">${escapeHtml(level.note)} この結果は法的判定ではなく、確認資料の優先順位を整理するための表示です。</div>

    <h3>優先確認項目</h3>
    <div class="audit-priority-list">${renderPriorityItems()}</div>

    <h3>確認資料リスト</h3>
    <ul class="audit-record-list">${meta.records.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>

    <h3>確認文案</h3>
    <div class="audit-template-box">${escapeHtml(meta.ask)}</div>

    <h3>回答一覧</h3>
    <ul>${answers.map((a,i)=>`<li>${escapeHtml(AUDIT_QUESTIONS[i].axis)}：${escapeHtml(a.text)}（${a.score}点）</li>`).join("")}</ul>

    <div class="audit-next-links no-print">
      <a class="btn-soft" href="../responses.html">回答DBで類似回答を見る</a>
      <a class="btn-soft" href="../submission-kit.html">提出キットを見る</a>
      <a class="btn-soft" href="../disclosure-request-kit.html">情報公開請求キットを見る</a>
    </div>
    <div class="audit-actions no-print">
      <button class="btn-navy" id="auditPrintResult" type="button">結果を印刷する</button>
      <button class="btn-soft" onclick="location.reload()" type="button">もう一度診断する</button>
    </div>
  </div>`;
  const printBtn=document.getElementById("auditPrintResult");
  if(printBtn) printBtn.onclick=()=>window.print();
  updateProgress();
}

document.addEventListener("DOMContentLoaded",renderAudit);
