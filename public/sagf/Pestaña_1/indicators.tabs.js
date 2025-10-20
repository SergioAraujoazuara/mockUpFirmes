
// Simple tabs controller (no dependencies)
(function(){
  const root = document.getElementById('lcsatabs');
  if (!root) return;
  const buttons = root.querySelectorAll('[role="tab"]');
  const panels = root.querySelectorAll('[role="tabpanel"]');
  function select(id){
    buttons.forEach(b=> b.setAttribute('aria-selected', b.id === id ? 'true' : 'false'));
    panels.forEach(p=> p.setAttribute('aria-hidden', p.getAttribute('aria-labelledby') === id ? 'false' : 'true'));
  }
  buttons.forEach(b => b.addEventListener('click', () => select(b.id)));
  // keyboard nav
  buttons.forEach((b,i)=>{
    b.addEventListener('keydown', (e)=>{
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
        select(buttons[next].id);
      }
    });
  });
})();
