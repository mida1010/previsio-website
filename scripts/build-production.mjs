import { build } from 'esbuild';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'landing-v11.source.jsx');
const bootstrapPath = path.join(root, 'landing-v11.bootstrap.js');
const loaderSourcePath = path.join(root, 'landing-v11.jsx');
const loaderOutputPath = path.join(root, 'landing-v11.loader.js');
const indexPath = path.join(root, 'index.html');
const bundlePath = path.join(root, 'landing-v11.bundle.js');
const temporaryEntryPath = path.join(root, '.previsio-production-entry.jsx');

function countOccurrences(value, search) {
  return value.split(search).length - 1;
}

function replaceExactlyOnce(value, from, to, label) {
  const occurrences = countOccurrences(value, from);
  if (occurrences !== 1) {
    throw new Error(`${label}: expected exactly one occurrence, found ${occurrences}.`);
  }
  return value.replace(from, to);
}

async function buildBundle() {
  let source = await readFile(sourcePath, 'utf8');

  const legacyNavigationOrder = `  const links = [
  { href: '#engine', label: nl[0] },
  { href: '#features', label: nl[1] },
  { href: '#analytics', label: nl[2] },
  { href: '#validation', label: nl[3] },
  { href: '#use-cases', label: nl[4] },
  { href: '#dashboard', label: nl[5] },
  { href: '#pricing', label: nl[6] },
  { href: '#about', label: nl[7] }];`;

  const renderedNavigationOrder = `  const links = [
  { href: '#dashboard', label: nl[5] },
  { href: '#engine', label: nl[0] },
  { href: '#features', label: nl[1] },
  { href: '#analytics', label: nl[2] },
  { href: '#validation', label: nl[3] },
  { href: '#use-cases', label: nl[4] },
  { href: '#pricing', label: nl[6] },
  { href: '#about', label: nl[7] }];`;

  const legacySectionOrder = `    const sectionIds = ['engine', 'features', 'analytics', 'validation', 'use-cases', 'dashboard', 'pricing', 'about'];`;
  const renderedSectionOrder = `    const sectionIds = ['dashboard', 'engine', 'features', 'analytics', 'validation', 'use-cases', 'pricing', 'about'];`;

  source = replaceExactlyOnce(
    source,
    legacyNavigationOrder,
    renderedNavigationOrder,
    'Navbar order compatibility check'
  );
  source = replaceExactlyOnce(
    source,
    legacySectionOrder,
    renderedSectionOrder,
    'Navbar section-order compatibility check'
  );

  const founderBioUpdates = [
    {
      from: "I bring to this project a background in Business Analytics for Management at LIUC Business University, with a focus on financial analysis, statistical modelling and AI-assisted software development.",
      to: "I bring to this project a background in Business Analytics for Management at LIUC Business University, with a focus on financial analysis, statistical modelling and AI-assisted software development. I am also pursuing the CFA Program, one of the most prestigious and internationally recognised professional pathways in financial analysis and investment management."
    },
    {
      from: "Porto in questo percorso una formazione in Business Analytics for Management alla LIUC Business University, con un focus su analisi finanziaria, modellistica statistica e sviluppo software assistito da AI.",
      to: "Porto in questo percorso una formazione in Business Analytics for Management alla LIUC Business University, con un focus su analisi finanziaria, modellistica statistica e sviluppo software assistito da AI. Sto inoltre seguendo il CFA Program, uno dei percorsi di qualificazione professionale più prestigiosi e riconosciuti a livello internazionale nell’analisi finanziaria e nell’investment management."
    },
    {
      from: "J’apporte à ce projet une formation en Business Analytics for Management à la LIUC Business University, avec un accent sur l’analyse financière, la modélisation statistique et le développement logiciel assisté par IA.",
      to: "J’apporte à ce projet une formation en Business Analytics for Management à la LIUC Business University, avec un accent sur l’analyse financière, la modélisation statistique et le développement logiciel assisté par IA. Je poursuis également le CFA Program, l’un des parcours de qualification professionnelle les plus prestigieux et reconnus à l’échelle internationale en analyse financière et en gestion d’investissement."
    },
    {
      from: "Ich bringe in dieses Projekt eine Ausbildung in Business Analytics for Management an der LIUC Business University ein, mit Fokus auf Finanzanalyse, statistische Modellierung und KI-gestützte Softwareentwicklung.",
      to: "Ich bringe in dieses Projekt eine Ausbildung in Business Analytics for Management an der LIUC Business University ein, mit Fokus auf Finanzanalyse, statistische Modellierung und KI-gestützte Softwareentwicklung. Darüber hinaus absolviere ich das CFA Program, einen der weltweit renommiertesten und anerkanntesten professionellen Qualifikationswege in Finanzanalyse und Investment Management."
    }
  ];

  founderBioUpdates.forEach(({ from, to }, index) => {
    source = replaceExactlyOnce(
      source,
      from,
      to,
      `Founder CFA copy compatibility check for language index ${index}`
    );
  });

  const legacyScrollSpy = `    const handleScroll = () => {
      const navH = 72;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= navH + 60) current = id;
      }
      setActiveId(current);
    };`;

  const correctedScrollSpy = `    const handleScroll = () => {
      const navH = 72;
      const activationLine = navH + 60;
      let current = '';
      let closestTop = Number.NEGATIVE_INFINITY;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = el.getBoundingClientRect().top;
        if (top <= activationLine && top > closestTop) {
          closestTop = top;
          current = id;
        }
      }

      setActiveId(current);
    };`;

  source = replaceExactlyOnce(
    source,
    legacyScrollSpy,
    correctedScrollSpy,
    'Navbar scroll-spy compatibility check'
  );

  const entrySource = `import React from 'react';
import { createRoot } from 'react-dom/client';
const ReactDOM = { createRoot };

${source}`;

  await writeFile(temporaryEntryPath, entrySource, 'utf8');

  try {
    await build({
      entryPoints: [temporaryEntryPath],
      outfile: bundlePath,
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2020'],
      minify: true,
      sourcemap: false,
      legalComments: 'none',
      charset: 'utf8',
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
  } finally {
    await rm(temporaryEntryPath, { force: true });
  }
}

async function preserveLoaderAndBootstrapBehaviour() {
  const loaderSource = await readFile(loaderSourcePath, 'utf8');
  await writeFile(loaderOutputPath, loaderSource, 'utf8');

  let bootstrap = await readFile(bootstrapPath, 'utf8');
  const runtimeCompilationStart = "  const response = await fetch(sourceUrl, { cache: 'no-cache' });";
  const catchStart = "})().catch((error) => {";
  const productionMarker = "data-previsio-production-bundle";

  if (bootstrap.includes(runtimeCompilationStart)) {
    const startIndex = bootstrap.indexOf(runtimeCompilationStart);
    const endIndex = bootstrap.indexOf(catchStart);
    if (endIndex <= startIndex) {
      throw new Error('Unable to isolate the legacy runtime compilation block.');
    }

    const productionLoader = `  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-previsio-production-bundle="current"]');
    if (existing) {
      if (existing.dataset.previsioLoaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', () => reject(new Error('Unable to load landing-v11.bundle.js')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'landing-v11.bundle.js?v=20260805';
    script.async = false;
    script.dataset.previsioProductionBundle = 'current';
    script.onload = () => {
      script.dataset.previsioLoaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Unable to load landing-v11.bundle.js'));
    document.head.appendChild(script);
  });
`;

    bootstrap = bootstrap.slice(0, startIndex) + productionLoader + bootstrap.slice(endIndex);
  } else if (!bootstrap.includes(productionMarker)) {
    throw new Error('Bootstrap is neither the verified legacy version nor the production-loader version.');
  }

  await writeFile(bootstrapPath, bootstrap, 'utf8');
}

async function updateIndexWithoutChangingMarkupOrStyles() {
  let index = await readFile(indexPath, 'utf8');

  const legacyScripts = [
    '  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>\n',
    '  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>\n',
    '  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>\n'
  ];

  for (const legacyScript of legacyScripts) {
    const occurrences = countOccurrences(index, legacyScript);
    if (occurrences === 1) {
      index = index.replace(legacyScript, '');
    } else if (occurrences !== 0) {
      throw new Error(`Unexpected duplicate legacy dependency script: ${legacyScript.trim()}`);
    }
  }

  const legacyLoader = '  <script type="text/babel" src="landing-v11.jsx"></script>';
  const productionLoader = '  <script src="landing-v11.loader.js?v=20260805"></script>';

  if (index.includes(legacyLoader)) {
    index = replaceExactlyOnce(index, legacyLoader, productionLoader, 'Homepage loader replacement');
  } else if (!index.includes(productionLoader)) {
    throw new Error('Homepage does not contain the verified legacy or production loader.');
  }

  await writeFile(indexPath, index, 'utf8');
}

async function removeIncompleteWorkflow() {
  await rm(path.join(root, '.github/workflows/apply-hero-copy.yml'), { force: true });
}

await buildBundle();
await preserveLoaderAndBootstrapBehaviour();
await updateIndexWithoutChangingMarkupOrStyles();
await removeIncompleteWorkflow();

console.log('Previsio production bundle generated without modifying presentation source files.');
