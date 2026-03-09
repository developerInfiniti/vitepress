#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../docs/.vitepress/dist');
const assetsDir = path.join(distDir, 'assets');

// Find app.*.css file
const files = fs.readdirSync(assetsDir);
const appCssFile = files.find(f => /^app\..+\.css$/.test(f));

if (!appCssFile) {
  console.warn('⚠️ No app.*.css file found in dist/assets');
  process.exit(0);
}

const appCssPath = `assets/${appCssFile}`;
const linkTag = `    <link rel="preload stylesheet" href="/vitepress/${appCssPath}" as="style">`;

// Find and update all HTML files
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
let injectedCount = 0;

for (const htmlFile of htmlFiles) {
  const filePath = path.join(distDir, htmlFile);
  let html = fs.readFileSync(filePath, 'utf-8');

  // Check if app CSS link is already present
  if (!html.includes(appCssPath)) {
    // Inject before the first stylesheet link
    html = html.replace(
      /(\s+)<link rel="preload stylesheet" href="\/vitepress\/assets\/demo-components/,
      `$1${linkTag}\n$1<link rel="preload stylesheet" href="/vitepress/assets/demo-components`
    );

    fs.writeFileSync(filePath, html, 'utf-8');
    injectedCount++;
  }
}

console.log(`✓ Injected app CSS link into ${injectedCount} HTML files (${appCssPath})`);
