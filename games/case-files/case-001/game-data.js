const evidence = {
  display:{title:'Display lock & substitute',desc:'The brass lock and hinges are undamaged. The stone in the case is an 18.04 ct blue cubic zirconia measuring 18.28 × 13.46 × 8.22 mm.',timeline:'9:12 PM — The display is opened under supervision. The stone is confirmed as a cubic zirconia substitute.'},
  residue:{title:'Fluorescent residue',desc:'Under UV light, a tiny green fluorescent speck is visible on the underside of the substitute stone. Its spectrum matches the numbered tamper lacquer used in Evelyn’s appraisal kit. One lacquer dot is missing from that kit.',timeline:null},
  camera:{title:'Hallway security footage',desc:'Continuous hallway footage begins at 8:45 PM. From 8:45 to 9:06, nobody enters or leaves the study. The recording has no missing segment or clock jump.',timeline:'8:45 PM — Hallway camera watch begins. No entry or exit occurs before the 9:06 discovery.'},
  desk:{title:'8:18 appraisal record',desc:'Evelyn’s gem tester logged the genuine Blue Meridian at 8:18:42 PM. The record includes laser inscription BM-1847 and its characteristic feather inclusion.',timeline:'8:18:42 PM — The genuine Blue Meridian is electronically verified.'},
  door:{title:'Door & window inspection',desc:'The study door has no tool marks. The single window is latched from inside and its old paint seal is unbroken. There is no usable second entrance.',timeline:null},
  tripod:{title:'Tripod collar trace',desc:'A blue velvet fibre and a speck of clear display wax are trapped in Maya’s tripod collar. Both match the removable velvet display pin used for the close-up photographs.',timeline:null},
  frame:{title:'8:24:31 tethered test frame',desc:'A test frame copied automatically to the house server at 8:24:31 shows the genuine feather inclusion. A blue-gloved hand is at the display pin. At the glove cuff, part of a silver bracelet and triangular clasp is visible.',timeline:'8:24:31 PM — A server-copied test frame still shows the genuine Blue Meridian.'},
  raw:{title:'8:27:11 RAW photograph',desc:'Maya’s camera stores an unedited RAW frame timestamped 8:27:11. The feather inclusion is absent and the pavilion facets match the CZ substitute later removed from the case.',timeline:'8:27:11 PM — Maya’s RAW photograph already shows the substitute stone.'},
  call:{title:'Call & door timestamps',desc:'Evelyn’s insurer call connects at 8:24:36. The study door contact does not open until 8:25:06; her phone transfers to the hallway access point at 8:25:09. The call continues until 8:28:10.',timeline:'8:24:36–8:25:09 PM — Evelyn answers the call before leaving the study; the door opens 30 seconds after connection.'},
  order:{title:'Maya’s rush prop order',desc:'Four days before the dinner, Maya ordered an 18.1 ct blue CZ for a commercial shoot. The order dimensions are 17.70 × 13.00 × 8.10 mm.',timeline:'Four days earlier — Maya places a rush order for a blue CZ photography prop.'},
  propstone:{title:'Sealed photography prop',desc:'The blue CZ from Maya’s rush order is found in its labelled supplier pouch inside her lighting case. Its dimensions match the order and do not match the substitute recovered from the display.',timeline:null},
  adrian:{title:'Adrian’s cellar recording',desc:'An interior cellar camera shows Adrian continuously from 8:23:18 to 8:29:02. At 8:25:44 he removes a rare bottle that is later found in his car.',timeline:'8:23:18–8:29:02 PM — Adrian is continuously recorded in the cellar.'},
  felix:{title:'Felix rehearsal video',desc:'A continuous ballroom recording shows Felix rehearsing from 8:22:03 to 8:31:49. His imitation gems are oversized red acrylic stage props.',timeline:'8:22:03–8:31:49 PM — Felix is continuously visible on ballroom rehearsal video.'},
  bracelet:{title:'Evelyn’s silver bracelet',desc:'Evelyn is wearing a narrow silver bracelet with a triangular clasp. Dinner photographs from 7:40 onward show the same bracelet continuously on her right wrist.',timeline:null},
  insurer:{title:'Insurer-file audit',desc:'The substitute matches the confidential insurer dimensions to within 0.02 mm. The public exhibition sheet uses rounded dimensions. The insurer audit log shows Evelyn downloaded the full measurement file eleven days ago; no other suspect account accessed it.',timeline:'Eleven days earlier — Evelyn downloads the confidential insurer measurement file.'},
  ledger:{title:'Notation in Evelyn’s folio',desc:'A page in Evelyn’s private appraisal folio reads: “V.A. — 40 received / 200 on delivery / BM-1847.” A bank alert on the same date shows an incoming 40,000 payment from V. Armitage Holdings.',timeline:'Nine days earlier — Evelyn receives 40,000 from V. Armitage Holdings.'}
};

