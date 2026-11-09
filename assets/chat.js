(function(){
var root=(document.currentScript&&document.currentScript.src||'').replace(/assets\/chat\.js.*$/,'');
var ALMA='https://secure.helloalma.com/providers/susan-albinder/';
var FAQ=[
{k:['crisis','suicid','kill myself','hurt myself','emergency','self harm','self-harm','988'],a:'If you are in crisis or thinking about harming yourself, please call or text <b>988</b> (Suicide &amp; Crisis Lifeline) or call <b>911</b> now. This chat is not monitored and cannot provide emergency help.'},
{k:['rebuild','method','program','pillar','coaching program','signature'],a:'The REBUILD Method™ is the framework I use in psychotherapy, built on seven pillars: Restore Your Foundation, Explore What Has Changed, Believe in Yourself, Understand Yourself Again, Intentional Living, Love, and Design Your Next Chapter. You can return to any pillar as your needs change. <a href="'+root+'rebuild-method/">Learn more →</a>'+root+'rebuild-method/">How it works →</a>'},
{k:['difference','therapy or coaching','coaching','wellness','services','service','offer','which','right for me'],a:'My main service is psychotherapy, guided by the REBUILD Method™. Health &amp; wellness coaching and nutrigenomics testing are separate wellness services, not therapy, and are offered and billed separately. <a href="'+root+'services/">See all services →</a>'},
{k:['book','booking','appointment','schedule','consult','get started','how do i start','begin'],a:'Start with a free 15–20 minute introductory call, booked through my secure, HIPAA-compliant Alma portal. Choose a time, complete the intake forms Alma emails you, then we meet in person or online. <a href="'+ALMA+'" target="_blank" rel="noopener">Schedule a Free Consultation →</a>'},
{k:['online','virtual','telehealth','video','remote','zoom','in person','in-person','outside florida','miami','fort lauderdale','palm beach'],a:'Yes. Therapy is available in person in Boca Raton or by secure video anywhere in Florida.'},
{k:['divorce','co-parent','coparent','separation','custody'],a:'I offer divorce recovery therapy and co-parenting counseling, and I’m certified by the High Conflict Institute. <a href="'+root+'services/divorce-recovery-therapy/">Learn more →</a>'},
{k:['couple','marriage','partner','husband','wife'],a:'I work with couples who are dating, married, separated, or deciding about the future. <a href="'+root+'services/couples-therapy/">Couples counseling →</a>'},
{k:['teen','child','my son','daughter','adolescent'],a:'I see teens one on one, with parent check-ins so you stay informed. <a href="'+root+'services/teen-therapy/">Therapy for teens →</a>'},
{k:['nutrigenomic','dna','genes','genetic','dna test','genetic test'],a:'Nutrigenomics testing shows how your genes affect nutrition, mood, and vitamin needs. We review results together and turn them into a plan. <a href="'+root+'services/nutrigenomics-testing/">Learn more →</a>'},
{k:['medical','doctor','hormone','prescri','labs','lab work','bloodwork','medication'],a:'I’m a licensed therapist and certified health coach, not a medical doctor. Medical longevity care is provided separately by Dr. Michael Fleischer, MD, FACOG, Medical Director of Lifelong Balance.'},
{k:['insurance','cost','fee ','fees','price','pay ','payment','superbill','afford'],a:'The first step is a free 15–20 minute introductory call. Private pay is $200 per session, and insurance is accepted through my secure Alma portal, where you can check your coverage when you book.'},
{k:['where','location','office','address','boca','directions'],a:'My office is at 950 Peninsula Corporate Circle, Suite 3024, Boca Raton, FL 33487. I also see clients online.'},
{k:['guide','free guide','pdf','download'],a:'You can get the free guide, <em>Rebuilding After Divorce</em>, by entering your email on the home page. <a href="'+root+'#guide">Get the guide →</a>'},
{k:['podcast','course','self-paced','self paced'],a:'Self-paced programs and the <em>Your Best Chapter</em> podcast are coming soon. Join the list on the home page to hear first.'},
{k:['credential','qualified','background','experience','phd','who are you','about'],a:'Dr. Susan Besman, Ph.D., LMFT is a Licensed Marriage &amp; Family Therapist with more than 25 years of experience, a Board-Certified Diplomate of A4M, and a certified health coach. <a href="'+root+'about/">Read her story →</a>'},
{k:['phone','call','email','contact','reach'],a:'Call <a href="tel:+15614454787">(561) 445-4787</a> or email <a href="mailto:drsusan@drsusanbesman.com">drsusan@drsusanbesman.com</a>.'}
];
var CHIPS=['What is the REBUILD Method?','What services do you offer?','How do I book?','Do you offer online sessions?','Fees & insurance'];
var css='#sbc *{box-sizing:border-box;font-family:Mulish,sans-serif}#sbc{position:fixed;right:clamp(12px,3vw,28px);bottom:clamp(12px,3vw,28px);z-index:9999}'+
'#sbc .fab{display:flex;align-items:center;gap:10px;background:#4F6F5A;color:#FAF7EE;border:0;border-radius:100px;padding:14px 22px 14px 16px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 10px 30px rgba(47,68,54,.35)}'+
'#sbc .fab:hover{background:#2F4436}@media(max-width:720px){#sbc .fab{width:56px;height:56px;padding:0;gap:0;justify-content:center}#sbc .fab .t{display:none}#sbc .fab i{width:34px;height:34px;font-size:18px}}#sbc .fab i{width:28px;height:28px;border-radius:50%;background:#F2CF5B;color:#2F4436;display:grid;place-items:center;font-style:normal;font-weight:800;font-size:15px}'+
'#sbc .win{width:min(390px,calc(100vw - 24px));height:min(560px,calc(100vh - 110px));background:#FAF7EE;border-radius:20px;box-shadow:0 24px 70px rgba(47,68,54,.34);overflow:hidden;display:flex;flex-direction:column}'+
'#sbc .hd{background:#4F6F5A;color:#FAF7EE;padding:18px 20px;display:flex;align-items:center;gap:12px}#sbc .hd img{height:40px;width:auto}#sbc .hd b{display:block;font-family:"Cormorant Garamond",serif;font-size:21px;font-weight:600}'+
'#sbc .hd small{font-size:12px;color:#C9D6C3}#sbc .x{margin-left:auto;background:none;border:0;color:#FAF7EE;font-size:26px;cursor:pointer;line-height:1;padding:4px 8px}'+
'#sbc .log{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px}#sbc .m{max-width:86%;padding:12px 15px;border-radius:16px;font-size:15px;line-height:1.5;color:#2F4436}'+
'#sbc .m a{color:#4F6F5A;font-weight:700}#sbc .bot{background:#FFFDF6;border:1px solid #E2E6D2;border-bottom-left-radius:4px;align-self:flex-start}#sbc .me{background:#4F6F5A;color:#FAF7EE;border-bottom-right-radius:4px;align-self:flex-end}'+
'#sbc .chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 12px}#sbc .chips button{background:#EEF2E2;border:1px solid #DCE3CC;color:#2F4436;border-radius:100px;padding:8px 13px;font-size:13px;font-weight:700;cursor:pointer}#sbc .chips button:hover{background:#F2CF5B}'+
'#sbc form{display:flex;gap:8px;padding:12px;border-top:1px solid #E2E6D2;background:#FFFDF6}#sbc input{flex:1;min-width:0;border:1px solid #CFD6BE;border-radius:100px;padding:12px 16px;font-size:15px;background:#FAF7EE;color:#2F4436}'+
'#sbc input:focus{outline:2px solid #E5B83A}#sbc form button{background:#E5B83A;color:#2F4436;border:0;border-radius:100px;padding:0 18px;font-weight:800;cursor:pointer}'+
'#sbc .ft{font-size:11px;color:#6F7A68;text-align:center;padding:0 12px 10px;background:#FFFDF6}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var w=document.createElement('div');w.id='sbc';document.body.appendChild(w);
var open=false,log,started=false;
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function add(html,who){var d=document.createElement('div');d.className='m '+who;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight}
function hit(t,k){return new RegExp('(^|[^a-z0-9])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(t)}
function answer(q){var t=q.toLowerCase();for(var i=0;i<FAQ.length;i++){for(var j=0;j<FAQ[i].k.length;j++){if(hit(t,FAQ[i].k[j]))return FAQ[i].a}}
return 'I’m an automated assistant, so I can only answer common questions. For anything else, call <a href="tel:+15614454787">(561) 445-4787</a>, email <a href="mailto:drsusan@drsusanbesman.com">drsusan@drsusanbesman.com</a>, or <a href="'+ALMA+'" target="_blank" rel="noopener">request a consultation</a>.'}
function ask(q){add(esc(q),'me');setTimeout(function(){add(answer(q),'bot')},350)}
function render(){
if(!open){w.innerHTML='<button class="fab" aria-label="Open chat with questions"><i aria-hidden="true">?</i><span class="t">Questions? Ask here</span></button>';w.querySelector('.fab').onclick=function(){open=true;render()};return}
w.innerHTML='<div class="win" role="dialog" aria-label="Frequently asked questions"><div class="hd"><img src="'+root+'assets/sb-emblem.png" alt=""><div><b>Ask Dr. Besman’s Office</b><small>Automated FAQ assistant · not a live person</small></div><button class="x" aria-label="Close chat">×</button></div>'+
'<div class="log"></div><div class="chips">'+CHIPS.map(function(c){return '<button type="button">'+c+'</button>'}).join('')+'</div>'+
'<form><input aria-label="Type your question" placeholder="Type a question…" autocomplete="off"><button type="submit">Send</button></form><div class="ft">Please don’t share health information here. In crisis, call or text 988.</div></div>';
log=w.querySelector('.log');w.querySelector('.x').onclick=function(){open=false;render()};
add('Hi, I’m the automated assistant for Dr. Susan Besman’s practice. Ask a question or tap one below.','bot');
w.querySelectorAll('.chips button').forEach(function(b){b.onclick=function(){ask(b.textContent)}});
var f=w.querySelector('form'),inp=f.querySelector('input');f.onsubmit=function(e){e.preventDefault();var v=inp.value.trim();if(!v)return;inp.value='';ask(v)};inp.focus()}
render();
})();
