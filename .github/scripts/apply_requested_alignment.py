from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LANDING_PATH = ROOT / "landing-v11.jsx"
PRIVACY_PATH = ROOT / "privacy.html"
EULA_PATH = ROOT / "eula.html"


def replace_line_if_present(text: str, token: str, replacement: str, label: str) -> tuple[str, str]:
    lines = text.splitlines()
    indexes = [index for index, line in enumerate(lines) if token in line]
    if not indexes:
        return text, f"{label}: already aligned or token absent"
    for index in indexes:
        lines[index] = replacement
    suffix = "\n" if text.endswith("\n") else ""
    return "\n".join(lines) + suffix, f"{label}: replaced {len(indexes)} line(s)"


def replace_section_if_present(
    text: str,
    start_marker: str,
    end_marker: str,
    replacement: str,
    label: str,
) -> tuple[str, str]:
    if start_marker not in text:
        return text, f"{label}: already aligned or start marker absent"
    start = text.index(start_marker)
    end = text.index(end_marker, start)
    return text[:start] + replacement + text[end:], f"{label}: replaced"


def main() -> None:
    landing = LANDING_PATH.read_text(encoding="utf-8")
    privacy = PRIVACY_PATH.read_text(encoding="utf-8")
    eula = EULA_PATH.read_text(encoding="utf-8")
    operations: list[str] = []

    validation_start = "function PerformanceSnapshot() {"
    validation_end = "const PX_DOCS_URL ="
    if validation_start not in landing or validation_end not in landing:
        raise RuntimeError("Validation section boundaries not found")
    validation_before = landing.split(validation_start, 1)[1].split(validation_end, 1)[0]

    # P2.8: show concrete product proof immediately after the hero.
    app_index = landing.index("function App() {")
    app_start = landing.index("      <Hero />", app_index)
    app_end = landing.index("      <DataPrivacy />", app_start)
    app_block = """      <Hero />
      <DashboardPreview />
      <ReportDownload />

      <ModelsPipeline />
      <Features />
      <AnalyticsSection />
      <Methodology />
      <AdvancedCapabilities />
      <PerformanceSnapshot />
      <UseCases />
"""
    landing = landing[:app_start] + app_block + landing[app_end:]
    operations.append("P2.8: DashboardPreview and ReportDownload placed immediately after Hero")

    # P1.2: the Microsoft Store product uses local Ollama only.
    feature_replacements = [
        (
            "If a cloud configuration is requested",
            "    ['Your data, your source, your control', 'In the Microsoft Store desktop version, market files, quantitative calculations and Ollama-generated commentary are processed locally on the client device. External cloud AI providers and remote LLM endpoints are not supported by the standard product.'],",
            "Features EN",
        ),
        (
            "Qualora venga richiesta una configurazione cloud",
            "    ['I vostri dati, la vostra fonte, il vostro controllo', 'Nella versione desktop distribuita tramite Microsoft Store, file di mercato, calcoli quantitativi e commento generato tramite Ollama vengono elaborati localmente sul dispositivo del cliente. Provider AI cloud esterni ed endpoint LLM remoti non sono supportati dal prodotto standard.'],",
            "Features IT",
        ),
        (
            "Si une configuration cloud est demandée",
            "    ['Vos données, votre source, votre contrôle', 'Dans la version desktop distribuée via Microsoft Store, les fichiers de marché, les calculs quantitatifs et le commentaire généré via Ollama sont traités localement sur l’appareil du client. Les fournisseurs d’IA cloud externes et les endpoints LLM distants ne sont pas pris en charge par le produit standard.'],",
            "Features FR",
        ),
        (
            "Wird eine Cloud-Konfiguration angefragt",
            "    ['Ihre Daten, Ihre Quelle, Ihre Kontrolle', 'In der über den Microsoft Store vertriebenen Desktopversion werden Marktdateien, quantitative Berechnungen und der über Ollama erzeugte Kommentar lokal auf dem Gerät des Kunden verarbeitet. Externe Cloud-KI-Anbieter und entfernte LLM-Endpunkte werden vom Standardprodukt nicht unterstützt.'],",
            "Features DE",
        ),
    ]
    for token, replacement, label in feature_replacements:
        landing, result = replace_line_if_present(landing, token, replacement, label)
        operations.append(result)

    pricing_replacements = [
        (
            "Local configuration via Ollama is the standard mode.",
            "              en: 'The Microsoft Store desktop version uses only Ollama running locally on the client device. External cloud AI providers, remote LLM endpoints and dedicated cloud infrastructure are not part of the standard product or licence. Any future enterprise deployment would require a separate, explicitly documented technical and contractual project.',",
            "Pricing EN",
        ),
        (
            "La configurazione locale tramite Ollama è la modalità standard.",
            "              it: 'La versione desktop distribuita tramite Microsoft Store utilizza esclusivamente Ollama in esecuzione locale sul dispositivo del cliente. Provider AI cloud esterni, endpoint LLM remoti e infrastrutture cloud dedicate non fanno parte del prodotto o della licenza standard. Qualsiasi futuro deployment enterprise richiederebbe un progetto tecnico e contrattuale separato ed esplicitamente documentato.',",
            "Pricing IT",
        ),
        (
            "La configuration locale via Ollama est le mode standard.",
            "              fr: 'La version desktop distribuée via Microsoft Store utilise exclusivement Ollama exécuté localement sur l’appareil du client. Les fournisseurs d’IA cloud externes, les endpoints LLM distants et les infrastructures cloud dédiées ne font pas partie du produit ni de la licence standard. Tout futur déploiement enterprise nécessiterait un projet technique et contractuel séparé et explicitement documenté.',",
            "Pricing FR",
        ),
        (
            "Die lokale Konfiguration über Ollama ist der Standardmodus.",
            "              de: 'Die über den Microsoft Store vertriebene Desktopversion verwendet ausschließlich Ollama lokal auf dem Gerät des Kunden. Externe Cloud-KI-Anbieter, entfernte LLM-Endpunkte und dedizierte Cloud-Infrastruktur sind nicht Bestandteil des Standardprodukts oder der Standardlizenz. Jede künftige Enterprise-Bereitstellung würde ein separates, ausdrücklich dokumentiertes technisches und vertragliches Projekt erfordern.'",
            "Pricing DE",
        ),
    ]
    for token, replacement, label in pricing_replacements:
        landing, result = replace_line_if_present(landing, token, replacement, label)
        operations.append(result)

    landing, result = replace_line_if_present(
        landing,
        "Any optional cloud services use only the content and data flows agreed before activation.",
        "    d: { en: 'Encrypted authentication with credentials kept out of every log. In the Microsoft Store desktop version, datasets, quantitative results, reports and narrative commentary remain within the client’s local environment. Only the minimum technical data required for licence activation may leave the calculation perimeter.', it: 'Autenticazione cifrata con credenziali escluse da ogni log. Nella versione desktop distribuita tramite Microsoft Store, dataset, risultati quantitativi, report e commento narrativo rimangono nell’ambiente locale del cliente. Solo i dati tecnici minimi necessari all’attivazione della licenza possono uscire dal perimetro di calcolo.', fr: 'Authentification chiffrée avec identifiants exclus de tous les journaux. Dans la version desktop distribuée via Microsoft Store, les jeux de données, résultats quantitatifs, rapports et commentaires narratifs restent dans l’environnement local du client. Seules les données techniques minimales nécessaires à l’activation de la licence peuvent quitter le périmètre de calcul.', de: 'Verschlüsselte Authentifizierung, wobei Anmeldedaten aus allen Protokollen ausgeschlossen bleiben. In der über den Microsoft Store vertriebenen Desktopversion verbleiben Datensätze, quantitative Ergebnisse, Berichte und narrative Kommentare in der lokalen Umgebung des Kunden. Nur die für die Lizenzaktivierung erforderlichen minimalen technischen Daten dürfen den Berechnungsperimeter verlassen.' } },",
        "Trust perimeter",
    )
    operations.append(result)

    landing = landing.replace(
        "AI PROCESSING — local Ollama disclosure + optional cloud config",
        "AI PROCESSING — local Ollama disclosure",
    )

    if "  const cloud = {" in landing:
        start = landing.index("  const cloud = {")
        end = landing.index("  const itemGrid =", start)
        landing = landing[:start] + landing[end:]
        operations.append("AIProcessing cloud configuration object: removed")
    else:
        operations.append("AIProcessing cloud configuration object: already absent")

    cloud_card_start = "        <div className=\"card\" style={{ maxWidth: 980, margin: '28px auto 0'"
    if cloud_card_start in landing:
        start = landing.index(cloud_card_start)
        end = landing.index("        <style>", start)
        landing = landing[:start] + landing[end:]
        operations.append("AIProcessing cloud-provider card: removed")
    else:
        operations.append("AIProcessing cloud-provider card: already absent")

    landing = landing.replace("sous controllo umano", "sous contrôle humain")

    # Privacy notice: no remote LLM route in the standard Microsoft Store product.
    privacy, result = replace_section_if_present(
        privacy,
        "  <h2>9. Optional AI/LLM services</h2>",
        "  <h2>10. Optional Telegram delivery</h2>",
        """  <h2>9. Local AI commentary</h2>
  <p>
    The Microsoft Store desktop version may generate narrative commentary through Ollama running
    locally on the User's device. Market datasets, quantitative results and report content used by
    this function are not sent to external AI providers. Remote LLM endpoints and third-party cloud
    AI providers are not supported by the standard Microsoft Store product.
  </p>
  <p>
    The language model produces qualitative narrative commentary only. Forecasts, probabilities,
    metrics, formulas and all other numerical results are calculated by the Software's quantitative
    engine before the commentary stage.
  </p>

""",
        "Privacy EN AI section",
    )
    operations.append(result)

    privacy, result = replace_section_if_present(
        privacy,
        "  <h2>9. Servizi opzionali di intelligenza artificiale (AI/LLM)</h2>",
        "  <h2>10. Consegna opzionale tramite Telegram</h2>",
        """  <h2>9. Commento AI locale</h2>
  <p>
    La versione desktop distribuita tramite Microsoft Store può generare commenti narrativi tramite
    Ollama in esecuzione locale sul dispositivo dell'Utente. I dataset di mercato, i risultati
    quantitativi e i contenuti del report utilizzati da questa funzione non vengono inviati a provider
    AI esterni. Endpoint LLM remoti e provider AI cloud di terze parti non sono supportati dal prodotto
    standard distribuito tramite Microsoft Store.
  </p>
  <p>
    Il modello linguistico produce esclusivamente commenti narrativi qualitativi. Forecast,
    probabilità, metriche, formule e ogni altro risultato numerico sono calcolati dal motore
    quantitativo del Software prima della fase di commento.
  </p>

""",
        "Privacy IT AI section",
    )
    operations.append(result)

    privacy = privacy.replace(
        "API keys for optional LLM/cloud services",
        "credentials required by supported optional features",
    )
    privacy = privacy.replace(
        "chiavi API per servizi LLM/cloud opzionali",
        "credenziali richieste dalle funzionalità opzionali supportate",
    )
    privacy = privacy.replace(
        "cloud LLMs, Telegram, etc.",
        "Telegram and other supported third-party delivery services",
    )
    privacy = privacy.replace(
        "LLM cloud, Telegram, ecc.",
        "Telegram e altri servizi di consegna di terze parti supportati",
    )
    privacy = privacy.replace(
        "cloud LLMs,\n    Telegram, etc.",
        "Telegram and other supported third-party delivery services",
    )
    privacy = privacy.replace(
        "LLM cloud,\n    Telegram, ecc.",
        "Telegram e altri servizi di consegna di terze parti supportati",
    )

    # EULA alignment.
    eula = eula.replace(
        "Certain optional features may integrate\n    with third-party services (for example a local language model or, if\n    configured by the User, a cloud service); in such cases the relevant\n    provider's terms apply, and the User undertakes to comply with them.",
        "Certain optional features may integrate with supported third-party delivery\n    services. Narrative AI commentary in the Microsoft Store desktop version uses a local\n    Ollama model only; remote LLM endpoints and cloud AI providers are not supported by the\n    standard product. Where a supported third-party delivery service is configured, the\n    relevant provider's terms apply and the User undertakes to comply with them.",
    )
    eula = eula.replace(
        "Alcune funzionalità opzionali possono integrarsi con servizi di terze parti (ad esempio un modello linguistico locale o, se configurato dall'Utente, un servizio cloud); in tali casi si applicano le condizioni del relativo fornitore e l'Utente si impegna a rispettarle.",
        "Alcune funzionalità opzionali possono integrarsi con servizi di consegna di terze parti supportati. Nella versione desktop distribuita tramite Microsoft Store, il commento AI utilizza esclusivamente un modello Ollama locale; endpoint LLM remoti e provider AI cloud non sono supportati dal prodotto standard. Quando viene configurato un servizio di consegna di terze parti supportato, si applicano le condizioni del relativo fornitore e l'Utente si impegna a rispettarle.",
    )

    validation_after = landing.split(validation_start, 1)[1].split(validation_end, 1)[0]
    if validation_after != validation_before:
        raise RuntimeError("Validation section changed unexpectedly")

    required_landing = [
        "Documented CSV and XLSX imports",
        "Import CSV e XLSX documentati",
        "AI-assisted engineering under human control",
        "<Hero />\n      <DashboardPreview />\n      <ReportDownload />",
        "The Microsoft Store desktop version uses only Ollama",
    ]
    for token in required_landing:
        if token not in landing:
            raise RuntimeError(f"Required final website text missing: {token}")

    forbidden_landing = [
        "Compatible with any provider",
        "Compatibile con qualsiasi provider",
        "Cloud AI provider chosen by the client.",
        "Provider AI cloud scelto dal cliente.",
        "If a cloud configuration is requested",
        "Qualora venga richiesta una configurazione cloud",
        "{ name: 'Claude'",
        "{ name: 'ChatGPT'",
        "{ name: 'Grok'",
        "{ name: 'Gemini'",
    ]
    for token in forbidden_landing:
        if token in landing:
            raise RuntimeError(f"Legacy website text remains: {token}")

    LANDING_PATH.write_text(landing, encoding="utf-8")
    PRIVACY_PATH.write_text(privacy, encoding="utf-8")
    EULA_PATH.write_text(eula, encoding="utf-8")

    print("Website alignment completed")
    for operation in operations:
        print(f"- {operation}")
    print("- Validation section unchanged byte-for-byte")


if __name__ == "__main__":
    main()
