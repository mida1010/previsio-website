/* PREVISIO website loader.
   Preserves the current bootstrap, loads the founder education status layer,
   keeps the Time Travel capability label aligned across languages, and exposes
   the public Support page in the legal footer. */
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

  function applyProductionLayers() {
    alignTimeTravelLabels();
    ensureSupportLink();
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
