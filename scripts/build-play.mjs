import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const engineDir = join(root, '.cache', 'fab24hr-engine');
const gamesRoot = join(root, 'play-games');
const outRoot = join(root, 'public', 'sims');
const ENGINE_REPO = 'https://github.com/mcltyl/fab24hr-engine.git';
const ENGINE_REF = '829c4199d828b118a5dda389ae085428dd861c60';

function run(cmd, cwd = root) {
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function listGames() {
  return readdirSync(gamesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .filter((id) => existsSync(join(gamesRoot, id, 'game.json')));
}

if (!existsSync(join(engineDir, 'package.json'))) {
  rmSync(engineDir, { recursive: true, force: true });
  mkdirSync(dirname(engineDir), { recursive: true });
  run(`git clone --depth 1 ${ENGINE_REPO} "${engineDir}"`);
  run(`git fetch --depth 1 origin ${ENGINE_REF}`, engineDir);
  run(`git checkout ${ENGINE_REF}`, engineDir);
}

if (!existsSync(join(engineDir, 'node_modules'))) {
  run('npm ci', engineDir);
}

const games = listGames();
if (!games.length) {
  throw new Error('play-games/ 底下沒有任何關卡');
}

rmSync(outRoot, { recursive: true, force: true });
mkdirSync(outRoot, { recursive: true });

const catalog = [];
// 順序：回技能地圖 → 贊助我；樣式與 credit 一樣用底線 lnk（不改 fab24hr 那兩個連結）
const MAP_LINK = '<a class="lnk" href="/tpm-roadmap/">回技能地圖</a>';

function injectMapLinks(htmlPath) {
  let html = readFileSync(htmlPath, 'utf8');
  if (html.includes('>回技能地圖</a>')) return;
  html = html.replace(
    /<a class="bmc" id="hSupport" href="#" target="_blank" rel="noopener" hidden><\/a>/,
    `${MAP_LINK}<a class="lnk" id="hSupport" href="#" target="_blank" rel="noopener" hidden></a>`
  );
  html = html.replace(
    /<a class="bmc" id="endSupport" href="#" target="_blank" rel="noopener" hidden><\/a>/,
    `${MAP_LINK}<a class="lnk" id="endSupport" href="#" target="_blank" rel="noopener" hidden></a>`
  );
  writeFileSync(htmlPath, html);
}

for (const id of games) {
  const gameSrc = join(gamesRoot, id);
  const meta = JSON.parse(readFileSync(join(gameSrc, 'meta.json'), 'utf8'));
  const outDir = join(outRoot, id);

  rmSync(join(engineDir, 'game'), { recursive: true, force: true });
  mkdirSync(join(engineDir, 'game'), { recursive: true });
  cpSync(gameSrc, join(engineDir, 'game'), { recursive: true });
  // meta.json 不是引擎需要的檔
  rmSync(join(engineDir, 'game', 'meta.json'), { force: true });

  const gameJsonPath = join(engineDir, 'game', 'game.json');
  const gameJson = JSON.parse(readFileSync(gameJsonPath, 'utf8'));
  gameJson.lang = 'zh-Hant';
  writeFileSync(gameJsonPath, `${JSON.stringify(gameJson, null, 2)}\n`);

  run('npm run build', engineDir);
  mkdirSync(outDir, { recursive: true });
  cpSync(join(engineDir, 'public'), outDir, { recursive: true });
  injectMapLinks(join(outDir, 'index.html'));
  catalog.push(meta);
  console.log(`built ${id} → public/sims/${id}`);
}

writeFileSync(join(outRoot, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`catalog → public/sims/catalog.json (${catalog.length} games)`);
