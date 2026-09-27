import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distDocsDir = path.join(distDir, 'docs');
const repoDocsDir = path.join(rootDir, 'docs');

function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'docs') continue; // Avoid recursive loop
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function stripRedirectFromDocsIndex(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(
      /\/\/ If served on GitHub Pages root[\s\S]*?window\.location\.replace\(base \+ 'docs\/'[\s\S]*?}/g,
      '// Docs standalone build active - no redirect needed'
    );
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('--- Post-build: Synchronizing GitHub Pages artifacts ---');

if (fs.existsSync(distDir)) {
  // 1. Ensure dist/.nojekyll
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  // 2. Populate dist/docs
  console.log('Populating dist/docs with standalone bundle...');
  copyFolderSync(distDir, distDocsDir);
  fs.writeFileSync(path.join(distDocsDir, '.nojekyll'), '');
  stripRedirectFromDocsIndex(path.join(distDocsDir, 'index.html'));

  // 3. Populate root docs/ for fallback branch deployment
  console.log('Populating root docs/ directory for fallback deployment...');
  copyFolderSync(distDir, repoDocsDir);
  fs.writeFileSync(path.join(repoDocsDir, '.nojekyll'), '');
  stripRedirectFromDocsIndex(path.join(repoDocsDir, 'index.html'));

  // 4. Ensure repoDocsDir also has a docs/ subfolder
  const repoDocsDocsDir = path.join(repoDocsDir, 'docs');
  copyFolderSync(distDir, repoDocsDocsDir);
  fs.writeFileSync(path.join(repoDocsDocsDir, '.nojekyll'), '');
  stripRedirectFromDocsIndex(path.join(repoDocsDocsDir, 'index.html'));

  console.log('--- Post-build: Completed successfully ---');
} else {
  console.error('dist directory does not exist!');
  process.exit(1);
}
