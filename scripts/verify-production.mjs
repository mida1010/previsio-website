import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { load } from 'cheerio';

const root = process.cwd();
const baselineRoot = process.env.PREVISIO_BASELINE_DIR;

if (!baselineRoot) {
  throw new Error('PREVISIO_BASELINE_DIR is required.');
}

async function read(relativePath, base = root) {
  return readFile(path.join(base, relativePath), 'utf8');
}

async function assertFileExists(relativePath) {
  const info = await stat(path.join(root, relativePath));
  if (!info.isFile() || info.size === 0) {
    throw new Error(`${relativePath} is missing or empty.`);
  }
}

async function assertByteIdentical(relativePath) {
  const [before, after] = await Promise.all([
    readFile(path.join(baselineRoot, relativePath)),
    readFile(path.join(root, relativePath))
  ]);
  if (!before.equals(after)) {
    throw new Error(`${relativePath} changed, but it is presentation or behaviour source and must remain byte-identical.`);
  }
}

function normalizeLegacyIndex(index) {
  const legacyScripts = [
    '  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>\n',
    '  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>\n',
    '  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>\n'
  ];

  let normalized = index;
  for (const script of legacyScripts) {
    normalized = normalized.replace(script, '');
  }
  normalized = normalized.replace(
    '  <script type="text/babel" src="landing-v11.jsx"></script>',
    '  <script src="landing-v11.loader.js?v=20260805"></script>'
  );
  return normalized;
}

function extractRootSignature(html) {
  const $ = load(html);
  const rootNode = $('#root');
  if (rootNode.length !== 1) {
    throw new Error('Rendered DOM does not contain exactly one #root element.');
  }

  const normalizedText = rootNode.text().replace(/\s+/g, ' ').trim();
  const tags = {};
  rootNode.find('*').each((_, element) => {
    const tag = element.tagName.toLowerCase();
    tags[tag] = (tags[tag] || 0) + 1;
  });

  const attributes = [];
  rootNode.find('*').each((_, element) => {
    const tag = element.tagName.toLowerCase();
    const attribs = element.attribs || {};
    const relevant = Object.entries(attribs)
      .filter(([name]) => ['id', 'href', 'src', 'type', 'name', 'value', 'placeholder', 'role', 'aria-label', 'aria-expanded'].includes(name))
      .sort(([a], [b]) => a.localeCompare(b));
    if (relevant.length > 0) {
      attributes.push([tag, relevant]);
    }
  });

  const sectionOrder = rootNode.find('section[id]').map((_, element) => $(element).attr('id')).get();
  const linkTargets = rootNode.find('a[href]').map((_, element) => $(element).attr('href')).get();
  const buttonLabels = rootNode.find('button').map((_, element) => $(element).text().replace(/\s+/g, ' ').trim()).get();

  return JSON.stringify({ normalizedText, tags, attributes, sectionOrder, linkTargets, buttonLabels });
}

const immutableFiles = [
  'landing-v11.source.jsx',
  'landing-v11.jsx',
  'mobile-responsive.css',
  'founder-education-fix.js',
  'Request.html',
  'faq.html',
  'faq-data.js',
  'terms.html',
  'privacy.html',
  'eula.html'
];

for (const relativePath of immutableFiles) {
  await assertByteIdentical(relativePath);
}

await assertFileExists('landing-v11.bundle.js');
await assertFileExists('landing-v11.loader.js');
await assertFileExists('landing-v11.bootstrap.js');
await assertFileExists('index.html');

const [baselineIndex, productionIndex] = await Promise.all([
  read('index.html', baselineRoot),
  read('index.html')
]);
if (normalizeLegacyIndex(baselineIndex) !== productionIndex) {
  throw new Error('index.html contains changes beyond the verified dependency and loader replacement.');
}

const [legacyLoader, productionLoader] = await Promise.all([
  read('landing-v11.jsx', baselineRoot),
  read('landing-v11.loader.js')
]);
if (legacyLoader !== productionLoader) {
  throw new Error('The production loader is not byte-identical to the existing verified loader.');
}

const [baselineBootstrap, productionBootstrap] = await Promise.all([
  read('landing-v11.bootstrap.js', baselineRoot),
  read('landing-v11.bootstrap.js')
]);
const legacyRuntimeMarker = "  const response = await fetch(sourceUrl, { cache: 'no-cache' });";
const productionRuntimeMarker = "  await new Promise((resolve, reject) => {\n    const existing = document.querySelector('script[data-previsio-production-bundle=\"current\"]');";
const legacyMarkerIndex = baselineBootstrap.indexOf(legacyRuntimeMarker);
const productionMarkerIndex = productionBootstrap.indexOf(productionRuntimeMarker);
if (legacyMarkerIndex < 0 || productionMarkerIndex < 0) {
  throw new Error('Unable to verify the bootstrap runtime replacement boundaries.');
}
if (baselineBootstrap.slice(0, legacyMarkerIndex) !== productionBootstrap.slice(0, productionMarkerIndex)) {
  throw new Error('Bootstrap setup or responsive styling changed before the runtime loader boundary.');
}

const bundle = await read('landing-v11.bundle.js');
const forbiddenRuntimeDependencies = [
  'react.development.js',
  'react-dom.development.js',
  '@babel/standalone',
  'Babel.transform',
  'text/babel'
];
for (const forbidden of forbiddenRuntimeDependencies) {
  if (bundle.includes(forbidden) || productionIndex.includes(forbidden)) {
    throw new Error(`Production output still contains forbidden runtime dependency: ${forbidden}`);
  }
}

if (process.argv.length === 4) {
  const baselineDom = await readFile(process.argv[2], 'utf8');
  const productionDom = await readFile(process.argv[3], 'utf8');
  const baselineSignature = extractRootSignature(baselineDom);
  const productionSignature = extractRootSignature(productionDom);
  if (baselineSignature !== productionSignature) {
    throw new Error('Rendered DOM parity check failed between the legacy runtime and production bundle.');
  }
}

console.log('Production verification passed: presentation source is unchanged and rendered structure is equivalent.');
