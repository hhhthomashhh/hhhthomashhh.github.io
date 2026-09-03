// Regular calculator: pinned for quick access and available as /life-calculators/calculator/
(() => {
  'use strict';

  const regularDefinition={
    id:'calculator',
    title:'Regular Calculator',
    icon:'🧮',
    category:'everyday',
    description:'A fast, familiar calculator for everyday arithmetic.',
    keywords:'calculator regular basic arithmetic add subtract multiply divide percent everyday quick'
  };
  calculators.unshift(regularDefinition);

  const originalDashboard=dashboard;
  dashboard=function(){
    const html=originalDashboard();
    if(state.query||state.category!=='all') return html;
    const quick=`<section class="section quick-access" aria-labelledby="quick-calc-title"><div class="section-head"><h2 id="quick-calc-title">Quick Calculator</h2><span class="section-note">Your everyday calculator</span></div><article class="quick-calculator-card" data-open="calculator" tabindex="0" role="link" aria-label="Open Regular Calculator"><div class="quick-calc-icon" aria-hidden="true">🧮</div><div class="quick-calc-copy"><strong>Regular Calculator</strong><span>Add, subtract, multiply, divide, percentages and more.</span></div><div class="quick-calc-action">Open <span aria-hidden="true">→</span></div></article></section>`;
    const heroEnd=html.indexOf('</section>');
    return heroEnd>=0?html.slice(0,heroEnd+10)+quick+html.slice(heroEnd+10):quick+html;
  };

  const nav=document.querySelector('.nav-actions');
  if(nav&&!document.getElementById('quickCalcNav')){
    const b=document.createElement('button');
    b.className='icon-btn';
    b.id='quickCalcNav';
    b.type='button';
    b.title='Regular Calculator';
    b.setAttribute('aria-label','Open Regular Calculator');
    b.textContent='🧮';
    b.addEventListener('click',()=>navigate('calculator'));
    nav.insertBefore(b,nav.firstChild);
  }
})();

function regularCalculator(c){
  return layout(c,`<section class="regular-calculator" aria-label="Regular calculator"><div class="regular-display"><div class="regular-expression" id="regularExpression" aria-live="polite">&nbsp;</div><div class="regular-value" id="regularValue" aria-live="polite">0</div><button class="regular-backspace" type="button" data-regular="backspace" aria-label="Backspace">⌫</button></div><div class="regular-keypad" id="regularKeypad"><button type="button" class="regular-key utility" data-regular="clear">AC</button><button type="button" class="regular-key utility" data-regular="sign">±</button><button type="button" class="regular-key utility" data-regular="percent">%</button><button type="button" class="regular-key operator" data-op="divide">÷</button><button type="button" class="regular-key" data-digit="7">7</button><button type="button" class="regular-key" data-digit="8">8</button><button type="button" class="regular-key" data-digit="9">9</button><button type="button" class="regular-key operator" data-op="multiply">×</button><button type="button" class="regular-key" data-digit="4">4</button><button type="button" class="regular-key" data-digit="5">5</button><button type="button" class="regular-key" data-digit="6">6</button><button type="button" class="regular-key operator" data-op="subtract">−</button><button type="button" class="regular-key" data-digit="1">1</button><button type="button" class="regular-key" data-digit="2">2</button><button type="button" class="regular-key" data-digit="3">3</button><button type="button" class="regular-key operator" data-op="add">+</button><button type="button" class="regular-key zero" data-digit="0">0</button><button type="button" class="regular-key" data-regular="decimal">.</button><button type="button" class="regular-key equals" data-regular="equals">=</button></div></section><section class="panel regular-history-panel"><div class="regular-history-head"><h3>Recent calculations</h3><button type="button" class="ghost-btn" id="regularClearHistory">Clear</button></div><div id="regularHistory" class="regular-history"><span class="section-note">Your calculations in this app session will appear here.</span></div><div class="section-note regular-keyboard-note">Keyboard: 0–9, +, −, *, /, %, Enter, Backspace and Esc.</div></section>`);
}

