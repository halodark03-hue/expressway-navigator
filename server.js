import http from 'http';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const clientDir = join(__dirname, 'dist/client');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Remove query strings and hash
  let filePath = req.url.split('?')[0].split('#')[0];
  
  // Serve static assets
  if (filePath.startsWith('/assets/')) {
    filePath = filePath.slice(1);
    const fullPath = join(clientDir, filePath);
    if (existsSync(fullPath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      createReadStream(fullPath).pipe(res);
      return;
    }
  }

  // Serve index.html for all routes (SPA routing)
  const indexPath = join(clientDir, 'index.html');
  if (existsSync(indexPath)) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    createReadStream(indexPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
