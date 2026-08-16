const evidenceVisuals={
 display:['0%','0%'], desk:['33.333%','0%'], frame:['66.667%','0%'], raw:['100%','0%'],
 tripod:['0%','100%'], call:['33.333%','100%'], adrian:['66.667%','100%'], ledger:['100%','100%']
};
const evidenceIcons={camera:'🎥',door:'🚪',order:'🧾',felix:'🎥',residue:'🧪',propstone:'💠',insurer:'📐',adrianDebt:'💸',adrianLie:'🗣️',felixKit:'🎩',felixRemark:'💬'};
function evidenceThumb(id,has){if(!has)return '<div class="evidence-icon">?</div>';if(evidenceVisuals[id]){const p=evidenceVisuals[id];return `<div class="evidence-thumb" style="background-image:url('../assets/evidence.svg');background-size:400% 200%;background-position:${p[0]} ${p[1]}"></div>`;}return `<div class="evidence-icon">${evidenceIcons[id]||'🔎'}</div>`;}
function renderEvidence(){const el=document.getElementById('evidenceList');el.innerHTML='';Object.entries(evidence).forEach(([id,e])=>{const has=state.found.has(id);const d=document.createElement('div');d.className='evidence'+(has?'':' locked');d.innerHTML=`${evidenceThumb(id,has)}<div class="evidence-body">${has?`<strong>${e.title}</strong><small>${e.desc}</small>`:`<strong>Undiscovered evidence</strong><small>Continue investigating.</small>`}</div>`;el.appendChild(d)})}
function renderTimeline(){const items=Object.entries(evidence).filter(([id,e])=>state.found.has(id)&&e.timeline).map(([id,e])=>e.timeline);const parsed=items.map(t=>{const m=t.match(/^([^—]+)—\s*(.*)$/);return m?[m[1].trim(),m[2]]:['',t]});document.getElementById('timelineList').innerHTML=parsed.length?parsed.map(x=>`<div class="timeline-row"><div class="time">${x[0]}</div><div>${x[1]}</div></div>`).join(''):'<p class="note">No verified timeline entries yet.</p>'}

const theoryLimit=5;
function toggleTheoryEvidence(id){
  const i=state.theoryEvidence.indexOf(id);
  if(i>=0) state.theoryEvidence.splice(i,1);
  else {
    if(state.theoryEvidence.length>=theoryLimit){openModal(`<h2>Case Theory</h2><p>You can pin at most <b>${theoryLimit}</b> pieces of evidence. Remove one before adding another.</p>`);return;}
    state.theoryEvidence.push(id);
  }
  save();renderTheory();
}
function renderTheory(){
  const b=document.getElementById('deductionBoard');
  const found=[...state.found];
  if(!found.length){b.innerHTML='<p class="note">Discover evidence before building a case theory.</p>';return;}
  b.innerHTML=`<div class="question"><h4>Pin up to ${theoryLimit} pieces of evidence that best support your theory.</h4><p class="note">The board will not tell you whether a choice is right. You will only learn that when you make your final accusation.</p><div class="choices" id="theoryChoices"></div></div>`;
  const cs=document.getElementById('theoryChoices');
  found.forEach(id=>{
    const bt=document.createElement('button');
    bt.className='choice'+(state.theoryEvidence.includes(id)?' selected':'');
    bt.innerHTML=`<b>${evidence[id].title}</b>`;
    bt.onclick=()=>toggleTheoryEvidence(id);
    cs.appendChild(bt);
  });
  const summary=document.createElement('div');
  summary.className='result';
  summary.innerHTML=`<b>${state.theoryEvidence.length}/${theoryLimit} evidence pins selected.</b> You may accuse with fewer than five, but a strong theory should explain opportunity, method, preparation and motive.`;
  b.appendChild(summary);
}

function renderNotebook(){const n=document.getElementById('notebook');n.innerHTML=(state.notes.length?state.notes:['Collect facts first. Decide what they mean only after comparing the suspects.']).map(x=>`<div class="noteitem">${x}</div>`).join('')}
function updateProgress(){document.getElementById('foundCount').textContent=state.found.size;document.getElementById('progressBar').style.width=(state.found.size/totalEvidence*100)+'%';updateRank()}
function updateRank(){let score=state.found.size*3+state.theoryEvidence.length*3-state.hints*5;let r='Rookie';if(score>=30)r='Detective';if(score>=48)r='Inspector';if(score>=64)r='Master Detective';document.getElementById('rankTop').textContent=r}
function renderAll(){renderEvidence();renderTimeline();renderNotebook();renderTheory();updateProgress()}

const hintText=[
 'The 8:45 hallway camera is useful, but the switch may already have happened by then. Compare the last genuine image with the first image of the substitute.',
 'Several suspects have a plausible motive or method. Try to verify their stories before treating suspicion as proof.',
 'Maya’s blue CZ order matters. So do the dimensions of the stone that is actually found in her lighting case.',
 'Look closely at the physical trace found on the substitute itself. Ask which suspect denies ever touching that stone.',
 'If you have narrowed the culprit, compare the exact substitute dimensions with who could have obtained those measurements, then revisit the unexplained financial notation.'
];
document.getElementById('hintBtn').onclick=()=>{const i=Math.min(state.hints,hintText.length-1);openModal(`<h2>Hint ${state.hints+1}</h2><p>${hintText[i]}</p>`);state.hints++;save();updateRank()}

