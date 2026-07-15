const http = require('http');
const fs = require('fs');
const path = require('path');
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch(e) {
  console.log('Puppeteer not found, PDF export might fail if not installed globally.');
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/export-json') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const filename = `snapshot_${Date.now()}.json`;
      fs.writeFileSync(filename, body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, file: filename }));
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/export-pdf') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const { html, title } = JSON.parse(body);
        const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
        
        if (puppeteer) {
          const browser = await puppeteer.launch({ 
            headless: true, 
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' 
          });
          const page = await browser.newPage();
          // Provide some basic styling for the PDF
          const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: sans-serif; padding: 20px; color: black; background: white; }
                .card { border: 1px solid #ccc; margin-bottom: 20px; padding: 15px; page-break-inside: avoid; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .badge { padding: 4px 8px; background: #eee; border-radius: 4px; font-size: 12px; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              ${html}
            </body>
            </html>
          `;
          await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
          await page.pdf({ path: filename, format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });
          await browser.close();
        } else {
          // fallback if puppeteer fails
          fs.writeFileSync(filename.replace('.pdf', '.html'), body);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, file: filename }));
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static file serving
  let filePath = './frontend' + req.url;
  if (req.url === '/') filePath = './frontend/index.html';
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(8080, () => {
  console.log('Dev server running at http://127.0.0.1:8080/');
});
