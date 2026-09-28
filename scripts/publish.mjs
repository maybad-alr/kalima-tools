/**
 * Build + prerender, then push dist/ to the gh-pages branch (GitHub Pages).
 * Works whether or not gh-pages already exists. Same static pattern as
 * aruqami.site.
 *
 *   node scripts/publish.mjs                          # build only → publish-tmp/
 *   node scripts/publish.mjs --repo=owner/kalima-tools  # build + deploy
 */
import { execSync, spawnSync } from 'node:child_process';
import { rmSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(root, 'publish-tmp');
const repoArg = (process.argv.find((a) => a.startsWith('--repo=')) || '').split('=').slice(1).join('=');
const originUrl = repoArg ? `https://github.com/${repoArg}.git` : '';

function run(cmd, cwd = root, allowFail = false) {
  console.log(`$ ${cmd}`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
  } catch (err) {
    if (!allowFail) throw err;
  }
}

// Git clones mark pack objects read-only → plain rmSync fails on Windows.
function removeDir(p) {
  if (process.platform === 'win32') {
    try { execSync(`cmd /c rmdir /s /q "${p}"`, { stdio: 'ignore' }); } catch { /* ok */ }
  }
  rmSync(p, { recursive: true, force: true });
}

removeDir(tmp);
run('npm run build && npm run build:ssr && npm run prerender');

if (!repoArg) {
  mkdirSync(tmp, { recursive: true });
  cpSync(join(root, 'dist'), tmp, { recursive: true });
  writeFileSync(join(tmp, '.nojekyll'), '');
  console.log('\nBuilt & prerendered into publish-tmp/. Add --repo=owner/name to push to GitHub Pages.');
  process.exit(0);
}

mkdirSync(tmp, { recursive: true });
run('git init -q', tmp);
run(`git remote add origin ${originUrl}`, tmp);

const hasBranch = spawnSync('git', ['fetch', '--depth', '1', 'origin', 'gh-pages'], { cwd: tmp }).status === 0;
run(hasBranch ? 'git checkout -q -b gh-pages FETCH_HEAD' : 'git checkout -q -b gh-pages', tmp);

cpSync(join(root, 'dist'), tmp, { recursive: true });
writeFileSync(join(tmp, '.nojekyll'), '');

run('git add -A', tmp);
run(`git -c core.safecrlf=false commit -q -m "deploy: ${new Date().toISOString()}"`, tmp, true);
run('git push -q origin gh-pages', tmp);

removeDir(tmp);
console.log(`\nDeployed to GitHub Pages (gh-pages of ${repoArg}).`);