document.getElementById('accuseBtn').onclick=()=>{document.getElementById('accuseResult').innerHTML='';document.getElementById('accuseModal').classList.add('show')}
function closeAccuse(){document.getElementById('accuseModal').classList.remove('show')} window.closeAccuse=closeAccuse;

function hasTheory(id){return state.theoryEvidence.includes(id)}
function theorySupportsSolution(){
  if(!hasTheory('residue')) return false;
  const categories=[
    hasTheory('call'),
    hasTheory('insurer'),
    hasTheory('ledger'),
    hasTheory('frame')||hasTheory('raw'),
    hasTheory('propstone')||hasTheory('order')
  ];
  return categories.filter(Boolean).length>=3;
}

document.getElementById('submitAccusation').onclick=()=>{
 const c=document.getElementById('culpritSelect').value,m=document.getElementById('methodSelect').value,mo=document.getElementById('motiveSelect').value,w=document.getElementById('windowSelect').value;
 const factsOk=c==='Evelyn Shaw'&&m==='swap'&&mo==='buyer'&&w==='824-827';
 const supportOk=theorySupportsSolution();
 const base=Math.max(0,100-state.hints*5-(totalEvidence-state.found.size));
 if(factsOk&&supportOk){
   localStorage.setItem('case001_v3_solved','true');
   document.getElementById('accuseResult').innerHTML=`<div class="result win"><h3>CASE SOLVED — Score ${base}/100</h3>
   <p><b>Evelyn Shaw stole the Blue Meridian.</b></p>
   <p>The case is designed to make Maya look guilty first. She had financial pressure, she handled the display pin, clear display wax and velvet fibres reached her tripod, and she had ordered a blue CZ. But the ordered stone is still in its supplier pouch and measures <b>17.70 × 13.00 × 8.10 mm</b>. The substitute in the display measures <b>18.28 × 13.46 × 8.22 mm</b>. Maya’s suspicious prop is not the substitute.</p>
   <p>Adrian also had a strong motive and lied about his whereabouts. His lie concealed the theft of an expensive wine bottle: the cellar camera records him continuously from 8:23:18 to 8:29:02. Felix had the most obvious method—gloves, wax, imitation stones, tension tools, and even a joke about making the diamond disappear—but the uninterrupted rehearsal recording keeps him in the ballroom throughout the critical period.</p>
   <p>The genuine Blue Meridian is still visible at <b>8:24:31</b>. By <b>8:27:11</b>, Maya’s RAW photograph shows the substitute. Evelyn says she answered the insurer call and stepped into the hall, but the call connects at <b>8:24:36</b> while the study door does not open until <b>8:25:06</b>. That gives her an unaccounted interval while the display is open.</p>
   <p>That interval alone is not enough to convict her. The decisive clue is the <b>blue examination wax on the underside of the substitute</b>. It matches the wax in Evelyn’s appraisal kit. Evelyn specifically says she never handled a replica.</p>
   <p>The remaining evidence explains preparation and motive. The substitute matches the confidential insurer measurements—not merely the rounded public dimensions—and Evelyn downloaded that file eleven days earlier. Her private folio contains <b>“V.A. — 40 received / 200 on delivery / BM-1847”</b>, together with a $40,000 transfer from V. Armitage Holdings.</p>
   <p>The evidence was present from the beginning, but its importance was easy to miss because the most conspicuous clues belonged to the wrong suspects.</p></div>`;
 } else {
   let extra='';
   if(!factsOk) extra='Your culprit, method, motive or crime window does not fit all of the verified facts.';
   else if(!supportOk) extra='Your accusation may be pointed in the right direction, but the evidence pinned to your Case Theory does not yet prove it.';
   document.getElementById('accuseResult').innerHTML=`<div class="result lose"><h3>Accusation not proven</h3><p>${extra}</p><p>Return to the evidence and build the strongest case you can. Suspicion is not enough.</p></div>`;
 }
}

document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset all progress for Case 001?')){localStorage.removeItem('case001_v3_state');localStorage.removeItem('case001_v3_solved');location.reload()}}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
document.getElementById('accuseModal').addEventListener('click',e=>{if(e.target.id==='accuseModal')closeAccuse()});

const origRenderAll=renderAll;
function unlockDerived(){
  if(state.found.has('desk') && state.found.has('frame') && !state.found.has('raw')){
    state.found.add('raw');state.notes.unshift('<b>8:27:11 RAW photograph</b> — the substitute is already in the display.');save();
  }
  if(state.found.has('desk') && state.found.has('insurer') && !state.found.has('ledger')){
    state.found.add('ledger');state.notes.unshift('<b>Evelyn’s folio notation</b> — a short payment notation references BM-1847.');save();
  }
}
function renderAllWrapped(){unlockDerived();origRenderAll()}
renderAll=renderAllWrapped;

load();renderSuspects();renderAll();
