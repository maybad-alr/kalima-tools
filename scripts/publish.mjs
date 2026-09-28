/**
 * Build + prerender, then (optionally) push dist/ to a GitHub Pages
 * gh-pages branch. Same static pattern used for aruqami.site.
 *
 *   node scripts/publish.mjs                       # just build into publish-tmp/
 *   node scripts/publish.mjs --repo=owner/kalima.tools   # build + push gh-pages
 */
import { execSync } from 'node:child_process';
import { rmSync, cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(root, 'publish-tmp');

const repoArg = (process.argv.find((a) => a.startsWith('--repo=')) || '').split('=').slice(1).join('=');

function run(cmd, cwd = root) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

run('npm run build && npm run build:ssr && npm run prerender');

rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
cpSync(join(root, 'dist'), tmp, { recursive: true });
writeFileSync(join(tmp, '.nojekyll'), '');

if (repoArg) {
  // Clone the existing gh-pages branch (if any) into publish-tmp, then overlay dist.
  try {
    rmSync(tmp, { recursive: true, force: true });
    run(`git clone --depth 1 --branch gh-pages --single-branch https://github.com/${repoArg}.git publish-tmp`);
    // wipe old site files but keep .git
    execSync('rm -rf $(ls -A | grep -v "^\\.git$") || true', { cwd: tmp, shell: '/bin/bash' });
    cpSync(join(root, 'dist'), tmp, { recursive: true });
    writeFileSync(join(tmp, '.nojekyll'), '');
  } catch {
    // gh-pages branch does not exist yet → orphan init
    mkdirSync(tmp, { recursive: true });
    cpSync(join(root, 'dist'), tmp, { recursive: true });
    writeFileSync(join(tmp, '.nojekyll'), '');
    run('git init -q', tmp);
    run('git checkout -b gh-pages', tmp);
    run('git remote add origin ' + `https://github.com/${repoArg}.git`, tmp);
  }
  run('git add -A', tmp);
  run(`git commit -m "deploy: ${new Date().toISOString()}"`, tmp);
  run('git push -u origin gh-pages', tmp);
  rmSync(tmp, { recursive: true, force: true }); // disposable staging — don't leave built assets in the worktree
  console.log(`\nDeployed to GitHub Pages (gh-pages of ${repoArg}).`);
} else {
  console.log('\nBuilt & prerendered into publish-tmp/. Add --repo=owner/name to push to GitHub Pages.');
}
