# PTA適正化推進委員会 サイト構成ドキュメント
# AI作業用リファレンス — 編集前に必ず読むこと

作成日：2026年4月25日  
対象ディレクトリ：`/home/claude/pta-v2/`  
公開URL：`https://ptaorg.github.io/`

---

## 1. ページの世代区分（重要）

このサイトには **新世代ページ** と **旧世代ページ** が混在している。
ナビゲーション・フッターの構造が異なるため、混同しないこと。

### 新世代ページ（v3ナビ）
今回刷新済み。共通ナビは `/tmp/nav_fragment.html` の構造を持つ。
検索窓あり。フッターは4カラム。

| ファイル | タイトル | 状態 |
|---|---|---|
| `index.html` | トップページ | ✅ 新世代 |
| `guide-parent.html` | 保護者の方へ | ✅ 新世代 |
| `guide-pta.html` | PTA役員の方へ | ✅ 新世代 |
| `guide-board.html` | 教育委員会・学校へ | ✅ 新世代 |
| `board-responses.html` | 教育委員会の回答 | ✅ 新世代 |
| `national-archive.html` | 全国資料館 | ✅ 新世代 |
| `journal.html` | 論考・調査報告 | ✅ 新世代 |
| `membership.html` | 入会手続・オプトアウト | ✅ 新世代（ナビ更新済） |
| `fee-collection.html` | 会費徴収 | ✅ 新世代（ナビ更新済） |
| `audit/index.html` | 監査システム | ✅ 新世代（既存） |

### 旧世代ページ（v2ナビ）
ナビが古い。`national-map.html`（削除済）・`blog.html`（リダイレクト済）への
リンクが残っている。将来的に更新が必要。
**これらのナビを編集するときは旧構造のまま維持するか、新世代ナビに全取替すること。**

| ファイル | タイトル | 旧ナビの問題 |
|---|---|---|
| `privacy.html` | 個人情報問題 | national-map.html・blog.htmlリンクあり |
| `personnel.html` | 教職員関与問題 | 同上 |
| `facilities.html` | 施設利用問題 | 同上 |
| `cases.html` | 判例整理 | 同上 |
| `report.html` | 総合分析レポート | 同上 |
| `guide-research.html` | 研究者・記者の方へ | 同上 |
| `administrative-materials.html` | 行政資料整理 | 同上 |
| `law-map.html` | 法制度マップ | 独自ナビ（blog.htmlリンクあり） |

### リダイレクトのみ
| ファイル | 動作 |
|---|---|
| `blog.html` | `journal.html` へ自動リダイレクト |

### 削除済みファイル（存在しないので参照しないこと）
- `national-map.html` — 削除済。`board-responses.html` に統合
- `documents-room.html` — 削除済
- `national-map.html` — 削除済

---

## 2. 共通CSS・JSの仕組み

### CSS
**全ページ共通：** `css/style.css`  
`audit/index.html` だけは `../css/style.css`（1階層上）で読む。

`style.css` に含まれるもの：
- CSS変数（カラーパレット・シャドウ・ボーダー半径）
- ヘッダー・ナビゲーション・検索窓
- 共通ボタン（`.btn-gold`・`.btn-navy`・`.btn-outline`・`.btn-soft`・`.btn-dl`）
- フッター
- 共通コンポーネント（`.alert`・`.law-quote`・`.risk-lv`・`.section-kicker` など）
- レスポンシブブレークポイント（860px・560px）

**各ページ固有のCSS**は、そのページの `<head>` 内の `<style>` タグに書く。
`style.css` は触らずページ固有スタイルは `<style>` で追記する方針。

### JS
| ファイル | 読み込むページ | 役割 |
|---|---|---|
| `js/site.js` | **全ページ共通** | 検索・ハンバーガー・メガメニュー・FAQ accordion・チェックリスト |
| `js/law-data.js` | `law-map.html`・`audit/index.html` | 法令条文データ（`window.LAW_DATA`）|
| `js/main.js` | `law-map.html` のみ | 法制度マップのUI制御 |
| `js/audit-db.js` | `audit/index.html` のみ | 監査設問データ（`window.AUDIT_DB`） |
| `js/audit-engine.js` | `audit/index.html` のみ | 診断ロジック（`window.AuditEngine`） |
| `js/audit-ui.js` | `audit/index.html` のみ | 監査UIの制御 |

`audit/index.html` は `../js/` と1階層上のパスで読む。

