const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   INTRO SPLASH — fracture dissolve animation
   Pure CSS + vanilla JS text splitting. No npm, no Framer Motion.
   ============================================================ */
function IntroSplash() {
  const alreadySeen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('previsio_splash_seen') === '1';
  const [gone, setGone] = useState(alreadySeen);
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    if (alreadySeen) return;
    const el = containerRef.current;
    if (!el) return;

    sessionStorage.setItem('previsio_splash_seen', '1');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true);
      return;
    }

    const HOLD = 4100; // hold before fracture starts
    const FRACTURE = 1200; // fracture animation duration
    const FADE_OUT = 900; // screen fade out

    // Step 1: fracture subtitle letters
    const s1 = setTimeout(() => {
      const sub = el.querySelector('.splash-sub');
      if (!sub) return;
      const text = sub.textContent;
      sub.innerHTML = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'splash-letter';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.setProperty('--dx', (Math.random() - 0.5) * 120 + 'px');
        span.style.setProperty('--dy', (Math.random() - 0.5) * 80 + 'px');
        span.style.setProperty('--dr', (Math.random() - 0.5) * 30 + 'deg');
        span.style.setProperty('--delay', Math.random() * 0.35 + 's');
        sub.appendChild(span);
      });
      sub.classList.add('fracturing');
    }, HOLD);

    // Step 2: fade out screen + logo exit
    const s2 = setTimeout(() => {
      if (el) el.classList.add('fading-out');
    }, HOLD + FRACTURE * 0.4);

    // Step 3: remove from DOM
    const s3 = setTimeout(() => {
      setGone(true);
    }, HOLD + FRACTURE + FADE_OUT);

    return () => {clearTimeout(s1);clearTimeout(s2);clearTimeout(s3);};
  }, []);

  if (gone) return null;

  return (
    <div className="splash-screen" ref={containerRef}>
      <div className="splash-overlay"></div>
      <div className="splash-content">
        <div className="splash-title-row">
          <img src='logo-full.png' alt="Previsio" className="splash-logo" style={{ height: 420, maxWidth: '80vw' }} />
        </div>
        <div className="splash-sub">{t('splash_sub')}</div>
      </div>
    </div>);

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
        }}>
        
        <source src="previsio-hero-loop.mp4" type="video/mp4" />
      </video>
      <div className="global-video-overlay" />
    </div>);

}

// ============================================================
// LANGUAGE CONTEXT — compact translations for key UI strings
// Technical content (feature descriptions, methodology math, dashboard labels)
// stays in English as it's domain-specific professional terminology.
// ============================================================

const T = {
  en: {
    splash_sub: 'Statistical forecasting, on your desktop',
    hero_eyebrow: 'Statistical forecasting platform for financial markets',
    hero_h1a: 'The forecast report',
    hero_h1b: 'is already written.',
    hero_lede: 'Previsio transforms proprietary price histories into quantitative forecasts, calibrated prediction intervals and model-based probabilities — then hands you a structured report, ready for internal review, already written. Every number is traceable, reproducible and separate from any AI commentary.',
    hero_cta1: 'Request a free trial',
    hero_disclaimer: 'Research and decision-support tool · not investment advice',
    hero_pillars: 'Precision · Reliability · Convenience',
    hero_cta2: 'See what it produces',
    stat_models: 'models',
    stat_models_lab: 'In parallel',
    stat_speed_lab: 'Per forecast',
    stat_repro: 'Reproducible',
    engine_eyebrow: 'How it works',
    engine_h2a: 'A guided configuration.',
    engine_h2b: 'Four core quantitative',
    engine_h2c: 'outputs.',
    engine_lede: 'You configure a ticker, a target date, analysis depth and confidence level, and (optionally) a target price, a threshold direction, a price range and a Time Travel reference date. The engine reads the history from the dataset you select, runs up to eight forecasting models in parallel depending on the horizon and data available, weights them by how each performed on that asset, and delivers four computed outputs: predicted price, prediction interval, estimated probability relative to the indicated threshold and probability that the closing price falls within the defined range. Given the same dataset, parameters and engine version, the outputs are reproducible.',
    features_eyebrow: 'What you get',
    features_h2: 'Forecast, intervals, probabilities and an automated report. One auditable process.',
    analytics_eyebrow: 'Outputs',
    analytics_h2: 'Four core quantitative outputs, plus an optional directional indicator.',
    analytics_lede: 'Every run delivers separate, documented numeric outputs: the predicted price, the prediction interval, the threshold probability on the target date and the range closing probability. Threshold probability is derived from the empirical distribution of forecast errors; directional probability, where enabled, comes from a separate classifier and is shown only when it clears its validation gates. All results are consolidated in the report alongside diagnostics, model weights and the calculation log.',
    methodology_eyebrow: 'How it calculates',
    methodology_h2: 'The method in plain words.',
    methodology_lede: 'Here is what the engine actually does to reach a number, explained without formulas. Every equation, threshold and parameter behind it is available in the downloadable technical document.',
    usecases_eyebrow: 'Who uses it',
    usecases_h2: 'Same engine, four professional workflows.',
    dashboard_eyebrow: 'Product preview',
    dashboard_h2: 'The actual product interface. Exactly as it looks when you run a forecast.',
    dashboard_lede: 'A preview of the platform\'s graphical interface.',
    pricing_eyebrow: 'Pricing',
    pricing_h2: 'One price, shaped around a conversation.',
    pricing_lede: 'No plans to compare, no self-serve tiers. Tell us about your desk and we\'ll come back with a proposal sized to it — discussed with you before anything is confirmed.',
    pricing_statement: 'Every quote is prepared personally, after we understand what you actually need.',
    pricing_starting: 'Starting from €399/month.',
    trust_eyebrow: 'Trust · security · provenance',
    trust_h2: 'Forecasts and diagnostics designed to be verified, archived and discussed.',
    trust_lede: 'In an industry where models drift and dependencies change silently, we built Previsio around one principle:',
    trust_lede_em: 'every output must be reconstructable, verifiable and discussable',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Frequently asked questions.',
    faq_duration_q: 'How long does a forecast take?',
    faq_duration_a: 'Duration depends on the hardware, the forecast horizon, the compute profile, the amount of history and the models admitted. Progress is shown in real time in the interface.',
    cta_eyebrow: 'Request access',
    cta_h2a: 'Try it',
    cta_h2b: 'on your ticker.',
    cta_lede: 'A 30-minute call, a sample forecast on the selected ticker and a structured report, ready for internal review, waiting for you at the end — you write none of it. No presentation, no theatre. The actual product, on the actual asset.',
    cta_btn1: 'Request a free trial',
    cta_btn2: 'Download methodology',
    perf_eyebrow: 'Validation',
    perf_h2: 'Backtest performance results',
    perf_lede: 'Results from tests run with the Previsio platform across different assets, time horizons and methodologies. The data shows results obtained by the engine in historical out-of-sample simulations, run with walk-forward methodology and chronological holdout.',
    perf_note: 'Results from historical backtests do not guarantee future performance. Tests were run using the Standard and Deep calculation modes, with walk-forward methodology and chronological holdout validation.',
    perf_mape: 'Mean Abs. % Error',
    perf_median: 'Median % Error',
    perf_directional: 'Directional Accuracy',
    perf_obs: 'Test Observations',
    perf_horizon: 'Horizons Tested',
    perf_pending: 'Pending',
    perf_tbd: 'TBD',
    perf_horizons: '1D · 1W · 1M',
    nav_methodology: 'Methodology',
    nav_request: 'Free trial',
    data_eyebrow: 'Your data · your control',
    data_h2a: 'Your data stays yours.',
    data_h2b: 'We bring the models.',
    data_lede: 'Previsio does not collect, relay or store market data. Load your own price files, downloaded from Bloomberg, Refinitiv, FactSet or any provider already in use. The engine reads them locally and runs every calculation on your infrastructure.',
    data_card1_title: 'Data quality control',
    data_card1_body: 'Control of the source remains in your hands. No third-party feed, no silent revisions, no outdated data. The data that enters the engine is exactly what you have verified and approved.',
    data_card2_title: 'Controlled data processing',
    data_card2_body: 'In the standard configuration, market datasets, quantitative results and narrative commentary are processed locally. Ollama runs on the client\u2019s device and does not transmit this content to external AI providers. Technical communications required for separate services, such as licence activation, remain distinct. Should the client request a cloud AI configuration, the related data flow is defined and documented separately before activation.',
    data_card3_title: 'Compatible with any provider',
    data_card3_body: 'Bloomberg Excel, Refinitiv CSV, FactSet exports, internal databases: if it has a date column and a price column, Previsio reads it. Change provider at any time without modifying the system.',
    whats_next_label: "What's Next",
    whats_next_subtitle: 'A glimpse at what we are building',
    whats_next_status: 'In development',
    whats_next_items: [
    {
      title: 'Adaptive Weights by Asset and Horizon',
      body: 'We are training a model that learns — based on asset class and time horizon — which forecasting models have historically performed best, and automatically adapts the weights assigned to each model for every new forecast. The model requires large training samples to be effective, and therefore takes time before it can be integrated into production.',
      tag: 'AI · Modelling'
    },
    {
      title: 'Cloud Computation Cache',
      body: 'In deployments that allow it, Previsio can reuse previously computed results to reduce execution times for recurring assets, horizons and configurations. The cache is configurable, disableable and designed to respect the client\'s confidentiality requirements.',
      tag: 'Performance'
    },
    {
      title: 'Multivariate Forecast Model',
      body: 'A new multivariate model currently in development. Unlike the existing models, which forecast from price history alone, this model will incorporate multiple input variables — including macroeconomic indicators, sector data and fundamental metrics — to anchor price trajectories to a broader set of drivers.',
      tag: 'Modelling'
    }],

    tt_eyebrow: 'Trust · verify it yourself',
    tt_h2: 'See what Previsio would have said before any event you already know the outcome of.',
    tt_lede: 'Pick any past date and the system re-runs every calculation exactly as it would have on that day — with no knowledge of what came after. When it finishes, compare the forecast against what actually happened. Same four outputs. Same calculation log. Verifiable against an outcome you already know.',
    tt_step1_label: 'Choose a past date',
    tt_step1_body: 'Pick any past date as your starting point. The system treats that date as today and knows nothing about what came after.',
    tt_step2_label: 'Only past data enters the calculation',
    tt_step2_body: 'Up to eight models run, depending on the horizon and data available, using only the data that existed up to your chosen date. Nothing from after that date is used.',
    tt_step3_label: 'Comparison with reality',
    tt_step3_body: 'The forecast is shown alongside what actually happened. You can see exactly where the model was right, wrong, and by how much.',
    portfolio_eyebrow: 'Advanced Capabilities · Portfolio',
    portfolio_h2: 'A complete risk picture across an entire basket of assets.',
    portfolio_lede: 'Enter two or more tickers. Previsio computes the historical correlation matrix, annualised volatility per asset and for the combined portfolio, then runs per-ticker forecasts and aggregates them into a single total expected return — all in one unified report.',
    portfolio_feat1_label: 'Correlation matrix',
    portfolio_feat1_body: 'Pearson correlation on log returns, with return frequency chosen adaptively from the lookback window: daily under 9 months, weekly under 4 years, monthly beyond.',
    portfolio_feat2_label: 'Annualised volatility',
    portfolio_feat2_body: 'Per-ticker and portfolio-level volatility computed from the full covariance matrix. Choose equal-weight (1/N) or set custom weights that must sum to 100%.',
    portfolio_feat3_label: 'Risk contribution',
    portfolio_feat3_body: 'Euler decomposition of portfolio risk: absolute and percentage contribution per asset. You see exactly which ticker drives your total exposure.',
    portfolio_feat4_label: 'Diversification ratio',
    portfolio_feat4_body: 'Weighted average asset volatility divided by portfolio volatility. A ratio above 1 indicates a diversification benefit for the allocation and historical window analysed.',
    portfolio_feat5_label: 'Forecast aggregation',
    portfolio_feat5_body: 'Up to eight models run per ticker sequentially, depending on each ticker\'s horizon and history. The total expected return is the weighted sum of per-ticker expected returns; the prediction interval is the weighted linear combination of per-ticker interval extremes — correlations feed the volatility and risk-contribution metrics, not this interval.',
    portfolio_feat6_label: 'Unified HTML + DOCX report',
    portfolio_feat6_body: 'One file covering historical risk diagnostics, per-ticker forecasts, and the aggregated portfolio outlook — ready to send to a committee or attach to a research note.',
    portfolio_scope_note: 'Portfolio Mode does not automatically optimise weights and does not generate buy or sell signals.',
    ui_disclaimer: 'Values shown are illustrative only and do not represent a real forecast, a recommendation or certified historical performance. The interface may differ from the current version due to ongoing platform updates.',
    footer_disclaimer: 'NOT FINANCIAL ADVICE. Previsio is a quantitative research, statistical forecasting and decision-support documentation platform. Outputs are probabilistic estimates based on historical data, statistical models and user-selected parameters; they do not constitute investment advice, personalised recommendation, certified independent research or solicitation to buy or sell financial instruments. Past performance and historical backtests do not guarantee future results. The user remains responsible for all investment decisions.'
  },
  it: {
    splash_sub: 'Previsione statistica, sul tuo desktop',
    hero_eyebrow: 'Piattaforma di previsione statistica per mercati finanziari',
    hero_h1a: 'Il report di forecast',
    hero_h1b: 'è già scritto.',
    hero_lede: 'Previsio trasforma serie storiche proprietarie in forecast quantitativi, intervalli di predizione calibrati e probabilità modellistiche — trovate un report strutturato e pronto per la revisione interna, senza che dobbiate scriverne una riga. Ogni numero è tracciabile, riproducibile e separato dal commento AI.',
    hero_cta1: 'Richiedi la prova gratuita',
    hero_disclaimer: 'Strumento di ricerca e supporto alle decisioni · non costituisce consulenza in materia di investimenti',
    hero_pillars: 'Precisione · Affidabilità · Comodità',
    hero_cta2: 'Vedi cosa produce',
    stat_models: 'modelli',
    stat_models_lab: 'In parallelo',
    stat_speed_lab: 'Per previsione',
    stat_repro: 'Riproducibile',
    engine_eyebrow: 'Come funziona',
    engine_h2a: 'Una configurazione guidata.',
    engine_h2b: 'Quattro output quantitativi',
    engine_h2c: 'principali.',
    engine_lede: 'Configurate un ticker, una data obiettivo, la profondità di analisi e il livello di confidenza, e facoltativamente un prezzo target, una direzione di soglia, un range di prezzo e una data di riferimento Time Travel. Il sistema legge lo storico dal dataset selezionato dall\'utente, lancia fino a otto modelli di previsione in parallelo, in base all\'orizzonte e ai dati disponibili, li pesa in base ai risultati sull\'asset e produce quattro output calcolati: prezzo previsto, intervallo di predizione, probabilità stimata rispetto alla soglia indicata e probabilità che il prezzo di chiusura sia compreso nel range definito. A parità di dataset, parametri e versione del motore, gli output sono riproducibili.',
    features_eyebrow: 'Cosa ottenete',
    features_h2: "Forecast, intervalli, probabilità e report automatico in un unico processo auditabile.",
    analytics_eyebrow: 'Output',
    analytics_h2: 'Quattro output quantitativi principali, più un indicatore direzionale opzionale.',
    analytics_lede: 'Ogni esecuzione produce output numerici separati e documentati: prezzo previsto, intervallo di predizione, probabilità di soglia alla data obiettivo e probabilità di chiusura nel range. La probabilità di soglia deriva dalla distribuzione empirica degli errori previsionali. La probabilità direzionale è invece prodotta da un classificatore separato e viene mostrata solo quando supera i gate di validazione previsti. I risultati vengono consolidati nel report insieme a diagnostica, pesi dei modelli e calculation log.',
    methodology_eyebrow: 'Come calcola',
    methodology_h2: 'Il metodo in parole semplici',
    methodology_lede: 'Di seguito ciò che il motore fa concretamente per arrivare a un numero, spiegato senza formule. Ogni equazione, soglia e parametro che c’è dietro è consultabile nel documento tecnico scaricabile.',
    usecases_eyebrow: 'Chi lo usa',
    usecases_h2: 'Stesso motore, quattro flussi di lavoro professionali.',
    dashboard_eyebrow: 'Anteprima prodotto',
    dashboard_h2: 'L\'interfaccia reale del prodotto, esattamente come appare quando si esegue una previsione.',
    dashboard_lede: 'Di seguito un\'anteprima dell\'interfaccia grafica della piattaforma.',
    pricing_eyebrow: 'Prezzi',
    pricing_h2: 'Un prezzo, definito in una conversazione.',
    pricing_lede: 'Nessun piano da confrontare, nessun listino a pacchetti. Raccontateci il vostro desk e torneremo con una proposta su misura — discussa insieme, prima di qualunque impegno.',
    pricing_statement: 'Ogni preventivo viene preparato personalmente, dopo aver capito cosa vi serve davvero.',
    pricing_starting: 'A partire da 399€ al mese.',
    trust_eyebrow: 'Fiducia · sicurezza · provenienza',
    trust_h2: 'Forecast e diagnostica progettati per essere verificati, archiviati e discussi',
    trust_lede: 'In un settore dove i modelli derivano e le dipendenze cambiano silenziosamente, abbiamo costruito Previsio attorno a un principio:',
    trust_lede_em: 'ogni output deve poter essere ricostruito, verificato e discusso',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Domande frequenti.',
    faq_duration_q: 'Quanto tempo ci vuole per una previsione?',
    faq_duration_a: 'La durata dipende dall’hardware, dall’orizzonte, dal profilo di calcolo, dalla quantità di storico e dai modelli ammessi. L’avanzamento viene mostrato in tempo reale nell’interfaccia.',
    cta_eyebrow: 'Richiedi accesso',
    cta_h2a: 'Provalo',
    cta_h2b: 'sul vostro ticker.',
    cta_lede: 'Una chiamata di 30 minuti, una previsione di esempio sul ticker selezionato e un report strutturato e pronto per la revisione interna ad attendervi alla fine — senza scriverne una riga. Nessuna presentazione, nessun teatro. Il prodotto reale, sull’asset reale.',
    cta_btn1: 'Richiedi la prova gratuita',
    cta_btn2: 'Scarica metodologia',
    perf_eyebrow: 'Validazione',
    perf_h2: 'Risultati delle prestazioni di backtest',
    perf_lede: 'Risultati dei test eseguiti con la piattaforma Previsio su diversi asset, orizzonti temporali e metodologie. I dati mostrano i risultati ottenuti dal motore in simulazioni storiche out-of-sample condotte con metodologia walk-forward e holdout cronologico.',
    perf_note: 'I risultati dei backtest storici non garantiscono performance future. I test sono stati eseguiti con le modalità di calcolo Standard e Deep, con metodologia walk-forward e holdout cronologico.',
    perf_mape: 'Errore % assoluto medio',
    perf_median: 'Errore % mediano',
    perf_directional: 'Precisione direzionale',
    perf_obs: 'Osservazioni test',
    perf_horizon: 'Orizzonti testati',
    perf_pending: 'In sospeso',
    perf_tbd: 'TBD',
    perf_horizons: '1G · 1S · 1M',
    nav_methodology: 'Metodologia',
    nav_request: 'Prova gratuita',
    data_eyebrow: 'I vostri dati · il vostro controllo',
    data_h2a: 'I dati rimangono vostri.',
    data_h2b: 'Noi portiamo i modelli.',
    data_lede: 'Previsio non raccoglie, non trasmette e non archivia dati di mercato. Caricate i vostri file di prezzo, scaricati da Bloomberg, Refinitiv, FactSet o qualsiasi provider già in uso. Il motore li legge localmente ed esegue ogni calcolo sulla vostra infrastruttura.',
    data_card1_title: 'Controllo della qualità dei dati',
    data_card1_body: 'Il controllo della fonte rimane nelle vostre mani. Nessun feed di terze parti, nessuna rettifica silenziosa, nessun dato obsoleto. I dati che entrano nel motore sono esattamente quelli che avete verificato e approvato.',
    data_card2_title: 'Elaborazione controllata dei dati',
    data_card2_body: 'Nella configurazione standard, i dataset di mercato, i risultati quantitativi e il commento narrativo vengono elaborati localmente. Ollama opera sul dispositivo del cliente e non trasmette questi contenuti a provider AI esterni. Restano separate le comunicazioni tecniche necessarie per servizi distinti, come l\u2019attivazione della licenza. Qualora il cliente richieda una configurazione AI cloud, il relativo flusso dati viene definito e documentato separatamente prima dell\u2019attivazione.',
    data_card3_title: 'Compatibile con qualsiasi provider',
    data_card3_body: 'Excel Bloomberg, CSV Refinitiv, export FactSet, database interni: se ha una colonna data e una colonna prezzo, Previsio lo legge. Cambiate provider in qualsiasi momento senza modificare il sistema.',
    whats_next_label: "What's Next",
    whats_next_subtitle: 'Uno sguardo a ciò che stiamo costruendo',
    whats_next_status: 'In sviluppo',
    whats_next_items: [
    {
      title: 'Pesi Adattativi per Asset e Orizzonte',
      body: "Stiamo allenando un modello che apprende — in base all'asset class e all'orizzonte temporale — quali modelli previsionali abbiano storicamente performato meglio e adatta automaticamente i pesi assegnati a ciascun modello per ogni nuovo forecast. Il modello richiede campioni di grandi dimensioni per essere allenato in modo efficace e dunque richiede tempo prima di poter essere integrato in produzione.",
      tag: 'AI · Modellistica'
    },
    {
      title: 'Cache di Calcolo Cloud',
      body: 'Nei deployment che lo consentono, Previsio può riutilizzare risultati già calcolati per ridurre i tempi di esecuzione su asset, orizzonti e configurazioni ricorrenti. La cache è configurabile, disattivabile e progettata per rispettare i vincoli di riservatezza del cliente',
      tag: 'Performance'
    },
    {
      title: 'Modello Previsionale Multivariato',
      body: 'Un nuovo modello multivariato attualmente in sviluppo. A differenza dei modelli esistenti, che prevedono unicamente dalla storia dei prezzi, questo modello incorporerà variabili multiple — tra cui indicatori macroeconomici, dati settoriali e metriche fondamentali — per ancorare le traiettorie di prezzo a un insieme più ampio di driver.',
      tag: 'Modellistica'
    }],

    tt_eyebrow: 'Fiducia · verificalo tu stesso',
    tt_h2: 'Scoprite cosa avrebbe detto Previsio prima di qualsiasi evento di cui già conoscete l\'esito.',
    tt_lede: 'Scegliete una data passata qualsiasi e il sistema riesegue ogni calcolo esattamente come avrebbe fatto in quel giorno — senza sapere nulla di ciò che è accaduto dopo. Al termine, confrontate la previsione con quanto è realmente accaduto. Stessi quattro output. Stesso registro di calcolo. Verificabile contro un esito che già conoscete.',
    tt_step1_label: 'Scegliete una data passata',
    tt_step1_body: 'Scegliete qualsiasi data passata come punto di partenza. Il sistema la tratta come oggi e non sa nulla di ciò che è accaduto dopo.',
    tt_step2_label: 'Solo dati passati entrano nel calcolo',
    tt_step2_body: 'Fino a otto modelli vengono eseguiti, in base all\'orizzonte e ai dati disponibili, usando esclusivamente i dati esistenti fino alla data scelta. Nulla di successivo entra nel calcolo.',
    tt_step3_label: 'Confronto con la realtà',
    tt_step3_body: 'La previsione viene affiancata a ciò che è realmente accaduto. Potete vedere esattamente dove il modello aveva ragione, dove sbagliava e di quanto.',
    portfolio_eyebrow: 'Funzionalità avanzate · Portfolio',
    portfolio_h2: 'Un quadro di rischio completo su un intero basket di asset.',
    portfolio_lede: 'Inserite due o più ticker. Previsio calcola la matrice di correlazione storica, la volatilità annualizzata per asset e per il portafoglio combinato, poi esegue le previsioni per ogni ticker e le aggrega in un unico rendimento atteso totale — tutto in un report unificato.',
    portfolio_feat1_label: 'Matrice di correlazione',
    portfolio_feat1_body: 'Correlazione di Pearson sui rendimenti logaritmici, con frequenza adattiva in base alla finestra temporale: giornaliera sotto i 9 mesi, settimanale sotto i 4 anni, mensile oltre.',
    portfolio_feat2_label: 'Volatilità annualizzata',
    portfolio_feat2_body: 'Volatilità per ticker e di portafoglio dalla matrice di covarianza. Pesi equal-weight (1/N) o personalizzati che sommati arrivano a 100.',
    portfolio_feat3_label: 'Contributo al rischio',
    portfolio_feat3_body: 'Decomposizione di Euler del rischio di portafoglio: contributo assoluto e percentuale per asset. Vedete esattamente quale ticker guida la vostra esposizione.',
    portfolio_feat4_label: 'Rapporto di diversificazione',
    portfolio_feat4_body: 'Volatilità media pesata degli asset divisa per la volatilità di portafoglio. Un valore superiore a 1 indica un beneficio di diversificazione nella configurazione e nella finestra storica analizzate.',
    portfolio_feat5_label: 'Aggregazione previsioni',
    portfolio_feat5_body: 'Fino a otto modelli girano per ogni ticker in sequenza, in base all\'orizzonte e allo storico disponibili per ciascun asset. Il rendimento atteso totale è la somma pesata dei rendimenti attesi per-ticker; l\'intervallo di previsione è la combinazione lineare pesata degli estremi degli intervalli per-ticker — le correlazioni alimentano la volatilità e il contributo al rischio, non questo intervallo.',
    portfolio_feat6_label: 'Report unificato HTML + DOCX',
    portfolio_feat6_body: 'Un file che copre la diagnostica storica del rischio, le previsioni per ticker e la prospettiva aggregata del portafoglio — pronto per la revisione interna o da allegare a una research note.',
    portfolio_scope_note: 'La modalità Portfolio non ottimizza automaticamente i pesi e non genera indicazioni di acquisto o vendita.',
    ui_disclaimer: 'I valori mostrati sono esclusivamente illustrativi e non rappresentano una previsione reale, una raccomandazione o una performance storica certificata. L’interfaccia può differire dalla versione attuale a causa dei continui aggiornamenti della piattaforma.',
    footer_disclaimer: 'NON È CONSULENZA FINANZIARIA. Previsio è una piattaforma di ricerca quantitativa, forecast statistico e supporto documentale alle decisioni. Gli output sono stime probabilistiche basate su dati storici, modelli statistici e parametri selezionati dall’utente; non costituiscono consulenza in materia di investimenti, raccomandazione personalizzata, ricerca indipendente certificata, sollecitazione all’acquisto o vendita di strumenti finanziari. Le prestazioni passate e i backtest storici non garantiscono risultati futuri. L’utente rimane responsabile di ogni decisione di investimento.'
  },
  fr: {
    splash_sub: 'Prévision statistique, sur votre bureau',
    hero_eyebrow: 'Plateforme de prévision statistique pour les marchés financiers',
    hero_h1a: 'Le rapport de prévision',
    hero_h1b: 'est déjà rédigé.',
    hero_lede: 'Previsio transforme des historiques de prix propriétaires en prévisions quantitatives, intervalles de prédiction calibrés et probabilités modélisées — puis vous remet un rapport structuré, prêt pour la revue interne,rt déjà rédigé, prêt à présenter. Chaque chiffre est traçable, reproductible et séparé de tout commentaire IA.',
    hero_cta1: 'Demander un essai gratuit',
    hero_disclaimer: 'Outil de recherche et d\'aide à la décision · ne constitue pas un conseil en investissement',
    hero_pillars: 'Précision · Fiabilité · Commodité',
    hero_cta2: 'Voir ce qu\'il produit',
    stat_models: 'modèles',
    stat_models_lab: 'En parallèle',
    stat_speed_lab: 'Par prévision',
    stat_repro: 'Reproductible',
    engine_eyebrow: 'Comment ça marche',
    engine_h2a: 'Une configuration guidée.',
    engine_h2b: 'Quatre sorties quantitatives',
    engine_h2c: 'principales.',
    engine_lede: 'Vous configurez un ticker, une date cible, la profondeur d\'analyse et le niveau de confiance, et en option un prix cible, une direction de seuil, une fourchette de prix et une date de référence Time Travel. Le système lit l\'historique à partir du jeu de données que vous sélectionnez, lance jusqu\'à huit modèles de prévision en parallèle selon l\'horizon et les données disponibles, les pondère selon leurs résultats sur cet actif et produit quatre sorties calculées : prix prévu, intervalle de prédiction, probabilité estimée par rapport au seuil indiqué et probabilité que le prix de clôture soit compris dans la plage définie. À dataset, paramètres et version du moteur identiques, les sorties sont reproductibles.',
    features_eyebrow: 'Ce que vous obtenez',
    features_h2: 'Prévisions, intervalles, probabilités et rapport automatique. Un seul processus auditable.',
    analytics_eyebrow: 'Sorties',
    analytics_h2: 'Quatre sorties quantitatives principales, plus un indicateur directionnel optionnel.',
    analytics_lede: 'Chaque exécution produit des sorties numériques séparées et documentées : le prix prévu, l\'intervalle de prédiction, la probabilité de seuil à la date cible et la probabilité de clôture dans une fourchette définie. La probabilité de seuil dérive de la distribution empirique des erreurs de prévision ; la probabilité directionnelle, si activée, provient d\'un classificateur séparé et n\'est affichée que lorsqu\'elle franchit ses seuils de validation. Les résultats sont consolidés dans le rapport avec la diagnostique, les pondérations des modèles et le journal de calcul.',
    methodology_eyebrow: 'Comment ça calcule',
    methodology_h2: 'La méthode en mots simples.',
    methodology_lede: 'Voici ce que fait réellement le moteur pour arriver à un chiffre, expliqué sans formule. Chaque équation, seuil et paramètre se trouve dans le document technique téléchargeable.',
    usecases_eyebrow: 'Qui l\'utilise',
    usecases_h2: 'Même moteur, quatre flux de travail professionnels.',
    dashboard_eyebrow: 'Aperçu du produit',
    dashboard_h2: 'L\'interface réelle du produit. Exactement telle qu\'elle apparaît quand vous lancez une prévision.',
    dashboard_lede: 'Un aperçu de l\'interface graphique de la plateforme.',
    pricing_eyebrow: 'Tarification',
    pricing_h2: 'Un tarif, défini au fil d\'une conversation.',
    pricing_lede: 'Pas de forfaits à comparer, pas de grille en libre-service. Parlez-nous de votre desk et nous reviendrons avec une proposition sur mesure — discutée avec vous avant tout engagement.',
    pricing_statement: 'Chaque devis est préparé personnellement, une fois vos besoins réels compris.',
    pricing_starting: 'À partir de 399€/mois.',
    trust_eyebrow: 'Confiance · sécurité · provenance',
    trust_h2: 'Prévisions et diagnostics conçus pour être vérifiés, archivés et discutés.',
    trust_lede: 'Dans une industrie où les modèles dérivent et où les dépendances changent silencieusement, nous avons construit Previsio autour d\'un principe:',
    trust_lede_em: 'chaque résultat doit pouvoir être reconstruit, vérifié et discuté',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Questions fréquentes.',
    faq_duration_q: 'Combien de temps dure une prévision ?',
    faq_duration_a: 'La durée dépend du matériel, de l\'horizon, du profil de calcul, de la quantité d\'historique et des modèles admis. La progression s\'affiche en temps réel dans l\'interface.',
    cta_eyebrow: 'Demander l\'accès',
    cta_h2a: 'Essayez-le',
    cta_h2b: 'sur votre ticker.',
    cta_lede: 'Un appel de 30 minutes, une prévision d\'exemple sur le ticker sélectionné et un rapport structuré et prêt pour la revue interne qui vous attend à la fin — vous n\u2019en rédigez pas une ligne. Pas de présentation, pas de théâtre. Le vrai produit, sur le vrai actif.',
    cta_btn1: 'Demander un essai gratuit',
    cta_btn2: 'Télécharger la méthodologie',
    perf_eyebrow: 'Validation',
    perf_h2: 'Résultats des performances de backtest',
    perf_lede: 'Résultats des tests exécutés avec la plateforme Previsio sur différents actifs, horizons temporels et méthodologies. Les données montrent les résultats obtenus par le moteur lors de simulations historiques out-of-sample, menées avec une méthodologie walk-forward et un holdout chronologique.',
    perf_note: 'Les résultats des backtests historiques ne garantissent pas les performances futures. Les tests ont été réalisés avec les modes de calcul Standard et Deep, avec la méthodologie walk-forward et la validation par holdout chronologique.',
    perf_mape: 'Erreur % absolue moyenne',
    perf_median: 'Erreur % médiane',
    perf_directional: 'Précision directionnelle',
    perf_obs: 'Observations de test',
    perf_horizon: 'Horizons testés',
    perf_pending: 'En attente',
    perf_tbd: 'TBD',
    perf_horizons: '1J · 1S · 1M',
    nav_methodology: 'Méthodologie',
    nav_request: 'Essai gratuit',
    data_eyebrow: 'Vos données · votre contrôle',
    data_h2a: 'Vos données restent vôtres.',
    data_h2b: 'Nous apportons les modèles.',
    data_lede: 'Previsio ne collecte, ne transmet et ne stocke pas de données de marché. Chargez vos propres fichiers de prix, téléchargés depuis Bloomberg, Refinitiv, FactSet ou tout fournisseur déjà utilisé. Le moteur les lit localement et exécute chaque calcul sur votre infrastructure.',
    data_card1_title: 'Contrôle de la qualité des données',
    data_card1_body: 'Le contrôle de la source reste entre vos mains. Aucun flux tiers, aucune correction silencieuse, aucune donnée obsolète. Les données qui entrent dans le moteur sont exactement celles que vous avez vérifiées et approuvées.',
    data_card2_title: 'Traitement contrôlé des données',
    data_card2_body: 'Dans la configuration standard, les jeux de données de marché, les résultats quantitatifs et le commentaire narratif sont traités localement. Ollama fonctionne sur l\u2019appareil du client et ne transmet pas ces contenus à des fournisseurs d\u2019IA externes. Les communications techniques nécessaires à des services distincts, comme l\u2019activation de la licence, restent séparées. Si le client demande une configuration d\u2019IA cloud, le flux de données correspondant est défini et documenté séparément avant l\u2019activation.',
    data_card3_title: 'Compatible avec tout fournisseur',
    data_card3_body: 'Excel Bloomberg, CSV Refinitiv, exports FactSet, bases de données internes: s\'il y a une colonne date et une colonne prix, Previsio le lit. Changez de fournisseur à tout moment sans modifier le système.',
    whats_next_label: "What's Next",
    whats_next_subtitle: 'Un aperçu de ce que nous construisons',
    whats_next_status: 'En développement',
    whats_next_items: [
    {
      title: 'Pondérations Adaptatives par Actif et Horizon',
      body: "Nous entraînons un modèle qui apprend — en fonction de la classe d'actifs et de l'horizon temporel — quels modèles de prévision ont historiquement le mieux performé, et adapte automatiquement les pondérations de chaque modèle pour chaque nouveau forecast. Le modèle nécessite de grands échantillons d'entraînement pour être efficace, et requiert donc du temps avant d'être intégré en production.",
      tag: 'IA · Modélisation'
    },
    {
      title: 'Cache de Calcul Cloud',
      body: 'Dans les déploiements qui le permettent, Previsio peut réutiliser des résultats déjà calculés pour réduire les temps d\'exécution sur des actifs, horizons et configurations récurrents. Le cache est configurable, désactivable et conçu pour respecter les contraintes de confidentialité du client.',
      tag: 'Performance'
    },
    {
      title: 'Modèle de Prévision Multivarié',
      body: 'Un nouveau modèle multivarié en cours de développement. Contrairement aux modèles existants, qui prévoient uniquement à partir de l\'historique des prix, ce modèle intégrera plusieurs variables d\'entrée — dont des indicateurs macroéconomiques, des données sectorielles et des métriques fondamentales — pour ancrer les trajectoires de prix à un ensemble plus large de facteurs.',
      tag: 'Modélisation'
    }],

    tt_eyebrow: 'Confiance · vérifiez par vous-même',
    tt_h2: 'Découvrez ce que Previsio aurait dit avant tout événement dont vous connaissez déjà l\'issue.',
    tt_lede: 'Choisissez n\'importe quelle date passée et le système relance chaque calcul exactement comme il l\'aurait fait ce jour-là — sans connaissance de ce qui s\'est passé ensuite. À la fin, comparez la prévision à ce qui s\'est réellement produit. Mêmes quatre sorties. Même journal de calcul. Vérifiable contre un résultat que vous connaissez déjà.',
    tt_step1_label: 'Choisissez une date passée',
    tt_step1_body: 'Choisissez n\'importe quelle date passée comme point de départ. Le système la traite comme aujourd\'hui et ne sait rien de ce qui s\'est passé après.',
    tt_step2_label: 'Seules les données passées entrent dans le calcul',
    tt_step2_body: 'Jusqu\'à huit modèles sont exécutés, selon l\'horizon et les données disponibles, en n\'utilisant que les données existant jusqu\'à la date choisie. Rien de ce qui suit n\'entre dans le calcul.',
    tt_step3_label: 'Comparaison avec la réalité',
    tt_step3_body: 'La prévision est affichée à côté de ce qui s\'est réellement passé. Vous voyez exactement où le modèle avait raison, où il avait tort, et de combien.',
    portfolio_eyebrow: 'Capacités avancées · Portefeuille',
    portfolio_h2: 'Une image complète du risque sur l\'ensemble d\'un panier d\'actifs.',
    portfolio_lede: 'Saisissez deux tickers ou plus. Previsio calcule la matrice de corrélation historique, la volatilité annualisée par actif et pour le portefeuille combiné, puis exécute des prévisions par ticker et les agrège en un rendement total attendu — le tout dans un rapport unifié.',
    portfolio_feat1_label: 'Matrice de corrélation',
    portfolio_feat1_body: 'Corrélation de Pearson sur les rendements logarithmiques, avec fréquence adaptative selon la fenêtre d\'observation : quotidienne sous 9 mois, hebdomadaire sous 4 ans, mensuelle au-delà.',
    portfolio_feat2_label: 'Volatilité annualisée',
    portfolio_feat2_body: 'Volatilité par ticker et au niveau du portefeuille issue de la matrice de covariance. Pondération equal-weight (1/N) ou personnalisée sommant à 100%.',
    portfolio_feat3_label: 'Contribution au risque',
    portfolio_feat3_body: 'Décomposition d\'Euler du risque de portefeuille : contribution absolue et en pourcentage par actif. Vous voyez exactement quel ticker pilote votre exposition.',
    portfolio_feat4_label: 'Ratio de diversification',
    portfolio_feat4_body: 'Volatilité moyenne pondérée des actifs divisée par la volatilité du portefeuille. Une valeur supérieure à 1 indique un bénéfice de diversification pour l\'allocation et la fenêtre historique analysées.',
    portfolio_feat5_label: 'Agrégation des prévisions',
    portfolio_feat5_body: 'Jusqu\'à huit modèles s\'exécutent par ticker séquentiellement, selon l\'horizon et l\'historique disponible pour chaque actif. Le rendement total attendu est la somme pondérée des rendements attendus par ticker ; l\'intervalle de prédiction est la combinaison linéaire pondérée des extrêmes des intervalles par ticker — les corrélations alimentent la volatilité et la contribution au risque, pas cet intervalle.',
    portfolio_feat6_label: 'Rapport unifié HTML + DOCX',
    portfolio_feat6_body: 'Un fichier couvrant les diagnostics historiques du risque, les prévisions par ticker et les perspectives agrégées du portefeuille — prêt pour la revue interne ou à joindre à joindre à une note de recherche.',
    ui_disclaimer: 'Les valeurs affichées sont uniquement illustratives et ne représentent pas une prévision réelle, une recommandation ou une performance historique certifiée. L\'interface peut différer de la version actuelle en raison des mises à jour continues de la plateforme.',
    footer_disclaimer: 'PAS DE CONSEIL FINANCIER. Previsio est une plateforme de recherche quantitative, de prévision statistique et de documentation d\'aide à la décision. Les résultats sont des estimations probabilistes basées sur des données historiques, des modèles statistiques et des paramètres sélectionnés par l\'utilisateur ; ils ne constituent pas un conseil en investissement, une recommandation personnalisée, une recherche indépendante certifiée ou une sollicitation à acheter ou vendre des instruments financiers. Les performances passées et les backtests historiques ne garantissent pas les résultats futurs. L\'utilisateur reste responsable de toutes les décisions d\'investissement.'
  },
  de: {
    splash_sub: 'Statistische Prognose, auf Ihrem Desktop',
    hero_eyebrow: 'Statistische Prognoseplattform für Finanzmärkte',
    hero_h1a: 'Der Prognosebericht',
    hero_h1b: 'ist bereits geschrieben.',
    hero_lede: 'Previsio verwandelt proprietäre Kurshistorien in quantitative Prognosen, kalibrierte Vorhersageintervalle und modellbasierte Wahrscheinlichkeiten — und liefert Ihnen einen strukturierten, für die interne Prüfung bereiten Bericht,ertig geschriebenen, präsentationsreifen Bericht. Jede Zahl ist nachvollziehbar, reproduzierbar und vom KI-Kommentar getrennt.',
    hero_cta1: 'Kostenlose Testphase anfordern',
    hero_disclaimer: 'Recherche- und Entscheidungsunterstützungs-Tool · keine Anlageberatung',
    hero_pillars: 'Präzision · Zuverlässigkeit · Komfort',
    hero_cta2: 'Anzeigen, was es produziert',
    stat_models: 'Modelle',
    stat_models_lab: 'Parallel',
    stat_speed_lab: 'Pro Prognose',
    stat_repro: 'Reproduzierbar',
    engine_eyebrow: 'So funktioniert es',
    engine_h2a: 'Eine geführte Konfiguration.',
    engine_h2b: 'Vier zentrale quantitative',
    engine_h2c: 'Ausgaben.',
    engine_lede: 'Sie konfigurieren ein Ticker, ein Zieldatum, die Analysetiefe und das Konfidenzniveau sowie optional einen Zielpreis, eine Schwellenrichtung, eine Preisspanne und ein Time-Travel-Referenzdatum. Das System liest die Historie aus dem von Ihnen gewählten Datensatz, lässt je nach Horizont und verfügbaren Daten bis zu acht Prognosemodelle parallel laufen, gewichtet sie nach ihren Ergebnissen auf diesem Asset und produziert vier berechnete Ausgaben: prognostizierter Preis, Vorhersageintervall, geschätzte Wahrscheinlichkeit bezogen auf die angegebene Schwelle und Wahrscheinlichkeit, dass der Schlusskurs innerhalb der definierten Spanne liegt. Bei gleichem Datensatz, gleichen Parametern und gleicher Engine-Version sind die Ausgaben reproduzierbar.',
    features_eyebrow: 'Was Sie erhalten',
    features_h2: 'Prognose, Intervalle, Wahrscheinlichkeiten und automatisierter Bericht. Ein auditierbarer Prozess.',
    analytics_eyebrow: 'Ausgaben',
    analytics_h2: 'Vier zentrale quantitative Ausgaben, plus ein optionaler Richtungsindikator.',
    analytics_lede: 'Jeder Lauf liefert separate, dokumentierte numerische Ausgaben: den prognostizierten Preis, das Vorhersageintervall, die Schwellenwahrscheinlichkeit am Zieldatum und die Schließen-Wahrscheinlichkeit in der Spanne. Die Schwellenwahrscheinlichkeit stammt aus der empirischen Verteilung der Prognosefehler; die direktionale Wahrscheinlichkeit, falls aktiviert, kommt von einem separaten Klassifikator und wird nur angezeigt, wenn sie ihre Validierungsschwellen besteht. Alle Ergebnisse werden im Bericht zusammen mit Diagnose, Modellgewichten und Berechnungsprotokoll konsolidiert.',
    methodology_eyebrow: 'Wie es rechnet',
    methodology_h2: 'Die Methode in einfachen Worten.',
    methodology_lede: 'Hier steht, was die Engine tatsächlich tut, um zu einer Zahl zu kommen, erklärt ohne Formeln. Jede Gleichung, jeder Schwellenwert und jeder Parameter dahinter steht im herunterladbaren technischen Dokument.',
    usecases_eyebrow: 'Wer es nutzt',
    usecases_h2: 'Gleiche Engine, vier professionelle Workflows.',
    dashboard_eyebrow: 'Produktvorschau',
    dashboard_h2: 'Die echte Produktoberfläche. Genau so, wie sie bei einer Prognose erscheint.',
    dashboard_lede: 'Eine Vorschau der grafischen Benutzeroberfläche der Plattform.',
    pricing_eyebrow: 'Preise',
    pricing_h2: 'Ein Preis, entwickelt in einem Gespräch.',
    pricing_lede: 'Keine Pakete zum Vergleichen, keine Selbstbedienungs-Stufen. Erzählen Sie uns von Ihrem Desk, und wir kommen mit einem passgenauen Angebot zurück — gemeinsam besprochen, bevor irgendetwas verbindlich wird.',
    pricing_statement: 'Jedes Angebot wird persönlich erstellt, nachdem wir Ihren tatsächlichen Bedarf verstanden haben.',
    pricing_starting: 'Ab 399€/Monat.',
    trust_eyebrow: 'Vertrauen · Sicherheit · Provenienz',
    trust_h2: 'Prognosen und Diagnosen, die zur Überprüfung, Archivierung und Diskussion konzipiert sind.',
    trust_lede: 'In einer Branche, in der Modelle driften und Abhängigkeiten sich still ändern, haben wir Previsio um ein Prinzip gebaut:',
    trust_lede_em: 'jede Ausgabe muss rekonstruierbar, nachprüfbar und diskutierbar sein',
    faq_eyebrow: 'FAQ',
    faq_h2: 'Häufig gestellte Fragen.',
    faq_duration_q: 'Wie lange dauert eine Prognose?',
    faq_duration_a: 'Die Dauer hängt von der Hardware, dem Horizont, dem Rechenprofil, der Menge des Verlaufs und den zugelassenen Modellen ab. Der Fortschritt wird in Echtzeit in der Oberfläche angezeigt.',
    cta_eyebrow: 'Zugriff anfordern',
    cta_h2a: 'Probieren Sie es',
    cta_h2b: 'auf Ihrem Ticker.',
    cta_lede: 'Ein 30-minütiges Gespräch, eine Beispielprognose auf dem ausgewählten Ticker und ein strukturierter, für die interne Prüfung bereiter Bericht, der am Ende auf Sie wartet — Sie schreiben keine Zeile davon. Keine Präsentation, kein Theater. Das echte Produkt, auf dem echten Asset.',
    cta_btn1: 'Kostenlose Testphase anfordern',
    cta_btn2: 'Methodologie herunterladen',
    perf_eyebrow: 'Validierung',
    perf_h2: 'Ergebnisse der Backtest-Performance',
    perf_lede: 'Ergebnisse von Tests, die mit der Previsio-Plattform über verschiedene Assets, Zeithorizonte und Methoden durchgeführt wurden. Die Daten zeigen die vom Engine in historischen Out-of-Sample-Simulationen erzielten Ergebnisse, durchgeführt mit Walk-Forward-Methodik und chronologischem Holdout.',
    perf_note: 'Ergebnisse aus historischen Backtests garantieren keine zukünftige Leistung. Tests wurden mit den Berechnungsmodi Standard und Deep durchgeführt, mit Walk-Forward-Methode und chronologischer Holdout-Validierung.',
    perf_mape: 'Mittlerer abs. % Fehler',
    perf_median: 'Medianer % Fehler',
    perf_directional: 'Richtungsgenauigkeit',
    perf_obs: 'Testbeobachtungen',
    perf_horizon: 'Getestete Horizonte',
    perf_pending: 'Ausstehend',
    perf_tbd: 'TBD',
    perf_horizons: '1T · 1W · 1M',
    nav_methodology: 'Methodologie',
    nav_request: 'Kostenlose Testphase',
    data_eyebrow: 'Ihre Daten · Ihre Kontrolle',
    data_h2a: 'Ihre Daten bleiben Ihre.',
    data_h2b: 'Wir bringen die Modelle.',
    data_lede: 'Previsio erfasst, leitet oder speichert keine Marktdaten. Laden Sie Ihre eigenen Preisdateien, heruntergeladen von Bloomberg, Refinitiv, FactSet oder einem beliebigen bereits genutzten Anbieter. Die Engine liest sie lokal und führt jede Berechnung auf Ihrer Infrastruktur aus.',
    data_card1_title: 'Datenqualitätskontrolle',
    data_card1_body: 'Die Kontrolle über die Quelle bleibt in Ihren Händen. Kein Drittanbieter-Feed, keine stillen Korrekturen, keine veralteten Daten. Die Daten, die in die Engine fließen, sind genau die, die Sie geprüft und freigegeben haben.',
    data_card2_title: 'Kontrollierte Datenverarbeitung',
    data_card2_body: 'In der Standardkonfiguration werden Marktdatensätze, quantitative Ergebnisse und der narrative Kommentar lokal verarbeitet. Ollama läuft auf dem Gerät des Kunden und übermittelt diese Inhalte nicht an externe KI-Anbieter. Technische Kommunikationen, die für separate Dienste wie die Lizenzaktivierung erforderlich sind, bleiben getrennt. Fordert der Kunde eine Cloud-KI-Konfiguration an, wird der entsprechende Datenfluss vor der Aktivierung separat definiert und dokumentiert.',
    data_card3_title: 'Kompatibel mit jedem Anbieter',
    data_card3_body: 'Bloomberg Excel, Refinitiv CSV, FactSet-Exporte, interne Datenbanken: wenn es eine Datumsspalte und eine Preisspalte hat, liest Previsio es. Wechseln Sie den Anbieter jederzeit, ohne das System anzupassen.',
    whats_next_label: "What's Next",
    whats_next_subtitle: 'Ein Blick auf das, was wir entwickeln',
    whats_next_status: 'In Entwicklung',
    whats_next_items: [
    {
      title: 'Adaptive Gewichte nach Asset und Horizont',
      body: 'Wir trainieren ein Modell, das — basierend auf Asset-Klasse und Zeithorizont — lernt, welche Prognosemodelle historisch am besten abgeschnitten haben, und passt die Gewichte automatisch für jeden neuen Forecast an. Das Modell benötigt große Trainingsmengen und braucht daher Zeit, bevor es in den Produktionsbetrieb integriert werden kann.',
      tag: 'KI · Modellierung'
    },
    {
      title: 'Cloud-Berechnungscache',
      body: 'In Deployments, die es erlauben, kann Previsio bereits berechnete Ergebnisse wiederverwenden, um die Ausführungszeiten bei wiederkehrenden Assets, Horizonten und Konfigurationen zu reduzieren. Der Cache ist konfigurierbar, deaktivierbar und darauf ausgelegt, die Vertraulichkeitsanforderungen des Kunden zu respektieren.',
      tag: 'Performance'
    },
    {
      title: 'Multivariates Prognosemodell',
      body: 'Ein neues multivariates Modell, das sich derzeit in der Entwicklung befindet. Im Gegensatz zu den bestehenden Modellen, die ausschließlich aus der Preishistorie prognostizieren, wird dieses Modell mehrere Eingabevariablen integrieren — darunter makroökonomische Indikatoren, Branchendaten und Fundamentalkennzahlen — um Preisentwicklungen an einem breiteren Treiberspektrum zu verankern.',
      tag: 'Modellierung'
    }],

    tt_eyebrow: 'Vertrauen · überzeugen Sie sich selbst',
    tt_h2: 'Sehen Sie, was Previsio vor jedem Ereignis gesagt hätte, dessen Ausgang Sie bereits kennen.',
    tt_lede: 'Wählen Sie ein beliebiges Datum in der Vergangenheit und das System führt jeden Berechnungsschritt genau so aus, wie es an diesem Tag gelaufen wäre — ohne jedes Wissen über spätere Ereignisse. Danach vergleichen Sie die Prognose mit dem tatsächlichen Verlauf. Dieselben vier Ausgaben. Dasselbe Berechnungsprotokoll. Überprüfbar gegen ein Ergebnis, das Sie bereits kennen.',
    tt_step1_label: 'Wählen Sie ein vergangenes Datum',
    tt_step1_body: 'Wählen Sie ein beliebiges vergangenes Datum als Ausgangspunkt. Das System behandelt es als heute und weiß nichts über spätere Ereignisse.',
    tt_step2_label: 'Nur vergangene Daten fließen in die Berechnung ein',
    tt_step2_body: 'Bis zu acht Modelle werden ausgeführt, je nach Horizont und verfügbaren Daten, und verwenden ausschließlich die Daten, die bis zum gewählten Datum vorlagen. Nichts Späteres fließt in die Berechnung ein.',
    tt_step3_label: 'Vergleich mit der Realität',
    tt_step3_body: 'Die Prognose wird neben dem tatsächlichen Verlauf angezeigt. Sie sehen genau, wo das Modell richtig lag, wo es falsch lag und um wie viel.',
    portfolio_eyebrow: 'Erweiterte Funktionen · Portfolio',
    portfolio_h2: 'Ein vollständiges Risikobild über einen gesamten Asset-Korb.',
    portfolio_lede: 'Geben Sie zwei oder mehr Ticker ein. Previsio berechnet die historische Korrelationsmatrix, die annualisierte Volatilität pro Asset und für das kombinierte Portfolio, führt Prognosen pro Ticker aus und aggregiert sie zu einer einzigen erwarteten Gesamtrendite — alles in einem einheitlichen Bericht.',
    portfolio_feat1_label: 'Korrelationsmatrix',
    portfolio_feat1_body: 'Pearson-Korrelation auf Log-Renditen mit adaptiver Frequenz: täglich unter 9 Monate, wöchentlich unter 4 Jahre, monatlich darüber.',
    portfolio_feat2_label: 'Annualisierte Volatilität',
    portfolio_feat2_body: 'Volatilität pro Ticker und auf Portfolioebene aus der Kovarianzmatrix. Gleichgewichtung (1/N) oder benutzerdefinierte Gewichte, die 100% ergeben müssen.',
    portfolio_feat3_label: 'Risikobeitrag',
    portfolio_feat3_body: 'Euler-Zerlegung des Portfolio-Risikos: absoluter und prozentualer Beitrag pro Asset. Sie sehen genau, welcher Ticker Ihr Exposure antreibt.',
    portfolio_feat4_label: 'Diversifikationsquotient',
    portfolio_feat4_body: 'Gewichtete durchschnittliche Asset-Volatilität geteilt durch Portfolio-Volatilität. Ein Wert über 1 zeigt einen Diversifikationsvorteil für die analysierte Allokation und den historischen Zeitraum an.',
    portfolio_feat5_label: 'Prognose-Aggregation',
    portfolio_feat5_body: 'Bis zu acht Modelle laufen pro Ticker sequenziell, je nach Horizont und verfügbarer Historie für jedes Asset. Die erwartete Gesamtrendite ist die gewichtete Summe der erwarteten Pro-Ticker-Renditen; das Vorhersageintervall ist die gewichtete lineare Kombination der Pro-Ticker-Intervallextrema — Korrelationen fließen in Volatilität und Risikobeitrag ein, nicht in dieses Intervall.',
    portfolio_feat6_label: 'Einheitlicher HTML + DOCX-Bericht',
    portfolio_feat6_body: 'Eine Datei mit historischer Risikodiagnostik, Prognosen pro Ticker und aggregiertem Portfolio-Ausblick — bereit für die interne Prüfung oder als Anhang zu einer Research-Note.',
    portfolio_scope_note: 'Der Portfolio-Modus optimiert Gewichte nicht automatisch und generiert keine Kauf- oder Verkaufssignale.',
    ui_disclaimer: 'Die gezeigten Werte sind ausschließlich illustrativ und stellen keine echte Prognose, Empfehlung oder zertifizierte historische Performance dar. Die Oberfläche kann aufgrund kontinuierlicher Plattform-Updates von der aktuellen Version abweichen.',
    footer_disclaimer: 'KEINE FINANZBERATUNG. Previsio ist eine Plattform für quantitative Forschung, statistisches Forecasting und Entscheidungsunterstützungsdokumentation. Ausgaben sind probabilistische Schätzungen auf Basis historischer Daten, statistischer Modelle und vom Nutzer gewählter Parameter; sie stellen keine Anlageberatung, keine personalisierte Empfehlung, keine zertifizierte unabhängige Recherche oder Aufforderung zum Kauf oder Verkauf von Finanzinstrumenten dar. Vergangene Wertentwicklung und historische Backtests garantieren keine zukünftigen Ergebnisse. Der Nutzer bleibt für alle Anlageentscheidungen verantwortlich.'
  }
};

