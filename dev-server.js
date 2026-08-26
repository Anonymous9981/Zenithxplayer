const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle Netlify functions emulation (e.g. /.netlify/functions/youtube)
  if (pathname.startsWith('/.netlify/functions/')) {
    const functionName = pathname.replace('/.netlify/functions/', '').split('/')[0];
    const functionFile = path.join(__dirname, 'netlify', 'functions', `${functionName}.js`);

    if (fs.existsSync(functionFile)) {
      try {
        delete require.cache[require.resolve(functionFile)];
        const fnModule = require(functionFile);

        // Collect request body
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            queryStringParameters: parsedUrl.query,
            body: body || null
          };
          const context = {
            clientContext: req.headers['authorization'] ? {
              user: { sub: 'mock-user-id', email: 'dev@zenithx.local' }
            } : null
          };

          try {
            const result = await fnModule.handler(event, context);
            const headers = result.headers || { 'Content-Type': 'application/json' };
            res.writeHead(result.statusCode || 200, headers);
            res.end(result.body || '');
          } catch (err) {
            console.error(`[Error in function ${functionName}]:`, err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      } catch (err) {
        console.error(`[Failed to load function ${functionName}]:`, err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Function ${functionName} not found` }));
      return;
    }
  }

  // Safe file path resolution within public directory
  let safeSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safeSuffix);

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        // SPA Fallback: serve index.html for unknown routes
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (spaErr, indexContent) => {
          if (spaErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
            res.end(indexContent);
          }
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(` ZenithX Player Dev & Preview Server`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Serving: ${PUBLIC_DIR}`);
  console.log(` Serverless functions: /.netlify/functions/*`);
  console.log(`========================================\n`);
});