function initRegularCalculator(){
  let display='0';
  let accumulator=null;
  let pendingOp=null;
  let waiting=false;
  let lastOp=null;
  let lastOperand=null;
  let expression='';
  window.__regularCalcHistory=window.__regularCalcHistory||[];

  const valueEl=document.getElementById('regularValue');
  const exprEl=document.getElementById('regularExpression');
  const symbol=op=>({add:'+',subtract:'−',multiply:'×',divide:'÷'}[op]||'');
  const format=n=>{
    if(!Number.isFinite(n)) return 'Error';
    if(Object.is(n,-0)) n=0;
    const a=Math.abs(n);
    if(a>=1e12||(a!==0&&a<1e-9)) return n.toExponential(8).replace(/\.0+e/,'e').replace(/(\.\d*?[1-9])0+e/,'$1e');
    return String(Number(n.toPrecision(12)));
  };
  const render=()=>{
    valueEl.textContent=display;
    exprEl.textContent=expression||'\u00a0';
    setResultText(expression?`${expression} ${display}`:`Calculator result: ${display}`);
  };
  const renderHistory=()=>{
    const h=document.getElementById('regularHistory');
    const rows=window.__regularCalcHistory;
    h.innerHTML=rows.length?rows.slice(0,8).map(x=>`<button type="button" class="regular-history-row" data-history-value="${esc(x.result)}"><span>${esc(x.expression)}</span><strong>${esc(x.result)}</strong></button>`).join(''):'<span class="section-note">Your calculations in this app session will appear here.</span>';
    h.querySelectorAll('[data-history-value]').forEach(b=>b.addEventListener('click',()=>{display=b.dataset.historyValue;accumulator=null;pendingOp=null;waiting=true;expression='';render()}));
  };
  const fail=()=>{display='Error';expression='Cannot divide by zero';accumulator=null;pendingOp=null;waiting=true;lastOp=null;lastOperand=null;render()};
  const operate=(a,b,op)=>{
    if(op==='add') return a+b;
    if(op==='subtract') return a-b;
    if(op==='multiply') return a*b;
    if(op==='divide') return b===0?NaN:a/b;
    return b;
  };
  const digit=d=>{
    if(display==='Error'||waiting){display=d;waiting=false}else if(display==='0'){display=d}else if(display.replace(/[-.]/g,'').length<14){display+=d}
    render();
  };
  const decimal=()=>{
    if(display==='Error'||waiting){display='0.';waiting=false}else if(!display.includes('.')) display+='.';
    render();
  };
  const clear=()=>{display='0';accumulator=null;pendingOp=null;waiting=false;lastOp=null;lastOperand=null;expression='';render()};
  const backspace=()=>{if(display==='Error'){clear();return}if(waiting)return;display=display.length<=1||(display.length===2&&display.startsWith('-'))?'0':display.slice(0,-1);render()};
  const sign=()=>{if(display==='Error')return;const n=Number(display);if(!Number.isFinite(n)||n===0)return;display=format(-n);render()};
  const percent=()=>{if(display==='Error')return;const n=Number(display);if(!Number.isFinite(n))return;display=format(n/100);waiting=true;render()};
  const chooseOp=op=>{
    if(display==='Error')return;
    const input=Number(display);
    if(!Number.isFinite(input))return;
    if(pendingOp&&waiting){pendingOp=op;expression=`${format(accumulator)} ${symbol(op)}`;render();return}
    if(accumulator===null) accumulator=input;
    else if(pendingOp){const r=operate(accumulator,input,pendingOp);if(!Number.isFinite(r)){fail();return}accumulator=r;display=format(r)}
    pendingOp=op;waiting=true;lastOp=null;lastOperand=null;expression=`${format(accumulator)} ${symbol(op)}`;render();
  };
  const equals=()=>{
    if(display==='Error')return;
    let op=pendingOp;
    let left=accumulator;
    let right=Number(display);
    if(!op&&lastOp){op=lastOp;left=Number(display);right=lastOperand}
    if(!op||!Number.isFinite(left)||!Number.isFinite(right))return;
    const r=operate(left,right,op);
    if(!Number.isFinite(r)){fail();return}
    const result=format(r);
    const line=`${format(left)} ${symbol(op)} ${format(right)} =`;
    window.__regularCalcHistory.unshift({expression:line,result});
    window.__regularCalcHistory=window.__regularCalcHistory.slice(0,20);
    display=result;expression=line;lastOp=op;lastOperand=right;accumulator=null;pendingOp=null;waiting=true;render();renderHistory();
  };

  document.getElementById('regularKeypad').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.digit!==undefined) digit(b.dataset.digit);
    else if(b.dataset.op) chooseOp(b.dataset.op);
    else if(b.dataset.regular==='decimal') decimal();
    else if(b.dataset.regular==='clear') clear();
    else if(b.dataset.regular==='sign') sign();
    else if(b.dataset.regular==='percent') percent();
    else if(b.dataset.regular==='equals') equals();
  });
  document.querySelector('[data-regular="backspace"]').addEventListener('click',backspace);
  document.getElementById('regularClearHistory').addEventListener('click',()=>{window.__regularCalcHistory=[];renderHistory()});

  const keyHandler=e=>{
    if(currentId()!=='calculator')return;
    if(e.target&&/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
    const k=e.key;
    if(/^\d$/.test(k)){e.preventDefault();digit(k)}
    else if(k==='.'){e.preventDefault();decimal()}
    else if(k==='+'){e.preventDefault();chooseOp('add')}
    else if(k==='-'){e.preventDefault();chooseOp('subtract')}
    else if(k==='*'||k==='x'||k==='X'){e.preventDefault();chooseOp('multiply')}
    else if(k==='/'){e.preventDefault();chooseOp('divide')}
    else if(k==='%'){e.preventDefault();percent()}
    else if(k==='Enter'||k==='='){e.preventDefault();equals()}
    else if(k==='Backspace'){e.preventDefault();backspace()}
    else if(k==='Escape'||k==='Delete'){e.preventDefault();clear()}
  };
  document.addEventListener('keydown',keyHandler,{signal:(()=>{const ctrl=new AbortController();setTimeout(()=>{const observer=new MutationObserver(()=>{if(currentId()!=='calculator'){ctrl.abort();observer.disconnect()}});observer.observe(document.getElementById('appMain'),{childList:true})},0);return ctrl.signal})()});

  render();
  renderHistory();
}