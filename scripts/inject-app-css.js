#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../docs/.vitepress/dist');
const assetsDir = path.join(distDir, 'assets');

// Recursively find all HTML files in dist
function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'assets') {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const assetFiles = fs.readdirSync(assetsDir);

// --- 1. Inject app.*.css into all HTML files ---
const appCssFile = assetFiles.find(f => /^app\..+\.css$/.test(f));

if (!appCssFile) {
  console.warn('Warning: No app.*.css file found in dist/assets');
  process.exit(0);
}

const appCssPath = `assets/${appCssFile}`;
const htmlFiles = findHtmlFiles(distDir);
let appCssInjected = 0;

for (const filePath of htmlFiles) {
  let html = fs.readFileSync(filePath, 'utf-8');

  if (!html.includes(appCssPath)) {
    html = html.replace(
      /(\s+)<link rel="preload stylesheet" href="\/vitepress\/assets\/demo-components/,
      `$1<link rel="preload stylesheet" href="/vitepress/${appCssPath}" as="style">\n$1<link rel="preload stylesheet" href="/vitepress/assets/demo-components`
    );
    fs.writeFileSync(filePath, html, 'utf-8');
    appCssInjected++;
  }
}

console.log(`Injected app CSS into ${appCssInjected} HTML files (${appCssPath})`);

// --- 2. Inject orphan component CSS (e.g. Quiz) into HTML files that reference the JS chunk ---
// Find CSS files that have a matching JS chunk (may be in assets/ or assets/chunks/)
const chunksDir = path.join(assetsDir, 'chunks');
const chunkFiles = fs.existsSync(chunksDir) ? fs.readdirSync(chunksDir) : [];
const allJsFiles = [
  ...assetFiles.filter(f => f.endsWith('.js')),
  ...chunkFiles.filter(f => f.endsWith('.js'))
];

const componentChunks = {};
for (const file of assetFiles) {
  const match = file.match(/^([A-Za-z][\w-]*)\..+\.css$/);
  if (match && match[1] !== 'app' && match[1] !== 'style' && match[1] !== 'demo-components') {
    const name = match[1];
    const jsChunk = allJsFiles.find(f => f.startsWith(name + '.') && f.endsWith('.js'));
    if (jsChunk) {
      componentChunks[name] = { cssFile: file, jsChunk };
    }
  }
}

let totalComponentCssInjected = 0;

for (const [name, { cssFile, jsChunk }] of Object.entries(componentChunks)) {
  const cssPath = `assets/${cssFile}`;
  let count = 0;

  for (const filePath of htmlFiles) {
    let html = fs.readFileSync(filePath, 'utf-8');

    // Only inject if this HTML references the JS chunk but not the CSS
    if (html.includes(jsChunk) && !html.includes(cssPath)) {
      // Inject before </head>
      const linkTag = `    <link rel="preload stylesheet" href="/vitepress/${cssPath}" as="style">`;
      html = html.replace('</head>', `${linkTag}\n  </head>`);
      fs.writeFileSync(filePath, html, 'utf-8');
      count++;
    }
  }

  if (count > 0) {
    console.log(`Injected ${name} CSS into ${count} pages (${cssFile})`);
    totalComponentCssInjected += count;
  }
}

if (totalComponentCssInjected === 0 && Object.keys(componentChunks).length > 0) {
  console.log(`No orphan component CSS needed injection`);
}
