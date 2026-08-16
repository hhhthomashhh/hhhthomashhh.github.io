const evidence = {
  display:{title:'Display lock & replica',desc:'The brass lock is undamaged: no fresh scratches, bending, or pick marks. The stone now in the case is a 18.1 ct blue cubic zirconia cut to closely match the Blue Meridian.',timeline:'9:12 PM — The display is opened under supervision. The lock is undamaged; the stone is confirmed as a CZ replica.'},
  camera:{title:'Hallway security footage',desc:'Continuous footage begins at exactly 8:45 PM. From 8:45 to 9:06, nobody enters or leaves the study. There is no missing footage or clock discontinuity.',timeline:'8:45 PM — Hallway camera watch begins. No entry or exit occurs until 9:06.'},
  desk:{title:'Appraisal printout',desc:'Evelyn’s gem tester logged the Blue Meridian at 8:18:42 PM. The report includes its laser inscription BM-1847 and its characteristic internal feather inclusion.',timeline:'8:18 PM — Evelyn electronically verifies the real Blue Meridian: inscription BM-1847 and matching inclusion.'},
  door:{title:'Door & window inspection',desc:'The study door has no tool marks. The single window is latched from inside and its old paint seal is unbroken. There is no second entrance.',timeline:null},
  tripod:{title:'Tripod collar trace',desc:'A tiny blue velvet fibre is trapped inside the thread of the photographer’s tripod collar, along with a speck of clear display wax. Both match materials from the diamond’s removable display pin.',timeline:null},
  raw:{title:'8:27 RAW photograph',desc:'Maya’s camera stores an unedited RAW frame timestamped 8:27:11 PM. The stone is already the replica: the Blue Meridian’s distinctive feather inclusion is absent, and the pavilion facet pattern differs from the 8:18 appraisal image.',timeline:'8:27 PM — Maya’s RAW photograph shows that the replica is already in the case.'},
  call:{title:'Evelyn’s call log',desc:'At 8:24:36 PM Evelyn received a 214-second call from the insurer and stepped into the hall. Two witnesses confirm she remained there until 8:28:10. Maya stayed in the study with the display open for the close-up shot.',timeline:'8:24–8:28 PM — Evelyn is continuously visible in the hallway on an insurer call; Maya remains alone in the study with the display open for photography.'},
  order:{title:'Prop-stone order',desc:'A receipt in Maya’s equipment folio shows a rush order placed four days ago for a custom 18 ct blue cubic zirconia, dimensions matched to the Blue Meridian’s published exhibition specifications.',timeline:'Four days earlier — Maya orders a custom blue CZ matching the exhibition dimensions.'},
  message:{title:'Collector message',desc:'A printed message tucked into Maya’s invoice folder reads: “Authentic BM only. 240 cash on delivery. No replica, no deal.” The sender uses the same alias listed on a prior photography payment record.',timeline:'Two days earlier — Maya receives a cash offer contingent on delivering the authentic Blue Meridian.'},
  adrian:{title:'Adrian’s wine theft',desc:'Adrian admits he lied about his whereabouts because he stole a rare bottle from the cellar. An interior cellar camera shows him continuously from 8:23:18 to 8:29:02, and the inventory sensor logs the bottle removal at 8:25:44. The bottle is later found in his car. Suspicious, but unrelated to the diamond.',timeline:'8:23–8:29 PM — Cellar video continuously shows Adrian; at 8:25:44 he removes a rare wine bottle.'},
  felix:{title:'Felix rehearsal video',desc:'A continuous ballroom rehearsal recording shows Felix on stage from 8:22:03 to 8:31:49. His fake gems are red acrylic stage props and do not match the replica.',timeline:'8:22–8:31 PM — Felix is continuously visible on ballroom rehearsal video.'},
  mayaLie:{title:'Maya’s false statement',desc:'Maya first says, “I never touched the case or the display pin.” But a tethered test frame automatically copied to the house server at 8:24:31 shows her gloved hand holding the removable velvet display pin. The genuine diamond’s feather inclusion is still visible in that frame.',timeline:'8:24:31 PM — A server-copied test frame shows the genuine diamond and Maya handling the removable display pin, contradicting her later statement.'}
};
const suspects = [
  {name:'Maya Ortiz',icon:'📷',art:'../assets/maya.svg',role:'Event photographer',bio:'Freelance photographer hired to produce publicity images of the Blue Meridian. Her studio is under serious financial pressure.',questions:[
    ['Where were you from 8:20 to 8:30?','In the study with Evelyn, mostly. I was setting up a macro shot. She handled the jewelry; I never touched the case or the display pin.'],
    ['Why was your tripod next to the display?','Macro work. I had the center column lowered and the legs tight to the desk. Nothing unusual.'],
    ['Did you order a blue replica stone?','What? No. I buy props sometimes for commercial shoots, but nothing connected to this dinner.']
  ]},
  {name:'Adrian Cole',icon:'🥃',art:'../assets/adrian.svg',role:'Host’s nephew',bio:'Recently cut off from a family trust and known to have gambling debts. He knows Ashcroft House well.',questions:[
    ['Where were you at 8:25?','In the conservatory. Alone. I needed some air.'],
    ['You know the house. Is there another way into the study?','No. The old service passage was bricked up decades ago. The window sticks and hasn’t opened in years.'],
    ['Why are you nervous?','Because everyone has already decided the broke nephew did it. That is not evidence.']
  ]},
  {name:'Evelyn Shaw',icon:'💎',art:'../assets/evelyn.svg',role:'Gem appraiser',bio:'Certified appraiser who verified the Blue Meridian for the insurer. She had authorized access to the stone before dinner.',questions:[
    ['When did you last verify the real diamond?','8:18 PM. My tester printed the inscription and internal-feature scan automatically.'],
    ['What happened during the photo setup?','I opened the case for Maya. At 8:24 the insurer called, so I stepped into the hall. Maya was still arranging the close-up, and the case was open for the shot. I returned a little after 8:28.'],
    ['How did you know the displayed stone was fake at 9:06?','The inclusion was wrong. The Blue Meridian has a tiny feather under the upper-left crown facet. I could not see it through the glass.']
  ]},
  {name:'Felix Rowan',icon:'🎩',art:'../assets/felix.svg',role:'Stage magician',bio:'Dinner entertainment. Carries gimmicks, duplicate objects, thread, magnets and imitation jewels as part of his act.',questions:[
    ['Could you switch a diamond without anyone noticing?','On a stage? Maybe. In a locked display under scrutiny? Not with magic. Tricks still need opportunity.'],
    ['Where were you at 8:25?','Ballroom rehearsal. The house videographer recorded the whole run.'],
    ['Why do you have fake gems?','Because I make objects vanish for a living. They are red acrylic, oversized, and about as convincing as candy.']
  ]}
];
const state = {found:new Set(), notes:[], asked:{}, hints:0, selected:{}, deductionsChecked:false, deductionScore:0};
const totalEvidence = Object.keys(evidence).length;
document.getElementById('totalCount').textContent=totalEvidence;