const suspects = [
  {name:'Maya Ortiz',icon:'📷',art:'../assets/maya.svg',role:'Event photographer',bio:'Freelance photographer hired to produce publicity images of the Blue Meridian. Her studio is under serious financial pressure.',questions:[
    ['What happened during the close-up setup?','Evelyn opened the case and handled the stone. I worked the camera. I did not take the diamond.'],
    ['Did you touch the display equipment?','I adjusted the velvet pin once because the stone was leaning. I should have asked first. I panicked when everyone started looking at me.'],
    ['Did you order a blue replica stone?','Yes. A blue CZ prop for a cosmetics campaign next week. It should still be sealed in my lighting case.'],
    ['When did you notice Evelyn leave?','Her phone rang while she was still beside the display. I heard her answer. A short while later the study door opened and she went into the hall.']
  ]},
  {name:'Adrian Cole',icon:'🥃',art:'../assets/adrian.svg',role:'Host’s nephew',bio:'Recently cut off from a family trust and known to have gambling debts. He knows Ashcroft House well.',questions:[
    ['Where were you at 8:25?','I said conservatory. Fine—check the cellar instead. I had my own reason not to want anyone looking there.'],
    ['Is there another way into the study?','No. The old service passage was bricked up decades ago. The window barely moves.'],
    ['Why lie about the cellar?','Because taking Uncle’s wine is embarrassing enough without being accused of stealing a diamond too.']
  ]},
  {name:'Evelyn Shaw',icon:'💎',art:'../assets/evelyn.svg',role:'Gem appraiser',bio:'Certified appraiser who verified the Blue Meridian for the insurer. She had authorized access to the stone before dinner.',questions:[
    ['When did you verify the real diamond?','8:18 PM. My tester logged the inscription and internal features automatically.'],
    ['What happened when the insurer called?','My phone rang during the photo setup. I answered and stepped into the hall. Maya remained with the open display.'],
    ['Did you ever handle the substitute stone?','No. I handled the Blue Meridian during the appraisal and photo setup. I never handled a replica.'],
    ['Do you always wear that bracelet?','This one? Yes. It belonged to my mother. I wore it all evening.'],
    ['Who had the exact stone measurements?','The insurer, the owner and me. The public exhibition sheet gives rounded dimensions.']
  ]},
  {name:'Felix Rowan',icon:'🎩',art:'../assets/felix.svg',role:'Stage magician',bio:'Dinner entertainment. Carries gimmicks, duplicate objects, thread, magnets and imitation jewels as part of his act.',questions:[
    ['Could you switch a diamond without anyone noticing?','On a stage, perhaps. But a trick is still mechanics and timing.'],
    ['Where were you at 8:25?','Ballroom rehearsal. The house videographer recorded the whole run.'],
    ['Why do you carry fake gems?','They are stage props—red acrylic, deliberately oversized so the audience can see them.']
  ]}
];

const state = {found:new Set(), notes:[], asked:{}, hints:0, selected:{}, deductionsChecked:false, deductionScore:0};
const totalEvidence = Object.keys(evidence).length;
document.getElementById('totalCount').textContent=totalEvidence;

