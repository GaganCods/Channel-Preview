/**
 * server.js — Node/Express local dev server with clean URL support
 * Usage: node server.js
 * Then visit: http://localhost:3000
 *
 * Install dependency once: npm install express
 */
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// ── 301 Redirect: .html URLs → clean URLs ──────────────────────────
app.get('/editor.html', (req, res) => res.redirect(301, '/editor'));
app.get('/index.html', (req, res) => res.redirect(301, '/'));

// ── Static assets (CSS, JS, images) ───────────────────────────────
app.use(express.static(ROOT));

// ── Clean URL: /editor → serve editor/index.html ──────────────────
app.get('/editor', (req, res) => {
    res.sendFile(path.join(ROOT, 'editor', 'index.html'));
});

// ── Root: / → serve index.html ────────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(ROOT, 'index.html'));
});

// ── 404 fallback ──────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).send('404 — Page not found');
});

app.listen(PORT, () => {
    console.log(`\n✅ Preview Channel running at http://localhost:${PORT}`);
    console.log(`   Home   → http://localhost:${PORT}/`);
    console.log(`   Editor → http://localhost:${PORT}/editor\n`);
});
