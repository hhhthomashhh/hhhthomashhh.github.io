const builders={'calculator':[regularCalculator,initRegularCalculator],'compound-growth':[compoundGrowth,initCompound],'savings-goal':[savingsGoal,initSavingsGoal],'inflation':[inflation,initInflation],'mortgage':[mortgage,initMortgage],'car-loan':[carLoan,initCarLoan],'percentage':[percentage,initPercentage],'retirement-countdown':[retirementCountdown,initRetirementCountdown],'money-longevity':[moneyLongevity,initMoneyLongevity],'age':[ageCalc,initAge],'date-difference':[dateDifference,initDateDifference],'countdown':[countdown,initCountdown],'cost-per-use':[costPerUse,initCostPerUse],'unit-price':[unitPrice,initUnitPrice],'tip-split':[tipSplit,initTipSplit],'travel-budget':[travelBudget,initTravelBudget],'currency-converter':[currencyConverter,initCurrencyConverter],'fuel-cost':[fuelCost,initFuelCost],'bmi':[bmi,initBmi],'pace':[pace,initPace]};

if ('scrollRestoration' in history) history.scrollRestoration='manual';
function resetToolScroll(){
  const reset=()=>{
    try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo(0,0)}
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  };
  reset();
  requestAnimationFrame(()=>{
    reset();
    setTimeout(reset,60);
    setTimeout(reset,220);
  });
}

function bindDashboard(){const hs=document.getElementById('heroSearch'),ts=document.getElementById('topSearch');const restoreCaret=(id,pos)=>requestAnimationFrame(()=>{const next=document.getElementById(id);if(next){next.focus({preventScroll:true});try{next.setSelectionRange(pos,pos)}catch{}}});const onHeroSearch=e=>{const pos=e.target.selectionStart??e.target.value.length;state.query=e.target.value;state.category='all';renderDashboardOnly();restoreCaret('heroSearch',pos)};if(hs)hs.oninput=onHeroSearch;if(ts){if(ts.value!==state.query)ts.value=state.query;ts.oninput=e=>{const pos=e.target.selectionStart??e.target.value.length;state.query=e.target.value;state.category='all';renderDashboardOnly();const h=document.getElementById('heroSearch');if(h)h.value=state.query;restoreCaret('topSearch',pos)}}bindCards();document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;state.query='';renderDashboardOnly();if(state.category!=='all')document.getElementById('all')?.scrollIntoView({behavior:'smooth'})})}
function bindCards(){document.querySelectorAll('[data-open]').forEach(el=>{el.onclick=e=>{if(e.target.closest('[data-favmini]'))return;navigate(el.dataset.open)};el.onkeydown=e=>{if(e.key==='Enter')navigate(el.dataset.open)}});document.querySelectorAll('[data-favmini]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(b.dataset.favmini);renderDashboardOnly()})}
function renderDashboardOnly(){document.getElementById('appMain').innerHTML=dashboard();bindDashboard();setBottom('home')}
function render(){window.__lastResultText='';let id=currentId();if(location.protocol==='file:'&&location.hash&&location.hash!=='#home')id=location.hash.slice(1);const main=document.getElementById('appMain');if(id&&builders[id]){const c=calculators.find(x=>x.id===id);main.innerHTML=builders[id][0](c);attachCommon(c);builders[id][1]();const ts=document.getElementById('topSearch');if(ts){ts.value='';ts.oninput=e=>{state.query=e.target.value;state.category='all';navigate(null)}}setBottom('');resetToolScroll()}else{renderDashboardOnly()}}
function setBottom(which){document.querySelectorAll('[data-bottom]').forEach(b=>b.classList.toggle('active',b.dataset.bottom===which))}
function applyTheme(t){document.documentElement.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t;document.getElementById('themeBtn').title=`Appearance: ${t}`;localStorage.setItem('lifeCalcTheme',t)}
function cycleTheme(){const t=localStorage.getItem('lifeCalcTheme')||'system';applyTheme(t==='system'?'light':t==='light'?'dark':'system')}
window.addEventListener('popstate',render);window.addEventListener('hashchange',render);
document.addEventListener('click',e=>{if(e.target.closest('[data-go-home]')||e.target.closest('[data-home]')){if(location.protocol==='file:'){e.preventDefault();location.hash='home'}else{e.preventDefault();navigate(null)}}});
document.getElementById('favoritesNav').onclick=()=>{if(currentId())navigate(null);setTimeout(()=>{state.category='all';state.query='';renderDashboardOnly();document.getElementById('favorites')?.scrollIntoView({behavior:'smooth'})},20)};document.getElementById('themeBtn').onclick=cycleTheme;document.querySelectorAll('[data-bottom]').forEach(b=>b.onclick=()=>{const k=b.dataset.bottom;if(k==='home'){state.category='all';state.query='';navigate(null)}else if(k==='search'){if(currentId())navigate(null);setTimeout(()=>document.getElementById('heroSearch')?.focus(),30)}else if(k==='categories'){if(currentId())navigate(null);setTimeout(()=>document.getElementById('categories')?.scrollIntoView({behavior:'smooth'}),30)}else{document.getElementById('favoritesNav').click()}});

let deferredInstallPrompt=null;
const installBtn=document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;if(installBtn)installBtn.hidden=false});
if(installBtn)installBtn.addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice}catch{}deferredInstallPrompt=null;installBtn.hidden=true});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;if(installBtn)installBtn.hidden=true});
if('serviceWorker' in navigator && location.protocol.startsWith('http')){window.addEventListener('load',()=>navigator.serviceWorker.register('/life-calculators/service-worker.js',{scope:'/life-calculators/'}).catch(()=>{}))}
applyTheme(localStorage.getItem('lifeCalcTheme')||'system');render();
