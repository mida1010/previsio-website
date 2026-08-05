/* PREVISIO website-only chatbot language contract.
   Intercepts only chatbot start requests and preserves every other fetch call. */
(function installPrevisioChatLanguageContract() {
  if (window.__PREVISIO_CHAT_LANGUAGE_CONTRACT__) return;
  window.__PREVISIO_CHAT_LANGUAGE_CONTRACT__ = true;

  var originalFetch = window.fetch.bind(window);
  var languageNames = {
    en: 'English',
    it: 'Italian (italiano)',
    fr: 'French (français)',
    de: 'German (Deutsch)'
  };
  var languageContracts = {
    en: 'MANDATORY OUTPUT LANGUAGE: ENGLISH. Write the complete final answer in English only, including headings, bullet points, warnings and closing text. Do not answer in Italian, French or German, even if the retrieved context or other instructions use another language.',
    it: 'LINGUA DI RISPOSTA OBBLIGATORIA: ITALIANO. Scrivi l’intera risposta finale esclusivamente in italiano, inclusi titoli, elenchi, avvertenze e testo conclusivo. Non rispondere in inglese, francese o tedesco, anche se il contesto recuperato o altre istruzioni usano un’altra lingua.',
    fr: 'LANGUE DE SORTIE OBLIGATOIRE : FRANÇAIS. Rédigez la réponse finale complète uniquement en français, y compris les titres, listes, avertissements et le texte de conclusion. Ne répondez pas en italien, en anglais ou en allemand, même si le contexte récupéré ou d’autres instructions utilisent une autre langue.',
    de: 'VERBINDLICHE AUSGABESPRACHE: DEUTSCH. Schreiben Sie die vollständige endgültige Antwort ausschließlich auf Deutsch, einschließlich Überschriften, Aufzählungen, Hinweise und Abschlusstext. Antworten Sie nicht auf Italienisch, Englisch oder Französisch, auch wenn der abgerufene Kontext oder andere Anweisungen eine andere Sprache verwenden.'
  };

  function normaliseLanguage(value) {
    var raw = String(value || '').trim().toLowerCase();
    if (raw.indexOf('it') === 0 || raw.indexOf('ital') >= 0) return 'it';
    if (raw.indexOf('fr') === 0 || raw.indexOf('french') >= 0 || raw.indexOf('français') >= 0) return 'fr';
    if (raw.indexOf('de') === 0 || raw.indexOf('german') >= 0 || raw.indexOf('deutsch') >= 0) return 'de';
    return 'en';
  }

  function buildQuestion(question, language) {
    var text = String(question || '').trim();
    if (!text || text.indexOf('[MANDATORY RESPONSE CONTRACT]') >= 0) return text;
    var contract = languageContracts[language] || languageContracts.en;
    return (
      '[MANDATORY RESPONSE CONTRACT]\n' +
      contract + '\n' +
      'Preserve the factual meaning of the approved product documentation. Do not invent numbers, calculations or features, and do not provide investment recommendations.\n\n' +
      '[USER QUESTION]\n' + text + '\n\n' +
      '[FINAL OUTPUT LANGUAGE]\n' + contract
    );
  }

  window.fetch = function previsioLanguageAwareFetch(input, init) {
    try {
      var url = typeof input === 'string' ? input : input && input.url;
      var isChatStart = /\/api\/chat\/start(?:[?#]|$)/i.test(String(url || ''));
      if (isChatStart && init && String(init.method || 'GET').toUpperCase() === 'POST' && typeof init.body === 'string') {
        var payload = JSON.parse(init.body);
        var language = normaliseLanguage(
          payload.language || payload.lang || payload.response_language
        );

        payload.question = buildQuestion(payload.question, language);
        payload.language = language;
        payload.lang = language;
        payload.response_language = languageNames[language] || languageNames.en;

        var headers = new Headers(init.headers || {});
        headers.set('Accept-Language', language);

        init = Object.assign({}, init, {
          headers: headers,
          body: JSON.stringify(payload)
        });
      }
    } catch (error) {
      console.error('[Previsio] Chat language contract could not be applied.', error);
    }

    return originalFetch(input, init);
  };
})();
