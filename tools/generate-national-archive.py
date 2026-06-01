#!/usr/bin/env python3
"""
全国PTA資料館 静的HTML生成スクリプト

目的:
- data/schools-master.json を学校母集団台帳として読む。
- data/national-archive.json を資料・評価データとして読む。
- archive/[自治体slug]/index.html と archive/[自治体slug]/[学校slug]/index.html を生成する。

重要:
- このスクリプトは違法・適法を自動判定しない。
- 「資料なし」「未確認」「不存在回答」を混同しない。
- PTA入会案内、PTA入会申込書、個人情報同意書、学校納入金資料を混同しない。
- 人間確認済みまたは公開可のデータだけを公開表示の中心にする。
"""
from __future__ import annotations

import html
import json
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
SCHOOLS_PATH = ROOT / "data" / "schools-master.json"
ARCHIVE_PATH = ROOT / "data" / "national-archive.json"
OUT_DIR = ROOT / "archive"

PUBLIC_REVIEW_STATUSES = {"人間確認済み", "公開可"}


def load_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Missing required file: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def esc(value: Any) -> str:
    if value is None:
        return ""
    return html.escape(str(value), quote=True)


def slug_key(municipality_slug: str, school_slug: str) -> Tuple[str, str]:
    return (municipality_slug or "", school_slug or "")


def normalize_list(value: Any) -> List[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v) for v in value if str(v).strip()]
    if isinstance(value, str):
        return [v.strip() for v in value.replace("、", ";").split(";") if v.strip()]
    return [str(value)]


def link_if_present(label: str, href: str) -> str:
    if not href:
        return f'<span class="archive-missing">{esc(label)}：未掲載</span>'
    return f'<a href="{esc(href)}">{esc(label)}</a>'


