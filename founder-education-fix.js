/* PREVISIO founder education status compatibility layer.
   Keeps the public biography explicit that the LIUC degree is still in progress. */
(function applyFounderEducationStatus() {
  const replacements = [
    {
      from: 'I bring to this project a background in Business Analytics for Management at LIUC Business University',
      to: 'I am currently pursuing a degree in Business Analytics for Management at LIUC Business University'
    },
    {
      from: 'Porto in questo percorso una formazione in Business Analytics for Management alla LIUC Business University',
      to: 'Sto conseguendo la laurea in Business Analytics for Management alla LIUC Business University'
    },
    {
      from: 'J’apporte à ce projet une formation en Business Analytics for Management à la LIUC Business University',
      to: 'Je suis actuellement en cours d’obtention d’un diplôme en Business Analytics for Management à la LIUC Business University'
    },
    {
      from: 'Ich bringe in dieses Projekt eine Ausbildung in Business Analytics for Management an der LIUC Business University ein',
      to: 'Ich absolviere derzeit ein Studium in Business Analytics for Management an der LIUC Business University'
    }
  ];

  function updateBiography() {
    const biography = document.querySelector('#about .about-bio');
    if (!biography) return;

    let updated = biography.textContent || '';
    for (const replacement of replacements) {
      if (updated.includes(replacement.from)) {
        updated = updated.replace(replacement.from, replacement.to);
        break;
      }
    }

    if (updated !== biography.textContent) {
      biography.textContent = updated;
    }
  }

  const observer = new MutationObserver(updateBiography);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  document.addEventListener('DOMContentLoaded', updateBiography, { once: true });
  window.addEventListener('load', updateBiography, { once: true });
  updateBiography();
})();
