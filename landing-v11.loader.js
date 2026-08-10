/* PREVISIO website loader.
   Preserves the current bootstrap, loads the founder education status layer,
   keeps the Time Travel capability label aligned across languages, exposes
   the public Support page in the legal footer, and publishes official portfolio reports. */
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

    var walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      var text = node.nodeValue || '';
      Object.keys(timeTravelLabelReplacements).some(function(currentLabel) {
        if (!text.includes(currentLabel)) return false;
        node.nodeValue = text.replace(currentLabel, timeTravelLabelReplacements[currentLabel]);
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
    { key: 'interactive', href: 'reports/portfolio-official-interactive.html', format: 'HTML', filename: 'Previsio_Portfolio_Official_Interactive_2026-08-09.html' },
    { key: 'client', href: 'reports/portfolio-official-client.html', format: 'HTML', filename: 'Previsio_Portfolio_Official_Client_2026-08-09.html' },
    { key: 'validation', href: 'reports/portfolio-official-validation.html', format: 'HTML', filename: 'Previsio_Portfolio_Official_Validation_2026-08-09.html' }
  ];

  function publishOfficialPortfolioReports() {
    var section = document.getElementById('portfolio-mode');
    if (!section) return;
    var grid = section.querySelector('.tt-grid');
    if (!grid) return;
    var panel = grid.querySelector(':scope > .panel') || grid.querySelector('.panel');
    if (!panel || panel.getAttribute('data-previsio-official-reports') === 'true') return;

    var language = String(document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
    var copies = {
      en: {
        title: 'Official portfolio reports',
        sub: 'Real Previsio portfolio output · 9 August 2026',
        labels: ['Interactive report', 'Client report', 'Internal validation report'],
        open: 'View', download: 'Download',
        note: 'Official Previsio portfolio outputs available for product evaluation and methodology review.'
      },
      it: {
        title: 'Report ufficiali portfolio',
        sub: 'Output portfolio reale Previsio · 9 agosto 2026',
        labels: ['Report interattivo', 'Report cliente', 'Report interno di validazione'],
        open: 'Apri', download: 'Scarica',
        note: 'Output ufficiali Previsio disponibili per la valutazione del prodotto e la revisione della metodologia.'
      },
      fr: {
        title: 'Rapports portfolio officiels',
        sub: 'Sortie portfolio réelle Previsio · 9 août 2026',
        labels: ['Rapport interactif', 'Rapport client', 'Rapport interne de validation'],
        open: 'Voir', download: 'Télécharger',
        note: 'Sorties portfolio officielles Previsio disponibles pour l’évaluation du produit et la revue de la méthodologie.'
      },
      de: {
        title: 'Offizielle Portfolio-Berichte',
        sub: 'Reale Previsio-Portfolioausgabe · 9. August 2026',
        labels: ['Interaktiver Bericht', 'Kundenbericht', 'Interner Validierungsbericht'],
        open: 'Öffnen', download: 'Herunterladen',
        note: 'Offizielle Previsio-Portfolioausgaben zur Produktbewertung und Methodikprüfung.'
      }
    };
    var copy = copies[language] || copies.en;

    panel.setAttribute('data-previsio-official-reports', 'true');
    panel.innerHTML = '';

    var header = document.createElement('div');
    header.style.cssText = 'margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle)';
    header.innerHTML = '<div style="font-family:var(--font-mono);font-size:13px;color:var(--gold-primary);letter-spacing:.18em;text-transform:uppercase;margin-bottom:5px">' + copy.title + '</div>' +
      '<div style="font-family:var(--font-mono);font-size:12px;color:var(--text-faint);letter-spacing:.06em;line-height:1.5">' + copy.sub + '</div>';
    panel.appendChild(header);

    var list = document.createElement('div');
    list.style.cssText = 'display:grid;gap:10px';
    portfolioReports.forEach(function(report, index) {
      var row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:14px 15px;border:1px solid var(--border-subtle);border-radius:8px;background:rgba(0,0,0,.25)';

      var info = document.createElement('div');
      info.innerHTML = '<div style="font-size:13px;font-weight:600;color:var(--text-main);margin-bottom:3px">' + copy.labels[index] + '</div>' +
        '<div style="font-family:var(--font-mono);font-size:10px;color:var(--text-faint);letter-spacing:.12em">' + report.format + ' · PREVISIO PORTFOLIO</div>';

      var actions = document.createElement('div');
      actions.style.cssText = 'display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end';

      var openLink = document.createElement('a');
      openLink.className = 'btn btn-gold';
      openLink.href = report.href;
      openLink.target = '_blank';
      openLink.rel = 'noopener noreferrer';
      openLink.textContent = copy.open;
      openLink.style.cssText = 'font-size:11px;padding:9px 12px;white-space:nowrap';

      var downloadLink = document.createElement('a');
      downloadLink.className = 'btn btn-ghost';
      downloadLink.href = report.href;
      downloadLink.download = report.filename;
      downloadLink.textContent = copy.download;
      downloadLink.style.cssText = 'font-size:11px;padding:9px 12px;white-space:nowrap';

      actions.appendChild(openLink);
      actions.appendChild(downloadLink);
      row.appendChild(info);
      row.appendChild(actions);
      list.appendChild(row);
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
    publishOfficialPortfolioReports();
  }

  var productionObserver = new MutationObserver(applyProductionLayers);
  productionObserver.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  document.addEventListener('DOMContentLoaded', applyProductionLayers, { once: true });
  window.addEventListener('load', applyProductionLayers, { once: true });

  appendScript('founder-education-fix.js?v=20260803', { 'data-previsio-layer': 'founder-education' })
    .catch(function(error) { console.error('[Previsio] Founder education layer failed to load.', error); })
    .then(function() {
      return appendScript('chat-language-override.js?v=20260805-2', { 'data-previsio-layer': 'chat-language' }).catch(function(error) {
        console.error('[Previsio] Chat language layer failed to load.', error);
      });
    })
    .then(function() { return appendScript('landing-v11.bootstrap.js?v=20260805', { 'data-previsio-bootstrap': 'current' }); })
    .then(function() { applyProductionLayers(); })
    .catch(function(error) {
      console.error('[Previsio] Website bootstrap failed to load.', error);
      var root = document.getElementById('root');
      if (root) root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#070707;color:#d4af37;font-family:system-ui,sans-serif;padding:32px;text-align:center">Unable to initialise the website. Reload the page or contact Previsio support.</div>';
    });
})();
