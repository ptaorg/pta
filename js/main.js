// Legal Evidence Data
const lawData = {
    'personal-info': {
        title: '個人情報保護法 第69条',
        body: `<p>公立学校は行政機関等に該当します。</p>
               <div class="law-quote">行政機関等の長等は、法令に基づく場合を除き、利用目的以外の目的のために、保有個人情報を自ら利用し、又は提供してはならない。</div>
               <p><a href="https://laws.e-gov.go.jp/law/415AC0000000057" target="_blank" class="egov-link">e-Govで詳しく見る</a></p>`
    },
    'local-public-service': {
        title: '地方公務員法 第30条',
        body: `<p>教職員の服務の根本原則です。</p>
               <div class="law-quote">すべて職員は、全体の奉仕者として公共の利益のために勤務し、且つ、職務の遂行に当つては、全力を挙げてこれに専念しなければならない。</div>
               <p><a href="https://laws.e-gov.go.jp/law/325AC0000000261" target="_blank" class="egov-link">e-Govで詳しく見る</a></p>`
    },
    'school-edu': {
        title: '学校教育法 第137条',
        body: `<p>学校施設の目的外利用に関する規定です。</p>
               <div class="law-quote">学校教育上支障のない限り、学校施設を、社会教育その他公共の福祉のために利用させることができる。</div>
               <!-- 調査中：特定の任意団体への独占的利用の可否については慎重な議論が必要です。 -->
               <p><a href="https://laws.e-gov.go.jp/law/322AC0000000026" target="_blank" class="egov-link">e-Govで詳しく見る</a></p>`
    }
};

// Modal Logic
const modal = document.getElementById('lawModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.open-evidence').forEach(btn => {
    btn.onclick = () => {
        const key = btn.getAttribute('data-law');
        const data = lawData[key];
        if (data) {
            modalBody.innerHTML = `<h2>${data.title}</h2>${data.body}`;
            modal.style.display = 'flex';
        }
    };
});

if(modalClose) {
    modalClose.onclick = () => modal.style.display = 'none';
}

window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
};

// Hamburger logic
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
if(hamburger) {
    hamburger.onclick = () => mobileOverlay.style.display = 'flex';
    document.getElementById('closeOverlay').onclick = () => mobileOverlay.style.display = 'none';
}

// e-Gov linker (auto-adds icons)
document.addEventListener('DOMContentLoaded', () => {
    const egovLinks = document.querySelectorAll('.egov-link');
    egovLinks.forEach(link => {
        link.innerHTML += ' ↗';
    });
});
