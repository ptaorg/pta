import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const name of fs.readdirSync(path.join(root, dir))) {
    const rel = path.join(dir, name).replaceAll('\\', '/');
    const stat = fs.statSync(path.join(root, rel));
    if (stat.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

if (!exists('sitemap.xml')) {
  errors.push('sitemap.xml が見つかりません。');
} else {
  const sitemap = read('sitemap.xml');
  const malformed = [...sitemap.matchAll(/https:\/\/ptaorg\.github\.io\/pta\/[^<]*\/\//g)].map(m => m[0]);
  if (malformed.length) {
    errors.push('sitemap.xml に二重スラッシュURLがあります: ' + [...new Set(malformed)].join(', '));
  }
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const dupes = locs.filter((v, i) => locs.indexOf(v) !== i);
  if (dupes.length) {
    warnings.push('sitemap.xml に重複URLがあります: ' + [...new Set(dupes)].join(', '));
  }
}

const htmlFiles = walk('.', []).filter(f => f.endsWith('.html'));
const googleSiteLinks = [];
for (const file of htmlFiles) {
  const text = read(file);
  if (/sites\.google\.com|script\.google\.com\/macros\/s\//i.test(text)) {
    googleSiteLinks.push(file);
  }
}
if (googleSiteLinks.length) {
  errors.push('Googleサイト又はGAS公開URLと思われるリンクがあります: ' + googleSiteLinks.join(', '));
}

const mustExist = [
  'index.html',
  'materials-catalog.html',
  'responses.html',
  'edu.html',
  'guide-board.html',
  'AGENTS.md',
  'README.md'
];
for (const file of mustExist) {
  if (!exists(file)) errors.push(`${file} が見つかりません。`);
}

if (warnings.length) {
  console.warn('WARNINGS');
  for (const w of warnings) console.warn('- ' + w);
}

if (errors.length) {
  console.error('ERRORS');
  for (const e of errors) console.error('- ' + e);
  process.exit(1);
}

console.log('site check passed');
