// 18 Currency Converter
const FX_CURRENCIES=[
 ['CAD','🇨🇦','Canadian Dollar'],['USD','🇺🇸','US Dollar'],['HKD','🇭🇰','Hong Kong Dollar'],['JPY','🇯🇵','Japanese Yen'],
 ['MXN','🇲🇽','Mexican Peso'],['EUR','🇪🇺','Euro'],['TWD','🇹🇼','New Taiwan Dollar'],['KRW','🇰🇷','South Korean Won']
];
function fxOptions(selected){return FX_CURRENCIES.map(([code,flag,name])=>`<option value="${code}" ${code===selected?'selected':''}>${flag} ${name} (${code})</option>`).join('')}
function currencyConverter(c){return layout(c,`<section class="panel"><div class="field"><label for="fxAmount">Amount</label><input id="fxAmount" type="number" inputmode="decimal" min="0" step="any" value="100" aria-describedby="fxStatus"></div><div class="fx-row" style="margin-top:14px"><div class="field"><label for="fxFrom">From</label><select id="fxFrom">${fxOptions('CAD')}</select></div><button class="ghost-btn fx-swap" id="fxSwap" aria-label="Swap currencies" title="Swap currencies">⇄</button><div class="field"><label for="fxTo">To</label><select id="fxTo">${fxOptions('USD')}</select></div></div><div class="button-row"><button class="primary-btn" id="fxConvert">Convert</button><button class="ghost-btn" id="fxRefresh">↻ Refresh rate</button><button class="ghost-btn" id="fxReset">Reset</button></div><div id="fxErr"></div><div class="fx-status" id="fxStatus" aria-live="polite"><span class="status-dot"></span><span>Loading daily reference rates…</span></div><details><summary>About the exchange rate</summary><div class="interpret">This converter uses daily reference exchange rates from the open-source exchange-api. Rates are useful for planning, but your bank, credit card, ATM or currency exchange counter may add a spread or fee. This is the only Life Calculator that needs an internet connection to refresh its data. The last successfully retrieved rate is cached on this device for offline use.</div></details></section><div id="fxOut"></div>`)}
function fxFormat(v,code){if(!Number.isFinite(v))return '—';const digits=['JPY','KRW'].includes(code)?0:2;try{return new Intl.NumberFormat('en-CA',{style:'currency',currency:code,minimumFractionDigits:digits,maximumFractionDigits:digits}).format(v)}catch{return `${fmtNum(v,digits)} ${code}`}}
function initCurrencyConverter(){
 let fxData=null, source='';
 const cacheKey='lifeCalcFxCadRatesV1';
 const status=(text,kind='')=>{const el=document.getElementById('fxStatus');if(el)el.innerHTML=`<span class="status-dot ${kind}"></span><span>${text}</span>`};
 const getCached=()=>{try{const x=JSON.parse(localStorage.getItem(cacheKey)||'null');return x&&x.rates&&x.date?x:null}catch{return null}};
 const saveCached=d=>{try{localStorage.setItem(cacheKey,JSON.stringify(d))}catch{}};
 const normalize=d=>{const r=d&&d.cad;if(!r)return null;const needed=FX_CURRENCIES.map(x=>x[0].toLowerCase());if(!needed.every(k=>Number.isFinite(Number(r[k]))&&Number(r[k])>0))return null;return {date:d.date||'Unknown',rates:Object.fromEntries(needed.map(k=>[k.toUpperCase(),Number(r[k])]))}};
 const load=async(force=false)=>{
   document.getElementById('fxErr').innerHTML='';status('Loading daily reference rates…');
   const urls=['https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cad.min.json','https://latest.currency-api.pages.dev/v1/currencies/cad.min.json'];
   for(const url of urls){try{const res=await fetch(url,{cache:force?'reload':'default'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const d=normalize(await res.json());if(!d)throw new Error('Invalid rate data');fxData=d;source='live';saveCached(d);status(`Rates updated ${esc(d.date)} · Daily reference data`, 'live');calc();return}catch(e){}}
   const cached=getCached();if(cached){fxData=cached;source='cached';status(`Offline/cached rates from ${esc(cached.date)} · Refresh when online`, 'cached');calc();return}
   fxData=null;source='';status('Rates unavailable. Connect to the internet and try Refresh rate.');document.getElementById('fxErr').innerHTML=error('Could not load exchange rates, and no cached rate is available yet.');document.getElementById('fxOut').innerHTML='';
 };
 const calc=()=>{
   const amount=getNum('fxAmount'),from=document.getElementById('fxFrom').value,to=document.getElementById('fxTo').value;
   if(!Number.isFinite(amount)||amount<0){document.getElementById('fxErr').innerHTML=error('Enter an amount of zero or more.');return}
   if(!fxData){return}
   const rf=fxData.rates[from],rt=fxData.rates[to];if(!rf||!rt){document.getElementById('fxErr').innerHTML=error('That currency rate is unavailable.');return}
   const rate=rt/rf,converted=amount*rate,inv=rate?1/rate:NaN;
   document.getElementById('fxErr').innerHTML='';
   const cadQuick=FX_CURRENCIES.filter(x=>x[0]!=='CAD').map(([code,flag,name])=>{const r=fxData.rates[code]/fxData.rates.CAD;return `<div class="mini-card"><span>${flag} 1 CAD</span><strong>${fmtNum(r,['JPY','KRW'].includes(code)?2:4)} ${code}</strong></div>`}).join('');
   document.getElementById('fxOut').innerHTML=resultBox(`${from} → ${to}`,fxFormat(converted,to),`${fxFormat(amount,from)} × ${fmtNum(rate,6)} = ${fxFormat(converted,to)}`,[['Exchange rate',`1 ${from} = ${fmtNum(rate,6)} ${to}`],['Reverse rate',`1 ${to} = ${fmtNum(inv,6)} ${from}`],['Rate date',esc(fxData.date)]])+`<section class="panel"><h3>CAD quick reference</h3><div class="fx-quick">${cadQuick}</div><div class="interpret">Reference rates only. Actual card, bank, ATM and cash-exchange rates can differ because of fees and exchange spreads. <a class="source-link" href="https://github.com/fawazahmed0/exchange-api" target="_blank" rel="noopener noreferrer">Rate source</a>.</div></section>`;
   setResultText(`${fxFormat(amount,from)} is approximately ${fxFormat(converted,to)} at a reference rate of 1 ${from} = ${fmtNum(rate,6)} ${to}, using rates dated ${fxData.date}.`)
 };
 document.getElementById('fxConvert').onclick=calc;
 document.getElementById('fxAmount').oninput=calc;document.getElementById('fxFrom').onchange=calc;document.getElementById('fxTo').onchange=calc;
 document.getElementById('fxSwap').onclick=()=>{const a=document.getElementById('fxFrom'),b=document.getElementById('fxTo'),v=a.value;a.value=b.value;b.value=v;calc()};
 document.getElementById('fxRefresh').onclick=()=>load(true);
 document.getElementById('fxReset').onclick=()=>{document.getElementById('fxAmount').value='100';document.getElementById('fxFrom').value='CAD';document.getElementById('fxTo').value='USD';calc()};
 const cached=getCached();if(cached){fxData=cached;source='cached';status(`Cached rates from ${esc(cached.date)} · Checking for an update…`,'cached');calc()}
 load(false);
}
