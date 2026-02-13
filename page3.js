// pixel road generator + simple controls
document.addEventListener('DOMContentLoaded', () => {
  const NIGHT_KEY = 'valentines_night_v1'
  const nightRaw = localStorage.getItem(NIGHT_KEY)
  const night = nightRaw === '1' || nightRaw === 'true'
  // Force night mode for this page
  try{ document.documentElement.classList.add('dark-mode'); localStorage.setItem(NIGHT_KEY,'1') }catch(e){}

  // hide any toggle and prevent switching to day mode
  const nightToggle = document.getElementById('night-toggle')
  if (nightToggle) {
    nightToggle.style.display = 'none'
    nightToggle.disabled = true
  }

  const back = document.getElementById('back-home')
  if (back) back.addEventListener('click', () => { location.href = 'page2.html' })
  // pin the back button to the very left of the viewport
  if (back) {
    back.style.position = 'fixed'
    back.style.left = '12px'
    back.style.top = '18px'
    back.style.zIndex = '10010'
  }

  // generate houses along the track
  const track = document.getElementById('track')
  if (!track) return

  const houseTemplates = [
    { body:'#ffce9e', roof:'#b33', label:'Maple' },
    { body:'#d6f7d6', roof:'#8b3', label:'Mint' },
    { body:'#ffe0f0', roof:'#e06', label:'Blush' },
    { body:'#ffdca8', roof:'#b45', label:'Ochre' }
  ]

  // map of pictures for houses 1..18 (use pictures/first.png .. pictures/eighteenth.png)
  const pictures = [
    'pictures/first.png','pictures/second.png','pictures/third.png','pictures/fourth.png','pictures/fifth.jpg','pictures/sixth.png',
    'pictures/seventh.png','pictures/eighth.png','pictures/ninth.png','pictures/tenth.png','pictures/eleventh.png','pictures/twelveth.png',
    'pictures/thirteenth.png','pictures/fourteenth.jpg','pictures/fifteenth.png','pictures/sixteenth.png','pictures/seventeenth.png','pictures/eighteenth.png'
  ]

  // captions for each house (index 0 => house 1) — two-line rhyming couplets
  const captions = [
    "We played for the first time, you stood by my side,\nLaughter met pixels as worlds opened wide.",
    "Late nights grew longer, our stories unwound,\nHours slipped away when your voice I found.",
    "We hopped through new games, hand in hand we'd leap,\nCollecting small moments we both vowed to keep.",
    "My days felt hollow when you were away,\nPlay filled empty rooms and brightened my day.",
    "We drew ever closer, small steps that we shared,\nTwo hearts finding rhythm, two souls gently paired.",
    "We lived and respawned, through trials we'd try,\nFalling and rising together, we'd always fly.",
    "Our first adventure began with a map and a plea,\nWe wandered together to where we should be.",
    "I guided your path when the darkness was near,\nYou lit up my night and chased away fear.",
    "We rode side by side, a penguin brought cheer,\nIt dropped us a bar and laughter drew near.",
    "I dream of auroras beneath skies wide and blue,\nI want to see that bright wonder there with you.",
    "You watch over me, a lighthouse at sea,\nSteady and warm, your light comforts me.",
    "Sushi after cold quests, warm bites in our hands,\nWe shared tiny moments, soft maps of our plans.",
    "I sent you a picture, a doorway so slight,\nA number arrived and the world felt right.",
    "You sent one back and our smiles crossed wires,\nTwo tiny sparks grew into warming fires.",
    "I matched your outfits, echoing your hue,\nSmall mirrored colors of me and of you.",
    "First photo session, framed in gentle light,\nYour avatar's grin made the moment so bright.",
    "Matching outfits, matching steps, side by side,\nWe walked the same rhythm, our hearts open wide.",
    "And so our story began, honest and true,\nPage after page I get closer to you."
  ]

  function makeHouse(x, side, tpl, idx){
    const h = document.createElement('div')
    h.className = 'house ' + (side === 'top' ? 'top' : 'bottom')
    h.style.left = x + 'px'

    const roof = document.createElement('div')
    roof.className = 'roof'
    roof.style.borderBottomColor = tpl.roof

    const body = document.createElement('div')
    body.className = 'body'
    body.style.background = tpl.body
    body.style.borderColor = '#6b3b2a'

    // windows and door (unless we have a picture for this house)
    const hasPic = typeof idx === 'number' && pictures[idx]
    let w1, w2, door
    if(!hasPic){
      w1 = document.createElement('div')
      w1.className = 'window'
      w1.style.left = '20px'
      w1.style.bottom = '28px'
      w2 = document.createElement('div')
      w2.className = 'window'
      w2.style.left = '40px'
      w2.style.bottom = '28px'
      // door
      door = document.createElement('div')
      door.className = 'door'
    }

    const label = document.createElement('div')
    label.className = 'label'
    label.textContent = String((idx || 0) + 1)

    h.appendChild(roof)
    h.appendChild(body)
    if(!hasPic){
      body.appendChild(w1)
      body.appendChild(w2)
      body.appendChild(door)
    } else {
      // add image inside the body
      const img = document.createElement('img')
      img.src = pictures[idx]
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'cover'
      img.style.borderRadius = '4px'
      body.appendChild(img)
    }
    h.appendChild(label)

    // make house interactive
    h.tabIndex = 0
    h.setAttribute('role','button')
    h.setAttribute('aria-label', `House ${((idx||0)+1)}`)
    h.addEventListener('click', () => showHouseInfo((idx||0)+1))
    h.addEventListener('keydown', (ev) => { if(ev.key === 'Enter' || ev.code === 'Space') { ev.preventDefault(); showHouseInfo((idx||0)+1) } })

    track.appendChild(h)
  }

  // small toast for house interactions
  function showToast(msg){
    let t = document.getElementById('road-toast')
    if(!t){
      t = document.createElement('div')
      t.id = 'road-toast'
      t.style.position = 'fixed'
      t.style.left = '50%'
      t.style.transform = 'translateX(-50%)'
      t.style.bottom = '24px'
      t.style.padding = '10px 14px'
        t.style.background = 'var(--card)'
        t.style.color = 'var(--text)'
        t.style.borderRadius = '10px'
        t.style.boxShadow = 'var(--shadow)'
      t.style.fontWeight = '600'
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.style.opacity = '1'
    clearTimeout(t._hide)
    t._hide = setTimeout(()=>{ t.style.opacity = '0' }, 2400)
  }

  function showHouseInfo(num){
    const pic = pictures[num-1]
    const cap = captions[num-1] || ''
    if(pic){
      showImageModal(pic, `House ${num}`, cap)
    } else {
      showToast(`House ${num} — a cozy little home.`)
    }
  }

  function showImageModal(src, title, caption){
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.left = '0'
    overlay.style.top = '0'
    overlay.style.right = '0'
    overlay.style.bottom = '0'
    overlay.style.background = 'rgba(0,0,0,0.6)'
    overlay.style.display = 'flex'
    overlay.style.alignItems = 'center'
    overlay.style.justifyContent = 'center'
    overlay.style.zIndex = '9999'
    overlay.addEventListener('click', () => overlay.remove())

    const win = document.createElement('div')
    win.style.background = 'var(--card)'
    win.style.borderRadius = '12px'
    win.style.padding = '12px'
    win.style.maxWidth = '90%'
    win.style.maxHeight = '90%'
    win.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)'
    win.addEventListener('click', (e)=>e.stopPropagation())

    const img = document.createElement('img')
    img.src = src
    img.style.maxWidth = '100%'
    img.style.maxHeight = '70vh'
    img.style.display = 'block'
    img.style.margin = '0 auto'

    const captionEl = document.createElement('div')
    captionEl.textContent = caption || title
    captionEl.style.textAlign = 'center'
    captionEl.style.marginTop = '8px'
    captionEl.style.color = 'var(--muted)'

    win.appendChild(img)
    win.appendChild(captionEl)
    overlay.appendChild(win)
    document.body.appendChild(overlay)
  }

  // scatter exactly 18 houses evenly across the track
  const houseCount = 18
  const trackWidth = track.clientWidth || 3000
  const margin = 40
  const spacing = (trackWidth - margin * 2) / Math.max(1, houseCount - 1)
  for (let i = 0; i < houseCount; i++) {
    const x = Math.round(margin + i * spacing)
    const tpl = houseTemplates[i % houseTemplates.length]
    makeHouse(x, (i % 2 === 0) ? 'top' : 'bottom', tpl, i)
  }

  // add a little car at the end of the road (serves as the Next control)
  (function addCarAtEnd(){
    const trackWidthNow = track.clientWidth || 3000
    // extend track so the car can sit outside the visible road
    const extra = 300
    track.style.width = (trackWidthNow + extra) + 'px'

    const car = document.createElement('div')
    car.id = 'road-car'
    car.className = 'road-car'
    car.textContent = '🚗'
    car.setAttribute('role','button')
    car.tabIndex = 0
    car.style.position = 'absolute'
    // place the car just past the original track width
    car.style.left = (trackWidthNow + 48) + 'px'
    car.style.top = '50%'
    // flip the car so it faces right-to-left visually
    car.style.transform = 'translateY(-50%) scaleX(-1)'
    car.style.fontSize = '40px'
    car.style.padding = '6px'
    car.style.cursor = 'pointer'
    car.style.zIndex = '10005'
    car.style.transition = 'transform 220ms ease, filter 220ms'
    car.style.willChange = 'transform'

    car.addEventListener('click', ()=> location.href = 'page4.html')
    car.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.code === 'Space'){ e.preventDefault(); location.href = 'page4.html' } })
    car.addEventListener('mouseenter', ()=> car.style.transform = 'translateY(-54%) scaleX(-1) scale(1.06)')
    car.addEventListener('mouseleave', ()=> car.style.transform = 'translateY(-50%) scaleX(-1) scale(1)')

    track.appendChild(car)
  })()

  // scrolling controls: arrow keys or A/D
  const scroller = document.getElementById('scroller')
  const scrollSpeed = 320 // px per second
  let scrollV = 0

  function updateScroll(dt){
    if(!scroller) return
    if(scrollV === 0) return
    scroller.scrollLeft += scrollV * dt
  }

  let last = performance.now()
  function frame(now){
    const dt = (now - last) / 1000
    last = now
    updateScroll(dt)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  // floating follower (flying.webp) that follows the cursor with smoothing
  const follower = document.createElement('img')
  follower.src = 'designs/flying.webp'
  follower.id = 'cursor-follower'
  follower.style.position = 'fixed'
  follower.style.left = '0px'
  follower.style.top = '0px'
  follower.style.width = '48px'
  follower.style.height = '48px'
  follower.style.pointerEvents = 'none'
  follower.style.transform = 'translate3d(-50%,-50%,0)'
  follower.style.transition = 'opacity 160ms linear'
  follower.style.opacity = '0'
  follower.style.zIndex = '9998'
  follower.style.willChange = 'transform'
  document.body.appendChild(follower)

  let fx = window.innerWidth/2, fy = window.innerHeight/2
  let tx = fx, ty = fy
  let showTimeout = null

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX
    ty = e.clientY
    follower.style.opacity = '1'
    if(showTimeout) { clearTimeout(showTimeout); showTimeout = null }
    // hide after 1.8s of inactivity
    showTimeout = setTimeout(()=>{ follower.style.opacity = '0' }, 1800)
  })

  // touch support: show follower at touch point
  window.addEventListener('touchmove', (e) => {
    if(e.touches && e.touches[0]){
      tx = e.touches[0].clientX
      ty = e.touches[0].clientY
      follower.style.opacity = '1'
      if(showTimeout) { clearTimeout(showTimeout); showTimeout = null }
      showTimeout = setTimeout(()=>{ follower.style.opacity = '0' }, 1800)
    }
  }, {passive:true})

  // integrate follower update into animation frame
  const oldFrame = frame
  function frameWithFollower(now){
    const dt = (now - last) / 1000
    last = now
    updateScroll(dt)
    // lerp follower
    fx += (tx - fx) * 0.18
    fy += (ty - fy) * 0.18
    follower.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%,-50%)`
    requestAnimationFrame(frameWithFollower)
  }
  requestAnimationFrame(frameWithFollower)

  const keys = {left:false,right:false}
  window.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true
    if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true
    scrollV = (keys.right ? 1 : 0) * scrollSpeed - (keys.left ? 1 : 0) * scrollSpeed
  })
  window.addEventListener('keyup', (e) => {
    if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false
    if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false
    scrollV = (keys.right ? 1 : 0) * scrollSpeed - (keys.left ? 1 : 0) * scrollSpeed
  })

  // Note: scroller click/tap handler removed — use keyboard A/D or ←/→ to scroll

})
