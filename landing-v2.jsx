const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   INTRO SPLASH — fracture dissolve animation
   Pure CSS + vanilla JS text splitting. No npm, no Framer Motion.
   ============================================================ */
function IntroSplash() {
  const [gone, setGone] = useState(false);
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true);
      return;
    }

    // Timeline
    const LOGO_REVEAL  = 800;
    const SUB_REVEAL   = 600;
    const PAUSE        = 600;
    const FRACTURE     = 1600;
    const FADE_OUT     = 800;

    const t0 = LOGO_REVEAL;
    const t1 = t0 + SUB_REVEAL;
    const t2 = t1 + PAUSE;
    const t3 = t2 + FRACTURE;
    const t4 = t3 + FADE_OUT;

    // Phase 1: reveal subtitle
    const s1 = setTimeout(() => {
      const sub = el.querySelector('.splash-sub');
      if (sub) sub.classList.add('visible');
    }, t0);

    // Phase 2: start fracture
    const s2 = setTimeout(() => {
      // Split letters
      el.querySelectorAll('.splash-splittable').forEach(textEl => {
        const text = textEl.textContent;
        textEl.innerHTML = '';
        [...text].forEach((ch, i) => {
          const span = document.createElement('span');
          span.className = 'splash-letter';
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          span.style.setProperty('--i', i);
          span.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
          span.style.setProperty('--dy', (Math.random() - 0.5) * 60 + 'px');
          span.style.setProperty('--dr', (Math.random() - 0.5) * 25 + 'deg');
          span.style.setProperty('--delay', (Math.random() * 0.4) + 's');
          textEl.appendChild(span);
        });
      });

      // Create particles
      const particleContainer = el.querySelector('.splash-particles');
      if (particleContainer) {
        for (let i = 0; i < 24; i++) {
          const p = document.createElement('div');
          p.className = 'splash-particle';
          p.style.setProperty('--px', (Math.random() * 100) + '%');
          p.style.setProperty('--py', (40 + Math.random() * 20) + '%');
          p.style.setProperty('--pdx', (Math.random() - 0.5) * 120 + 'px');
          p.style.setProperty('--pdy', (Math.random() - 0.5) * 80 + 'px');
          p.style.setProperty('--pdelay', (Math.random() * 0.6) + 's');
          p.style.setProperty('--psize', (2 + Math.random() * 3) + 'px');
          particleContainer.appendChild(p);
        }
      }

      // Trigger fracture
      el.classList.add('fracturing');
    }, t2);

    // Phase 3: fade out splash
    const s3 = setTimeout(() => {
      el.classList.add('fading-out');
    }, t3);

    // Phase 4: remove
    const s4 = setTimeout(() => {
      setGone(true);
    }, t4);

    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); clearTimeout(s4); };
  }, []);

  if (gone) return null;

  return (
    <div className="splash-screen" ref={containerRef}>
      <div className="splash-overlay"></div>
      <div className="splash-content">
        <div className="splash-title-row">
          <img src={(window.__resources && window.__resources.logoArrow) || 'logo-arrow.png'} alt="" className="splash-logo" />
          <div className="splash-title splash-splittable">PREVISIO</div>
        </div>
        <div className="splash-sub splash-splittable">Welcome to the future</div>
      </div>
      <div className="splash-particles"></div>
    </div>
  );
}


function GlobalVideoBackground() {
  return (
    <div className="global-video-bg" aria-hidden="true">
      <video
        className="global-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        ref={(el) => {
          if (el) {
            el.muted = true;
            el.play().catch(() => {});
          }
        }}
      >
        <source src="assets/previsio-hero-loop.mp4" type="video/mp4" />
      </video>
      <div className="global-video-overlay" />
    </div>
  );
}

// ============================================================
// LANGUAGE CONTEXT — compact translations for key UI strings
// Technical content (feature descriptions, methodology math, dashboard labels)
// stays in English as it's domain-specific professional terminology.
// ============================================================

