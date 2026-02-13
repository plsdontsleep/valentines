document.addEventListener('DOMContentLoaded', () => {
  const compliments = [
    "Your smile paints the grayest days in gold.",
    "You make the small hours feel worth their weight in warmth.",
    "Brains and kindness, wrapped in gentle light.",
    "You move like music; everything falls in time.",
    "Your laughter is the map I always return to.",
    "You make ordinary moments taste like a treat.",
    "There is a brave, bright spark in how you try.",
    "You glow quietly, soft and steady, like dawn."  
  ]

  const area = document.getElementById('compliment-area')
  const btn = document.getElementById('compliment-btn')
  const surprise = document.getElementById('surprise-btn')
  const back = document.getElementById('back-home')
  const hearts = document.getElementById('hearts')

  function randItem(arr){ return arr[Math.floor(Math.random()*arr.length)] }

  function showCompliment(text){
    area.textContent = ''
    // typewriter effect
    let i = 0
    const step = () => {
      if(i <= text.length){ area.textContent = text.slice(0,i); i++; setTimeout(step, 18) }
    }
    step()
    spawnHearts(8)
  }

  function spawnHearts(n){
    for(let i=0;i<n;i++){
      const h = document.createElement('div')
      h.textContent = '💖'
      h.style.position = 'absolute'
      h.style.left = (20 + Math.random()*200) + 'px'
      h.style.top = (20 + Math.random()*40) + 'px'
      h.style.fontSize = (12+Math.random()*20)+'px'
      h.style.opacity = '0.95'
      hearts.appendChild(h)
      setTimeout(()=>{ h.style.transition='transform 800ms ease, opacity 800ms'; h.style.transform = 'translateY(-120px) scale(1.2)'; h.style.opacity='0' }, 20 + i*30)
      setTimeout(()=> h.remove(), 1200 + i*30)
    }
  }

  // Sequence compliments for the main button: eyes, smile, laugh, lips, entire being
  const sequence = [
    "Your eyes hold constellations I get lost in.",
    "Your smile makes the whole room feel lighter.",
    "Your laugh is my favorite kind of music.",
    "Your lips are a soft promise I always want to keep.",
    "Your entire being is a beautiful place to stay."
  ]
  let seqIndex = 0

  btn.addEventListener('click', (e)=>{
    // if already turned to next, navigate to page5
    if(btn.dataset.next === 'true'){
      location.href = 'page5.html'
      return
    }
    // show next compliment in sequence
    if(seqIndex < sequence.length){
      showCompliment(sequence[seqIndex])
      seqIndex++
    }
    // after the 5th compliment, turn the button into Next Page
    if(seqIndex >= sequence.length){
      btn.textContent = 'Next Page'
      btn.dataset.next = 'true'
      btn.classList.add('next-btn')
    }
  })
  surprise.addEventListener('click', ()=> showCompliment('You are perfect in ways both loud and small.'))
  back.addEventListener('click', ()=> location.href = 'page3.html')

  // keyboard support: space triggers compliment
  window.addEventListener('keydown', (e)=>{ if(e.code === 'Space'){ e.preventDefault(); showCompliment(randItem(compliments)) } })

})

// --- envelope letters feature ---
document.addEventListener('DOMContentLoaded', ()=>{
  const letters = [
    "Every time you laugh I fall in love again.",
    "You are the kindest place I know.",
    "Small moments with you feel like home.",
    "Your courage makes the world softer.",
    "I keep a secret stash of smiles because of you.",
    "You are my favorite hello and hardest goodbye.",
    "The night is prettier when you are near.",
    "You make ordinary days feel like a holiday.",
    "Your voice is my favorite sound.",
    "With you, even silence feels like a hug."
  ]

  function randItemLocal(arr){ return arr[Math.floor(Math.random()*arr.length)] }

  function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = array[i]
      array[i] = array[j]
      array[j] = tmp
    }
    return array
  }

  const container = document.getElementById('envelopes') || (()=>{ const d=document.createElement('div'); d.id='envelopes'; d.className='envelopes'; document.body.appendChild(d); return d })()
  const modal = document.getElementById('letter-modal')
  const letterContent = document.getElementById('letter-content')
  const closeBtn = document.getElementById('close-letter')

  const centerCard = document.querySelector('.center-card')
  const avoidRect = centerCard ? centerCard.getBoundingClientRect() : null

  function overlaps(rectA, rectB){
    return !(rectA.right < rectB.left || rectA.left > rectB.right || rectA.bottom < rectB.top || rectA.top > rectB.bottom)
  }

  function placeOutsideAvoid(w, h){
    const vw = Math.max(window.innerWidth, 360)
    const vh = Math.max(window.innerHeight, 400)
    let attempt = 0
    while(attempt < 30){
      const left = Math.round(6 + Math.random()*(vw - w - 12))
      const top = Math.round(80 + Math.random()*(vh - h - 120))
      const rect = { left, top, right: left + w, bottom: top + h }
      if(!avoidRect || !overlaps(rect, avoidRect)) return { left, top }
      attempt++
    }
    // fallback: return a safe default (top area)
    return { left: 12 + Math.random()*60, top: 100 + Math.random()*60 }
  }

  function makeEnvelope(msg){
    const e = document.createElement('div')
    e.className = 'envelope'
    const flap = document.createElement('div')
    flap.className = 'flap'
    e.appendChild(flap)
    // envelope size (should match CSS)
    const ew = 60, eh = 44
    const pos = placeOutsideAvoid(ew, eh)
    e.style.left = pos.left + 'px'
    e.style.top = pos.top + 'px'
    e.style.transform = `rotate(${(Math.random()-0.5)*12}deg)`
    e.addEventListener('click', (ev)=>{
      ev.stopPropagation()
      letterContent.textContent = msg
      modal.classList.remove('hidden')
      e.classList.add('opened')
    })
    container.appendChild(e)
  }

  function spawnEnvelopes(n){
    // use a shuffled pool so each spawned envelope gets a different message
    let pool = shuffle(letters.slice())
    for(let i = 0; i < n; i++){
      if(pool.length === 0) pool = shuffle(letters.slice())
      const msg = pool.pop()
      makeEnvelope(msg)
    }
  }

  closeBtn && closeBtn.addEventListener('click', ()=> modal.classList.add('hidden'))
  // clicking outside modal closes
  modal && modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden') })

  // create exactly 10 envelopes with unique messages
  spawnEnvelopes(10)
})
