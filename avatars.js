/* Illustrated avatars v2 (SVG) — original drawings in the brand palette.
   avatarSVG(i, size)          -> round portrait used next to reviews
   usageScene(type, styleIdx)  -> animated scene of a person applying a product
                                  type = bubbles (cleanser) | drop (serum) | cream | glow (result)
   The file injects its own animation CSS, so it works in the shop and in the promo-ad page. */

const AV_STYLES = [
  { skin: "#EBC3A2", hair: "#2B1D16", lip: "#C46A6E", style: "bun",   bg: "#DCE5EF", top: "#203B59" },
  { skin: "#C98E6B", hair: "#1E1410", lip: "#A9545A", style: "hijab", bg: "#E6EAF0", top: "#6686A5", veil: "#A9BED5" },
  { skin: "#F2D2B8", hair: "#4A2E1F", lip: "#D07A7C", style: "long",  bg: "#D5DEE9", top: "#A9BED5" },
  { skin: "#B97E5C", hair: "#2A1B14", lip: "#9C4E55", style: "bob",   bg: "#E3E9F1", top: "#203B59" },
  { skin: "#DDAE8A", hair: "#3A241A", lip: "#B5606A", style: "curly", bg: "#D9E2EC", top: "#6686A5" },
  { skin: "#E7BE9D", hair: "#1C1C24", lip: "#C06870", style: "hijab", bg: "#DCE5EF", top: "#203B59", veil: "#203B59" },
  { skin: "#C99472", hair: "#1A1411", lip: "#A0645E", style: "short", bg: "#E1E7EF", top: "#6686A5", man: true },
  { skin: "#D7A585", hair: "#8A7A72", lip: "#B0646A", style: "bun",   bg: "#E6EAF0", top: "#A9BED5" },
  { skin: "#F0CDB0", hair: "#5B3A26", lip: "#CF7478", style: "long",  bg: "#D5DEE9", top: "#203B59" },
  { skin: "#E2B796", hair: "#2B1D16", lip: "#BF6670", style: "hijab", bg: "#E3E9F1", top: "#A9BED5", veil: "#6686A5" },
  { skin: "#B67956", hair: "#1E1410", lip: "#97505A", style: "curly", bg: "#DCE5EF", top: "#203B59" },
  { skin: "#EBC6A6", hair: "#3B2A20", lip: "#C76E74", style: "bob",   bg: "#D9E2EC", top: "#6686A5" },
  { skin: "#CF9B78", hair: "#24170F", lip: "#AF5C64", style: "long",  bg: "#E6EAF0", top: "#203B59" }
];

let __avId = 0;

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))));
  return "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
}

