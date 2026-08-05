from __future__ import annotations

from pathlib import Path

ROOT = Path.cwd()

OVERRIDE = r'''(function installPrevisioChatLanguageContract() {
  'use strict';

  if (window.__PREVISIO_CHAT_LANGUAGE_CONTRACT__) return;
  window.__PREVISIO_CHAT_LANGUAGE_CONTRACT__ = true;

  var nativeFetch = window.fetch.bind(window);
  var supported = ['en', 'it', 'fr', 'de'];
  var languageNames = {
    en: 'English',
    it: 'Italian',
    fr: 'French',
    de: 'German'
  };

  var disclosurePatterns = [
    /\n+\s*(?:\*\*|##+\s*|__|\*)?\s*(?:fonti(?:\s+interne(?:\s+usate)?)?|riferimenti|bibliografia|references|sources?\s+used|sources?|quellen|sources\s+internes)\s*(?:\*\*|__)?\s*[:.\-]?\s*\n[\s\S]*$/gi,
    /^\s*(?:la\s+)?risposta\s+(?:si\s+basa|[eè]\s+basata)\s+sulle?\s+fonti\s+(?:interne\s+)?recuperate\.?\s*$/gim,
    /^\s*(?:questa\s+)?risposta\s+e\s+stata\s+generata\s+(?:usando|sulla\s+base\s+di)\s+fonti\s+interne\.?\s*$/gim,
    /^\s*(?:the\s+)?answer\s+is\s+based\s+on\s+(?:the\s+)?(?:retrieved\s+)?internal\s+sources\.?\s*$/gim,
    /^\s*(?:this\s+)?response\s+(?:is|was)\s+(?:based|generated)\s+on\s+(?:the\s+)?(?:retrieved\s+)?internal\s+sources\.?\s*$/gim,
    /^\s*(?:la\s+)?r[eé]ponse\s+(?:est|se\s+fonde)\s+(?:bas[eé]e\s+)?sur\s+(?:les\s+)?sources\s+internes\s+r[eé]cup[eé]r[eé]es\.?\s*$/gim,
    /^\s*(?:diese\s+)?antwort\s+basiert\s+auf\s+(?:den\s+)?abgerufenen\s+internen\s+quellen\.?\s*$/gim,
    /^\s*(?:fonti(?:\s+interne(?:\s+usate)?)?|riferimenti|bibliografia|references|sources?\s+used|sources?|quellen|sources\s+internes)\s*[:.\-]?\s*$/gim
  ];

  function selectedLanguage(payload) {
    var candidates = [
      payload && payload.language,
      payload && payload.lang,
      localStorage.getItem('previsio_lang'),
      localStorage.getItem('previsioLang'),
      document.documentElement.lang
    ];

    for (var i = 0; i < candidates.length; i += 1) {
      var value = String(candidates[i] || '').trim().toLowerCase().slice(0, 2);
      if (supported.indexOf(value) !== -1) return value;
    }
    return 'en';
  }

  function sanitizeAnswer(value) {
    var text = String(value || '');
    disclosurePatterns.forEach(function(pattern) {
      text = text.replace(pattern, '');
    });

    text = text
      .replace(/\[\s*(?:fonte|source|quelle)\s+\d+\s*\]/gi, '')
      .replace(/\(\s*(?:fonte|source|quelle)\s+\d+\s*\)/gi, '')
      .replace(/\b(?:fonte|source|quelle)\s+\d+\b/gi, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return text;
  }

  function isChatStart(url, method) {
    return method === 'POST' && /\/api\/chat\/start(?:\?|$)/i.test(url);
  }

  function isChatStatus(url, method) {
    return method === 'GET' && /\/api\/chat\/status\//i.test(url);
  }

  async function sanitizeStatusResponse(response) {
    var contentType = response.headers.get('content-type') || '';
    if (!response.ok || contentType.indexOf('application/json') === -1) return response;

    var data;
    try {
      data = await response.clone().json();
    } catch (error) {
      return response;
    }

    if (!data || data.status !== 'completed') return response;
    if (typeof data.answer === 'string') data.answer = sanitizeAnswer(data.answer);
    if (typeof data.response === 'string') data.response = sanitizeAnswer(data.response);

    var headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  }

  window.fetch = async function previsioLanguageFetch(input, init) {
    var request = input instanceof Request ? input : null;
    var url = request ? request.url : String(input || '');
    var method = String((init && init.method) || (request && request.method) || 'GET').toUpperCase();

    if (isChatStatus(url, method)) {
      return sanitizeStatusResponse(await nativeFetch(input, init));
    }

    if (!isChatStart(url, method)) return nativeFetch(input, init);

    var rawBody = init && init.body;
    if (rawBody == null && request) {
      try {
        rawBody = await request.clone().text();
      } catch (error) {
        return nativeFetch(input, init);
      }
    }

    var payload;
    try {
      payload = JSON.parse(String(rawBody || '{}'));
    } catch (error) {
      return nativeFetch(input, init);
    }

    if (!payload || typeof payload.question !== 'string') {
      return nativeFetch(input, init);
    }

    var language = selectedLanguage(payload);
    payload.language = language;
    payload.lang = language;
    payload.response_language = languageNames[language];

    var headers = new Headers((init && init.headers) || (request && request.headers) || undefined);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept-Language', language);

    var nextInit = Object.assign({}, init || {}, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (request) return nativeFetch(new Request(request, nextInit));
    return nativeFetch(input, nextInit);
  };
})();
'''

(ROOT / "chat-language-override.js").write_text(OVERRIDE, encoding="utf-8")

for relative in ("landing-v11.loader.js", "landing-v11.jsx"):
    path = ROOT / relative
    text = path.read_text(encoding="utf-8")
    old = "chat-language-override.js?v=20260805-1"
    if text.count(old) != 1:
        raise RuntimeError(f"{relative}: expected one old chat cache key")
    path.write_text(text.replace(old, "chat-language-override.js?v=20260805-2"), encoding="utf-8")

for relative in ("index.html", "scripts/build-production.mjs", "scripts/verify-production.mjs"):
    path = ROOT / relative
    text = path.read_text(encoding="utf-8")
    old = "landing-v11.loader.js?v=20260805"
    if old not in text:
        raise RuntimeError(f"{relative}: old loader cache key not found")
    path.write_text(text.replace(old, "landing-v11.loader.js?v=20260805-2"), encoding="utf-8")

verify_path = ROOT / "scripts/verify-production.mjs"
verify = verify_path.read_text(encoding="utf-8")
if "  'chat-language-override.js',\n" not in verify:
    anchor = "  'founder-education-fix.js',\n"
    if verify.count(anchor) != 1:
        raise RuntimeError("verify-production: founder layer anchor not found")
    verify = verify.replace(anchor, anchor + "  'chat-language-override.js',\n")
verify_path.write_text(verify, encoding="utf-8")
