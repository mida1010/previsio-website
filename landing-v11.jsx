/* PREVISIO website loader.
   Preserves the current bootstrap, loads the founder education status layer,
   and keeps the Time Travel capability label aligned across languages. */
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

  var timeTravelObserver = new MutationObserver(alignTimeTravelLabels);
  timeTravelObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  document.addEventListener('DOMContentLoaded', alignTimeTravelLabels, { once: true });
  window.addEventListener('load', alignTimeTravelLabels, { once: true });

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
      alignTimeTravelLabels();
    })
    .catch(function(error) {
      console.error('[Previsio] Website bootstrap failed to load.', error);
      var root = document.getElementById('root');
      if (root) {
        root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#070707;color:#d4af37;font-family:system-ui,sans-serif;padding:32px;text-align:center">Unable to initialise the website. Reload the page or contact Previsio support.</div>';
      }
    });
})();
