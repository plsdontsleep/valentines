document.addEventListener('DOMContentLoaded', ()=>{
  const yes = document.getElementById('yes-btn')
  const no = document.getElementById('no-btn')
  const resp = document.getElementById('response')
  let cryInterval = null
  let textInterval = null
  let pleaseTimeout = null
  // compute avoid area (center card) so crying images do not cover the box
  const centerCardEl = document.querySelector('.center-card')
  const avoidRect = centerCardEl ? centerCardEl.getBoundingClientRect() : null

  function overlaps(a,b){
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
  }

  function placeOutsideAvoid(w,h){
    const vw = Math.max(window.innerWidth, 360)
    const vh = Math.max(window.innerHeight, 400)
    let attempt = 0
    while(attempt < 60){
      const left = Math.round(6 + Math.random()*(vw - w - 12))
      const top = Math.round(60 + Math.random()*(vh - h - 120))
      const rect = { left, top, right: left + w, bottom: top + h }
      if(!avoidRect || !overlaps(rect, avoidRect)) return { left, top }
      attempt++
    }
    // fallback: pick a top area
    return { left: 12 + Math.random()*80, top: 100 + Math.random()*40 }
  }
  yes.addEventListener('click', ()=>{
    // stop any sad intervals and clean up
    if(cryInterval) { clearInterval(cryInterval); cryInterval = null }
    if(textInterval) { clearInterval(textInterval); textInterval = null }
    if(pleaseTimeout) { clearTimeout(pleaseTimeout); pleaseTimeout = null }
    document.querySelectorAll('.cry-img, .sad-float, .big-please').forEach(n=>n.remove())
    // restore corner dance images if they were removed
    addDanceImages()
    resp.textContent = 'ehehehehehehehe.'
    yes.disabled = true
    no.disabled = true
    // restore main music (add timestamp)
    try{ localStorage.setItem('music-src', 'music/music.mp3::' + Date.now()) }catch(e){}
    // show celebration text and next button
    const yay = document.createElement('div')
    yay.className = 'big-please'
    yay.textContent = 'Yey! ❤️'
    document.body.appendChild(yay)
    const next = document.createElement('button')
    next.textContent = 'Next'
    next.className = 'comp-btn'
    next.style.marginTop = '14px'
    next.addEventListener('click', ()=> location.href = 'page6.html')
    yay.appendChild(next)
    // small heart burst
    for(let i=0;i<12;i++){
      const h = document.createElement('div')
      h.textContent = '💖'
      h.style.position = 'fixed'
      h.style.left = (50 + Math.random()*30) + '%'
      h.style.top = (40 + Math.random()*20) + '%'
      h.style.fontSize = (12+Math.random()*28)+'px'
      h.style.pointerEvents = 'none'
      h.style.transition = 'transform 1200ms ease, opacity 1200ms'
      document.body.appendChild(h)
      setTimeout(()=>{ h.style.transform='translateY(-140px) scale(1.2)'; h.style.opacity='0' }, 50 + i*40)
      setTimeout(()=> h.remove(), 1400 + i*40)
    }
  })

  no.addEventListener('click', ()=>{
    // make all buttons disabled
    document.querySelectorAll('button').forEach(b=> b.disabled = true)
    resp.textContent = ''
    // remove corner dance images while sad flow is active
    removeDanceImages()
    // tell player to switch to sad music (add timestamp to force storage event)
    try{ localStorage.setItem('music-src', 'music/sad.mp3::' + Date.now()) }catch(e){}

    const cries = ['cry.gif','cryy.gif','cryyy.webp']
    const sadTexts = ["I'm so sorry...","This hurts...","Please don't go","My heart...","I can't breathe..."]

    // spawn floating sad texts periodically (store interval so it can be cleared when Yes clicked)
    textInterval = setInterval(()=>{
      const t = document.createElement('div')
      t.className = 'sad-float'
      t.textContent = sadTexts[Math.floor(Math.random()*sadTexts.length)]
      const left = 10 + Math.random()*80
      const top = 40 + Math.random()*40
      t.style.left = left + '%'
      t.style.top = top + '%'
      document.body.appendChild(t)
      // start visible then float up & fade out
      t.style.opacity = '1'
      t.style.transform = 'translateY(0)'
      setTimeout(()=>{
        t.style.transform = 'translateY(-80px)'
        t.style.opacity = '0'
      }, 50)
      setTimeout(()=> t.remove(), 2200)
    }, 700)

    // spawn cry images one by one continuously until Yes is pressed
    let shown = 0
    cryInterval = setInterval(()=>{
      const i = shown % cries.length
      const img = new Image()
      img.className = 'cry-img'
      img.src = 'designs/' + cries[i]
      img.alt = 'cry'
      img.setAttribute('data-src', cries[i])
      // place outside the center card
      const ew = 120, eh = 120
      const pos = placeOutsideAvoid(ew, eh)
      img.style.left = pos.left + 'px'
      img.style.top = pos.top + 'px'
      document.body.appendChild(img)
      // reveal (slightly delayed for pacing)
      setTimeout(()=> img.classList.add('show'), 300)
      // hide after a longer time, then remove after transition
      setTimeout(()=>{
        img.classList.remove('show')
        setTimeout(()=> img.remove(), 1400)
      }, 8000)
      shown++
    }, 800)

    // after 5 seconds, show big please overlay and re-enable Yes
      clearTimeout(pleaseTimeout)
      pleaseTimeout = setTimeout(()=>{
      const p = document.createElement('div')
      p.className = 'big-please'
      p.id = 'please-box'
      p.innerHTML = 'please?<br><span style="font-size:16px;opacity:0.95;display:block;margin-top:8px;">kawawa man ako baby oi if ayaw mo, mag sad na aq :<</span>'
      document.body.appendChild(p)
      // enable yes only (make it clickable)
      yes.disabled = false
      }, 10000)
      // wait 10 seconds before showing please overlay and enabling Yes
      // (previously 5 seconds)
  })

  // helper: remove dance images (designs/dance.webp and dance1.webp)
  function removeDanceImages(){
    document.querySelectorAll('img.corner-img').forEach(img=>{
      const s = img.getAttribute('src')||''
      if(s.includes('dance.webp') || s.includes('dance1.webp')) img.remove()
    })
  }

  // helper: add dance images back if missing
  function addDanceImages(){
    const hasRight = !!document.querySelector('img.corner-img.right[src*="dance.webp"]')
    const hasLeft = !!document.querySelector('img.corner-img.left[src*="dance1.webp"]')
    if(!hasRight){
      const r = document.createElement('img')
      r.src = 'designs/dance.webp'
      r.alt = 'dance'
      r.className = 'corner-img right'
      document.body.appendChild(r)
    }
    if(!hasLeft){
      const l = document.createElement('img')
      l.src = 'designs/dance1.webp'
      l.alt = 'dance1'
      l.className = 'corner-img left'
      document.body.appendChild(l)
    }
  }
})

