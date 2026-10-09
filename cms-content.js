/* Chœur Lumina — lecture des contenus éditables avec Pages CMS.
   Les pages HTML restent utilisables même si un fichier de contenu est indisponible. */
(() => {
  "use strict";
  const q = (selector) => document.querySelector(selector);
  const text = (selector, value) => {
    const el = q(selector);
    if (el && typeof value === "string") el.textContent = value;
  };
  const splitTitle = (selector, first, second, lineBreak = true) => {
    const el = q(selector);
    if (!el || typeof first !== "string" || typeof second !== "string") return;
    const em = document.createElement("em");
    em.textContent = second;
    const nodes = [document.createTextNode(first)];
    if (lineBreak) nodes.push(document.createElement("br"));
    else nodes.push(document.createTextNode(" "));
    nodes.push(em);
    el.replaceChildren(...nodes);
  };
  const safeUrl = (raw) => {
    if (!raw || typeof raw !== "string") return null;
    try {
      const url = new URL(raw, location.origin);
      return url.protocol === "https:" || (url.origin === location.origin && url.protocol === "http:") ? url.href : null;
    } catch { return null; }
  };
  const image = (selector, path, alt) => {
    const el = q(selector), src = safeUrl(path);
    if (el && src) {
      el.src = src;
      if (typeof alt === "string") el.alt = alt;
    }
  };
  const load = async (name) => {
    const response = await fetch("/contenu/" + name + ".json", { cache: "no-store" });
    if (!response.ok) throw new Error("Fichier de contenu indisponible : " + name);
    return response.json();
  };
  const render = {
    accueil(d) {
      splitTitle("#welcome-title", d.titre_1, d.titre_2);
      text(".hero-copy > p", d.introduction);
      image(".photo-frame img", d.photo, d.photo_alt);
      ["mariages", "concerts", "ceremonies", "prives"].forEach((key, index) =>
        text(".discover-strip a:nth-child(" + (index + 1) + ") small", d[key]));
    },
    choeur(d) {
      splitTitle("#choir-title", d.titre_1, d.titre_2);
      text(".identity-intro .intro-copy .lead", d.introduction);
      text(".identity-intro .intro-copy > p:not(.section-kicker):not(.lead)", d.histoire);
      [d.valeur_1, d.valeur_2, d.valeur_3].forEach((value, i) =>
        text(".aside-values > div:nth-child(" + (i + 1) + ") small", value));
      splitTitle("#music-title", d.repertoire_titre_1, d.repertoire_titre_2);
      text(".music-content > p:nth-of-type(1)", d.repertoire_1);
      text(".music-content > p:nth-of-type(2)", d.repertoire_2);
      text(".gathering-card:nth-child(1) .frequency-pill", d.repetitions_rythme);
      text(".gathering-card:nth-child(1) h3", d.repetitions_lieu);
      text(".gathering-card:nth-child(1) > p", d.repetitions_description);
      text(".gathering-card:nth-child(2) .frequency-pill", d.animations_rythme);
      text(".gathering-card:nth-child(2) h3", d.animations_lieu);
      text(".gathering-card:nth-child(2) > p", d.animations_description);
    },
    prestations(d) {
      splitTitle("#page-title", d.titre_1, d.titre_2);
      text(".intro-emphasis", d.accroche);
      text(".intro-side > p:nth-of-type(1)", d.introduction_1);
      text(".intro-side > p:nth-of-type(2)", d.introduction_2);
      image(".intro-visual img", d.photo);
      ["mariages", "concerts", "ceremonies", "prives"].forEach((key, index) =>
        text(".offers-grid .offer-card:nth-child(" + (index + 1) + ") > p", d[key]));
    },
    evenements(d) {
      splitTitle("#events-title", d.titre_1, d.titre_2);
      text(".events-copy .events-lead", d.introduction);
      text(".events-copy > p:not(.section-kicker):not(.events-lead)", d.explication);
      text(".events-heading > p", d.agenda_vide);
    },
    partenaires(d) {
      splitTitle(".inner-hero h1", d.titre_1, d.titre_2, false);
      text(".inner-hero-content > p:last-child", d.introduction);
      text(".partners .two-col > div:last-child > p", d.collaboration);
    },
    contact(d) {
      splitTitle(".inner-hero h1", d.titre_1, d.titre_2, false);
      text(".inner-hero-content > p:last-child", d.introduction);
      text(".contact-grid > div:first-child > p:not(.overline)", d.conseils);
      if (typeof d.email === "string" && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(d.email)) {
        const el = q(".contact-mail");
        if (el) {
          el.href = "mailto:" + d.email;
          el.textContent = d.email + " ↗";
        }
      }
    }
  };
  const dateLabel = (iso) => {
    const day = typeof iso === "string" ? iso.slice(0, 10) : "";
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(day)) return null;
    const date = new Date(day + "T12:00:00");
    if (!Number.isFinite(date.getTime())) return null;
    return { day, label: new Intl.DateTimeFormat("fr-FR", {day:"numeric",month:"long",year:"numeric"}).format(date) };
  };
  const renderAgenda = (entries) => {
    const list = q(".events-cards");
    if (!list || !Array.isArray(entries)) return;
    const today = new Date();
    const current = [today.getFullYear(), String(today.getMonth()+1).padStart(2,"0"), String(today.getDate()).padStart(2,"0")].join("-");
    const upcoming = entries.filter(e => e && e.publie === true && dateLabel(e.date) && String(e.date).slice(0,10) >= current)
      .sort((a,b) => String(a.date).localeCompare(String(b.date)));
    if (!upcoming.length) return;
    const cards = upcoming.map(e => {
      const card = document.createElement("article");
      card.className = "event-card cms-event-card";
      const poster = safeUrl(e.image);
      if (poster) {
        const img = document.createElement("img");
        img.className = "cms-event-image";
        img.src = poster;
        img.alt = "Visuel de l'événement " + (e.titre || "");
        img.loading = "lazy";
        card.append(img);
      }
      const h3 = document.createElement("h3");
      h3.textContent = e.titre || "Rendez-vous du Chœur Lumina";
      card.append(h3);
      const info = document.createElement("p");
      const d = dateLabel(e.date);
      info.className = "cms-event-details";
      info.textContent = [d.label, e.heure, e.lieu].filter(Boolean).join(" · ");
      card.append(info);
      if (e.description) {
        const desc = document.createElement("p");
        desc.textContent = e.description;
        card.append(desc);
      }
      const href = safeUrl(e.lien);
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.rel = "noopener noreferrer";
        link.textContent = "Informations pratiques ↗";
        card.append(link);
      }
      return card;
    });
    list.replaceChildren(...cards);
    text("#agenda .events-heading > p", "Voici les prochains rendez-vous confirmés du Chœur Lumina. Les informations sont mises à jour à mesure de leur préparation.");
    text("#agenda-title", "À retrouver prochainement.");
  };
  const renderPartners = (entries) => {
    const holder = q(".partner-placeholder");
    if (!holder || !Array.isArray(entries)) return;
    const published = entries.filter(e => e && e.publie === true && e.nom);
    if (!published.length) return;
    holder.classList.add("cms-partner-grid");
    holder.replaceChildren(...published.map(e => {
      const article = document.createElement("article");
      article.className = "cms-partner-card";
      const logo = safeUrl(e.logo);
      if (logo) {
        const img = document.createElement("img");
        img.src = logo;
        img.alt = "Logo de " + e.nom;
        img.loading = "lazy";
        article.append(img);
      }
      const title = document.createElement("h3");
      title.textContent = e.nom;
      article.append(title);
      if (e.description) {
        const p = document.createElement("p");
        p.textContent = e.description;
        article.append(p);
      }
      const linkUrl = safeUrl(e.site);
      if (linkUrl) {
        const a = document.createElement("a");
        a.href = linkUrl;
        a.rel = "noopener noreferrer";
        a.target = "_blank";
        a.textContent = "Visiter le site ↗";
        article.append(a);
      }
      return article;
    }));
  };
  document.addEventListener("DOMContentLoaded", () => {
    const pathname = location.pathname.replace(/index\\.html$/, "").replace(/\\/$/, "") || "/";
    const slugByPath = {"/":"accueil","/choeur":"choeur","/prestations":"prestations","/evenements":"evenements","/partenaires":"partenaires","/contact":"contact"};
    const slug = slugByPath[pathname];
    if (!slug) return;
    load(slug).then(data => render[slug](data)).catch(err => console.warn("Contenu Lumina :", err.message));
    if (slug === "evenements") load("agenda").then(renderAgenda).catch(err => console.warn("Agenda Lumina :",err.message));
    if (slug === "partenaires") load("organisations").then(renderPartners).catch(err => console.warn("Partenaires Lumina :",err.message));
  });
})();