const T = {
  en: {
    splash_sub: 'Welcome to the future',
    hero_eyebrow: 'Quantitative forecasting · decision support',
    hero_h1a: 'Ensemble forecasting,',
    hero_h1b: 'with the math shown.',
    hero_lede: 'Eight forecasting models, error-weighted by walk-forward backtest on the asset itself. The ensemble combines relative returns — not a naive average of prices. Intervals are empirical and asymmetric. Every run is fully reproducible.',
    hero_cta1: 'Request access',
    hero_cta2: 'View methodology',
    stat_models: 'models',
    stat_models_lab: 'Working in parallel',
    stat_speed_lab: 'Per forecast',
    stat_repro: 'Reproducible',
    engine_eyebrow: 'Inside the engine',
    engine_h2a: 'Eight models, one',
    engine_h2b: 'backtest-weighted',
    engine_h2c: 'answer.',
    engine_lede: 'No single model wins across every asset, horizon and regime — so we don\'t pretend one does. Each forecast combines eight selectable engines in relative-return space, weighted by a walk-forward backtest on the same asset you\'re forecasting.',
    features_eyebrow: 'Key features',
    features_h2: 'Built for desks that show their work.',
    analytics_eyebrow: 'Portfolio & analytics',
    analytics_h2: 'Confidence bands you can defend, dispersion you can read.',
    analytics_lede: 'Every forecast comes with the same three artefacts: a backtest-weighted ensemble line, the upper/lower interval the model is willing to commit to, and the spread of the individual ensemble members behind it.',
    methodology_eyebrow: 'Methodology',
    methodology_h2: 'Eight ideas the engine commits to.',
    methodology_lede: 'We don\'t ship a black box. The technical methodology — every equation, threshold, default value and fallback path — is documented and available to read before you sign anything.',
    usecases_eyebrow: 'Use cases',
    usecases_h2: 'Same engine. Four professional workflows.',
    dashboard_eyebrow: 'Product preview',
    dashboard_h2: 'The actual desk. Not a marketing render.',
    dashboard_lede: 'Three columns, dense by design: configure on the left, read the executive summary in the centre, drill into model weights and charts on the right. All values are illustrative sample data.',
    pricing_eyebrow: 'Pricing',
    pricing_h2: 'Three tiers. The engine is the same in all of them.',
    pricing_lede: 'We never ship a different model to a different tier — what changes is throughput, languages, deployment and how much of the audit trail you can export.',
    trust_eyebrow: 'Trust · security · provenance',
    trust_h2: 'A forecast you can sign your name to.',
    trust_lede: 'In an industry where models drift, libraries silently update and AI hallucinates, we built Previsio around one principle:',
    trust_lede_em: 'nothing is true unless it is reproducible',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Questions we get asked.',
    faq_duration_q: 'How long does a forecast take?',
    faq_duration_a: 'It depends on the calculation mode. Standard mode (single model, no backtest) returns in seconds. The default ensemble mode — all 9 models, walk-forward backtest, calibrated intervals — takes around 30 minutes. Progress is streamed live so you can monitor every stage.',
    cta_eyebrow: 'Request institutional access',
    cta_h2a: 'Bring the engine',
    cta_h2b: 'to your desk.',
    cta_lede: 'A 30-minute call, a sample run on the ticker of your choice, and a forecast memo in your hands by the end. No deck, no demo theatre — just the actual product.',
    cta_btn1: 'Book technical review',
    cta_btn2: 'Download methodology',
    perf_eyebrow: 'Validation',
    perf_h2: 'Backtest performance snapshot',
    perf_lede: 'Aggregate forecast error statistics from completed validation runs. Final values will be inserted after completion of the full validation campaign.',
    perf_note: 'Results from historical backtests do not guarantee future performance. All statistics are preliminary and subject to final validation.',
    perf_mape: 'Mean Abs. % Error',
    perf_median: 'Median % Error',
    perf_directional: 'Directional Accuracy',
    perf_obs: 'Test Observations',
    perf_horizon: 'Horizons Tested',
    perf_pending: 'Pending',
    perf_tbd: 'TBD',
    perf_horizons: '1D · 1W · 1M',
    nav_methodology: 'Methodology',
    nav_request: 'Request access',
    footer_disclaimer: 'NOT FINANCIAL ADVICE. Previsio is a quantitative research and decision-support platform. Outputs are probabilistic estimates based on historical data and statistical models and do not constitute investment advice, financial recommendation, or solicitation to buy or sell securities. Past performance does not guarantee future results. Capital at risk. Users remain responsible for all investment decisions.',
  },
  it: {
    splash_sub: 'Benvenuto nel futuro',
    hero_eyebrow: 'Forecasting quantitativo · decision support',
    hero_h1a: 'Ensemble forecasting,',
    hero_h1b: 'con la matematica in chiaro.',
    hero_lede: 'Otto modelli di previsione, ponderati per errore tramite backtest walk-forward sull\'asset stesso. L\'ensemble combina i rendimenti relativi — non una media ingenua dei prezzi. Gli intervalli sono empirici e asimmetrici. Ogni esecuzione è completamente riproducibile.',
    hero_cta1: 'Richiedi accesso',
    hero_cta2: 'Visualizza metodologia',
    stat_models: 'modelli',
    stat_models_lab: 'In parallelo',
    stat_speed_lab: 'Per previsione',
    stat_repro: 'Riproducibile',
    engine_eyebrow: 'Dentro il motore',
    engine_h2a: 'Otto modelli, una',
    engine_h2b: 'risposta ponderata',
    engine_h2c: 'per backtest.',
    engine_lede: 'Nessun singolo modello vince in ogni asset, orizzonte e regime — quindi non fingiamo che uno lo faccia. Ogni previsione combina otto motori selezionabili nello spazio di rendimento relativo, ponderati da un backtest walk-forward sullo stesso asset.',
    features_eyebrow: 'Funzionalità chiave',
    features_h2: 'Costruito per chi mostra il proprio lavoro.',
    analytics_eyebrow: 'Portfolio e analisi',
    analytics_h2: 'Bande di confidenza difendibili, dispersione leggibile.',
    analytics_lede: 'Ogni previsione include tre artefatti: una linea ensemble ponderata per backtest, l\'intervallo superiore/inferiore a cui il modello si impegna, e la dispersione dei singoli membri dell\'ensemble.',
    methodology_eyebrow: 'Metodologia',
    methodology_h2: 'Otto idee su cui il motore si impegna.',
    methodology_lede: 'Non spediamo una scatola nera. La metodologia tecnica — ogni equazione, soglia, valore predefinito e percorso di fallback — è documentata e disponibile per la lettura prima di firmare qualsiasi cosa.',
    usecases_eyebrow: 'Casi d\'uso',
    usecases_h2: 'Stesso motore. Quattro workflow professionali.',
    dashboard_eyebrow: 'Anteprima prodotto',
    dashboard_h2: 'Il desk reale. Non un render marketing.',
    dashboard_lede: 'Tre colonne, dense per design: configura a sinistra, leggi il riepilogo al centro, approfondisci pesi e grafici a destra. Tutti i valori sono dati di esempio illustrativi.',
    pricing_eyebrow: 'Prezzi',
    pricing_h2: 'Tre livelli. Il motore è lo stesso in tutti.',
    pricing_lede: 'Non spediamo mai un modello diverso a un livello diverso — cambiano throughput, lingue, deployment e quanto dell\'audit trail puoi esportare.',
    trust_eyebrow: 'Fiducia · sicurezza · provenienza',
    trust_h2: 'Una previsione su cui mettere la firma.',
    trust_lede: 'In un settore dove i modelli derivano, le librerie si aggiornano silenziosamente e l\'AI allucina, abbiamo costruito Previsio attorno a un principio:',
    trust_lede_em: 'nulla è vero a meno che non sia riproducibile',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Domande frequenti.',
    faq_duration_q: 'Quanto tempo ci vuole per un forecast?',
    faq_duration_a: 'Dipende dalla modalità di calcolo. La modalità standard (modello singolo, senza backtest) risponde in pochi secondi. La modalità ensemble predefinita — tutti i 9 modelli, backtest walk-forward, intervalli calibrati — impiega circa 30 minuti. Il progresso viene trasmesso in tempo reale così puoi monitorare ogni fase.',
    cta_eyebrow: 'Richiedi accesso istituzionale',
    cta_h2a: 'Porta il motore',
    cta_h2b: 'al tuo desk.',
    cta_lede: 'Una chiamata di 30 minuti, un\'esecuzione di esempio sul ticker a tua scelta e un memo previsionale nelle tue mani alla fine. Nessuna presentazione, nessun teatro — solo il prodotto reale.',
    cta_btn1: 'Prenota revisione tecnica',
    cta_btn2: 'Scarica metodologia',
    perf_eyebrow: 'Validazione',
    perf_h2: 'Snapshot delle prestazioni di backtest',
    perf_lede: 'Statistiche di errore di previsione aggregate da esecuzioni di validazione completate. I valori finali verranno inseriti dopo il completamento della campagna di validazione completa.',
    perf_note: 'I risultati dai backtests storici non garantiscono le prestazioni future. Tutte le statistiche sono preliminari e soggette a validazione finale.',
    perf_mape: 'Errore % assoluto medio',
    perf_median: 'Errore % mediano',
    perf_directional: 'Precisione direzionale',
    perf_obs: 'Osservazioni test',
    perf_horizon: 'Orizzonti testati',
    perf_pending: 'In sospeso',
    perf_tbd: 'TBD',
    perf_horizons: '1G · 1S · 1M',
    nav_methodology: 'Metodologia',
    nav_request: 'Richiedi accesso',
    footer_disclaimer: 'NON È CONSULENZA FINANZIARIA. Previsio è una piattaforma di ricerca quantitativa e supporto alle decisioni. Gli output sono stime probabilistiche basate su dati storici e modelli statistici e non costituiscono consulenza sugli investimenti, raccomandazioni finanziarie o sollecitazione ad acquistare o vendere titoli. Le prestazioni passate non garantiscono risultati futuri. Capitale a rischio. Gli utenti rimangono responsabili di tutte le decisioni di investimento.',
  },
  fr: {
    splash_sub: 'Bienvenue dans le futur',
    hero_eyebrow: 'Prévisions quantitatives · support décisionnel',
    hero_h1a: 'Ensemble forecasting,',
    hero_h1b: 'avec les maths en clair.',
    hero_lede: 'Huit modèles de prévision, pondérés par erreur via un backtest walk-forward sur l\'actif lui-même. L\'ensemble combine les rendements relatifs — pas une moyenne naïve des prix. Les intervalles sont empiriques et asymétriques. Chaque exécution est entièrement reproductible.',
    hero_cta1: 'Demander l\'accès',
    hero_cta2: 'Voir la méthodologie',
    stat_models: 'modèles',
    stat_models_lab: 'En parallèle',
    stat_speed_lab: 'Par prévision',
    stat_repro: 'Reproductible',
    engine_eyebrow: 'Sous le capot',
    engine_h2a: 'Huit modèles, une',
    engine_h2b: 'réponse pondérée',
    engine_h2c: 'par backtest.',
    engine_lede: 'Aucun modèle unique ne gagne pour chaque actif, horizon et régime — donc nous ne prétendons pas qu\'un le fasse. Chaque prévision combine huit moteurs sélectionnables dans l\'espace des rendements relatifs, pondérés par un backtest walk-forward sur le même actif.',
    features_eyebrow: 'Fonctionnalités clés',
    features_h2: 'Construit pour ceux qui montrent leur travail.',
    analytics_eyebrow: 'Portfolio et analyses',
    analytics_h2: 'Bandes de confiance défendables, dispersion lisible.',
    analytics_lede: 'Chaque prévision inclut trois artefacts: une ligne ensemble pondérée par backtest, l\'intervalle supérieur/inférieur auquel le modèle s\'engage, et la dispersion des membres individuels de l\'ensemble.',
    methodology_eyebrow: 'Méthodologie',
    methodology_h2: 'Huit idées auxquelles le moteur s\'engage.',
    methodology_lede: 'Nous ne livrons pas une boîte noire. La méthodologie technique — chaque équation, seuil, valeur par défaut et chemin de repli — est documentée et disponible à la lecture avant de signer quoi que ce soit.',
    usecases_eyebrow: 'Cas d\'utilisation',
    usecases_h2: 'Même moteur. Quatre workflows professionnels.',
    dashboard_eyebrow: 'Aperçu du produit',
    dashboard_h2: 'Le vrai bureau. Pas un rendu marketing.',
    dashboard_lede: 'Trois colonnes, denses par conception: configurez à gauche, lisez le résumé au centre, explorez les poids et graphiques à droite. Toutes les valeurs sont des données d\'exemple illustratives.',
    pricing_eyebrow: 'Tarification',
    pricing_h2: 'Trois niveaux. Le moteur est le même dans tous.',
    pricing_lede: 'Nous n\'envoyons jamais un modèle différent à un niveau différent — ce qui change: débit, langues, déploiement et la quantité de piste d\'audit exportable.',
    trust_eyebrow: 'Confiance · sécurité · provenance',
    trust_h2: 'Une prévision sur laquelle vous pouvez signer.',
    trust_lede: 'Dans une industrie où les modèles dérivent, les bibliothèques se mettent à jour silencieusement et l\'IA hallucine, nous avons construit Previsio autour d\'un principe:',
    trust_lede_em: 'rien n\'est vrai s\'il n\'est pas reproductible',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Questions fréquentes.',
    faq_duration_q: 'Combien de temps dure une prévision ?',
    faq_duration_a: 'Cela dépend du mode de calcul. Le mode standard (modèle unique, sans backtest) répond en quelques secondes. Le mode ensemble par défaut — 9 modèles, backtest walk-forward, intervalles calibrés — prend environ 30 minutes. La progression est diffusée en direct pour suivre chaque étape.',
    cta_eyebrow: 'Demander l\'accès institutionnel',
    cta_h2a: 'Amenez le moteur',
    cta_h2b: 'à votre bureau.',
    cta_lede: 'Un appel de 30 minutes, un test sur le ticker de votre choix et un mémo dans vos mains à la fin. Pas de présentation, pas de théâtre — juste le produit réel.',
    cta_btn1: 'Réserver un examen technique',
    cta_btn2: 'Télécharger la méthodologie',
    perf_eyebrow: 'Validation',
    perf_h2: 'Aperçu des performances du backtest',
    perf_lede: 'Statistiques d\'erreur de prévision agrégées à partir des exécutions de validation. Les valeurs finales seront insérées après l\'achèvement de la campagne de validation complète.',
    perf_note: 'Les résultats des backtests historiques ne garantissent pas les performances futures. Toutes les statistiques sont préliminaires et sujettes à validation finale.',
    perf_mape: 'Erreur % absolue moyenne',
    perf_median: 'Erreur % médiane',
    perf_directional: 'Précision directionnelle',
    perf_obs: 'Observations de test',
    perf_horizon: 'Horizons testés',
    perf_pending: 'En attente',
    perf_tbd: 'TBD',
    perf_horizons: '1J · 1S · 1M',
    nav_methodology: 'Méthodologie',
    nav_request: 'Demander l\'accès',
    footer_disclaimer: 'PAS DE CONSEIL FINANCIER. Previsio est une plateforme de recherche quantitative et de support décisionnel. Les résultats sont des estimations probabilistes basées sur des données historiques et des modèles statistiques et ne constituent pas des conseils d\'investissement, des recommandations financières ou une sollicitation à acheter ou vendre des titres. Les performances passées ne garantissent pas les résultats futurs. Capital à risque. Les utilisateurs restent responsables de toutes les décisions d\'investissement.',
  },
  de: {
    splash_sub: 'Willkommen in der Zukunft',
    hero_eyebrow: 'Quantitative Prognosen · Entscheidungsunterstützung',
    hero_h1a: 'Ensemble forecasting,',
    hero_h1b: 'mit offener Mathematik.',
    hero_lede: 'Acht Prognosemodelle, fehlergewichtet durch Walk-Forward-Backtest auf dem Asset selbst. Das Ensemble kombiniert relative Renditen — nicht einen naiven Preisdurchschnitt. Intervalle sind empirisch und asymmetrisch. Jede Ausführung ist vollständig reproduzierbar.',
    hero_cta1: 'Zugriff anfordern',
    hero_cta2: 'Methodik anzeigen',
    stat_models: 'Modelle',
    stat_models_lab: 'Parallel',
    stat_speed_lab: 'Pro Prognose',
    stat_repro: 'Reproduzierbar',
    engine_eyebrow: 'Unter der Haube',
    engine_h2a: 'Acht Modelle, eine',
    engine_h2b: 'backtest-gewichtete',
    engine_h2c: 'Antwort.',
    engine_lede: 'Kein einzelnes Modell gewinnt über jeden Asset, Horizont und jedes Regime — daher tun wir nicht so. Jede Prognose kombiniert acht wählbare Engines im Raum relativer Renditen, gewichtet durch einen Walk-Forward-Backtest auf demselben Asset.',
    features_eyebrow: 'Kernfunktionen',
    features_h2: 'Gebaut für Desks, die ihre Arbeit zeigen.',
    analytics_eyebrow: 'Portfolio & Analytik',
    analytics_h2: 'Verteidigbare Konfidenzbänder, lesbare Dispersion.',
    analytics_lede: 'Jede Prognose enthält drei Artefakte: eine backtest-gewichtete Ensemble-Linie, das obere/untere Intervall und die Streuung der einzelnen Ensemble-Mitglieder.',
    methodology_eyebrow: 'Methodologie',
    methodology_h2: 'Acht Ideen, zu denen sich die Engine verpflichtet.',
    methodology_lede: 'Wir liefern keine Black Box. Die technische Methodik — jede Gleichung, jeder Schwellenwert, jeder Standardwert — ist dokumentiert und vor Unterzeichnung einsehbar.',
    usecases_eyebrow: 'Anwendungsfälle',
    usecases_h2: 'Gleiche Engine. Vier professionelle Workflows.',
    dashboard_eyebrow: 'Produktvorschau',
    dashboard_h2: 'Der echte Desk. Kein Marketing-Render.',
    dashboard_lede: 'Drei Spalten, dicht konzipiert: links konfigurieren, in der Mitte die Zusammenfassung lesen, rechts in Gewichte und Charts eintauchen. Alle Werte sind illustrative Beispieldaten.',
    pricing_eyebrow: 'Preise',
    pricing_h2: 'Drei Stufen. Die Engine ist in allen gleich.',
    pricing_lede: 'Wir liefern nie ein anderes Modell an eine andere Stufe — was sich ändert: Durchsatz, Sprachen, Deployment und wie viel des Audit-Trails Sie exportieren können.',
    trust_eyebrow: 'Vertrauen · Sicherheit · Provenienz',
    trust_h2: 'Eine Prognose, unter die Sie Ihren Namen setzen können.',
    trust_lede: 'In einer Branche, in der Modelle driften, Bibliotheken sich still aktualisieren und KI halluziniert, haben wir Previsio um ein Prinzip gebaut:',
    trust_lede_em: 'nichts ist wahr, wenn es nicht reproduzierbar ist',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Häufig gestellte Fragen.',
    faq_duration_q: 'Wie lange dauert eine Prognose?',
    faq_duration_a: 'Das hängt vom Berechnungsmodus ab. Der Standardmodus (einzelnes Modell, kein Backtest) antwortet in Sekunden. Der Standard-Ensemble-Modus — alle 9 Modelle, Walk-Forward-Backtest, kalibrierte Intervalle — dauert etwa 30 Minuten. Der Fortschritt wird live gestreamt, sodass jede Phase überwacht werden kann.',
    cta_eyebrow: 'Institutionellen Zugriff anfordern',
    cta_h2a: 'Bringen Sie die Engine',
    cta_h2b: 'an Ihren Desk.',
    cta_lede: 'Ein 30-minütiges Gespräch, ein Testlauf auf dem Ticker Ihrer Wahl und ein Prognosememo am Ende in Ihren Händen. Keine Präsentation, kein Theater — nur das echte Produkt.',
    cta_btn1: 'Technische Überprüfung buchen',
    cta_btn2: 'Methodologie herunterladen',
    perf_eyebrow: 'Validierung',
    perf_h2: 'Backtest-Leistungs-Snapshot',
    perf_lede: 'Aggregate Prognosefehlerstatistiken aus abgeschlossenen Validierungsläufen. Endwerte werden nach Abschluss der vollständigen Validierungskampagne eingefügt.',
    perf_note: 'Ergebnisse aus historischen Backtests garantieren keine zukünftige Leistung. Alle Statistiken sind vorläufig und unterliegen der endgültigen Validierung.',
    perf_mape: 'Mittlerer abs. % Fehler',
    perf_median: 'Medianer % Fehler',
    perf_directional: 'Richtungsgenauigkeit',
    perf_obs: 'Testbeobachtungen',
    perf_horizon: 'Getestete Horizonte',
    perf_pending: 'Ausstehend',
    perf_tbd: 'TBD',
    perf_horizons: '1T · 1W · 1M',
    nav_methodology: 'Methodologie',
    nav_request: 'Zugriff anfordern',
    footer_disclaimer: 'KEINE FINANZBERATUNG. Previsio ist eine quantitative Forschungs- und Entscheidungsunterstützungsplattform. Ergebnisse sind probabilistische Schätzungen auf Basis historischer Daten und statistischer Modelle und stellen keine Anlageberatung, Finanzempfehlung oder Aufforderung zum Kauf oder Verkauf von Wertpapieren dar. Vergangene Wertentwicklung garantiert keine zukünftigen Ergebnisse. Kapital gefährdet. Nutzer bleiben für alle Anlageentscheidungen verantwortlich.',
  },
};