function save(){localStorage.setItem('case001_state',JSON.stringify({found:[...state.found],notes:state.notes,asked:state.asked,hints:state.hints,selected:state.selected,deductionsChecked:state.deductionsChecked,deductionScore:state.deductionScore}));}
function load(){try{const s=JSON.parse(localStorage.getItem('case001_state'));if(!s)return;state.found=new Set(s.found||[]);state.notes=s.notes||[];state.asked=s.asked||{};state.hints=s.hints||0;state.selected=s.selected||{};state.deductionsChecked=!!s.deductionsChecked;state.deductionScore=s.deductionScore||0;}catch(e){}}
function go(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById('view-'+v).classList.add('active');document.querySelectorAll('#nav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));}
window.go=go;
document.querySelectorAll('#nav [data-view]').forEach(b=>b.onclick=()=>go(b.dataset.view));
function addEvidence(id, extraNote){if(!state.found.has(id)){state.found.add(id);state.notes.unshift(`<b>${evidence[id].title}</b> — ${extraNote||evidence[id].desc}`);save();renderAll();}}
function openModal(html){document.getElementById('modalContent').innerHTML=html;document.getElementById('modal').classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('show')} window.closeModal=closeModal;
function inspect(id){
  if(id==='display'){addEvidence('display','Lock is clean; the stone in the case is a CZ replica.');openModal('<h2>Display case</h2><p>The lock and hinges are pristine. No pick scratches, pry marks, or damage. Under supervision, the case is opened and the displayed stone tests as a blue cubic zirconia.</p><p><b>Inference:</b> either someone used the proper key, or the real stone was switched while the case was legitimately open.</p>')}
  if(id==='camera'){addEvidence('camera','Nobody enters the study after 8:45 PM.');openModal('<h2>Hallway camera</h2><p>The recording is continuous from 8:45 PM. You verify the checksum and time overlay: no missing segment, no restart, no clock jump. Nobody enters or leaves the study before the discovery at 9:06.</p><p><b>Important:</b> this proves only that nobody entered after 8:45 — not that the real diamond was still present at 8:45.</p>')}
  if(id==='desk'){addEvidence('desk','The genuine Blue Meridian was electronically verified at 8:18:42 PM; its unique feather inclusion can be used to authenticate later images.');openModal('<h2>Appraisal printout</h2><p>Evelyn’s device printed an automated record at <b>8:18:42 PM</b>. It captures inscription <b>BM-1847</b> and the natural feather inclusion shown in the insurer’s reference image.</p><p>This establishes the diamond’s unique identifying inclusion. A later server-copied image can therefore prove whether the genuine stone was still present.</p>')}
  if(id==='door'){addEvidence('door','No viable hidden route into the room.');openModal('<h2>Door and window</h2><p>No tool marks on the door. The window latch is inside, and the brittle paint seal along the sash is intact. There is no usable second entrance.</p>')}
  if(id==='tripod'){addEvidence('tripod','Blue velvet fibre and display wax are trapped in the photographer’s tripod collar.');openModal('<h2>Tripod floor mark</h2><p>A fresh tripod footprint sits beside the display. In the threaded collar left near the desk, you find a <b>blue velvet fibre</b> and a speck of <b>clear mounting wax</b>.</p><p>Both match the removable pin that held the Blue Meridian.</p>')}
}
window.inspect=inspect;

function renderSuspects(){const g=document.getElementById('suspectGrid');g.innerHTML='';suspects.forEach((s,si)=>{const d=document.createElement('div');d.className='suspect';d.innerHTML=`<div class="portrait"><img src="${s.art}" alt="Portrait of ${s.name}"></div><h3>${s.name}</h3><div class="role">${s.role}</div><p>${s.bio}</p><div class="qa"></div><div class="statement" id="st-${si}">Select a question.</div>`;const qa=d.querySelector('.qa');s.questions.forEach((q,qi)=>{const b=document.createElement('button');b.className='btn';b.textContent=q[0];b.onclick=()=>ask(si,qi);qa.appendChild(b)});g.appendChild(d)})}
function ask(si,qi){const s=suspects[si], ans=s.questions[qi][1];document.getElementById('st-'+si).innerHTML=`<b>${s.name}:</b> “${ans}”`;state.asked[`${si}-${qi}`]=true;
  if(si===2&&qi===0) addEvidence('desk');
  if(si===2&&qi===1) addEvidence('call','Evelyn’s insurer call places her in the hall while Maya remains inside.');
  if(si===2&&qi===2 && state.found.has('raw')) state.notes.unshift('<b>Cross-check:</b> Evelyn’s description of the feather inclusion matches the 8:18 scan and is absent in the 8:27 RAW frame.');
  if(si===1&&qi===0) addEvidence('adrian','Adrian’s lie concerns a stolen wine bottle, not the diamond.');
  if(si===3&&qi===1) addEvidence('felix','Continuous rehearsal video removes Felix from the key swap window.');
  if(si===0&&qi===0){addEvidence('mayaLie','Maya denies handling the display pin, but the 8:24:31 server-copied test frame contradicts her and still shows the genuine stone.'); if(state.found.has('raw')) state.notes.unshift('<b>Pressure point:</b> Maya lied about handling the pin before the replica appears in her later RAW photo.');}
  if(si===0&&qi===2){addEvidence('order','Maya ordered a custom blue CZ four days before the dinner.');addEvidence('message','A collector offered Maya cash only for the authentic Blue Meridian.');}
  save();renderAll();}
