import { buildAssemblySkin } from './assembly-geometry.js';

let passportNumber = 0;
const escapeText = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// The passport is an unissued design object. Animation never changes its status.
export function renderPassport(host, { faceIndex = null, preview = true } = {}) {
  if (!host || typeof host.replaceChildren !== 'function') throw new TypeError('A passport host is required.');
  const uid = `warm-passport-${++passportNumber}`;
  const skin = buildAssemblySkin(20);
  const rotate = ([px, py, pz]) => {
    const a = .39, b = -.22;
    const x = px * Math.cos(a) + pz * Math.sin(a);
    const z = pz * Math.cos(a) - px * Math.sin(a);
    return { x, y: py * Math.cos(b) - z * Math.sin(b), z: py * Math.sin(b) + z * Math.cos(b) };
  };
  const faces = [...skin.pents, ...skin.hexes].map((face, index) => {
    const verts = face.verts.map(rotate);
    return { index, verts, depth: verts.reduce((sum, p) => sum + p.z, 0) / verts.length };
  }).sort((a, b) => a.depth - b.depth);
  const mesh = faces.map(({ index, verts, depth }) => {
    const points = verts.map(p => `${(160 + p.x * 62).toFixed(2)},${(158 - p.y * 62).toFixed(2)}`).join(' ');
    const selected = index === 19;
    return `<polygon points="${points}" fill="${depth > 0 ? (selected ? '#d9ae55' : '#eee7d5') : 'none'}" fill-opacity="${selected ? '.9' : '.75'}" stroke="${depth > 0 ? '#907040' : '#bba77e'}" stroke-opacity="${depth > 0 ? '.95' : '.23'}" stroke-width="${selected ? '1.4' : '.65'}"/>`;
  }).join('');
  const position = Number.isSafeInteger(faceIndex) && faceIndex >= 0 ? `Selected face ${faceIndex + 1}` : 'Genesis design';
  const figure = document.createElement('figure');
  figure.className = 'warm-passport';
  figure.dataset.arrival = 'ready';
  figure.dataset.preview = 'true';
  // Deliberately ignore preview:false: this component cannot certify issuance.
  figure.innerHTML = `
    <div class="warm-passport__object">
      <svg class="warm-passport__art" viewBox="0 0 320 342" role="img" aria-labelledby="${uid}-title ${uid}-desc">
        <title id="${uid}-title">OG passport — unissued design preview</title>
        <desc id="${uid}-desc">An ivory and gold hexagonal passport for the Dyson Society, unit zero. A Goldberg chamber sits between two distinct gold and cyan paths. This is a design preview, not proof of admission.</desc>
        <defs>
          <linearGradient id="${uid}-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffef"/><stop offset=".15" stop-color="#d4b670"/><stop offset=".31" stop-color="#9c7c38"/><stop offset=".38" stop-color="#fff1bd"/><stop offset=".43" stop-color="#f9e7ae"/><stop offset=".56" stop-color="#ad8842"/><stop offset=".79" stop-color="#dac28a"/><stop offset=".86" stop-color="#fff4c7"/><stop offset="1" stop-color="#a3803d"/></linearGradient>
          <linearGradient id="${uid}-ivory" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#fffdf6"/><stop offset=".4" stop-color="#f4f0e4"/><stop offset=".68" stop-color="#eae2ce"/><stop offset="1" stop-color="#fff8e9"/></linearGradient>
          <radialGradient id="${uid}-light"><stop stop-color="#fffaf0" stop-opacity=".95"/><stop offset="1" stop-color="#dfca94" stop-opacity="0"/></radialGradient>
          <pattern id="${uid}-grain" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0H1M2 2H3" stroke="#9f8b64" stroke-opacity=".065" stroke-width=".4"/></pattern>
          <path id="${uid}-inscription" d="M30 88 160 13 290 88"/>
          <path id="${uid}-edge" d="M292 95V235"/>
          <clipPath id="${uid}-clip"><path d="M160 17 289 91.5V240.5L160 315 31 240.5V91.5Z"/></clipPath>
        </defs>
        <path class="warm-passport__shadow" d="M160 11 296 89.5V246.5L160 325 24 246.5V89.5Z"/>
        <path d="M23 86 160 7 297 86V244L160 328 23 249Z" fill="#b39459"/>
        <path d="M160 7 297 86V244L160 323 23 244V86Z" fill="url(#${uid}-metal)"/>
        <path d="M24 86.5 160 8 296 86.5M24 86.5V243.5" fill="none" stroke="#fffff4" stroke-width="1" stroke-opacity=".95"/>
        <path d="M297 87V244L160 323 24 244" fill="none" stroke="#96743d" stroke-width=".75"/>
        <path d="M160 17 289 91.5V240.5L160 315 31 240.5V91.5Z" fill="url(#${uid}-ivory)"/>
        <path d="M160 17 289 91.5V240.5L160 315 31 240.5V91.5Z" fill="url(#${uid}-grain)" stroke="#8a6e34" stroke-opacity=".5" stroke-width=".6"/>
        <path d="M32 92 160 18 288 92" fill="none" stroke="#fffdf3" stroke-width="1.2"/>
        <path d="M160 25 282 95.5V236.5L160 307 38 236.5V95.5Z" fill="none" stroke="#a5844b" stroke-width=".65"/>
        <text class="warm-passport__engraving"><textPath href="#${uid}-inscription" startOffset="50%" text-anchor="middle">RES COGITANS · RES PUBLICA</textPath></text>
        <text class="warm-passport__engraving"><textPath href="#${uid}-edge" startOffset="50%" text-anchor="middle">DYSON SOCIETY · UNIT 0 · GENESIS</textPath></text>
        <g clip-path="url(#${uid}-clip)">
          <circle cx="160" cy="158" r="112" fill="url(#${uid}-light)"/>
          <path d="M20 226 74 196 74 123 105 106M300 104 247 135V208L215 227" fill="none" stroke="#bda56e" stroke-width=".6"/>
          <path d="M20 231 79 198V126L108 109M300 99 242 133V205L212 224" fill="none" stroke="#cbb783" stroke-width=".6"/>
          <g class="warm-passport__orbit" fill="none" stroke="#ae8e51" stroke-width=".6">
            <ellipse cx="160" cy="158" rx="101" ry="34" transform="rotate(-33 160 158)"/>
            <ellipse cx="160" cy="158" rx="97" ry="30" transform="rotate(45 160 158)"/>
            <circle cx="160" cy="158" r="86" stroke-dasharray="1 8"/>
          </g>
          <ellipse cx="163" cy="209" rx="43" ry="7" fill="#a78946" fill-opacity=".08"/>
          <g class="warm-passport__mesh">${mesh}</g>
          <path class="warm-passport__path warm-passport__path--gold" d="M30 242C72 233 70 165 127 157" fill="none" stroke="#b68a30" stroke-width="2"/>
          <path class="warm-passport__path warm-passport__path--cyan" d="M290 83C241 94 251 150 193 158" fill="none" stroke="#469eab" stroke-width="1.8"/>
          <circle cx="127" cy="157" r="2.5" fill="#bd9037"/>
          <circle cx="193" cy="158" r="2.5" fill="#489dab"/>
          <path d="M144 35H176M150 39H170" stroke="#9a7940" stroke-width=".7"/>
          <text x="160" y="65" text-anchor="middle" class="warm-passport__name">OG AUGUR</text>
          <text x="160" y="81" text-anchor="middle" class="warm-passport__label">GENESIS PASSPORT</text>
          <path d="M94 240H226" stroke="#ad8d55" stroke-width=".6"/>
          <text x="160" y="264" text-anchor="middle" class="warm-passport__society">Dyson Society</text>
          <text x="160" y="284" text-anchor="middle" class="warm-passport__unit">UNIT 0</text>
          <path class="warm-passport__sheen" d="M-80-30H-30L220 370H170Z" fill="#fff" fill-opacity=".4"/>
        </g>
      </svg>
    </div>
    <figcaption class="warm-passport__caption">
      <span class="warm-passport__status">Unissued <i aria-hidden="true">/</i> Design preview</span>
      <span class="warm-passport__position">${escapeText(position)}</span>
    </figcaption>`;
  host.replaceChildren(figure);
  let disposed = false;
  return {
    setArrival(state) {
      if (disposed) return;
      figure.dataset.arrival = ['ready', 'docking', 'joined'].includes(state) ? state : 'ready';
    },
    destroy() { disposed = true; figure.remove(); }
  };
}
