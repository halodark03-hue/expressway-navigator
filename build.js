#!/usr/bin/env node

import { writeFileSync, readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

// Run vite build
console.log('Building client-side app...');
execSync('vite build', { stdio: 'inherit' });

const distDir = 'dist/client';
const indexPath = join(distDir, 'index.html');

// Check if index.html was created by vite
if (!existsSync(indexPath)) {
  console.log('Creating index.html...');
  
  const assetsDir = join(distDir, 'assets');
  let cssFiles = [];
  let jsFiles = [];

  try {
    const files = readdirSync(assetsDir);
    cssFiles = files.filter(f => f.endsWith('.css'));
    jsFiles = files.filter(f => f.endsWith('.js'));
  } catch (err) {
    console.warn('Could not read assets directory:', err.message);
    process.exit(1);
  }

  if (jsFiles.length === 0) {
    console.error('No JavaScript files found in build output!');
    process.exit(1);
  }

  // Get the main app bundle (usually the largest one)
  let mainJs = jsFiles.sort((a, b) => {
    try {
      const sizeA = readFileSync(join(assetsDir, a), 'utf-8').length;
      const sizeB = readFileSync(join(assetsDir, b), 'utf-8').length;
      return sizeB - sizeA;
    } catch (e) {
      return 0;
    }
  })[0];

  const cssLinks = cssFiles.map(css => `    <link rel="stylesheet" href="/assets/${css}" />`).join('\n');
  const jsScript = mainJs ? `    <script type="module" src="/assets/${mainJs}"><\/script>` : '';

  // Create SPA index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Expressway Algorithm Visualizer</title>
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
${jsScript}
  </body>
</html>`;

  writeFileSync(indexPath, indexHtml, 'utf-8');
  console.log('✓ Created dist/client/index.html');
} else {
  console.log('✓ index.html already created by Vite');
}

console.log('✓ Build completed successfully');
