/* ---------- 1. YOUR HAND DRAWN ART ----------
   Put images in the /assets folder, then edit this list.
   Leave `img` empty to show a cat placeholder. */
const artworks = [
    { title: 'Anime Goth Character', note: 'Pencil Sketch', img: 'assets/draw1.jpeg' },
    { title: 'Anime Story Frame', note: 'Pencil Sketch', img: 'assets/draw2.jpeg' },
    { title: 'Naruto Anime Character', note: 'Pencil Sketch', img: 'assets/draw3.jpeg' },
    { title: 'Fantasy World', note: 'Crayon and Paint', img: 'assets/draw4.jpeg' },
    { title: 'Renji - Bleach Anime', note: 'Pencil Sketch', img: 'assets/draw5.jpeg' },
    { title: 'Anime Character', note: 'Sketch', img: 'assets/draw6.jpeg' },
    { title: 'Cat Baby', note: 'Doodle', img: 'assets/draw7.jpeg' },
    { title: 'Autumn cat', note: 'Water Painting', img: 'assets/draw8.jpeg' },
    { title: 'Greeting Cards', note: 'Water painting', img: 'assets/draw9.jpeg' },
];

const catSVG = `<svg class="placeholder-cat" viewBox="0 0 120 120" aria-hidden="true"><path d="M20 118C14 60 36 36 60 36s46 24 40 82Z" fill="#1E1A1A"/><path d="M26 44 28 10 52 34ZM94 44 92 10 68 34Z" fill="#1E1A1A"/><circle cx="46" cy="64" r="9" fill="#fff"/><circle cx="74" cy="64" r="9" fill="#fff"/><circle cx="46" cy="64" r="3.5" fill="#1E1A1A"/><circle cx="74" cy="64" r="3.5" fill="#1E1A1A"/></svg>`;

const artGrid = document.getElementById('art-grid');
artGrid.innerHTML = artworks.map(a => `
  <article class="art-card">
    <div class="frame">${a.img ? `<img src="${a.img}" alt="${a.title}" loading="lazy">` : catSVG}</div>
    <h3>${a.title}</h3><p>${a.note}</p>
  </article>`).join('');


/* ---------- 3. HERO ENTRANCE (GSAP) ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.gsap && !reduce) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero .glass', { opacity: 0, y: 40, duration: .9 })
        .from('.peek-cat', { y: 40, duration: .7, ease: 'back.out(2)' }, '-=.4')
        .from('.hero-title', { opacity: 0, y: 20, duration: .6 }, '-=.3')
        .from('.hero-copy', { opacity: 0, y: 16, duration: .5, stagger: .12 }, '-=.3');
}

/* ---------- 4. FALLING AUTUMN LEAVES ---------- */
const canvas = document.getElementById('leaves');
const ctx = canvas.getContext('2d');
const colors = ['#E8782A', '#B5482A', '#F4B04A', '#8C9A3E'];
let leaves = [];
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

function makeLeaf(top) {
    return {
        x: Math.random() * canvas.width, y: top ? -20 : Math.random() * canvas.height,
        s: 8 + Math.random() * 10, v: .4 + Math.random() * .8, sway: Math.random() * 6,
        a: Math.random() * 6.28, r: (Math.random() - .5) * .03, c: colors[Math.floor(Math.random() * colors.length)]
    };
}
leaves = Array.from({ length: reduce ? 0 : 26 }, () => makeLeaf(false));

function drawLeaf(l) {
    ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.a); ctx.fillStyle = l.c; ctx.globalAlpha = .75;
    ctx.beginPath(); ctx.moveTo(0, -l.s);
    ctx.quadraticCurveTo(l.s, -l.s / 3, 0, l.s); ctx.quadraticCurveTo(-l.s, -l.s / 3, 0, -l.s);
    ctx.fill(); ctx.restore();
}
function tick(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leaves.forEach((l, i) => {
        l.y += l.v; l.x += Math.sin(t / 900 + i) * .5 * l.sway / 3; l.a += l.r;
        if (l.y > canvas.height + 20) leaves[i] = makeLeaf(true);
        drawLeaf(l);
    });
    requestAnimationFrame(tick);
}
if (!reduce) requestAnimationFrame(tick);

/* ---------- 5. CHANGING BACKGROUND IMAGES ----------
   Put images in /assets and list them here. Add as many as you like.
   Missing files are skipped, and the orange gradient shows if none load. */
const backgrounds = [
    'assets/bg.jpg',
    'assets/bg1.jpg',
    'assets/bg2.jpg',
    'assets/bg3.jpg',
    'assets/bg4.jpg',
    'assets/bg5.jpg',
    'assets/bg6.jpg',
    'assets/bg7.jpg'
];
const SECONDS_PER_IMAGE = 8;

(function startBackground() {
    const layers = document.querySelectorAll('.bg-layer');
    Promise.all(backgrounds.map(src => new Promise(res => {
        const img = new Image();
        img.onload = () => res(src);
        img.onerror = () => res(null);
        img.src = src;
    }))).then(list => {
        const ok = list.filter(Boolean);
        if (!ok.length) return;
        let i = 0, top = 0;
        const show = () => {
            layers[top].style.backgroundImage = `url("${ok[i]}")`;
            layers[top].classList.add('show');
            layers[1 - top].classList.remove('show');
            top = 1 - top;
            i = (i + 1) % ok.length;
        };
        show();
        if (ok.length > 1 && !reduce) setInterval(show, SECONDS_PER_IMAGE * 1000);
    });
})();

  // Split each ticker phrase into letters so they can wobble individually
  document.querySelectorAll('.wobble').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.setProperty('--i', i);
      el.appendChild(span);
    });
  });