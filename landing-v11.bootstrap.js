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

  await new Promise((resolve, reject) => {
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
})().catch((error) => {
  console.error('[Previsio] Website bootstrap failed.', error);

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#070707;color:#d4af37;font-family:system-ui,sans-serif;padding:32px;text-align:center">Unable to initialise the website. Reload the page or contact Previsio support.</div>';
  }
});