const LanguageCtx = React.createContext();
/* Shared with Request.html — both pages read/write 'previsio_lang'
   ('previsioLang' kept as a read fallback for returning visitors). */
const LANG_KEY = 'previsio_lang';
const LANG_KEY_LEGACY = 'previsioLang';
function readStoredLang() {
  try {
    const s = localStorage.getItem(LANG_KEY) || localStorage.getItem(LANG_KEY_LEGACY);
    return ['en', 'it', 'fr', 'de'].includes(s) ? s : 'en';
  } catch (e) {return 'en';}
}
function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang);
  const switchLang = (l) => {
    setLang(l);
    try {localStorage.setItem(LANG_KEY, l);localStorage.setItem(LANG_KEY_LEGACY, l);} catch (e) {}
  };
  useEffect(() => {document.documentElement.lang = lang;}, [lang]);
  const t = (k) => T[lang]?.[k] || T.en[k] || k;
  return <LanguageCtx.Provider value={{ lang, setLang: switchLang, t }}>{children}</LanguageCtx.Provider>;
}
function useLanguage() {return React.useContext(LanguageCtx);}

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
      {...rest}>
      
      {children}
    </Tag>);

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
  const [activeId, setActiveId] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = React.useRef(null);

  const navLbl = {
    en: ['How It Works', 'Features', 'Outputs', 'Validation', 'For Whom', 'Dashboard', 'Pricing', 'About'],
    it: ['Come Funziona', 'Funzionalità', 'Risultati', 'Validazione', 'Per Chi', 'Dashboard', 'Piani', 'Chi siamo'],
    fr: ['Fonctionnement', 'Fonctionnalités', 'Résultats', 'Validation', 'Pour Qui', 'Dashboard', 'Tarifs', 'À propos'],
    de: ['Funktionsweise', 'Funktionen', 'Ergebnisse', 'Validierung', 'Für Wen', 'Dashboard', 'Preise', 'Über uns']
  };
  const nl = navLbl[lang] || navLbl.en;
  const links = [
  { href: '#engine', label: nl[0] },
  { href: '#features', label: nl[1] },
  { href: '#analytics', label: nl[2] },
  { href: '#validation', label: nl[3] },
  { href: '#use-cases', label: nl[4] },
  { href: '#dashboard', label: nl[5] },
  { href: '#pricing', label: nl[6] },
  { href: '#about', label: nl[7] }];


  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ['engine', 'features', 'analytics', 'validation', 'use-cases', 'dashboard', 'pricing', 'about'];
    const handleScroll = () => {
      const navH = 72;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= navH + 60) current = id;
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Delay first call so all sections are in DOM
    const t = setTimeout(handleScroll, 300);
    return () => {window.removeEventListener('scroll', handleScroll);clearTimeout(t);};
  }, []);

  React.useEffect(() => {
    const handler = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const langNames = { en: 'English', it: 'Italiano', fr: 'Français', de: 'Deutsch' };

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#top">
            <img src='logo-full.png' alt="Previsio" className="nav-logo" style={{ height: 140 }} />
          </a>
          <div className="nav-links">
            {links.map((l, idx) => {
              const id = l.href.slice(1);
              return (
                <a className={`nav-link${activeId === id ? ' nav-link-active' : ''}`} key={`nav-${idx}`} href={l.href}>
                  {l.label}
                </a>);

            })}
          </div>
          <div className="nav-cta">
            <div className="lang-dropdown" ref={langRef}>
              <button className="lang-dropdown-btn" onClick={() => setLangOpen(!langOpen)}>
                {lang.toUpperCase()}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 6, transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'rotate(0)' }}><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {langOpen && (
                <div className="lang-dropdown-menu">
                  {['en', 'it', 'fr', 'de'].map((l) => (
                    <button key={`ld-${l}`} className={`lang-dropdown-item${lang === l ? ' active' : ''}`} onClick={() => { setLang(l); setLangOpen(false); }}>
                      <span style={{ fontWeight: 600, width: 24, display: 'inline-block' }}>{l.toUpperCase()}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>{langNames[l]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a className="btn btn-gold" href="Request.html#trial">{t('nav_request')} <span className="arrow">→</span></a>
            <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
              <span className="mono" style={{ fontSize: 13 }}>{open ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map((l, idx) => {
          const id = l.href.slice(1);
          return (
            <a key={`mob-${idx}`} href={l.href} onClick={() => setOpen(false)}
            style={activeId === id ? { color: 'var(--gold-primary)' } : {}}>
              {l.label}
            </a>);

        })}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(212,175,55,0.2)' }}>
          <select className="lang-mobile-select" value={lang} onChange={(e) => { setLang(e.target.value); setOpen(false); }}>
            {['en', 'it', 'fr', 'de'].map((l) => (
              <option key={`lm-${l}`} value={l}>{l.toUpperCase()} — {{ en: 'English', it: 'Italiano', fr: 'Français', de: 'Deutsch' }[l]}</option>
            ))}
          </select>
        </div>
        <a href="Request.html#trial" onClick={() => setOpen(false)} style={{ color: 'var(--gold-primary)' }}>{t('nav_request')} →</a>
      </div>
    </>);

}

/* ============================================================
   HERO — animated forecast preview
   ============================================================ */
function HeroChart() {
  const { lang } = useLanguage();
  // animate the forecast path drawing in
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  // generate a deterministic-looking price + forecast band
  const W = 480,H = 240,P = 20;
  const N = 60; // historic points
  const F = 24; // forecast points
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

  const x = (i) => P + i / (total - 1) * (W - 2 * P);
  const y = (val) => H - P - (val - min) / (max - min) * (H - 2 * P);

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
    const gy = P + i / 5 * (H - 2 * P);
    grid.push(<line key={i} className="gridline" x1={P} x2={W - P} y1={gy} y2={gy} />);
  }

  const fcLen = 600;

  return (
    <svg viewBox={`-30 0 ${W + 30} ${H + 16}`} width="100%" style={{ display: 'block' }}>
      {/* Axis lines */}
      <line x1={P} x2={P} y1={P} y2={H - P} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {grid}
      {/* PI band */}
      <path d={bandPath} fill="rgba(212,175,55,0.10)" stroke="none"
      style={{ opacity: drawn ? 1 : 0, transition: 'opacity 1.2s ease 0.4s' }} />
      {/* PI edges */}
      <polyline
        fill="none" stroke="rgba(212,175,55,0.5)" strokeDasharray="3 3" strokeWidth="1"
        points={up.map((q) => `${q.x},${q.y}`).join(' ')}
        style={{ opacity: drawn ? 0.7 : 0, transition: 'opacity 1s ease 0.5s' }} />
      
      <polyline
        fill="none" stroke="rgba(212,175,55,0.5)" strokeDasharray="3 3" strokeWidth="1"
        points={dn.map((q) => `${q.x},${q.y}`).join(' ')}
        style={{ opacity: drawn ? 0.7 : 0, transition: 'opacity 1s ease 0.5s' }} />
      
      {/* dispersion */}
      {dispersion.map((line, i) =>
      <polyline
        key={i}
        fill="none" stroke="rgba(126,184,218,0.45)" strokeWidth="0.9"
        points={line.map((q) => `${q.x},${q.y}`).join(' ')}
        style={{ opacity: drawn ? 0.65 : 0, transition: `opacity 0.8s ease ${0.7 + i * 0.1}s` }} />

      )}
      {/* cutoff */}
      <line className="cut" x1={cutX} x2={cutX} y1={P} y2={H - P}
      style={{ opacity: drawn ? 0.5 : 0, transition: 'opacity 0.7s ease 0.2s' }} />

      {/* historic */}
      <path d={histPath} fill="none" stroke="rgba(234,234,234,0.85)" strokeWidth="1.4"
      strokeDasharray="700"
      strokeDashoffset={drawn ? 0 : 700}
      style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.6,.2,.2,1)' }} />
      
      {/* forecast */}
      <path d={fcPath} fill="none" stroke="var(--gold-primary)" strokeWidth="2"
      strokeDasharray={fcLen}
      strokeDashoffset={drawn ? 0 : fcLen}
      style={{ transition: 'stroke-dashoffset 1.1s ease 0.9s', filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))' }} />
      
      {/* terminal point */}
      <circle cx={x(total - 1)} cy={y(fc[fc.length - 1])} r="4" fill="var(--gold-primary)"
      style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.4s ease 1.9s', filter: 'drop-shadow(0 0 8px var(--gold-glow))' }} />

      {/* Y axis ticks */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const yy = P + t * (H - 2 * P);
        const val = (max - t * (max - min)).toFixed(0);
        return (
          <text key={`y${i}`} x={P - 6} y={yy + 3} textAnchor="end" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="10">{val}</text>);

      })}
      {/* X axis labels */}
      <text x={x(0)} y={H - P + 13} textAnchor="start" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="10">2025</text>
      <text x={x(N - 1)} y={H - P + 13} textAnchor="middle" fill="var(--gold-dim)" fontFamily="var(--font-mono)" fontSize="10">{{ en: 'TODAY', it: 'OGGI', fr: "AUJ.", de: 'HEUTE' }[lang]}</text>
      <text x={x(total - 1)} y={H - P + 13} textAnchor="end" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="10">2026</text>
    </svg>);

}

