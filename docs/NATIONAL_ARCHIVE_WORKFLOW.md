# 全国PTA資料館 運用手順

この資料館は、PDFをいきなり開かせるリンク集ではなく、学校別HTMLページで概要・確認事実・未確認事項・評価を読ませ、その下に原資料PDFと評価書PDFを置く設計です。

## 1. 最初に作るもの

### data/schools-master.json
自治体公式学校一覧を根拠にした学校母集団台帳です。

重要：開示資料に含まれる学校だけを入れないでください。資料が出てこない学校、不存在回答の学校、未確認の学校も可視化するため、公式学校一覧を先に作ります。

### data/national-archive.json
各学校に紐付く資料状況、疑義フラグ、評価、PDFリンクを管理します。

## 2. 作業順序

1. 自治体公式サイト等から学校一覧を確認する。
2. `data/schools-master.json` の `schools` に学校を追加する。
3. 開示資料を学校ごとに確認する。
4. `data/national-archive.json` の `entries` に資料状況を追加する。
5. 原資料PDFは `docs/national/[municipality_slug]/[school_slug]/original.pdf` に置く。
6. 評価書PDFは `docs/national/[municipality_slug]/[school_slug]/evaluation.pdf` に置く。
7. 必要に応じて一括PDFを `bundle.pdf` として置く。
8. `python tools/generate-national-archive.py` を実行してHTMLを生成する。
9. `archive/[municipality_slug]/index.html` と `archive/[municipality_slug]/[school_slug]/index.html` を確認する。

## 3. 絶対に混同しない項目

- PTA入会案内 ≠ PTA入会申込書
- 個人情報同意書 ≠ PTA入会申込書
- 学校納入金のお知らせ ≠ PTA入会申込書
- 「任意」と書いてある ≠ 任意性が実効的に確認できた
- 資料が出てこない ≠ 文書が絶対に存在しない

迷う場合は、断定せず「開示資料上確認できない」と入力してください。

## 4. 状態の使い分け

### 資料状態

- 資料あり
- 一部資料あり
- 開示資料上確認できない
- 不存在回答
- 未確認
- 対象外・要確認

### 個別資料状態

- あり
- なし
- 開示資料上確認できない
- 不存在回答
- 未確認
- 対象外・要確認

### 評価ラベル

- 未評価
- 適正化モデル
- 要確認
- 問題あり
- 重大リスク
- 資料不足

### 人間確認状態

- AI自動抽出・未確認
- 人間確認中
- 人間確認済み
- 公開可
- 公開保留
- 非公開

公開表示の中心にするのは、原則として「人間確認済み」または「公開可」です。

## 5. 疑義フラグの考え方

自動処理では「違法」「適法」と断定しません。付けるのは疑義フラグまでです。

典型例：

### 入会申込書なし + PTA会費徴収あり

- 入会申込書不在疑い
- 入会契約根拠不明
- みなし加入疑い
- PTA会費徴収根拠不明

### 任意と書いてある + 辞退申出制

- オプトアウト方式疑い
- みなし加入疑い

### 学校納入金資料にPTA会費が同列記載

- 学校徴収金抱き合わせ疑い
- 私費会計混同疑い
- PTA会費徴収根拠不明

### 個人情報同意はあるが入会申込書がない

- 入会契約と個人情報同意の混同疑い
- 加入意思表示不明

## 6. 学校別ページに載せる定型文

### 基本文

開示資料上、PTA入会案内は確認できるが、PTA入会申込書は確認できない。一方で、学校納入金に関する資料にはPTA会費の記載が確認される。このため、保護者による明示的な入会意思表示の有無、PTA会費徴収の根拠、学校徴収金との分離状況について確認を要する。

### 任意加入と書いてある場合

資料にはPTAが任意加入である旨の記載がある。ただし、入会申込書等による明示的な加入意思表示は確認できず、学校納入金資料にPTA会費が記載されているため、任意性が実効的に確保されているかについては確認を要する。

### 個人情報同意書だけある場合

個人情報の利用または提供に関する同意欄は確認できるが、PTAへの入会申込とは別個の問題である。提出資料上、入会契約の成立を基礎づける申込・承諾の記録は確認できない。

## 7. JSON入力例

### schools-master.json

```json
{
  "prefecture": "滋賀県",
  "municipality": "彦根市",
  "municipality_slug": "hikone",
  "school_name": "彦根市立〇〇小学校",
  "school_slug": "hikone-xxx-es",
  "school_type": "小学校",
  "official_school_list_source": "彦根市公式学校一覧",
  "official_school_url": "",
  "address": "",
  "latitude": "",
  "longitude": "",
  "school_status": "現存",
  "note": ""
}
```

### national-archive.json

```json
{
  "prefecture": "滋賀県",
  "municipality": "彦根市",
  "municipality_slug": "hikone",
  "school_name": "彦根市立〇〇小学校",
  "school_slug": "hikone-xxx-es",
  "school_type": "小学校",
  "document_status": "一部資料あり",
  "membership_guide_status": "あり",
  "membership_application_status": "開示資料上確認できない",
  "school_payment_notice_status": "あり",
  "pta_fee_in_school_payment": "あり",
  "disclosure_response_status": "一部開示",
  "issues": ["入会手続", "会費徴収", "学校徴収金"],
  "issue_flags": ["入会申込書不在疑い", "入会契約根拠不明", "みなし加入疑い", "PTA会費徴収根拠不明"],
  "human_review_status": "人間確認済み",
  "public_status": "公開可",
  "evaluation_label": "要確認",
  "facts_confirmed": "PTA入会案内および学校納入金資料は確認できる。学校納入金資料にPTA会費の記載がある。",
  "facts_not_confirmed": "PTA入会申込書は開示資料上確認できない。",
  "review_text": "開示資料上、PTA入会案内は確認できるが、PTA入会申込書は確認できない。一方で、学校納入金に関する資料にはPTA会費の記載が確認される。このため、保護者による明示的な入会意思表示の有無、PTA会費徴収の根拠、学校徴収金との分離状況について確認を要する。",
  "original_pdf": "/docs/national/hikone/hikone-xxx-es/original.pdf",
  "evaluation_pdf": "",
  "bundle_pdf": ""
}
```

## 8. 生成コマンド

```bash
python tools/generate-national-archive.py
```

生成先：

- `archive/[municipality_slug]/index.html`
- `archive/[municipality_slug]/[school_slug]/index.html`

## 9. 公開前確認

- 個人情報が残っていないか
- 印影、口座情報、児童名、保護者名が残っていないか
- PDFが重すぎないか
- 人間確認済みか
- 「資料なし」「未確認」「不存在回答」を混同していないか
- 入会案内と入会申込書を混同していないか
