/* PREVISIO website loader.
   Preserves the current bootstrap, loads the founder education status layer,
   keeps the Time Travel capability label aligned across languages, exposes
   the public Support page in the legal footer, and publishes official
   portfolio report downloads. */
(function loadPrevisioBootstrap() {
  function appendScript(src, attributes) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = false;
      Object.keys(attributes || {}).forEach(function(key) {
        script.setAttribute(key, attributes[key]);
      });
      script.onload = resolve;
      script.onerror = function() { reject(new Error('Unable to load ' + src)); };
      document.head.appendChild(script);
    });
  }

  var timeTravelLabelReplacements = {
    'Trust · verify it yourself': 'Advanced Capabilities · Time Travel',
    'Fiducia · verificalo tu stesso': 'Funzionalità avanzate · Time Travel',
    'Confiance · vérifiez par vous-même': 'Capacités avancées · Time Travel',
    'Vertrauen · überzeugen Sie sich selbst': 'Erweiterte Funktionen · Time Travel'
  };

  function alignTimeTravelLabels() {
    var section = document.getElementById('time-travel');
    if (!section) return;

    var walker = document.createTreeWalker(
      section,
      NodeFilter.SHOW_TEXT,
      null
    );

    while (walker.nextNode()) {
      var node = walker.currentNode;
      var text = node.nodeValue || '';

      Object.keys(timeTravelLabelReplacements).some(function(currentLabel) {
        if (!text.includes(currentLabel)) return false;

        node.nodeValue = text.replace(
          currentLabel,
          timeTravelLabelReplacements[currentLabel]
        );
        return true;
      });
    }
  }

  function ensureSupportLink() {
    var privacyLink = document.querySelector('a[href="privacy.html"]');
    if (!privacyLink || !privacyLink.parentElement) return;
    if (privacyLink.parentElement.querySelector('a[href="support.html"]')) return;

    var supportLink = document.createElement('a');
    supportLink.href = 'support.html';
    supportLink.textContent = 'Support';
    supportLink.setAttribute('data-previsio-support-link', 'true');
    privacyLink.insertAdjacentElement('afterend', supportLink);
  }

  var portfolioReports = [
    {
      key: 'interactive',
      filename: 'Previsio_Portfolio_Interactive_2026-08-09.webp',
      parts: [
        'reports/assets/portfolio-interactive-full/000.b64',
        'reports/assets/portfolio-interactive-full/001.b64',
        'reports/assets/portfolio-interactive-full/002.b64',
        'reports/assets/portfolio-interactive-full/003.b64',
        'reports/assets/portfolio-interactive-full/004.b64',
        'reports/assets/portfolio-interactive-full/005.b64'
      ]
    },
    {
      key: 'client',
      filename: 'Previsio_Portfolio_Client_2026-08-09.webp',
      parts: [
        'reports/assets/portfolio-client.webp.b64'
      ]
    },
    {
      key: 'validation',
      filename: 'Previsio_Portfolio_Validation_2026-08-09.webp',
      parts: [
        'reports/assets/portfolio-validation-full/000a.b64',
        'reports/assets/portfolio-validation-full/000b.b64',
        'reports/assets/portfolio-validation-full/001.b64',
        'reports/assets/portfolio-validation-full/002.b64',
        'reports/assets/portfolio-validation-full/003.b64',
        'reports/assets/portfolio-validation-full/004.b64',
        'reports/assets/portfolio-validation-full/005.b64',
        'reports/assets/portfolio-validation-full/006.b64',
        'reports/assets/portfolio-validation-full/007.b64',
        'reports/assets/portfolio-validation-full/008a.b64',
        'reports/assets/portfolio-validation-full/008b.b64',
        'reports/assets/portfolio-validation-full/009.b64'
      ]
    }
  ];

  var portfolioCopies = {
    en: {
      title: 'Official portfolio reports',
      sub: 'Real Previsio portfolio outputs · 9 August 2026',
      labels: ['Interactive portfolio report', 'Client portfolio report', 'Portfolio validation report'],
      download: 'Download',
      preparing: 'Preparing…',
      retry: 'Retry',
      shortcut: 'Portfolio reports →',
      metadata: 'WEBP · complete visual snapshot of the real report',
      note: 'Complete visual snapshots generated directly from the supplied Previsio reports.'
    },
    it: {
      title: 'Report ufficiali portfolio',
      sub: 'Output portfolio reali Previsio · 9 agosto 2026',
      labels: ['Report portfolio interattivo', 'Report portfolio cliente', 'Report portfolio di validazione'],
      download: 'Scarica',
      preparing: 'Preparazione…',
      retry: 'Riprova',
      shortcut: 'Vedi i report portfolio →',
      metadata: 'WEBP · snapshot visivo completo del report reale',
      note: 'Snapshot visivi completi generati direttamente dai report Previsio forniti.'
    },
    fr: {
      title: 'Rapports portfolio officiels',
      sub: 'Sorties portfolio réelles Previsio · 9 août 2026',
      labels: ['Rapport portfolio interactif', 'Rapport portfolio client', 'Rapport portfolio de validation'],
      download: 'Télécharger',
      preparing: 'Préparation…',
      retry: 'Réessayer',
      shortcut: 'Rapports portfolio →',
      metadata: 'WEBP · capture visuelle complète du rapport réel',
      note: 'Captures visuelles complètes générées directement à partir des rapports Previsio fournis.'
    },
    de: {
      title: 'Offizielle Portfolio-Berichte',
      sub: 'Reale Previsio-Portfolioausgaben · 9. August 2026',
      labels: ['Interaktiver Portfolio-Bericht', 'Portfolio-Kundenbericht', 'Portfolio-Validierungsbericht'],
      download: 'Herunterladen',
      preparing: 'Vorbereitung…',
      retry: 'Erneut versuchen',
      shortcut: 'Portfolio-Berichte →',
      metadata: 'WEBP · vollständige visuelle Momentaufnahme des realen Berichts',
      note: 'Vollständige visuelle Momentaufnahmen, direkt aus den bereitgestellten Previsio-Berichten erzeugt.'
    }
  };

  function getPortfolioLanguage() {
    var language = String(document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
    return portfolioCopies[language] ? language : 'en';
  }

  function getPortfolioCopy() {
    return portfolioCopies[getPortfolioLanguage()];
  }

  var portfolioDownloadUrls = Object.create(null);

  function decodeBase64Segment(base64) {
    var binary = window.atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function base64ChunksToBlob(chunks) {
    var byteParts = [];
    var carry = '';

    chunks.forEach(function(chunk, index) {
      var compact = (carry + String(chunk || '')).replace(/\s/g, '');
      carry = '';

      if (!compact) return;

      var isLast = index === chunks.length - 1;
      var containsPadding = compact.indexOf('=') !== -1;
      var usableLength = compact.length;

      if (!isLast && !containsPadding) {
        usableLength -= usableLength % 4;
      }

      if (usableLength > 0) {
        byteParts.push(decodeBase64Segment(compact.slice(0, usableLength)));
      }

      if (usableLength < compact.length) {
        carry = compact.slice(usableLength);
      }
    });

    if (carry) {
      byteParts.push(decodeBase64Segment(carry));
    }

    return new Blob(byteParts, { type: 'image/webp' });
  }

  async function preparePortfolioReportLink(report, link) {
    var copy = getPortfolioCopy();

    if (portfolioDownloadUrls[report.key]) {
      link.href = portfolioDownloadUrls[report.key];
      link.download = report.filename;
      link.textContent = copy.download;
      link.removeAttribute('aria-disabled');
      link.style.pointerEvents = '';
      return;
    }

    link.textContent = copy.preparing;
    link.setAttribute('aria-disabled', 'true');
    link.style.pointerEvents = 'none';

    try {
      var responses = await Promise.all(report.parts.map(function(path) {
        return fetch(path, { cache: 'no-store' });
      }));

      responses.forEach(function(response) {
        if (!response.ok) {
          throw new Error('Unable to load portfolio report asset: ' + response.url);
        }
      });

      var chunks = await Promise.all(responses.map(function(response) {
        return response.text();
      }));
      var blob = base64ChunksToBlob(chunks);

      if (!blob.size) {
        throw new Error('Portfolio report asset is empty.');
      }

      var url = URL.createObjectURL(blob);
      portfolioDownloadUrls[report.key] = url;
      link.href = url;
      link.download = report.filename;
      link.textContent = getPortfolioCopy().download;
      link.removeAttribute('aria-disabled');
      link.style.pointerEvents = '';
    } catch (error) {
      console.error('[Previsio] Portfolio report preparation failed.', error);
      link.removeAttribute('href');
      link.removeAttribute('download');
      link.textContent = getPortfolioCopy().retry;
      link.setAttribute('aria-disabled', 'true');
      link.style.pointerEvents = 'none';
    }
  }

  window.addEventListener('beforeunload', function() {
    Object.keys(portfolioDownloadUrls).forEach(function(key) {
      URL.revokeObjectURL(portfolioDownloadUrls[key]);
    });
  });

  function ensurePortfolioReportShortcut() {
    var link = document.querySelector('[data-previsio-portfolio-shortcut="true"]') ||
      document.querySelector('a[href="Request.html#report-portfolio"]');
    if (!link) return;

    var copy = getPortfolioCopy();
    if (link.getAttribute('href') !== '#portfolio-mode') {
      link.setAttribute('href', '#portfolio-mode');
    }
    if (link.textContent !== copy.shortcut) {
      link.textContent = copy.shortcut;
    }
    link.setAttribute('data-previsio-portfolio-shortcut', 'true');
  }

  function publishOfficialPortfolioReports() {
    var section = document.getElementById('portfolio-mode');
    if (!section) return;

    var grid = section.querySelector('.tt-grid');
    if (!grid) return;

    var panel = grid.querySelector(':scope > .panel') || grid.querySelector('.panel');
    if (!panel) return;

    var language = getPortfolioLanguage();
    if (
      panel.getAttribute('data-previsio-official-reports') === 'true' &&
      panel.getAttribute('data-previsio-report-language') === language
    ) return;

    var copy = getPortfolioCopy();
    panel.setAttribute('data-previsio-official-reports', 'true');
    panel.setAttribute('data-previsio-report-language', language);
    panel.innerHTML = '';

    var header = document.createElement('div');
    header.style.cssText = 'margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle)';

    var eyebrow = document.createElement('div');
    eyebrow.style.cssText = 'font-family:var(--font-mono);font-size:13px;color:var(--gold-primary);letter-spacing:.18em;text-transform:uppercase;margin-bottom:5px';
    eyebrow.textContent = copy.title;

    var sub = document.createElement('div');
    sub.style.cssText = 'font-family:var(--font-mono);font-size:12px;color:var(--text-faint);letter-spacing:.06em;line-height:1.5';
    sub.textContent = copy.sub;

    header.appendChild(eyebrow);
    header.appendChild(sub);
    panel.appendChild(header);

    var list = document.createElement('div');
    list.style.cssText = 'display:grid;gap:10px';

    portfolioReports.forEach(function(report, index) {
      var row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:14px 15px;border:1px solid var(--border-subtle);border-radius:8px;background:rgba(0,0,0,.25)';

      var info = document.createElement('div');
      var name = document.createElement('div');
      name.style.cssText = 'font-size:13px;font-weight:600;color:var(--text-main);margin-bottom:3px';
      name.textContent = copy.labels[index];

      var metadata = document.createElement('div');
      metadata.style.cssText = 'font-family:var(--font-mono);font-size:10px;color:var(--text-faint);letter-spacing:.08em;line-height:1.5';
      metadata.textContent = copy.metadata;

      info.appendChild(name);
      info.appendChild(metadata);

      var downloadLink = document.createElement('a');
      downloadLink.className = 'btn btn-gold';
      downloadLink.style.cssText = 'font-size:11px;padding:9px 12px;white-space:nowrap;text-decoration:none';
      downloadLink.textContent = copy.preparing;
      downloadLink.setAttribute('aria-disabled', 'true');
      downloadLink.setAttribute('target', '_blank');
      downloadLink.setAttribute('rel', 'noopener');

      row.appendChild(info);
      row.appendChild(downloadLink);
      list.appendChild(row);

      preparePortfolioReportLink(report, downloadLink);
    });

    panel.appendChild(list);

    var note = document.createElement('div');
    note.style.cssText = 'margin-top:14px;padding-top:12px;border-top:1px solid var(--border-subtle);font-size:11px;color:var(--text-muted);line-height:1.6';
    note.textContent = copy.note;
    panel.appendChild(note);
  }

  function applyProductionLayers() {
    alignTimeTravelLabels();
    ensureSupportLink();
    ensurePortfolioReportShortcut();
    publishOfficialPortfolioReports();
  }

  var productionObserver = new MutationObserver(applyProductionLayers);
  productionObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  document.addEventListener('DOMContentLoaded', applyProductionLayers, { once: true });
  window.addEventListener('load', applyProductionLayers, { once: true });

  appendScript('founder-education-fix.js?v=20260803', {
    'data-previsio-layer': 'founder-education'
  })
    .catch(function(error) {
      console.error('[Previsio] Founder education layer failed to load.', error);
    })
    .then(function() {
      return appendScript('chat-language-override.js?v=20260805-2', {
        'data-previsio-layer': 'chat-language'
      }).catch(function(error) {
        console.error('[Previsio] Chat language layer failed to load.', error);
      });
    })
    .then(function() {
      return appendScript('landing-v11.bootstrap.js?v=20260805', {
        'data-previsio-bootstrap': 'current'
      });
    })
    .then(function() {
      applyProductionLayers();
    })
    .catch(function(error) {
      console.error('[Previsio] Website bootstrap failed to load.', error);
      var root = document.getElementById('root');
      if (root) {
        root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#070707;color:#d4af37;font-family:system-ui,sans-serif;padding:32px;text-align:center">Unable to initialise the website. Reload the page or contact Previsio support.</div>';
      }
    });
})();
