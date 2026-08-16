const evidenceVisuals={
 display:['0%','0%'], desk:['33.333%','0%'], frame:['66.667%','0%'], raw:['100%','0%'],
 tripod:['0%','100%'], call:['33.333%','100%'], adrian:['66.667%','100%'], ledger:['100%','100%']
};
const evidenceIcons={camera:'🎥',door:'🚪',order:'🧾',felix:'🎩',residue:'🧪',propstone:'💠',bracelet:'🔗',insurer:'📐'};
function evidenceThumb(id,has){if(!has)return '<div class="evidence-icon">?</div>';if(evidenceVisuals[id]){const p=evidenceVisuals[id];return `<div class="evidence-thumb" style="background-image:url('../assets/evidence.svg');background-size:400% 200%;background-position:${p[0]} ${p[1]}"></div>`;}return `<div class="evidence-icon">${evidenceIcons[id]||'🔎'}</div>`;}
function renderEvidence(){const el=document.getElementById('evidenceList');el.innerHTML='';Object.entries(evidence).forEach(([id,e])=>{const has=state.found.has(id);const d=document.createElement('div');d.className='evidence'+(has?'':' locked');d.innerHTML=`${evidenceThumb(id,has)}<div class="evidence-body">${has?`<strong>${e.title}</strong><small>${e.desc}</small>`:`<strong>Undiscovered evidence</strong><small>Continue investigating.</small>`}</div>`;el.appendChild(d)})}
function renderTimeline(){const items=Object.entries(evidence).filter(([id,e])=>state.found.has(id)&&e.timeline).map(([id,e])=>e.timeline);const parsed=items.map(t=>{const m=t.match(/^([^—]+)—\s*(.*)$/);return m?[m[1].trim(),m[2]]:['',t]});document.getElementById('timelineList').innerHTML=parsed.length?parsed.map(x=>`<div class="timeline-row"><div class="time">${x[0]}</div><div>${x[1]}</div></div>`).join(''):'<p class="note">No verified timeline entries yet.</p>'}

const deductionQs=[
 {id:'genuine',q:'1. What is the last firmly verified time the genuine Blue Meridian is still present?',choices:[['82431','8:24:31 PM — tethered test frame'],['818','8:18:42 PM — appraisal scan'],['845','8:45 PM — hallway camera begins']]},
 {id:'fake',q:'2. What is the earliest evidence that the substitute is already in the display?',choices:[['82711','8:27:11 PM — unedited RAW photograph'],['845','8:45 PM — hallway camera'],['906','9:06 PM — discovery']]},
 {id:'statement',q:'3. Which record conflicts with Evelyn’s account that she answered the call and stepped into the hall?',choices:[['doorlog','Call connects at 8:24:36; study door does not open until 8:25:06'],['camera','Nobody enters after 8:45'],['appraisal','The 8:18 scan records BM-1847']]},
 {id:'physical',q:'4. Which evidence most directly links Evelyn to the substitute itself?',choices:[['lacquer','Fluorescent residue on the substitute matches Evelyn’s refractometer oil'],['tripod','Velvet fibre and wax are in Maya’s tripod collar'],['order','Maya ordered a blue CZ prop']]},
 {id:'preparation',q:'5. Which evidence shows the substitute was made from information not available in the public exhibition sheet?',choices:[['insurer','It matches confidential insurer measurements; Evelyn accessed that file'],['bracelet','A silver bracelet is visible in the test frame'],['door','The window paint seal is intact']]}
];
const correct={genuine:'82431',fake:'82711',statement:'doorlog',physical:'lacquer',preparation:'insurer'};
function renderDeduction(){const b=document.getElementById('deductionBoard');b.innerHTML='';deductionQs.forEach(q=>{const box=document.createElement('div');box.className='question';box.innerHTML=`<h4>${q.q}</h4><div class="choices"></div>`;const cs=box.querySelector('.choices');q.choices.forEach(c=>{const bt=document.createElement('button');bt.className='choice'+(state.selected[q.id]===c[0]?' selected':'');bt.textContent=c[1];bt.onclick=()=>{state.selected[q.id]=c[0];state.deductionsChecked=false;save();renderDeduction()};if(state.deductionsChecked){if(c[0]===correct[q.id])bt.classList.add('correct');else if(state.selected[q.id]===c[0])bt.classList.add('wrong')}cs.appendChild(bt)});b.appendChild(box)})}

document.getElementById('checkDeduction').onclick=()=>{
  state.deductionsChecked=true;
  state.deductionScore=deductionQs.filter(q=>state.selected[q.id]===correct[q.id]).length;
  const f=document.getElementById('deductionFeedback');
  f.innerHTML=state.deductionScore===deductionQs.length
    ?'<div class="result win"><b>Deduction chain complete.</b> The evidence is sufficient to make a reasoned accusation.</div>'
    :`<div class="result lose"><b>${state.deductionScore}/${deductionQs.length} steps correct.</b> Separate suspicious circumstances from evidence that identifies who handled the substitute.</div>`;
  save();renderDeduction();updateRank();
}

function renderNotebook(){const n=document.getElementById('notebook');n.innerHTML=(state.notes.length?state.notes:['Start with the timestamps. Do not assume the most suspicious person is the thief.']).map(x=>`<div class="noteitem">${x}</div>`).join('')}
function updateProgress(){document.getElementById('foundCount').textContent=state.found.size;document.getElementById('progressBar').style.width=(state.found.size/totalEvidence*100)+'%';updateRank()}
function updateRank(){let score=state.found.size*3+state.deductionScore*9-state.hints*5;let r='Rookie';if(score>=35)r='Detective';if(score>=55)r='Inspector';if(score>=75)r='Master Detective';document.getElementById('rankTop').textContent=r}
function renderAll(){renderEvidence();renderTimeline();renderNotebook();renderDeduction();updateProgress()}

