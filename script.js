/* Interactive behaviours: navigation, letters persistence, memories, secret star */
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

function showSection(id){
  qsa('.card').forEach(c=>c.classList.add('hidden'));
  const el = qs('#'+id);
  // Only reveal elements that are main sections (have class 'card')
  if(el && el.classList.contains('card')){
    el.classList.remove('hidden');
    window.location.hash = id;
  } else {
    // fallback to home if the hash doesn't point to a section
    const home = qs('#home');
    if(home) {
      home.classList.remove('hidden');
      window.location.hash = 'home';
    }
  }
}

// nav buttons (some may not exist depending on edits)
if(qs('#open-letters')) qs('#open-letters').addEventListener('click',e=>showSection('letters'));
if(qs('#open-memories')) qs('#open-memories').addEventListener('click',e=>showSection('memories'));
if(qs('#back-from-letters')) qs('#back-from-letters').addEventListener('click',e=>showSection('home'));
if(qs('#back-from-memories')) qs('#back-from-memories').addEventListener('click',e=>showSection('home'));
if(qs('#back-from-window')) qs('#back-from-window').addEventListener('click',e=>showSection('home'));

// Night Window -> toggle pastel dark mode
const NIGHT_KEY = 'valentines_night_v1';
function setNight(on){
  if(on){
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
  try{ localStorage.setItem(NIGHT_KEY, on ? '1' : '0'); }catch(e){}
}

const nightToggle = qs('#night-toggle');
if(nightToggle){
  nightToggle.addEventListener('click', ()=>{
    const isOn = document.documentElement.classList.contains('dark-mode');
    setNight(!isOn);
    nightToggle.textContent = isOn ? 'Night Window' : 'Day Window';
  });
}

// apply persisted preference
try{
  const saved = localStorage.getItem(NIGHT_KEY);
  if(saved === '1'){
    setNight(true);
    if(nightToggle) nightToggle.textContent = 'Day Window';
  }
}catch(e){}

// FORCE night mode only: always enable dark mode and hide any toggle UI
try{
  setNight(true);
  qsa('#night-toggle').forEach(el=>{ el.style.display = 'none' });
}catch(e){}

// Pat-me interactions: change prompts every 5 clicks and reveal boogsh at 25
(() => {
  const patText = qs('#pat-text');
  const catBtn = qs('#cat-btn');
  const catSvg = qs('#pixel-cat');
  const boog = qs('#boogsh-img');
  if(!catBtn) return;

  const messages = ['pat me alot','keep on going','so soft','youre doing great','almost there'];
  let count = 0;

  function updateMessage(){
    if(!patText) return;
    const idx = Math.min(Math.floor(count/5), messages.length-1);
    patText.textContent = messages[idx];
  }

  function revealBoogsh(){
    if(!boog) return;
    boog.classList.remove('hidden');
    // force reflow then show class for animation
    void boog.offsetWidth;
    boog.classList.add('show');
    // hide original svg so boogsh replaces it visually
    if(catSvg) catSvg.style.opacity = '0';
    // update pat text to final message
    if(patText) patText.textContent = "oh, welp, thats that.... anyways, press me";
    // make patText act as a button to go to page3
    if(patText){
      patText.style.cursor = 'pointer';
      patText.addEventListener('click', ()=>{ window.location.href = 'page3.html' });
    }
  }

  function handlePat(){
    count += 1;
    if(count <= 25) updateMessage();
    if(count >= 25){
      revealBoogsh();
    }
  }

  // only cat button clicks count
  catBtn.addEventListener('click', handlePat);
})();

// Pixel cat interactions (button)
const catBtn = qs('#cat-btn');
const catSvgEl = qs('#pixel-cat');
let catHappy = false;
if(catBtn){
  catBtn.addEventListener('click',()=>{
    catHappy = !catHappy;
    const heart = qs('#heart');
    if(catHappy){
      if(heart) heart.style.transform = 'translateY(-6px) scale(1.05)';
    } else {
      if(heart) heart.style.transform = '';
    }
  });
}

// Modal
function openModal(title, body){
  const m = qs('#modal');
  qs('#modal-content').innerHTML = `<h3>${title}</h3><p style=\"color:var(--muted)\">${body}</p>`;
  m.classList.remove('hidden');
}
qs('#close-modal').addEventListener('click',()=>qs('#modal').classList.add('hidden'));
qs('#modal').addEventListener('click',e=>{ if(e.target===qs('#modal')) qs('#modal').classList.add('hidden') });

// Letters persistence
const LETTERS_KEY = 'valentines_letters_v1';
function loadLetters(){
  const raw = localStorage.getItem(LETTERS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveLetters(arr){ localStorage.setItem(LETTERS_KEY, JSON.stringify(arr)) }
function renderLetters(){
  const list = qs('#letters-list'); list.innerHTML='';
  const letters = loadLetters();
  if(letters.length===0){ list.innerHTML='<li class="memo">No letters yet — write one!</li>'; return }
  letters.slice().reverse().forEach(l=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(l.from||'someone')}</strong><div style="color:var(--muted);margin-top:6px">${escapeHtml(l.text)}</div>`;
    list.appendChild(li);
  });
}

qs('#letter-form').addEventListener('submit',e=>{
  e.preventDefault();
  const text = qs('#letter-text').value.trim();
  const from = qs('#from-name').value.trim();
  if(!text) return;
  const arr = loadLetters();
  arr.push({text, from, at:Date.now()});
  saveLetters(arr);
  qs('#letter-text').value=''; qs('#from-name').value='';
  renderLetters();
  openModal('Saved','Your letter is kept safe here.');
});

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]) }

renderLetters();

// Memories (sample, can be customized)
const memories = [
  {title:'First silly joke', text:'You laughed so hard about the tiny potato meme.'},
  {title:'Rainy cafe', text:'We shared a warm drink and your scarf kept falling off—adorable.'},
  {title:'Late-night stars', text:'We watched the sky and you pointed out constellations with quiet joy.'}
];
function renderMemories(){
  const grid = qs('#mem-grid'); grid.innerHTML='';
  memories.forEach(m=>{
    const card = document.createElement('div'); card.className='mem-card';
    card.innerHTML = `<div class="mem-front">${escapeHtml(m.title)}</div><div class="mem-back">${escapeHtml(m.text)}</div>`;
    grid.appendChild(card);
  })
}
renderMemories();

// Secret star
qs('#secret-star').addEventListener('click',()=>{
  openModal('A secret', 'Every small thing you do feels like coming home. — <3');
});

// Floating player controls
const fpPlay = qs('#fp-play');
const fpPause = qs('#fp-pause');
const fpClose = qs('#fp-close');
const fpVolume = qs('#fp-volume');
if(fpPlay && qs('#bg-music')) fpPlay.addEventListener('click',()=>qs('#bg-music').play());
if(fpPause && qs('#bg-music')) fpPause.addEventListener('click',()=>qs('#bg-music').pause());
if(fpClose) fpClose.addEventListener('click',()=>{
  const p = qs('#floating-player'); if(p) p.classList.add('hidden');
  const a = qs('#bg-music'); if(a){ a.pause(); a.currentTime = 0; }
});
if(fpVolume && qs('#bg-music')) fpVolume.addEventListener('input',e=>{ qs('#bg-music').volume = Number(e.target.value) });

// route on load
const target = location.hash.replace('#','') || 'home';
showSection(target);