function save(){localStorage.setItem('case001_v2_state',JSON.stringify({found:[...state.found],notes:state.notes,asked:state.asked,hints:state.hints,selected:state.selected,deductionsChecked:state.deductionsChecked,deductionScore:state.deductionScore}));}
function load(){try{const s=JSON.parse(localStorage.getItem('case001_v2_state'));if(!s)return;state.found=new Set((s.found||[]).filter(id=>evidence[id]));state.notes=s.notes||[];state.asked=s.asked||{};state.hints=s.hints||0;state.selected=s.selected||{};state.deductionsChecked=!!s.deductionsChecked;state.deductionScore=s.deductionScore||0;}catch(e){}}
function go(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById('view-'+v).classList.add('active');document.querySelectorAll('#nav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));}
window.go=go;
document.querySelectorAll('#nav [data-view]').forEach(b=>b.onclick=()=>go(b.dataset.view));
function addEvidence(id, extraNote){if(!state.found.has(id)){state.found.add(id);state.notes.unshift(`<b>${evidence[id].title}</b> — ${extraNote||evidence[id].desc}`);save();renderAll();}}
function openModal(html){document.getElementById('modalContent').innerHTML=html;document.getElementById('modal').classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('show')} window.closeModal=closeModal;

function inspect(id){
  if(id==='display'){
    addEvidence('display');
    addEvidence('residue');
    openModal('<h2>Display case</h2><p>The lock and hinges are undamaged. The displayed stone tests as cubic zirconia and measures <b>18.28 × 13.46 × 8.22 mm</b>.</p><p>Under UV light, a tiny green fluorescent speck is visible on the underside of the stone.</p>');
  }
  if(id==='camera'){
    addEvidence('camera');
    openModal('<h2>Hallway camera</h2><p>The recording begins at <b>8:45 PM</b> and runs continuously. Nobody enters or leaves the study before the discovery at 9:06.</p>');
  }
  if(id==='desk'){
    addEvidence('desk');
    addEvidence('insurer');
    addEvidence('ledger');
    openModal('<h2>Appraisal papers</h2><p>The 8:18:42 appraisal log records inscription <b>BM-1847</b> and the stone’s feather inclusion.</p><p>The insurer-file audit and Evelyn’s private appraisal folio are filed with the paperwork.</p>');
  }
  if(id==='door'){
    addEvidence('door');
    openModal('<h2>Door and window</h2><p>No tool marks on the door. The window is latched from inside and its brittle paint seal is intact.</p>');
  }
  if(id==='tripod'){
    addEvidence('tripod');
    openModal('<h2>Tripod</h2><p>A blue velvet fibre and a speck of clear display wax are caught in the tripod collar.</p>');
  }
}
window.inspect=inspect;

function renderSuspects(){const g=document.getElementById('suspectGrid');g.innerHTML='';suspects.forEach((s,si)=>{const d=document.createElement('div');d.className='suspect';d.innerHTML=`<div class="portrait"><img src="${s.art}" alt="Portrait of ${s.name}"></div><h3>${s.name}</h3><div class="role">${s.role}</div><p>${s.bio}</p><div class="qa"></div><div class="statement" id="st-${si}">Select a question.</div>`;const qa=d.querySelector('.qa');s.questions.forEach((q,qi)=>{const b=document.createElement('button');b.className='btn';b.textContent=q[0];b.onclick=()=>ask(si,qi);qa.appendChild(b)});g.appendChild(d)})}
function ask(si,qi){
  const s=suspects[si], ans=s.questions[qi][1];
  document.getElementById('st-'+si).innerHTML=`<b>${s.name}:</b> “${ans}”`;
  state.asked[`${si}-${qi}`]=true;

  if(si===0&&qi===0) addEvidence('frame');
  if(si===0&&qi===1) addEvidence('tripod');
  if(si===0&&qi===2){addEvidence('order');addEvidence('propstone');}
  if(si===0&&qi===3) addEvidence('call');
  if(si===1&&qi===0) addEvidence('adrian');
  if(si===2&&qi===0) addEvidence('desk');
  if(si===2&&qi===1) addEvidence('call');
  if(si===2&&qi===2) addEvidence('residue');
  if(si===2&&qi===3) addEvidence('bracelet');
  if(si===2&&qi===4) addEvidence('insurer');
  if(si===3&&qi===1) addEvidence('felix');

  save();renderAll();
}
