/**
 * server.js — Zero-dependency Node local dev server with clean URL support
 * Usage: node server.js
 * Then visit: http://localhost:3000
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.ico': 'image/x-icon'
};

const cleanUrlMap = {
    '/editor': path.join(ROOT, 'editor', 'index.html'),
    '/blog': path.join(ROOT, 'blog', 'index.html'),
    '/youtube-banner-preview': path.join(ROOT, 'youtube-banner-preview', 'index.html'),
    '/youtube-thumbnail-preview': path.join(ROOT, 'youtube-thumbnail-preview', 'index.html'),
    '/youtube-profile-picture-preview': path.join(ROOT, 'youtube-profile-picture-preview', 'index.html'),
    '/youtube-banner-safe-area': path.join(ROOT, 'youtube-banner-safe-area', 'index.html'),
    '/youtube-title-preview': path.join(ROOT, 'youtube-title-preview', 'index.html'),
    '/youtube-video-detail-preview': path.join(ROOT, 'youtube-video-detail-preview', 'index.html'),
    '/': path.join(ROOT, 'index.html')
};

const server = http.createServer((req, res) => {
    let url = req.url.split('?')[0];

    // ── 301 Redirects: .html URLs → clean URLs ──
    if (url === '/editor.html') {
        res.writeHead(301, { 'Location': '/editor' });
        return res.end();
    }
    if (url === '/index.html') {
        res.writeHead(301, { 'Location': '/' });
        return res.end();
    }
    if (url === '/youtube-banner-preview.html') {
        res.writeHead(301, { 'Location': '/youtube-banner-preview' });
        return res.end();
    }
    if (url === '/youtube-thumbnail-preview.html') {
        res.writeHead(301, { 'Location': '/youtube-thumbnail-preview' });
        return res.end();
    }

    // ── Clean URL resolution ──
    let filePath = cleanUrlMap[url];

    if (!filePath) {
        if (url.startsWith('/blog/')) {
            const slug = url.substring(6);
            filePath = path.join(ROOT, 'blog', slug, 'index.html');
        } else if (url.startsWith('/category/')) {
            const slug = url.substring(10);
            filePath = path.join(ROOT, 'category', slug, 'index.html');
        } else if (url.startsWith('/author/')) {
            const slug = url.substring(8);
            filePath = path.join(ROOT, 'author', slug, 'index.html');
        }
    }

    if (!filePath) {
        filePath = path.join(ROOT, url);
    }

    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 — Page not found');
        }

        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        fs.access(filePath, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('404 — Page not found');
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, { 'Content-Type': contentType });
            const stream = fs.createReadStream(filePath);
            stream.on('error', () => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 — Internal Server Error');
            });
            stream.pipe(res);
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Preview Channel running at http://localhost:${PORT}`);
    console.log(`   Home   → http://localhost:${PORT}/`);
    console.log(`   Editor → http://localhost:${PORT}/editor\n`);
});