/* ============================================================
   AUDIENCE STRIP — one-liner identity row below hero
   ============================================================ */
function AudienceStrip() {
  const { lang } = useLanguage();
  const roles = {
    en: ['Portfolio Managers', 'Quantitative Analysts', 'Advisory Desks', 'Research Desks', 'Family Offices'],
    it: ['Portfolio Manager', 'Analisti Quantitativi', 'Advisory Desk', 'Research Desk', 'Family Office'],
    fr: ['Gestionnaires de Portefeuille', 'Analystes Quantitatifs', 'Advisory Desks', 'Research Desks', 'Family Offices'],
    de: ['Portfoliomanager', 'Quantitative Analysten', 'Advisory Desks', 'Research Desks', 'Family Offices']
  };
  const builtFor = { en: 'Built for', it: 'Progettato per', fr: 'Conçu pour', de: 'Konzipiert für' };
  const list = roles[lang] || roles.en;
  return (
    <div style={{
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(212,175,55,0.015)',
      padding: '13px 0',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-dim)', letterSpacing: '0.24em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{builtFor[lang] || builtFor.en} →</span>
        {list.map((role, i) =>
        <React.Fragment key={role}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{role}</span>
            {i < list.length - 1 && <span style={{ color: 'var(--border-strong)', fontSize: 13 }}>·</span>}
          </React.Fragment>
        )}
      </div>
    </div>);

}

function Hero() {
  const { lang, t } = useLanguage();
  const models = ['SARIMA', 'PROPHET', 'TBATS', 'ETS', 'THETA', 'LGBM', 'CATB', 'NBEATS'];
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <Reveal delay="0">
            <p
              style={{
                margin: '0 0 14px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                fontSize: 'clamp(15px, 1.6vw, 19px)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold-light)',
                textShadow: '0 0 24px rgba(212,175,55,0.35)'
              }}>
              {t('hero_pillars')}
            </p>
          </Reveal>
          <Reveal as="h1" className="display" style={{ fontSize: '55px' }} delay="1">
            <>
              {{ en: 'Quantitative ', it: 'Piattaforma di ', fr: "Plateforme d'", de: 'Plattform für quantitative ' }[lang] || 'Quantitative '}
              <span style={{ color: '#826a22', fontWeight: 700 }}>intelligence</span>
              {{ en: ' platform for financial markets.', it: ' quantitativa per mercati finanziari.', fr: ' quantitative pour les marchés financiers.', de: ' für Finanzmärkte.' }[lang]}
              <br />
              <span style={{ color: '#826a22', fontWeight: 700 }}>Forecast</span>
              {', '}
              {{ en: 'prediction ', it: '', fr: '', de: '' }[lang]}
              <span style={{ color: '#826a22', fontWeight: 700 }}>{{ en: 'intervals', it: 'intervalli', fr: 'intervalles', de: 'Vorhersageintervalle' }[lang]}</span>
              {{ en: ' and automatic ', it: ' di predizione e ', fr: ' de prédiction et ', de: ' und automatische ' }[lang]}
              <span style={{ color: '#826a22', fontWeight: 700 }}>{{ en: 'reports', it: 'report', fr: 'rapports', de: 'Berichte' }[lang]}</span>
              {{ en: ' generated from ', it: ' automatici generati dai ', fr: ' automatiques depuis ', de: ' aus ' }[lang]}
              <span style={{ color: '#826a22', fontWeight: 700 }}>{{ en: 'your data', it: 'vostri dati', fr: 'vos données', de: 'Ihren Daten' }[lang]}</span>
              {{ en: '', it: '', fr: '', de: ' generiert' }[lang]}
            </>
          </Reveal>
          <Reveal as="p" className="lede" delay="2">
            {t('hero_lede')}
          </Reveal>
          <Reveal className="hero-actions" delay="3">
            <a className="btn btn-gold btn-lg" href="Request.html#trial">{t('hero_cta1')} <span className="arrow">→</span></a>
            <a className="btn btn-ghost btn-lg" href="#engine">{t('hero_cta2')}</a>
          </Reveal>
          <Reveal as="p" delay="4" style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {t('hero_disclaimer')}
          </Reveal>
          <Reveal delay="5">
            <div className="hero-meta">
              <div className="hero-stat">
                <div className="num">8<span className="unit">×</span></div>
                <div className="lab">{t('stat_models')}</div>
                <div className="lab" style={{ color: 'var(--text-faint)', fontSize: 13, marginTop: 1, letterSpacing: '0.12em' }}>{t('stat_models_lab')}</div>
              </div>
              <div className="hero-stat">
              <div
                className="num"
                style={{
                  fontSize: 38,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  whiteSpace: 'nowrap'
                }}
              >
                Report
              </div>

              <div
                className="lab"
                style={{
                  color: 'var(--gold-primary)',
                  fontSize: 12,
                  marginTop: 10,
                  letterSpacing: '0.22em'
                }}
              >
                {{ en: 'AUTO-GENERATED', it: 'AUTO-GENERATO', fr: 'AUTO-GÉNÉRÉ', de: 'AUTO-GENERIERT' }[lang]}
              </div>

              <div
                className="lab"
                style={{
                  color: 'var(--text-faint)',
                  fontSize: 13,
                  marginTop: 6,
                  letterSpacing: '0.12em'
                }}
              >
                {{ en: 'Forecast · diagnostics · log', it: 'Forecast · diagnostica · log', fr: 'Forecast · diagnostic · log', de: 'Forecast · Diagnostik · Log' }[lang]}
              </div>
            </div>

            </div>
          </Reveal>
        </div>

        <Reveal delay="2" variant="right">
          <div className="panel forecast-panel">
            <div className="fp-head">
              <div>
                <div className="fp-title">AAPL · {{ en: 'forecast preview', it: 'anteprima previsione', fr: 'aperçu prévision', de: 'Prognosevorschau' }[lang]}</div>
                <div className="fp-sub">Target 218d · Range 80%</div>
              </div>
              <div className="fp-tag">{{ en: 'REPORT STRUCTURED', it: 'REPORT STRUTTURATO', fr: 'RAPPORT STRUCTURÉ', de: 'BERICHT STRUKTURIERT' }[lang]}</div>
            </div>

            <HeroChart />

            <div className="fp-kpis" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="fp-kpi gold">
                <div className="l">{{ en: 'Predicted price', it: 'Prezzo previsto', fr: 'Prix prévu', de: 'Prognostizierter Preis' }[lang]}</div>
                <div className="v">$248.40</div>
              </div>
              <div className="fp-kpi">
                <div className="l">{{ en: 'Prediction interval 80%', it: 'Intervallo di predizione 80%', fr: 'Intervalle de prédiction 80%', de: 'Prognoseintervall 80%' }[lang]}</div>
                <div className="v">$211 – $282</div>
              </div>
              <div className="fp-kpi">
                <div className="l">P({{ en: 'price', it: 'prezzo', fr: 'prix', de: 'Preis' }[lang]} ≥ $260)</div>
                <div className="v">64%</div>
              </div>
              <div className="fp-kpi">
                <div className="l">P({{ en: 'in range', it: 'nel range', fr: 'dans la fourchette', de: 'in Spanne' }[lang]} $240–$270)</div>
                <div className="v">41%</div>
              </div>
            </div>

            <div className="chips">
              {models.map((m, i) =>
              <span key={m} className={`chip ${i < 6 ? 'active' : ''}`}>{m}</span>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay="3" style={{ gridColumn: '1 / -1' }}>
          <div style={{
            marginTop: 14,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-faint)',
            letterSpacing: '0.06em',
            lineHeight: 1.5,
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            {t('ui_disclaimer')}
          </div>
        </Reveal>
        {/* Scroll cue */}

      </div>
    </section>);

}

/* ============================================================
   ENGINE — 9 models + pipeline
   ============================================================ */
function ModelsPipeline() {
  const { lang, t } = useLanguage();
  const typeT = {
    'Statistical': { en: 'Statistical', it: 'Statistico', fr: 'Statistique', de: 'Statistisch' },
    'Additive decomposition': { en: 'Additive decomposition', it: 'Decomposizione additiva', fr: 'Décomposition additive', de: 'Additive Zerlegung' },
    'State-space': { en: 'State-space', it: 'Spazio di stato', fr: 'Espace d\'état', de: 'Zustandsraum' },
    'Error-Trend-Seasonal': { en: 'Error-Trend-Seasonal', it: 'Errore-Trend-Stagionale', fr: 'Erreur-Tendance-Saisonnière', de: 'Fehler-Trend-Saisonal' },
    'Trend extrapolation': { en: 'Trend extrapolation', it: 'Estrapolazione del trend', fr: 'Extrapolation de tendance', de: 'Trendextrapolation' },
    'Gradient boosting': { en: 'Gradient boosting', it: 'Gradient boosting', fr: 'Gradient boosting', de: 'Gradient Boosting' },
    'Deep learning': { en: 'Deep learning', it: 'Deep learning', fr: 'Apprentissage profond', de: 'Deep Learning' }
  };
  const horizonT = {
    'Short': { en: 'Short', it: 'Breve', fr: 'Court', de: 'Kurz' },
    'Medium': { en: 'Medium', it: 'Medio', fr: 'Moyen', de: 'Mittel' },
    'Long': { en: 'Long', it: 'Lungo', fr: 'Long', de: 'Lang' }
  };
  const tType = (key) => typeT[key]?.[lang] || typeT[key]?.en || key;
  const tHorizon = (key) => horizonT[key]?.[lang] || horizonT[key]?.en || key;

  const models = [
  { name: 'SARIMA', type: 'Statistical', horizons: ['Short', 'Medium'] },
  { name: 'PROPHET', type: 'Additive decomposition', horizons: ['Short', 'Medium', 'Long'] },
  { name: 'TBATS', type: 'State-space', horizons: ['Short', 'Medium', 'Long'] },
  { name: 'ETS', type: 'Error-Trend-Seasonal', horizons: ['Short', 'Medium', 'Long'] },
  { name: 'THETA', type: 'Trend extrapolation', horizons: ['Short', 'Medium', 'Long'] },
  { name: 'LGBM', type: 'Gradient boosting', horizons: ['Short', 'Medium'] },
  { name: 'CATB', type: 'Gradient boosting', horizons: ['Short', 'Medium'] },
  { name: 'NBEATS', type: 'Deep learning', horizons: ['Short', 'Medium', 'Long'] }];


  const stagesByLang = {
    en: [
    ['Load the data', 'Read the asset price history. Repair splits and isolated anomalies.'],
    ['Read the horizon', 'Pick the right frequency (daily, weekly, monthly) based on how far you\'re forecasting.'],
    ['Weight the models', 'Test each model on the asset\'s past. The better ones get more weight.'],
    ['Run the forecasts', 'Up to eight models produce a forecast in parallel, depending on the horizon and available history. Negative-price outputs are rejected.'],
    ['Build the range', 'Calculate upper and lower bounds from the asset\'s own forecast errors.'],
    ['Compute probabilities', 'Two probability outputs: the probability that the closing price on the target date meets the selected threshold condition (≥ or ≤), and the probability that it falls within a price range you define — both with a conservative floor.'],
    ['Bundle the answer', 'All four computed outputs — predicted price, prediction interval, threshold probability, range closing probability — plus diagnostics, compiled into a single results package.'],
    ['Write the commentary', 'AI writes the narrative paragraphs for the report. Never a source of numbers.'],
    ['Generate the report', 'DOCX investment memo with charts and KPIs · 4 languages.']],

    it: [
    ['Caricare i dati', 'Lettura dello storico prezzi dell\'asset. Riparazione di split e anomalie isolate.'],
    ['Leggere l\'orizzonte', 'Selezione della frequenza corretta (giornaliera, settimanale, mensile) in base all\'orizzonte di previsione.'],
    ['Pesare i modelli', 'Test di ogni modello sullo storico dell\'asset. Quelli migliori ottengono più peso.'],
    ['Eseguire le previsioni', 'Fino a otto modelli producono una previsione in parallelo, in base all\'orizzonte e allo storico disponibile.'],
    ['Costruire il range', 'Calcolo del limite superiore e inferiore dagli errori di previsione dell\'asset.'],
    ['Calcolare le probabilità', 'Due output probabilistici: la probabilità che il prezzo di chiusura alla data obiettivo soddisfi la condizione di soglia selezionata (≥ oppure ≤), e la probabilità che sia compreso nel range di prezzo definito — entrambi con un floor conservativo.'],
    ['Assemblare la risposta', 'Tutti e quattro gli output calcolati — prezzo previsto, intervallo di predizione, probabilità di soglia, probabilità di chiusura nel range — più diagnostica, compilati in un unico pacchetto di risultati.'],
    ['Scrivere il commento', 'L\'AI scrive i paragrafi narrativi per il report. Mai una fonte di numeri.'],
    ['Generare il report', 'Research memo DOCX con forecast, diagnostica e grafici · 4 lingue.']],

    fr: [
    ['Charger les données', 'Lecture de l\'historique des prix de l\'actif. Réparation des splits et anomalies isolées.'],
    ['Lire l\'horizon', 'Sélection de la bonne fréquence (quotidienne, hebdomadaire, mensuelle) selon la portée de la prévision.'],
    ['Pondérer les modèles', 'Test de chaque modèle sur le passé de l\'actif. Les meilleurs obtiennent plus de poids.'],
    ['Lancer les prévisions', 'Jusqu\'à huit modèles produisent une prévision en parallèle, selon l\'horizon et l\'historique disponible. Les résultats à prix négatif sont rejetés.'],
    ['Construire la fourchette', 'Calcul des bornes haute et basse à partir des erreurs de prévision de l\'actif.'],
    ['Calculer les probabilités', 'Deux sorties probabilistes : la probabilité que le prix de clôture à la date cible remplisse la condition de seuil sélectionnée (≥ ou ≤), et la probabilité qu\'il soit compris dans la fourchette définie — avec un plancher conservateur.'],
    ['Assembler la réponse', 'Les quatre résultats calculés — prix prévu, intervalle de prédiction, probabilité de seuil, probabilité de clôture dans la fourchette — plus diagnostics, compilés en un seul package de résultats.'],
    ['Rédiger le commentaire', 'L\'IA rédige les paragraphes narratifs du rapport. Jamais une source de chiffres.'],
    ['Générer le rapport', 'Mémo d\'investissement DOCX avec graphiques et KPIs · 4 langues.']],

    de: [
    ['Daten laden', 'Lesen der Asset-Preishistorie. Reparatur von Splits und isolierten Anomalien.'],
    ['Horizont lesen', 'Auswahl der richtigen Frequenz (täglich, wöchentlich, monatlich) basierend auf dem Prognosehorizont.'],
    ['Modelle gewichten', 'Jedes Modell wird auf der Vergangenheit des Assets getestet. Die besseren erhalten mehr Gewicht.'],
    ['Prognosen ausführen', 'Bis zu acht Modelle erstellen parallel eine Prognose, je nach Horizont und verfügbarer Historie. Negative Preisausgaben werden verworfen.'],
    ['Spanne berechnen', 'Berechnung von Ober- und Untergrenzen aus den Prognosefehlern des Assets.'],
    ['Wahrscheinlichkeiten berechnen', 'Zwei Wahrscheinlichkeitsausgaben: die Wahrscheinlichkeit, dass der Schlusskurs am Zieldatum die gewählte Schwellenbedingung erfüllt (≥ oder ≤), und die Wahrscheinlichkeit, dass er innerhalb der definierten Preisspanne liegt — beide mit konservativem Minimum.'],
    ['Antwort bündeln', 'Alle vier berechneten Ausgaben — Prognospreis, Prognoseintervall, Schwellenwahrscheinlichkeit, Schließen-Wahrscheinlichkeit in der Spanne — plus Diagnostik, in einem Ergebnispaket zusammengefasst.'],
    ['Kommentar verfassen', 'KI schreibt die narrativen Absätze für den Bericht. Niemals eine Quelle für Zahlen.'],
    ['Bericht generieren', 'DOCX-Investment-Memo mit Grafiken und KPIs · 4 Sprachen.']]

  };
  const stages = stagesByLang[lang] || stagesByLang.en;

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
                <span>{{ en: 'Model', it: 'Modello', fr: 'Modèle', de: 'Modell' }[lang]}</span>
                <span>{{ en: 'Type', it: 'Tipo', fr: 'Type', de: 'Typ' }[lang]}</span>
                <span>{{ en: 'Allowed Horizons', it: 'Orizzonti consentiti', fr: 'Horizons autorisés', de: 'Erlaubte Horizonte' }[lang]}</span>
              </div>
              {models.map((m, i) =>
              <Bar key={m.name} idx={i + 1} name={m.name} type={tType(m.type)} horizons={m.horizons.map(tHorizon)} />
              )}
            </div>
            <div style={{
              marginTop: 18,
              padding: '14px 18px',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              lineHeight: 1.6
            }}>
              {{ en: 'Weights shown are illustrative (AAPL, 218-day target). Models without enough history are auto-excluded; the rest rebalance.', it: 'I pesi mostrati sono illustrativi (AAPL, target 218 giorni). I modelli senza storico sufficiente vengono esclusi automaticamente; gli altri si ribilanciano.', fr: 'Les poids affichés sont illustratifs (AAPL, cible 218 jours). Les modèles sans historique suffisant sont exclus automatiquement ; les autres se rééquilibrent.', de: 'Die angezeigten Gewichte sind illustrativ (AAPL, 218-Tage-Ziel). Modelle ohne ausreichende Historie werden automatisch ausgeschlossen; die übrigen gleichen sich aus.' }[lang]}
            </div>
          </Reveal>

          {/* Pipeline stages */}
          <Reveal delay="1" variant="right">
            <div className="small-cap-rule">{{ en: 'The flow · 9 steps per forecast', it: 'Il flusso · 9 step per previsione', fr: 'Le flux · 9 étapes par prévision', de: 'Der Ablauf · 9 Schritte pro Prognose' }[lang]}</div>
            <div className="stages">
              {stages.map(([name, desc], i) =>
              <div className="stage" key={name}>
                  <div className="stage-num">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="stage-name">{name}</div>
                    <div className="stage-desc">{desc}</div>
                  </div>
                  <div className="stage-tick">✓</div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

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
  return (
    <div className="model-row" ref={ref}>
      <span className="num">{String(idx).padStart(2, '0')}</span>
      <span className="name">{name}</span>
      <span className="type">{type}</span>
      <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {horizons.map((h) =>
        <span key={h} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          padding: '3px 7px',
          borderRadius: 4,
          background: 'rgba(255,255,255,0.04)',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          border: '1px solid rgba(255,255,255,0.08)',
          whiteSpace: 'nowrap'
        }}>{h}</span>
        )}
      </span>
    </div>);

}

/* ============================================================
   FEATURES grid
   ============================================================ */
function Features() {
  const { lang, t } = useLanguage();
  const feats = {
    en: [
    ['A predicted price', 'The headline number: where the engine thinks the asset will be on your target date. A single, weighted answer from the compatible models run, not the loudest of them.'],
    ['A prediction interval', 'Every forecast comes with an upper and a lower bound — measured from how far past forecasts on this exact asset have actually missed. Not a textbook bell curve.'],
    ['Threshold probability on the target date', 'Set a target price and a direction (≥ or ≤). The engine returns the probability that the closing price on the target date meets that condition, with a deliberately conservative lower bound — a closing-price probability, not the probability of touching the target beforehand.'],
    ['Range closing probability', 'Define a lower and upper price bound. The engine returns the probability that the closing price on the target date falls within your range — the fourth computed output.'],
    ['Up to eight models in parallel', 'A mix of classical statistical models, gradient boosting and deep learning, run when compatible with the horizon and history. No single approach dominates — the combination is the product.'],
    ['Weights earned on the asset', 'Each model\'s weight comes from how it actually performed on the past of the asset you\'re forecasting. Recent performance and long-run track record are blended.'],
    ['Time-travel replay', 'Set the reference date in the past and rerun the engine blind. Useful to see what the platform would have said before a known event happened.'],
    ['Your data, your source, your control', 'In the standard configuration, market files, quantitative calculations and the Ollama-generated commentary are processed locally. If a cloud configuration is requested, the related data flow is defined and documented separately.'],
    ['Reproducible by design', 'Given the same dataset, parameters and engine version, Previsio produces the same quantitative outputs — a requirement for research you can defend later.'],
    ['Directional classifier probability', 'Is the price going up or down versus the last close in the dataset — not versus your chosen target? A logistic classifier trained on the ensemble\'s own walk-forward history answers with a calibrated probability — validated on a purged chronological holdout, published only when it clears accuracy and sample-size gates.']],

    it: [
    ['Un prezzo previsto', 'La stima centrale del motore per la data obiettivo, calcolata dall\'ensemble ponderato dei modelli disponibili.'],
    ['Un intervallo di predizione', 'Ogni previsione include un limite superiore e uno inferiore — misurati da quanto le previsioni passate su questo stesso asset hanno effettivamente sbagliato. Non una curva a campana da manuale.'],
    ['Probabilità di soglia alla data obiettivo', 'Impostate un prezzo target e una direzione (≥ o ≤). Il motore restituisce la probabilità che il prezzo di chiusura alla data obiettivo soddisfi quella condizione, con un floor deliberatamente conservativo — una probabilità di chiusura, non di tocco del target prima della data.'],
    ['Probabilità di chiusura nel range', 'Definite un prezzo minimo e massimo. Il motore restituisce la probabilità che il prezzo di chiusura alla data obiettivo sia compreso nel vostro range — il quarto output calcolato.'],
    ['Fino a otto modelli in parallelo', 'Un mix di modelli statistici classici, gradient boosting e deep learning, eseguiti quando compatibili con orizzonte e storico. Nessun singolo approccio domina — la combinazione è il prodotto.'],
    ['Pesi guadagnati sull\'asset', 'Il peso di ogni modello deriva dalla sua effettiva performance sullo storico dell\'asset in previsione. Performance recente e track record di lungo periodo vengono bilanciati.'],
    ['Replay time-travel', 'Impostate la data di riferimento nel passato e rieseguite il motore alla cieca. Utile per verificare cosa avrebbe detto la piattaforma prima di un evento noto.'],
    ['I vostri dati, la vostra fonte, il vostro controllo', 'Nella configurazione standard, i file di mercato, i calcoli quantitativi e il commento generato tramite Ollama vengono elaborati localmente. Qualora venga richiesta una configurazione cloud, il relativo flusso dati viene definito e documentato separatamente.'],
    ['Riproducibile per costruzione', 'A parità di dataset, parametri e versione del motore, Previsio produce gli stessi output quantitativi — un requisito per una ricerca difendibile nel tempo.'],
    ['Probabilità direzionale del classificatore', 'Un classificatore direzionale stima la probabilità che il prezzo di chiusura sia superiore o inferiore all\'ultima chiusura del dataset — non alla soglia che inserite voi. Il risultato viene mostrato solo quando supera i controlli minimi di campione, accuratezza e stabilità previsti dal motore.']],

    fr: [
    ['Un prix prévu', 'Le chiffre principal : où le moteur pense que l\'actif sera à votre date cible. Une seule réponse pondérée des modèles compatibles exécutés, pas la plus bruyante.'],
    ['Un intervalle de prédiction', 'Chaque prévision inclut une borne haute et basse — mesurées à partir des écarts réels des prévisions passées sur cet actif précis. Pas une courbe en cloche théorique.'],
    ['Probabilité de seuil à la date cible', 'Définissez un prix cible et une direction (≥ ou ≤). Le moteur retourne la probabilité que le prix de clôture à la date cible remplisse cette condition, avec un plancher délibérément conservateur — une probabilité de clôture, pas de contact préalable avec la cible.'],
    ['Probabilité de clôture dans la fourchette', 'Définissez un prix plancher et plafond. Le moteur retourne la probabilité que le prix de clôture à la date cible soit compris dans votre fourchette — la quatrième sortie calculée.'],
    ['Jusqu\'à huit modèles en parallèle', 'Un mix de modèles statistiques classiques, gradient boosting et deep learning, exécutés lorsqu\'ils sont compatibles avec l\'horizon et l\'historique. Aucune approche ne domine — la combinaison est le produit.'],
    ['Poids gagnés sur l\'actif', 'Le poids de chaque modèle provient de sa performance réelle sur le passé de l\'actif. Performance récente et historique long terme sont mélangés.'],
    ['Replay voyage dans le temps', 'Placez la date de référence dans le passé et relancez le moteur à l\'aveugle. Utile pour voir ce que la plateforme aurait dit avant un événement connu.'],
    ['Vos données, votre source, votre contrôle', 'Dans la configuration standard, les fichiers de marché, les calculs quantitatifs et le commentaire généré via Ollama sont traités localement. Si une configuration cloud est demandée, le flux de données correspondant est défini et documenté séparément.'],
    ['Reproductible par conception', 'À dataset, paramètres et version du moteur identiques, Previsio produit les mêmes sorties quantitatives — une exigence pour une recherche défendable dans le temps.'],
    ['Probabilité directionnelle du classificateur', 'Le prix va-t-il monter ou baisser par rapport à la dernière clôture du jeu de données — pas par rapport à votre cible ? Un modèle supplémentaire qui répond à cette question avec une probabilité fiable — testé dans le temps et publié uniquement quand il fonctionne vraiment.']],

    de: [
    ['Ein prognostizierter Preis', 'Die Kernzahl: wo die Engine den Asset-Preis am Zieldatum erwartet. Eine einzige, gewichtete Antwort aus den kompatibel ausgeführten Modellen, nicht die lauteste.'],
    ['Ein Prognoseintervall', 'Jede Prognose enthält eine Ober- und Untergrenze — gemessen daran, wie weit vergangene Prognosen auf genau diesem Asset tatsächlich danebenlagen. Keine Lehrbuch-Glockenkurve.'],
    ['Schwellenwahrscheinlichkeit am Zieldatum', 'Legen Sie einen Zielpreis und eine Richtung fest (≥ oder ≤). Die Engine liefert die Wahrscheinlichkeit, dass der Schlusskurs am Zieldatum diese Bedingung erfüllt, mit einem bewusst konservativen Minimum — eine Schlusskurs-Wahrscheinlichkeit, kein vorheriges Berühren des Ziels.'],
    ['Schließen-Wahrscheinlichkeit in der Spanne', 'Definieren Sie eine Unter- und Obergrenze. Die Engine liefert die Wahrscheinlichkeit, dass der Schlusskurs am Zieldatum innerhalb Ihrer Spanne liegt — die vierte berechnete Ausgabe.'],
    ['Bis zu acht Modelle parallel', 'Eine Mischung aus klassischen statistischen Modellen, Gradient Boosting und Deep Learning, ausgeführt, wenn mit Horizont und Historie kompatibel. Kein einzelner Ansatz dominiert — die Kombination ist das Produkt.'],
    ['Auf dem Asset verdiente Gewichte', 'Das Gewicht jedes Modells ergibt sich aus seiner tatsächlichen Performance auf der Vergangenheit des Assets. Aktuelle Performance und langfristige Erfolgsbilanz werden gemischt.'],
    ['Zeitreise-Replay', 'Setzen Sie das Referenzdatum in die Vergangenheit und führen Sie die Engine blind erneut aus. Nützlich um zu sehen, was die Plattform vor einem bekannten Ereignis gesagt hätte.'],
    ['Ihre Daten, Ihre Quelle, Ihre Kontrolle', 'In der Standardkonfiguration werden Marktdateien, quantitative Berechnungen und der über Ollama erzeugte Kommentar lokal verarbeitet. Wird eine Cloud-Konfiguration angefragt, wird der entsprechende Datenfluss separat definiert und dokumentiert.'],
    ['Reproduzierbar durch Konstruktion', 'Bei gleichem Datensatz, gleichen Parametern und gleicher Engine-Version liefert Previsio dieselben quantitativen Ausgaben — eine Voraussetzung für später verteidigbare Research.'],
    ['Direktionale Klassifikator-Wahrscheinlichkeit', 'Steigt oder fällt der Kurs im Vergleich zum letzten Schlusskurs im Datensatz — nicht zu Ihrem gewählten Ziel? Ein zusätzliches Modell, das diese Frage mit einer zuverlässigen Wahrscheinlichkeit beantwortet — über die Zeit getestet und nur veröffentlicht, wenn es wirklich funktioniert.']]

  };
  const fl = feats[lang] || feats.en;
  const icons = ['◈', '⌬', '⊕', '⬡', '↻', '⌗', '⏵', '◐', '⌭', '⇅'];
  const items = fl.map((f, i) => ({ tag: String(i + 1).padStart(2, '0'), icon: icons[i], title: f[0], body: f[1] }));
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
          {items.map((it, i) =>
          <Reveal key={it.tag} delay={i % 3 + 1} className="card feature">
              <div className="feature-tag">{it.tag}</div>
              <div className="feature-icon"><span style={{ fontSize: 18 }}>{it.icon}</span></div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ============================================================
   YOUR DATA — BYOD section (accuracy + privacy + provider agnostic)
   ============================================================ */
function DataPrivacy() {
  const { lang, t } = useLanguage();
  const cards = [
  {
    icon: '◈',
    title: t('data_card1_title'),
    body: t('data_card1_body'),
    accent: 'var(--gold-primary)'
  },
  {
    icon: '⌖',
    title: t('data_card2_title'),
    body: t('data_card2_body'),
    accent: 'var(--gain)'
  },
  {
    icon: '⎈',
    title: t('data_card3_title'),
    body: t('data_card3_body'),
    accent: 'var(--neutral)'
  }];


  const dataProviderStyles = {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 32,
    justifyContent: 'center'
  };

  const providerTagStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    letterSpacing: '0.14em',
    color: 'var(--text-muted)',
    padding: '8px 18px',
    border: '1px solid var(--border-subtle)',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.02)',
    transition: 'all 0.25s ease'
  };

  return (
    <section id="your-data">
      <div className="container">
        <Reveal className="section-head" style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{t('data_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4.2vw, 52px)', marginTop: 14 }}>
            {t('data_h2a')} <em>{t('data_h2b')}</em>
          </h2>
          <p className="lede" style={{ margin: '18px auto 0', maxWidth: '62ch', textAlign: 'center' }}>
            {t('data_lede')}
          </p>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 56
        }}>
          {cards.map((c, i) =>
          <Reveal key={c.title} delay={i + 1} className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`,
              opacity: 0.6
            }}></div>
              <div style={{
              width: 44,
              height: 44,
              border: `1px solid ${c.accent}44`,
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              marginBottom: 20,
              color: c.accent,
              background: `${c.accent}0a`,
              fontSize: 20
            }}>
                <span>{c.icon}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 10px', letterSpacing: '0.01em' }}>{c.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>{c.body}</p>
            </Reveal>
          )}
        </div>

        <style>{`
          @media (max-width: 980px) {
            #your-data .card { min-width: 0; }
          }
          @media (max-width: 740px) {
            #your-data > .container > div:nth-child(2) {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        <Reveal delay="2">
          <div style={dataProviderStyles}>
            {['BLOOMBERG', 'REFINITIV', 'FACTSET', 'CSV / XLSX', 'OTHER'].map((p) =>
            <span key={p} style={providerTagStyle}>{p}</span>
            )}
          </div>
        </Reveal>

        <Reveal delay="3">
          <div style={{
            marginTop: 36,
            padding: '20px 28px',
            border: '1px dashed var(--border-gold)',
            borderRadius: 8,
            background: 'rgba(212,175,55,0.03)',
            display: 'grid',
            gridTemplateColumns: '44px 1fr',
            gap: 16,
            alignItems: 'center',
            maxWidth: 680,
            margin: '36px auto 0'
          }}>
            <div style={{
              width: 44,
              height: 44,
              border: '1px solid var(--border-gold)',
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              color: 'var(--gold-primary)',
              fontSize: 22,
              background: 'rgba(212,175,55,0.06)'
            }}>◐</div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-primary)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
                {{ en: 'HOW IT WORKS', it: 'COME FUNZIONA', fr: 'COMMENT ÇA MARCHE', de: 'SO FUNKTIONIERT ES' }[lang]}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                {{
                  en: 'Download data from your provider → save as Excel/CSV → Previsio reads it locally → the engine runs, the results are yours. Original files are never modified or transmitted.',
                  it: 'Scaricate i dati dal vostro provider → salvate come Excel/CSV → Previsio li legge localmente → il motore elabora, i risultati rimangono vostri. I file originali non vengono mai modificati né trasmessi.',
                  fr: 'Téléchargez les données depuis votre fournisseur → sauvegardez-les en Excel/CSV → Previsio les lit localement → le moteur tourne, les résultats sont à vous. Les fichiers originaux ne sont jamais modifiés ni transmis.',
                  de: 'Laden Sie die Daten von Ihrem Anbieter herunter → speichern Sie sie als Excel/CSV → Previsio liest sie lokal → die Engine läuft, die Ergebnisse gehören Ihnen. Die Originaldateien werden nie verändert oder übertragen.'
                }[lang]}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ============================================================
   ANALYTICS deep-dive — large chart with tabs
   ============================================================ */
function BigChart({ mode }) {
  const { lang } = useLanguage();
  const W = 720,H = 360,P = 28;
  const N = 140,F = 56;
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
  const x = (i) => P + i / (total - 1) * (W - 2 * P);
  const y = (val) => H - P - (val - min) / (max - min) * (H - 2 * P);

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
    const gy = P + i / 6 * (H - 2 * P);
    grid.push(<line key={`g${i}`} className="gridline" x1={P} x2={W - P} y1={gy} y2={gy} />);
  }
  for (let i = 1; i < 8; i++) {
    const gx = P + i / 8 * (W - 2 * P);
    grid.push(<line key={`gx${i}`} className="gridline" x1={gx} x2={gx} y1={P} y2={H - P} />);
  }

  const cutX = x(N - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {grid}
      {/* 95% band */}
      {(mode === 'pi' || mode === 'all') && <path d={bands(1.6)} className="pi-band" style={{ opacity: 0.55 }} />}
      {/* dispersion */}
      {(mode === 'dispersion' || mode === 'all') && dispersion.map((line, i) =>
      <polyline
        key={i}
        fill="none" stroke="rgba(126,184,218,0.5)" strokeWidth="1"
        points={line.map((q) => `${q.x},${q.y}`).join(' ')} />

      )}
      {/* cutoff */}
      <line x1={cutX} x2={cutX} y1={P} y2={H - P} stroke="rgba(212,175,55,0.4)" strokeDasharray="4 4" />
      <text x={cutX + 6} y={P + 12} style={{ fill: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.12em' }}>
        {{ en: 'FORECAST CUTOFF', it: 'CUTOFF PREVISIONE', fr: 'COUPURE PRÉVISION', de: 'PROGNOSE-CUTOFF' }[lang]}
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
      <text x={x(N - 1)} y={H - 8} className="axis-text">{{ en: 'TODAY', it: 'OGGI', fr: "AUJOURD'HUI", de: 'HEUTE' }[lang]}</text>
      <text x={x(total - 1) - 30} y={H - 8} className="axis-text">2026</text>
    </svg>);

}

function AnalyticsSection() {
  const { lang, t } = useLanguage();
  const [mode, setMode] = useState('all');
  const tabs = [
  { id: 'all', label: { en: 'ALL', it: 'TUTTI', fr: 'TOUS', de: 'ALLE' }[lang] },
  { id: 'pi', label: { en: 'INTERVALS', it: 'INTERVALLI', fr: 'INTERVALLES', de: 'INTERVALLE' }[lang] },
  { id: 'dispersion', label: { en: 'DISPERSION', it: 'DISPERSIONE', fr: 'DISPERSION', de: 'DISPERSION' }[lang] }];

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
              {({
                en: [['The central forecast', 'The headline price the engine commits to for your target date. A single weighted answer from the models run, with the better performers carrying more weight.'], ['The range, calibrated', 'Upper and lower bounds, derived from how this specific asset has been forecast in the past. Not a one-size-fits-all template, not a normal-curve assumption.'], ['Two probability outputs', 'The probability that the closing price on the target date meets a threshold you set (≥ or ≤), and the probability that it falls within a price range you define — closing, not touch-anytime, probabilities. Both computed from the asset\'s own error history — not a generic model assumption.'], ['Directional classifier probability', 'Threshold probability is derived from the empirical distribution of forecast errors. Directional probability instead comes from a separate logistic classifier estimating whether the closing price will be above or below the last close in the dataset — a fixed reference, not your chosen target — and is shown only when it clears its validation gates.']],
                it: [['La previsione centrale', 'Il prezzo principale che il motore calcola per la data obiettivo. Un\'unica risposta pesata dai modelli eseguiti, con i più accurati che contano di più.'], ['Il range, calibrato', 'limite superiore e inferiore, derivati da come questo specifico asset è stato previsto in passato. Non un modello generico, non un\'ipotesi di curva normale.'], ['Due output probabilistici', 'La probabilità che il prezzo di chiusura alla data obiettivo soddisfi una soglia da voi impostata (≥ oppure ≤), e la probabilità che sia compreso nel range di prezzo definito — probabilità di chiusura, non di tocco. Entrambi calcolati dalla storia degli errori dell\'asset — non un\'ipotesi generica.'], ['Probabilità direzionale del classificatore', 'La probabilità di soglia deriva dalla distribuzione empirica degli errori previsionali. La probabilità direzionale è invece prodotta da un classificatore logistico separato, che stima se il prezzo di chiusura sarà superiore o inferiore all\'ultima chiusura del dataset — un riferimento fisso, non il target scelto da voi — e viene mostrata solo quando supera i gate di validazione previsti.']],
                fr: [['La prévision centrale', 'Le prix principal que le moteur calcule pour votre date cible. Une seule réponse pondérée des modèles exécutés, les plus performants ayant plus de poids.'], ['La fourchette, calibrée', 'Bornes haute et basse, dérivées de la façon dont cet actif spécifique a été prévu par le passé. Pas un modèle générique, pas une hypothèse de courbe normale.'], ['Deux sorties probabilistes', 'La probabilité que le prix de clôture à la date cible remplisse un seuil que vous fixez (≥ ou ≤), et la probabilité qu\'il soit compris dans une fourchette de prix que vous définissez — probabilités de clôture, pas de contact à tout moment. Calculées à partir de l\'historique d\'erreurs de l\'actif — pas une hypothèse générique.'], ['Probabilité directionnelle du classificateur', 'La probabilité de seuil dérive de la distribution empirique des erreurs de prévision. La probabilité directionnelle provient au contraire d\'un classificateur logistique séparé, qui estime si le prix de clôture sera au-dessus ou en dessous de la dernière clôture du jeu de données — une référence fixe, pas la cible que vous choisissez — et n\'est affichée que lorsqu\'elle franchit ses seuils de validation.']],
                de: [['Die zentrale Prognose', 'Der Kernpreis, den die Engine für Ihr Zieldatum berechnet. Eine einzige gewichtete Antwort der ausgeführten Modelle, wobei die genaueren mehr Gewicht tragen.'], ['Die Spanne, kalibriert', 'Ober- und Untergrenzen, abgeleitet davon, wie dieses Asset in der Vergangenheit prognostiziert wurde. Keine Einheitsschablone, keine Normalverteilungsannahme.'], ['Zwei Wahrscheinlichkeitsausgaben', 'Die Wahrscheinlichkeit, dass der Schlusskurs am Zieldatum eine von Ihnen gesetzte Schwelle erfüllt (≥ oder ≤), und die Wahrscheinlichkeit, dass er innerhalb einer von Ihnen definierten Preisspanne liegt — Schlusskurs-, keine Berühr-jederzeit-Wahrscheinlichkeiten. Beide aus der Fehlerhistorie des Assets berechnet — keine generische Modellannahme.'], ['Direktionale Klassifikator-Wahrscheinlichkeit', 'Die Schwellenwahrscheinlichkeit stammt aus der empirischen Verteilung der Prognosefehler. Die direktionale Wahrscheinlichkeit stammt dagegen von einem separaten logistischen Klassifikator, der schätzt, ob der Schlusskurs über oder unter dem letzten Schlusskurs im Datensatz liegen wird — ein fester Referenzwert, nicht Ihr gewähltes Ziel — und wird nur angezeigt, wenn sie ihre Validierungsschwellen besteht.']]
              }[lang] || [['The central forecast', 'The headline price the engine commits to for your target date. A single weighted answer from the models run, with the better performers carrying more weight.'], ['The range, calibrated', 'Upper and lower bounds, derived from how this specific asset has been forecast in the past. Not a one-size-fits-all template, not a normal-curve assumption.'], ['Two probability outputs', 'The probability that the closing price on the target date meets a threshold you set (≥ or ≤), and the probability that it falls within a price range you define — closing, not touch-anytime, probabilities. Both computed from the asset\'s own error history — not a generic model assumption.'], ['Directional classifier probability', 'Threshold probability is derived from the empirical distribution of forecast errors. Directional probability instead comes from a separate logistic classifier estimating whether the closing price will be above or below the last close in the dataset — a fixed reference, not your chosen target — and is shown only when it clears its validation gates.']]).map((p, i) =>
              <div className="ana-point" key={i}>
                  <div className="dot" />
                  <div>
                    <h4>{p[0]}</h4>
                    <p>{p[1]}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay="2" variant="right">
            <div className="panel big-chart">
              <div className="big-chart-head">
                <div>
                  <div className="fp-title">Forecast · AAPL · {{ en: '12 months', it: '12 mesi', fr: '12 mois', de: '12 Monate' }[lang]}</div>
                  <div className="fp-sub">Range 80% · {{ en: '56-day target', it: 'target 56 giorni', fr: 'cible 56 jours', de: '56-Tage-Ziel' }[lang]}</div>
                </div>
                <div className="big-chart-tab">
                  {tabs.map((t) =>
                  <button
                    key={t.id}
                    className={mode === t.id ? 'on' : ''}
                    onClick={() => setMode(t.id)}>
                    
                      {t.label}
                    </button>
                  )}
                </div>
              </div>
              <BigChart mode={mode} />
              <div className="legend">
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'rgba(234,234,234,0.85)' }} /> {{ en: 'Realised', it: 'Realizzato', fr: 'Réalisé', de: 'Realisiert' }[lang]}</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--gold-primary)' }} /> {{ en: 'Forecast', it: 'Previsione', fr: 'Prévision', de: 'Prognose' }[lang]}</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'rgba(212,175,55,0.3)', height: 8 }} /> {{ en: '80% range', it: 'Range 80%', fr: 'Fourchette 80%', de: '80% Spanne' }[lang]}</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'rgba(126,184,218,0.55)' }} /> {{ en: 'Individual models', it: 'Modelli individuali', fr: 'Modèles individuels', de: 'Einzelmodelle' }[lang]}</span>
              </div>

              <div style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: '1px dashed var(--border-gold)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--text-faint)',
                letterSpacing: '0.08em',
                lineHeight: 1.5,
                textAlign: 'center'
              }}>
                ⚠ {t('ui_disclaimer')}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

}

/* ============================================================
   METHODOLOGY — surfaced from the technical documentation
   ============================================================ */
function Methodology() {
  const { lang, t } = useLanguage();
  const blocksByLang = {
    en: [
    ['§ 01', 'It combines models, it doesn\'t pick one', 'Up to eight compatible models run on the same asset and are combined into a single forecast.', 'No single model is best on every asset or every horizon. The system selects and runs the models compatible with the horizon, frequency and amount of history available, leaning on the ones that have been right on the asset you\'re forecasting.'],
    ['§ 02', 'Each model is weighted by what works', 'Every model is scored on the asset\'s own past before it counts.', 'Each model is tested on history it has to forecast blind. The ones that were accurate get more say in the final number; the ones that missed get less.'],
    ['§ 03', 'The range is measured, not assumed', 'The range comes from how far past forecasts on this asset actually missed.', 'Instead of assuming a textbook bell curve, the upper and lower bounds are measured from this asset\'s own past errors — so they widen on hard-to-predict assets and tighten on steady ones.'],
    ['§ 04', 'The full maths is written down', 'Technical document · every equation, threshold and default behind the engine.', 'The homepage stays formula-free on purpose. The complete methodology — every model, weighting rule, range policy and safeguard — is in the downloadable document. Read it before you sign.'],
    ['§ 05', 'Direction has its own classifier', 'Logistic regression on the ensemble\'s forecast log-return, validated on a purged holdout.', 'A separate logistic regression estimates P(closing price > last close in the dataset) — the reference is fixed, unlike the user-defined target used for target probability. It is trained on the walk-forward history the engine already produces, validated on a chronological holdout with a purge gap that prevents data leakage, and published only when accuracy, Brier skill and effective sample-size gates are all passed.']],

    it: [
    ['§ 01', 'Combina i modelli, non ne sceglie uno', 'Fino a otto modelli compatibili vengono eseguiti sullo stesso asset e combinati in un’unica previsione.', 'Nessun singolo modello è il migliore su ogni asset o ogni orizzonte. Il sistema seleziona ed esegue i modelli compatibili con l’orizzonte, la frequenza e la quantità di storico disponibile, dando più peso a quelli che sono stati accurati sull\'asset in esame.'],
    ['§ 02', 'Ogni modello è pesato in base ai risultati', 'Ogni modello è valutato sullo storico dell\'asset prima di contare.', 'Ogni modello viene valutato su periodi storici che non ha mai visto durante la calibrazione. I modelli più accurati ottengono maggiore peso nel risultato finale; quelli meno precisi ne ottengono meno.'],
    ['§ 03', 'Il range è misurato, non ipotizzato', 'Il range deriva da quanto le previsioni passate su questo asset hanno effettivamente sbagliato.', 'Invece di ipotizzare una curva a campana, il limite superiore e quello inferiore sono ricavati dagli errori passati di questo asset — si allargano sugli asset più volatili e si restringono su quelli stabili.'],
    ['§ 04', 'La matematica completa è documentata', 'Documento tecnico · ogni equazione, soglia e parametro del motore.', 'La homepage è volutamente priva di formule. La metodologia completa — ogni modello, regola di pesatura, politica di range e salvaguardia — è nel documento scaricabile.'],
    ['§ 05', 'La direzione ha un classificatore separato', 'Un modello separato stima la probabilità di direzione.', 'Un modello separato stima la probabilità che il prezzo di chiusura alla data obiettivo sia superiore oppure inferiore all’ultima chiusura disponibile nel dataset. Il risultato viene mostrato solo quando supera i gate minimi di campione, accuratezza, calibrazione e stabilità previsti dalla metodologia.']],

    fr: [
    ['§ 01', 'Il combine les modèles, il n\'en choisit pas un', 'Jusqu\'à huit modèles compatibles tournent sur le même actif et se combinent en une seule prévision.', 'Aucun modèle n\'est le meilleur sur chaque actif ou chaque horizon. Le système sélectionne et exécute les modèles compatibles avec l\'horizon, la fréquence et la quantité d\'historique disponible, en s\'appuyant sur ceux qui ont été précis sur l\'actif en question.'],
    ['§ 02', 'Chaque modèle est pondéré par ses résultats', 'Chaque modèle est évalué sur le passé de l\'actif avant de compter.', 'Chaque modèle est testé sur un historique qu\'il doit prévoir à l\'aveugle. Les plus précis ont plus de poids dans le résultat final ; les moins précis en ont moins.'],
    ['§ 03', 'La fourchette est mesurée, pas supposée', 'La fourchette provient des écarts réels des prévisions passées sur cet actif.', 'Au lieu de supposer une courbe en cloche, les bornes haute et basse sont mesurées à partir des erreurs passées de cet actif — elles s\'élargissent sur les actifs difficiles et se resserrent sur les stables.'],
    ['§ 04', 'Les maths complètes sont documentées', 'Document technique · chaque équation, seuil et paramètre du moteur.', 'La page d\'accueil est volontairement sans formules. La méthodologie complète — chaque modèle, règle de pondération, politique de fourchette et garde-fou — est dans le document téléchargeable. Lisez-le avant de signer.'],
    ['§ 05', 'La direction a un classificateur séparé', 'Un modèle séparé estime la probabilité directionnelle.', 'Un modèle séparé estime la probabilité que le prix de clôture à la date cible soit supérieur ou inférieur à la dernière clôture disponible dans le jeu de données. Le résultat n\'est affiché que lorsqu\'il franchit les seuils minimaux d\'échantillon, de précision, de calibration et de stabilité prévus par la méthodologie.']],

    de: [
    ['§ 01', 'Es kombiniert Modelle, es wählt keines aus', 'Bis zu acht kompatible Modelle laufen auf demselben Asset und werden zu einer einzigen Prognose kombiniert.', 'Kein einzelnes Modell ist auf jedem Asset oder jedem Horizont das Beste. Das System wählt die mit Horizont, Frequenz und verfügbarer Historie kompatiblen Modelle aus und führt sie aus, wobei es sich auf die stützt, die beim jeweiligen Asset richtig lagen.'],
    ['§ 02', 'Jedes Modell wird nach Ergebnissen gewichtet', 'Jedes Modell wird an der Vergangenheit des Assets bewertet, bevor es zählt.', 'Jedes Modell wird auf einer Historie getestet, die es blind prognostizieren muss. Die genauen haben mehr Einfluss auf das Endergebnis; die ungenauen weniger.'],
    ['§ 03', 'Die Spanne wird gemessen, nicht angenommen', 'Die Spanne ergibt sich daraus, wie weit vergangene Prognosen auf diesem Asset tatsächlich danebenlagen.', 'Statt eine Lehrbuch-Glockenkurve anzunehmen, werden Ober- und Untergrenzen aus den vergangenen Fehlern dieses Assets gemessen — sie weiten sich bei schwer vorhersagbaren Assets und verengen sich bei stabilen.'],
    ['§ 04', 'Die vollständige Mathematik ist dokumentiert', 'Technisches Dokument · jede Gleichung, jeder Schwellenwert und jeder Standard hinter der Engine.', 'Die Homepage ist bewusst formelfrei. Die vollständige Methodologie — jedes Modell, jede Gewichtungsregel, jede Spannenpolitik und jede Schutzmaßnahme — befindet sich im herunterladbaren Dokument. Lesen Sie es vor der Unterzeichnung.'],
    ['§ 05', 'Die Richtung hat einen separaten Klassifikator', 'Ein separates Modell schätzt die Richtungswahrscheinlichkeit.', 'Ein separates Modell schätzt die Wahrscheinlichkeit, dass der Schlusskurs am Zieldatum über oder unter dem letzten verfügbaren Schlusskurs im Datensatz liegt. Das Ergebnis wird nur angezeigt, wenn es die von der Methodik vorgesehenen Mindestschwellen für Stichprobengröße, Genauigkeit, Kalibrierung und Stabilität erfüllt.']]

  };
  const bl = blocksByLang[lang] || blocksByLang.en;
  const blocks = bl.map((b) => ({ tag: b[0], title: b[1], math: b[2], body: b[3] }));

  return (
    <section id="methodology" style={{ borderTop: 'none', paddingTop: 0 }}>
      <div className="container">
        <Reveal style={{ maxWidth: 720, margin: '0 0 36px' }}>
          <span className="eyebrow">{t('methodology_eyebrow')}</span>
          <p className="lede" style={{ marginTop: 10 }}>
            {t('methodology_lede')}
          </p>
        </Reveal>

        <div className="method-grid">
          {blocks.map((b, i) =>
          <Reveal key={b.tag} delay={i % 5 + 1} className="card method-card">
              <div className="method-head">
                <span className="method-tag">{b.tag}</span>
                <h3>{b.title}</h3>
              </div>
              <div className="method-math">{b.math}</div>
              <p className="method-body">{b.body}</p>
            </Reveal>
          )}
        </div>

        <Reveal className="method-download">
          <div className="md-inner">
            <div className="md-icon">◰</div>
            <div className="md-text">
              <div className="md-title">{{ en: 'Previsio · Quantitative methodology', it: 'Previsio · Metodologia quantitativa', fr: 'Previsio · Méthodologie quantitative', de: 'Previsio · Quantitative Methodologie' }[lang]}</div>
              <div className="md-sub">{{ en: '20 sections · models, weights, intervals, probability, defaults · 190+ formulas', it: '20 sezioni · modelli, pesi, intervalli, probabilità, parametri · 190+ formule', fr: '20 sections · modèles, poids, intervalles, probabilité, paramètres · 190+ formules', de: '20 Abschnitte · Modelle, Gewichte, Intervalle, Wahrscheinlichkeit, Standards · 190+ Formeln' }[lang]}</div>
            </div>
            <a className="btn btn-gold" href="Request.html#docs">
              {{ en: 'Request documentation', it: 'Richiedi documentazione', fr: 'Demander la documentation', de: 'Dokumentation anfordern' }[lang]} <span className="arrow">→</span>
            </a>
          </div>
        </Reveal>

      </div>
    </section>);

}

/* ============================================================
   USE CASES
   ============================================================ */
function UseCases() {
  const { lang, t } = useLanguage();
  const casesByLang = {
    en: [
    { role: 'For research desks', title: 'Structured memos for daily review, on a daily cadence', body: 'Run the full engine in the morning, hand the auto-generated DOCX to the PM by 9. Every weight, every interval, every input is traceable — and the report ships in the client\'s language.', bullets: ['Auto memo (EN/IT/FR/DE)', 'Reproducible quantitative outputs given the same dataset, parameters and engine version', 'Re-run in seconds from cache'] },
    { role: 'For tactical positioning', title: 'Backtests you can replay, results you can combine', body: 'Time-travel to any historical cutoff and rerun the full analysis without knowing the outcome. Stack the ensemble against your own discretionary view, with calibrated probabilities for the directional bet you actually want to place.', bullets: ['Time-travel cutoff replay', 'Probability for any target', 'Analysis depths Fast → Ultra'] },
    { role: 'For analysts & advisors', title: 'Structured quantitative analysis, without building an internal pipeline', body: 'You define the asset, target date and scenario parameters; Previsio handles model selection, weighting, intervals, diagnostics and automated report generation. The process reduces manual work without turning the output into an investment recommendation.', bullets: ['Up to eight forecasting models', 'Documented probabilities per scenario', 'Auditable report ready for internal review'] },
    { role: 'For multi-asset & crypto desks', title: 'One engine, both regimes', body: 'It automatically switches between daily, weekly and monthly data to match how far ahead you\'re forecasting — handling the 24/7 nature of crypto and the calendar of equities without you touching a setting. Same models, same diagnostics, same memo format across both.', bullets: ['Daily / weekly / monthly auto-switch', 'Equities · BTC · ETH · majors', 'Range calibrated per asset'] }],

    it: [
    { role: 'Per desk di ricerca', title: 'Memo predisposti per la revisione e l\'eventuale discussione in comitato, su base giornaliera', body: 'Eseguite il motore e ottenete il DOCX auto-generato predisposto per la revisione e l\'eventuale discussione in comitato. Ogni peso, ogni intervallo, ogni input è tracciabile — e il report viene prodotto nella lingua del cliente.', bullets: ['Memo automatico (EN/IT/FR/DE)', 'Output quantitativi riproducibili a parità di dataset, parametri e versione del motore', 'Riesecuzione in secondi dalla cache'] },
    { role: 'Per analisi di scenario e ricerca tattica', title: 'Backtest replicabili, probabilità documentate, risultati confrontabili', body: 'Confrontate l\'ensemble con la vostra view interna, utilizzando probabilità modellistiche documentate a supporto dell\'analisi di scenario', bullets: ['Replay cutoff time-travel', 'Probabilità per qualsiasi target', 'Modalità Fast → Ultra'] },
    { role: 'Per analyst e consulenti professionali', title: 'Analisi quantitativa strutturata, senza pipeline interne complesse', body: 'L’utente definisce asset, data obiettivo e parametri di scenario; Previsio gestisce selezione dei modelli, pesatura, intervalli, diagnostica e generazione automatica del report. Il processo riduce il lavoro manuale senza trasformare l’output in una raccomandazione di investimento.', bullets: ['Fino a otto modelli previsionali', 'Probabilità documentate per scenario', 'Report auditabile pronto per revisione interna'] },
    { role: 'Per desk multi-asset e crypto', title: 'Un motore, due regimi', body: 'Passa automaticamente da dati giornalieri a settimanali a mensili in base all\'orizzonte di previsione — gestendo la natura 24/7 delle crypto e il calendario degli equity senza toccare un\'impostazione. Stessi modelli, stessa diagnostica, stesso formato memo per entrambi.', bullets: ['Switch auto giornaliero / settimanale / mensile', 'Azioni · BTC · ETH · majors', 'Range calibrato per asset'] }],

    fr: [
    { role: 'Pour les desks de recherche', title: 'Des mémos prédisposés pour la revue interne et l’éventuelle discussion en comité, au quotidien', body: 'Lancez le moteur le matin, remettez le DOCX auto-généré au PM avant 9h. Chaque poids, chaque intervalle, chaque entrée est traçable — et le rapport est produit dans la langue du client.', bullets: ['Mémo auto (EN/IT/FR/DE)', 'Sorties quantitatives reproductibles à dataset, paramètres et version du moteur identiques', 'Relance en secondes depuis le cache'] },
    { role: 'Pour le positionnement tactique', title: 'Des backtests rejouables, des résultats combinables', body: 'Voyagez dans le temps vers n\'importe quel cutoff historique et relancez l\'analyse complète sans connaître l\'issue. Comparez les résultats avec votre propre analyse, avec des probabilités calibrées pour le pari directionnel que vous voulez placer.', bullets: ['Replay cutoff time-travel', 'Probabilité pour toute cible', 'Modes Fast → Ultra'] },
    { role: 'Pour les analystes et conseillers', title: 'Analyse quantitative structurée, sans construire de pipeline interne', body: 'Vous définissez l\'actif, la date cible et les paramètres du scénario ; Previsio gère la sélection des modèles, la pondération, les intervalles, les diagnostics et la génération automatique du rapport. Le processus réduit le travail manuel sans transformer le résultat en recommandation d\'investissement.', bullets: ['Jusqu\'à huit modèles de prévision', 'Probabilités documentées par scénario', 'Rapport auditable prêt pour revue interne'] },
    { role: 'Pour les desks multi-actifs & crypto', title: 'Un moteur, deux régimes', body: 'Il bascule automatiquement entre données quotidiennes, hebdomadaires et mensuelles selon la portée de prévision — gérant la nature 24/7 des cryptos et le calendrier des actions sans toucher un paramètre. Mêmes modèles, même diagnostic, même format de mémo.', bullets: ['Switch auto quotidien / hebdo / mensuel', 'Actions · BTC · ETH · majors', 'Fourchette calibrée par actif'] }],

    de: [
    { role: 'Für Research-Desks', title: 'Für die interne Prüfung und eine etwaige Komiteediskussion vorbereitete Memos, im Tagesrhythmus', body: 'Führen Sie die Engine morgens aus, übergeben Sie das auto-generierte DOCX bis 9 Uhr an den PM. Jedes Gewicht, jedes Intervall, jeder Input ist nachvollziehbar — und der Bericht wird in der Sprache des Kunden erstellt.', bullets: ['Auto-Memo (EN/IT/FR/DE)', 'Reproduzierbare quantitative Ergebnisse bei gleichem Datensatz, gleichen Parametern und gleicher Engine-Version', 'Wiederholung in Sekunden aus dem Cache'] },
    { role: 'Für taktische Positionierung', title: 'Wiederholbare Backtests, kombinierbare Ergebnisse', body: 'Reisen Sie zu jedem historischen Cutoff zurück und führen Sie die vollständige Analyse blind erneut aus. Vergleichen Sie das Ensemble mit Ihrer eigenen diskretionären Einschätzung, mit kalibrierten Wahrscheinlichkeiten für die Richtungswette, die Sie platzieren möchten.', bullets: ['Time-Travel Cutoff Replay', 'Wahrscheinlichkeit für jedes Ziel', 'Calc-Modi Fast → Ultra'] },
    { role: 'Für Analysten & Berater', title: 'Strukturierte quantitative Analyse, ohne eigene Pipeline aufzubauen', body: 'Sie definieren Asset, Zieldatum und Szenarioparameter; Previsio übernimmt Modellauswahl, Gewichtung, Intervalle, Diagnostik und automatische Berichtserstellung. Der Prozess reduziert manuelle Arbeit, ohne die Ausgabe in eine Anlageempfehlung zu verwandeln.', bullets: ['Bis zu acht Prognosemodelle', 'Dokumentierte Wahrscheinlichkeiten je Szenario', 'Auditierbarer Bericht, bereit für interne Prüfung'] },
    { role: 'Für Multi-Asset- & Krypto-Desks', title: 'Eine Engine, zwei Regimes', body: 'Automatischer Wechsel zwischen täglichen, wöchentlichen und monatlichen Daten je nach Prognosehorizont — die 24/7-Natur von Krypto und den Kalender von Aktien handhaben, ohne eine Einstellung zu ändern. Gleiche Modelle, gleiche Diagnostik, gleiches Memo-Format.', bullets: ['Auto-Switch täglich / wöchentlich / monatlich', 'Aktien · BTC · ETH · Majors', 'Spanne pro Asset kalibriert'] }]

  };
  const cases = casesByLang[lang] || casesByLang.en;
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
          {cases.map((c, i) =>
          <Reveal key={c.role} delay={i % 2 + 1} className="card use-card">
              <div className="role">{c.role}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <ul>{c.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ============================================================
   TIME TRAVEL — mode explainer
   ============================================================ */
function TimeTravelSection() {
  const { t } = useLanguage();

  const steps = [
  { num: '01', label: t('tt_step1_label'), body: t('tt_step1_body') },
  { num: '02', label: t('tt_step2_label'), body: t('tt_step2_body') },
  { num: '03', label: t('tt_step3_label'), body: t('tt_step3_body') }];


  // SVG chart dimensions
  const W = 380,H = 186;
  const pad = { l: 28, r: 16, t: 18, b: 32 };
  const cX = Math.round(W * 0.46); // cutoff X

  const hist = [[pad.l, H - pad.b - 52], [pad.l + 28, H - pad.b - 38], [pad.l + 56, H - pad.b - 62], [pad.l + 84, H - pad.b - 48], [pad.l + 112, H - pad.b - 74], [pad.l + 140, H - pad.b - 60], [cX, H - pad.b - 66]];
  const fore = [[cX, H - pad.b - 66], [cX + 36, H - pad.b - 82], [cX + 72, H - pad.b - 94], [cX + 110, H - pad.b - 88], [W - pad.r, H - pad.b - 104]];
  const actl = [[cX, H - pad.b - 66], [cX + 36, H - pad.b - 58], [cX + 72, H - pad.b - 72], [cX + 110, H - pad.b - 68], [W - pad.r, H - pad.b - 84]];
  const bU = [[cX, H - pad.b - 84], [cX + 36, H - pad.b - 102], [cX + 72, H - pad.b - 118], [cX + 110, H - pad.b - 114], [W - pad.r, H - pad.b - 130]];
  const bL = [[cX, H - pad.b - 48], [cX + 36, H - pad.b - 62], [cX + 72, H - pad.b - 70], [cX + 110, H - pad.b - 62], [W - pad.r, H - pad.b - 78]];

  const pts = (arr) => arr.map((p) => p.join(',')).join(' ');
  const bandPts = [...bU, ...[...bL].reverse()].map((p) => p.join(',')).join(' ');

  return (
    <section id="time-travel" style={{ borderTop: 'none' }}>
      <div className="container">
        <div className="tt-grid">

          {/* LEFT — text + steps */}
          <div>
            <Reveal className="section-head" style={{ marginBottom: 40 }}>
              <span className="eyebrow">{t('tt_eyebrow')}</span>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', margin: '0 0 16px' }}>
                {t('tt_h2')}
              </h2>
              <p className="lede" style={{ fontSize: 15 }}>{t('tt_lede')}</p>
            </Reveal>

            <div className="stages">
              {steps.map((s, i) =>
              <Reveal key={s.num} delay={String(i + 1)} className="stage">
                  <div className="stage-num">{s.num}</div>
                  <div>
                    <div className="stage-name">{s.label}</div>
                    <div className="stage-desc">{s.body}</div>
                  </div>
                  <div className="stage-tick">✓</div>
                </Reveal>
              )}
            </div>
          </div>

          {/* RIGHT — SVG diagram */}
          <Reveal delay="2" className="panel" style={{ padding: '22px 24px' }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-primary)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 3 }}>
                {t('tt_eyebrow')} · Diagram
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
                AAPL · Ref date: Jan 15, 2024 · Horizon +30D
              </div>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
              {/* faint grid */}
              {[0.3, 0.65].map((f, i) =>
              <line key={i}
              x1={pad.l} y1={pad.t + (H - pad.t - pad.b) * f}
              x2={W - pad.r} y2={pad.t + (H - pad.t - pad.b) * f}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              )}
              {/* forecast zone tint */}
              <rect x={cX} y={pad.t} width={W - pad.r - cX} height={H - pad.t - pad.b}
              fill="rgba(212,175,55,0.03)" />
              {/* confidence band */}
              <polygon points={bandPts} fill="rgba(212,175,55,0.10)" />
              {/* historical price */}
              <polyline points={pts(hist)} fill="none" stroke="rgba(234,234,234,0.7)" strokeWidth="1.5" />
              {/* forecast line */}
              <polyline points={pts(fore)} fill="none" stroke="var(--gold-primary)" strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.5))' }} />
              {/* actual line */}
              <polyline points={pts(actl)} fill="none" stroke="var(--neutral)" strokeWidth="1.5" strokeDasharray="5 3" />
              {/* cutoff dashed rule */}
              <line x1={cX} y1={pad.t} x2={cX} y2={H - pad.b}
              stroke="rgba(212,175,55,0.45)" strokeWidth="1" strokeDasharray="4 3" />
              {/* zone labels */}
              <text x={pad.l + 2} y={pad.t + 9} fontFamily="var(--font-mono)" fontSize="7.5" fill="rgba(255,255,255,0.2)" letterSpacing="0.1em">HISTORICAL</text>
              <text x={cX + 4} y={pad.t + 9} fontFamily="var(--font-mono)" fontSize="7.5" fill="var(--gold-dim)" letterSpacing="0.08em">REF. DATE</text>
              {/* x axis */}
              <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b}
              stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x={pad.l} y={H - pad.b + 13} fontFamily="var(--font-mono)" fontSize="7.5" fill="var(--text-faint)">Jan 1</text>
              <text x={cX - 10} y={H - pad.b + 13} fontFamily="var(--font-mono)" fontSize="7.5" fill="var(--gold-dim)">Jan 15</text>
              <text x={W - pad.r - 22} y={H - pad.b + 13} fontFamily="var(--font-mono)" fontSize="7.5" fill="var(--text-faint)">Feb 14</text>
            </svg>

            {/* legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              {[
              { color: 'rgba(234,234,234,0.7)', dash: false, label: 'Historical' },
              { color: 'var(--gold-primary)', dash: false, label: 'Forecast' },
              { color: 'var(--neutral)', dash: true, label: 'Actual' }].
              map((l) =>
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  <svg width="18" height="2" style={{ flexShrink: 0, display: 'block' }}>
                    <line x1="0" y1="1" x2="18" y2="1"
                  stroke={l.color} strokeWidth="2"
                  strokeDasharray={l.dash ? '4 2' : undefined} />
                  </svg>
                  {l.label}
                </div>
              )}
            </div>
          </Reveal>

        </div>
      </div>
    </section>);

}

/* ============================================================
   PORTFOLIO MODE — multi-asset risk diagnostics + forecast aggregation
   ============================================================ */
function PortfolioSection() {
  const { t } = useLanguage();

  const feats = [
  { num: '01', lk: 'portfolio_feat1_label', bk: 'portfolio_feat1_body' },
  { num: '02', lk: 'portfolio_feat2_label', bk: 'portfolio_feat2_body' },
  { num: '03', lk: 'portfolio_feat3_label', bk: 'portfolio_feat3_body' },
  { num: '04', lk: 'portfolio_feat4_label', bk: 'portfolio_feat4_body' },
  { num: '05', lk: 'portfolio_feat5_label', bk: 'portfolio_feat5_body' },
  { num: '06', lk: 'portfolio_feat6_label', bk: 'portfolio_feat6_body' }];


  const labels = ['AAPL', 'MSFT', 'GOOGL'];
  const corrMatrix = [
  [1.00, 0.82, 0.74],
  [0.82, 1.00, 0.79],
  [0.74, 0.79, 1.00]];


  function corrBg(v, isDiag) {
    if (isDiag) return 'rgba(212,175,55,0.22)';
    if (v >= 0.80) return 'rgba(212,175,55,0.14)';
    if (v >= 0.65) return 'rgba(212,175,55,0.07)';
    return 'rgba(255,255,255,0.03)';
  }

  const vols = [
  { ticker: 'AAPL', v: 0.261 },
  { ticker: 'MSFT', v: 0.234 },
  { ticker: 'GOOGL', v: 0.283 },
  { ticker: 'Portfolio', v: 0.219, port: true }];

  const maxVol = Math.max(...vols.map((x) => x.v));

  return (
    <section id="portfolio-mode" style={{ borderTop: 'none', paddingTop: 0 }}>
      <div className="container">
        <div className="tt-grid">

          {/* LEFT — text + feature list */}
          <div>
            <Reveal className="section-head" style={{ marginBottom: 40 }}>
              <span className="eyebrow">{t('portfolio_eyebrow')}</span>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', margin: '0 0 16px' }}>
                {t('portfolio_h2')}
              </h2>
              <p className="lede" style={{ fontSize: 15 }}>{t('portfolio_lede')}</p>
            </Reveal>

            <div style={{ display: 'grid', gap: 18 }}>
              {feats.map((f, i) =>
              <Reveal key={f.num} delay={String(i + 1)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: '0 14px', alignItems: 'start' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-dim)', letterSpacing: '0.14em', paddingTop: 2 }}>{f.num}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 3, letterSpacing: '0.02em' }}>{t(f.lk)}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{t(f.bk)}</div>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              {t('portfolio_scope_note')}
            </p>
          </div>

          {/* RIGHT — live-looking panel */}
          <Reveal delay="2" className="panel" style={{ padding: '22px 24px' }}>

            {/* Panel header */}
            <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-primary)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
                {t('portfolio_eyebrow')} · Sample output
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)', letterSpacing: '0.08em' }}>
                AAPL · MSFT · GOOGL &nbsp;·&nbsp; 2Y window &nbsp;·&nbsp; equal-weight &nbsp;·&nbsp; weekly returns
              </div>
            </div>

            {/* KPI strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
              {[
              { label: 'Avg correlation', value: '0.78' },
              { label: 'Portfolio vol', value: '21.9%' },
              { label: 'Div. ratio', value: '1.21' }].
              map((kpi) =>
              <div key={kpi.label} style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '9px 12px', background: 'rgba(0,0,0,0.28)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 }}>{kpi.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 400, color: 'var(--gold-primary)', letterSpacing: '-0.01em' }}>{kpi.value}</div>
                </div>
              )}
            </div>

            {/* Correlation heatmap */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Correlation matrix (Pearson · log returns)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ width: 52 }}></th>
                    {labels.map((l) =>
                    <th key={l} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, padding: '0 4px 6px', textAlign: 'center', letterSpacing: '0.08em' }}>{l}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {corrMatrix.map((row, ri) =>
                  <tr key={labels[ri]}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', paddingRight: 6, letterSpacing: '0.06em' }}>{labels[ri]}</td>
                      {row.map((v, ci) =>
                    <td key={ci} style={{ padding: 3, textAlign: 'center' }}>
                          <div style={{
                        background: corrBg(v, ri === ci),
                        borderRadius: 6,
                        padding: '8px 4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        fontWeight: ri === ci ? 600 : 400,
                        color: ri === ci ? 'var(--gold-primary)' : 'var(--text-main)',
                        letterSpacing: '0.02em',
                        border: '1px solid rgba(255,255,255,0.04)'
                      }}>
                            {v.toFixed(2)}
                          </div>
                        </td>
                    )}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Volatility bars */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>Annualised volatility</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {vols.map(({ ticker, v, port }) =>
                <div key={ticker} style={{ display: 'grid', gridTemplateColumns: '58px 1fr 42px', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: port ? 'var(--gold-primary)' : 'var(--text-muted)', letterSpacing: '0.06em' }}>{ticker}</div>
                    <div style={{ height: 7, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                      height: '100%',
                      width: `${v / maxVol * 100}%`,
                      background: port ? 'var(--gold-primary)' : 'rgba(212,175,55,0.38)',
                      borderRadius: 4
                    }}></div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: port ? 'var(--gold-primary)' : 'var(--text-main)', textAlign: 'right' }}>{(v * 100).toFixed(1)}%</div>
                  </div>
                )}
              </div>

              {/* Risk contribution mini-table */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Risk contribution (Euler)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '58px 1fr 1fr', gap: '4px 10px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Asset</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>Abs.</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>% of risk</div>
                  {[
                  { ticker: 'AAPL', abs: '7.4%', pct: '33.8%' },
                  { ticker: 'MSFT', abs: '6.8%', pct: '31.0%' },
                  { ticker: 'GOOGL', abs: '7.7%', pct: '35.2%' }].
                  map((row) =>
                  <React.Fragment key={row.ticker}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-main)', letterSpacing: '0.06em' }}>{row.ticker}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'right' }}>{row.abs}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-primary)', textAlign: 'right' }}>{row.pct}</div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>

          </Reveal>
        </div>
      </div>
    </section>);

}

/* ============================================================
   DASHBOARD PREVIEW — faithful recreation of the product UI
   ============================================================ */
function DashboardPreview() {
  const { lang, t } = useLanguage();
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
                  <div className="desk-title">{tab === 'live' ? { en: 'Configuration', it: 'Configurazione', fr: 'Configuration', de: 'Konfiguration' }[lang] : { en: 'Backtest Engine', it: 'Motore di Backtest', fr: 'Moteur de Backtest', de: 'Backtest-Engine' }[lang]}</div>
                  <div className="desk-sub">{tab === 'live' ? { en: 'Selected dataset', it: 'Dataset selezionato', fr: 'Jeu de données sélectionné', de: 'Ausgewählter Datensatz' }[lang] : { en: 'Historical verification (no future data)', it: 'Verifica storica (nessun dato futuro)', fr: 'Vérification historique (pas de données futures)', de: 'Historische Verifizierung (keine zukünftigen Daten)' }[lang]}</div>
                </div>
                
              </div>

              <div className="desk-tabs">
                <button className={tab === 'live' ? 'on' : ''} onClick={() => setTab('live')}>LIVE FORECAST</button>
                <button className={tab === 'sim' ? 'on' : ''} onClick={() => setTab('sim')}>TIME TRAVEL</button>
              </div>

              {tab === 'live' ? (
              /* ── LIVE FORECAST fields ── */
              <>
                  <div className="desk-group-label">{{ en: 'Asset definition', it: 'Definizione asset', fr: 'Définition de l\'actif', de: 'Asset-Definition' }[lang]}</div>
                  <div className="desk-field">
                    <label>Ticker</label>
                    <input className="desk-input focus" defaultValue="AAPL" />
                  </div>
                  <div className="desk-field">
                    <label>{{ en: 'Target date', it: 'Data obiettivo', fr: 'Date cible', de: 'Zieldatum' }[lang]}</label>
                    <input className="desk-input" defaultValue="2026-12-31" />
                  </div>

                  <div className="desk-group-label">{{ en: 'Historical verification', it: 'Verifica storica', fr: 'Vérification historique', de: 'Historische Verifizierung' }[lang]}</div>
                  <div className="desk-field">
                    <label>{{ en: 'Analysis depth', it: 'Profondità di analisi', fr: 'Profondeur d\'analyse', de: 'Analysetiefe' }[lang]}</label>
                    <select className="desk-input" value={profile} onChange={(e) => setProfile(e.target.value)}>
                      <option value="fast">FAST — {{ en: 'quick trial budget', it: 'analisi rapida', fr: 'budget rapide', de: 'schnelle Analyse' }[lang]}</option>
                      <option value="medium">STANDARD — {{ en: 'balanced (recommended)', it: 'bilanciato (consigliato)', fr: 'équilibré (recommandé)', de: 'ausgewogen (empfohlen)' }[lang]}</option>
                      <option value="long">DEEP — {{ en: 'high precision', it: 'alta precisione', fr: 'haute précision', de: 'hohe Präzision' }[lang]}</option>
                      <option value="very_long">ULTRA — {{ en: 'maximum depth', it: 'massima profondità', fr: 'profondeur maximale', de: 'maximale Tiefe' }[lang]}</option>
                    </select>
                  </div>

                  <div className="desk-group-label">{{ en: 'Calibration', it: 'Calibrazione', fr: 'Calibration', de: 'Kalibrierung' }[lang]}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="desk-field" style={{ marginBottom: 0 }}>
                      <label>{{ en: 'Range confidence', it: 'Confidenza range', fr: 'Confiance fourchette', de: 'Spanne Konfidenz' }[lang]}</label>
                      <input className="desk-input" defaultValue="80%" />
                    </div>
                    <div className="desk-field" style={{ marginBottom: 0 }}>
                      <label>{{ en: 'History years', it: 'Anni di storico', fr: 'Années d\'historique', de: 'Historien-Jahre' }[lang]}</label>
                      <input className="desk-input" defaultValue="AUTO" />
                    </div>
                  </div>

                  <div className="desk-group-label">{{ en: 'Threshold probability', it: 'Probabilità di soglia', fr: 'Probabilité de seuil', de: 'Schwellenwahrscheinlichkeit' }[lang]}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="desk-field" style={{ marginBottom: 0 }}>
                      <label>{{ en: 'Target price', it: 'Prezzo target', fr: 'Prix cible', de: 'Zielpreis' }[lang]}</label>
                      <input className="desk-input" defaultValue="260.00" />
                    </div>
                    <div className="desk-field" style={{ marginBottom: 0 }}>
                      <label>{{ en: 'Condition', it: 'Condizione', fr: 'Condition', de: 'Bedingung' }[lang]}</label>
                      <select className="desk-input">
                        <option>CLOSE ≥ TARGET</option>
                        <option>CLOSE ≤ TARGET</option>
                      </select>
                    </div>
                  </div>

                  <button className="btn btn-gold" style={{ width: '100%', marginTop: 22 }}>
                    {{ en: 'Run live forecast', it: 'Esegui previsione live', fr: 'Lancer la prévision live', de: 'Live-Prognose starten' }[lang]}
                  </button>
                </>) : (

              /* ── TIME TRAVEL (SIM) fields ── */
              <>
                  <div className="desk-group-label" style={{ color: 'var(--gold-primary)' }}>{{ en: 'Simulation parameters', it: 'Parametri di simulazione', fr: 'Paramètres de simulation', de: 'Simulationsparameter' }[lang]}</div>
                  <div className="desk-field">
                    <label>Ticker</label>
                    <input className="desk-input" defaultValue="AAPL" />
                  </div>
                  <div className="desk-field">
                    <label style={{ color: '#ffc107' }}>{{ en: 'Simulation cutoff date', it: 'Data di cutoff simulazione', fr: 'Date de coupure simulation', de: 'Simulations-Cutoff-Datum' }[lang]}</label>
                    <input className="desk-input" type="date" defaultValue="2025-01-15" style={{ borderColor: '#ffc107', boxShadow: '0 0 12px rgba(255,193,7,0.12)' }} />
                    <div className="desk-hint">{{ en: 'Data after this date will be excluded from the backtest.', it: 'I dati successivi a questa data saranno esclusi dal backtest.', fr: 'Les données postérieures à cette date seront exclues du backtest.', de: 'Daten nach diesem Datum werden vom Backtest ausgeschlossen.' }[lang]}</div>
                  </div>
                  <div className="desk-field">
                    <label>{{ en: 'Target date (forecast)', it: 'Data obiettivo (previsione)', fr: 'Date cible (prévision)', de: 'Zieldatum (Prognose)' }[lang]}</label>
                    <input className="desk-input" type="date" defaultValue="2025-07-15" />
                  </div>

                  <div className="desk-field">
                    <label>{{ en: 'Prediction interval %', it: 'Intervallo di predizione %', fr: 'Intervalle de prédiction %', de: 'Prognoseintervall %' }[lang]}</label>
                    <input className="desk-input" type="number" placeholder={{ en: 'Auto', it: 'Auto', fr: 'Auto', de: 'Auto' }[lang]} />
                  </div>

                  <div className="desk-group-label">{{ en: 'Backtest config', it: 'Configurazione backtest', fr: 'Configuration backtest', de: 'Backtest-Konfiguration' }[lang]}</div>
                  <div className="desk-field">
                    <label>{{ en: 'Analysis depth', it: 'Profondità di analisi', fr: 'Profondeur d\'analyse', de: 'Analysetiefe' }[lang]}</label>
                    <select className="desk-input" value={profile} onChange={(e) => setProfile(e.target.value)}>
                      <option value="fast">FAST — {{ en: 'quick trial budget', it: 'analisi rapida', fr: 'budget rapide', de: 'schnelle Analyse' }[lang]}</option>
                      <option value="medium">STANDARD — {{ en: 'balanced (recommended)', it: 'bilanciato (consigliato)', fr: 'équilibré (recommandé)', de: 'ausgewogen (empfohlen)' }[lang]}</option>
                      <option value="long">DEEP — {{ en: 'high precision', it: 'alta precisione', fr: 'haute précision', de: 'hohe Präzision' }[lang]}</option>
                      <option value="very_long">ULTRA — {{ en: 'maximum depth', it: 'massima profondità', fr: 'profondeur maximale', de: 'maximale Tiefe' }[lang]}</option>
                    </select>
                  </div>

                  <div className="desk-group-label">{{ en: 'Threshold probability', it: 'Probabilità di soglia', fr: 'Probabilité de seuil', de: 'Schwellenwahrscheinlichkeit' }[lang]}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="desk-field" style={{ marginBottom: 0 }}>
                      <label>{{ en: 'Target price', it: 'Prezzo target', fr: 'Prix cible', de: 'Zielpreis' }[lang]}</label>
                      <input className="desk-input" defaultValue="260.00" />
                    </div>
                    <div className="desk-field" style={{ marginBottom: 0 }}>
                      <label>{{ en: 'Condition', it: 'Condizione', fr: 'Condition', de: 'Bedingung' }[lang]}</label>
                      <select className="desk-input">
                        <option>CLOSE ≥ TARGET</option>
                        <option>CLOSE ≤ TARGET</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                    <div className="desk-switch-row">
                      <label className="desk-switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                      <span className="desk-switch-label">{{ en: 'Directional classifier probability', it: 'Probabilità direzionale del classificatore', fr: 'Probabilité directionnelle du classificateur', de: 'Direktionale Klassifikator-Wahrscheinlichkeit' }[lang]}</span>
                    </div>
                    <div className="desk-switch-row">
                      <label className="desk-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                      <span className="desk-switch-label">{{ en: 'Reuse cache', it: 'Riutilizza cache', fr: 'Réutiliser le cache', de: 'Cache wiederverwenden' }[lang]}</span>
                    </div>
                  </div>

                  <button className="btn btn-gold" style={{ width: '100%', marginTop: 22 }}>
                    {{ en: 'Run backtest', it: 'Avvia backtest', fr: 'Lancer le backtest', de: 'Backtest starten' }[lang]}
                  </button>
                </>)
              }
            </div>

            {/* CENTER: results */}
            <div className="panel">
              <div className="desk-panel-head">
                <div>
                  <div className="desk-title">{{ en: 'Results', it: 'Risultati', fr: 'Résultats', de: 'Ergebnisse' }[lang]}</div>
                  <div className="desk-sub">{{ en: 'Executive summary', it: 'Riepilogo esecutivo', fr: 'Résumé exécutif', de: 'Zusammenfassung' }[lang]} · AAPL · 2026-05-27</div>
                </div>
                <span className="mono" style={{ fontSize: 13, padding: '4px 10px', border: `1px solid ${tab === 'live' ? 'var(--gold-dim)' : '#ffc107'}`, color: tab === 'live' ? 'var(--gold-primary)' : '#ffc107', borderRadius: 4, letterSpacing: '0.14em' }}>{tab === 'live' ? 'LIVE' : 'BACKTEST'}</span>
              </div>

              {tab === 'sim' &&
              <div style={{
                marginBottom: 14, padding: '10px 14px',
                border: '1px solid rgba(255,193,7,0.25)',
                borderRadius: 6,
                background: 'rgba(255,193,7,0.06)',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em',
                color: '#ffc107', lineHeight: 1.5,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                  <span style={{ fontSize: 14 }}>⚠</span>
                  {{ en: 'Backtest · Forecast $248.40 vs actual $251.12 (—1.1%)', it: 'Backtest · Previsione $248.40 vs reale $251.12 (—1.1%)', fr: 'Backtest · Prévision $248.40 vs réel $251.12 (—1.1%)', de: 'Backtest · Prognose $248.40 vs Ist $251.12 (—1.1%)' }[lang]}
                </div>
              }

              <div className="kpi-grid">
                <div className="kpi-card primary">
                  <div className="kpi-label">{{ en: 'Forecast price', it: 'Prezzo previsto', fr: 'Prix prévu', de: 'Prognostizierter Preis' }[lang]}</div>
                  <div className="kpi-value">$248.40</div>
                  <div className="kpi-meta">+12.8% vs spot · 218d</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">{{ en: 'Prediction interval 80%', it: 'Intervallo di predizione 80%', fr: 'Intervalle de prédiction 80%', de: 'Prognoseintervall 80%' }[lang]}</div>
                  <div className="kpi-value">$211 – $282</div>
                  <div className="kpi-meta">{{ en: 'Calibrated', it: 'Calibrato', fr: 'Calibré', de: 'Kalibriert' }[lang]}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">{{ en: 'Horizon', it: 'Orizzonte', fr: 'Horizon', de: 'Horizont' }[lang]}</div>
                  <div className="kpi-value">218d</div>
                  <div className="kpi-meta">{{ en: 'To target date', it: 'Alla data obiettivo', fr: 'À la date cible', de: 'Bis Zieldatum' }[lang]}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Bias</div>
                  <div className="kpi-value" style={{ color: 'var(--neutral)' }}>—2.1%</div>
                  <div className="kpi-meta">Under-pred</div>
                </div>
              </div>

              <div style={{ marginTop: 18, border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '14px 14px 8px', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>{{ en: 'Forecast · to target date', it: 'Previsione · alla data obiettivo', fr: 'Prévision · à la date cible', de: 'Prognose · bis Zieldatum' }[lang]}</div>
                <HeroChart />
              </div>
            </div>

            {/* RIGHT: detail */}
            <div className="panel">
              <div className="desk-panel-head">
                <div>
                  <div className="desk-title">{{ en: 'Detail', it: 'Dettaglio', fr: 'Détail', de: 'Detail' }[lang]}</div>
                  <div className="desk-sub">{{ en: 'Models · charts · report', it: 'Modelli · grafici · report', fr: 'Modèles · graphiques · rapport', de: 'Modelle · Grafiken · Bericht' }[lang]}</div>
                </div>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-light)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>{{ en: 'Model weights', it: 'Pesi dei modelli', fr: 'Poids des modèles', de: 'Modellgewichte' }[lang]}</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {[
                ['SARIMA', 0.19], ['ETS', 0.16], ['Prophet', 0.14],
                ['TBATS', 0.12], ['Theta', 0.11], ['LightGBM', 0.10],
                ['CatBoost', 0.09], ['NBEATS', 0.09]].
                map(([n, w]) =>
                <div key={n} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 38px', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-main)' }}>{n}</span>
                    <span style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <span style={{ display: 'block', width: `${w * 100 * 4}%`, maxWidth: '100%', height: '100%', background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-primary))' }} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-primary)', textAlign: 'right' }}>{(w * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>



              <div style={{ marginTop: 16, padding: 14, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 6 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{{ en: 'Range diagnostics', it: 'Diagnostica range', fr: 'Diagnostics fourchette', de: 'Spannen-Diagnostik' }[lang]}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>HIT-RATE 80%</div>
                    <div style={{ fontSize: 15, marginTop: 4, color: 'var(--gold-primary)' }}>81.4%</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>AVG ERROR</div>
                    <div style={{ fontSize: 15, marginTop: 4 }}>4.8%</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>METHOD</div>
                    <div style={{ fontSize: 13, marginTop: 4, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>Asymmetric</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>RESIDUALS</div>
                    <div style={{ fontSize: 13, marginTop: 4, fontFamily: 'var(--font-mono)' }}>n = 218</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  P(price ≥ $260) — <span style={{ color: 'var(--gold-primary)' }}>64%</span> · P($240 ≤ price ≤ $270) — <span style={{ color: 'var(--gold-primary)' }}>41%</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay="2">
          <div style={{
            marginTop: 18,
            padding: '10px 16px',
            background: 'rgba(212,175,55,0.03)',
            border: '1px dashed var(--border-gold)',
            borderRadius: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-faint)',
            letterSpacing: '0.08em',
            lineHeight: 1.5,
            textAlign: 'center'
          }}>
            ⚠ {t('ui_disclaimer')}
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ============================================================
   DISTRIBUTION & ACCESS
   ============================================================ */
function DistributionAccess() {
  const { lang } = useLanguage();
  const L = (o) => o[lang] || o.en;
  const a = {
    eyebrow: { en: 'Distribution & access', it: 'Distribuzione e accesso', fr: 'Distribution et accès', de: 'Vertrieb und Zugang' },
    h2: { en: 'A Windows desktop application, from the Microsoft Store.', it: 'Un\u2019applicazione desktop Windows, dal Microsoft Store.', fr: 'Une application de bureau Windows, depuis le Microsoft Store.', de: 'Eine Windows-Desktopanwendung, aus dem Microsoft Store.' },
    lede: { en: 'Previsio will be available as a Windows desktop application through the Microsoft Store. After the service is activated, the client receives credentials and instructions from Previsio to access the platform. In the standard configuration, datasets, models, quantitative calculations and reports are processed on the user\u2019s own device.', it: 'Previsio sarà disponibile come applicazione desktop Windows tramite Microsoft Store. Dopo l\u2019attivazione del servizio, il cliente riceverà da Previsio le credenziali e le istruzioni necessarie per accedere alla piattaforma. Dataset, modelli, calcoli quantitativi e report vengono elaborati sul dispositivo dell\u2019utente nella configurazione standard.', fr: 'Previsio sera disponible sous forme d\u2019application de bureau Windows via le Microsoft Store. Après l\u2019activation du service, le client reçoit de Previsio les identifiants et les instructions nécessaires pour accéder à la plateforme. Dans la configuration standard, les jeux de données, les modèles, les calculs quantitatifs et les rapports sont traités sur l\u2019appareil de l\u2019utilisateur.', de: 'Previsio wird als Windows-Desktopanwendung über den Microsoft Store verfügbar sein. Nach der Aktivierung des Dienstes erhält der Kunde von Previsio die Zugangsdaten und Anweisungen für den Zugriff auf die Plattform. In der Standardkonfiguration werden Datensätze, Modelle, quantitative Berechnungen und Berichte auf dem Gerät des Nutzers verarbeitet.' }
  };
  const steps = [
  { n: '01', t: { en: 'Windows desktop app', it: 'App desktop Windows', fr: 'App de bureau Windows', de: 'Windows-Desktop-App' }, d: { en: 'Previsio is a Windows desktop application \u2014 no browser tab, no remote session.', it: 'Previsio è un\u2019applicazione desktop Windows \u2014 nessuna scheda del browser, nessuna sessione remota.', fr: 'Previsio est une application de bureau Windows \u2014 pas d\u2019onglet de navigateur, pas de session distante.', de: 'Previsio ist eine Windows-Desktopanwendung \u2014 kein Browser-Tab, keine Remote-Sitzung.' } },
  { n: '02', t: { en: 'Download from Microsoft Store', it: 'Download dal Microsoft Store', fr: 'Téléchargement depuis le Microsoft Store', de: 'Download aus dem Microsoft Store' }, d: { en: 'Once published, the client will be able to download Previsio from the Microsoft Store and install it directly on their computer.', it: 'Una volta pubblicato, il cliente potrà scaricare Previsio dal Microsoft Store e installarlo direttamente sul proprio computer.', fr: 'Une fois publié, le client pourra télécharger Previsio depuis le Microsoft Store et l\u2019installer directement sur son ordinateur.', de: 'Nach der Veröffentlichung kann der Kunde Previsio aus dem Microsoft Store herunterladen und direkt auf seinem Computer installieren.' } },
  { n: '03', t: { en: 'Credentials from Previsio', it: 'Credenziali da Previsio', fr: 'Identifiants fournis par Previsio', de: 'Zugangsdaten von Previsio' }, d: { en: 'Once the service is activated, Previsio issues the credentials and instructions needed to sign in.', it: 'Ad attivazione avvenuta, Previsio fornisce le credenziali e le istruzioni necessarie per accedere.', fr: 'Une fois le service activé, Previsio fournit les identifiants et les instructions nécessaires pour se connecter.', de: 'Nach der Aktivierung des Dienstes stellt Previsio die für die Anmeldung erforderlichen Zugangsdaten und Anweisungen bereit.' } },
  { n: '04', t: { en: 'Local execution', it: 'Esecuzione locale', fr: 'Exécution locale', de: 'Lokale Ausführung' }, d: { en: 'In the standard configuration, the engine runs on the user\u2019s own device \u2014 datasets, models, calculations and reports stay on that machine.', it: 'Nella configurazione standard, il motore gira sul dispositivo dell\u2019utente \u2014 dataset, modelli, calcoli e report restano su quella macchina.', fr: 'Dans la configuration standard, le moteur s\u2019exécute sur l\u2019appareil de l\u2019utilisateur \u2014 jeux de données, modèles, calculs et rapports restent sur cette machine.', de: 'In der Standardkonfiguration läuft die Engine auf dem Gerät des Nutzers \u2014 Datensätze, Modelle, Berechnungen und Berichte bleiben auf diesem Rechner.' } }];

  return (
    <section id="distribution">
      <div className="container">
        <Reveal className="section-head" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{L(a.eyebrow)}</span>
          <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>{L(a.h2)}</h2>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '64ch', textAlign: 'center' }}>{L(a.lede)}</p>
        </Reveal>
        <div className="stages">
          {steps.map((s, i) =>
          <Reveal key={s.n} className="stage" data-delay={String(i + 1)}>
              <span className="stage-num">{s.n}</span>
              <div>
                <div className="stage-name">{L(s.t)}</div>
                <div className="stage-desc">{L(s.d)}</div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ============================================================
   PRICING
   ============================================================ */
function Pricing() {
  const { lang, t } = useLanguage();

  return (
    <section id="pricing">
      <div className="container">
        <Reveal className="section-head" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{t('pricing_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
            {t('pricing_h2')}
          </h2>
          <p className="lede" style={{ margin: '0 auto', textAlign: 'center' }}>
            {t('pricing_lede')}
          </p>
        </Reveal>

        <Reveal variant="up" delay={2}>
          <p
            className="display"
            style={{
              maxWidth: 640,
              margin: '40px auto 0',
              textAlign: 'center',
              fontSize: 'clamp(18px, 2vw, 22px)',
              fontWeight: 300,
              lineHeight: 1.5,
              color: 'var(--gold-light)'
            }}>
            {t('pricing_statement')}
          </p>

          <p
            style={{
              maxWidth: 'fit-content',
              margin: '16px auto 0',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              letterSpacing: '0.04em',
              color: 'var(--gold-primary)',
              padding: '8px 20px',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(212,175,55,0.07)'
            }}>
            {t('pricing_starting')}
          </p>

          <p style={{ maxWidth: 640, margin: '18px auto 0', textAlign: 'center', fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>
            {{
              en: 'Local configuration via Ollama is the standard mode. Any integration with cloud AI providers, private endpoints or dedicated infrastructure is quoted separately based on the provider chosen, usage volumes and security and compliance requirements.',
              it: 'La configurazione locale tramite Ollama è la modalità standard. Eventuali integrazioni con provider AI cloud, endpoint privati o infrastrutture dedicate vengono quotate separatamente in base al provider scelto, ai volumi di utilizzo e ai requisiti di sicurezza e compliance.',
              fr: 'La configuration locale via Ollama est le mode standard. Toute intégration avec des fournisseurs d\u2019IA cloud, des endpoints privés ou des infrastructures dédiées est chiffrée séparément selon le fournisseur choisi, les volumes d\u2019utilisation et les exigences de sécurité et de conformité.',
              de: 'Die lokale Konfiguration über Ollama ist der Standardmodus. Etwaige Integrationen mit Cloud-KI-Anbietern, privaten Endpunkten oder dedizierter Infrastruktur werden separat angeboten, abhängig vom gewählten Anbieter, den Nutzungsvolumina und den Sicherheits- und Compliance-Anforderungen.'
            }[lang]}
          </p>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            {(({
              en: ['Individual professional', 'Team', 'Enterprise', 'White-label'],
              it: ['Professionista singolo', 'Team', 'Enterprise', 'White-label'],
              fr: ['Professionnel individuel', 'Équipe', 'Enterprise', 'White-label'],
              de: ['Einzelprofessioneller', 'Team', 'Enterprise', 'White-label']
            })[lang] || ['Individual professional', 'Team', 'Enterprise', 'White-label']).map((s) =>
            <span key={s} style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em',
              padding: '5px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-gold)', color: 'var(--text-faint)',
              background: 'rgba(212,175,55,0.03)'
            }}>{s}</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="Request.html#contact"
              className="btn btn-gold btn-lg">
              
              {{ en: 'Request a quote', it: 'Richiedi preventivo', fr: 'Demander un devis', de: 'Angebot anfordern' }[lang]}
              <span className="arrow">→</span>
            </a>
            <a
              href="mailto:previsio.quant@gmail.com"
              className="btn btn-ghost btn-lg"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em' }}>
              
              previsio.quant@gmail.com
            </a>
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ============================================================
   TRUST & SECURITY
   ============================================================ */
function Trust() {
  const { lang, t } = useLanguage();
  const L = (o) => o[lang] || o.en;
  const pillars = [
  { i: '⌖',
    t: { en: 'Reproducible by construction', it: 'Riproducibile per costruzione', fr: 'Reproductible par conception', de: 'Reproduzierbar durch Konstruktion' },
    d: { en: 'Every forecast is keyed to its exact inputs — ticker, dates, data window, models and parameters. Given the same dataset, parameters and engine version, rerunning it weeks later returns the same quantitative outputs.', it: 'Ogni previsione è determinata dai suoi input esatti — ticker, date, finestra dati, modelli e parametri. A parità di dataset, parametri e versione del motore, rieseguendola settimane dopo si ottengono gli stessi output quantitativi.', fr: 'Chaque prévision est déterminée par ses entrées exactes — ticker, dates, fenêtre de données, modèles et paramètres. À dataset, paramètres et version du moteur identiques, la relancer des semaines plus tard produit les mêmes sorties quantitatives.', de: 'Jede Prognose ist durch ihre exakten Eingaben bestimmt — Ticker, Daten, Datenfenster, Modelle und Parameter. Bei gleichem Datensatz, gleichen Parametern und gleicher Engine-Version liefert ein erneuter Lauf Wochen später dieselben quantitativen Ausgaben.' } },
  { i: '⌬',
    t: { en: 'Every stage is traceable', it: 'Ogni fase è tracciabile', fr: 'Chaque étape est traçable', de: 'Jede Stufe ist nachvollziehbar' },
    d: { en: 'All nine pipeline stages emit a trace — inputs, weights, intermediate outputs and timings, available on request for any committee memo or compliance review.', it: 'Tutti e nove gli stadi della pipeline emettono una traccia — input, pesi, output intermedi e tempi, disponibile su richiesta per qualsiasi memo per il comitato o revisione di compliance.', fr: 'Les neuf étapes du pipeline émettent une trace — entrées, poids, sorties intermédiaires et temps, disponible sur demande pour tout mémo de comité ou revue de conformité.', de: 'Alle neun Pipeline-Stufen erzeugen eine Spur — Eingaben, Gewichte, Zwischenausgaben und Zeiten, auf Anfrage verfügbar für jedes Gremien-Memo oder jede Compliance-Prüfung.' } },
  { i: '⎈',
    t: { en: 'Processing stays within the configured perimeter', it: 'Elaborazione nel perimetro configurato', fr: 'Traitement dans le périmètre configuré', de: 'Verarbeitung innerhalb des konfigurierten Perimeters' },
    d: { en: 'Encrypted authentication with credentials kept out of every log. In the standard configuration, datasets and results stay within the client’s local environment. Any optional cloud services use only the content and data flows agreed before activation.', it: 'Autenticazione cifrata con credenziali tenute fuori da ogni log. Nella configurazione standard, i dataset e i risultati rimangono nell’ambiente locale del cliente. Eventuali servizi cloud opzionali utilizzano esclusivamente i contenuti e i flussi concordati prima dell’attivazione.', fr: 'Authentification chiffrée avec identifiants tenus hors de tout journal. Dans la configuration standard, les jeux de données et les résultats restent dans l’environnement local du client. Tout service cloud optionnel n’utilise que les contenus et flux convenus avant l’activation.', de: 'Verschlüsselte Authentifizierung, Anmeldedaten bleiben aus jedem Log heraus. In der Standardkonfiguration verbleiben Datensätze und Ergebnisse in der lokalen Umgebung des Kunden. Etwaige optionale Cloud-Dienste nutzen ausschließlich die vor der Aktivierung vereinbarten Inhalte und Datenflüsse.' } },
  { i: '⌭',
    t: { en: 'The AI interprets. The engine calculates.', it: 'L\u2019AI interpreta. Il motore calcola.', fr: 'L\u2019IA interprète. Le moteur calcule.', de: 'Die KI interpretiert. Die Engine berechnet.' },
    d: { en: 'Forecasts, intervals, probabilities, weights and metrics are produced exclusively by Previsio\u2019s quantitative engine. In the standard configuration, the narrative commentary is generated locally via Ollama using only results already computed by the platform. The AI is never a source of numbers.', it: 'Forecast, intervalli, probabilità, pesi e metriche sono prodotti esclusivamente dal motore quantitativo di Previsio. Nella configurazione standard, il commento narrativo viene generato localmente tramite Ollama utilizzando soltanto risultati già calcolati dalla piattaforma. L\u2019AI non è mai una fonte di numeri.', fr: 'Prévisions, intervalles, probabilités, poids et métriques sont produits exclusivement par le moteur quantitatif de Previsio. Dans la configuration standard, le commentaire narratif est généré localement via Ollama en utilisant uniquement des résultats déjà calculés par la plateforme. L\u2019IA n\u2019est jamais une source de chiffres.', de: 'Prognosen, Intervalle, Wahrscheinlichkeiten, Gewichte und Metriken werden ausschließlich von Previsios quantitativer Engine erzeugt. In der Standardkonfiguration wird der narrative Kommentar lokal über Ollama generiert und nutzt dabei nur bereits von der Plattform berechnete Ergebnisse. Die KI ist niemals eine Quelle für Zahlen.' } }];

  const cap = {
    h: { en: 'Provenance you can hand to compliance', it: 'Provenienza che potete consegnare alla compliance', fr: 'Une provenance à remettre à la conformité', de: 'Provenienz, die Sie der Compliance übergeben können' },
    b: { en: 'A real run leaves a complete, timestamped trace. Every stage is logged and reproducible — so any forecast in a memo can be reconstructed and defended months later.', it: 'Ogni esecuzione lascia una traccia completa e con timestamp. Ogni fase è registrata e riproducibile — così qualsiasi previsione in un memo può essere ricostruita e difesa mesi dopo.', fr: 'Chaque exécution laisse une trace complète et horodatée. Chaque étape est journalisée et reproductible — ainsi toute prévision dans un mémo peut être reconstruite et défendue des mois plus tard.', de: 'Jeder Lauf hinterlässt eine vollständige, mit Zeitstempel versehene Spur. Jede Stufe ist protokolliert und reproduzierbar — so kann jede Prognose in einem Memo Monate später rekonstruiert und verteidigt werden.' } };

  const iconBox = {
    width: 46, height: 46, flexShrink: 0,
    border: '1px solid var(--border-gold)', borderRadius: 10,
    display: 'grid', placeItems: 'center',
    color: 'var(--gold-primary)', background: 'rgba(212,175,55,0.04)',
    fontSize: 21
  };

  return (
    <section id="trust">
      <div className="container">
        <Reveal className="section-head" style={{ maxWidth: 860, margin: '0 auto 48px', textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{t('trust_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>{t('trust_h2')}</h2>
          <p className="lede" style={{ margin: '0 auto', maxWidth: '62ch', textAlign: 'center' }}>
            {t('trust_lede')} <em style={{ color: 'var(--gold-light)' }}>{t('trust_lede_em')}</em>.
          </p>
        </Reveal>

        {/* Trust pillars */}
        <div className="use-grid" style={{ maxWidth: 980, margin: '0 auto 56px' }}>
          {pillars.map((p, i) =>
          <Reveal key={i} delay={String((i % 2) + 1)} className="card" style={{ padding: '26px 26px', display: 'grid', gap: 14, alignContent: 'start' }}>
              <div style={iconBox}>{p.i}</div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px', letterSpacing: '0.02em', color: 'var(--text-main)' }}>{L(p.t)}</h4>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>{L(p.d)}</p>
              </div>
            </Reveal>
          )}
        </div>

        {/* Provenance proof — live audit trace */}
        <div className="trust-grid" style={{ maxWidth: 980, margin: '0 auto' }}>
          <Reveal variant="left">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold-primary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
              {{ en: 'Audit trace', it: 'Traccia di audit', fr: 'Trace d\u2019audit', de: 'Audit-Spur' }[lang]}
            </div>
            <h3 className="display" style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 300, margin: '0 0 16px', lineHeight: 1.2 }}>{L(cap.h)}</h3>
            <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0, maxWidth: '46ch' }}>{L(cap.b)}</p>
          </Reveal>

          <Reveal delay="2" variant="right">
            <div className="panel trust-cert">
              <div>
                <div className="fp-title">Audit trace · AAPL/218d</div>
                <div className="fp-sub">Run #af3-2c91</div>
              </div>
              <div>
                {[['STAGE 01', { en: 'Data — 5,420 pts loaded', it: 'Dati — 5.420 punti caricati', fr: 'Données — 5 420 pts chargés', de: 'Daten — 5.420 Punkte geladen' }[lang], '0.41s'],
                ['STAGE 02', { en: 'Context — long horizon', it: 'Contesto — orizzonte lungo', fr: 'Contexte — horizon long', de: 'Kontext — langer Horizont' }[lang], '0.02s'],
                ['STAGE 03', { en: 'Weights — backtest OK', it: 'Pesi — backtest OK', fr: 'Poids — backtest OK', de: 'Gewichte — Backtest OK' }[lang], '8.31s'],
                ['STAGE 04', { en: 'Models — 8/8 succeeded', it: 'Modelli — 8/8 riusciti', fr: 'Modèles — 8/8 réussis', de: 'Modelle — 8/8 erfolgreich' }[lang], '4.18s'],
                ['STAGE 05', { en: 'PI — calibrated empirically', it: 'PI — calibrato empiricamente', fr: 'PI — calibré empiriquement', de: 'PI — empirisch kalibriert' }[lang], '0.91s'],
                ['STAGE 06', { en: 'Metrics — Avg error 4.8%', it: 'Metriche — Errore medio 4.8%', fr: 'Métriques — Erreur moy. 4.8%', de: 'Metriken — Durchschn. Fehler 4.8%' }[lang], '0.05s'],
                ['STAGE 07', { en: 'Results — structured output', it: 'Risultati — output strutturato', fr: 'Résultats — sortie structurée', de: 'Ergebnisse — strukturierte Ausgabe' }[lang], '0.02s'],
                ['STAGE 08', { en: 'AI — narrative commentary', it: 'AI — commento narrativo', fr: 'IA — commentaire narratif', de: 'KI — narrativer Kommentar' }[lang], '6.20s'],
                ['STAGE 09', { en: 'Report — DOCX × 4 langs', it: 'Report — DOCX × 4 lingue', fr: 'Rapport — DOCX × 4 langues', de: 'Bericht — DOCX × 4 Sprachen' }[lang], '1.71s']].
                map(([s, l, v]) =>
                <div className="audit-line" key={s}>
                    <span className="ck">✓</span>
                    <span><span style={{ color: 'var(--gold-primary)' }}>{s}</span> · <span className="val">{l}</span></span>
                    <span className="val">{v}</span>
                  </div>
                )}
                <div className="audit-line">
                  <span className="ck" style={{ color: 'var(--gold-light)' }}>Σ</span>
                  <span className="lab">{{ en: 'Total runtime', it: 'Tempo totale', fr: 'Durée totale', de: 'Gesamtlaufzeit' }[lang]}</span>
                  <span style={{ color: 'var(--gold-primary)' }}>{{ en: 'logged', it: 'tracciato', fr: 'tracé', de: 'protokolliert' }[lang]}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

}

/* ============================================================
   AI PROCESSING — local Ollama disclosure + optional cloud config
   ============================================================ */
function AIProcessing() {
  const { lang } = useLanguage();
  const L = (o) => o[lang] || o.en;
  const [openDetail, setOpenDetail] = useState(false);

  const local = {
    eyebrow: { en: 'LOCAL AI · STANDARD CONFIGURATION', it: 'AI LOCALE · CONFIGURAZIONE STANDARD', fr: 'IA LOCALE · CONFIGURATION STANDARD', de: 'LOKALE KI · STANDARDKONFIGURATION' },
    h: { en: 'Narrative commentary generated on the client\u2019s device.', it: 'Commento narrativo generato sul dispositivo del cliente.', fr: 'Commentaire narratif généré sur l\u2019appareil du client.', de: 'Narrativer Kommentar, generiert auf dem Gerät des Kunden.' },
    b: { en: 'In Previsio\u2019s standard configuration, the generative component runs locally via Ollama. It receives exclusively the information already produced by the engine and necessary to draft the commentary — such as ticker, dates, forecast, intervals, probabilities and diagnostics — without recalculating or modifying them. This content is not sent to external AI providers.', it: 'Nella configurazione standard di Previsio, la componente generativa viene eseguita localmente tramite Ollama. Riceve esclusivamente le informazioni già prodotte dal motore e necessarie alla redazione del commento — come ticker, date, forecast, intervalli, probabilità e diagnostica — senza ricalcolarle o modificarle. Questi contenuti non vengono inviati a provider AI esterni.', fr: 'Dans la configuration standard de Previsio, le composant génératif est exécuté localement via Ollama. Il reçoit exclusivement les informations déjà produites par le moteur et nécessaires à la rédaction du commentaire — comme le ticker, les dates, la prévision, les intervalles, les probabilités et la diagnostique — sans les recalculer ni les modifier. Ces contenus ne sont pas envoyés à des fournisseurs d\u2019IA externes.', de: 'In der Standardkonfiguration von Previsio läuft die generative Komponente lokal über Ollama. Sie erhält ausschließlich die vom Engine bereits erzeugten und für die Kommentarerstellung notwendigen Informationen — wie Ticker, Daten, Prognose, Intervalle, Wahrscheinlichkeiten und Diagnostik — ohne sie neu zu berechnen oder zu verändern. Diese Inhalte werden nicht an externe KI-Anbieter gesendet.' },
    items: [
    { t: { en: '01 — Separation of roles', it: '01 — Separazione dei ruoli', fr: '01 — Séparation des rôles', de: '01 — Trennung der Rollen' },
      d: { en: 'The quantitative code produces every value. Ollama only turns the available results into a narrative explanation.', it: 'Il codice quantitativo produce tutti i valori. Ollama trasforma esclusivamente i risultati disponibili in una spiegazione narrativa.', fr: 'Le code quantitatif produit toutes les valeurs. Ollama transforme exclusivement les résultats disponibles en une explication narrative.', de: 'Der quantitative Code erzeugt alle Werte. Ollama wandelt ausschließlich die verfügbaren Ergebnisse in eine narrative Erklärung um.' } },
    { t: { en: '02 — Can be disabled', it: '02 — Funzione disattivabile', fr: '02 — Fonction désactivable', de: '02 — Abschaltbare Funktion' },
      d: { en: 'The AI commentary can be disabled without changing forecasts, probabilities, diagnostics, charts or report generation.', it: 'Il commento AI può essere disabilitato senza modificare forecast, probabilità, diagnostica, grafici o generazione del report.', fr: 'Le commentaire IA peut être désactivé sans modifier les prévisions, probabilités, diagnostics, graphiques ou la génération du rapport.', de: 'Der KI-Kommentar kann deaktiviert werden, ohne Prognosen, Wahrscheinlichkeiten, Diagnostik, Diagramme oder die Berichtserstellung zu verändern.' } },
    { t: { en: '03 — Operational continuity', it: '03 — Continuità operativa', fr: '03 — Continuité opérationnelle', de: '03 — Betriebskontinuität' },
      d: { en: 'If Ollama is unavailable or the text does not pass the platform\u2019s checks, Previsio uses a deterministic local narrative. Quantitative calculation is never interrupted.', it: 'Se Ollama non è disponibile o il testo non supera i controlli previsti, Previsio utilizza una narrativa deterministica locale. Il calcolo quantitativo non viene interrotto.', fr: 'Si Ollama n\u2019est pas disponible ou si le texte ne passe pas les contrôles prévus, Previsio utilise une narration déterministe locale. Le calcul quantitatif n\u2019est jamais interrompu.', de: 'Ist Ollama nicht verfügbar oder besteht der Text die vorgesehenen Kontrollen nicht, verwendet Previsio eine lokale, deterministische Erzählung. Die quantitative Berechnung wird nicht unterbrochen.' } }],

    detailQ: { en: 'What information does the AI component read?', it: 'Quali informazioni legge la componente AI?', fr: 'Quelles informations la composante IA reçoit-elle ?', de: 'Welche Informationen liest die KI-Komponente?' },
    detailA: { en: 'The model may receive the analyzed ticker, the reference and target dates, the point forecast, the last available close, the horizon, the prediction intervals, the publishable probabilities and the diagnostics needed for the explanation. All these elements have already been calculated and checked by the quantitative engine before the text is generated.', it: 'Il modello può ricevere il ticker analizzato, le date di riferimento e obiettivo, la previsione centrale, l\u2019ultima chiusura disponibile, l\u2019orizzonte, gli intervalli di predizione, le probabilità pubblicabili e le diagnostiche necessarie alla spiegazione. Tutti questi elementi sono già stati calcolati e controllati dal motore quantitativo prima della generazione del testo.', fr: 'Le modèle peut recevoir le ticker analysé, les dates de référence et cible, la prévision centrale, la dernière clôture disponible, l\u2019horizon, les intervalles de prédiction, les probabilités publiables et les diagnostics nécessaires à l\u2019explication. Tous ces éléments ont déjà été calculés et contrôlés par le moteur quantitatif avant la génération du texte.', de: 'Das Modell kann den analysierten Ticker, das Referenz- und Zieldatum, die Punktprognose, den letzten verfügbaren Schlusskurs, den Horizont, die Prognoseintervalle, die veröffentlichbaren Wahrscheinlichkeiten und die für die Erklärung nötige Diagnostik erhalten. Alle diese Elemente wurden bereits vom quantitativen Engine berechnet und geprüft, bevor der Text erzeugt wird.' },
    detailNote: { en: 'The AI receives values that have already been calculated in order to describe them; it does not originate, recalculate or modify them.', it: 'L\u2019AI riceve valori già calcolati per descriverli, ma non li origina, non li ricalcola e non li modifica.', fr: 'L\u2019IA reçoit des valeurs déjà calculées pour les décrire ; elle ne les crée pas, ne les recalcule pas et ne les modifie pas.', de: 'Die KI erhält bereits berechnete Werte, um sie zu beschreiben; sie erzeugt, berechnet oder verändert sie nicht neu.' }
  };

  const cloud = {
    eyebrow: { en: 'OPTIONAL CONFIGURATION · ADDITIONAL SERVICE', it: 'CONFIGURAZIONE OPZIONALE · SERVIZIO AGGIUNTIVO', fr: 'CONFIGURATION OPTIONNELLE · SERVICE SUPPLÉMENTAIRE', de: 'OPTIONALE KONFIGURATION · ZUSATZLEISTUNG' },
    h: { en: 'Cloud AI provider chosen by the client.', it: 'Provider AI cloud scelto dal cliente.', fr: 'Fournisseur d\u2019IA cloud choisi par le client.', de: 'Vom Kunden gewählter Cloud-KI-Anbieter.' },
    b: { en: 'On request, Previsio can evaluate and set up a dedicated integration with a cloud AI provider selected or approved by the client, subject to technical and contractual feasibility review. This configuration is separate from the standard local mode and may involve an additional cost.', it: 'Su richiesta, Previsio può valutare e predisporre un\u2019integrazione dedicata con un provider AI cloud selezionato o approvato dal cliente, previa verifica di fattibilità tecnica e contrattuale. Questa configurazione è separata dalla modalità locale standard e può comportare un costo aggiuntivo.', fr: 'Sur demande, Previsio peut évaluer et mettre en place une intégration dédiée avec un fournisseur d\u2019IA cloud sélectionné ou approuvé par le client, sous réserve d\u2019une vérification de faisabilité technique et contractuelle. Cette configuration est distincte du mode local standard et peut entraîner un coût supplémentaire.', de: 'Auf Anfrage kann Previsio eine dedizierte Integration mit einem vom Kunden ausgewählten oder genehmigten Cloud-KI-Anbieter prüfen und einrichten, vorbehaltlich einer technischen und vertraglichen Machbarkeitsprüfung. Diese Konfiguration ist von der lokalen Standardmethode getrennt und kann zusätzliche Kosten verursachen.' },
    items: [
    { t: { en: 'Agreed provider', it: 'Provider concordato', fr: 'Fournisseur convenu', de: 'Vereinbarter Anbieter' },
      d: { en: 'The provider, model and endpoint are defined together with the client based on technical, security and compliance requirements.', it: 'Il provider, il modello e l\u2019endpoint vengono definiti insieme al cliente in base ai requisiti tecnici, di sicurezza e di compliance.', fr: 'Le fournisseur, le modèle et l\u2019endpoint sont définis avec le client en fonction des exigences techniques, de sécurité et de conformité.', de: 'Anbieter, Modell und Endpunkt werden gemeinsam mit dem Kunden auf Basis der technischen, sicherheits- und compliance-relevanten Anforderungen festgelegt.' } },
    { t: { en: 'Documented data flow', it: 'Flusso dati documentato', fr: 'Flux de données documenté', de: 'Dokumentierter Datenfluss' },
      d: { en: 'Before activation, the transmitted content, retention conditions, processing location and the provider\u2019s applicable terms are specified.', it: 'Prima dell\u2019attivazione vengono specificati i contenuti trasmessi, le condizioni di conservazione, la localizzazione del trattamento e i termini applicabili del provider.', fr: 'Avant l\u2019activation, les contenus transmis, les conditions de conservation, la localisation du traitement et les conditions applicables du fournisseur sont précisés.', de: 'Vor der Aktivierung werden die übermittelten Inhalte, die Aufbewahrungsbedingungen, der Verarbeitungsort und die geltenden Bedingungen des Anbieters festgelegt.' } },
    { t: { en: 'Unchanged engine', it: 'Motore invariato', fr: 'Moteur inchangé', de: 'Unveränderte Engine' },
      d: { en: 'Even in the cloud configuration, forecasts, probabilities, intervals, weights and metrics continue to be calculated exclusively by Previsio\u2019s quantitative engine.', it: 'Anche nella configurazione cloud, forecast, probabilità, intervalli, pesi e metriche continuano a essere calcolati esclusivamente dal motore quantitativo di Previsio.', fr: 'Même dans la configuration cloud, les prévisions, probabilités, intervalles, poids et métriques continuent d\u2019être calculés exclusivement par le moteur quantitatif de Previsio.', de: 'Auch in der Cloud-Konfiguration werden Prognosen, Wahrscheinlichkeiten, Intervalle, Gewichte und Metriken weiterhin ausschließlich von Previsios quantitativer Engine berechnet.' } },
    { t: { en: 'Separate cost', it: 'Costo separato', fr: 'Coût séparé', de: 'Separate Kosten' },
      d: { en: 'Any use of cloud providers, dedicated infrastructure, API consumption and configuration work is not included in the standard price and is defined in the commercial proposal.', it: 'L\u2019eventuale utilizzo di provider cloud, infrastrutture dedicate, consumo API e attività di configurazione non è incluso nel prezzo standard e viene definito nella proposta commerciale.', fr: 'L\u2019utilisation éventuelle de fournisseurs cloud, d\u2019infrastructures dédiées, de consommation d\u2019API et d\u2019activités de configuration n\u2019est pas incluse dans le prix standard et est définie dans la proposition commerciale.', de: 'Eine etwaige Nutzung von Cloud-Anbietern, dedizierter Infrastruktur, API-Verbrauch und Konfigurationsarbeiten ist nicht im Standardpreis enthalten und wird im kommerziellen Angebot festgelegt.' } }]

  };

  const itemGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 };

  return (
    <section id="ai-processing">
      <div className="container">
        <div className="panel" style={{ maxWidth: 980, margin: '0 auto', padding: 'clamp(28px, 4vw, 44px)', borderColor: 'var(--border-gold)' }}>
          <span className="eyebrow no-rule" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold-primary)', letterSpacing: '0.2em' }}>{L(local.eyebrow)}</span>
          <h3 className="display" style={{ fontSize: 'clamp(22px, 2.6vw, 32px)', fontWeight: 300, margin: '14px 0 16px', lineHeight: 1.25 }}>{L(local.h)}</h3>
          <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0, maxWidth: '68ch' }}>{L(local.b)}</p>

          <div style={itemGrid}>
            {local.items.map((it, i) =>
            <div key={i} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--gold-light)', marginBottom: 8 }}>{L(it.t)}</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>{L(it.d)}</p>
            </div>
            )}
          </div>

          <div style={{ marginTop: 26, borderTop: '1px solid var(--border-subtle)', paddingTop: 18 }}>
            <button
              onClick={() => setOpenDetail((v) => !v)}
              style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontSize: 12.5, letterSpacing: '0.03em', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ transform: openDetail ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', display: 'inline-block' }}>›</span>
              {L(local.detailQ)}
            </button>
            {openDetail &&
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, maxWidth: '66ch' }}>{L(local.detailA)}</p>
              <p style={{ fontSize: 13.5, color: 'var(--gold-light)', lineHeight: 1.7, margin: '12px 0 0', maxWidth: '66ch' }}>{L(local.detailNote)}</p>
            </div>}
          </div>
        </div>

        <div className="card" style={{ maxWidth: 980, margin: '28px auto 0', padding: 'clamp(24px, 3.6vw, 36px)', background: 'transparent' }}>
          <span className="eyebrow no-rule" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.2em' }}>{L(cloud.eyebrow)}</span>
          <h4 style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 500, margin: '12px 0 14px', color: 'var(--text-main)' }}>{L(cloud.h)}</h4>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, maxWidth: '68ch' }}>{L(cloud.b)}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 22 }}>
            {cloud.items.map((it, i) =>
            <div key={i} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>{L(it.t)}</div>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{L(it.d)}</p>
            </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 740px) {
            #ai-processing .panel > div[style*="grid-template-columns: repeat(3"],
            #ai-processing .card > div[style*="grid-template-columns: repeat(2"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>);

}

/* ============================================================
   FAQ
   ============================================================ */
function FAQ() {
  const { lang, t } = useLanguage();
  const faqByLang = {
    en: [
    { q: 'What is Previsio?', a: 'Previsio (commercially Predictive Ensemble Pro) is a quantitative analysis and financial time-series forecasting platform. It combines up to eight forecasting models in a dynamically weighted ensemble, computes empirically calibrated prediction intervals and produces automated professional reports with AI commentary. Designed for quantitative analysts, portfolio managers and financial advisory firms who need explainable, reproducible and auditable forecasts on equities and cryptocurrencies.' },
    { q: 'Who is Previsio for?', a: 'Typical users include: quantitative analysts and researchers who need a robust ensemble benchmark; portfolio managers requiring forecasts with calibrated prediction intervals; financial advisory firms producing periodic client reports; family offices and wealth managers documenting their investment theses; risk managers who want explicit forward-looking probability distributions. It is not an automated trading tool or robo-advisor. It does not generate orders and does not interface with brokers.' },
    { q: 'How does a forecast work in practice?', a: 'When a forecast is launched, the engine runs a 9-stage pipeline: data acquisition and cleaning; context resolution (market calendar, horizon, regime); model backtest and weighting; parallel model execution; prediction interval construction; accuracy metrics and diagnostics; payload assembly; AI commentary generation; DOCX and HTML report generation. Progress is visible in real time via a live stream directly in the interface.' },
    { q: t('faq_duration_q'), a: 'Duration depends on the hardware, the forecast horizon, the compute profile, the amount of history and the models admitted. Progress is shown in real time in the interface.' },
    { q: 'Which models does Previsio use?', a: 'The ensemble can combine up to eight selectable forecasting models, depending on the horizon and minimum data requirements, plus 1 internal benchmark: SARIMA (statistical, log-return); Prophet (Facebook additive, log-price); TBATS (multiple seasonalities, log-price); ETS (exponential smoothing, log-price); Theta (SES with drift, log-price); LightGBM (gradient boosting, log-return); CatBoost (gradient boosting, log-return); NBEATS (deep learning via Darts, log-return); Naive (last price, internal benchmark only).' },
    { q: 'Are forecasts reproducible?', a: 'Yes. The backtest uses a deterministic seed derived from a SHA-256 hash of the ticker, target date, model name, backtest profile and data window. This guarantees that given the same inputs and price series state, weights and results are identical. To stabilise reproducibility over time you can also freeze the data cutoff via the max_data_date parameter.' },
    { q: 'What is produced at the end of a forecast?', a: 'Previsio produces two synchronised outputs: a DOCX report (professional Word document with tables, metrics, charts and AI commentary, ready to send or archive) and an interactive HTML report (the same information in a navigable web page with interactive charts). Both are truthful-only: charts contain exclusively the real historical series and the forecasts actually computed.' },
    { q: 'Are Previsio\'s forecasts investment advice?', a: 'No, under any circumstances. Previsio is a quantitative analysis tool. Its forecasts are probabilistic estimates based on historical data and statistical models. They do not constitute financial advice, personalised investment recommendation, or solicitation to buy or sell financial instruments. Past performance does not guarantee future results. Every investment decision is the sole responsibility of the user.' },
    { q: 'How accurate are the forecasts?', a: 'Accuracy varies depending on the asset, market regime, horizon, quality of available history and stability of the underlying process. The system does not promise accuracy: it reports the backtest metrics actually observed for that model, on that ticker, in that regime, so the user can form an informed judgement. On short horizons and stationary regimes forecasts are more reliable; on long horizons or in highly volatile markets, uncertainty grows and intervals widen accordingly.' },
    { q: 'What licence types are available?', a: 'Licences are sized for different usage scenarios: individual professional, team, on-premise enterprise deployment and white-label integration. For a tailored quote, contact the commercial team at previsio.quant@gmail.com.' }],

    it: [
    { q: 'Che cos\'è Previsio?', a: 'Previsio è una piattaforma di analisi quantitativa e previsione su serie storiche finanziarie. Combina fino a otto modelli previsionali in un ensemble dinamicamente ponderato, calcola intervalli di predizione calibrati empiricamente e produce report professionali automatizzati con commento AI. È progettata per analisti quantitativi, portfolio manager, desk di ricerca e società di consulenza finanziaria che hanno bisogno di forecast spiegabili, riproducibili e auditabili su azioni, indici, crypto e altri strumenti coperti dai dati caricati dall’utente.' },
    { q: 'A chi è rivolto Previsio?', a: 'Il pubblico tipico include: analisti quantitativi e ricercatori che hanno bisogno di un benchmark di ensemble robusto; portfolio manager che richiedono previsioni con intervalli di predizione calibrati; società di consulenza finanziaria che producono report cliente periodici; family office e wealth manager che documentano le proprie tesi di investimento; risk manager che vogliono distribuzioni di probabilità forward-looking esplicite. Non è uno strumento di trading automatico né un robo-advisor.' },
    { q: 'Come si svolge in pratica una previsione?', a: 'Quando si lancia una previsione, il motore esegue una pipeline a 9 stadi: acquisizione e pulizia dati; risoluzione del contesto (calendario di mercato, orizzonte, regime); backtest e pesatura dei modelli; esecuzione parallela dei modelli; costruzione degli intervalli di predizione; metriche di accuratezza e diagnostica; assemblaggio del payload; generazione del commento AI; generazione del report DOCX e HTML. Lo stato di avanzamento è visibile in tempo reale tramite stream direttamente nell\'interfaccia.' },
    { q: t('faq_duration_q'), a: 'La durata dipende dall’hardware, dall’orizzonte, dal profilo di calcolo, dalla quantità di storico e dai modelli ammessi. L’avanzamento viene mostrato in tempo reale nell’interfaccia.' },
    { q: 'Quali modelli usa Previsio?', a: 'L\'ensemble può combinare fino a otto modelli previsionali selezionabili, in funzione dell\'orizzonte e dei requisiti minimi di dati: SARIMA (statistico, log-return); Prophet (additivo, log-price); TBATS (stagionalità multiple, log-price); ETS (exponential smoothing, log-price); Theta (SES con drift, log-price); LightGBM (gradient boosting, log-return); CatBoost (gradient boosting, log-return); NBEATS (deep learning via Darts, log-return).' },
    { q: 'Le previsioni sono riproducibili?', a: 'Sì. Il backtest usa un seed deterministico derivato da un hash SHA-256 di ticker, data target, nome del modello, profilo di backtest e finestra dati. Questo garantisce che, a parità di input e stato della serie prezzi, pesi e risultati siano identici. Per stabilizzare la riproducibilità nel tempo si può congelare il taglio della storia con il parametro max_data_date.' },
    { q: 'Cosa viene prodotto al termine di una previsione?', a: 'Previsio produce due output sincronizzati: un report DOCX (documento Word professionale con tabelle, metriche, grafici e commento AI, pronto da inviare o archiviare) e un report HTML interattivo (la stessa informazione in una pagina web navigabile con grafici interattivi). Entrambi sono truthful-only: i grafici contengono esclusivamente la serie storica reale e le previsioni effettivamente calcolate.' },
    { q: 'Le previsioni di Previsio sono consigli di investimento?', a: 'No, in nessun caso. Previsio è uno strumento di analisi quantitativa. Le sue previsioni sono stime probabilistiche basate su dati storici e modelli statistici. Non costituiscono consulenza finanziaria, raccomandazione personalizzata di investimento, né sollecitazione all\'acquisto o alla vendita di strumenti finanziari. Performance passate non garantiscono risultati futuri. Ogni decisione di investimento è responsabilità esclusiva dell\'utente.' },
    { q: 'Quanto sono accurate le previsioni?', a: 'L\'accuratezza varia in funzione di asset, regime di mercato, orizzonte, qualità della storia disponibile e stabilità del processo sottostante. Il sistema non promette accuratezza: riporta le metriche di backtest realmente osservate per quel modello, su quel ticker, in quel regime, in modo che l\'utente possa formare un giudizio informato. Su orizzonti brevi e regimi stazionari le previsioni sono più affidabili; su orizzonti lunghi o mercati volatili, l\'incertezza cresce e gli intervalli si allargano.' },
    { q: 'Quali tipologie di licenza esistono?', a: 'Le licenze sono dimensionate per scenari d\'uso diversi: singolo professionista, team, deployment enterprise on-premise e integrazione white-label. Per una quotazione su misura, contattate il commerciale all\'indirizzo previsio.quant@gmail.com.' }],

    fr: [
    { q: 'Qu\'est-ce que Previsio ?', a: 'Previsio (commercialement Predictive Ensemble Pro) est une plateforme d\'analyse quantitative et de prévision sur séries temporelles financières. Il combine jusqu\'à huit modèles de prévision dans un ensemble dynamiquement pondéré, calcule des intervalles de prédiction calibrés empiriquement et produit des rapports professionnels automatisés avec commentaire IA. Conçu pour les analystes quantitatifs, gestionnaires de portefeuille et sociétés de conseil financier qui ont besoin de prévisions explicables, reproductibles et auditables sur actions et cryptomonnaies.' },
    { q: 'À qui s\'adresse Previsio ?', a: 'Les utilisateurs typiques incluent : analystes quantitatifs et chercheurs ayant besoin d\'un benchmark d\'ensemble robuste ; gestionnaires de portefeuille nécessitant des prévisions avec intervalles de prédiction calibrés ; sociétés de conseil financier produisant des rapports clients périodiques ; family offices et wealth managers documentant leurs thèses d\'investissement ; risk managers souhaitant des distributions de probabilité forward-looking explicites. Ce n\'est pas un outil de trading automatisé ni un robo-advisor.' },
    { q: 'Comment se déroule concrètement une prévision ?', a: 'Lorsqu\'une prévision est lancée, le moteur exécute un pipeline à 9 étapes : acquisition et nettoyage des données ; résolution du contexte (calendrier de marché, horizon, régime) ; backtest et pondération des modèles ; exécution parallèle des modèles ; construction des intervalles de prédiction ; métriques de précision et diagnostics ; assemblage du payload ; génération du commentaire IA ; génération du rapport DOCX et HTML. La progression est visible en temps réel via un flux direct dans l\'interface.' },
    { q: t('faq_duration_q'), a: 'La durée dépend du matériel, de l\'horizon, du profil de calcul, de la quantité d\'historique et des modèles admis. La progression s\'affiche en temps réel dans l\'interface.' },
    { q: 'Quels modèles Previsio utilise-t-il ?', a: 'L\'ensemble peut combiner jusqu\'à huit modèles de prévision sélectionnables, selon l\'horizon et les exigences minimales de données, plus 1 benchmark interne : SARIMA (statistique, log-return) ; Prophet (additif Facebook, log-price) ; TBATS (saisonnalités multiples, log-price) ; ETS (lissage exponentiel, log-price) ; Theta (SES avec dérive, log-price) ; LightGBM (gradient boosting, log-return) ; CatBoost (gradient boosting, log-return) ; NBEATS (deep learning via Darts, log-return) ; Naive (dernier prix, benchmark interne uniquement).' },
    { q: 'Les prévisions sont-elles reproductibles ?', a: 'Oui. Le backtest utilise un seed déterministe dérivé d\'un hash SHA-256 du ticker, de la date cible, du nom du modèle, du profil de backtest et de la fenêtre de données. Cela garantit qu\'à entrées et état de série identiques, les poids et résultats sont identiques. Pour stabiliser la reproductibilité dans le temps, vous pouvez figer la coupure de l\'historique via le paramètre max_data_date.' },
    { q: 'Que produit-on à la fin d\'une prévision ?', a: 'Previsio produit deux sorties synchronisées : un rapport DOCX (document Word professionnel avec tableaux, métriques, graphiques et commentaire IA, prêt à envoyer ou archiver) et un rapport HTML interactif (la même information dans une page web navigable). Les deux sont truthful-only : les graphiques contiennent exclusivement la série historique réelle et les prévisions effectivement calculées.' },
    { q: 'Les prévisions de Previsio sont-elles des conseils en investissement ?', a: 'Non, en aucun cas. Previsio est un outil d\'analyse quantitative. Ses prévisions sont des estimations probabilistes basées sur des données historiques et des modèles statistiques. Elles ne constituent pas un conseil financier, une recommandation d\'investissement personnalisée, ni une sollicitation à acheter ou vendre des instruments financiers. Les performances passées ne garantissent pas les résultats futurs. Chaque décision d\'investissement est la seule responsabilité de l\'utilisateur.' },
    { q: 'Quelle est la précision des prévisions ?', a: 'La précision varie selon l\'actif, le régime de marché, l\'horizon, la qualité de l\'historique disponible et la stabilité du processus sous-jacent. Le système ne promet pas de précision : il rapporte les métriques de backtest réellement observées pour ce modèle, sur ce ticker, dans ce régime, pour que l\'utilisateur puisse former un jugement éclairé. Sur des horizons courts et des régimes stationnaires les prévisions sont plus fiables ; sur des horizons longs ou en marchés très volatils, l\'incertitude croît et les intervalles s\'élargissent.' },
    { q: 'Quels types de licences existent ?', a: 'Les licences sont dimensionnées pour différents scénarios : professionnel individuel, équipe, déploiement enterprise on-premise et intégration white-label. Pour un devis sur mesure, contactez le service commercial à previsio.quant@gmail.com.' }],

    de: [
    { q: 'Was ist Previsio?', a: 'Previsio (kommerziell Predictive Ensemble Pro) ist eine Plattform für quantitative Analyse und Prognose von Finanzzeitreihen. Sie kombiniert bis zu acht Prognosemodelle in einem dynamisch gewichteten Ensemble, berechnet empirisch kalibrierte Vorhersageintervalle und erstellt automatisierte professionelle Berichte mit KI-Kommentar. Konzipiert für quantitative Analysten, Portfoliomanager und Finanzberatungsunternehmen, die erklärbare, reproduzierbare und prüfbare Prognosen für Aktien und Kryptowährungen benötigen.' },
    { q: 'Für wen ist Previsio gedacht?', a: 'Typische Nutzer sind: quantitative Analysten und Forscher, die einen robusten Ensemble-Benchmark benötigen; Portfoliomanager, die Prognosen mit kalibrierten Prognoseintervallen benötigen; Finanzberatungsunternehmen, die periodische Kundenberichte erstellen; Family Offices und Wealth Manager, die ihre Investitionsthesen dokumentieren; Risikomanager, die explizite vorausschauende Wahrscheinlichkeitsverteilungen wollen. Es ist kein automatisiertes Handelstool und kein Robo-Advisor.' },
    { q: 'Wie läuft eine Prognose in der Praxis ab?', a: 'Wenn eine Prognose gestartet wird, führt die Engine eine 9-stufige Pipeline aus: Datenakquisition und -bereinigung; Kontext-Auflösung (Marktkalender, Horizont, Regime); Modell-Backtest und Gewichtung; parallele Modellausführung; Vorhersageintervall-Konstruktion; Genauigkeitsmetriken und Diagnostik; Payload-Montage; KI-Kommentargenerierung; DOCX- und HTML-Berichtserstellung. Der Fortschritt ist in Echtzeit über einen Live-Stream direkt in der Oberfläche sichtbar.' },
    { q: t('faq_duration_q'), a: 'Die Dauer hängt von der Hardware, dem Horizont, dem Rechenprofil, der Menge des Verlaufs und den zugelassenen Modellen ab. Der Fortschritt wird in Echtzeit in der Oberfläche angezeigt.' },
    { q: 'Welche Modelle verwendet Previsio?', a: 'Das Ensemble kann je nach Horizont und Mindestdatenanforderungen bis zu acht wählbare Prognosemodelle kombinieren, plus 1 internen Benchmark: SARIMA (statistisch, Log-Return); Prophet (Facebook additiv, Log-Preis); TBATS (mehrfache Saisonalität, Log-Preis); ETS (exponentielles Glätten, Log-Preis); Theta (SES mit Drift, Log-Preis); LightGBM (Gradient Boosting, Log-Return); CatBoost (Gradient Boosting, Log-Return); NBEATS (Deep Learning via Darts, Log-Return); Naive (letzter Preis, nur interner Benchmark).' },
    { q: 'Sind Prognosen reproduzierbar?', a: 'Ja. Der Backtest verwendet einen deterministischen Seed, abgeleitet von einem SHA-256-Hash aus Ticker, Zieldatum, Modellname, Backtest-Profil und Datenfenster. Dies garantiert, dass bei gleichen Eingaben und gleichem Preisreihenzustand Gewichte und Ergebnisse identisch sind. Zur Stabilisierung der Reproduzierbarkeit über die Zeit kann der Datenschnitt über den max_data_date-Parameter eingefroren werden.' },
    { q: 'Was wird am Ende einer Prognose produziert?', a: 'Previsio produziert zwei synchronisierte Ausgaben: einen DOCX-Bericht (professionelles Word-Dokument mit Tabellen, Metriken, Diagrammen und KI-Kommentar, bereit zum Versand oder Archivieren) und einen interaktiven HTML-Bericht (dieselbe Information in einer navigierbaren Webseite). Beide sind truthful-only: Diagramme enthalten ausschließlich die echte historische Reihe und die tatsächlich berechneten Prognosen.' },
    { q: 'Sind Previsios Prognosen Anlageberatung?', a: 'Nein, unter keinen Umständen. Previsio ist ein quantitatives Analysetool. Seine Prognosen sind probabilistische Schätzungen basierend auf historischen Daten und statistischen Modellen. Sie stellen keine Finanzberatung, persönliche Anlageempfehlung oder Aufforderung zum Kauf oder Verkauf von Finanzinstrumenten dar. Vergangene Performance garantiert keine zukünftigen Ergebnisse. Jede Anlageentscheidung liegt in der alleinigen Verantwortung des Nutzers.' },
    { q: 'Wie genau sind die Prognosen?', a: 'Die Genauigkeit variiert je nach Asset, Marktregime, Horizont, Qualität der verfügbaren Historie und Stabilität des zugrunde liegenden Prozesses. Das System verspricht keine Genauigkeit: es berichtet die tatsächlich beobachteten Backtest-Metriken für dieses Modell, auf diesem Ticker, in diesem Regime. Auf kurzen Horizonten und in stationären Regimen sind Prognosen zuverlässiger; auf langen Horizonten oder in volatilen Märkten wächst die Unsicherheit und die Intervalle weiten sich entsprechend aus.' },
    { q: 'Welche Lizenztypen gibt es?', a: 'Lizenzen sind für verschiedene Nutzungsszenarien dimensioniert: Einzelprofessioneller, Team, On-Premise-Enterprise-Deployment und White-Label-Integration. Für ein maßgeschneidertes Angebot wenden Sie sich an previsio.quant@gmail.com.' }]

  };
  const items = faqByLang[lang] || faqByLang.en;
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
          {items.map((it, i) =>
          <div key={it.q} className={`faq-item ${open === i ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <h4>{it.q}</h4>
                <span className="toggle">+</span>
              </div>
              <div className="faq-a"><div className="faq-a-inner">{it.a}</div></div>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="faq.html" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {{ en: 'See all questions', it: 'Tutte le domande', fr: 'Toutes les questions', de: 'Alle Fragen' }[lang]}
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>);

}

/* ============================================================
   ABOUT FOUNDER
   ============================================================ */
function AboutFounder() {
  const { lang } = useLanguage();
  const isIt = lang === 'it';
  const isFr = lang === 'fr';
  const isDe = lang === 'de';

  const bio = {
    en: "My name is Fabrizio Midaglia and I founded Previsio, taking on directly both the product vision and its functional architecture. I created Previsio to turn quantitative analysis of financial markets into something clearer and more structured — a tool professionals can use to assess data, models and scenarios quickly and reliably. I bring to this project a background in Business Analytics for Management at LIUC Business University, with a focus on financial analysis, statistical modelling and AI-assisted software development. My goal is to build a solid, transparent and professional platform, able to generate automated reports and support the decision-making process without ever substituting the judgment of the analyst or the portfolio manager.",
    it: "Mi chiamo Fabrizio Midaglia e ho fondato Previsio, occupandomi direttamente della visione di prodotto e della sua architettura funzionale. Ho creato Previsio per trasformare l’analisi quantitativa dei mercati finanziari in uno strumento più chiaro e strutturato — pensato per professionisti che hanno bisogno di valutare dati, modelli e scenari in modo rapido e affidabile. Porto in questo percorso una formazione in Business Analytics for Management alla LIUC Business University, con un focus su analisi finanziaria, modellistica statistica e sviluppo software assistito da AI. Il mio obiettivo è costruire una piattaforma solida, trasparente e professionale, capace di generare report automatici e supportare il processo decisionale senza sostituirsi al giudizio dell’analista o del gestore.",
    fr: "Je m’appelle Fabrizio Midaglia et j’ai fondé Previsio, en prenant en charge directement la vision produit et son architecture fonctionnelle. J’ai créé Previsio pour transformer l’analyse quantitative des marchés financiers en un outil plus clair et plus structuré — pensé pour des professionnels qui doivent évaluer données, modèles et scénarios rapidement et de façon fiable. J’apporte à ce projet une formation en Business Analytics for Management à la LIUC Business University, avec un accent sur l’analyse financière, la modélisation statistique et le développement logiciel assisté par IA. Mon objectif est de construire une plateforme solide, transparente et professionnelle, capable de générer des rapports automatiques et de soutenir la prise de décision sans jamais se substituer au jugement de l’analyste ou du gérant.",
    de: "Mein Name ist Fabrizio Midaglia und ich habe Previsio gegründet, wobei ich mich direkt um die Produktvision und die funktionale Architektur kümmere. Ich habe Previsio geschaffen, um die quantitative Analyse der Finanzmärkte in ein klareres, strukturierteres Werkzeug zu verwandeln — gedacht für Fachleute, die Daten, Modelle und Szenarien schnell und verlässlich bewerten müssen. Ich bringe in dieses Projekt eine Ausbildung in Business Analytics for Management an der LIUC Business University ein, mit Fokus auf Finanzanalyse, statistische Modellierung und KI-gestützte Softwareentwicklung. Mein Ziel ist es, eine solide, transparente und professionelle Plattform aufzubauen, die automatisierte Berichte erstellen und den Entscheidungsprozess unterstützen kann, ohne je das Urteil des Analysten oder Portfoliomanagers zu ersetzen."
  };
  const teamLabel = { en: 'Development methodology', it: 'Metodologia di sviluppo', fr: 'Méthodologie de développement', de: 'Entwicklungsmethodik' };
  const teamTitle = {
  en: 'AI-assisted engineering, deterministic quantitative outputs.',
  it: 'Sviluppo assistito da AI, output quantitativi deterministici.',
  fr: 'Développement assisté par IA, sorties quantitatives déterministes.',
  de: 'KI-gestützte Entwicklung, deterministische quantitative Outputs.'
};
  const teamIntro = {
    en: "AI tools are used as engineering support for development, technical review and documentation. Forecasts, probabilities, metrics and calculations are produced by Previsio’s quantitative engine, not by generative AI. The platform keeps numerical computation, audit trail and narrative commentary clearly separated.",
    it: "Gli strumenti AI vengono utilizzati come supporto ingegneristico per sviluppo, revisione tecnica e documentazione. Forecast, probabilità, metriche e calcoli sono prodotti dal motore quantitativo di Previsio, non da AI generativa. La piattaforma mantiene separati calcolo numerico, audit trail e commento narrativo.",
    fr: "Les outils d’IA sont utilisés comme support d’ingénierie pour le développement, la revue technique et la documentation. Les prévisions, probabilités, métriques et calculs sont produits par le moteur quantitatif de Previsio, et non par l’IA générative. La plateforme sépare clairement calcul numérique, audit trail et commentaire narratif.",
    de: "KI-Tools werden als Engineering-Unterstützung für Entwicklung, technische Prüfung und Dokumentation eingesetzt. Forecasts, Wahrscheinlichkeiten, Kennzahlen und Berechnungen werden von der quantitativen Engine von Previsio erzeugt, nicht von generativer KI. Die Plattform trennt numerische Berechnung, Audit Trail und narrativen Kommentar klar voneinander."
  };
  const l = lang in bio ? lang : 'en';

  const aiColleagues = null; // replaced by single unified card



  return (
    <section id="about">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{isIt ? 'Il fondatore' : isFr ? 'Le fondateur' : isDe ? 'Der Gründer' : 'The founder'}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
            {isIt ? 'Visione, prodotto e architettura quantitativa.' : isFr ? 'Vision, produit et architecture quantitative.' : isDe ? 'Vision, Produkt und quantitative Architektur.' : 'Vision, product and quantitative architecture.'}
          </h2>
        </Reveal>

        <div className="about-grid">
          {/* ── LEFT: photo + certs ── */}
          <Reveal variant="left">
            <div className="about-photo-wrap">
              <div className="about-photo-card">
                <img
                  src={window.__resources && window.__resources.fabrizioPhoto || 'assets/fabrizio-midaglia.png'}
                  alt="Fabrizio Midaglia"
                  className="about-photo-img"
                  style={{ objectPosition: 'center 10%' }} />
                
                <div className="about-photo-name">Fabrizio Midaglia</div>
              </div>


            </div>
          </Reveal>

          {/* ── RIGHT: bio + AI team ── */}
          <div>
            <Reveal>
              <ExpandableText
                text={bio[l]}
                lines={3}
                className="about-bio"
                wrapperStyle={{ marginBottom: 32 }} />
              
            </Reveal>

            <Reveal delay="1">
              <div className="about-team-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-primary)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {teamLabel[l]}
                </div>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-main)', marginBottom: 10 }}>
                  {teamTitle[l]}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '0 0 22px', lineHeight: 1.65 }}>
                  {teamIntro[l]}
                </p>
                <div className="about-ai-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="about-ai-card" style={{ background: 'rgba(212,175,55,0.06)', borderColor: 'rgba(212,175,55,0.22)' }}>
                    <div className="about-ai-header" style={{ flexWrap: 'wrap', gap: '6px 16px' }}>
                      {[
                      { name: 'Claude', co: 'Anthropic', dot: '#D4AF37' },
                      { name: 'ChatGPT', co: 'OpenAI', dot: '#6AD28A' },
                      { name: 'Grok', co: 'xAI', dot: '#7EB8DA' },
                      { name: 'Gemini', co: 'Google', dot: '#E8A87C' }].
                      map((ai) =>
                      <span key={ai.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="about-ai-dot" style={{ background: ai.dot, boxShadow: `0 0 8px ${ai.dot}88` }}></span>
                          <span className="about-ai-name">{ai.name}</span>
                          <span className="about-ai-co">{ai.co}</span>
                        </span>
                      )}
                    </div>
                    <div className="about-ai-role" style={{ color: 'var(--gold-primary)', marginTop: 10 }}>
                      {'AI-ASSISTED ENGINEERING · HUMAN VALIDATION · NO AI-GENERATED NUMBERS'}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>);

}

/* ============================================================
   EXPANDABLE TEXT — 3-line preview + '+' toggle
   ============================================================ */
function ExpandableText({ text, lines = 3, className, style, wrapperStyle }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={wrapperStyle}>
      <p
        className={className}
        style={{
          ...style,
          margin: 0,
          ...(expanded ? {} : {
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical'
          })
        }}>
        
        {text}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          marginTop: 10,
          background: 'transparent',
          border: '1px solid rgba(212,175,55,0.38)',
          color: 'var(--gold-primary)',
          width: 24,
          height: 24,
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: 15,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'all 0.2s ease',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          flexShrink: 0
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(212,175,55,0.14)';e.currentTarget.style.borderColor = 'var(--gold-primary)';}}
        onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.borderColor = 'rgba(212,175,55,0.38)';}}
        aria-label={expanded ? 'Mostra meno' : 'Mostra tutto'}>
        
        {expanded ? '\u2212' : '+'}
      </button>
    </div>);

}

/* ============================================================
   WHAT'S NEXT — roadmap teaser
   ============================================================ */
function WhatsNext() {
  const { lang, t } = useLanguage();
  const items = t('whats_next_items');

  return (
    <section id="whats-next" style={{
      padding: '120px 0 100px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* subtle grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px', position: 'relative' }}>

        {/* header */}
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.2em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase',
              border: '1px solid var(--border-gold)',
              padding: '4px 12px',
              borderRadius: 4
            }}>
              {t('whats_next_label')}
            </div>
            <div style={{
              height: 1,
              flex: 1,
              background: 'linear-gradient(90deg, var(--border-gold) 0%, transparent 100%)'
            }} />
          </div>
        </Reveal>

        <Reveal delay="1">
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 38,
            fontWeight: 300,
            color: 'var(--text-primary)',
            margin: '0 0 56px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em'
          }}>
            {t('whats_next_subtitle')}
          </p>
        </Reveal>

        {/* cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {items.map((item, i) =>
          <Reveal key={i} delay={String(i + 1)} variant="up">
              <div style={{
              background: 'rgba(212,175,55,0.04)',
              border: '1px solid var(--border-gold)',
              borderRadius: 12,
              padding: '32px 28px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.3s, border-color 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
              e.currentTarget.style.borderColor = 'var(--gold-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.04)';
              e.currentTarget.style.borderColor = 'var(--border-gold)';
            }}>
              
                {/* status badge */}
                <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                letterSpacing: '0.12em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase'
              }}>
                  <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--gold-primary)',
                  boxShadow: '0 0 6px var(--gold-primary)',
                  animation: 'pulse-dot 2s ease-in-out infinite'
                }} />
                  {t('whats_next_status')}
                </div>

                {/* tag */}
                <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                letterSpacing: '0.15em',
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                marginBottom: 8
              }}>
                  {item.tag}
                </div>

                {/* title */}
                <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 12,
                lineHeight: 1.3
              }}>
                  {item.title}
                </div>

                {/* body */}
                <ExpandableText
                text={item.body}
                lines={3}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  lineHeight: 1.7
                }} />
              
              </div>
            </Reveal>
          )}

          {/* placeholder "more coming" card */}
          <Reveal delay="2" variant="up">
            <div style={{
              border: '1px dashed rgba(212,175,55,0.2)',
              borderRadius: 12,
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              minHeight: 200,
              color: 'var(--text-faint)'
            }}>
              <div style={{ fontSize: 28, opacity: 0.4 }}>···</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textAlign: 'center',
                opacity: 0.5
              }}>{{ en: 'More coming soon', it: 'Altre novità in arrivo', fr: 'D\'autres nouveautés bientôt', de: 'Weitere Neuheiten folgen' }[lang]}</div>
            </div>
          </Reveal>
        </div>

      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </section>);

}

/* ============================================================
   FINAL CTA — links to Request page
   ============================================================ */
function FinalCTA() {
  const { lang } = useLanguage();
  const l = ['en', 'it', 'fr', 'de'].includes(lang) ? lang : 'en';

  const copy = {
    eyebrow: { en: 'Get started', it: 'Inizia ora', fr: 'Commencer', de: 'Loslegen' },
    h2: {
      en: <>Ready to see what <em>Previsio</em> can do?</>,
      it: <>Pronti a scoprire cosa può fare <em>Previsio</em>?</>,
      fr: <>Prêt à découvrir ce que <em>Previsio</em> peut faire ?</>,
      de: <>Bereit zu sehen, was <em>Previsio</em> kann?</>
    },
    lede: {
      en: 'Request the full technical documentation or try the platform with a free trial — same environment, same features, real data.',
      it: 'Richiedete la documentazione tecnica completa o provate la piattaforma con una prova gratuita — stesso ambiente, stesse funzionalità, dati reali.',
      fr: 'Demandez la documentation technique complète ou essayez la plateforme avec un essai gratuit — même environnement, mêmes fonctionnalités, données réelles.',
      de: 'Fordern Sie die vollständige technische Dokumentation an oder testen Sie die Plattform mit einer kostenlosen Testphase — gleiche Umgebung, gleiche Funktionen, echte Daten.'
    },
    btnDocs: { en: 'Request documentation', it: 'Richiedi documentazione', fr: 'Demander la documentation', de: 'Dokumentation anfordern' },
    btnTrial: { en: 'Request a free trial', it: 'Richiedi la prova gratuita', fr: 'Demander un essai gratuit', de: 'Kostenlose Testphase anfordern' },
    trialBadges: {
      live: { en: '3 × Live Forecast', it: '3 × Forecast Live', fr: '3 × Prévision Live', de: '3 × Live-Prognose' },
      portfolio: { en: '1 × Portfolio Mode', it: '1 × Modalità Portfolio', fr: '1 × Mode Portfolio', de: '1 × Portfolio-Modus' },
      sim: { en: '1 × Time Travel', it: '1 × Time Travel', fr: '1 × Time Travel', de: '1 × Time Travel' }
    },
    checklist: {
      en: [],
      it: [],
      fr: [],
      de: []
    },
    note: {
      en: 'Full platform access · Same environment as paying clients · Credentials within 1 business day',
      it: 'Accesso completo alla piattaforma · Stesso ambiente dei clienti paganti · Credenziali entro 1 giorno lavorativo',
      fr: 'Accès complet à la plateforme · Même environnement que les clients payants · Identifiants sous 1 jour ouvrable',
      de: 'Voller Plattformzugang · Gleiche Umgebung wie zahlende Kunden · Zugangsdaten innerhalb von 1 Werktag'
    }
  };

  const badgeColors = {
    live: { color: '#D4AF37', bg: 'rgba(212,175,55,0.06)', border: 'rgba(212,175,55,0.25)' },
    portfolio: { color: '#6ec8f5', bg: 'rgba(110,200,245,0.06)', border: 'rgba(110,200,245,0.25)' },
    sim: { color: '#ffc107', bg: 'rgba(255,193,7,0.06)', border: 'rgba(255,193,7,0.25)' }
  };

  return (
    <section id="cta">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
          <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{copy.eyebrow[l]}</span>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>{copy.h2[l]}</h2>
          <p className="lede" style={{ margin: '0 auto' }}>{copy.lede[l]}</p>
        </Reveal>

        <Reveal variant="scale">
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>

            {/* What you get from the trial */}
            <div style={{ display: 'grid', gap: 10, margin: '0 auto 32px', maxWidth: 420, textAlign: 'left' }}>
              {copy.checklist[l].map((item) =>
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{
                  width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 2,
                  border: '1px solid rgba(212,175,55,0.35)',
                  background: 'rgba(212,175,55,0.07)',
                  display: 'grid', placeItems: 'center',
                  color: 'var(--gold-primary)', fontSize: 13, fontWeight: 700
                }}>✓</span>
                  <span style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.55 }}>{item}</span>
                </div>
              )}
            </div>
            {/* Two CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
              <a className="btn btn-ghost" href="Request.html#docs" style={{ minWidth: 220 }}>
                <span style={{ color: 'var(--gold-primary)' }}>◰</span>
                {copy.btnDocs[l]}
                <span className="arrow">→</span>
              </a>
              <a className="btn btn-gold" href="Request.html#trial" style={{ minWidth: 220 }}>
                {copy.btnTrial[l]}
                <span className="arrow">→</span>
              </a>
            </div>

            {/* Trial badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {['live', 'portfolio', 'sim'].map((k) =>
              <span key={k} style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '5px 14px',
                border: '1px solid ' + badgeColors[k].border, borderRadius: 'var(--radius-sm)',
                color: badgeColors[k].color, background: badgeColors[k].bg
              }}>{copy.trialBadges[k][l]}</span>
              )}
            </div>

            {/* Note */}
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)',
              letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.7, margin: 0
            }}>{copy.note[l]}</p>
          </div>
        </Reveal>
      </div>
    </section>);

}
/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const { lang, t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h5>{{ en: 'Resources', it: 'Risorse', fr: 'Ressources', de: 'Ressourcen' }[lang]}</h5>
            <a href="Request.html#docs">{{ en: 'Methodology (DOCX)', it: 'Metodologia (DOCX)', fr: 'Méthodologie (DOCX)', de: 'Methodologie (DOCX)' }[lang]}</a>
            <a href="faq.html">FAQ</a>
            <a href="Request.html#trial">{{ en: 'Free trial', it: 'Prova gratuita', fr: 'Essai gratuit', de: 'Kostenlose Testphase' }[lang]}</a>
          </div>
          <div className="footer-col">
            <h5>{{ en: 'Company', it: 'Azienda', fr: 'Entreprise', de: 'Unternehmen' }[lang]}</h5>
            <a href="#about">{{ en: 'About', it: 'Chi siamo', fr: 'À propos', de: 'Über uns' }[lang]}</a>
            <a href="mailto:previsio.quant@gmail.com" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>previsio.quant@gmail.com</a>
          </div>
          <div className="footer-col">
            <h5>{{ en: 'Legal', it: 'Legale', fr: 'Légal', de: 'Rechtliches' }[lang]}</h5>
            <a href="terms.html">{{ en: 'Terms of Use', it: 'Termini d\'uso', fr: 'Conditions d\'utilisation', de: 'Nutzungsbedingungen' }[lang]}</a>
            <a href="privacy.html">Privacy</a>
            <a href="eula.html">{{ en: 'EULA (License)', it: 'EULA (Licenza)', fr: 'EULA (Licence)', de: 'EULA (Lizenz)' }[lang]}</a>
          </div>
        </div>

        <div className="legal-block">
          {t('footer_disclaimer')}
        </div>

        <div className="footer-bottom">
          <span>© 2024–2026 Previsio · {{ en: 'All rights reserved.', it: 'Tutti i diritti riservati.', fr: 'Tous droits réservés.', de: 'Alle Rechte vorbehalten.' }[lang]}</span>
          <span className="mono" style={{ letterSpacing: '0.16em' }}>EN · IT · FR · DE</span>
        </div>
      </div>
    </footer>);

}

/* ============================================================
   PERFORMANCE SNAPSHOT — interactive horizon selector
   ============================================================ */
function PerformanceSnapshot() {
  const { t, lang } = useLanguage();
  const [activeHorizon, setActiveHorizon] = React.useState('1M');

  const horizons = ['1D', '1W', '1M', '3M', '6M', '1Y', '2Y', '3Y'];

  /* Real data — extracted directly from the backtest_statistics workbook (same_300 / random_500 datasets) */
  const perfData = {
    '1D': { random: { mape: '1.32%', median: '0.91%', dir: '—', obs: '500' }, same: { mape: '0.92%', median: '0.85%', dir: '50.69%', obs: '300' } },
    '1W': { random: { mape: '3.14%', median: '2.13%', dir: '51.20%', obs: '500' }, same: { mape: '2.80%', median: '2.32%', dir: '41.67%', obs: '300' } },
    '1M': { random: { mape: '5.87%', median: '4.32%', dir: '54.95%', obs: '500' }, same: { mape: '4.53%', median: '3.84%', dir: '45.45%', obs: '300' } },
    '3M': { random: { mape: '11.51%', median: '7.39%', dir: '46.23%', obs: '500' }, same: { mape: '9.25%', median: '7.87%', dir: '51.00%', obs: '300' } },
    '6M': { random: { mape: '17.86%', median: '13.91%', dir: '49.13%', obs: '500' }, same: { mape: '18.74%', median: '16.16%', dir: '39.46%', obs: '300' } },
    '1Y': { random: { mape: '24.18%', median: '16.97%', dir: '59.63%', obs: '500' }, same: { mape: '22.88%', median: '16.18%', dir: '69.01%', obs: '300' } },
    '2Y': { random: { mape: '34.86%', median: '26.71%', dir: '48.32%', obs: '500' }, same: { mape: '34.17%', median: '33.29%', dir: '62.71%', obs: '300' } },
    '3Y': { random: { mape: '25.63%', median: '24.55%', dir: '58.27%', obs: '500' }, same: { mape: '37.51%', median: '37.09%', dir: '59.00%', obs: '300' } }
  };

  const current = perfData[activeHorizon];

  const labels = {
    mape: { en: 'Mean Abs. % Error', it: 'Errore % assoluto medio', fr: 'Erreur % absolue moyenne', de: 'Mittlerer abs. % Fehler' },
    median: { en: 'Median % Error', it: 'Errore % mediano', fr: 'Erreur % médiane', de: 'Medianer % Fehler' },
    dir: { en: 'Directional Accuracy', it: 'Precisione direzionale', fr: 'Précision directionnelle', de: 'Richtungsgenauigkeit' },
    obs: { en: 'Observations', it: 'Osservazioni', fr: 'Observations', de: 'Beobachtungen' },
    random: { en: 'Random Date Test', it: 'Test date casuali', fr: 'Test dates aléatoires', de: 'Zufälliger Datumstest' },
    same: { en: 'Same Date Test', it: 'Test stessa data', fr: 'Test même date', de: 'Gleicher Datumstest' },
    download: { en: 'Download CSV', it: 'Scarica CSV', fr: 'Télécharger CSV', de: 'CSV herunterladen' },
    illustrative: { en: 'Validation runs · Medium and long-term analysis', it: 'Run di validazione · Modalità analisi medium e long-term', fr: 'Runs de validation · Analyse medium et long-terme', de: 'Validierungsläufe · Medium- und Langfristanalyse' }
  };
  const l = (k) => labels[k][lang] || labels[k]['en'];

  const downloadCSV = () => {
    const headers = ['Horizon', 'Test Type', 'MAPE', 'Median Error %', 'Directional Accuracy', 'Observations'];
    const rows = [];
    horizons.forEach((h) => {
      const d = perfData[h];
      rows.push([h, 'Random Date', d.random.mape, d.random.median, d.random.dir, d.random.obs]);
      rows.push([h, 'Same Date', d.same.mape, d.same.median, d.same.dir, d.same.obs]);
    });
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Previsio_Validation_${activeHorizon}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const MetricCard = ({ label, value, accent }) =>
  <div style={{
    padding: '16px 18px',
    background: 'rgba(0,0,0,0.25)',
    border: `1px solid ${accent ? 'rgba(212,175,55,0.18)' : 'var(--border-subtle)'}`,
    borderRadius: 8,
    transition: 'border-color 0.2s'
  }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.01em', color: accent ? 'var(--gold-primary)' : 'var(--text-main)' }}>{value}</div>
    </div>;


  const TestColumn = ({ type, data, colorAccent }) =>
  <div style={{ display: 'grid', gap: 10 }}>
      <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-mono)', fontSize: 13,
      color: colorAccent, letterSpacing: '0.16em', textTransform: 'uppercase',
      paddingBottom: 10, borderBottom: `1px solid ${colorAccent}33`,
      marginBottom: 2
    }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: colorAccent, flexShrink: 0, display: 'inline-block' }}></span>
        {l(type)}
      </div>
      <MetricCard label={l('mape')} value={data.mape} accent={type === 'random'} />
      <MetricCard label={l('median')} value={data.median} />
      <div style={{
      padding: '10px 18px', background: 'rgba(0,0,0,0.15)',
      border: '1px solid var(--border-subtle)', borderRadius: 8,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{l('obs')}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-main)' }}>{data.obs}</span>
      </div>
    </div>;


  return (
    <section id="validation">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t('perf_eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
            {t('perf_h2')}
          </h2>
          <p className="lede">{t('perf_lede')}</p>
        </Reveal>

        <Reveal>
          {/* Horizon selector */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-primary)',
              letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12
            }}>
              {lang === 'it' ? 'SELEZIONA ORIZZONTE' : lang === 'fr' ? 'SÉLECTIONNER HORIZON' : lang === 'de' ? 'HORIZONT WÄHLEN' : 'SELECT HORIZON'}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {horizons.map((h) =>
              <button
                key={h}
                onClick={() => setActiveHorizon(h)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: activeHorizon === h ? 600 : 400,
                  letterSpacing: '0.1em',
                  padding: '9px 18px',
                  borderRadius: 6,
                  border: activeHorizon === h ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  background: activeHorizon === h ? 'rgba(212,175,55,0.12)' : 'transparent',
                  color: activeHorizon === h ? 'var(--gold-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {if (activeHorizon !== h) {e.currentTarget.style.borderColor = 'var(--border-strong)';e.currentTarget.style.color = 'var(--text-main)';}}}
                onMouseLeave={(e) => {if (activeHorizon !== h) {e.currentTarget.style.borderColor = 'var(--border-subtle)';e.currentTarget.style.color = 'var(--text-muted)';}}}>
                {h}</button>
              )}
            </div>
          </div>

          {/* Metrics split by test type */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            marginBottom: 24
          }}>
            <TestColumn type="random" data={current.random} colorAccent="var(--gold-primary)" />
            <TestColumn type="same" data={current.same} colorAccent="var(--neutral)" />
          </div>

          {/* Download CSV */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <button
              onClick={downloadCSV}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.14em',
                padding: '9px 20px', borderRadius: 6,
                border: '1px solid var(--border-gold)',
                background: 'rgba(212,175,55,0.06)',
                color: 'var(--gold-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(212,175,55,0.12)';}}
              onMouseLeave={(e) => {e.currentTarget.style.background = 'rgba(212,175,55,0.06)';}}>
              
              ↓ {l('download')} · {activeHorizon}
            </button>
          </div>

          <p className="perf-note" style={{ marginTop: 20 }}>{t('perf_note')}</p>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #validation .perf-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>);

}

/* ============================================================
   PREVISIO AI SUPPORT — floating chatbot
   Async backend: /api/chat/start  +  /api/chat/status/{job_id}
   Policy: answers follow the language selected on the website,
   are detailed and discursive, and never contain formulas —
   formula requests are redirected to the documentation page.
   ============================================================ */
const PX_DOCS_URL = 'Request.html#docs';
const PX_LANG_NAME = { en: 'English', it: 'Italian (italiano)', fr: 'French (français)', de: 'German (Deutsch)' };

const PX_COPY = {
  launcher: { en: 'AI Support', it: 'AI Support', fr: 'Support IA', de: 'KI-Support' },
  title: { en: 'PREVISIO Chatbot', it: 'Chatbot di PREVISIO', fr: 'Chatbot PREVISIO', de: 'PREVISIO Chatbot' },
  sub: { en: 'Models · forecasting · methodology · reports', it: 'Modelli · forecasting · metodologia · report', fr: 'Modèles · prévision · méthodologie · rapports', de: 'Modelle · Prognosen · Methodik · Berichte' },
  docsLink: { en: 'Request the technical documentation', it: 'Richiedi la documentazione tecnica', fr: 'Demander la documentation technique', de: 'Technische Dokumentation anfordern' },  greeting: {
    en: 'Hello, I am the PREVISIO assistant. Ask me anything about how the platform works — models, forecasting pipeline, prediction intervals, probability outputs, Portfolio Mode and reports. I answer in detail and in plain language.\n\nI do not provide formulas or mathematical notation: the complete specification is in the official technical documentation, available on request.\n\nIf my answers do not fully satisfy you, write to previsio.quant@gmail.com\n\nNote: every question is processed independently — I keep no memory of previous questions, so include the context you need in each question.',
    it: 'Buongiorno, sono l\u2019assistente di PREVISIO. Puoi chiedermi tutto sul funzionamento della piattaforma — modelli, pipeline di forecasting, intervalli di predizione, output probabilistici, Portfolio Mode e report. Rispondo in modo dettagliato e in linguaggio chiaro.\n\nNon fornisco formule o notazione matematica: la specifica completa è contenuta nella documentazione tecnica ufficiale, disponibile su richiesta.\n\nSe le risposte non ti soddisfano, scrivi a previsio.quant@gmail.com\n\nNota: ogni domanda viene elaborata in modo indipendente — non ho memoria delle domande precedenti, quindi includi il contesto necessario in ogni domanda.',
    fr: 'Bonjour, je suis l\u2019assistant PREVISIO. Posez-moi toutes vos questions sur le fonctionnement de la plateforme — modèles, pipeline de prévision, intervalles de prédiction, sorties probabilistes, Portfolio Mode et rapports. Je réponds de manière détaillée et en langage clair.\n\nJe ne fournis pas de formules ni de notation mathématique : la spécification complète figure dans la documentation technique officielle, disponible sur demande.\n\nSi mes réponses ne vous satisfont pas, écrivez à previsio.quant@gmail.com\n\nNote : chaque question est traitée indépendamment — je ne garde aucune mémoire des questions précédentes.',
    de: 'Hallo, ich bin der PREVISIO-Assistent. Fragen Sie mich alles zur Funktionsweise der Plattform — Modelle, Prognosepipeline, Prognoseintervalle, Wahrscheinlichkeitsausgaben, Portfolio Mode und Berichte. Ich antworte ausführlich und in klarer Sprache.\n\nFormeln oder mathematische Notation gebe ich nicht aus: Die vollständige Spezifikation steht in der offiziellen technischen Dokumentation, die auf Anfrage erhältlich ist.\n\nWenn meine Antworten Sie nicht überzeugen, schreiben Sie an previsio.quant@gmail.com\n\nHinweis: Jede Frage wird unabhängig verarbeitet — ich habe kein Gedächtnis für vorherige Fragen.'
  },
  placeholder: { en: 'Write your question…', it: 'Scrivete la vostra domanda…', fr: 'Écrivez votre question…', de: 'Schreiben Sie Ihre Frage…' },
  send: { en: 'Send', it: 'Invia', fr: 'Envoyer', de: 'Senden' },
  loading: { en: 'Processing…', it: 'Elaborazione in corso…', fr: 'Traitement en cours…', de: 'Verarbeitung…' },
  formulaNote: {
    en: '**Formulas and mathematical notation are not provided in chat.** The complete specification — every equation, threshold and default — is in the official Previsio technical documentation, which you can request here: Request.html#docs',
    it: '**Le formule e la notazione matematica non vengono fornite in chat.** La specifica completa — ogni equazione, soglia e parametro — è contenuta nella documentazione tecnica ufficiale di Previsio, che potete richiedere qui: Request.html#docs',
    fr: '**Les formules et la notation mathématique ne sont pas fournies dans le chat.** La spécification complète — chaque équation, seuil et paramètre — figure dans la documentation technique officielle de Previsio, que vous pouvez demander ici : Request.html#docs',
    de: '**Formeln und mathematische Notation werden im Chat nicht bereitgestellt.** Die vollständige Spezifikation — jede Gleichung, jeder Schwellenwert und jeder Standardwert — steht in der offiziellen technischen Dokumentation von Previsio, die Sie hier anfordern können: Request.html#docs'
  },
  emptyAfterStrip: {
    en: 'That question is answered mathematically, and I do not provide formulas in chat.',
    it: 'La risposta a questa domanda è di natura matematica e in chat non fornisco formule.',
    fr: 'La réponse à cette question est de nature mathématique et je ne fournis pas de formules dans le chat.',
    de: 'Diese Frage wird mathematisch beantwortet, und im Chat gebe ich keine Formeln aus.'
  },
  errFailed: { en: 'Error completing the request.', it: 'Errore nel completare la richiesta.', fr: 'Erreur lors du traitement de la demande.', de: 'Fehler bei der Verarbeitung der Anfrage.' },
  errTimeout: { en: 'Response not ready within the maximum time. Please try again shortly.', it: 'Risposta non pronta entro il tempo massimo. Riprova tra qualche secondo.', fr: 'Réponse non prête dans le temps imparti. Réessayez dans quelques secondes.', de: 'Antwort nicht innerhalb der maximalen Zeit bereit. Bitte versuchen Sie es erneut.' },
  errGeneric: { en: 'An error occurred. Please try again shortly.', it: 'Si è verificato un errore. Riprova tra qualche secondo.', fr: 'Une erreur est survenue. Réessayez dans quelques secondes.', de: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
  errNetwork: { en: 'Unable to contact the service (connection or CORS). Please try again shortly.', it: 'Impossibile contattare il servizio (connessione o CORS). Riprova tra qualche secondo.', fr: 'Impossible de contacter le service (connexion ou CORS). Réessayez dans quelques secondes.', de: 'Dienst nicht erreichbar (Verbindung oder CORS). Bitte versuchen Sie es erneut.' },
  errOffline: { en: 'Unable to contact the service at this time. Please try again shortly.', it: 'Impossibile contattare il servizio in questo momento. Riprova tra qualche secondo.', fr: 'Impossible de contacter le service pour le moment. Réessayez dans quelques secondes.', de: 'Dienst derzeit nicht erreichbar. Bitte versuchen Sie es erneut.' }
};

/* Answer policy sent with every question, so the assistant behaves the same
   whatever the deployed backend prompt version is. */
function pxBuildQuestion(question, cl) {
  return (
    '[ANSWER POLICY — highest priority, overrides every other instruction]\n' +
    '1. Write the ENTIRE answer in ' + (PX_LANG_NAME[cl] || 'English') + '. Never answer in another language.\n' +
    '2. Be detailed and exhaustive: explain what the mechanism does, why it exists, which inputs it uses, how it affects the result and what its limits are. Use short paragraphs and bullet lists; plain professional prose.\n' +
    '3. NEVER output formulas, equations, LaTeX, mathematical notation, symbolic derivations or code, even if explicitly requested. Describe the logic in words instead.\n' +
    '4. If the question asks for a formula, an equation or an exact mathematical definition, explain the concept in words and then say that the complete mathematical specification is in the official Previsio technical documentation, which can be requested from the "Request documentation" page of the official Previsio website.\n' +
    '5. Never give investment advice or buy / sell / hold recommendations.\n' +
    '6. Do not mention sources, documents, file names, code or the existence of internal sources.\n\n' +
    '[USER QUESTION]\n' + question);

}

const PX_FORMULA_ASK = /formul|equazion|equation|équation|gleichung|formel|latex|matematic|mathematic|mathématiq|mathematisch|derivazion|derivation|herleitung/i;
const PX_MATH_CHARS = /[=≤≥≠≈∑∏√∫±×÷·∈∀∃→←↔αβγδεζηθκλμνξπρσςτφχψωΓΔΘΛΞΠΣΦΨΩ]|\^|_\{/;

/* Remove any formula the model produced anyway. Returns the cleaned text
   plus a flag telling the caller to append the documentation pointer. */
function pxStripFormulas(text) {
  if (!text) return { text: '', removed: false };
  let removed = false;
  let out = String(text);
  const drop = (re) => {out = out.replace(re, () => {removed = true;return ' ';});};
  drop(/\\begin\{[a-z*]+\}[\s\S]*?\\end\{[a-z*]+\}/gi);
  drop(/\\\[[\s\S]*?\\\]/g);
  drop(/\\\([\s\S]*?\\\)/g);
  drop(/\$\$[\s\S]*?\$\$/g);
  drop(/\$[^$\n]{1,200}\$/g);
  drop(/\\[a-zA-Z]+(?:\{[^{}]*\})*/g);
  out = out.split('\n').filter((line) => {
    const s = line.trim();
    if (!s) return true;
    if (!PX_MATH_CHARS.test(s)) return true;
    const words = s.split(/\s+/).filter((w) => /[a-zA-ZÀ-ÿ]{4,}/.test(w));
    if (words.length > 4) return true;
    removed = true;
    return false;
  }).join('\n');
  if (removed) {
    /* Tidy the prose left dangling around a removed formula. */
    out = out.split('\n').filter((line) => {
      const s = line.trim();
      if (!s) return true;
      if (!/^(dove|where|où|ou|wobei|con|mit|avec|with)\b/i.test(s)) return true;
      return s.split(/\s+/).length > 12;
    }).join('\n');
    out = out.replace(/:\s*(\n|$)/g, '.$1');
  }
  out = out.replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return { text: out, removed: removed };
}

/* Minimal, safe rich-text rendering: escape first, then bold / code /
   lists / links. Keeps long technical answers readable. */
const pxEscape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function pxFormatAnswer(text) {
  let html = pxEscape(text);
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/Request\.html#docs/g, '<a href="' + PX_DOCS_URL + '">' + PX_DOCS_URL + '</a>');
  html = html.replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>');
  const out = [];
  let items = null;
  let tag = null;
  const flush = () => {if (items) {out.push('<' + tag + '>' + items + '</' + tag + '>');items = null;tag = null;}};
  html.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) {flush();return;}
    const bullet = line.match(/^[-•*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet) {if (tag !== 'ul') flush();tag = 'ul';items = (items || '') + '<li>' + bullet[1] + '</li>';return;}
    if (numbered) {if (tag !== 'ol') flush();tag = 'ol';items = (items || '') + '<li>' + numbered[1] + '</li>';return;}
    flush();
    out.push('<p>' + line + '</p>');
  });
  flush();
  return out.join('');
}

function PrevisioChatBot() {
  const { lang } = useLanguage();
  const cl = ['en', 'it', 'fr', 'de'].includes(lang) ? lang : 'en';
  const c = (k) => PX_COPY[k][cl] || PX_COPY[k].en;
  const endpoint = 'https://predictive-ai-support-b775a0fc540c.herokuapp.com/api/chat';

  /* Strip any 'Fonti interne usate' / 'Riferimenti' trailing section and
     inline 'Fonte N' references the model may have produced. */
  const stripSources = (text) => {
    if (!text) return text;
    text = text.replace(
      /\n+\s*(?:\*\*|##+\s*|__|\*)?[\s]*(?:fonti(?:\s+interne(?:\s+usate)?)?|riferimenti|bibliografia|references|sources?\s+used)[\s]*(?:\*\*|__)?[\s]*[:\.\-]?\s*\n[\s\S]*$/i,
      '');
    text = text.replace(
      /\n*\s*(?:\*\*)?(?:fonti\s+interne\s+usate|fonti\s+usate|fonti\s+interne)(?:\*\*)?[\s]*:\s*[\s\S]*$/i,
      '');
    text = text.replace(/\[\s*fonte\s+\d+\s*\]/gi, '');
    text = text.replace(/\(\s*fonte\s+\d+\s*\)/gi, '');
    text = text.replace(/\bfonte\s+\d+\b/gi, '');
    text = text.replace(/[ \t]+\n/g, '\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
  };

  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const bodyRef = React.useRef(null);
  const inputRef = React.useRef(null);

  /* Greeting follows the site language: reset it whenever the language
     changes and no conversation has started yet. */
  React.useEffect(() => {
    setMessages((m) => m.length <= 1 ? [{ role: 'bot', text: PX_COPY.greeting[cl] || PX_COPY.greeting.en }] : m);
  }, [cl]);

  React.useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 80);
    }
  }, [open]);

  const pollJob = async (jobId) => {
    const maxAttempts = 90; // 90 × 2s = 180s
    const intervalMs = 2000;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      let data;
      try {
        const res = await fetch(endpoint + '/status/' + jobId);
        data = await res.json();
      } catch (e) {
        continue; // transient network error — keep polling
      }
      const status = data && data.status;
      if (status === 'completed') {
        return { ok: true, answer: data && (data.answer || data.response || '') || '' };
      }
      if (status === 'failed') {
        return { ok: false, error: data && data.error || c('errFailed') };
      }
    }
    return { ok: false, timeout: true };
  };

  const send = async () => {
    const question = input.trim();
    if (!question || busy) return;
    setInput('');
    setBusy(true);
    setMessages((m) => [...m, { role: 'user', text: question }, { role: 'loading', text: c('loading') }]);

    const replaceLoading = (msg) => {
      setMessages((m) => {
        const copy = m.slice();
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'loading') {copy[i] = msg;break;}
        }
        return copy;
      });
    };

    try {
      const startRes = await fetch(endpoint + '/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: pxBuildQuestion(question, cl),
          language: cl,
          lang: cl,
          response_language: PX_LANG_NAME[cl] || 'English',
          allow_formulas: false
        })
      });
      if (!startRes.ok) throw new Error('start_failed');
      const startData = await startRes.json();
      const jobId = startData && startData.job_id;
      if (!jobId) throw new Error('no_job_id');

      const result = await pollJob(jobId);
      if (result.ok) {
        const cleaned = pxStripFormulas(stripSources(result.answer));
        let body = cleaned.text;
        if (body.length < 40) body = body ? body + '\n\n' + c('emptyAfterStrip') : c('emptyAfterStrip');
        if (cleaned.removed || PX_FORMULA_ASK.test(question)) body = body + '\n\n' + c('formulaNote');
        replaceLoading({ role: 'bot', text: body });
      } else if (result.timeout) {
        replaceLoading({ role: 'error', text: c('errTimeout') });
      } else {
        replaceLoading({ role: 'error', text: result.error || c('errGeneric') });
      }
    } catch (e) {
      const isNetwork = e && (e.name === 'TypeError' || /fetch|network/i.test(String(e.message || e)));
      replaceLoading({ role: 'error', text: isNetwork ? c('errNetwork') : c('errOffline') });
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <React.Fragment>
      <button
        type="button"
        className={'px-chat-launcher' + (open ? ' hidden' : '')}
        onClick={() => setOpen(true)}
        aria-label={c('title')}>

        <span className="px-chat-dot"></span>
        <span>{c('launcher')}</span>
      </button>

      {open &&
      <div className="px-chat-panel" role="dialog" aria-label={c('title')} lang={cl}>
          <div className="px-chat-head">
            <div>
              <div className="px-chat-title">{c('title')}</div>
              <div className="px-chat-sub">{c('sub')}</div>
              <a className="px-chat-docs" href={PX_DOCS_URL}>{c('docsLink')}<span className="px-chat-docs-arrow">→</span></a>
            </div>
            <button
            type="button"
            className="px-chat-close"
            onClick={() => setOpen(false)}
            aria-label="Close">

              ×
            </button>
          </div>

          <div className="px-chat-body" ref={bodyRef}>
            {messages.map((m, i) =>
          m.role === 'bot' ?
          <div key={i} className="px-chat-msg bot rich" dangerouslySetInnerHTML={{ __html: pxFormatAnswer(m.text) }}></div> :

          <div key={i} className={'px-chat-msg ' + m.role}>
                {m.role === 'loading' && <span className="px-chat-spinner"></span>}
                <span>{m.text}</span>
              </div>
          )}
          </div>

          <div className="px-chat-foot">
            <textarea
            ref={inputRef}
            className="px-chat-input"
            placeholder={c('placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={busy} />

            <button
            type="button"
            className="px-chat-send"
            onClick={send}
            disabled={busy || !input.trim()}>

              {c('send')}
            </button>
          </div>
        </div>
      }
    </React.Fragment>);

}

/* ============================================================
   REPORT DOWNLOAD — Live + Portfolio mode
   ============================================================ */
function ReportDownload() {
  const { lang } = useLanguage();
  const rl = {
    eyebrow: { en: 'Reports', it: 'Report', fr: 'Rapports', de: 'Berichte' },
    title: { en: 'Download the final report', it: 'Scarica un esempio di report finale', fr: 'Téléchargez le rapport final', de: 'Laden Sie den finalen Bericht herunter' },
    lede: { en: 'You never spend a minute writing it. The report is generated automatically at the end of every forecast — the same DOCX the platform produces, with every research detail and statistic already inside: forecast, prediction intervals, model weights, diagnostics and AI commentary. Choose the mode that suits your workflow.', it: 'Non perdete un minuto a scriverlo. Il report viene generato automaticamente al termine di ogni previsione — lo stesso DOCX prodotto dalla piattaforma, con tutti i dettagli della ricerca e le statistiche già all\u2019interno: previsione, intervalli di predizione, pesi dei modelli, diagnostica e commento AI. Scegliete la modalità più adatta al vostro flusso di lavoro.', fr: 'Vous ne passez pas une minute à le rédiger. Le rapport est généré automatiquement à la fin de chaque prévision — le même DOCX produit par la plateforme, avec chaque détail de la recherche et chaque statistique déjà à l\u2019intérieur : prévision, intervalles de prédiction, poids des modèles, diagnostics et commentaire IA. Choisissez le mode adapté à votre workflow.', de: 'Sie verbringen keine Minute mit dem Schreiben. Der Bericht wird am Ende jeder Prognose automatisch erstellt — dasselbe DOCX, das die Plattform produziert, mit jedem Recherchedetail und jeder Statistik bereits enthalten: Prognose, Prognoseintervalle, Modellgewichte, Diagnostik und KI-Kommentar. Wählen Sie den Modus, der zu Ihrem Workflow passt.' },
    chips: { en: ['Auto-generated', 'No manual report drafting', 'Every detail & statistic included'], it: ['Generato in automatico', 'Nessuna redazione manuale del report', 'Tutti i dettagli e le statistiche inclusi'], fr: ['Généré automatiquement', 'Aucune rédaction manuelle du rapport', 'Tous les détails et statistiques inclus'], de: ['Automatisch erstellt', 'Keine manuelle Berichtserstellung', 'Alle Details & Statistiken enthalten'] },
    live_title: { en: 'Live Mode', it: 'Modalità Live', fr: 'Mode Live', de: 'Live-Modus' },
    live_desc: { en: 'Forecast based on the most recent observation available in the selected dataset. Previsio does not provide its own live market data feed. Ideal for daily research and committee memos.', it: 'Previsione basata sull’ultima osservazione disponibile nel dataset selezionato. Previsio non fornisce un feed autonomo di dati di mercato. Ideale per la ricerca giornaliera e i memo per il comitato.', fr: 'Prévision basée sur la dernière observation disponible dans le jeu de données sélectionné. Previsio ne fournit pas son propre flux de données de marché en direct. Idéal pour la recherche quotidienne et les mémos de comité.', de: 'Prognose basierend auf der jüngsten verfügbaren Beobachtung im ausgewählten Datensatz. Previsio stellt keinen eigenen Live-Marktdatenfeed bereit. Ideal für tägliche Research und Komitee-Memos.' },
    portfolio_title: { en: 'Portfolio Mode', it: 'Modalità Portfolio', fr: 'Mode Portfolio', de: 'Portfolio-Modus' },
    portfolio_desc: { en: 'Consolidated view across multiple assets. Run the engine on your full portfolio and receive a single structured document.', it: 'Visione consolidata su più asset. Eseguite il motore sull\'intero portafoglio e ricevete un unico documento strutturato.', fr: 'Vue consolidée sur plusieurs actifs. Exécutez le moteur sur l\'ensemble de votre portefeuille et recevez un seul document structuré.', de: 'Konsolidierte Ansicht über mehrere Assets. Führen Sie die Engine auf Ihrem gesamten Portfolio aus und erhalten Sie ein einziges strukturiertes Dokument.' },
    download: { en: 'Download report', it: 'Scarica report', fr: 'Télécharger le rapport', de: 'Bericht herunterladen' }
  };
  const t = (key) => rl[key][lang] || rl[key].en;

  const cardStyle = {
    padding: '32px 28px',
    display: 'grid',
    gap: 16,
    alignContent: 'start'
  };
  const iconBox = {
    width: 48, height: 48,
    border: '1px solid var(--border-gold)',
    borderRadius: 10,
    display: 'grid', placeItems: 'center',
    color: 'var(--gold-primary)',
    background: 'rgba(212,175,55,0.04)',
    fontSize: 20,
    flexShrink: 0
  };

  return (
    <section>
      <div className="container">
        <Reveal className="section-head" style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{t('eyebrow')}</span>
          <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginTop: 14 }}>
            {t('title')}
          </h2>
          <p className="lede" style={{ margin: '14px auto 0', maxWidth: '58ch', textAlign: 'center' }}>
            {t('lede')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 22 }}>
            {(rl.chips[lang] || rl.chips.en).map((ch, i) =>
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.06em', color: 'var(--gold-light)', background: 'rgba(212,175,55,0.06)', border: '1px solid var(--border-gold)', borderRadius: 999, padding: '6px 14px' }}>
                <span style={{ color: 'var(--gold-primary)' }}>✓</span> {ch}
              </span>
            )}
          </div>
        </Reveal>

        <div className="use-grid" style={{ maxWidth: 920, margin: '0 auto' }}>
          {/* Live Mode */}
          <Reveal delay={1} className="card" style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={iconBox}>▶</div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold-primary)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>LIVE</div>
                <h3 style={{ fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: '0.01em' }}>{t('live_title')}</h3>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>{t('live_desc')}</p>
            <a href="Request.html#report-live" className="btn btn-gold" style={{ width: '100%', marginTop: 4 }}>
              {t('download')} · DOCX <span className="arrow">→</span>
            </a>
          </Reveal>

          {/* Portfolio Mode */}
          <Reveal delay={2} className="card" style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={iconBox}>◫</div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold-primary)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>PORTFOLIO</div>
                <h3 style={{ fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: '0.01em' }}>{t('portfolio_title')}</h3>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>{t('portfolio_desc')}</p>
            <a href="Request.html#report-portfolio" className="btn btn-ghost" style={{ width: '100%', marginTop: 4 }}>
              {t('download')} · DOCX <span className="arrow">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>);

}

/* ============================================================
   ADVANCED CAPABILITIES — Time Travel + Portfolio
   ============================================================ */
function AdvancedCapabilities() {
  const { lang } = useLanguage();
  const L = (o) => o[lang] || o.en;
  const a = {
    eyebrow: { en: 'Advanced capabilities', it: 'Funzionalità avanzate', fr: 'Capacités avancées', de: 'Erweiterte Funktionen' },
    h2: { en: 'Two advanced capabilities, one engine.', it: 'Due funzionalità avanzate, un unico motore.', fr: 'Deux capacités avancées, un seul moteur.', de: 'Zwei erweiterte Funktionen, eine Engine.' },
    lede: { en: 'Beyond the point forecast, Previsio adds two advanced tools: historical replay with Time Travel, and multi-asset risk analysis with Portfolio mode.', it: 'Oltre alla previsione puntuale, Previsio offre due strumenti avanzati: il replay storico con Time Travel e l\u2019analisi di rischio multi-asset con la modalità Portfolio.', fr: 'Au-delà de la prévision ponctuelle, Previsio ajoute deux outils avancés : le replay historique avec Time Travel, et l\u2019analyse de risque multi-actifs avec le mode Portfolio.', de: 'Über die Punktprognose hinaus bietet Previsio zwei erweiterte Werkzeuge: historisches Replay mit Time Travel und Multi-Asset-Risikoanalyse mit dem Portfolio-Modus.' }
  };
  return (
    <>
      <section id="advanced-capabilities" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Reveal className="section-head" style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow no-rule" style={{ justifyContent: 'center' }}>{L(a.eyebrow)}</span>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>{L(a.h2)}</h2>
            <p className="lede" style={{ margin: '0 auto', maxWidth: '64ch', textAlign: 'center' }}>{L(a.lede)}</p>
          </Reveal>
        </div>
      </section>
      <TimeTravelSection />
      <PortfolioSection />
    </>);

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
      <AdvancedCapabilities />
      <PerformanceSnapshot />
      <UseCases />
      <DashboardPreview />
      <ReportDownload />
      <DataPrivacy />
      <Trust />
      <AIProcessing />
      <DistributionAccess />
      <Pricing />
      <AboutFounder />
      <WhatsNext />
      <FinalCTA />
      <FAQ />
      <Footer />
      <PrevisioChatBot />
    </LanguageProvider>);

}

// Export App to window for tweaks wrapper
Object.assign(window, { App, LanguageProvider, useLanguage });

ReactDOM.createRoot(document.getElementById('root')).render(<App />);