/* ---------- Character (200 x 200 box) ---------- */
function character(s, uid, o = {}) {
  const skinD = shade(s.skin, -0.16), skinL = shade(s.skin, 0.28), hairL = shade(s.hair, 0.35);
  const veil = s.veil || s.top, veilD = shade(veil, -0.15);
  const isVeil = s.style === "hijab";
  const defs = `
    <radialGradient id="sk${uid}" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="${skinL}"/><stop offset=".55" stop-color="${s.skin}"/><stop offset="1" stop-color="${skinD}"/></radialGradient>
    <linearGradient id="hr${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hairL}"/><stop offset=".45" stop-color="${s.hair}"/><stop offset="1" stop-color="${shade(s.hair, -0.2)}"/></linearGradient>
    <linearGradient id="tp${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(isVeil ? veil : s.top, 0.12)}"/><stop offset="1" stop-color="${shade(isVeil ? veil : s.top, -0.12)}"/></linearGradient>
    <linearGradient id="lp${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(s.lip, 0.1)}"/><stop offset="1" stop-color="${shade(s.lip, -0.15)}"/></linearGradient>
    <radialGradient id="bl${uid}"><stop offset="0" stop-color="#F08A98" stop-opacity=".45"/><stop offset="1" stop-color="#F08A98" stop-opacity="0"/></radialGradient>`;

  let back = "", front = "";
  switch (s.style) {
    case "long":
      back = `<path d="M63 84C60 46 79 29 100 29s40 17 37 55l4 70c-14 10-68 10-82 0z" fill="url(#hr${uid})"/>`;
      front = `<path d="M67 84C64 50 81 33 100 33c21 0 36 16 33 50-6-18-17-29-33-31-7 10-19 21-33 32z" fill="url(#hr${uid})"/>
               <path d="M95 38c-8 6-15 16-20 28M108 37c9 4 16 12 19 24" stroke="${hairL}" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round"/>`;
      break;
    case "bob":
      back = `<path d="M63 82C61 46 79 31 100 31s39 15 37 51v36c-10 8-20 7-26 2H89c-6 5-16 6-26-2z" fill="url(#hr${uid})"/>`;
      front = `<path d="M67 82C65 49 81 35 100 35s35 14 33 47c-7-16-18-27-33-28-15 1-26 12-33 28z" fill="url(#hr${uid})"/>
               <path d="M84 42c-6 6-10 14-12 22" stroke="${hairL}" stroke-width="1.4" fill="none" opacity=".5" stroke-linecap="round"/>`;
      break;
    case "bun":
      back = `<circle cx="100" cy="29" r="14" fill="url(#hr${uid})"/><path d="M92 22c4-3 11-3 15 1" stroke="${hairL}" stroke-width="1.3" fill="none" opacity=".6"/>`;
      front = `<path d="M69 80C67 50 83 37 100 37s33 13 31 43c-6-17-17-27-31-28-14 1-25 11-31 28z" fill="url(#hr${uid})"/>
               <path d="M86 44c-5 5-9 11-11 18M114 44c5 5 9 11 11 18" stroke="${hairL}" stroke-width="1.3" fill="none" opacity=".5" stroke-linecap="round"/>`;
      break;
    case "curly":
      back = [[72,52,13],[86,38,13],[100,33,13],[114,38,13],[128,52,13],[66,70,12],[134,70,12],[64,90,12],[136,90,12],[66,110,11],[134,110,11]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#hr${uid})"/>`).join("");
      front = `<path d="M71 78c1-22 13-34 29-34s28 12 29 34c-8-10-18-15-29-15s-21 5-29 15z" fill="url(#hr${uid})"/>
               <path d="M82 50c4-3 9-4 13-3M106 47c5 0 9 2 12 5" stroke="${hairL}" stroke-width="1.3" fill="none" opacity=".55" stroke-linecap="round"/>`;
      break;
    case "short":
      front = `<path d="M70 78C69 49 84 36 100 36s31 13 30 42c-4-14-14-23-30-24-16 1-26 10-30 24z" fill="url(#hr${uid})"/>
               <path d="M80 47c6-4 14-6 22-5" stroke="${hairL}" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round"/>`;
      break;
    case "hijab":
      back = `<path d="M57 92C55 50 76 27 100 27s45 23 43 65c0 30-9 46-19 58l26 10c15 8 20 22 22 40H28c2-18 7-32 22-40l26-10c-10-12-19-28-19-58z" fill="url(#tp${uid})"/>
              <path d="M76 150c8 8 40 8 48 0" stroke="${veilD}" stroke-width="1.4" fill="none" opacity=".6"/>`;
      front = `<path d="M67 76C69 48 83 35 100 35s31 13 33 41c-7-14-18-22-33-22s-26 8-33 22z" fill="${veilD}"/>
               <path d="M67 76c-2 20 2 38 12 50M133 76c2 20-2 38-12 50" stroke="${veilD}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      break;
  }

  const eyesOpen = !o.eyesClosed;
  const eye = (cx, dir) => eyesOpen
    ? `<path d="M${cx - 8.5} 86q8.5-7 17 0q-8.5 5.5-17 0z" fill="#fff"/>
       <circle cx="${cx}" cy="86" r="3.9" fill="#4A2E22"/><circle cx="${cx}" cy="86" r="2" fill="#1B1210"/><circle cx="${cx + 1.3}" cy="84.7" r="1" fill="#fff"/>
       <path d="M${cx - 9} 86.2q9-8 18-.5" stroke="#1E1514" stroke-width="1.6" fill="none" stroke-linecap="round"/>
       <path d="M${cx + dir * 8.8} 85.4l${dir * 2.6}-2.2" stroke="#1E1514" stroke-width="1.2" stroke-linecap="round"/>`
    : `<path d="M${cx - 8.5} 87.5q8.5 6 17 0" stroke="#1E1514" stroke-width="1.6" fill="none" stroke-linecap="round"/>
       ${[-5, -1.5, 2, 5.5].map(d => `<path d="M${cx + d} ${90.2 - Math.abs(d) * .25}l${d * .15} 2.6" stroke="#1E1514" stroke-width=".9" stroke-linecap="round"/>`).join("")}`;
  const brow = (cx, dir) => `<path d="M${cx - dir * 9} 77.5q${dir * 8}-5.5 ${dir * 18}-1.5" stroke="${shade(s.hair, 0.05)}" stroke-width="${s.man ? 3 : 2.2}" fill="none" stroke-linecap="round"/>`;
  const mouth = o.smile
    ? `<path d="M90 110.5q10 9 20 0q-10 3.4-20 0z" fill="url(#lp${uid})"/><path d="M92.5 111.6q7.5 3 15 0v1.2q-7.5 3.4-15 0z" fill="#fff" opacity=".9"/>`
    : `<path d="M91 112q4.5-3 9-1q4.5-2 9 1q-9 3-18 0z" fill="url(#lp${uid})"/><path d="M91 112q9 8 18 0q-9 2.6-18 0z" fill="${shade(s.lip, 0.05)}"/><path d="M97 115.2q3 .9 6 0" stroke="#fff" stroke-width=".9" opacity=".5" stroke-linecap="round"/>`;

  const ears = isVeil ? "" : `
    <ellipse cx="69" cy="90" rx="5.5" ry="9" fill="${s.skin}"/><path d="M68 85q-2.5 5 0 10" stroke="${skinD}" stroke-width="1" fill="none"/>
    <ellipse cx="131" cy="90" rx="5.5" ry="9" fill="${s.skin}"/><path d="M132 85q2.5 5 0 10" stroke="${skinD}" stroke-width="1" fill="none"/>
    ${s.man ? "" : `<circle cx="69.5" cy="101" r="2.4" fill="#E9EDF2" stroke="#A9B4C2" stroke-width=".7"/><circle cx="130.5" cy="101" r="2.4" fill="#E9EDF2" stroke="#A9B4C2" stroke-width=".7"/>`}`;

  return {
    defs,
    body: `
      ${back}
      <path d="M28 200c4-34 30-50 60-54q12 8 24 0c30 4 56 20 60 54z" fill="url(#tp${uid})"/>
      ${isVeil ? "" : `<path d="M88 116v30q12 9 24 0v-30z" fill="${s.skin}"/><path d="M88 128q12 8 24 0v-10H88z" fill="${skinD}" opacity=".45"/>
        <path d="M70 160q30 10 60 0" stroke="${shade(s.top, -0.25)}" stroke-width="1.2" fill="none" opacity=".5"/>`}
      ${ears}
      <path d="M70 80C70 52 84 40 100 40s30 12 30 40c0 21-8 36-18 44-6 5-18 5-24 0-10-8-18-23-18-44z" fill="url(#sk${uid})"/>
      ${s.man ? `<path d="M76 104c4 14 14 22 24 22s20-8 24-22c-2 10-10 18-24 18s-22-8-24-18z" fill="${s.hair}" opacity=".18"/>` : ""}
      <ellipse cx="80" cy="101" rx="10" ry="7" fill="url(#bl${uid})"/><ellipse cx="120" cy="101" rx="10" ry="7" fill="url(#bl${uid})"/>
      ${front}
      ${brow(86, 1)}${brow(114, -1)}
      ${eye(86, -1)}${eye(114, 1)}
      <path d="M101 90q-1 9-4.5 13.2q3.5 2.2 7.5 0" stroke="${skinD}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="103" cy="92" rx="1.6" ry="5" fill="#fff" opacity=".22"/>
      ${mouth}
      <ellipse cx="88" cy="66" rx="9" ry="4" fill="#fff" opacity=".12"/>`
  };
}

/* ---------- Product illustrations (foreground, left side) ---------- */
const PRODUCT_ART = {
  serum: (uid) => `
    <g class="av-prod">
      <defs><linearGradient id="sv${uid}" x1="0" x2="1"><stop offset="0" stop-color="#2D5079"/><stop offset=".45" stop-color="#203B59"/><stop offset="1" stop-color="#14263B"/></linearGradient>
      <linearGradient id="sl${uid}" x1="0" x2="1"><stop offset="0" stop-color="#E9EDF2"/><stop offset=".5" stop-color="#9DA9B8"/><stop offset="1" stop-color="#F4F6F9"/></linearGradient></defs>
      <ellipse cx="38" cy="196" rx="24" ry="3.5" fill="#203B59" opacity=".18"/>
      <rect x="22" y="142" width="32" height="54" rx="5" fill="url(#sv${uid})"/>
      <rect x="25" y="146" width="3" height="44" rx="1.5" fill="#fff" opacity=".25"/>
      <rect x="28" y="131" width="20" height="13" rx="2" fill="url(#sl${uid})"/>
      <path d="M31 131v-10a7 7 0 0 1 14 0v10z" fill="#F7F8FA" stroke="#D5D9E0" stroke-width=".6"/>
      <path d="M29 162q9-5 18 0q-9-2-18 0z M30 166q8-4 16 0" stroke="#fff" stroke-width=".9" fill="none" opacity=".9"/>
      <path d="M45 156l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="#fff"/>
      <rect x="29" y="175" width="18" height="1" fill="#fff" opacity=".7"/><rect x="31" y="179" width="14" height="1" fill="#fff" opacity=".5"/>
    </g>`,
  cleanser: (uid) => `
    <g class="av-prod">
      <defs><linearGradient id="cw${uid}" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F2F4F7"/><stop offset="1" stop-color="#D5D9E0"/></linearGradient>
      <linearGradient id="cs${uid}" x1="0" x2="1"><stop offset="0" stop-color="#E9EDF2"/><stop offset=".5" stop-color="#9DA9B8"/><stop offset="1" stop-color="#F4F6F9"/></linearGradient></defs>
      <ellipse cx="38" cy="196" rx="25" ry="3.5" fill="#203B59" opacity=".18"/>
      <rect x="20" y="126" width="36" height="70" rx="9" fill="url(#cw${uid})" stroke="#D5D9E0" stroke-width=".6"/>
      <rect x="30" y="115" width="16" height="12" rx="2" fill="url(#cs${uid})"/>
      <g class="av-pump"><rect x="35" y="104" width="6" height="12" fill="url(#cs${uid})"/><path d="M31 101h22a2 2 0 0 1 0 4H33a2 2 0 0 1-2-2z" fill="url(#cs${uid})"/>
        <g class="av-foam-puff"><circle cx="56" cy="102" r="2.6" fill="#fff" stroke="#D5D9E0" stroke-width=".5"/><circle cx="59" cy="100.5" r="1.8" fill="#fff" stroke="#D5D9E0" stroke-width=".5"/></g></g>
      <path d="M27 150q11-6 22 0q-11-2.5-22 0z M28.5 155q9.5-5 19 0" stroke="#203B59" stroke-width=".9" fill="none"/>
      <path d="M46 144l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="#203B59"/>
      <rect x="28" y="168" width="20" height="1" fill="#6686A5"/><rect x="30" y="172" width="16" height="1" fill="#A9BED5"/>
    </g>`,
  cream: (uid) => `
    <g class="av-prod">
      <defs><linearGradient id="jw${uid}" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#EEF1F5"/><stop offset="1" stop-color="#CBD3DE"/></linearGradient>
      <linearGradient id="js${uid}" x1="0" x2="1"><stop offset="0" stop-color="#E9EDF2"/><stop offset=".5" stop-color="#9DA9B8"/><stop offset="1" stop-color="#F4F6F9"/></linearGradient></defs>
      <ellipse cx="40" cy="196" rx="30" ry="4" fill="#203B59" opacity=".18"/>
      <g transform="rotate(-18 60 150)"><rect x="40" y="138" width="40" height="11" rx="3" fill="url(#js${uid})"/></g>
      <rect x="13" y="160" width="54" height="36" rx="9" fill="url(#jw${uid})" stroke="#D5D9E0" stroke-width=".6"/>
      <ellipse cx="40" cy="161" rx="26" ry="5.5" fill="#F7F8FA" stroke="#D5D9E0" stroke-width=".6"/>
      <path d="M28 161c4-7 18-9 24-3-5-1-9 1-12 4-3-3-8-3-12-1z" fill="#fff" stroke="#E1E5EB" stroke-width=".6"/>
      <path d="M27 176q13-6 26 0q-13-2.5-26 0z" stroke="#203B59" stroke-width=".9" fill="none"/>
      <path d="M50 171l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="#203B59"/>
      <rect x="29" y="184" width="22" height="1" fill="#6686A5"/>
    </g>`
};

/* Hand resting fingertips on the cheek (right side of the picture) */
function hand(s, cls) {
  const sk = shade(s.skin, -0.03), d = shade(s.skin, -0.2), nail = shade(s.skin, 0.45);
  const fingers = [[128, 97], [134.6, 93], [141.2, 95], [147.6, 101]]
    .map(([x, y]) => `<rect x="${x - 3.4}" y="${y}" width="6.8" height="${132 - y}" rx="3.4" fill="${sk}" stroke="${d}" stroke-width=".7"/><ellipse cx="${x}" cy="${y + 3.4}" rx="2.1" ry="2.5" fill="${nail}" opacity=".8"/>`).join("");
  return `<g class="${cls}"><g transform="rotate(-14 140 140)">
    <path d="M131 200c-1-18-2-36-4-50h26c0 14-1 32-2 50z" fill="${sk}" stroke="${d}" stroke-width=".7"/>
    ${fingers}
    <path d="M124 122c0-4 3-6 7-6h20c4 0 7 2 7 6v18c0 8-6 13-17 13s-17-5-17-13z" fill="${sk}"/>
    <path d="M124 122v18c0 8 6 13 17 13s17-5 17-13v-18" stroke="${d}" stroke-width=".7" fill="none"/>
    <path d="M130 124q4 2 8 0M136 126q4 2 8 0" stroke="${d}" stroke-width=".5" fill="none" opacity=".6"/>
    <g transform="rotate(42 156 136)"><rect x="152.5" y="118" width="7.5" height="21" rx="3.7" fill="${sk}" stroke="${d}" stroke-width=".7"/></g>
  </g></g>`;
}

const SPARK = (x, y, s, cls = "av-spark", delay = 0) =>
  `<path class="${cls}" style="animation-delay:${delay}s" d="M${x} ${y - s}c.4 ${s * .6} ${s * .4} ${s * .96} ${s} ${s}-${s * .6}.04-${s * .96}.4-${s} ${s}c-.04-${s * .6}-.4-${s * .96}-${s}-${s} ${s * .6}-.04 ${s * .96}-.4 ${s}-${s}z" fill="#fff"/>`;

/* ---------- Public API ---------- */
function avatarSVG(i, size = 48) {
  const s = AV_STYLES[i % AV_STYLES.length];
  const uid = "a" + (++__avId);
  const c = character(s, uid, { smile: true });
  return `<svg class="avatar" width="${size}" height="${size}" viewBox="40 22 120 120" aria-hidden="true">
    <defs>${c.defs}<clipPath id="c${uid}"><circle cx="100" cy="82" r="60"/></clipPath></defs>
    <g clip-path="url(#c${uid})"><rect x="0" y="0" width="200" height="200" fill="${s.bg}"/>${c.body}</g></svg>`;
}

function usageScene(type, styleIndex = 0) {
  injectAvatarCSS();
  const s = AV_STYLES[styleIndex % AV_STYLES.length];
  const uid = "u" + (++__avId);
  const c = character(s, uid, { eyesClosed: type !== "glow", smile: type === "glow" });
  let fx = "", prod = "";
  if (type === "bubbles") {
    prod = PRODUCT_ART.cleanser(uid);
    fx = `
      ${[[80, 99, 7], [76, 104, 5], [86, 104, 5], [100, 60, 6], [94, 62, 4], [107, 62, 4], [118, 100, 6], [100, 121, 4]]
        .map(([x, y, r], k) => `<circle class="av-foam" style="animation-delay:${k * .12}s" cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#DCE3EC" stroke-width=".7"/>`).join("")}
      ${[[66, 96, 3, 0], [62, 80, 2.2, .5], [72, 70, 2.6, 1], [134, 96, 2.8, .3], [138, 76, 2, .8], [110, 52, 2.4, 1.3], [88, 50, 2, 1.7], [58, 108, 1.8, 2]]
        .map(([x, y, r, d]) => `<circle class="av-bubble" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".55" stroke="#A9BED5" stroke-width=".7"/>`).join("")}
      ${hand(s, "av-hand-scrub")}`;
  } else if (type === "drop") {
    prod = PRODUCT_ART.serum(uid);
    fx = `
      <g class="av-dropper"><path d="M80 26v-9a6 6 0 0 1 12 0v9z" fill="#F7F8FA" stroke="#C9D1DC" stroke-width=".7"/>
        <rect x="79" y="25" width="14" height="5" rx="1.5" fill="#B9C3CF"/><path d="M83 30h6l-1.3 30h-3.4z" fill="#E8EEF5" fill-opacity=".85" stroke="#A9BED5" stroke-width=".7"/>
        <path d="M84 48h4l-.6 11h-2.8z" fill="#6686A5" opacity=".7"/></g>
      <path class="av-drop" d="M86 62c2.4 3.6 3.6 5.6 3.6 7.2a3.6 3.6 0 0 1-7.2 0c0-1.6 1.2-3.6 3.6-7.2z" fill="#6686A5"/>
      <ellipse class="av-sheen" cx="84" cy="101" rx="9" ry="5" fill="#fff"/>
      ${SPARK(76, 96, 4, "av-spark", 0)}${SPARK(93, 92, 3, "av-spark", .35)}${SPARK(122, 72, 3, "av-spark", .8)}
      ${hand(s, "av-hand-pat")}`;
  } else if (type === "cream") {
    prod = PRODUCT_ART.cream(uid);
    fx = `
      ${[[100, 62, 4.5, 3], [80, 100, 4.5, 2.8], [120, 100, 4.5, 2.8], [100, 120, 3.4, 2.2], [101, 98, 2.8, 1.8]]
        .map(([x, y, rx, ry], k) => `<ellipse class="av-dab" style="animation-delay:${k * .35}s" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" stroke="#DCE3EC" stroke-width=".6"/>`).join("")}
      ${hand(s, "av-hand-circle")}`;
  } else {
    prod = PRODUCT_ART.serum(uid);
    fx = `
      <circle class="av-halo" cx="100" cy="86" r="62" fill="none" stroke="#fff" stroke-width="2"/>
      ${SPARK(64, 60, 5, "av-spark", 0)}${SPARK(140, 56, 4, "av-spark", .4)}${SPARK(146, 112, 5, "av-spark", .9)}${SPARK(58, 120, 3.5, "av-spark", 1.3)}${SPARK(120, 34, 3, "av-spark", 1.7)}
      <ellipse class="av-sheen" cx="81" cy="99" rx="8" ry="4.5" fill="#fff"/><ellipse class="av-sheen" style="animation-delay:.6s" cx="119" cy="99" rx="8" ry="4.5" fill="#fff"/>`;
  }
  return `<svg class="usage-scene scene-${type}" viewBox="0 0 200 200" role="img" aria-label="Illustration : application du soin">
    <defs>${c.defs}<clipPath id="c${uid}"><circle cx="100" cy="100" r="100"/></clipPath>
      <radialGradient id="g${uid}" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="${s.bg}" stop-opacity="0"/></radialGradient></defs>
    <g clip-path="url(#c${uid})">
      <rect width="200" height="200" fill="${s.bg}"/><circle cx="100" cy="86" r="80" fill="url(#g${uid})"/>
      <path d="M0 150q50-22 100 0t100 0v50H0z" fill="#fff" opacity=".35"/>
      ${c.body}
      ${prod}
      ${fx}
    </g></svg>`;
}

function injectAvatarCSS() {
  if (document.getElementById("avatar-anim-css")) return;
  const css = `
  .usage-scene [class^="av-"]{transform-box:fill-box}
  .av-bubble{transform-origin:center;animation:avBubble 2.8s ease-in infinite;opacity:0}
  @keyframes avBubble{0%{transform:translateY(0) scale(.5);opacity:0}20%{opacity:1}100%{transform:translateY(-34px) scale(1.2);opacity:0}}
  .av-foam{transform-origin:center;animation:avFoam 2.8s ease-in-out infinite}
  @keyframes avFoam{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
  .av-hand-scrub{transform-origin:70% 100%;animation:avScrub 1.3s ease-in-out infinite}
  @keyframes avScrub{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-3px,-3px) rotate(-3deg)}50%{transform:translate(-1px,-5px) rotate(1deg)}75%{transform:translate(2px,-2px) rotate(-1deg)}}
  .av-pump{animation:avPump 2.8s ease-in-out infinite}
  @keyframes avPump{0%,70%,100%{transform:translateY(0)}78%{transform:translateY(4px)}}
  .av-foam-puff{transform-origin:left center;animation:avPuff 2.8s ease-out infinite;opacity:0}
  @keyframes avPuff{0%,76%{transform:scale(0);opacity:0}84%{transform:scale(1.2);opacity:1}100%{transform:scale(1) translateY(-6px);opacity:0}}
  .av-dropper{animation:avDropper 2.6s ease-in-out infinite}
  @keyframes avDropper{50%{transform:translateY(3px)}}
  .av-drop{animation:avDrop 2.6s cubic-bezier(.55,0,.9,.5) infinite}
  @keyframes avDrop{0%,12%{transform:translateY(0) scale(.3);opacity:0}24%{transform:translateY(0) scale(1);opacity:1}62%{transform:translateY(27px) scale(1);opacity:1}70%,100%{transform:translateY(29px) scaleY(.2) scaleX(1.7);opacity:0}}
  .av-sheen{transform-origin:center;animation:avSheen 2.6s ease-in-out infinite;opacity:0}
  @keyframes avSheen{0%,60%{opacity:0;transform:scale(.6)}75%{opacity:.55;transform:scale(1)}100%{opacity:0;transform:scale(1.15)}}
  .av-spark{transform-origin:center;animation:avSpark 2.6s ease-in-out infinite;opacity:0}
  @keyframes avSpark{0%,58%{transform:scale(0) rotate(0);opacity:0}74%{transform:scale(1.3) rotate(45deg);opacity:1}100%{transform:scale(0) rotate(90deg);opacity:0}}
  .av-hand-pat{animation:avPat 1.3s ease-in-out infinite}
  @keyframes avPat{0%,100%{transform:translate(0,0)}40%{transform:translate(3px,-2px)}60%{transform:translate(0,0)}}
  .av-hand-circle{animation:avCircle 2.4s linear infinite}
  @keyframes avCircle{0%{transform:translate(0,0)}25%{transform:translate(-4px,-4px)}50%{transform:translate(-8px,0)}75%{transform:translate(-4px,4px)}100%{transform:translate(0,0)}}
  .av-dab{transform-origin:center;animation:avDab 2.4s ease-in-out infinite}
  @keyframes avDab{0%,100%{transform:scale(1);opacity:.95}55%{transform:scale(.45,.3);opacity:.25}}
  .av-halo{transform-origin:center;animation:avHalo 2.6s ease-out infinite;opacity:0}
  @keyframes avHalo{0%{transform:scale(.8);opacity:.7}100%{transform:scale(1.15);opacity:0}}
  .av-prod{animation:avFloat 4s ease-in-out infinite}
  @keyframes avFloat{50%{transform:translateY(-2px)}}
  @media (prefers-reduced-motion:reduce){.usage-scene *{animation:none!important;opacity:1}}`;
  const el = document.createElement("style"); el.id = "avatar-anim-css"; el.textContent = css;
  document.head.appendChild(el);
}
