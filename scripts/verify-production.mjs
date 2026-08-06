import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function assertFileExists(relativePath) {
  const info = await stat(path.join(root, relativePath));
  if (!info.isFile() || info.size === 0) {
    throw new Error(`${relativePath} is missing or empty.`);
  }
}

const requiredFiles = [
  'index.html',
  'landing-v11.source.jsx',
  'landing-v11.jsx',
  'landing-v11.loader.js',
  'landing-v11.bootstrap.js',
  'landing-v11.bundle.js',
  'mobile-responsive.css',
  'founder-education-fix.js',
  'chat-language-override.js',
  'Request.html',
  'faq.html',
  'faq-data.js',
  'terms.html',
  'privacy.html',
  'eula.html',
  'package-lock.json'
];

for (const relativePath of requiredFiles) {
  await assertFileExists(relativePath);
}

const [index, sourceLoader, productionLoader, bootstrap, bundle] = await Promise.all([
  read('index.html'),
  read('landing-v11.jsx'),
  read('landing-v11.loader.js'),
  read('landing-v11.bootstrap.js'),
  read('landing-v11.bundle.js')
]);

if (sourceLoader !== productionLoader) {
  throw new Error('landing-v11.loader.js must remain byte-identical to the verified website loader.');
}

if (!index.includes('<script src="landing-v11.loader.js?v=20260805-2"></script>')) {
  throw new Error('index.html does not load the production website loader.');
}

if (!bootstrap.includes('data-previsio-production-bundle')) {
  throw new Error('landing-v11.bootstrap.js does not load the production bundle.');
}

const forbiddenRuntimeDependencies = [
  'react.development.js',
  'react-dom.development.js',
  '@babel/standalone',
  'babel.min.js',
  'Babel.transform',
  'text/babel'
];

for (const forbidden of forbiddenRuntimeDependencies) {
  if (index.includes(forbidden) || bootstrap.includes(forbidden) || bundle.includes(forbidden)) {
    throw new Error(`Production output contains forbidden runtime dependency: ${forbidden}`);
  }
}

if (bootstrap.includes("fetch(sourceUrl, { cache: 'no-cache' })")) {
  throw new Error('The website is still fetching JSX for runtime compilation.');
}

console.log('Production verification passed. React is bundled and no runtime JSX compiler is loaded.');
