const evidenceVisuals={
 display:['0%','0%'], desk:['33.333%','0%'], mayaLie:['66.667%','0%'], raw:['100%','0%'],
 tripod:['0%','100%'], call:['33.333%','100%'], adrian:['66.667%','100%'], message:['100%','100%']
};
const evidenceIcons={camera:'🎥',door:'🚪',order:'🧾',felix:'🎩'};
function evidenceThumb(id,has){if(!has)return '<div class="evidence-icon">?</div>';if(evidenceVisuals[id]){const p=evidenceVisuals[id];return `<div class="evidence-thumb" style="background-image:url('../assets/evidence.svg');background-size:400% 200%;background-position:${p[0]} ${p[1]}"></div>`;}return `<div class="evidence-icon">${evidenceIcons[id]||'🔎'}</div>`;}
function renderEvidence(){const el=document.getElementById('evidenceList');el.innerHTML='';Object.entries(evidence).forEach(([id,e])=>{const has=state.found.has(id);const d=document.createElement('div');d.className='evidence'+(has?'':' locked');d.innerHTML=`${evidenceThumb(id,has)}<div class="evidence-body">${has?`<strong>${e.title}</strong><small>${e.desc}</small>`:`<strong>Undiscovered evidence</strong><small>Continue investigating.</small>`}</div>`;el.appendChild(d)})}
function renderTimeline(){const items=Object.entries(evidence).filter(([id,e])=>state.found.has(id)&&e.timeline).map(([id,e])=>e.timeline);const parsed=items.map(t=>{const m=t.match(/^([^—]+)—\s*(.*)$/);return m?[m[1].trim(),m[2]]:['',t]});document.getElementById('timelineList').innerHTML=parsed.length?parsed.map(x=>`<div class="timeline-row"><div class="time">${x[0]}</div><div>${x[1]}</div></div>`).join(''):'<p class="note">No verified timeline entries yet.</p>'}

const deductionQs=[
 {id:'genuine',q:'1. What is the last firmly verified time the genuine Blue Meridian was present?',choices:[['824','8:24:31 PM — server-copied test frame still shows the genuine stone'],['818','8:18 PM — automated appraisal scan'],['845','8:45 PM — security camera begins']]},
 {id:'fake',q:'2. What is the earliest evidence proving the replica was already in the case?',choices:[['827','8:27 PM — Maya’s unedited RAW photograph'],['845','8:45 PM — camera footage'],['906','9:06 PM — discovery']]},
 {id:'window',q:'3. Therefore, what is the tightest proven switch window?',choices:[['824','Between 8:24:36 and 8:27:11 PM'],['845','After 8:45 PM'],['906','At 9:06 PM']]},
 {id:'opportunity',q:'4. Who had the decisive unsupervised opportunity in that interval?',choices:[['maya','Maya, while Evelyn was in the hall on the insurer call'],['adrian','Adrian, while he was in the cellar'],['felix','Felix, during rehearsal'],['evelyn','Evelyn, while on the insurer call']]}
];
const correct={genuine:'824',fake:'827',window:'824',opportunity:'maya'};
function renderDeduction(){const b=document.getElementById('deductionBoard');b.innerHTML='';deductionQs.forEach(q=>{const box=document.createElement('div');box.className='question';box.innerHTML=`<h4>${q.q}</h4><div class="choices"></div>`;const cs=box.querySelector('.choices');q.choices.forEach(c=>{const bt=document.createElement('button');bt.className='choice'+(state.selected[q.id]===c[0]?' selected':'');bt.textContent=c[1];bt.onclick=()=>{state.selected[q.id]=c[0];state.deductionsChecked=false;save();renderDeduction()};if(state.deductionsChecked){if(c[0]===correct[q.id])bt.classList.add('correct');else if(state.selected[q.id]===c[0])bt.classList.add('wrong')}cs.appendChild(bt)});b.appendChild(box)})}
document.getElementById('checkDeduction').onclick=()=>{state.deductionsChecked=true;state.deductionScore=deductionQs.filter(q=>state.selected[q.id]===correct[q.id]).length;const f=document.getElementById('deductionFeedback');f.innerHTML=state.deductionScore===4?'<div class="result win"><b>Deduction chain complete.</b> You have established a closed crime window and a unique opportunity.</div>':`<div class="result lose"><b>${state.deductionScore}/4 steps correct.</b> Re-check the evidence that fixes the last genuine time and the first fake time.</div>`;save();renderDeduction();updateRank()}

