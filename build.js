#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';

// Run vite build first
import { execSync } from 'child_process';
execSync('vite build', { stdio: 'inherit' });

// After build, create index.html with the latest assets
const distDir = 'dist/client';

// Create minimal index.html
const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Expressway Navigator</title>
    <link rel="stylesheet" href="/assets/styles-CpbXFUAm.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index-Bebnk30b.js"></script>
  </body>
</html>`;

writeFileSync(join(distDir, 'index.html'), indexHtml, 'utf-8');
console.log('✓ Created dist/client/index.html');
