/* PREVISIO website loader.
   Preserves the current bootstrap and loads the founder education status layer
   before the application source is rendered. */
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

  appendScript('founder-education-fix.js?v=20260803', {
    'data-previsio-layer': 'founder-education'
  })
    .catch(function(error) {
      console.error('[Previsio] Founder education layer failed to load.', error);
    })
    .then(function() {
      return appendScript('landing-v11.bootstrap.js?v=20260803', {
        'data-previsio-bootstrap': 'current'
      });
    })
    .catch(function(error) {
      console.error('[Previsio] Website bootstrap failed to load.', error);
      var root = document.getElementById('root');
      if (root) {
        root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#070707;color:#d4af37;font-family:system-ui,sans-serif;padding:32px;text-align:center">Unable to initialise the website. Reload the page or contact Previsio support.</div>';
      }
    });
})();