const hintText=[
 'The 8:45 camera is not the beginning of the crime. Establish the last image that proves the genuine stone and the first image that proves the substitute.',
 'Read the call time and the study-door time as two separate facts. They are not the same moment.',
 'A blue CZ order is suspicious. Compare the measurements of the ordered stone, the sealed prop, and the substitute recovered from the display.',
 'Look for evidence on the substitute itself. Ask who says they never touched it.',
 'The bracelet, the refractometer residue, the confidential dimensions and the folio notation point in the same direction when read together.'
];
document.getElementById('hintBtn').onclick=()=>{const i=Math.min(state.hints,hintText.length-1);openModal(`<h2>Hint ${state.hints+1}</h2><p>${hintText[i]}</p>`);state.hints++;save();updateRank()}

document.getElementById('accuseBtn').onclick=()=>{document.getElementById('accuseResult').innerHTML='';document.getElementById('accuseModal').classList.add('show')}
function closeAccuse(){document.getElementById('accuseModal').classList.remove('show')} window.closeAccuse=closeAccuse;

document.getElementById('submitAccusation').onclick=()=>{
 const c=document.getElementById('culpritSelect').value,m=document.getElementById('methodSelect').value,mo=document.getElementById('motiveSelect').value,w=document.getElementById('windowSelect').value;
 const deductionsNow=deductionQs.every(q=>state.selected[q.id]===correct[q.id]);
 const ok=c==='Evelyn Shaw'&&m==='swap'&&mo==='buyer'&&w==='82431-82506'&&deductionsNow;
 const base=Math.max(0,100-state.hints*5-(totalEvidence-state.found.size)*2);
 if(ok){
   localStorage.setItem('case001_v2_solved','true');
   document.getElementById('accuseResult').innerHTML=`<div class="result win"><h3>CASE SOLVED — Score ${base}/100</h3>
   <p><b>Evelyn Shaw stole the Blue Meridian.</b></p>
   <p>Most of the conspicuous evidence points first toward Maya: she had debt, ordered a blue CZ, touched the display pin, and left velvet and wax on her tripod. But those facts do not identify the substitute in the case. Maya’s ordered CZ is still sealed in her lighting case, and its measurements do not match the recovered substitute.</p>
   <p>The genuine Blue Meridian is still present at <b>8:24:31</b>. The same frame shows a blue glove and the edge of a silver bracelet with a triangular clasp. Evelyn is documented wearing that bracelet throughout the evening. Her insurer call connects five seconds later at <b>8:24:36</b>, but the study door does not open until <b>8:25:06</b>. Her statement that she answered and stepped into the hall compresses thirty seconds that the records preserve.</p>
   <p>Opportunity alone would still not prove theft. The decisive physical clue is on the substitute itself: green fluorescent residue trapped in a girdle nick matches the immersion oil used in <b>Evelyn’s refractometer</b>; that oil is not used on the display or by the photographer. Evelyn specifically says she never handled a replica.</p>
   <p>The preparation evidence closes the remaining gap. The substitute matches the <b>confidential insurer dimensions</b> to within 0.02 mm rather than the rounded public exhibition measurements. Evelyn downloaded that file eleven days earlier. Her private folio then supplies the motive: <b>“V.A. — 40 received / 200 on delivery / BM-1847”</b>, alongside a 40,000 payment from V. Armitage Holdings.</p>
   <p>The simplest reconstruction is that Evelyn prepared an exact substitute in advance, handled the genuine stone legitimately during the photo session, made the switch after the 8:24:31 frame and before leaving at 8:25:06, then used the insurer call as a natural-looking exit. Maya’s later 8:27:11 photograph unknowingly records the substitute already in place.</p>
   <p>The clues against Maya were real, but their meaning was different: unauthorized handling explains the tripod trace; the sealed, differently sized prop explains the CZ order. Adrian’s lie concealed wine theft, and Felix never left rehearsal. The evidence needed to reach Evelyn was present throughout the case.</p></div>`;
 } else {
   document.getElementById('accuseResult').innerHTML=`<div class="result lose"><h3>Accusation not proven</h3><p>Your theory does not yet fit the full evidence chain.</p><p>${state.deductionScore<deductionQs.length?'The deduction board still contains at least one unsupported step. ':''}Pay particular attention to what is physically on the substitute, what the timestamps actually say, and whether Maya’s ordered prop is the same stone.</p></div>`;
 }
}

document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset all progress for Case 001?')){localStorage.removeItem('case001_v2_state');localStorage.removeItem('case001_v2_solved');location.reload()}}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
document.getElementById('accuseModal').addEventListener('click',e=>{if(e.target.id==='accuseModal')closeAccuse()});

const origRenderAll=renderAll;
function unlockDerived(){
  if(state.found.has('desk') && state.found.has('frame') && !state.found.has('raw')){
    state.found.add('raw');state.notes.unshift('<b>8:27:11 RAW photograph</b> — the substitute is already in the display.');save();
  }
}
function renderAllWrapped(){unlockDerived();origRenderAll()}
renderAll=renderAllWrapped;

load();renderSuspects();renderAll();