def page_shell(title: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#0b2a4a" />
<title>{esc(title)} | PTA適正化推進委員会</title>
<meta name="description" content="全国PTA資料館。自治体別・学校別に、PTA入会案内、入会申込書、学校納入金資料、原資料PDF、評価書PDFを整理します。" />
<link rel="stylesheet" href="/css/style.css" />
<style>
.archive-page{{max-width:1120px;margin:0 auto;padding:28px 16px 64px;line-height:1.85;color:#223241}}
.archive-page a{{color:#0b4f94;text-decoration:underline;text-underline-offset:3px}}
.archive-hero{{background:#fff;border:1px solid #d7dee7;border-radius:20px;padding:28px;box-shadow:0 12px 30px rgba(11,42,74,.08);margin-bottom:24px}}
.archive-kicker{{font-weight:800;color:#c6a24b;letter-spacing:.08em;text-transform:uppercase}}
.archive-hero h1{{margin:.2em 0;color:#0b2a4a;line-height:1.35}}
.archive-note{{background:#f7f9fb;border-left:5px solid #0b2a4a;padding:14px 16px;border-radius:12px;margin:18px 0}}
.archive-table{{width:100%;border-collapse:collapse;background:#fff;border:1px solid #d7dee7;border-radius:14px;overflow:hidden}}
.archive-table th,.archive-table td{{border-bottom:1px solid #d7dee7;padding:10px 12px;text-align:left;vertical-align:top}}
.archive-table th{{background:#eef2f5;color:#0b2a4a;font-weight:800}}
.archive-table tr:last-child td{{border-bottom:0}}
.archive-section{{background:#fff;border:1px solid #d7dee7;border-radius:18px;padding:22px;margin:18px 0}}
.archive-section h2{{color:#0b2a4a;margin-top:0}}
.badge{{display:inline-block;border:1px solid #d7dee7;border-radius:999px;padding:2px 9px;margin:2px;background:#f7f9fb;font-size:.9em}}
.badge-risk{{border-color:#c4493d;color:#8f2c24;background:#fff5f3}}
.archive-missing{{color:#607184}}
.archive-footer-nav{{margin-top:26px}}
@media (max-width:720px){{.archive-table{{font-size:.92rem}}.archive-table th:nth-child(3),.archive-table td:nth-child(3){{display:none}}}}
</style>
</head>
<body>
<main class="archive-page">
{body}
</main>
</body>
</html>
"""


def status_value(entry: Dict[str, Any], key: str) -> str:
    return str(entry.get(key) or "未確認")


def make_school_page(school: Dict[str, Any], entry: Dict[str, Any]) -> str:
    school_name = school.get("school_name") or entry.get("school_name") or "学校名未設定"
    municipality = school.get("municipality") or entry.get("municipality") or "自治体未設定"
    prefecture = school.get("prefecture") or entry.get("prefecture") or ""
    review_status = status_value(entry, "human_review_status")
    is_public_review = review_status in PUBLIC_REVIEW_STATUSES

    issues = normalize_list(entry.get("issues"))
    flags = normalize_list(entry.get("issue_flags"))
    facts_confirmed = entry.get("facts_confirmed") or "確認済みの事実は未入力です。"
    facts_not_confirmed = entry.get("facts_not_confirmed") or "資料上確認できない点は未入力です。"
    review_text = entry.get("review_text") or entry.get("summary") or "当委員会評価は未入力です。"

    if not is_public_review:
        review_text = "この学校の評価は人間確認前または公開保留です。原資料・評価は確認後に掲載します。"

    flag_html = "".join(f'<span class="badge badge-risk">{esc(flag)}</span>' for flag in flags) or '<span class="archive-missing">未設定</span>'
    issue_html = "".join(f'<span class="badge">{esc(issue)}</span>' for issue in issues) or '<span class="archive-missing">未設定</span>'

    body = f"""
<section class="archive-hero">
  <div class="archive-kicker">National PTA Archive</div>
  <h1>{esc(school_name)} PTA関連資料</h1>
  <p>{esc(prefecture)} {esc(municipality)}。PTA入会案内、入会申込書、学校納入金資料等の確認状況を整理します。</p>
  <div class="archive-note"><strong>注意</strong><br>このページは、原資料に基づき確認できる事実、資料上確認できない点、当委員会の評価を分けて表示します。自動処理で違法・適法を断定しません。</div>
</section>

<section class="archive-section">
  <h2>資料確認状況</h2>
  <table class="archive-table">
    <tr><th>項目</th><th>状態</th></tr>
    <tr><td>公式学校一覧</td><td>{esc(school.get('school_status') or '未確認')}</td></tr>
    <tr><td>資料全体</td><td>{esc(status_value(entry, 'document_status'))}</td></tr>
    <tr><td>PTA入会案内</td><td>{esc(status_value(entry, 'membership_guide_status'))}</td></tr>
    <tr><td>PTA入会申込書</td><td>{esc(status_value(entry, 'membership_application_status'))}</td></tr>
    <tr><td>学校納入金・入金案内</td><td>{esc(status_value(entry, 'school_payment_notice_status'))}</td></tr>
    <tr><td>学校納入金資料内のPTA会費記載</td><td>{esc(status_value(entry, 'pta_fee_in_school_payment'))}</td></tr>
    <tr><td>開示・回答状況</td><td>{esc(status_value(entry, 'disclosure_response_status'))}</td></tr>
    <tr><td>人間確認状態</td><td>{esc(review_status)}</td></tr>
  </table>
</section>

<section class="archive-section">
  <h2>主な論点</h2>
  <p>{issue_html}</p>
  <h2>疑義フラグ</h2>
  <p>{flag_html}</p>
</section>

<section class="archive-section">
  <h2>確認できる事実</h2>
  <p>{esc(facts_confirmed)}</p>
  <h2>資料上確認できない点</h2>
  <p>{esc(facts_not_confirmed)}</p>
</section>

<section class="archive-section">
  <h2>当委員会の評価</h2>
  <p><strong>評価ラベル：</strong>{esc(status_value(entry, 'evaluation_label'))}</p>
  <p>{esc(review_text)}</p>
</section>

<section class="archive-section">
  <h2>原資料・評価書PDF</h2>
  <ul>
    <li>{link_if_present('原資料PDF', entry.get('original_pdf') or '')}</li>
    <li>{link_if_present('評価書PDF', entry.get('evaluation_pdf') or '')}</li>
    <li>{link_if_present('原資料＋評価書 一括PDF', entry.get('bundle_pdf') or '')}</li>
  </ul>
  <p class="archive-missing">個人情報・印影・口座情報等のマスキング確認が完了していないPDFは公開しないでください。</p>
</section>

<div class="archive-footer-nav"><a href="../index.html">{esc(municipality)}の学校一覧へ戻る</a> ／ <a href="/national-archive.html">全国PTA資料館へ</a></div>
"""
    return page_shell(f"{school_name} PTA関連資料", body)


def make_municipality_page(municipality: str, municipality_slug: str, rows: List[Tuple[Dict[str, Any], Dict[str, Any]]]) -> str:
    prefecture = rows[0][0].get("prefecture") or rows[0][1].get("prefecture") or "" if rows else ""
    total = len(rows)
    confirmed = sum(1 for _, e in rows if status_value(e, "human_review_status") in PUBLIC_REVIEW_STATUSES)
    missing_app = sum(1 for _, e in rows if status_value(e, "membership_application_status") == "開示資料上確認できない")
    nonexistent = sum(1 for _, e in rows if status_value(e, "disclosure_response_status") == "不存在回答")
    unreviewed = sum(1 for _, e in rows if status_value(e, "human_review_status") not in PUBLIC_REVIEW_STATUSES)

    trs = []
    for school, entry in sorted(rows, key=lambda pair: pair[0].get("school_name") or pair[1].get("school_name") or ""):
        school_name = school.get("school_name") or entry.get("school_name") or "学校名未設定"
        school_slug = school.get("school_slug") or entry.get("school_slug") or "unknown-school"
        issues = "、".join(normalize_list(entry.get("issues"))) or "未設定"
        trs.append(
            "<tr>"
            f"<td><a href=\"{esc(school_slug)}/index.html\">{esc(school_name)}</a></td>"
            f"<td>{esc(status_value(entry, 'document_status'))}</td>"
            f"<td>{esc(status_value(entry, 'membership_application_status'))}</td>"
            f"<td>{esc(issues)}</td>"
            f"<td>{esc(status_value(entry, 'evaluation_label'))}</td>"
            "</tr>"
        )

    if not trs:
        trs.append('<tr><td colspan="5">学校データが未登録です。</td></tr>')

    body = f"""
<section class="archive-hero">
  <div class="archive-kicker">Municipality Archive</div>
  <h1>{esc(prefecture)} {esc(municipality)}</h1>
  <p>自治体公式学校一覧を母集団とし、各学校のPTA関連資料の確認状況を表示します。</p>
</section>
<section class="archive-section">
  <h2>集計</h2>
  <ul>
    <li>学校数：{total}校</li>
    <li>人間確認済み・公開可：{confirmed}校</li>
    <li>PTA入会申込書が開示資料上確認できない：{missing_app}校</li>
    <li>不存在回答：{nonexistent}校</li>
    <li>未確認・確認中：{unreviewed}校</li>
  </ul>
</section>
<section class="archive-section">
  <h2>学校一覧</h2>
  <table class="archive-table">
    <tr><th>学校名</th><th>資料状況</th><th>入会申込書</th><th>主な論点</th><th>評価</th></tr>
    {''.join(trs)}
  </table>
</section>
<div class="archive-footer-nav"><a href="/national-archive.html">全国PTA資料館へ戻る</a></div>
"""
    return page_shell(f"{municipality} PTA資料一覧", body)


def main() -> None:
    schools_data = load_json(SCHOOLS_PATH)
    archive_data = load_json(ARCHIVE_PATH)
    schools = schools_data.get("schools", [])
    entries = archive_data.get("entries", [])

    entry_by_key = {slug_key(e.get("municipality_slug"), e.get("school_slug")): e for e in entries}

    grouped: Dict[str, List[Tuple[Dict[str, Any], Dict[str, Any]]]] = defaultdict(list)
    municipality_names: Dict[str, str] = {}

    for school in schools:
        municipality_slug = school.get("municipality_slug") or "unknown-municipality"
        school_slug = school.get("school_slug") or "unknown-school"
        entry = entry_by_key.get(slug_key(municipality_slug, school_slug), {})
        grouped[municipality_slug].append((school, entry))
        municipality_names[municipality_slug] = school.get("municipality") or entry.get("municipality") or municipality_slug

    # entriesだけ存在する場合も出す。ただし学校母集団未登録として扱う。
    for entry in entries:
        key = slug_key(entry.get("municipality_slug"), entry.get("school_slug"))
        already = any(slug_key(s.get("municipality_slug"), s.get("school_slug")) == key for rows in grouped.values() for s, _ in rows)
        if already:
            continue
        school = {
            "prefecture": entry.get("prefecture", ""),
            "municipality": entry.get("municipality", ""),
            "municipality_slug": entry.get("municipality_slug", "unknown-municipality"),
            "school_name": entry.get("school_name", "学校名未設定"),
            "school_slug": entry.get("school_slug", "unknown-school"),
            "school_type": entry.get("school_type", "未確認"),
            "school_status": "母集団未登録・要確認",
        }
        municipality_slug = school["municipality_slug"]
        grouped[municipality_slug].append((school, entry))
        municipality_names[municipality_slug] = school.get("municipality") or municipality_slug

    OUT_DIR.mkdir(exist_ok=True)

    for municipality_slug, rows in grouped.items():
        municipality_dir = OUT_DIR / municipality_slug
        municipality_dir.mkdir(parents=True, exist_ok=True)
        municipality_name = municipality_names.get(municipality_slug, municipality_slug)
        (municipality_dir / "index.html").write_text(
            make_municipality_page(municipality_name, municipality_slug, rows), encoding="utf-8"
        )
        for school, entry in rows:
            school_slug = school.get("school_slug") or entry.get("school_slug") or "unknown-school"
            school_dir = municipality_dir / school_slug
            school_dir.mkdir(parents=True, exist_ok=True)
            (school_dir / "index.html").write_text(make_school_page(school, entry), encoding="utf-8")

    print(f"Generated {sum(len(v) for v in grouped.values())} school pages in {OUT_DIR}")


if __name__ == "__main__":
    main()