### `site.js` が提供する機能（全ページ共通）
- `SITE_INDEX` 配列：全ページのタイトル・URL・説明（検索インデックス）
- `initSearch()`：`.header-search` 内の `.search-input` と `.search-results-dropdown` を連携
- `initHamburger()`：`#hamburger`・`#mobileOverlay`・`#closeOverlay` を連携
- `initMegaMenu()`：`.nav-item.has-dropdown` のホバー/タップ展開
- `initFAQ()`：`.faq-item` / `.faq-q` / `.faq-a` の accordion
- `initChecklist()`：`.check-box` のクリックでチェック状態をトグル

---

## 3. 共通ヘッダー・フッターの構造

GitHub Pagesはサーバーサイドインクルードが使えないため、
**各HTMLに直接ヘッダー・フッターを書いている**。

共通ナビの最新版テンプレートは `/tmp/nav_fragment.html`（コンテナ内のみ存在）。
次の作業セッションでは使えないので、`index.html` のヘッダー部分をコピーして使うこと。

### 新世代ナビの必須HTML構造
```html
<header class="site-header">
  <div class="nav-container">
    <a href="index.html" class="logo">...</a>
    <div class="header-search">         ← 検索窓（必須）
      <svg>...</svg>
      <input type="text" class="search-input" ...>
      <div class="search-results-dropdown"></div>
    </div>
    <nav class="desktop-nav">
      ... メガメニュー ...
      <a href="audit/index.html" class="btn-gold">監査を開く</a>
    </nav>
    <button class="hamburger" id="hamburger">...</button>
  </div>
</header>
<div class="mobile-overlay" id="mobileOverlay">
  ... モバイルリンク ...
  <div class="close-overlay" id="closeOverlay">CLOSE ×</div>
</div>
```

### フッターの必須HTML構造
```html
<footer class="footer">
  <div class="footer-grid">  ← 4カラムグリッド
    ...
  </div>
  <p class="copyright">...</p>
</footer>
<script src="js/site.js"></script>  ← フッター直前に必ず置く
```

`audit/index.html` だけ `../js/site.js` と1階層上のパス。

---

## 4. ページ間のリンク関係

### 全ページのナビから参照されているページ
これらはリンク先として必ず存在していなければならない：
- `index.html`
- `guide-parent.html`
- `guide-pta.html`
- `guide-board.html`
- `guide-research.html`
- `audit/index.html`
- `membership.html`
- `privacy.html`
- `fee-collection.html`
- `personnel.html`
- `facilities.html`
- `law-map.html`
- `cases.html`
- `board-responses.html`
- `national-archive.html`
- `journal.html`
- `report.html`
- `administrative-materials.html`

### 外部リンク（Googleサイト）
PDF原本倉庫として外部リンク。変更しないこと。
```
https://sites.google.com/view/ptatekiseika/
```