const LanguageCtx = React.createContext();
function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('previsioLang') || 'en');
  const switchLang = (l) => { setLang(l); localStorage.setItem('previsioLang', l); };
  const t = (k) => T[lang]?.[k] || T.en[k] || k;
  return <LanguageCtx.Provider value={{ lang, setLang: switchLang, t }}>{children}</LanguageCtx.Provider>;
}
function useLanguage() { return React.useContext(LanguageCtx); }

/* ============================================================
   Reveal — intersection-observer wrapper
   Maps to Framer Motion: <motion.div initial={} whileInView={} viewport={{once:true}}>
   Variants: up (default), left, right, scale, fade
   ============================================================ */
function Reveal({ children, delay, variant = 'up', as: Tag = 'div', className = '', stagger, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('in');
            io.unobserve(el);
          }
        });
      },
      { rootMargin: '-32px 0px -6% 0px', threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal rv-${variant} ${className}`}
      data-delay={delay || undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ============================================================
   CountUp — animated number counter
   Maps to Framer Motion useInView + useMotionValue
   ============================================================ */
function CountUp({ value, suffix = '', duration = 1200 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          io.unobserve(el);
          const start = performance.now();
          const num = parseFloat(value) || 0;
          const isInt = Number.isInteger(num);
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
            const v = num * ease;
            setDisplay(isInt ? Math.round(v).toString() : v.toFixed(1));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ============================================================
   Nav
   ============================================================ */
function Nav() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '#engine', label: 'Engine' },
    { href: '#features', label: 'Features' },
    { href: '#methodology', label: t('nav_methodology') },
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];
  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#top">
            <img src={(window.__resources && window.__resources.logoArrow) || 'logo-arrow.png'} alt="Previsio" className="nav-logo" />
          </a>
          <div className="nav-links">
            {links.map((l, idx) => (
              <a className="nav-link" key={`nav-${idx}`} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav-cta">
            <div className="lang-selector">
              {['en','it','fr','de'].map((l, i) => (
                <button key={`ln-${i}`} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <a className="btn btn-ghost" href="downloads/Previsio-Methodology-v3.2.docx" download>{t('nav_methodology')}</a>
            <a className="btn btn-gold" href="#cta">{t('nav_request')} <span className="arrow">→</span></a>
            <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
              <span className="mono" style={{ fontSize: 12 }}>{open ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map((l, idx) => (
          <a key={`mob-${idx}`} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(212,175,55,0.2)', display: 'flex', gap: 6 }}>
          {['en','it','fr','de'].map((l, i) => (
            <button key={`lm-${i}`} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => { setLang(l); setOpen(false); }} style={{ flex: 1 }}>{l.toUpperCase()}</button>
          ))}
        </div>
        <a href="downloads/Previsio-Methodology-v3.2.docx" download onClick={() => setOpen(false)}>{t('nav_methodology')} (DOCX)</a>
        <a href="#cta" onClick={() => setOpen(false)} style={{ color: 'var(--gold-primary)' }}>{t('nav_request')} →</a>
      </div>
    </>
  );
}

/* ============================================================
   HERO — animated forecast preview
   ============================================================ */
function HeroChart() {
  // animate the forecast path drawing in
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  // generate a deterministic-looking price + forecast band
  const W = 480, H = 240, P = 20;
  const N = 60;          // historic points
  const F = 24;          // forecast points
  const total = N + F;

  // build historic price (random walk seeded)
  const points = [];
  let v = 100;
  const seed = (i) => Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.31) * 1.1;
  for (let i = 0; i < N; i++) {
    v += seed(i) * 0.9 + (i / N - 0.5) * 0.2;
    points.push(v);
  }
  // forecast continues
  const last = points[points.length - 1];
  const fc = [];
  for (let i = 0; i < F; i++) {
    fc.push(last + (i + 1) * 0.55 + Math.sin(i * 0.5) * 0.4);
  }
  const all = [...points, ...fc];
  const min = Math.min(...all) - 1;
  const max = Math.max(...all) + 3;

  const x = (i) => P + (i / (total - 1)) * (W - 2 * P);
  const y = (val) => H - P - ((val - min) / (max - min)) * (H - 2 * P);

  const histPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p)}`).join(' ');
  const fcPath = fc.map((p, i) => `${i === 0 ? `M ${x(N - 1)} ${y(last)} L` : 'L'} ${x(N + i)} ${y(p)}`).join(' ');

  // PI band (asymmetric)
  const band = (mult, side) => {
    const pts = fc.map((p, i) => {
      const grow = (i + 1) / F;
      const w = mult * 2.6 * Math.sqrt(grow) * (side === 'up' ? 1.0 : 0.85); // asymmetric
      return { x: x(N + i), y: y(p + (side === 'up' ? w : -w)) };
    });
    return pts;
  };
  const up = band(1.2, 'up');
  const dn = band(1.2, 'dn');
  const bandPath =
    `M ${x(N - 1)} ${y(last)} ` +
    up.map((q) => `L ${q.x} ${q.y}`).join(' ') +
    ` L ${dn[dn.length - 1].x} ${dn[dn.length - 1].y} ` +
    dn.slice().reverse().map((q) => `L ${q.x} ${q.y}`).join(' ') +
    ' Z';

  // forecast cutoff
  const cutX = x(N - 1);

  // model dispersion lines (4 colored ensemble members)
  const dispersion = [0.6, -0.4, 0.95, -0.85].map((bias, idx) =>
    fc.map((p, i) => {
      const grow = Math.sqrt((i + 1) / F);
      return { x: x(N + i), y: y(p + bias * grow * 1.6 + Math.cos(i * 0.6 + idx) * 0.25) };
    })
  );

  // gridlines
  const grid = [];
  for (let i = 1; i < 5; i++) {
    const gy = P + (i / 5) * (H - 2 * P);
    grid.push(<line key={i} className="gridline" x1={P} x2={W - P} y1={gy} y2={gy} />);
  }

  const fcLen = 600;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {grid}
      {/* PI band */}
      <path d={bandPath} fill="rgba(212,175,55,0.10)" stroke="none"
        style={{ opacity: drawn ? 1 : 0, transition: 'opacity 1.2s ease 0.4s' }} />
      {/* PI edges */}
      <polyline
        fill="none" stroke="rgba(212,175,55,0.5)" strokeDasharray="3 3" strokeWidth="1"
        points={up.map((q) => `${q.x},${q.y}`).join(' ')}
        style={{ opacity: drawn ? 0.7 : 0, transition: 'opacity 1s ease 0.5s' }}
      />
      <polyline
        fill="none" stroke="rgba(212,175,55,0.5)" strokeDasharray="3 3" strokeWidth="1"
        points={dn.map((q) => `${q.x},${q.y}`).join(' ')}
        style={{ opacity: drawn ? 0.7 : 0, transition: 'opacity 1s ease 0.5s' }}
      />
      {/* dispersion */}
      {dispersion.map((line, i) => (
        <polyline
          key={i}
          fill="none" stroke="rgba(126,184,218,0.45)" strokeWidth="0.9"
          points={line.map((q) => `${q.x},${q.y}`).join(' ')}
          style={{ opacity: drawn ? 0.65 : 0, transition: `opacity 0.8s ease ${0.7 + i * 0.1}s` }}
        />
      ))}
      {/* cutoff */}
      <line className="cut" x1={cutX} x2={cutX} y1={P} y2={H - P}
        style={{ opacity: drawn ? 0.5 : 0, transition: 'opacity 0.7s ease 0.2s' }} />

      {/* historic */}
      <path d={histPath} fill="none" stroke="rgba(234,234,234,0.85)" strokeWidth="1.4"
        strokeDasharray="700"
        strokeDashoffset={drawn ? 0 : 700}
        style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.6,.2,.2,1)' }}
      />
      {/* forecast */}
      <path d={fcPath} fill="none" stroke="var(--gold-primary)" strokeWidth="2"
        strokeDasharray={fcLen}
        strokeDashoffset={drawn ? 0 : fcLen}
        style={{ transition: 'stroke-dashoffset 1.1s ease 0.9s', filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))' }}
      />
      {/* terminal point */}
      <circle cx={x(total - 1)} cy={y(fc[fc.length - 1])} r="4" fill="var(--gold-primary)"
        style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.4s ease 1.9s', filter: 'drop-shadow(0 0 8px var(--gold-glow))' }} />

      {/* y axis ticks */}
      {[0, 0.5, 1].map((t, i) => {
        const yy = P + t * (H - 2 * P);
        const val = (max - t * (max - min)).toFixed(0);
        return (
          <text key={i} x={W - P + 4} y={yy + 4} className="axis-text">{val}</text>
        );
      })}
    </svg>
  );
}

