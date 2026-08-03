/* PREVISIO FAQ data loader.
   Loads the V12 knowledge base, repairs the single unescaped apostrophe present
   in the exported source, validates the result, and exposes window.FAQ_DATA
   before faq.html continues its synchronous rendering. */
(function loadPrevisioFaqData() {
  function installFallback() {
    window.FAQ_DATA = {
      ui: {
        it: {
          subtitle: 'Centro Assistenza · FAQ',
          title: 'Domande Frequenti',
          desc: 'La knowledge base completa non è stata caricata. Ricarica la pagina o contatta il supporto.',
          search: 'Cerca nelle FAQ', sidebarTitle: 'Argomenti', backLink: '← Torna al sito',
          noResults: 'Nessun risultato.', contactTitle: 'Serve assistenza?',
          contactDesc: 'Contatta il supporto Previsio.', contactBtn: 'Contatta il supporto',
          legalNote: 'Previsio è uno strumento di analisi quantitativa e supporto decisionale; non costituisce consulenza finanziaria.'
        },
        en: {
          subtitle: 'Help Center · FAQ', title: 'Frequently Asked Questions',
          desc: 'The complete knowledge base could not be loaded. Reload the page or contact support.',
          search: 'Search the FAQ', sidebarTitle: 'Topics', backLink: '← Back to site',
          noResults: 'No results.', contactTitle: 'Need assistance?',
          contactDesc: 'Contact Previsio support.', contactBtn: 'Contact support',
          legalNote: 'Previsio is a quantitative analysis and decision-support tool; it does not provide financial advice.'
        },
        fr: {
          subtitle: 'Centre d’aide · FAQ', title: 'Questions Fréquentes',
          desc: 'La base de connaissances complète n’a pas pu être chargée. Rechargez la page ou contactez le support.',
          search: 'Rechercher dans la FAQ', sidebarTitle: 'Sujets', backLink: '← Retour au site',
          noResults: 'Aucun résultat.', contactTitle: 'Besoin d’aide ?',
          contactDesc: 'Contactez le support Previsio.', contactBtn: 'Contacter le support',
          legalNote: 'Previsio est un outil d’analyse quantitative et d’aide à la décision ; il ne fournit pas de conseil financier.'
        },
        de: {
          subtitle: 'Hilfezentrum · FAQ', title: 'Häufig gestellte Fragen',
          desc: 'Die vollständige Wissensdatenbank konnte nicht geladen werden. Laden Sie die Seite neu oder kontaktieren Sie den Support.',
          search: 'FAQ durchsuchen', sidebarTitle: 'Themen', backLink: '← Zurück zur Website',
          noResults: 'Keine Ergebnisse.', contactTitle: 'Benötigen Sie Hilfe?',
          contactDesc: 'Kontaktieren Sie den Previsio-Support.', contactBtn: 'Support kontaktieren',
          legalNote: 'Previsio ist ein quantitatives Analyse- und Entscheidungsunterstützungstool und bietet keine Finanzberatung.'
        }
      },
      categories: [{
        navLabel: { it: 'Supporto', en: 'Support', fr: 'Support', de: 'Support' },
        tag: { it: '01 · Supporto', en: '01 · Support', fr: '01 · Support', de: '01 · Support' },
        title: { it: 'Knowledge base non disponibile', en: 'Knowledge base unavailable', fr: 'Base de connaissances indisponible', de: 'Wissensdatenbank nicht verfügbar' },
        desc: { it: 'Ricarica la pagina o contatta il supporto.', en: 'Reload the page or contact support.', fr: 'Rechargez la page ou contactez le support.', de: 'Laden Sie die Seite neu oder kontaktieren Sie den Support.' },
        questions: [{
          q: { it: 'Come posso ricevere assistenza?', en: 'How can I get support?', fr: 'Comment obtenir de l’aide ?', de: 'Wie erhalte ich Unterstützung?' },
          a: { it: '<p>Contatta <a href="mailto:previsio.quant@gmail.com">previsio.quant@gmail.com</a>.</p>', en: '<p>Contact <a href="mailto:previsio.quant@gmail.com">previsio.quant@gmail.com</a>.</p>', fr: '<p>Contactez <a href="mailto:previsio.quant@gmail.com">previsio.quant@gmail.com</a>.</p>', de: '<p>Kontaktieren Sie <a href="mailto:previsio.quant@gmail.com">previsio.quant@gmail.com</a>.</p>' }
        }]
      }]
    };
  }

  try {
    var request = new XMLHttpRequest();
    request.open('GET', 'faq-data.source.js?v=20260803', false);
    request.send(null);

    if (request.status !== 0 && (request.status < 200 || request.status >= 300)) {
      throw new Error('FAQ source request failed with HTTP ' + request.status);
    }

    var source = request.responseText || '';
    var broken = "The website's informational assistant";
    var repaired = "The website\\'s informational assistant";
    var occurrences = source.split(broken).length - 1;

    if (occurrences !== 1) {
      throw new Error('FAQ source compatibility check failed: expected 1 repair target, found ' + occurrences);
    }

    source = source.replace(broken, repaired);
    (0, eval)(source);

    if (!window.FAQ_DATA || !window.FAQ_DATA.ui || !Array.isArray(window.FAQ_DATA.categories)) {
      throw new Error('FAQ source did not expose a valid window.FAQ_DATA object');
    }
  } catch (error) {
    console.error('[Previsio] Unable to initialise the complete FAQ knowledge base.', error);
    installFallback();
  }
})();
