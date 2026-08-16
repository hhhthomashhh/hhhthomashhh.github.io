(() => {
  const version = '5';
  const chunkUrls = Array.from({length:7}, (_,i) => `assets/art-v3/chunk${String(i).padStart(2,'0')}.txt?v=${version}`);
  let artUrl = '';

  function applyArtwork() {
    if (!artUrl) return;
    const cover = document.querySelector('.case-cover');
    if (cover) {
      cover.style.setProperty('background-image', `url("${artUrl}")`, 'important');
      cover.style.setProperty('background-size', '100% auto', 'important');
      cover.style.setProperty('background-position', 'top center', 'important');
      cover.style.setProperty('background-repeat', 'no-repeat', 'important');
    }
    const positions = ['0% 100%','33.333333% 100%','66.666667% 100%','100% 100%'];
    document.querySelectorAll('#suspectGrid .portrait').forEach((el, i) => {
      if (i > 3) return;
      el.textContent = '';
      el.style.setProperty('background-image', `url("${artUrl}")`, 'important');
      el.style.setProperty('background-size', '400% 280%', 'important');
      el.style.setProperty('background-position', positions[i], 'important');
      el.style.setProperty('background-repeat', 'no-repeat', 'important');
    });
  }

  Promise.all(chunkUrls.map(url => fetch(url, {cache:'no-store'}).then(r => {
    if (!r.ok) throw new Error(`Artwork chunk failed: ${url}`);
    return r.text();
  }))).then(parts => {
    artUrl = 'data:image/jpeg;base64,' + parts.join('').replace(/\s+/g,'');
    const img = new Image();
    img.onload = () => {
      applyArtwork();
      const grid = document.getElementById('suspectGrid');
      if (grid) new MutationObserver(applyArtwork).observe(grid, {childList:true, subtree:true});
    };
    img.src = artUrl;
  }).catch(err => console.error('Case 002 artwork loader:', err));
})();
