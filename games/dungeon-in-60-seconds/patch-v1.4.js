(() => {
  const VERSION = '1.4';
  const menuSub = document.querySelector('#menu .sub');
  if (menuSub) {
    menuSub.innerHTML = menuSub.innerHTML.replace(/\s*&nbsp;\s*·\s*&nbsp;\s*v\d+\.\d+/i, '');
    menuSub.innerHTML += ` &nbsp; · &nbsp; v${VERSION}`;
  }

  const originalCollectPickup = collectPickup;
  collectPickup = function(x) {
    if (x && !x.dead && x.type === 'hourglass') {
      x.dead = true;
      addTime(10);
      game.score += 300;
      toast('TIME BONUS! +10 SEC');
      return;
    }
    return originalCollectPickup(x);
  };

  const fx = document.createElement('canvas');
  fx.id = 'meleeFxCanvas';
  fx.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
  canvas.parentNode.insertBefore(fx, canvas.nextSibling);
  const fxctx = fx.getContext('2d');
  let lastFxW = 0, lastFxH = 0, lastFxDpr = 0;
  function syncFx() {
    const d = Math.min(2, devicePixelRatio || 1);
    if (lastFxW !== W || lastFxH !== H || lastFxDpr !== d) {
      lastFxW = W; lastFxH = H; lastFxDpr = d;
      fx.width = Math.floor(W * d); fx.height = Math.floor(H * d);
      fx.style.width = W + 'px'; fx.style.height = H + 'px';
      fxctx.setTransform(d, 0, 0, d, 0, 0);
    }
  }

  let attackHeld = false;
  let queued = false;
  let aim = null;
  let mousePid = null;

  function calcAim(tx = null, ty = null) {
    if (!game?.player) return -Math.PI / 2;
    const p = game.player;
    if (tx != null && ty != null) return Math.atan2(ty - p.y, tx - p.x);
    if (aim) return Math.atan2(aim.y - p.y, aim.x - p.x);
    const t = nearestEnemy(9999);
    if (t) return Math.atan2(t.y - p.y, t.x - p.x);
    return game.lastAim ?? -Math.PI / 2;
  }

  function showSwing(tx = null, ty = null) {
    if (!game?.player) return;
    const p = game.player;
    p.swingAng = calcAim(tx, ty);
    p.swing = Math.max(p.swing || 0, .34);
    game.lastAim = p.swingAng;
  }

  attack = function(tx = null, ty = null) {
    if (!game || game.paused || !game.running) return false;
    const p = game.player;
    if (tx != null && ty != null) aim = {x: tx, y: ty};
    showSwing(tx, ty);

    const now = performance.now() / 1000;
    if ((p.nextAttack || 0) > now) {
      queued = true;
      return false;
    }

    const ang = p.swingAng;
    const ranged = p.weapon.type === 'ranged' || save.selectedHero === 'wizard' || save.selectedHero === 'ranger';
    let rate = Math.max(.10, (p.rate + p.weapon.rate) / (1 + p.buffs.atkSpeed + (p.rage > 0 ? .45 : 0))) * .80;
    if (ranged) rate = Math.min(rate, .33);
    if (save.selectedHero === 'knight' && p.weapon.n === 'Iron Sword') rate = Math.min(rate, .25);
    p.nextAttack = now + rate;
    queued = false;

    const range = p.weapon.type === 'ranged' ? p.weapon.range : p.range + p.weapon.range;
    const dmg = p.damage + p.weapon.dmg;
    if (ranged) {
      const muzzle = p.r + 7;
      game.projectiles.push({x:p.x+Math.cos(ang)*muzzle,y:p.y+Math.sin(ang)*muzzle,vx:Math.cos(ang)*580,vy:Math.sin(ang)*580,r:7,life:range/580+.27,dmg,player:true,burn:p.weapon.burn,color:p.weapon.burn?'#ff9955':'#d6e7ff'});
      tone(340,.03,'square',.016,90);
    } else {
      tone(210,.04,'triangle',.014,90);
      let hit = 0;
      for (const e of game.enemies) {
        if (e.dead) continue;
        const dx=e.x-p.x,dy=e.y-p.y,dist=Math.hypot(dx,dy),da=Math.atan2(dy,dx);
        const diff=Math.atan2(Math.sin(da-ang),Math.cos(da-ang));
        if (dist<=range+e.r && Math.abs(diff)<1.05) {
          damageEnemy(e,dmg*(rng()<p.buffs.crit?1.8:1));
          hit++;
        }
      }
      if (hit && p.weapon.chain) {
        const first=nearestEnemy(140);
        if (first) damageEnemy(first,dmg*.55);
      }
      if (hit) {
        game.shake=Math.max(game.shake,3);
        sfx('hit');
      }
    }
    return true;
  };

  const oldUpdate = update;
  update = function(dt) {
    if (game?.player?.swing > 0) game.player.swing = Math.max(0, game.player.swing - dt);
    oldUpdate(dt);
    if (!game || game.paused || !game.running) return;
    const p = game.player;
    const now = performance.now() / 1000;
    if ((attackHeld || queued) && now >= (p.nextAttack || 0)) {
      const fired = attack(aim?.x ?? null, aim?.y ?? null);
      if (fired && !attackHeld) queued = false;
    }
  };

  const attackBtn = document.querySelector('#attackBtn');
  if (attackBtn) {
    attackBtn.onpointerdown = e => {
      e.preventDefault();
      attackHeld = true;
      attack();
      try { attackBtn.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const end = e => { e.preventDefault(); attackHeld = false; };
    attackBtn.onpointerup = end;
    attackBtn.onpointercancel = end;
    attackBtn.onlostpointercapture = () => { attackHeld = false; };
  }

  addEventListener('keydown', e => {
    if (e.code === 'Space' && game?.running && !game.paused) {
      attackHeld = true;
      if (!e.repeat) attack();
    }
  });
  addEventListener('keyup', e => { if (e.code === 'Space') attackHeld = false; });

  canvas.addEventListener('pointerdown', e => {
    if (game && !game.paused && !touchCap) {
      mousePid = e.pointerId;
      attackHeld = true;
      aim = {x:e.clientX, y:e.clientY};
      attack(e.clientX, e.clientY);
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });
  canvas.addEventListener('pointermove', e => {
    if (e.pointerId === mousePid) aim = {x:e.clientX, y:e.clientY};
  });
  const mouseEnd = e => {
    if (e.pointerId === mousePid) {
      mousePid = null; attackHeld = false; aim = null;
    }
  };
  canvas.addEventListener('pointerup', mouseEnd);
  canvas.addEventListener('pointercancel', mouseEnd);

  const stick = document.querySelector('#stick');
  const knob = document.querySelector('#stickKnob');
  if (stick && knob) {
    stick.style.width = '172px'; stick.style.height = '172px';
    let stickPid = null;
    function moveStick(e) {
      if (e.pointerId !== stickPid) return;
      e.preventDefault(); e.stopImmediatePropagation();
      const q = stick.getBoundingClientRect();
      const cx=q.left+q.width/2,cy=q.top+q.height/2,rx=e.clientX-cx,ry=e.clientY-cy,m=Math.hypot(rx,ry);
      const dead=4,full=24,vmax=q.width*.29;
      let dx=rx,dy=ry;
      if (m>vmax) { dx*=vmax/m; dy*=vmax/m; }
      if (m<=dead) joy.x=joy.y=0;
      else {
        const power=Math.min(1,(m-dead)/full),ux=rx/(m||1),uy=ry/(m||1);
        joy.x=ux*power; joy.y=uy*power;
      }
      knob.style.transform=`translate(${dx}px,${dy}px)`;
    }
    stick.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopImmediatePropagation();
      stickPid=e.pointerId;
      try { stick.setPointerCapture(stickPid); } catch (_) {}
      moveStick(e);
    }, true);
    stick.addEventListener('pointermove', moveStick, true);
    const endStick = e => {
      if (e.pointerId===stickPid) {
        e.preventDefault(); e.stopImmediatePropagation();
        stickPid=null; joy.x=joy.y=0; knob.style.transform='';
      }
    };
    stick.addEventListener('pointerup', endStick, true);
    stick.addEventListener('pointercancel', endStick, true);
  }

  function drawSwordFx() {
    requestAnimationFrame(drawSwordFx);
    syncFx();
    fxctx.clearRect(0,0,W,H);
    if (!game?.running || game.paused || !game.player) return;
    const p=game.player;
    const ranged=p.weapon.type==='ranged'||save.selectedHero==='wizard'||save.selectedHero==='ranger';
    if (ranged) return;

    const swinging=(p.swing||0)>0;
    const base=swinging?(p.swingAng ?? game.lastAim ?? -Math.PI/2):(game.lastAim ?? -Math.PI/2);
    const phase=swinging?1-Math.min(1,p.swing/.34):0;
    const a=swinging?base-1.35+phase*2.7:base+.78;
    const len=swinging?76:48;

    fxctx.save();
    fxctx.translate(p.x,p.y);
    if (swinging) {
      fxctx.globalAlpha=.48+.52*Math.min(1,p.swing/.34);
      fxctx.strokeStyle='#ffcf3f'; fxctx.lineWidth=16; fxctx.lineCap='round';
      fxctx.shadowColor='#ffe79a'; fxctx.shadowBlur=24;
      fxctx.beginPath(); fxctx.arc(0,0,p.r+58,base-1.23,base+1.23); fxctx.stroke();
      fxctx.shadowBlur=0;
      fxctx.strokeStyle='#fff7c4'; fxctx.lineWidth=4;
      fxctx.beginPath(); fxctx.arc(0,0,p.r+58,base-1.14,base+1.14); fxctx.stroke();
    }
    fxctx.rotate(a);
    fxctx.globalAlpha=swinging?1:.88;
    fxctx.fillStyle='#694222'; fxctx.fillRect(p.r-8,-6,18,12);
    fxctx.fillStyle='#d8aa3d'; fxctx.fillRect(p.r+7,-12,8,24);
    fxctx.shadowColor='#fff'; fxctx.shadowBlur=swinging?22:9;
    fxctx.fillStyle='#eef7ff';
    fxctx.beginPath();
    fxctx.moveTo(p.r+13,-8); fxctx.lineTo(p.r+len,0); fxctx.lineTo(p.r+13,8); fxctx.closePath();
    fxctx.fill();
    fxctx.shadowBlur=0; fxctx.strokeStyle='#fff'; fxctx.lineWidth=2; fxctx.stroke();
    fxctx.restore();
  }
  drawSwordFx();

  const clearState=()=>{attackHeld=false;queued=false;aim=null;mousePid=null};
  addEventListener('blur',clearState);
})();