### Leaflet地図（board-responses.html のみ）
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```
他のページは読み込まない。

---

## 5. 各ページの役割・主要コンテンツ

### `index.html` — トップ
- アラートバナー（横浜市通知）
- ヒーロー（統計・横スクロール立場別カード5枚）
- 「今何が起きているか」セクション（4カード＋注目カード）
- 構造インフォグラフィック（問題→原因→解決）
- 5論点カード（入会手続がfeatured）
- 監査CTA

### `guide-parent.html` — 保護者向け
- 6枚の絵カード（OK/NG/WARN）
- 不審な入会書類の実例4パターン＋適正1パターン
- 3ステップ行動ガイド
- PDF テンプレート6種（Googleサイトへリンク）
- FAQ accordion

### `guide-pta.html` — PTA役員向け
- 就任直後タイムライン（4フェーズ・インタラクティブチェックボックス `.check-box`）
- リスク棒グラフ（3カテゴリ×2項目）
- Before/After比較（入会手続・学校との関係）
- 5段階ロードマップ
- PDF雛形6種（Googleサイトへリンク）

### `guide-board.html` — 教育委員会・学校向け
- 職務専念義務の図解（学校↔渉外業務↔PTA）
- 渉外業務のOK/NG一覧
- 覚書問題の解説（問題のある覚書 vs 適正な覚書）
- 横浜市通知の4項目まとめ

### `board-responses.html` — 教委回答
- 統計4カード（50+自治体・100%違法回答×2・横浜市1番）
- 横浜市通知の詳細（2カラムカード）
- 回答一覧グリッド6枚
- Leaflet地図（10都市マーカー・3色凡例）
- Googleサイトへの誘導

### `national-archive.html` — 全国資料館
- 統計（archive-hero-stats）
- 論点別6カテゴリカード（各カテゴリ→論点ページへ）
- Googleサイト誘導セクション

### `journal.html` — 論考・調査報告
- カテゴリフィルター（論考/調査報告/行政動向/資料解説）
- 記事カード（`data-cat` 属性でJS絞り込み）
- サイドバー（カテゴリ数・関連リンク）

### `audit/index.html` — 監査システム
- 3立場選択（保護者/役員/教委）
- 5軸診断（membership/privacy/finance/personnel/facilities）
- JSファイル4本が連携（`audit-db.js`→`audit-engine.js`→`audit-ui.js`）
- 総合評価書をクライアントサイドテンプレートで生成（APIは使わない）

### 論点ページ（旧世代ナビ・内容は既存）
`membership.html`・`privacy.html`・`fee-collection.html`・`personnel.html`・
`facilities.html`・`cases.html`・`law-map.html`・`report.html`・
`guide-research.html`・`administrative-materials.html`

---

## 6. CSS変数リファレンス（style.css）

```css
--navy:      #05111f   /* メインの濃紺（最暗） */
--navy-2:    #0c1f35   /* 濃紺（中） */
--navy-3:    #1a3a52   /* 濃紺（明） */
--gold:      #d4af37   /* ゴールド */
--gold-lt:   #f4e7a6   /* ライトゴールド（白背景上のアクセント） */
--cream:     #f8f5ee   /* クリーム */
--red:       #b91c1c   /* 危険・違法 */
--orange:    #c2410c   /* 警告 */
--green:     #15803d   /* 適正・OK */
--blue:      #1d4ed8   /* 情報・適法 */
--text:      #1a1a1a   /* 本文 */
--text-soft: #4b5563   /* 薄い本文 */
--line:      #e5e7eb   /* ボーダー */
--bg:        #f4f6f9   /* ページ背景 */
--surface:   #ffffff   /* カード背景 */
--radius:    16px
--radius-sm: 10px
--shadow-sm: 0 4px 16px rgba(5,17,31,.07)
--shadow-md: 0 12px 36px rgba(5,17,31,.12)
--shadow-lg: 0 24px 64px rgba(5,17,31,.18)
--t:         all .26s ease
```

---

## 7. ファイルの編集ルール

### やっていいこと
- 各ページの `<style>` タグ内のページ固有CSSを追記・変更する
- `<main>` 内のコンテンツを追加・変更する
- `js/site.js` の `SITE_INDEX` 配列にページを追加する
- `js/audit-db.js` の設問データを変更する

### やってはいけないこと
- `css/style.css` の変数・共通コンポーネントを不用意に変更する（全ページに影響）
- `js/audit-db.js`・`js/audit-engine.js`・`js/audit-ui.js` を同時に変更する（監査が壊れる）
- `national-map.html`・`documents-room.html` を新規作成する（削除済みの廃止ページ）
- `blog.html` の中身を書く（リダイレクトのみのファイル）

### ページを新規追加するとき
1. `index.html` のヘッダー部分をコピーしてナビを作る
2. `<style>` タグにページ固有CSSを書く
3. フッター直前に `<script src="js/site.js"></script>` を置く
4. `js/site.js` の `SITE_INDEX` 配列に追加する
5. 全ページのナビメガメニューに追加する（全ページを手動更新）

### 旧世代ページのナビを更新するとき
`privacy.html`・`personnel.html`・`facilities.html`・`cases.html`・
`report.html`・`guide-research.html`・`administrative-materials.html`・`law-map.html`
のナビは旧構造。`index.html` のナビで全取替するか、そのまま触らないかどちらか。
中途半端に部分修正しない。

---

## 8. assets ディレクトリ

```
assets/
  popc-logo.png        ← ヘッダーロゴ（44×44px）
  yokomusubi.png       ← フッターのよこむすびロゴ
  og-image.png         ← OGP画像
  favicon-32.png       ← ファビコン 32px
  favicon-192.png      ← PWA用アイコン
  favicon.svg          ← SVGファビコン
  apple-touch-icon.png ← iOS用アイコン
```

`audit/index.html` からは `../assets/` と1階層上のパスで参照。

---

## 9. 既知の不整合（次回作業で対応すべき事項）

| 問題 | 対象ファイル | 優先度 |
|---|---|---|
| 旧ナビに `national-map.html`（削除済）へのリンクが残る | privacy.html・personnel.html・facilities.html・cases.html・report.html・guide-research.html・administrative-materials.html・law-map.html | 中 |
| 旧ナビに `blog.html` へのリンクが残る（blog.htmlはリダイレクトのみなので実害はないが） | 同上 | 低 |
| `law-map.html` のナビが独自構造（`js/main.js` に依存する独立ページ） | law-map.html | 低 |
| `administrative-materials.html` の内容が薄い | administrative-materials.html | 低 |