function Hero() {
  const { t } = useLanguage();
  const models = ['SARIMA', 'PROPHET', 'TBATS', 'ETS', 'THETA', 'LGBM', 'CATB', 'NBEATS'];
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <Reveal>
            <span className="eyebrow">{t('hero_eyebrow')}</span>
          </Reveal>
          <Reveal as="h1" className="display" delay="1">
            {t('hero_h1a')}
            <br />
            <span className="accent">{t('hero_h1b')}</span>
          </Reveal>
          <Reveal as="p" className="lede" delay="2">
            {t('hero_lede')}
          </Reveal>
          <Reveal className="hero-actions" delay="3">
            <a className="btn btn-gold btn-lg" href="#cta">{t('hero_cta1')} <span className="arrow">→</span></a>
            <a className="btn btn-ghost btn-lg" href="#engine">{t('hero_cta2')}</a>
          </Reveal>
        </div>

        <Reveal delay="2" variant="right">
          <div className="panel forecast-panel">
            <div className="fp-head">
              <div>
                <div className="fp-title">AAPL · ensemble forecast</div>
                <div className="fp-sub">Horizon 218d · Conf 80%</div>
              </div>
              <div className="fp-tag">LIVE</div>
            </div>

            <HeroChart />

            <div className="fp-kpis">
              <div className="fp-kpi gold">
                <div className="l">Ensemble</div>
                <div className="v">$248.40</div>
              </div>
              <div className="fp-kpi">
                <div className="l">Interval 80%</div>
                <div className="v">$211 – $282</div>
              </div>
              <div className="fp-kpi">
                <div className="l">P(≥ target)</div>
                <div className="v">64%</div>
              </div>
            </div>

            <div className="chips">
              {models.map((m, i) => (
                <span key={m} className={`chip ${i < 6 ? 'active' : ''}`}>{m}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   ENGINE — 9 models + pipeline
   ============================================================ */
function ModelsPipeline() {
  const { t } = useLanguage();
  const models = [
    { name: 'SARIMA',   type: 'Statistical',           horizons: ['Short', 'Medium'] },
    { name: 'Prophet',  type: 'Additive decomposition', horizons: ['Short', 'Medium', 'Long'] },
    { name: 'TBATS',    type: 'State-space',            horizons: ['Short', 'Medium', 'Long'] },
    { name: 'ETS',      type: 'Error-Trend-Seasonal',   horizons: ['Short', 'Medium', 'Long'] },
    { name: 'Theta',    type: 'Trend extrapolation',    horizons: ['Short', 'Medium', 'Long'] },
    { name: 'LightGBM', type: 'Gradient boosting',      horizons: ['Short', 'Medium'] },
    { name: 'CatBoost', type: 'Gradient boosting',      horizons: ['Short', 'Medium'] },
    { name: 'NBEATS',   type: 'Deep learning',          horizons: ['Short', 'Medium', 'Long'] },
    { name: 'Naive*',   type: 'Baseline benchmark',     horizons: ['Short', 'Medium', 'Long'] },
  ];

  const stages = [
    ['Data acquisition',     'Local Bloomberg-style workbooks · ticker resolution · anomaly repair'],
    ['Context & horizon',    'Regime tagging (short / medium / long) · frequency-aware routing'],
    ['Ensemble weights',     'Walk-forward backtest · 1/err² · 65/35 hybrid · tail-aware variant'],
    ['Model execution',      'Parallel runners · negative-forecast rejection · profile-based budget'],
    ['Validation & PI',      'Walk-forward calibration · empirical asymmetric intervals'],
    ['Metrics & probability','Accuracy metrics · directional diagnostics · target probabilities'],
    ['Payload assembly',     'Structured results · diagnostics · interval policy · process audit'],
    ['AI commentary',        'Narrative-only · accessory text · never an autonomous numeric source'],
    ['Report generation',    'DOCX investment memo · charts · audit trail · 4 languages'],
  ];

  return (
    <section id="engine">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('engine_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
            {t('engine_h2a')} <em>{t('engine_h2b')}</em> {t('engine_h2c')}
          </h2>
          <p className="lede">
            {t('engine_lede')}
          </p>
        </Reveal>

        <div className="pipeline">
          {/* Model weights table */}
          <Reveal variant="left">
            <div className="model-table">
              <div className="model-row head">
                <span>#</span>
                <span>Model</span>
                <span>Type</span>
                <span>Allowed Horizons</span>
              </div>
              {models.map((m, i) => (
                <Bar key={m.name} idx={i + 1} {...m} />
              ))}
            </div>
            <div style={{
              marginTop: 18,
              padding: '14px 18px',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              lineHeight: 1.6
            }}>
              * Naive is an internal benchmark, not a user-selectable model. Weights shown are illustrative (AAPL, 218-day horizon). Models with insufficient history are auto-excluded; remaining weights rebalance.
            </div>
          </Reveal>

          {/* Pipeline stages */}
          <Reveal delay="1" variant="right">
            <div className="small-cap-rule">9-stage pipeline · per run</div>
            <div className="stages">
              {stages.map(([name, desc], i) => (
                <div className="stage" key={name}>
                  <div className="stage-num">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="stage-name">{name}</div>
                    <div className="stage-desc">{desc}</div>
                  </div>
                  <div className="stage-tick">✓</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Bar({ idx, name, type, horizons }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('in');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const horizonColors = { Short: 'rgba(212,175,55,0.18)', Medium: 'rgba(126,184,218,0.18)', Long: 'rgba(106,210,138,0.18)' };
  const horizonText   = { Short: 'var(--gold-primary)',      Medium: 'var(--neutral)',              Long: 'var(--gain)' };
  return (
    <div className="model-row" ref={ref}>
      <span className="num">{String(idx).padStart(2, '0')}</span>
      <span className="name">{name}</span>
      <span className="type">{type}</span>
      <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {horizons.map(h => (
          <span key={h} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            padding: '3px 7px',
            borderRadius: 4,
            background: horizonColors[h],
            color: horizonText[h],
            letterSpacing: '0.1em',
            border: `1px solid ${horizonText[h]}44`,
            whiteSpace: 'nowrap',
          }}>{h}</span>
        ))}
      </span>
    </div>
  );
}

/* ============================================================
   FEATURES grid
   ============================================================ */
function Features() {
  const { t } = useLanguage();
  const items = [
    {
      tag: '01',
      icon: '◈',
      title: 'Hybrid power-law weighting',
      body: 'A 65/35 blend of full-backtest and recent-window inverse-error weights ( 1 / err² ). Long-term accuracy without ignoring the last few months of regime.'
    },
    {
      tag: '02',
      icon: '⌬',
      title: 'Tail-aware robust weighting',
      body: 'When enough backtest data is available, the engine penalises models with unstable tail behaviour, asymmetry or persistent bias — even when their average accuracy looks competitive.'
    },
    {
      tag: '03',
      icon: '⊕',
      title: 'Relative-return ensemble',
      body: 'Models are combined as relative returns, not as a naive average of price levels. Outputs are converted back to price — preserving the natural structure of financial returns across different horizons.'
    },
    {
      tag: '04',
      icon: '↻',
      title: 'Walk-forward backtest',
      body: 'Expanding-window simulation with stratified anchor selection. Profile-based escalation (Fast → Ultra). Per-model escalation kicks in automatically if a profile fails its minimum valid-trial count.'
    },
    {
      tag: '05',
      icon: '⌗',
      title: 'Asymmetric prediction intervals',
      body: 'Empirical, horizon-aware. The calibration window adapts to the forecast length, weighted by recent market conditions, with anomaly filtering and separate upper/lower bounds per asset.'
    },
    {
      tag: '06',
      icon: '◐',
      title: 'Frequency-aware routing',
      body: 'Daily / weekly / monthly auto-selected by horizon regime: short ≤ 91d, medium ≤ 730d, long > 730d. OHLCV resampling preserves Open / High / Low / Close semantics — no naive mean of bars.'
    },
    {
      tag: '07',
      icon: '⌭',
      title: 'Anomaly repair & outlier panel',
      body: 'Robust MAD-based jump detection separates splits (history rescaled) from isolated shocks (interpolated). A second IQR / MAD filter on the model panel with a 3× explosion guard runs before combination.'
    },
    {
      tag: '08',
      icon: '⏵',
      title: 'Time-travel replay',
      body: 'Set the reference date backward; the entire engine re-runs blind, no future data visible. Compare what the model would have said in March 2023 with what actually happened.'
    },
    {
      tag: '09',
      icon: '⬡',
      title: 'Investment memo · 4 languages',
      body: 'Auto-generated DOCX with charts, KPIs, model weights, prediction intervals and full audit trail. Localised in English, Italian, French and German — UI and report both.'
    },
  ];
  return (
    <section id="features">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('features_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
            {t('features_h2')}
          </h2>
        </Reveal>
        <div className="features-grid">
          {items.map((it, i) => (
            <Reveal key={it.tag} delay={(i % 3) + 1} className="card feature">
              <div className="feature-tag">{it.tag}</div>
              <div className="feature-icon"><span style={{ fontSize: 18 }}>{it.icon}</span></div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ANALYTICS deep-dive — large chart with tabs
   ============================================================ */
function BigChart({ mode }) {
  const W = 720, H = 360, P = 28;
  const N = 140, F = 56;
  const total = N + F;

  // historic
  const hist = [];
  let v = 180;
  for (let i = 0; i < N; i++) {
    v += Math.sin(i * 0.21) * 1.4 + Math.sin(i * 0.07) * 0.8 + (Math.random() - 0.5) * 0.5;
    hist.push(v);
  }
  // make deterministic on remount: replace random with seeded noise
  const seeded = [];
  let v2 = 180;
  for (let i = 0; i < N; i++) {
    v2 += Math.sin(i * 0.21) * 1.4 + Math.sin(i * 0.07) * 0.8 + Math.sin(i * 1.3) * 0.5;
    seeded.push(v2);
  }
  const last = seeded[seeded.length - 1];
  const fc = [];
  for (let i = 0; i < F; i++) {
    fc.push(last + (i + 1) * 0.4 + Math.sin(i * 0.3) * 1.5);
  }
  const all = [...seeded, ...fc];
  const min = Math.min(...all) - 4;
  const max = Math.max(...all) + 10;
  const x = (i) => P + (i / (total - 1)) * (W - 2 * P);
  const y = (val) => H - P - ((val - min) / (max - min)) * (H - 2 * P);

  // PI bands at multiple confidence levels
  const bands = (mult) => {
    const up = fc.map((p, i) => {
      const grow = Math.sqrt((i + 1) / F);
      return { x: x(N + i), y: y(p + mult * 3.4 * grow) };
    });
    const dn = fc.map((p, i) => {
      const grow = Math.sqrt((i + 1) / F);
      return { x: x(N + i), y: y(p - mult * 3.0 * grow) };
    });
    const pth =
      `M ${x(N - 1)} ${y(last)} ` +
      up.map((q) => `L ${q.x} ${q.y}`).join(' ') +
      ` L ${dn[dn.length - 1].x} ${dn[dn.length - 1].y} ` +
      dn.slice().reverse().map((q) => `L ${q.x} ${q.y}`).join(' ') +
      ' Z';
    return pth;
  };

  const histPath = seeded.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p)}`).join(' ');
  const fcPath =
    `M ${x(N - 1)} ${y(last)} ` +
    fc.map((p, i) => `L ${x(N + i)} ${y(p)}`).join(' ');

  // ensemble member dispersion
  const dispersion = [0.9, -0.7, 1.4, -1.2, 0.4].map((bias, idx) =>
    fc.map((p, i) => {
      const grow = Math.sqrt((i + 1) / F);
      return { x: x(N + i), y: y(p + bias * grow * 2.4 + Math.sin(i * 0.5 + idx) * 0.6) };
    })
  );

  // gridlines
  const grid = [];
  for (let i = 1; i < 6; i++) {
    const gy = P + (i / 6) * (H - 2 * P);
    grid.push(<line key={`g${i}`} className="gridline" x1={P} x2={W - P} y1={gy} y2={gy} />);
  }
  for (let i = 1; i < 8; i++) {
    const gx = P + (i / 8) * (W - 2 * P);
    grid.push(<line key={`gx${i}`} className="gridline" x1={gx} x2={gx} y1={P} y2={H - P} />);
  }

  const cutX = x(N - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {grid}
      {/* 95% band */}
      {(mode === 'pi' || mode === 'all') && <path d={bands(1.6)} className="pi-band" style={{ opacity: 0.55 }} />}
      {/* 80% band */}
      {(mode === 'pi' || mode === 'all') && <path d={bands(1.1)} className="pi-band" />}
      {/* dispersion */}
      {(mode === 'dispersion' || mode === 'all') && dispersion.map((line, i) => (
        <polyline
          key={i}
          fill="none" stroke="rgba(126,184,218,0.5)" strokeWidth="1"
          points={line.map((q) => `${q.x},${q.y}`).join(' ')}
        />
      ))}
      {/* cutoff */}
      <line x1={cutX} x2={cutX} y1={P} y2={H - P} stroke="rgba(212,175,55,0.4)" strokeDasharray="4 4" />
      <text x={cutX + 6} y={P + 12} style={{ fill: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em' }}>
        FORECAST CUTOFF
      </text>
      {/* historic */}
      <path d={histPath} className="price-line" />
      {/* ensemble forecast */}
      <path d={fcPath} className="forecast-line" />

      {/* axis values */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const yy = P + t * (H - 2 * P);
        const val = (max - t * (max - min)).toFixed(0);
        return <text key={`y${i}`} x={4} y={yy + 4} className="axis-text">${val}</text>;
      })}
      <text x={x(0)} y={H - 8} className="axis-text">2024</text>
      <text x={x(N / 2)} y={H - 8} className="axis-text">2025</text>
      <text x={x(N - 1)} y={H - 8} className="axis-text">TODAY</text>
      <text x={x(total - 1) - 30} y={H - 8} className="axis-text">2026</text>
    </svg>
  );
}

function AnalyticsSection() {
  const { t } = useLanguage();
  const [mode, setMode] = useState('all');
  const tabs = [
    { id: 'all', label: 'ALL' },
    { id: 'pi', label: 'INTERVALS' },
    { id: 'dispersion', label: 'DISPERSION' },
  ];
  return (
    <section id="analytics">
      <div className="container">
        <div className="analytics-grid">
          <Reveal variant="left">
            <span className="eyebrow">{t('analytics_eyebrow')}</span>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginTop: 18 }}>
              {t('analytics_h2')}
            </h2>
            <p className="lede" style={{ marginTop: 18 }}>
              {t('analytics_lede')}
            </p>
            <div className="ana-points">
              <div className="ana-point">
                <div className="dot" />
                <div>
                  <h4>Calibrated, not assumed</h4>
                  <p>Interval widths are derived from the asset's own forecast history. No one-size-fits-all template, no assumptions borrowed from a different asset.</p>
                </div>
              </div>
              <div className="ana-point">
                <div className="dot" />
                <div>
                  <h4>Dispersion = disagreement</h4>
                  <p>When ensemble members diverge, the interval widens before you ask it to. The chart shows you which models are pulling against the consensus.</p>
                </div>
              </div>
              <div className="ana-point">
                <div className="dot" />
                <div>
                  <h4>Conditional probability ready</h4>
                  <p>Pass a target price and a direction (≥ or ≤) and the engine returns a calibrated probability — useful for option overlays, stop placements, and committee memos.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay="2" variant="right">
            <div className="panel big-chart">
              <div className="big-chart-head">
                <div>
                  <div className="fp-title">Ensemble forecast · ACME 12M</div>
                  <div className="fp-sub">Confidence 80% / 95% · 56-day horizon</div>
                </div>
                <div className="big-chart-tab">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      className={mode === t.id ? 'on' : ''}
                      onClick={() => setMode(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <BigChart mode={mode} />
              <div className="legend">
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'rgba(234,234,234,0.85)' }} /> Realised</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--gold-primary)' }} /> Ensemble</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'rgba(212,175,55,0.3)', height: 8 }} /> 80% / 95% PI</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'rgba(126,184,218,0.55)' }} /> Member dispersion</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   METHODOLOGY — surfaced from the technical documentation
   ============================================================ */
function Methodology() {
  const { t } = useLanguage();
  const blocks = [
    {
      tag: '§ 7',
      title: 'Ensemble in relative-return space',
      math: 'Weighted sum of each model\'s implied return, relative to the last observed close',
      body: 'Models contribute as relative returns, not price levels. The ensemble combines them and converts back to price — preserving the natural structure of financial returns across different horizons.',
    },
    {
      tag: '§ 10',
      title: 'Tail-aware weighting',
      math: 'Inverse-error weights, penalised by tail risk: p90, p95, skew, kurtosis and signed bias',
      body: 'When backtest data is rich enough, weights are adjusted to penalise models with unstable tails, asymmetry or persistent bias — even when their average error looks competitive.',
    },
    {
      tag: '§ 13',
      title: 'Empirical asymmetric PI',
      math: 'Asymmetric upper and lower bounds from the asset\'s own forecast history',
      body: 'Adaptive calibration window that grows with the forecast horizon, weighted by recent volatility and filtered for anomalies. The bounds widen naturally when the asset\'s own history justifies it.',
    },
    {
      tag: '§ 9',
      title: 'Walk-forward backtest',
      math: 'Anchors drawn from the feasible history window — each with enough future data to evaluate',
      body: 'Expanding-window simulation with stratified anchor selection across the full history. The same inputs always produce the same trial set, so results are fully reproducible.',
    },
    {
      tag: '§ 11',
      title: 'Outlier panel filter',
      math: 'Three-tier cascading filter: IQR-based → MAD-based → percentile-based, with progressive fallbacks',
      body: 'A robust filter on the forecast panel: penalise (×0.25) or exclude. Cascading fallbacks if IQR is degenerate. A 3× explosion guard removes any forecast more than triple the second-highest. Remaining weights renormalise.',
    },
    {
      tag: '§ 14',
      title: 'Probability engine',
      math: 'Empirical hit-rate against corrected residuals, with a conservative lower bound',
      body: 'Target-price and user-interval probabilities computed from the calibration history. The engine pairs the empirical hit-rate with a conservative lower bound; when data is sparse it can fall back to a parametric estimate.',
    },
    {
      tag: '§ 2',
      title: 'Local data sovereignty',
      math: 'Local Bloomberg-style workbooks: daily, weekly, monthly — no external API required',
      body: 'The core forecasting path uses local Bloomberg-style workbooks. No external market-data provider is required to produce a forecast. Paths can be overridden via environment variables; your data never has to leave your perimeter.',
    },
    {
      tag: '§ 4 / 8',
      title: 'Frequency-aware routing',
      math: 'Short horizon → daily · Medium → weekly · Long → monthly, with per-model fallback chains',
      body: 'Horizon regime, in calendar days, sets the preferred frequency. Per-model candidate orders fall back gracefully (e.g. SARIMA: daily → weekly; never long). OHLCV resampling preserves Open / High / Low / Close semantics, not mean-of-bars.',
    },
  ];

  return (
    <section id="methodology">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('methodology_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
            {t('methodology_h2')}
          </h2>
          <p className="lede">
            {t('methodology_lede')}
          </p>
        </Reveal>

        <div className="method-grid">
          {blocks.map((b, i) => (
            <Reveal key={b.tag} delay={(i % 4) + 1} className="card method-card">
              <div className="method-head">
                <span className="method-tag">{b.tag}</span>
                <h3>{b.title}</h3>
              </div>
              <div className="method-math">{b.math}</div>
              <p className="method-body">{b.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="method-download">
          <div className="md-inner">
            <div className="md-icon">◰</div>
            <div className="md-text">
              <div className="md-title">Previsio · Quantitative methodology</div>
              <div className="md-sub">23 sections · models, weights, intervals, probability, defaults · 105 figures</div>
            </div>
            <a className="btn btn-gold" href="downloads/Previsio-Methodology-v3.2.docx" download>
              Download DOCX <span className="arrow">→</span>
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

/* ============================================================
   USE CASES
   ============================================================ */
function UseCases() {
  const { t } = useLanguage();
  const cases = [
    {
      role: 'For smaller asset managers',
      title: 'Defensible client memos, on a daily cadence',
      body: 'Run the full engine in the morning, hand the auto-generated DOCX to the PM by 9. Every weight, every interval, every input is traceable — and the report ships in the client\'s language.',
      bullets: ['Auto memo (EN/IT/FR/DE)', 'Full audit trail', 'Reuse cache for fast revisions'],
    },
    {
      role: 'For traders',
      title: 'Backtests you can replay, signals you can stack',
      body: 'Time-travel to any historical cutoff and re-run the entire pipeline blind. Stack the ensemble against your own discretionary view, with calibrated probabilities for the directional bet you actually want to place.',
      bullets: ['Time-travel cutoff replay', 'P(target) under any condition', 'Calc modes Fast → Ultra'],
    },
    {
      role: 'For advanced investors',
      title: 'Self-service quant, without owning the infra',
      body: 'You bring the ticker; the engine handles model selection, weighting, intervals and the AI commentary. No Python, no notebooks — just inputs and a memo at the other end.',
      bullets: ['One screen, nine models', 'Probability for any target', 'No quant team required'],
    },
    {
      role: 'For crypto & equity desks',
      title: 'One engine, both regimes',
      body: 'Frequency-policy resampling handles the 24/7 nature of crypto and the discrete calendar of equities transparently. Same models, same diagnostics, same memo format — across both asset classes.',
      bullets: ['Horizon-aware resampling', 'Equities · BTC · ETH · majors', 'Per-asset PI calibration'],
    },
  ];
  return (
    <section id="use-cases">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('usecases_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
            {t('usecases_h2')}
          </h2>
        </Reveal>
        <div className="use-grid">
          {cases.map((c, i) => (
            <Reveal key={c.role} delay={(i % 2) + 1} className="card use-card">
              <div className="role">{c.role}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <ul>{c.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DASHBOARD PREVIEW — faithful recreation of the product UI
   ============================================================ */
function DashboardPreview() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('live');
  const [profile, setProfile] = useState('medium');
  return (
    <section id="dashboard">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('dashboard_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
            {t('dashboard_h2')}
          </h2>
          <p className="lede">
            {t('dashboard_lede')}
          </p>
        </Reveal>

        <Reveal variant="scale">
          <div className="desk">
            {/* LEFT: config */}
            <div className="panel">
              <div className="desk-panel-head">
                <div>
                  <div className="desk-title">Configuration</div>
                  <div className="desk-sub">Live market data</div>
                </div>
                
              </div>

              <div className="desk-tabs">
                <button className={tab === 'live' ? 'on' : ''} onClick={() => setTab('live')}>LIVE FORECAST</button>
                <button className={tab === 'sim' ? 'on' : ''} onClick={() => setTab('sim')}>TIME TRAVEL</button>
              </div>

              <div className="desk-group-label">Asset definition</div>
              <div className="desk-field">
                <label>Ticker symbol</label>
                <input className="desk-input focus" defaultValue="AAPL" />
              </div>
              <div className="desk-field">
                <label>Target date</label>
                <input className="desk-input" defaultValue="2026-12-31" />
              </div>

              <div className="desk-group-label">Backtest engine</div>
              <div className="desk-field">
                <label>Calc mode</label>
                <select className="desk-input" value={profile} onChange={(e) => setProfile(e.target.value)}>
                  <option value="fast">FAST — quick trial budget</option>
                  <option value="medium">STANDARD — balanced (recommended)</option>
                  <option value="long">DEEP — high precision</option>
                  <option value="very_long">ULTRA — maximum depth</option>
                </select>
              </div>

              <div className="desk-group-label">Calibration</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="desk-field" style={{ marginBottom: 0 }}>
                  <label>PI confidence</label>
                  <input className="desk-input" defaultValue="80%" />
                </div>
                <div className="desk-field" style={{ marginBottom: 0 }}>
                  <label>Backtest yrs</label>
                  <input className="desk-input" defaultValue="AUTO" />
                </div>
              </div>

              <div className="desk-group-label">Target probability</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="desk-field" style={{ marginBottom: 0 }}>
                  <label>Target price</label>
                  <input className="desk-input" defaultValue="260.00" />
                </div>
                <div className="desk-field" style={{ marginBottom: 0 }}>
                  <label>Condition</label>
                  <select className="desk-input">
                    <option>CLOSE ≥ TARGET</option>
                    <option>CLOSE ≤ TARGET</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-gold" style={{ width: '100%', marginTop: 22 }}>
                {tab === 'live' ? 'Run live forecast' : 'Run backtest'}
              </button>
            </div>

            {/* CENTER: results */}
            <div className="panel">
              <div className="desk-panel-head">
                <div>
                  <div className="desk-title">Results</div>
                  <div className="desk-sub">Executive summary · AAPL · as of 2026-05-27</div>
                </div>
                <span className="mono" style={{ fontSize: 10, padding: '4px 10px', border: '1px solid var(--gold-dim)', color: 'var(--gold-primary)', borderRadius: 4, letterSpacing: '0.14em' }}>LIVE</span>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card primary">
                  <div className="kpi-label">Ensemble forecast</div>
                  <div className="kpi-value">$248.40</div>
                  <div className="kpi-meta">+12.8% vs spot · 218d horizon</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">PI 80%</div>
                  <div className="kpi-value">$211 – $282</div>
                  <div className="kpi-meta">Calibrated</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Horizon</div>
                  <div className="kpi-value">218d</div>
                  <div className="kpi-meta">Long</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Bias</div>
                  <div className="kpi-value" style={{ color: 'var(--neutral)' }}>—2.1%</div>
                  <div className="kpi-meta">Under-pred</div>
                </div>
              </div>

              <div style={{ marginTop: 18, height: 220, border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16, background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>FORECAST · 12M</div>
                <BigChart mode="pi" />
              </div>
            </div>

            {/* RIGHT: detail */}
            <div className="panel">
              <div className="desk-panel-head">
                <div>
                  <div className="desk-title">Detail</div>
                  <div className="desk-sub">Models · charts · report</div>
                </div>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold-light)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Model weighting</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {[
                  ['SARIMA', 0.18], ['ETS', 0.15], ['Prophet', 0.14],
                  ['TBATS', 0.12], ['Theta', 0.11], ['LightGBM', 0.10],
                  ['CatBoost', 0.09], ['NBEATS', 0.08], ['Naive', 0.03],
                ].map(([n, w]) => (
                  <div key={n} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 38px', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-main)' }}>{n}</span>
                    <span style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <span style={{ display: 'block', width: `${w * 100 * 4}%`, maxWidth: '100%', height: '100%', background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-primary))' }} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold-primary)', textAlign: 'right' }}>{(w * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 22, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold-light)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Documentation</div>
              <a href="#" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px',
                border: '1px solid var(--border-gold)',
                borderRadius: 8,
                background: 'rgba(212,175,55,0.06)',
                color: 'var(--text-main)',
                textDecoration: 'none',
                fontSize: 12,
              }}>
                <span style={{ color: 'var(--gold-primary)' }}>◰</span>
                <span>Investment memo · DOCX</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>↓</span>
              </a>

              <div style={{ marginTop: 16, padding: 14, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 6 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>PI calibration</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>COVERAGE 80%</div>
                    <div style={{ fontSize: 15, marginTop: 4, color: 'var(--gold-primary)' }}>81.4%</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>AVG ERROR</div>
                    <div style={{ fontSize: 15, marginTop: 4 }}>4.8%</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>METHOD</div>
                    <div style={{ fontSize: 11, marginTop: 4, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>Asymmetric</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>RESIDUALS</div>
                    <div style={{ fontSize: 11, marginTop: 4, fontFamily: 'var(--font-mono)' }}>n = 218</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  P( close ≥ $260 ) = <span style={{ color: 'var(--gold-primary)' }}>64%</span> · Lower bound <span style={{ color: 'var(--gold-primary)' }}>58%</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   PRICING
   ============================================================ */
function Pricing() {
  const { t } = useLanguage();
  const tiers = [
    {
      tier: 'Solo',
      title: 'Individual',
      price: '€89',
      per: '/month',
      desc: 'For advanced investors running their own research.',
      features: [
        '50 forecasts / month',
        'All 9 models, Standard calc mode',
        'Asymmetric PI engine',
        'Single-language reports',
        'Email support',
      ],
      cta: 'Start trial',
      featured: false,
    },
    {
      tier: 'Desk',
      title: 'Advisory desk',
      price: '€490',
      per: '/month · per seat',
      desc: 'For small asset managers and RIAs producing client research.',
      features: [
        'Unlimited forecasts',
        'All calc modes incl. Ultra',
        'Tail-aware weighting (v1)',
        'Time-travel replay mode',
        'Multi-language reports (EN/IT/FR/DE)',
        'Audit trail export',
        'Priority support',
      ],
      cta: 'Request access',
      featured: true,
    },
    {
      tier: 'Enterprise',
      title: 'Institutional',
      price: 'Custom',
      per: '',
      desc: 'For institutional desks with deployment, residency or integration requirements.',
      features: [
        'Self-hosted or VPC deployment',
        'EU data residency option',
        'SSO / SAML & audit log export',
        'Custom model additions',
        'Integration support',
        'Dedicated SLA',
      ],
      cta: 'Talk to us',
      featured: false,
    },
  ];

  return (
    <section id="pricing">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('pricing_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
            {t('pricing_h2')}
          </h2>
          <p className="lede">
            {t('pricing_lede')}
          </p>
        </Reveal>

        <div className="price-grid">
          {tiers.map((t, i) => (
            <Reveal key={t.tier} delay={i + 1} className={`card price-card ${t.featured ? 'featured' : ''}`}>
              <div className="tier">{t.tier}</div>
              <h3>{t.title}</h3>
              <div className="price">{t.price}<span className="per">{t.per}</span></div>
              <p className="desc">{t.desc}</p>
              <ul>{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <a href="#cta" className={`btn ${t.featured ? 'btn-gold' : 'btn-ghost'}`}>{t.cta} <span className="arrow">→</span></a>
            </Reveal>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          Pricing in EUR · VAT excluded · Annual billing −15% · Indicative tiers
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   TRUST & SECURITY
   ============================================================ */
function Trust() {
  const { t } = useLanguage();
  const items = [
    { i: '⌭', t: 'Enterprise-grade authentication',  d: 'Industry-standard encrypted tokens with configurable expiration. Passwords are hashed with memory-hard algorithms. No credentials ever appear in logs or audit trails.' },
    { i: '⌖', t: 'Reproducible by construction', d: 'Every run is keyed by its inputs. Reuse cache to reproduce a number weeks later, byte-for-byte. The audit trail records what changed if you don\'t.' },
    { i: '⌬', t: 'Audit trail per stage',        d: 'All nine pipeline stages emit a trace: inputs, outputs, timing. Ship the trace alongside the memo for committees and compliance.' },
    { i: '⎈', t: 'On-prem or VPC available',     d: 'Enterprise plans support self-hosted deployment in your VPC, with EU data residency. Your data never has to leave your perimeter.' },
  ];
  return (
    <section id="trust">
      <div className="container">
        <div className="trust-grid">
          <Reveal variant="left">
            <span className="eyebrow">{t('trust_eyebrow')}</span>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginTop: 18 }}>
              {t('trust_h2')}
            </h2>
            <p className="lede" style={{ marginTop: 18 }}>
              {t('trust_lede')} <em style={{ color: 'var(--gold-light)' }}>{t('trust_lede_em')}</em>.
            </p>
            <div className="trust-list">
              {items.map((it) => (
                <div className="trust-item" key={it.t}>
                  <div className="trust-icon"><span style={{ fontSize: 20 }}>{it.i}</span></div>
                  <div>
                    <h4>{it.t}</h4>
                    <p>{it.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay="2" variant="right">
            <div className="panel trust-cert">
              <div>
                <div className="fp-title">Audit trace · AAPL/218d</div>
                <div className="fp-sub">Run #af3-2c91</div>
              </div>
              <div>
                {[
                  ['STAGE 01', 'Data — 5,420 pts loaded', '0.41s'],
                  ['STAGE 02', 'Context — long horizon', '0.02s'],
                  ['STAGE 03', 'Weights — backtest OK', '8.31s'],
                  ['STAGE 04', 'Models — 9/9 succeeded', '4.18s'],
                  ['STAGE 05', 'PI — calibrated empirically', '0.91s'],
                  ['STAGE 06', 'Metrics — Avg error 4.8%', '0.05s'],
                  ['STAGE 07', 'Payload — structured output', '0.02s'],
                  ['STAGE 08', 'AI — narrative commentary', '6.20s'],
                  ['STAGE 09', 'Report — DOCX × 4 langs', '1.71s'],
                ].map(([s, l, v]) => (
                  <div className="audit-line" key={s}>
                    <span className="ck">✓</span>
                    <span><span style={{ color: 'var(--gold-primary)' }}>{s}</span> · <span className="val">{l}</span></span>
                    <span className="val">{v}</span>
                  </div>
                ))}
                <div className="audit-line">
                  <span className="ck" style={{ color: 'var(--gold-light)' }}>Σ</span>
                  <span className="lab">Total runtime</span>
                  <span style={{ color: 'var(--gold-primary)' }}>21.8s</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
function FAQ() {
  const { t } = useLanguage();
  const items = [
    {
      q: t('faq_duration_q'),
      a: t('faq_duration_a'),
    },
    {
      q: 'Is Previsio investment advice?',
      a: 'No. Previsio is a quantitative analysis tool and decision-support engine. Forecasts are probabilistic estimates derived from historical data and statistical models. The platform is explicitly not a trading strategy, not an execution engine and does not simulate transaction costs, slippage, sizing, leverage, stops or portfolio rules. Past performance does not guarantee future results.'
    },
    {
      q: 'How are the model weights actually determined?',
      a: 'Through a walk-forward backtest on the asset you are forecasting. Models that perform poorly get less weight; models that perform well get more. The engine blends long-term accuracy with recent performance, and when enough data is available, it also penalises models with unstable or biased behaviour — even if their average error looks fine.'
    },
    {
      q: 'What data does the engine use for forecasts?',
      a: 'The core forecasting path uses local Bloomberg-style Excel workbooks (daily.xlsx, weekly.xlsx, monthly.xlsx). No external market-data provider is required. Paths can be overridden via environment variables (BLOOMBERG_DAILY_XLSX, BLOOMBERG_WEEKLY_XLSX, BLOOMBERG_MONTHLY_XLSX). Your data never has to leave your perimeter.'
    },
    {
      q: 'How are the prediction intervals calibrated?',
      a: 'Empirically and per asset. The engine builds a calibration history using the same models and settings as the forecast, with an adaptive time window, volatility-aware weighting and anomaly filtering. No normal-curve assumption, no width borrowed from a benchmark.'
    },
    {
      q: 'Does the engine combine forecasts in price space or return space?',
      a: 'In relative-return space, not price space. Each model contributes its expected return; the ensemble weights them and converts back to price. This preserves the natural structure of financial returns. Negative price forecasts from any model are rejected automatically.'
    },
    {
      q: 'How are reproducibility and provenance guaranteed?',
      a: 'Every run is keyed by its inputs. The same inputs produce the same backtest, the same weights and the same forecast. The audit trail records every stage with timing and outputs. Identical concurrent requests are deduplicated automatically.'
    },
    {
      q: 'What is "time-travel mode"?',
      a: 'A replay mode where you set the reference date backward in time and the entire engine — data, models, weights, intervals — re-runs blind, with no future data leaking. Used to validate how the platform would have reacted to a historical event. In simulation mode the engine compares the forecast against the realised price at the target date.'
    },
    {
      q: 'Which languages do reports support?',
      a: 'English, Italian, French and German. Both the UI and the auto-generated DOCX investment memo are localised, including chart captions, KPI labels and audit-trace headings.'
    },
    {
      q: 'Can we self-host Previsio?',
      a: 'Yes — Enterprise customers can deploy in their own VPC with EU data residency. Authentication, audit trails and report storage all stay inside your perimeter, alongside the local price workbooks. Talk to us for an architecture review.'
    },
    {
      q: 'How do I integrate Previsio with an existing process?',
      a: 'The platform exposes a REST API with the same structure as the UI. Trigger forecasts from your scheduler, pull results and diagnostics as JSON, and download memos as DOCX. Real-time progress streams are available for live tracking.'
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq">
      <div className="container">
        <Reveal className="section-head" style={{ margin: '0 auto 56px', textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{t('faq_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', margin: '14px auto 0' }}>
            {t('faq_h2')}
          </h2>
        </Reveal>
        <div className="faq">
          {items.map((it, i) => (
            <div key={it.q} className={`faq-item ${open === i ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <h4>{it.q}</h4>
                <span className="toggle">+</span>
              </div>
              <div className="faq-a"><div className="faq-a-inner">{it.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
   ============================================================ */
function FinalCTA() {
  const { t } = useLanguage();
  return (
    <section id="cta">
      <div className="container">
        <Reveal variant="scale">
          <div className="panel cta-panel">
            <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{t('cta_eyebrow')}</span>
            <h2 className="display">
              {t('cta_h2a')}
              <br />
              <span className="accent">{t('cta_h2b')}</span>
            </h2>
            <p className="lede" style={{ margin: '0 auto' }}>
              {t('cta_lede')}
            </p>
            <div className="cta-actions">
              <a className="btn btn-gold btn-lg" href="mailto:support@previsio.com">{t('cta_btn1')} <span className="arrow">→</span></a>
              <a className="btn btn-ghost btn-lg" href="downloads/Previsio-Methodology-v3.2.docx" download>{t('cta_btn2')}</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a className="brand" href="#top" style={{ marginBottom: 16, display: 'inline-flex' }}>
              <img src={(window.__resources && window.__resources.logoArrow) || 'logo-arrow.png'} alt="Previsio" className="nav-logo" style={{ height: 32 }} />
              <div>
                <div className="brand-name">PREVISIO</div>
                <div className="brand-tag">Quant Research Desk</div>
              </div>
            </a>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, maxWidth: '36ch', lineHeight: 1.6 }}>
              Eight-model ensemble forecasting with calibrated intervals and a defensible audit trail.
            </p>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <a href="#engine">Engine</a>
            <a href="#features">Features</a>
            <a href="#analytics">Analytics</a>
            <a href="#dashboard">Dashboard</a>
          </div>
          <div className="footer-col">
            <h5>Resources</h5>
            <a href="downloads/Previsio-Methodology-v3.2.docx" download>Methodology (DOCX)</a>
            <a href="#">API reference</a>
            <a href="#">Changelog</a>
            <a href="#">Status</a>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <a href="#">Terms of use</a>
            <a href="#">Privacy</a>
            <a href="#">Licensing</a>
            <a href="#">Disclosure</a>
          </div>
        </div>

        <div className="legal-block">
          {t('footer_disclaimer')}
        </div>

        <div className="footer-bottom">
          <span>© 2024–2026 Previsio · Predictive Ensemble Pro · All rights reserved.</span>
          <span className="mono" style={{ letterSpacing: '0.16em' }}>EN · IT · FR · DE</span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   PERFORMANCE SNAPSHOT — placeholder validation metrics
   ============================================================ */
function PerformanceSnapshot() {
  const { t } = useLanguage();
  const metrics = [
    { lab: t('perf_mape'), val: t('perf_pending') },
    { lab: t('perf_median'), val: t('perf_pending') },
    { lab: t('perf_directional'), val: t('perf_pending') },
    { lab: t('perf_obs'), val: t('perf_tbd') },
    { lab: t('perf_horizon'), val: t('perf_horizons') },
  ];
  return (
    <section id="validation">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('perf_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
            {t('perf_h2')}
          </h2>
          <p className="lede">
            {t('perf_lede')}
          </p>
        </Reveal>
        <Reveal>
          <div className="performance-grid">
            {metrics.map((m, i) => (
              <div key={i} className="perf-card card">
                <div className="perf-label">{m.lab}</div>
                <div className="perf-value">{m.val}</div>
              </div>
            ))}
          </div>
          <p className="perf-note">{t('perf_note')}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   APP
   ============================================================ */
function App() {
  return (
    <LanguageProvider>
      <IntroSplash />
      <GlobalVideoBackground />
      <Nav />
      <Hero />
      <ModelsPipeline />
      <Features />
      <AnalyticsSection />
      <Methodology />
      <UseCases />
      <DashboardPreview />
      <PerformanceSnapshot />
      <Pricing />
      <Trust />
      <FAQ />
      <FinalCTA />
      <Footer />
    </LanguageProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