function renderNotebook(){const n=document.getElementById('notebook');n.innerHTML=(state.notes.length?state.notes:['Start by establishing when the real diamond was last definitely genuine.']).map(x=>`<div class="noteitem">${x}</div>`).join('')}
function updateProgress(){document.getElementById('foundCount').textContent=state.found.size;document.getElementById('progressBar').style.width=(state.found.size/totalEvidence*100)+'%';updateRank()}
function updateRank(){let score=state.found.size*4+state.deductionScore*10-state.hints*5;let r='Rookie';if(score>=35)r='Detective';if(score>=55)r='Inspector';if(score>=75)r='Master Detective';document.getElementById('rankTop').textContent=r}
function renderAll(){renderEvidence();renderTimeline();renderNotebook();renderDeduction();updateProgress()}

const hintText=[
 'The camera only tells you what happened after 8:45. Find the last objective image that still proves the real diamond was present.',
 'Use the 8:18 appraisal to identify the diamond’s unique inclusion, then compare Maya’s server-copied 8:24:31 test frame with her 8:27:11 RAW frame. Those two images bracket the switch.',
 'Once you have the crime window, ignore general motive for a moment. Ask who was actually alone with the open display during that interval.',
 'Preparation matters: who obtained a physically matched blue replica before the dinner, and who had a buyer for the real stone?'
];
document.getElementById('hintBtn').onclick=()=>{const i=Math.min(state.hints,hintText.length-1);openModal(`<h2>Hint ${state.hints+1}</h2><p>${hintText[i]}</p>`);state.hints++;save();updateRank()}

document.getElementById('accuseBtn').onclick=()=>{document.getElementById('accuseResult').innerHTML='';document.getElementById('accuseModal').classList.add('show')}
function closeAccuse(){document.getElementById('accuseModal').classList.remove('show')} window.closeAccuse=closeAccuse;
document.getElementById('submitAccusation').onclick=()=>{
 const c=document.getElementById('culpritSelect').value,m=document.getElementById('methodSelect').value,mo=document.getElementById('motiveSelect').value,w=document.getElementById('windowSelect').value;
 const deductionsNow=deductionQs.every(q=>state.selected[q.id]===correct[q.id]);
 const ok=c==='Maya Ortiz'&&m==='swap'&&mo==='collector'&&w==='824-827'&&deductionsNow;
 const base=Math.max(0,100-state.hints*5-(12-state.found.size)*2);
 if(ok){localStorage.setItem('case001_solved','true');document.getElementById('accuseResult').innerHTML=`<div class="result win"><h3>CASE SOLVED — Score ${base}/100</h3><p><b>Maya Ortiz stole the Blue Meridian.</b></p><p>The key is the timeline. Evelyn’s 8:18 appraisal identifies the genuine stone’s unique feather inclusion. More importantly, a test frame automatically copied to the house server at <b>8:24:31</b> still shows that genuine inclusion, while Maya’s unedited 8:27:11 RAW frame shows the <b>replica already in place</b>. Evelyn’s 214-second insurer call keeps her continuously in the hall from <b>8:24:36 to 8:28:10</b>, leaving Maya alone with the legitimately open display throughout the entire proven switch window.</p><p>Maya had prepared a dimension-matched CZ four days earlier. She used the removable velvet display pin to swap the stones during the close-up setup, then returned the replica to the case. That is why the lock was never forced and why the 8:45 camera footage is perfectly clean: <b>the theft was already over before surveillance began.</b></p><p>Her denial that she ever touched the display pin is contradicted by her own setup photo. The velvet fibre and mounting wax in her tripod collar support the physical transfer. Finally, the collector message explains the plan and motive.</p><p>Adrian lied because he stole wine. Felix had stage props but was continuously on rehearsal video. Evelyn had authorized access, but the two server-timestamped images place the switch entirely inside her documented absence from the room.</p></div>`}
 else {document.getElementById('accuseResult').innerHTML=`<div class="result lose"><h3>Accusation not proven</h3><p>Your theory does not yet account for all four hard requirements: <b>culprit, method, motive, and the verified crime window.</b></p><p>${state.deductionScore<4?'Your deduction board is not fully correct yet. ':''}Use the last server-copied frame that still shows the genuine stone and the earliest frame that already shows the replica.</p></div>`}
}

document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset all progress for Case 001?')){localStorage.removeItem('case001_state');localStorage.removeItem('case001_solved');location.reload()}}

document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});document.getElementById('accuseModal').addEventListener('click',e=>{if(e.target.id==='accuseModal')closeAccuse()});

// Discovery hooks: inspect camera + speak to Evelyn about photo setup unlocks RAW frame;
// Maya's tripod / denial / order create corroboration, while red herrings are independently resolved.
const origRenderAll=renderAll;
function unlockDerived(){
 if(state.found.has('camera') && (state.asked['2-1']||state.found.has('call')) && !state.found.has('raw')){
   state.found.add('raw');state.notes.unshift('<b>Image bracket:</b> The 8:24:31 server frame still shows the genuine inclusion; the 8:27:11 RAW frame already shows the replica.');save();
 }
}
function renderAllWrapped(){unlockDerived();origRenderAll()}
renderAll=renderAllWrapped;

load();renderSuspects();renderAll();
