document.addEventListener('DOMContentLoaded', ()=>{
  const door1 = document.getElementById('door-1')
  const door2 = document.getElementById('door-2')
  const door3 = document.getElementById('door-3')
  const modal = document.getElementById('door-modal')
  const content = document.getElementById('door-content')

  function openModal(html){
    content.innerHTML = ''
    content.insertAdjacentHTML('beforeend', html)
    modal.classList.remove('hidden')
    modal.setAttribute('aria-hidden','false')
    // ensure close button is enabled and clickable
    const c = document.getElementById('close-door')
    if(c){ c.disabled = false; c.style.pointerEvents = 'auto' }
  }
  function closeModal(){
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden','true')
    content.innerHTML = ''
  }

  // Door 1: long poem
  const poem = `
Across the miles I treasure every little light,
your voice the tender compass guiding me through night.
I count the days between our shared hello,
and hold your laughter close when rains are slow.

I fold the distance into letters while listening to your covered songs,
each line a bridge where my remembering belongs.
I trace the curve of you in city lights and maps,
and carry home in echoes of your gentle laughs.

The phone becomes a window, warm and bright,
where your eyes meet mine and make the dark feel right.
We stitch our mornings with late night calls and dreams,
and keep our promises like whispers through the seams.

One day the miles will settle into our street,
and every road will know the echo of our feet.
Until that dawn I send my love across the sea,
and live in every small hello that brings you back to me.
`;

  // Door 2: promise (same country / same timezone)
  const promise = `
I promise to make our mornings quiet and bright,
to bring you coffee, warmth, and hold you through the night.
I promise small traditions, walks, slow Sunday light,
and promises kept steady, simple, and in sight.

I'll build a little home where our laughter fills the rooms,
keep dates on calendars and flowers for each noon.
I'll stand beside your plans and share the every-day chores,
and choose you without question, now and evermore.

I promise presence: weekday dinners, roadside drives,
to celebrate the small wins and the way our life arrives.
I vow to guard your dreams and nurture what we start,
to hold your hand through changes and keep you in my heart.

So take this promise as the map to where we'll be,
you are the one I want to marry, stay here close to me.
I promise, you'll be my partner, now and for all scenes.
`;

  // Door 3: text + vows image
  const vowsHtml = `
<div class="poem">I remember how we combined our words into wedding vows, still remembering that moment, how we didnt know we'd end up as what we are now.</div>
<img src="pictures/vows.png" alt="vows image">
`;

  door1.addEventListener('click', ()=> openModal('<div class="poem">'+poem+'</div>'))
  door2.addEventListener('click', ()=> openModal('<div class="poem">'+promise+'</div>'))
  door3.addEventListener('click', ()=> openModal(vowsHtml))

  // keyboard accessibility
  [door1,door2,door3].forEach(d=> d.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') d.click() }))

  // Attach close handlers to any close buttons inside the modal (robust to DOM changes)
  function attachCloseHandlers(){
    const closeEls = modal.querySelectorAll('.close, .close-btn')
    closeEls.forEach(el=>{
      el.disabled = false
      el.addEventListener('click', closeModal)
    })
  }
  attachCloseHandlers()
  // clicking the overlay background closes when clicking outside the modal-body
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal() })
  // allow Escape key to close
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal() })

  // Also attach directly to the primary close button by id (robust fallback)
  const explicitClose = document.getElementById('close-door')
  if(explicitClose){
    try{ explicitClose.disabled = false }catch(e){}
    explicitClose.style.pointerEvents = 'auto'
    explicitClose.addEventListener('click', closeModal)
  }

  // Global click-capture handler: catch clicks on close elements even if listeners fail
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest && e.target.closest('#close-door, .close-btn')
    if(btn){
      // prevent other handlers
      e.stopPropagation()
      e.preventDefault()
      closeModal()
    }
  }, true)
})
