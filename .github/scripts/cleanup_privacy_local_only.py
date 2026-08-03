from pathlib import Path

path = Path(__file__).resolve().parents[2] / "privacy.html"
text = path.read_text(encoding="utf-8")

replacements = {
    "diagnostic bundles or support materials, or configures external services described in the\n    following sections.": "diagnostic bundles or support materials, or configures the optional Telegram delivery\n    described below.",
    "volontariamente di inviare pacchetti diagnostici o materiali di supporto, ovvero configuri\n    servizi esterni descritti nelle sezioni successive.": "volontariamente di inviare pacchetti diagnostici o materiali di supporto, oppure configuri\n    la consegna opzionale tramite Telegram descritta di seguito.",
    "token, API keys of optional services, other credentials": "token and other credentials required by supported optional features",
    "Telegram, chiavi API di servizi opzionali, altre credenziali": "Telegram e altre credenziali richieste dalle funzionalità opzionali supportate",
    "Third-party services that the User independently decides to configure (cloud LLM, Telegram,\n    etc.)": "Supported third-party delivery services that the User independently decides to configure (for example, Telegram)",
    "Transfers arising\n    from third-party services configured by the User (cloud LLM, Telegram, etc.)": "Transfers arising\n    from supported third-party delivery services configured by the User (for example, Telegram)",
}

changed = False
for old, new in replacements.items():
    if old in text:
        text = text.replace(old, new)
        changed = True

forbidden = [
    "cloud LLM",
    "LLM cloud",
    "API keys of optional services",
    "chiavi API di servizi opzionali",
    "configures external services described in the",
    "configuri\n    servizi esterni descritti",
]
for token in forbidden:
    if token in text:
        raise RuntimeError(f"Legacy privacy wording remains: {token}")

if not changed:
    raise RuntimeError("No privacy cleanup was applied")

path.write_text(text, encoding="utf-8")
