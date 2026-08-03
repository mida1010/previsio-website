/*
 * PREVISIO website bootstrap.
 *
 * The current website is intentionally delivered as JSX and compiled in the
 * browser by Babel Standalone. Load the responsive layer and application
 * source, align navigation with the rendered section order, apply the verified
 * navbar scroll-spy correction, then compile and execute the application.
 *
 * This compatibility layer can be removed when the site moves to the planned
 * production build pipeline.
 */
(async function loadPrevisioWebsite() {
  const responsiveStylesheet = 'mobile-responsive.css';
  const sourceUrl = 'landing-v11.source.jsx';

  if (!document.querySelector(`link[data-previsio-responsive="${responsiveStylesheet}"]`)) {
    const responsiveLink = document.createElement('link');
    responsiveLink.rel = 'stylesheet';
    responsiveLink.href = responsiveStylesheet;
    responsiveLink.dataset.previsioResponsive = responsiveStylesheet;
    document.head.appendChild(responsiveLink);
  }

  const response = await fetch(sourceUrl, { cache: 'no-cache' });

  if (!response.ok) {
    throw new Error(`Unable to load ${sourceUrl}: HTTP ${response.status}`);
  }

  const source = await response.text();

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

  const navigationOccurrences = source.split(legacyNavigationOrder).length - 1;
  const sectionOrderOccurrences = source.split(legacySectionOrder).length - 1;

  if (navigationOccurrences !== 1 || sectionOrderOccurrences !== 1) {
    throw new Error(
      `Navbar order compatibility check failed: links=${navigationOccurrences}, sections=${sectionOrderOccurrences}.`
    );
  }

  let correctedSource = source
    .replace(legacyNavigationOrder, renderedNavigationOrder)
    .replace(legacySectionOrder, renderedSectionOrder);

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

  const scrollSpyOccurrences = correctedSource.split(legacyScrollSpy).length - 1;
  if (scrollSpyOccurrences !== 1) {
    throw new Error(
      `Navbar scroll-spy compatibility check failed: expected 1 legacy block, found ${scrollSpyOccurrences}.`
    );
  }

  correctedSource = correctedSource.replace(legacyScrollSpy, correctedScrollSpy);
  const compiledSource = Babel.transform(correctedSource, {
    presets: ['react'],
    sourceType: 'script',
    filename: sourceUrl
  }).code;

  (0, eval)(compiledSource);
})().catch((error) => {
  console.error('[Previsio] Website bootstrap failed.', error);

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#070707;color:#d4af37;font-family:system-ui,sans-serif;padding:32px;text-align:center">Unable to initialise the website. Reload the page or contact Previsio support.</div>';
  }
});
