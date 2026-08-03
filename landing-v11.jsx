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

  const mobileNavigationStyleId = 'previsio-mobile-navigation-overrides';
  if (!document.getElementById(mobileNavigationStyleId)) {
    const mobileNavigationStyle = document.createElement('style');
    mobileNavigationStyle.id = mobileNavigationStyleId;
    mobileNavigationStyle.textContent = `
      @media (max-width: 820px) {
        .nav-inner {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) auto !important;
          align-items: center !important;
          gap: 10px !important;
          min-height: 64px !important;
          padding: 7px 0 !important;
        }

        .brand {
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .nav-logo {
          width: min(42vw, 150px) !important;
          max-width: 150px !important;
          height: auto !important;
        }

        .nav-cta {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 8px !important;
          min-width: max-content !important;
          flex-shrink: 0 !important;
        }

        .nav-cta > .btn {
          display: none !important;
        }

        .lang-dropdown {
          display: block !important;
          position: relative !important;
        }

        .lang-dropdown-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 50px !important;
          min-height: 40px !important;
          padding: 8px 9px !important;
          background: rgba(0, 0, 0, 0.42) !important;
          border: 1px solid rgba(212, 175, 55, 0.28) !important;
          border-radius: 8px !important;
          color: var(--gold-primary) !important;
        }

        .lang-dropdown-menu {
          position: absolute !important;
          top: calc(100% + 8px) !important;
          right: 0 !important;
          left: auto !important;
          min-width: 170px !important;
          max-width: calc(100vw - 24px) !important;
          z-index: 1001 !important;
        }

        .menu-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 40px !important;
          height: 40px !important;
          padding: 0 !important;
          background: rgba(0, 0, 0, 0.42) !important;
          border: 1px solid rgba(212, 175, 55, 0.28) !important;
          border-radius: 8px !important;
          color: var(--gold-primary) !important;
          cursor: pointer !important;
        }
      }

      @media (max-width: 380px) {
        .nav-inner {
          gap: 7px !important;
        }

        .nav-logo {
          width: min(39vw, 128px) !important;
          max-width: 128px !important;
        }

        .nav-cta {
          gap: 6px !important;
        }

        .lang-dropdown-btn {
          min-width: 46px !important;
          padding-right: 7px !important;
          padding-left: 7px !important;
        }

        .menu-btn {
          width: 38px !important;
          height: 38px !important;
        }
      }
    `;
    document.head.appendChild(mobileNavigationStyle);
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
    const occurrences = correctedSource.split(from).length - 1;
    if (occurrences !== 1) {
      throw new Error(
        `Founder CFA copy compatibility check failed for language index ${index}: found ${occurrences}.`
      );
    }
    correctedSource = correctedSource.replace(from, to);
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
