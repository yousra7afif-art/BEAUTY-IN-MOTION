/* BEAUTY IN MOTION — single-page store (vanilla JS)
   Routing on location.hash (#accueil, #boutique, #glow-serum, #panier, #commande, ...).
   Cart and user reviews are kept in localStorage when available (demo only). */

(() => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const app = $("#app");
  const fmt = n => `${Math.round(n * 100) / 100 % 1 === 0 ? Math.round(n) : n.toFixed(2).replace(".", ",")} ${CONFIG.currency}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ALL = [...PRODUCTS, BUNDLE];
  const byId = id => ALL.find(p => p.id === id);
  const dateFR = iso => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable: keep in memory only */ } }
  };

  const state = {
    cart: store.get("bim_cart", []),
    coupon: store.get("bim_coupon", null),
    userReviews: store.get("bim_reviews", []),
    lastOrder: store.get("bim_last_order", null),
    shipping: "standard",
    payment: "cod",
    shopFilter: "all",
    shopSort: "featured",
    shopQuery: "",
    reviewFilter: "all"
  };

  const icons = {
    truck: '<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    cash: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/></svg>',
    gift: '<svg viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 12 9 12 9zm0 0c1.5-3 5-3.5 5-1.2C17 9 12 9 12 9z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 19l1.4-3.8A7.5 7.5 0 1 1 8.3 18z"/><path d="M9 11h.01M12 11h.01M15 11h.01"/></svg>',
    leaf: '<svg viewBox="0 0 24 24"><path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15z"/><path d="M5 19 13 11"/></svg>',
    drop: '<svg viewBox="0 0 24 24"><path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/><path d="M9 14a3 3 0 0 0 3 3"/></svg>',
    rose: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"/><path d="M12 6c-1.5 1-1.5 3 0 4 1.5-1 1.5-3 0-4zM12 14v7M12 18c-2 0-3.5-1-4-3M12 17c2 0 3-1 3.5-2.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    return: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5M4 4v4.5h4.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 6l-6 6 6 6"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg>'
  };
  const STAR_SVG = '<svg class="star-deco" viewBox="0 0 24 24"><path d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0z"/></svg>';
  const WAVES = (color1 = "#A9BED5", color2 = "#6686A5") => `
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" style="width:110%;height:180px">
      <path d="M0 120C240 40 420 40 720 110s520 80 720 0v90H0z" fill="${color1}" opacity=".18"/>
      <path d="M0 150C300 90 520 100 760 140s480 50 680-10v70H0z" fill="${color2}" opacity=".12"/>
    </svg>`;

  // ---------- Reviews ----------
  const allReviews = () => [...state.userReviews, ...REVIEWS];
  const reviewsFor = id => allReviews().filter(r => r.p === id);
  function ratingOf(id) {
    const list = id ? reviewsFor(id) : allReviews();
    if (!list.length) return { avg: 0, count: 0 };
    return { avg: list.reduce((s, r) => s + r.rating, 0) / list.length, count: list.length };
  }
  const stars = r => {
    const full = Math.round(r);
    return `<span class="stars" aria-label="${r.toFixed(1)} sur 5">${"★".repeat(full)}<span class="off">${"★".repeat(5 - full)}</span></span>`;
  };

  // ---------- Cart ----------
  const saveCart = () => { store.set("bim_cart", state.cart); store.set("bim_coupon", state.coupon); updateCartBadge(); };
  const cartQty = () => state.cart.reduce((s, l) => s + l.qty, 0);
  function addToCart(id, qty = 1) {
    const line = state.cart.find(l => l.id === id);
    if (line) line.qty = Math.min(10, line.qty + qty); else state.cart.push({ id, qty: Math.min(10, qty) });
    saveCart();
    const badge = $(".cart-count"); badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    renderDrawer(); openCart();
  }
  function setQty(id, qty) {
    const line = state.cart.find(l => l.id === id);
    if (!line) return;
    line.qty = Math.max(0, Math.min(10, qty));
    if (!line.qty) state.cart = state.cart.filter(l => l.id !== id);
    saveCart(); refreshCartViews();
  }
  function totals() {
    const subtotal = state.cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
    const rate = state.coupon ? (CONFIG.promoCodes[state.coupon] || 0) : 0;
    const discount = Math.round(subtotal * rate * 100) / 100;
    const net = subtotal - discount;
    let shipping = 0;
    if (subtotal > 0) {
      shipping = state.shipping === "express" ? CONFIG.shippingExpress : (net >= CONFIG.freeShippingFrom ? 0 : CONFIG.shippingStandard);
    }
    return { subtotal, discount, shipping, total: net + shipping, net, remaining: Math.max(0, CONFIG.freeShippingFrom - net) };
  }
  function updateCartBadge() {
    const n = cartQty(), b = $(".cart-count");
    b.textContent = n; b.hidden = n === 0;
  }

  function shipProgress(t) {
    const pct = Math.min(100, (t.net / CONFIG.freeShippingFrom) * 100);
    const msg = t.remaining > 0
      ? `Plus que <b>${fmt(t.remaining)}</b> pour profiter de la livraison offerte.`
      : `<b>Bravo !</b> La livraison standard vous est offerte.`;
    return `<div class="ship-progress">${msg}<div class="bar"><i style="width:${pct}%"></i></div></div>`;
  }

  function cartLine(l, variant = "drawer") {
    const p = byId(l.id);
    const qty = `<div class="qty sm"><button data-action="line-dec" data-id="${p.id}" aria-label="Diminuer">−</button><input value="${l.qty}" readonly aria-label="Quantité"><button data-action="line-inc" data-id="${p.id}" aria-label="Augmenter">+</button></div>`;
    if (variant === "page") {
      return `<div class="line">
        <a href="#${p.id}"><img src="${p.images[0]}" alt="${esc(p.name)}"></a>
        <div><a href="#${p.id}"><strong>${p.name}</strong></a><span class="size">${p.fr} · ${p.size}</span>${qty}</div>
        <div class="line-total"><span class="muted small">${fmt(p.price)} / unité</span></div>
        <div class="right"><span class="price">${fmt(p.price * l.qty)}</span><button class="remove" data-action="remove" data-id="${p.id}">Retirer</button></div>
      </div>`;
    }
    return `<div class="line">
      <img src="${p.images[0]}" alt="${esc(p.name)}">
      <div><strong>${p.name}</strong><span class="size">${p.size}</span>${qty}</div>
      <div class="right"><span class="price" style="font-size:.95rem">${fmt(p.price * l.qty)}</span><button class="remove" data-action="remove" data-id="${p.id}">Retirer</button></div>
    </div>`;
  }

  function upsellBlock() {
    const ids = state.cart.map(l => l.id);
    if (!ids.length || ids.includes(BUNDLE.id)) return "";
    const missing = PRODUCTS.filter(p => !ids.includes(p.id));
    if (!missing.length) return "";
    const p = missing[0];
    return `<div class="upsell"><img src="${p.images[0]}" alt=""><div><strong>Complétez votre routine</strong>${p.name} · ${fmt(p.price)}</div><button class="mini-btn" data-action="add" data-id="${p.id}">Ajouter</button></div>`;
  }

  function renderDrawer() {
    const body = $(".drawer-body");
    if (!state.cart.length) {
      body.innerHTML = `<div class="empty"><p style="font-size:1.05rem;color:var(--navy)">Votre panier est vide.</p><p class="small">Découvrez notre routine en 3 gestes.</p><a href="#boutique" class="btn btn-primary" data-action="close-cart">Découvrir la boutique</a></div>`;
      return;
    }
    const t = totals();
    body.innerHTML = `
      ${shipProgress(t)}
      ${state.cart.map(l => cartLine(l)).join("")}
      ${upsellBlock()}
      <div class="drawer-foot">
        <div class="totals">
          <div><span>Sous-total</span><span>${fmt(t.subtotal)}</span></div>
          ${t.discount ? `<div class="disc"><span>Code ${state.coupon}</span><span>−${fmt(t.discount)}</span></div>` : ""}
          <div><span>Livraison standard</span><span>${t.net >= CONFIG.freeShippingFrom ? "Offerte" : fmt(CONFIG.shippingStandard)}</span></div>
        </div>
        <a href="#commande" class="btn btn-primary btn-block" data-action="close-cart">Commander · ${fmt(t.net + (t.net >= CONFIG.freeShippingFrom ? 0 : CONFIG.shippingStandard))}</a>
        <a href="#panier" class="btn btn-ghost btn-block" data-action="close-cart">Voir le panier</a>
        <p class="secure">${icons.lock} Paiement à la livraison ou par carte bancaire</p>
      </div>`;
  }
  function openCart() {
    renderDrawer();
    $(".cart-drawer").classList.add("open");
    $(".cart-drawer").setAttribute("aria-hidden", "false");
    $(".drawer-backdrop").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    $(".cart-drawer").classList.remove("open");
    $(".cart-drawer").setAttribute("aria-hidden", "true");
    $(".drawer-backdrop").hidden = true;
    document.body.style.overflow = "";
  }
  function refreshCartViews() {
    renderDrawer();
    const route = currentRoute();
    if (route === "panier" || route === "commande") render();
  }

  // ---------- Shared blocks ----------
  function productCard(p, i = 0) {
    const r = ratingOf(p.id);
    const isBundle = p.id === BUNDLE.id;
    const ref = isBundle ? PRODUCTS.reduce((s, x) => s + x.price, 0) : null;
    return `<article class="p-card reveal d${i % 4}">
      <a href="#${p.id}" class="p-media" aria-label="${esc(p.name)}">
        ${isBundle ? `<span class="p-tag dark">Offre −${Math.round((1 - p.price / ref) * 100)}%</span>` : `<span class="p-tag">Étape ${p.step} · ${p.stepLabel}</span>`}
        <img src="${p.images[0]}" alt="${esc(p.name)} ${esc(p.fr)}" loading="lazy">
        <img class="alt" src="${p.images[1]}" alt="" loading="lazy">
      </a>
      <div class="p-quick"><button class="btn btn-light btn-block" data-action="add" data-id="${p.id}">Ajout rapide · ${fmt(p.price)}</button></div>
      <div class="p-body">
        <span class="p-motto">${p.motto}</span>
        <h3 class="p-name"><a href="#${p.id}">${p.name}</a></h3>
        <span class="p-fr">${p.fr} · ${p.size}</span>
        ${r.count ? `<div class="rating-line">${stars(r.avg)} <span>${r.avg.toFixed(1)} (${r.count} avis)</span></div>` : ""}
        <div class="p-foot">
          <span class="price">${fmt(p.price)}${ref ? `<s>${fmt(ref)}</s>` : ""}</span>
          <a href="#${p.id}" class="link-arrow">Découvrir</a>
        </div>
      </div>
    </article>`;
  }

  function reviewCard(r) {
    const p = byId(r.p);
    return `<article class="review">
      <div class="review-head">${avatarSVG(r.av ?? 0, 48)}<div><strong>${esc(r.name)}</strong><span>${esc(r.city)} · ${esc(r.age || "")}${r.skin ? " · " + esc(r.skin) : ""}</span></div></div>
      ${stars(r.rating)}
      <h4>${esc(r.title)}</h4>
      <p>${esc(r.text)}</p>
      <div class="review-meta"><a href="#${p.id}">${p.name}</a><span>${dateFR(r.date)}</span></div>
    </article>`;
  }

  function reviewSummary(id) {
    const list = id ? reviewsFor(id) : allReviews();
    const r = ratingOf(id);
    const dist = [5, 4, 3, 2, 1].map(n => ({ n, c: list.filter(x => x.rating === n).length }));
    return `<div class="reviews-summary">
      <div><div class="big-score">${r.avg.toFixed(1)}</div>${stars(r.avg)}<div class="small muted">${r.count} avis clients</div></div>
      <div class="dist">${dist.map(d => `<div class="dist-row"><span>${d.n} ★</span><div class="dist-bar"><i style="width:${r.count ? (d.c / r.count) * 100 : 0}%"></i></div><span>${d.c}</span></div>`).join("")}</div>
    </div>`;
  }

  const BADGES = `<div class="badges">
    <div class="badge reveal">${icons.truck}<div><strong>Livraison 24h–72h</strong><span>Partout au Maroc</span></div></div>
    <div class="badge reveal d1">${icons.cash}<div><strong>Paiement à la livraison</strong><span>Ou carte bancaire sécurisée</span></div></div>
    <div class="badge reveal d2">${icons.gift}<div><strong>Livraison offerte</strong><span>Dès ${CONFIG.freeShippingFrom} DH d'achat</span></div></div>
    <div class="badge reveal d3">${icons.chat}<div><strong>Conseil personnalisé</strong><span>Sur WhatsApp, 7j/7</span></div></div>
  </div>`;

  const FAQ = [
    ["Quels sont les délais de livraison ?", `Les commandes sont expédiées sous 24h ouvrées. Comptez 48 à 72h partout au Maroc en livraison standard (${CONFIG.shippingStandard} DH, offerte dès ${CONFIG.freeShippingFrom} DH), et 24h en express à Casablanca et Rabat (${CONFIG.shippingExpress} DH).`],
    ["Quels moyens de paiement acceptez-vous ?", "Vous pouvez payer en espèces à la livraison partout au Maroc, par carte bancaire (Visa, Mastercard, cartes marocaines CMI) via une page de paiement sécurisée 3-D Secure, ou par virement bancaire."],
    ["Dans quel ordre utiliser les produits ?", "Nettoyez avec le Daily Cleanser, appliquez 3 à 4 gouttes de Glow Serum, puis terminez par l'Hydrating Cream. Le matin, ajoutez une protection solaire en dernière étape."],
    ["Les produits conviennent-ils aux peaux sensibles ?", "La gamme a été pensée pour tous les types de peau. En cas de peau très réactive, faites un test au pli du coude 24h avant la première utilisation et évitez le contour des yeux."],
    ["Puis-je retourner un produit ?", "Vous disposez de 7 jours après réception pour retourner un produit non ouvert. Contactez-nous sur WhatsApp ou par e-mail avec votre numéro de commande."],
    ["Les soins conviennent-ils aussi aux hommes ?", "Oui ! Les textures sont légères, non grasses et discrètement parfumées : la routine en 3 gestes convient à toutes et à tous."],
    ["Comment utiliser un code promo ?", "Saisissez votre code dans le panier ou lors du paiement. Nouvelle cliente ? Profitez de −10% avec le code BIENVENUE10."]
  ];
  const faqList = (items, start = 0) => `<div class="faq-list">${items.map(([q, a], i) => `
    <div class="faq-item reveal"><button class="faq-q" data-action="faq" aria-expanded="false"><span><span class="n">[${String(i + 1 + start).padStart(2, "0")}]</span>${q}</span><span class="plus">+</span></button>
    <div class="faq-a"><div><p>${a}</p></div></div></div>`).join("")}</div>`;

  const ctaBanner = () => `<section class="section-sm"><div class="container">
    <div class="cta-banner reveal">
      <img src="logo-symbol-white.png" alt="" class="wave-bg">
      <div><span class="eyebrow">Rejoignez le mouvement</span><h2 class="h-lg">−10% sur votre première routine</h2><p style="color:#B8C7D8;margin:0">Inscrivez-vous pour recevoir conseils skincare, nouveautés et offres en avant-première.</p></div>
      <form data-form="newsletter"><input type="email" required placeholder="Votre adresse e-mail" aria-label="Votre adresse e-mail"><button class="btn btn-light" type="submit">Je m'inscris</button></form>
    </div></div></section>`;

  // ---------- Views ----------
  function viewHome() {
    const top = ratingOf();
    const serum = byId("glow-serum");
    return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow reveal">Nouvelle routine skincare</span>
          <h1 class="h-xl reveal d1">Réveillez votre <em>beauté</em>,<br>révélez votre <em>énergie</em>.</h1>
          <p class="lead reveal d2">Trois soins essentiels — nettoyer, illuminer, hydrater — pour une peau fraîche et lumineuse qui suit le rythme de vos journées. Glow with every move.</p>
          <div class="hero-ctas reveal d3">
            <a href="#boutique" class="btn btn-primary">Découvrir la gamme</a>
            <a href="#routine" class="btn btn-ghost">Voir la routine en vidéo</a>
          </div>
          <div class="hero-trust reveal d3">
            <div>${stars(top.avg)} <span>${top.avg.toFixed(1)}/5 · ${top.count} avis</span></div>
            <div>${icons.truck}<span>Livraison partout au Maroc</span></div>
            <div>${icons.cash}<span>Paiement à la livraison</span></div>
          </div>
        </div>
        <div class="hero-visual reveal d2">
          <div class="hero-arch"><img src="model-serum.jpg" alt="Femme appliquant le Glow Serum BEAUTY IN MOTION"></div>
          <a href="#glow-serum" class="float-card fc1"><img src="${serum.images[1]}" alt=""><div><strong>Glow Serum</strong><span>${fmt(serum.price)} · ${serum.size}</span></div></a>
          <div class="float-card fc2">${avatarSVG(0, 44)}<div><strong>« Mon teint a changé »</strong><span class="stars">★★★★★</span></div></div>
          <span style="position:absolute;top:-14px;left:12%">${STAR_SVG}</span>
        </div>
      </div>
      <div class="hero-waves">${WAVES()}</div>
    </section>

    <div class="words" aria-hidden="true"><div class="track">${Array(2).fill("<span>CLEANSE</span><i>✦</i><span>GLOW</span><i>✦</i><span>HYDRATE</span><i>✦</i><span>ÉNERGIE</span><i>✦</i><span>MOUVEMENT</span><i>✦</i><span>ÉCLAT</span><i>✦</i>").join("")}</div></div>

    <section class="section-sm"><div class="container">${BADGES}</div></section>

    <section class="section" style="padding-top:40px">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow reveal">La gamme</span><h2 class="h-lg reveal d1">Trois soins, <em>une routine</em>.</h2></div>
          <p class="lead reveal d2">Une première gamme claire et complémentaire, à prix accessibles — à adopter un par un ou en coffret.</p>
        </div>
        <div class="product-grid four">${ALL.map(productCard).join("")}</div>
      </div>
    </section>

    <section class="section routine">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow reveal">Comment l'utiliser</span><h2 class="h-lg reveal d1">Votre routine <em>en 3 gestes</em></h2></div>
          <a href="#routine" class="link-arrow reveal">Le guide complet</a>
        </div>
        <div class="steps">${PRODUCTS.map((p, i) => `
          <a href="#${p.id}" class="step reveal d${i}">
            <div class="step-media"><img src="${p.images[1]}" alt="${p.name}" loading="lazy"><div class="step-scene">${usageScene(p.anim, [2, 0, 4][i])}</div></div>
            <div class="step-num">0${i + 1}</div>
            <h3>${p.stepLabel} — ${p.name}</h3>
            <p>${p.howTo[1]} ${p.when}.</p>
          </a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0;background:var(--white)">
      <div class="container">
        <div class="center" style="margin-bottom:40px"><span class="eyebrow reveal">Beauty in motion</span><h2 class="h-lg reveal d1">La routine <em>en mouvement</em></h2></div>
        ${videoBlock("promo")}
      </div>
    </section>

    <section class="section ingredients">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow reveal">Ingrédients clés</span><h2 class="h-lg reveal d1">Le meilleur du Maroc,<br><em>la précision du soin</em>.</h2></div>
          <p class="lead reveal d2">Nous associons des actifs reconnus en dermocosmétique à des ingrédients marocains emblématiques, en toute transparence.</p>
        </div>
        <div class="ing-grid">
          <div class="ing reveal"><span class="origin">Kelâat M'Gouna</span><div class="ing-ico">${icons.rose}</div><h3>Eau de rose</h3><p>Rafraîchit et tonifie la peau dès le nettoyage. Dans le Daily Cleanser.</p></div>
          <div class="ing reveal d1"><span class="origin">Souss</span><div class="ing-ico">${icons.leaf}</div><h3>Huile d'argan</h3><p>Nourrit et adoucit, naturellement riche en vitamine E. Dans l'Hydrating Cream.</p></div>
          <div class="ing reveal d2"><div class="ing-ico">${icons.drop}</div><h3>Acide hyaluronique</h3><p>Retient l'eau pour une peau repulpée et confortable. Dans le sérum et la crème.</p></div>
          <div class="ing reveal d3"><div class="ing-ico">${icons.spark}</div><h3>Niacinamide</h3><p>Aide à unifier le teint et à affiner le grain de peau. Dans le Glow Serum.</p></div>
        </div>
      </div>
    </section>

    <section class="section values">
      <img src="logo-symbol-white.png" alt="" class="values-wave">
      <div class="container">
        <span class="eyebrow reveal">Nos valeurs</span>
        <h2 class="h-lg reveal d1" style="max-width:780px">Une marque <em>dynamique</em>, moderne et accessible, pour exprimer votre beauté au quotidien.</h2>
        <div class="value-list">
          ${[["Énergie", "Encourager une beauté vivante et positive."], ["Créativité", "Une identité visuelle actuelle et reconnaissable."], ["Confiance", "Transparence sur nos formules et exigence de qualité."], ["Modernité", "Suivre les nouvelles habitudes et tendances skincare."], ["Accessibilité", "Des soins de qualité à prix accessibles."]]
            .map(([t, d], i) => `<div class="value reveal d${i % 4}"><span class="num">[0${i + 1}]</span><h3>${t}</h3><p>${d}</p></div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container lookbook">
        <div class="look-images reveal">
          <div class="li1"><img src="model-cream.jpg" alt="Application de l'Hydrating Cream" loading="lazy"><a href="#hydrating-cream" class="look-tag"><img src="cream-3.jpg" alt="">Hydrating Cream</a></div>
          <div class="li2"><img src="model-serum.jpg" alt="Application du Glow Serum" loading="lazy" style="object-position:50% 30%"><a href="#glow-serum" class="look-tag"><img src="serum-1.jpg" alt="">Glow Serum</a></div>
        </div>
        <div>
          <span class="eyebrow reveal">#GlowWithEveryMove</span>
          <h2 class="h-lg reveal d1">Elles bougent,<br>leur peau <em>rayonne</em>.</h2>
          <p class="lead reveal d2">Étudiantes, mamans, entrepreneures, sportives… La routine BEAUTY IN MOTION s'adapte à toutes les journées, en moins de 3 minutes.</p>
          <div class="scene-row reveal d3">
            ${PRODUCTS.map((p, i) => `<a href="#${p.id}" class="scene-card">${usageScene(p.anim, [5, 8, 1][i])}<strong>${p.stepLabel}</strong><span>${p.name}</span></a>`).join("")}
          </div>
          <a href="#avis" class="btn btn-primary reveal">Lire les avis clients</a>
        </div>
      </div>
    </section>

    <section class="section" style="background:var(--white)">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow reveal">Avis clients</span><h2 class="h-lg reveal d1">Elles en <em>parlent</em></h2></div>
          <div class="scroller-nav"><button class="round-btn" data-action="scroll-reviews" data-dir="-1" aria-label="Avis précédents">${icons.arrowL}</button><button class="round-btn" data-action="scroll-reviews" data-dir="1" aria-label="Avis suivants">${icons.arrowR}</button></div>
        </div>
        <div class="review-scroller">${allReviews().filter(r => r.rating >= 4).slice(0, 9).map(reviewCard).join("")}</div>
        <div class="center" style="margin-top:30px"><a href="#avis" class="link-arrow">Voir les ${ratingOf().count} avis</a></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="center" style="margin-bottom:40px"><span class="eyebrow reveal">FAQ</span><h2 class="h-lg reveal d1">Vos <em>questions</em></h2></div>
        ${faqList(FAQ.slice(0, 4))}
        <div class="center" style="margin-top:30px"><a href="#faq" class="link-arrow">Toutes les questions</a></div>
      </div>
    </section>
    ${ctaBanner()}`;
  }

  function videoBlock(kind = "routine") {
    const v = kind === "promo"
      ? { src: "promo-16x9.mp4", poster: "promo-poster.jpg", label: "Publicité BEAUTY IN MOTION" }
      : { src: "routine.mp4", poster: "routine-poster.jpg", label: "Vidéo : la routine BEAUTY IN MOTION en 3 étapes" };
    return `<div class="video-wrap reveal">
      <video src="${v.src}" poster="${v.poster}" playsinline loop preload="metadata" aria-label="${v.label}"></video>
      <button class="play-btn" data-action="play-video" aria-label="Lire la vidéo"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></button>
    </div>`;
  }

  function pageHero(crumb, eyebrow, title, lead) {
    return `<section class="page-hero"><div class="container">
      <nav class="breadcrumb"><a href="#accueil">Accueil</a><span>/</span><span>${crumb}</span></nav>
      <span class="eyebrow">${eyebrow}</span><h1 class="h-lg">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}
    </div></section>`;
  }

  function viewShop() {
    const filters = [["all", "Tout"], ["nettoyer", "Nettoyer"], ["eclat", "Éclat"], ["hydrater", "Hydrater"], ["coffret", "Coffrets"]];
    return `${pageHero("Boutique", "La boutique", "Tous nos <em>soins</em>", "Une gamme courte, efficace et complémentaire. Livraison partout au Maroc, paiement à la livraison.")}
    <section class="section" style="padding-top:10px"><div class="container">
      <div class="shop-bar">
        <div class="chip-row">${filters.map(([k, l]) => `<button class="chip ${state.shopFilter === k ? "active" : ""}" data-action="shop-filter" data-k="${k}">${l}</button>`).join("")}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <label class="search-input"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" id="shop-search" placeholder="Rechercher un soin, un ingrédient…" value="${esc(state.shopQuery)}"></label>
          <select class="sort" id="shop-sort" aria-label="Trier">
            <option value="featured" ${state.shopSort === "featured" ? "selected" : ""}>Recommandés</option>
            <option value="asc" ${state.shopSort === "asc" ? "selected" : ""}>Prix croissant</option>
            <option value="desc" ${state.shopSort === "desc" ? "selected" : ""}>Prix décroissant</option>
            <option value="rating" ${state.shopSort === "rating" ? "selected" : ""}>Mieux notés</option>
          </select>
        </div>
      </div>
      <div id="shop-results"></div>
    </div></section>
    <section class="section-sm"><div class="container">${BADGES}</div></section>`;
  }
  function renderShopResults() {
    const q = state.shopQuery.trim().toLowerCase();
    let list = ALL.filter(p => state.shopFilter === "all" || p.category === state.shopFilter);
    if (q) list = list.filter(p => [p.name, p.fr, p.short, p.motto, ...(p.keyIngredients || []).map(i => i.name)].join(" ").toLowerCase().includes(q));
    if (state.shopSort === "asc") list.sort((a, b) => a.price - b.price);
    if (state.shopSort === "desc") list.sort((a, b) => b.price - a.price);
    if (state.shopSort === "rating") list.sort((a, b) => ratingOf(b.id).avg - ratingOf(a.id).avg);
    $("#shop-results").innerHTML = list.length
      ? `<div class="product-grid four">${list.map(productCard).join("")}</div>`
      : `<div class="empty"><p>Aucun soin ne correspond à « ${esc(state.shopQuery)} ».</p><button class="btn btn-ghost" data-action="shop-reset">Réinitialiser</button></div>`;
    observeReveal();
  }

  function buyBlock(p) {
    const t = totals();
    const after = Math.max(0, CONFIG.freeShippingFrom - t.net - p.price);
    return `
      <div class="buy-row">
        <div class="qty"><button data-action="pdp-dec" aria-label="Diminuer">−</button><input id="pdp-qty" type="number" min="1" max="10" value="1" aria-label="Quantité"><button data-action="pdp-inc" aria-label="Augmenter">+</button></div>
        <button class="btn btn-primary" data-action="add-pdp" data-id="${p.id}">Ajouter au panier · ${fmt(p.price)}</button>
      </div>
      <button class="btn btn-ghost btn-block" data-action="buy-now" data-id="${p.id}">Acheter maintenant</button>
      <div class="reassure">
        <div>${icons.truck}<span>${after > 0 ? `Plus que ${fmt(after)} après cet article pour la livraison offerte` : "Livraison standard offerte avec cet article"}</span></div>
        <div>${icons.cash}<span>Paiement à la livraison ou par carte bancaire sécurisée</span></div>
        <div>${icons.return}<span>Retour possible sous 7 jours (produit non ouvert)</span></div>
      </div>`;
  }

  function gallery(p) {
    return `<div class="gallery reveal">
      <div class="thumbs">${p.images.map((src, i) => `<button class="${i === 0 ? "active" : ""}" data-action="thumb" data-src="${src}" aria-label="Image ${i + 1}"><img src="${src}" alt=""></button>`).join("")}</div>
      <div class="main-img" data-action="zoom"><img id="main-img" src="${p.images[0]}" alt="${esc(p.name)} — ${esc(p.fr)}"></div>
    </div>`;
  }

  function accordion(items, openFirst = true) {
    return `<div class="accordion">${items.map(([q, a], i) => `
      <div class="acc-item ${openFirst && i === 0 ? "open" : ""}"><button class="acc-q" data-action="acc" aria-expanded="${openFirst && i === 0}"><span>${q}</span><span class="plus">+</span></button>
      <div class="acc-a"><div><div class="inner">${a}</div></div></div></div>`).join("")}</div>`;
  }

  function reviewsSection(id) {
    const list = reviewsFor(id);
    return `<section class="section" id="pdp-reviews"><div class="container">
      <div class="section-head"><div><span class="eyebrow">Avis clients</span><h2 class="h-lg">Ce qu'elles <em>en pensent</em></h2></div></div>
      ${reviewSummary(id)}
      <div class="review-grid">${list.map(reviewCard).join("") || `<p class="muted">Soyez la première à donner votre avis.</p>`}</div>
      <form class="review-form" data-form="review" data-id="${id}">
        <h3 class="h-md" style="font-size:1.2rem">Donner votre avis</h3>
        <div class="field"><label>Votre note</label>
          <div class="star-input">${[5, 4, 3, 2, 1].map(n => `<input type="radio" name="rating" id="r${n}" value="${n}" ${n === 5 ? "checked" : ""}><label for="r${n}" title="${n} étoiles">★</label>`).join("")}</div></div>
        <div class="grid-2">
          <div class="field"><label for="rv-name">Prénom</label><input id="rv-name" name="name" required maxlength="30"><span class="err">Indiquez votre prénom.</span></div>
          <div class="field"><label for="rv-city">Ville</label><select id="rv-city" name="city">${CONFIG.cities.map(c => `<option>${c}</option>`).join("")}</select></div>
        </div>
        <div class="field"><label for="rv-title">Titre</label><input id="rv-title" name="title" required maxlength="60"><span class="err">Ajoutez un titre.</span></div>
        <div class="field"><label for="rv-text">Votre avis</label><textarea id="rv-text" name="text" required minlength="10" maxlength="500"></textarea><span class="err">Votre avis doit contenir au moins 10 caractères.</span></div>
        <button class="btn btn-primary" type="submit">Publier mon avis</button>
      </form>
    </div></section>`;
  }

  function viewProduct(p) {
    const r = ratingOf(p.id);
    const others = PRODUCTS.filter(x => x.id !== p.id);
    return `
    <section class="page-hero" style="padding-bottom:20px"><div class="container">
      <nav class="breadcrumb"><a href="#accueil">Accueil</a><span>/</span><a href="#boutique">Boutique</a><span>/</span><span>${p.name}</span></nav>
    </div></section>
    <section style="padding-bottom:90px"><div class="container pdp">
      ${gallery(p)}
      <div class="pdp-info">
        <span class="eyebrow">Étape ${p.step} · ${p.stepLabel}</span>
        <h1>${p.name}</h1>
        <div class="p-fr">${p.fr} — <span style="letter-spacing:.12em;font-size:.8rem;text-transform:uppercase;color:var(--steel)">${p.motto}</span></div>
        <a href="#pdp-reviews" data-action="goto-reviews" class="rating-line" style="margin-top:12px">${stars(r.avg)} <span>${r.avg.toFixed(1)} · ${r.count} avis</span></a>
        <div class="pdp-price"><span class="price">${fmt(p.price)}</span><span class="size">${p.size}</span></div>
        <p class="pdp-short">${p.short}</p>
        <div class="spec-row">
          <div class="spec"><span>Peau</span><strong>${p.skin.split(",")[0]}</strong></div>
          <div class="spec"><span>Texture</span><strong>${p.texture}</strong></div>
          <div class="spec"><span>Quand</span><strong>${p.when}</strong></div>
        </div>
        ${shipProgress(totals())}
        ${buyBlock(p)}
        ${accordion([
          ["Description", `<p>${p.description}</p><p class="small"><b>Pour qui :</b> ${p.skin}. <b>Parfum :</b> ${p.scent}.</p>`],
          ["Bénéfices", `<ul>${p.benefits.map(b => `<li>${b}</li>`).join("")}</ul>`],
          ["Ingrédients", `<div class="ing-list">${p.keyIngredients.map(i => `<div><span><strong>${i.name}</strong> — ${i.role}</span></div>`).join("")}</div><div class="inci"><b>Composition (INCI) :</b> ${p.inci}</div><p class="note" style="margin-top:10px">Formule indicative de projet, à valider par un formulateur et selon la réglementation cosmétique.</p>`],
          ["Mode d'emploi", `<ol style="padding-left:18px;margin:0">${p.howTo.map(s => `<li>${s}</li>`).join("")}</ol><p style="margin-top:10px"><b>Conseil :</b> ${p.tips}</p>`],
          ["Livraison & paiement", `<p>Expédition sous 24h ouvrées. Standard 48–72h : ${fmt(CONFIG.shippingStandard)} (offerte dès ${fmt(CONFIG.freeShippingFrom)}). Express 24h à Casablanca et Rabat : ${fmt(CONFIG.shippingExpress)}.</p><p>Paiement à la livraison, carte bancaire (Visa, Mastercard, CMI) ou virement.</p>`]
        ])}
      </div>
    </div></section>

    <section class="section howto"><div class="container howto-grid">
      <div class="howto-scene reveal">${usageScene(p.anim, { "bubbles": 2, "drop": 0, "cream": 4 }[p.anim])}</div>
      <div>
        <span class="eyebrow reveal">Comment l'utiliser</span>
        <h2 class="h-lg reveal d1">${p.stepLabel}, <em>en douceur</em></h2>
        <div class="howto-steps">${p.howTo.map((s, i) => `<div class="howto-step reveal d${i % 4}"><b>${i + 1}</b><p>${s}</p></div>`).join("")}</div>
        <div class="when-pill reveal">${icons.clock} ${p.when} · Étape ${p.step} de la routine</div>
      </div>
    </div></section>

    ${reviewsSection(p.id)}

    <section class="section" style="background:var(--white)"><div class="container">
      <div class="section-head"><div><span class="eyebrow">Complétez votre routine</span><h2 class="h-lg">Ils vont <em>ensemble</em></h2></div></div>
      <div class="product-grid">${[...others, BUNDLE].map(productCard).join("")}</div>
    </div></section>`;
  }

  function viewBundle(b) {
    const items = b.items.map(byId);
    const ref = items.reduce((s, x) => s + x.price, 0);
    const r = ratingOf(b.id);
    return `
    <section class="page-hero" style="padding-bottom:20px"><div class="container">
      <nav class="breadcrumb"><a href="#accueil">Accueil</a><span>/</span><a href="#boutique">Boutique</a><span>/</span><span>${b.name}</span></nav>
    </div></section>
    <section style="padding-bottom:90px"><div class="container pdp">
      ${gallery(b)}
      <div class="pdp-info">
        <span class="eyebrow">Coffret découverte · Offre de lancement</span>
        <h1>${b.name}</h1>
        <div class="p-fr">${b.fr} — <span style="letter-spacing:.12em;font-size:.8rem;text-transform:uppercase;color:var(--steel)">${b.motto}</span></div>
        <a href="#pdp-reviews" data-action="goto-reviews" class="rating-line" style="margin-top:12px">${stars(r.avg)} <span>${r.avg.toFixed(1)} · ${r.count} avis</span></a>
        <div class="pdp-price"><span class="price">${fmt(b.price)}</span><s class="muted">${fmt(ref)}</s><span class="p-tag dark" style="position:static">Vous économisez ${fmt(ref - b.price)}</span></div>
        <p class="pdp-short">${b.description}</p>
        <div class="panel" style="padding:20px;margin:20px 0">
          ${items.map(p => `<div class="sum-line"><div class="thumb"><img src="${p.images[0]}" alt=""></div><div><a href="#${p.id}"><strong style="font-weight:500;color:var(--navy)">${p.name}</strong></a><div class="small muted">${p.fr} · ${p.size}</div></div><span class="muted small">${fmt(p.price)}</span></div>`).join("")}
        </div>
        ${buyBlock(b)}
        ${accordion([
          ["La routine du coffret", `<ol style="padding-left:18px;margin:0">${items.map(p => `<li><b>${p.stepLabel}</b> avec le ${p.name} — ${p.howTo[1].toLowerCase()}</li>`).join("")}</ol><p style="margin-top:10px">Le matin, terminez par une protection solaire.</p>`],
          ["Idée cadeau", "<p>Le coffret est livré dans un étui élégant aux couleurs de la marque. Ajoutez un message personnalisé dans la note de commande.</p>"],
          ["Livraison & paiement", `<p>Livraison standard offerte avec ce coffret. Paiement à la livraison, carte bancaire ou virement.</p>`]
        ])}
      </div>
    </div></section>
    ${reviewsSection(b.id)}`;
  }

  function viewRoutine() {
    return `${pageHero("La routine", "Guide d'utilisation", "La routine <em>BEAUTY IN MOTION</em>", "Moins de 3 minutes, matin et soir. Voici comment tirer le meilleur de chaque soin.")}
    <section class="section" style="padding-top:10px"><div class="container">${videoBlock()}</div></section>
    <section class="section howto" style="padding-top:80px"><div class="container">
      ${PRODUCTS.map((p, i) => `
        <div class="howto-grid" style="margin-bottom:90px">
          <div class="howto-scene reveal">${usageScene(p.anim, [2, 0, 4][i])}</div>
          <div>
            <span class="eyebrow reveal">Étape 0${i + 1} · ${p.when}</span>
            <h2 class="h-lg reveal d1">${p.stepLabel} — <a href="#${p.id}"><em>${p.name}</em></a></h2>
            <div class="howto-steps">${p.howTo.map((s, j) => `<div class="howto-step reveal d${j % 4}"><b>${j + 1}</b><p>${s}</p></div>`).join("")}</div>
            <p class="muted reveal" style="margin-top:18px"><b style="color:var(--navy)">Conseil :</b> ${p.tips}</p>
            <button class="btn btn-ghost reveal" data-action="add" data-id="${p.id}">Ajouter au panier · ${fmt(p.price)}</button>
          </div>
        </div>`).join("")}
      <div class="grid-2" style="gap:22px">
        <div class="panel reveal"><h3 style="display:flex;gap:10px;align-items:center"><span style="width:26px;display:inline-block">${icons.sun.replace("<svg", '<svg style="stroke:var(--navy);fill:none;stroke-width:1.4"')}</span> Routine du matin</h3>
          <ol style="margin:0;padding-left:18px;color:#42546B"><li>Daily Cleanser</li><li>Glow Serum</li><li>Hydrating Cream</li><li>Protection solaire</li></ol></div>
        <div class="panel reveal d1" style="margin-top:0"><h3 style="display:flex;gap:10px;align-items:center"><span style="width:26px;display:inline-block">${icons.moon.replace("<svg", '<svg style="stroke:var(--navy);fill:none;stroke-width:1.4"')}</span> Routine du soir</h3>
          <ol style="margin:0;padding-left:18px;color:#42546B"><li>Démaquillage si besoin</li><li>Daily Cleanser</li><li>Glow Serum</li><li>Hydrating Cream (couche plus généreuse)</li></ol></div>
      </div>
      <div class="center" style="margin-top:50px"><a href="#coffret-routine" class="btn btn-primary">Obtenir la routine complète · ${fmt(BUNDLE.price)}</a></div>
    </div></section>`;
  }

  function viewAbout() {
    const palette = [["Deep Navy Blue", "#203B59"], ["Steel Blue", "#6686A5"], ["Powder Blue", "#A9BED5"], ["Light Grey", "#D5D9E0"], ["Icy White", "#F5F7FA"]];
    return `${pageHero("Notre histoire", "Notre histoire", "La beauté <em>en mouvement</em>", "")}
    <section class="section" style="padding-top:10px"><div class="container about-grid">
      <div class="about-img reveal"><img src="model-cream.jpg" alt="Campagne BEAUTY IN MOTION"></div>
      <div>
        <p class="lead reveal" style="font-size:1.2rem;color:var(--ink)">BEAUTY IN MOTION est née d'une idée simple : la beauté du quotidien est faite de mouvement et d'énergie.</p>
        <p class="muted reveal d1">Nous imaginons des soins de la peau modernes, pratiques et accessibles, pensés pour les femmes marocaines actives qui veulent exprimer leur beauté et leur personnalité au quotidien. Notre première gamme réunit trois gestes essentiels — nettoyer, illuminer, hydrater — dans une identité élégante et facilement reconnaissable.</p>
        <p class="muted reveal d2">Notre personnalité ? Le dynamisme : moderne, énergique, créative, innovante et spontanée. Elle se retrouve dans nos formules, notre packaging et chaque moment passé avec nos clientes.</p>
        <blockquote class="reveal d3" style="margin:30px 0 0;padding-left:20px;border-left:2px solid var(--steel);font-size:1.25rem;font-weight:300;color:var(--navy)">« Réveillez votre beauté, révélez votre énergie ! »</blockquote>
      </div>
    </div></section>

    <section class="section" style="background:var(--white)"><div class="container about-grid">
      <div>
        <span class="eyebrow reveal">Notre identité</span>
        <h2 class="h-lg reveal d1">Deux vagues, <em>une étoile</em>.</h2>
        <p class="muted reveal d2">Les deux vagues fluides évoquent le mouvement, la fluidité et l'énergie. L'étoile symbolise l'éclat et la lumière. Le nom, en lettres majuscules fines, affirme le caractère élégant de la marque.</p>
        <div class="palette reveal d3">${palette.map(([n, h]) => `<div class="swatch"><i style="background:${h}"></i><div><strong>${n}</strong>${h}</div></div>`).join("")}</div>
      </div>
      <div class="logo-panel reveal"><img src="logo-full.png" alt="Logo BEAUTY IN MOTION — Glow with every move."></div>
    </div></section>

    <section class="section values">
      <img src="logo-symbol-white.png" alt="" class="values-wave">
      <div class="container">
        <span class="eyebrow">Nos valeurs</span>
        <h2 class="h-lg" style="max-width:760px">Ce qui nous <em>anime</em></h2>
        <div class="value-list">
          ${[["Énergie", "Encourager une beauté vivante et positive."], ["Créativité", "Proposer une identité visuelle actuelle et reconnaissable."], ["Confiance", "Valoriser la transparence et la qualité des produits."], ["Modernité", "Suivre les nouvelles habitudes et tendances skincare."], ["Accessibilité", "Une offre au positionnement prix accessible à intermédiaire."]]
            .map(([t, d], i) => `<div class="value"><span class="num">[0${i + 1}]</span><h3>${t}</h3><p>${d}</p></div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section"><div class="container">
      <div class="section-head"><div><span class="eyebrow">Pour qui ?</span><h2 class="h-lg">Pensée pour <em>vous</em></h2></div></div>
      <div class="target-grid">
        <div class="target reveal"><span class="tag">Cœur de cible</span><h3>Femmes actives, 25–40 ans</h3><p>Urbaines, attentives à la qualité et à la composition, à la recherche de soins fiables.</p></div>
        <div class="target reveal d1"><span class="tag">Jeunes femmes</span><h3>18–25 ans</h3><p>Sensibles aux nouveautés, aux tendances beauté et aux offres, elles veulent des soins accessibles.</p></div>
        <div class="target reveal d2"><span class="tag">Et aussi</span><h3>Pour toutes et tous</h3><p>Femmes de 40 à 55 ans, hommes adeptes de soins, amateurs de naturel et de dermocosmétique.</p></div>
      </div>
      <p class="muted center" style="margin-top:40px">Bientôt disponible en parapharmacies et boutiques spécialisées à Casablanca, Rabat, Marrakech, Tanger et Agadir.</p>
    </div></section>
    ${ctaBanner()}`;
  }

  function viewReviews() {
    const chips = [["all", "Tous"], ...ALL.map(p => [p.id, p.name])];
    const list = allReviews().filter(r => state.reviewFilter === "all" || r.p === state.reviewFilter);
    return `${pageHero("Avis", "Avis clients", "Elles ont <em>testé</em>", "")}
    <section class="section" style="padding-top:10px"><div class="container">
      ${reviewSummary(state.reviewFilter === "all" ? null : state.reviewFilter)}
      <div class="chip-row">${chips.map(([k, l]) => `<button class="chip ${state.reviewFilter === k ? "active" : ""}" data-action="review-filter" data-k="${k}">${l}</button>`).join("")}</div>
      <div class="review-grid">${list.map(reviewCard).join("")}</div>
      <p class="note center" style="margin-top:30px">Avis fictifs rédigés pour la démonstration (projet académique).</p>
    </div></section>`;
  }

  function viewFaq() {
    return `${pageHero("FAQ", "Aide", "Questions <em>fréquentes</em>", "Livraison, paiement, utilisation des soins : tout ce qu'il faut savoir.")}
    <section class="section" style="padding-top:10px"><div class="container">${faqList(FAQ)}
      <div class="center" style="margin-top:50px"><p class="muted">Vous ne trouvez pas votre réponse ?</p><a href="#contact" class="btn btn-primary">Nous contacter</a></div>
    </div></section>`;
  }

  function viewContact() {
    return `${pageHero("Contact", "Contact", "Parlons <em>skincare</em>", "Une question sur votre routine ou une commande ? Notre équipe vous répond 7j/7.")}
    <section class="section" style="padding-top:10px"><div class="container contact-grid">
      <div>
        <div class="contact-item">${icons.chat}<div><strong>WhatsApp Business</strong><span>${CONFIG.phone} · conseil personnalisé</span></div></div>
        <div class="contact-item">${icons.mail}<div><strong>E-mail</strong><span>${CONFIG.email}</span></div></div>
        <div class="contact-item">${icons.spark}<div><strong>Réseaux sociaux</strong><span>Instagram ${CONFIG.instagram} · TikTok ${CONFIG.tiktok}</span></div></div>
        <div class="contact-item">${icons.clock}<div><strong>Horaires</strong><span>Lundi – samedi : 9h – 19h · Dimanche : 10h – 16h</span></div></div>
        <div class="contact-item">${icons.pin}<div><strong>Villes livrées</strong><span>Partout au Maroc · Express 24h à Casablanca et Rabat</span></div></div>
      </div>
      <form class="panel" data-form="contact" novalidate>
        <h3>Envoyez-nous un message</h3>
        <div class="grid-2">
          <div class="field"><label for="c-name">Nom complet</label><input id="c-name" name="name" required><span class="err">Indiquez votre nom.</span></div>
          <div class="field"><label for="c-mail">E-mail</label><input id="c-mail" name="email" type="email" required><span class="err">E-mail invalide.</span></div>
        </div>
        <div class="field"><label for="c-subj">Sujet</label><select id="c-subj" name="subject"><option>Conseil produit</option><option>Suivi de commande</option><option>Retour / échange</option><option>Partenariat</option><option>Autre</option></select></div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required minlength="10"></textarea><span class="err">Votre message est trop court.</span></div>
        <button class="btn btn-primary" type="submit">Envoyer</button>
      </form>
    </div></section>`;
  }

  function stepsBar(n) {
    const labels = ["Panier", "Livraison & paiement", "Confirmation"];
    return `<div class="checkout-steps">${labels.map((l, i) => `${i ? "<i></i>" : ""}<span class="${i + 1 < n ? "done" : i + 1 === n ? "current" : ""}"><b>${i + 1 < n ? "✓" : i + 1}</b>${l}</span>`).join("")}</div>`;
  }

  function summaryPanel(withCoupon = true, cta = "") {
    const t = totals();
    return `<div class="panel summary">
      <h3>Récapitulatif</h3>
      ${state.cart.map(l => { const p = byId(l.id); return `<div class="sum-line"><div class="thumb"><img src="${p.images[0]}" alt=""><span class="q">${l.qty}</span></div><div><strong style="font-weight:500;color:var(--navy)">${p.name}</strong><div class="small muted">${p.size}</div></div><span>${fmt(p.price * l.qty)}</span></div>`; }).join("")}
      ${withCoupon ? `<form class="coupon" data-form="coupon"><input name="code" placeholder="Code promo" value="${state.coupon || ""}" aria-label="Code promo"><button class="btn btn-ghost" type="submit">Appliquer</button></form><div class="coupon-msg" id="coupon-msg">${state.coupon ? `<span class="ok">Code ${state.coupon} appliqué (−${CONFIG.promoCodes[state.coupon] * 100}%) · <a href="#" data-action="remove-coupon" style="text-decoration:underline">retirer</a></span>` : `<span class="muted">Essayez BIENVENUE10</span>`}</div>` : ""}
      <div class="totals">
        <div><span>Sous-total</span><span>${fmt(t.subtotal)}</span></div>
        ${t.discount ? `<div class="disc"><span>Remise ${state.coupon}</span><span>−${fmt(t.discount)}</span></div>` : ""}
        <div><span>Livraison ${state.shipping === "express" ? "express" : "standard"}</span><span>${t.shipping ? fmt(t.shipping) : "Offerte"}</span></div>
        <div class="grand"><span>Total TTC</span><span>${fmt(t.total)}</span></div>
      </div>
      ${cta}
    </div>`;
  }

  function viewCart() {
    if (!state.cart.length) {
      return `${pageHero("Panier", "Panier", "Votre panier est <em>vide</em>", "Commencez votre routine avec nos trois essentiels.")}
      <section class="section" style="padding-top:10px"><div class="container"><div class="product-grid four">${ALL.map(productCard).join("")}</div></div></section>`;
    }
    state.shipping = "standard";
    return `<section class="page-hero"><div class="container">
      <nav class="breadcrumb"><a href="#accueil">Accueil</a><span>/</span><span>Panier</span></nav>
      <h1 class="h-lg">Votre <em>panier</em></h1>${stepsBar(1)}</div></section>
    <section style="padding-bottom:100px"><div class="container cart-layout">
      <div>
        <div class="panel"><div class="cart-table">${state.cart.map(l => cartLine(l, "page")).join("")}</div>
          <div style="margin-top:20px">${shipProgress(totals())}</div>
          <div style="margin-top:16px">${upsellBlock()}</div>
        </div>
        <a href="#boutique" class="link-arrow" style="margin-top:22px">← Continuer mes achats</a>
      </div>
      ${summaryPanel(true, `<a href="#commande" class="btn btn-primary btn-block" style="margin-top:20px">Passer la commande</a><p class="secure">${icons.lock} Paiement sécurisé · Paiement à la livraison disponible</p>`)}
    </div></section>`;
  }

  function viewCheckout() {
    if (!state.cart.length) { location.hash = "panier"; return ""; }
    const d = store.get("bim_checkout", {});
    const v = k => esc(d[k] || "");
    const expressOk = CONFIG.expressCities.includes(d.city);
    if (!expressOk && state.shipping === "express") state.shipping = "standard";
    const t = totals();
    return `<section class="page-hero"><div class="container">
      <nav class="breadcrumb"><a href="#accueil">Accueil</a><span>/</span><a href="#panier">Panier</a><span>/</span><span>Commande</span></nav>
      <h1 class="h-lg">Finaliser ma <em>commande</em></h1>${stepsBar(2)}</div></section>
    <section style="padding-bottom:100px"><div class="container cart-layout">
      <form id="checkout-form" data-form="checkout" novalidate>
        <div class="panel">
          <h3>1. Vos coordonnées</h3>
          <div class="grid-2">
            <div class="field"><label for="f-first">Prénom *</label><input id="f-first" name="first" autocomplete="given-name" required value="${v("first")}"><span class="err">Indiquez votre prénom.</span></div>
            <div class="field"><label for="f-last">Nom *</label><input id="f-last" name="last" autocomplete="family-name" required value="${v("last")}"><span class="err">Indiquez votre nom.</span></div>
            <div class="field"><label for="f-phone">Téléphone *</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" placeholder="06 12 34 56 78" required value="${v("phone")}"><span class="err">Numéro marocain invalide (ex. 06 12 34 56 78).</span></div>
            <div class="field"><label for="f-email">E-mail *</label><input id="f-email" name="email" type="email" autocomplete="email" required value="${v("email")}"><span class="err">Adresse e-mail invalide.</span></div>
          </div>
        </div>
        <div class="panel">
          <h3>2. Adresse de livraison</h3>
          <div class="grid-2">
            <div class="field"><label for="f-city">Ville *</label><select id="f-city" name="city" required><option value="">Choisir une ville</option>${CONFIG.cities.map(c => `<option ${d.city === c ? "selected" : ""}>${c}</option>`).join("")}</select><span class="err">Choisissez votre ville.</span></div>
            <div class="field"><label for="f-zip">Code postal</label><input id="f-zip" name="zip" inputmode="numeric" maxlength="5" value="${v("zip")}"></div>
          </div>
          <div class="field"><label for="f-address">Adresse complète *</label><input id="f-address" name="address" autocomplete="street-address" placeholder="Rue, numéro, quartier, résidence…" required value="${v("address")}"><span class="err">Indiquez votre adresse.</span></div>
          <div class="field"><label for="f-note">Note pour le livreur ou message cadeau</label><textarea id="f-note" name="note" style="min-height:80px">${v("note")}</textarea></div>
        </div>
        <div class="panel">
          <h3>3. Mode de livraison</h3>
          <label class="option ${state.shipping === "standard" ? "selected" : ""}"><input type="radio" name="shipping" value="standard" ${state.shipping === "standard" ? "checked" : ""}><div class="o-main"><strong>Livraison standard · 48–72h</strong><span>Partout au Maroc, par transporteur</span></div><span class="o-price">${t.net >= CONFIG.freeShippingFrom ? "Offerte" : fmt(CONFIG.shippingStandard)}</span></label>
          <label class="option ${state.shipping === "express" ? "selected" : ""} ${expressOk ? "" : "disabled"}"><input type="radio" name="shipping" value="express" ${state.shipping === "express" ? "checked" : ""} ${expressOk ? "" : "disabled"}><div class="o-main"><strong>Livraison express · 24h</strong><span>${expressOk ? "Livraison le lendemain" : "Disponible uniquement à Casablanca et Rabat"}</span></div><span class="o-price">${fmt(CONFIG.shippingExpress)}</span></label>
        </div>
        <div class="panel">
          <h3>4. Paiement</h3>
          <label class="option ${state.payment === "cod" ? "selected" : ""}"><input type="radio" name="payment" value="cod" ${state.payment === "cod" ? "checked" : ""}><div class="o-main"><strong>Paiement à la livraison</strong><span>Réglez en espèces à la réception de votre colis</span></div>${icons.cash.replace("<svg", '<svg width="26" height="26" style="stroke:var(--navy);fill:none;stroke-width:1.3"')}</label>
          <label class="option ${state.payment === "card" ? "selected" : ""}"><input type="radio" name="payment" value="card" ${state.payment === "card" ? "checked" : ""}><div class="o-main"><strong>Carte bancaire</strong><span>Paiement sécurisé 3-D Secure</span><div class="pay-logos"><em>VISA</em><em>Mastercard</em><em>CMI</em></div>
            ${state.payment === "card" ? `<div class="card-sim">${icons.lock.replace("<svg", '<svg width="16" height="16" style="stroke:#fff;fill:none;stroke-width:1.6;vertical-align:-3px"')} Vous serez redirigée vers la <strong>page de paiement sécurisée</strong> de notre banque pour saisir votre carte. <br><span style="opacity:.8">Démo : le paiement est simulé, aucune donnée bancaire n'est demandée ni enregistrée.</span></div>` : ""}</div></label>
          <label class="option ${state.payment === "transfer" ? "selected" : ""}"><input type="radio" name="payment" value="transfer" ${state.payment === "transfer" ? "checked" : ""}><div class="o-main"><strong>Virement bancaire</strong><span>Nos coordonnées bancaires vous sont envoyées par e-mail ; expédition à réception du virement</span></div></label>
          <label class="option" style="border:0;padding:6px 0;margin:0"><input type="checkbox" name="cgv" required><div class="o-main"><span>J'accepte les conditions générales de vente et la politique de confidentialité.</span></div></label>
          <div class="field" id="cgv-err" style="margin:0"><span class="err" style="display:none">Veuillez accepter les conditions générales.</span></div>
        </div>
      </form>
      ${summaryPanel(true, `<button class="btn btn-primary btn-block" style="margin-top:20px" data-action="place-order">${state.payment === "card" ? "Payer" : "Confirmer la commande"} · ${fmt(t.total)}</button><p class="secure">${icons.shield} Vos données sont protégées</p>`)}
    </div></section>`;
  }

  function viewConfirmation() {
    const o = state.lastOrder;
    if (!o) return `${pageHero("Confirmation", "Commande", "Aucune commande <em>récente</em>", "")}<div class="container center" style="padding-bottom:80px"><a href="#boutique" class="btn btn-primary">Aller à la boutique</a></div>`;
    const payLabel = { cod: "Paiement à la livraison", card: "Carte bancaire (simulation)", transfer: "Virement bancaire" }[o.payment];
    const eta = new Date(o.date); eta.setDate(eta.getDate() + (o.shipping === "express" ? 1 : 3));
    return `<section class="section" style="padding-top:50px"><div class="container">
      ${stepsBar(3)}
      <div class="confirm">
        <svg class="check-anim" viewBox="0 0 100 100" fill="none" stroke="var(--navy)" stroke-width="3" stroke-linecap="round"><circle cx="50" cy="50" r="46"/><path d="M30 52l14 13 27-30"/></svg>
        <span class="eyebrow">Commande ${o.number}</span>
        <h1 class="h-lg">Merci ${esc(o.customer.first)}, votre commande est <em>confirmée</em> !</h1>
        <p class="lead">Un récapitulatif a été envoyé à ${esc(o.customer.email)}. ${o.payment === "cod" ? `Préparez ${fmt(o.totals.total)} à la livraison.` : o.payment === "transfer" ? "Nos coordonnées bancaires vous sont envoyées par e-mail ; votre colis part dès réception du virement." : "Votre paiement a été accepté."}</p>
        <div class="timeline"><div class="on">Commande reçue</div><div>En préparation</div><div>Expédiée</div><div>Livrée · ${eta.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</div></div>
        <div class="panel order-box">
          <div class="grid-2" style="gap:20px">
            <div><h3 style="font-size:1rem;margin-bottom:8px">Livraison</h3><p class="small muted" style="margin:0">${esc(o.customer.first)} ${esc(o.customer.last)}<br>${esc(o.customer.address)}<br>${esc(o.customer.zip || "")} ${esc(o.customer.city)}<br>${esc(o.customer.phone)}</p></div>
            <div><h3 style="font-size:1rem;margin-bottom:8px">Paiement & expédition</h3><p class="small muted" style="margin:0">${payLabel}<br>Livraison ${o.shipping === "express" ? "express 24h" : "standard 48–72h"}</p></div>
          </div>
          <hr style="border:0;border-top:1px solid var(--grey);margin:22px 0">
          ${o.lines.map(l => `<div class="sum-line"><div class="thumb"><img src="${l.img}" alt=""><span class="q">${l.qty}</span></div><div><strong style="font-weight:500;color:var(--navy)">${l.name}</strong><div class="small muted">${l.size}</div></div><span>${fmt(l.price * l.qty)}</span></div>`).join("")}
          <div class="totals" style="margin-top:14px">
            <div><span>Sous-total</span><span>${fmt(o.totals.subtotal)}</span></div>
            ${o.totals.discount ? `<div class="disc"><span>Remise ${o.coupon}</span><span>−${fmt(o.totals.discount)}</span></div>` : ""}
            <div><span>Livraison</span><span>${o.totals.shipping ? fmt(o.totals.shipping) : "Offerte"}</span></div>
            <div class="grand"><span>Total</span><span>${fmt(o.totals.total)}</span></div>
          </div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:30px;flex-wrap:wrap"><a href="#routine" class="btn btn-primary">Découvrir comment utiliser mes soins</a><a href="#accueil" class="btn btn-ghost">Retour à l'accueil</a></div>
      </div>
    </div></section>`;
  }

  // ---------- Router ----------
  const ROUTES = {
    accueil: viewHome, boutique: viewShop, routine: viewRoutine, "notre-histoire": viewAbout, avis: viewReviews,
    faq: viewFaq, contact: viewContact, panier: viewCart, commande: viewCheckout, confirmation: viewConfirmation
  };
  const currentRoute = () => (location.hash || "#accueil").slice(1) || "accueil";

  function render() {
    const route = currentRoute();
    const product = byId(route);
    let html;
    if (ROUTES[route]) html = ROUTES[route]();
    else if (product) html = product.id === BUNDLE.id ? viewBundle(product) : viewProduct(product);
    else html = viewHome();
    app.innerHTML = html;
    const title = product ? `${product.name} — BEAUTY IN MOTION` : "BEAUTY IN MOTION — Glow with every move.";
    document.title = title;
    $$(".main-nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === route || (!!product && a.dataset.nav === "boutique")));
    if (route === "boutique") renderShopResults();
    observeReveal();
  }
  function navigate() {
    $(".mobile-menu").hidden = true;
    closeCart();
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // ---------- Reveal on scroll ----------
  let io;
  function observeReveal() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    io = io || new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(e => io.observe(e));
  }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $(".toast"); t.innerHTML = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  // ---------- Forms ----------
  const phoneOk = s => /^(?:\+212|00212|0)[5-7]\d{8}$/.test(s.replace(/[\s.-]/g, ""));
  const emailOk = s => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
  function setErr(input, bad) { input.closest(".field")?.classList.toggle("error", bad); return !bad; }

  function saveCheckoutDraft(form) {
    const fd = new FormData(form); const d = {};
    ["first", "last", "phone", "email", "city", "zip", "address", "note"].forEach(k => d[k] = fd.get(k) || "");
    store.set("bim_checkout", d);
    return d;
  }

  function placeOrder() {
    const form = $("#checkout-form");
    const d = saveCheckoutDraft(form);
    let ok = true;
    ok = setErr(form.first, !d.first.trim()) && ok;
    ok = setErr(form.last, !d.last.trim()) && ok;
    ok = setErr(form.phone, !phoneOk(d.phone)) && ok;
    ok = setErr(form.email, !emailOk(d.email)) && ok;
    ok = setErr(form.city, !d.city) && ok;
    ok = setErr(form.address, d.address.trim().length < 6) && ok;
    const cgv = form.cgv.checked;
    $("#cgv-err .err").style.display = cgv ? "none" : "block";
    ok = cgv && ok;
    if (!ok) { const first = $(".field.error input, .field.error select", form) || form.cgv; first.focus(); first.scrollIntoView({ block: "center", behavior: "smooth" }); toast("Merci de compléter les champs indiqués."); return; }

    const t = totals();
    const now = new Date();
    const order = {
      number: `BIM-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: now.toISOString(), customer: d, shipping: state.shipping, payment: state.payment, coupon: state.coupon, totals: t,
      lines: state.cart.map(l => { const p = byId(l.id); return { id: p.id, name: p.name, size: p.size, img: p.images[0], price: p.price, qty: l.qty }; })
    };
    const overlay = document.createElement("div");
    overlay.className = "processing";
    overlay.innerHTML = state.payment === "card"
      ? `<div class="gateway"><div class="spinner"></div><h3>Redirection vers le paiement sécurisé…</h3><p class="small muted">Simulation de la passerelle bancaire 3-D Secure.<br>Montant : <b>${fmt(t.total)}</b></p></div>`
      : `<div><div class="spinner"></div><h3>Validation de votre commande…</h3></div>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
      if (state.payment === "card") overlay.querySelector("h3").textContent = "Paiement accepté ✓";
      setTimeout(() => {
        overlay.remove();
        state.lastOrder = order; store.set("bim_last_order", order);
        state.cart = []; state.coupon = null; saveCart();
        location.hash = "confirmation";
      }, state.payment === "card" ? 1000 : 300);
    }, state.payment === "card" ? 1800 : 1100);
  }

  document.addEventListener("submit", e => {
    const form = e.target.closest("form[data-form]");
    if (!form) return;
    e.preventDefault();
    const type = form.dataset.form;
    if (type === "newsletter") {
      const input = form.querySelector("input[type=email]");
      if (!emailOk(input.value)) { toast("Adresse e-mail invalide."); return; }
      form.reset(); toast("Bienvenue dans le mouvement ! Votre code : <b>BIENVENUE10</b>");
    }
    if (type === "coupon") {
      const code = form.code.value.trim().toUpperCase();
      if (CONFIG.promoCodes[code]) { state.coupon = code; saveCart(); refreshCartViews(); toast(`Code ${code} appliqué !`); }
      else { const m = $("#coupon-msg"); if (m) m.innerHTML = `<span class="ko">Ce code n'est pas valide.</span>`; }
    }
    if (type === "contact") {
      let ok = setErr(form.name, !form.name.value.trim());
      ok = setErr(form.email, !emailOk(form.email.value)) && ok;
      ok = setErr(form.message, form.message.value.trim().length < 10) && ok;
      if (!ok) return;
      form.reset(); toast("Message bien reçu — nous vous répondons sous 24h.");
    }
    if (type === "review") {
      let ok = setErr(form.name, !form.name.value.trim());
      ok = setErr(form.title, !form.title.value.trim()) && ok;
      ok = setErr(form.text, form.text.value.trim().length < 10) && ok;
      if (!ok) return;
      const r = { p: form.dataset.id, name: form.name.value.trim(), city: form.city.value, age: "", skin: "", rating: +form.rating.value, date: new Date().toISOString().slice(0, 10), title: form.title.value.trim(), text: form.text.value.trim(), av: Math.floor(Math.random() * AV_STYLES.length) };
      state.userReviews.unshift(r); store.set("bim_reviews", state.userReviews);
      render(); toast("Merci pour votre avis !");
      setTimeout(() => $("#pdp-reviews")?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  });

  document.addEventListener("input", e => {
    if (e.target.id === "shop-search") { state.shopQuery = e.target.value; renderShopResults(); }
    if (e.target.closest("#checkout-form")) { e.target.closest(".field")?.classList.remove("error"); }
  });

  document.addEventListener("change", e => {
    if (e.target.id === "shop-sort") { state.shopSort = e.target.value; renderShopResults(); }
    const form = e.target.closest("#checkout-form");
    if (form) {
      saveCheckoutDraft(form);
      if (e.target.name === "shipping") { state.shipping = e.target.value; render(); }
      if (e.target.name === "payment") { state.payment = e.target.value; render(); }
      if (e.target.name === "city") { render(); }
      if (e.target.name === "cgv" && e.target.checked) $("#cgv-err .err").style.display = "none";
    }
  });

  // ---------- Click actions ----------
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action, id = el.dataset.id;
    switch (a) {
      case "add": e.preventDefault(); addToCart(id, 1); break;
      case "add-pdp": addToCart(id, Math.max(1, Math.min(10, +$("#pdp-qty").value || 1))); break;
      case "buy-now": addToCart(id, Math.max(1, Math.min(10, +$("#pdp-qty").value || 1))); closeCart(); location.hash = "commande"; break;
      case "pdp-inc": $("#pdp-qty").value = Math.min(10, (+$("#pdp-qty").value || 1) + 1); break;
      case "pdp-dec": $("#pdp-qty").value = Math.max(1, (+$("#pdp-qty").value || 1) - 1); break;
      case "line-inc": setQty(id, state.cart.find(l => l.id === id).qty + 1); break;
      case "line-dec": setQty(id, state.cart.find(l => l.id === id).qty - 1); break;
      case "remove": setQty(id, 0); toast(`${byId(id).name} retiré du panier.`); break;
      case "remove-coupon": e.preventDefault(); state.coupon = null; saveCart(); refreshCartViews(); break;
      case "open-cart": openCart(); break;
      case "close-cart": closeCart(); break;
      case "toggle-menu": { const m = $(".mobile-menu"); m.hidden = !m.hidden; break; }
      case "thumb": $("#main-img").src = el.dataset.src; $$(".thumbs button").forEach(b => b.classList.toggle("active", b === el)); break;
      case "zoom": el.classList.toggle("zoom"); break;
      case "acc": case "faq": {
        const item = el.parentElement; const open = item.classList.toggle("open"); el.setAttribute("aria-expanded", open); break;
      }
      case "shop-filter": state.shopFilter = el.dataset.k; $$("[data-action=shop-filter]").forEach(c => c.classList.toggle("active", c === el)); renderShopResults(); break;
      case "shop-reset": state.shopQuery = ""; state.shopFilter = "all"; render(); break;
      case "review-filter": state.reviewFilter = el.dataset.k; render(); break;
      case "scroll-reviews": { const s = $(".review-scroller"); s.scrollBy({ left: +el.dataset.dir * s.clientWidth * .9, behavior: "smooth" }); break; }
      case "goto-reviews": e.preventDefault(); $("#pdp-reviews")?.scrollIntoView({ behavior: "smooth" }); break;
      case "play-video": {
        const v = el.parentElement.querySelector("video"); v.controls = true; el.remove();
        const p = v.play(); if (p && p.catch) p.catch(() => {}); break;
      }
      case "place-order": placeOrder(); break;
    }
  });

  // Main-img zoom follows the pointer
  document.addEventListener("mousemove", e => {
    const box = e.target.closest(".main-img.zoom"); if (!box) return;
    const r = box.getBoundingClientRect();
    box.querySelector("img").style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });

  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); $(".mobile-menu").hidden = true; } });
  window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", window.scrollY > 10), { passive: true });
  window.addEventListener("hashchange", navigate);

  updateCartBadge();
  render();
})();
