// index.js — minimal behavior for first page
const btn = document.getElementById('press-me');
let stage = 0;
btn && btn.addEventListener('click', async (e) => {
  if(stage === 0){
    stage = 1;
    btn.textContent = "That's my Good Girl 😊";
    return;
  }

  // second click: open music player popup then navigate to page2
  // open small player window (user gesture)
  const popup = window.open('player.html', 'musicPlayer', 'width=420,height=120,resizable=no');
  try{ popup && popup.focus(); }catch(e){}

  // navigate current tab to page2
  window.location.href = 'page2.html';
});
