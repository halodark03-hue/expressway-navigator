#!/usr/bin/env node

import { writeFileSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Run vite build first
import { execSync } from 'child_process';
execSync('vite build', { stdio: 'inherit' });

// After build, create index.html with the latest assets
const distDir = 'dist/client';
const assetsDir = join(distDir, 'assets');

let cssFiles = [];
let jsFiles = [];

try {
  const files = readdirSync(assetsDir);
  cssFiles = files.filter(f => f.endsWith('.css'));
  jsFiles = files.filter(f => f.endsWith('.js'));
} catch (err) {
  console.warn('Could not read assets directory:', err.message);
}

// Find main JS entry (usually contains hydrateRoot or createRoot)
let mainJs = jsFiles.find(f => {
  try {
    const content = readFileSync(join(assetsDir, f), 'utf-8');
    return content.includes('hydrateRoot') || content.includes('createRoot');
  } catch (e) {
    return false;
  }
});

// Fallback to first js file if not found
if (!mainJs && jsFiles.length > 0) {
  mainJs = jsFiles[0];
}

const cssLinks = cssFiles.map(css => `<link rel="stylesheet" href="/assets/${css}" />`).join('\n    ');
const jsScript = mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : '';

// Create minimal index.html
const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Expressway Navigator</title>
    ${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    ${jsScript}
  </body>
</html>`;

writeFileSync(join(distDir, 'index.html'), indexHtml, 'utf-8');
console.log('✓ Created dist/client/index.html with dynamic assets');
