const $=id=>document.getElementById(id);
const points=[['EE',.16,.3,320,2250],['AH',.5,.77,780,1180],['OO',.84,.32,360,850],['OH',.59,.28,530,980]];
const scenes=[
 {name:'The interview',client:'Casting desk',lines:[['“Tell us your name.”',[0,1]],['“Can you sound human?”',[2,0,1]],['“One last word?”',[1,2,0]]],win:'You got the callback.'},
 {name:'Drive-time radio',client:'FM 106.2',lines:[['“Give us a station jingle.”',[2,3,0]],['“Now the traffic report.”',[1,0,3]],['“Sign off in harmony.”',[3,2,0,1]]],win:'The studio wants an encore.'},
 {name:'Opening night',client:'The Lyric Theatre',lines:[['“Warm up the balcony.”',[3,1,2]],['“Sing to the back row.”',[0,2,3,1]],['“Take the final solo.”',[1,0,3,2,1]]],win:'Standing ovation. The role is yours.'}
];
const key='vowel-works-v1';
function clean(v){return {seals:scenes.map((_,i)=>v?.seals?.[i]===true),best:scenes.map((_,i)=>Math.min(3,Math.max(0,Math.floor(+v?.best?.[i]||0)))),rewards:{like:v?.rewards?.like===true,comment:v?.rewards?.comment===true}}}
let profile=clean();try{profile=clean(JSON.parse(localStorage.getItem(key)))}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(profile))}catch{}}
function merge(v,combine){let p=clean(v);if(combine){p.seals=p.seals.map((yes,i)=>yes||profile.seals[i]);p.best=p.best.map((n,i)=>Math.max(n,profile.best[i]));for(const k of ['like','comment'])p.rewards[k]||=profile.rewards[k]}profile=p;save();view.awards(p.rewards)}
const sdk=bridge({read:()=>profile,write:merge,changed(e){if(e.type==='reward')$('credits').textContent=e.kind==='like'?'Gold mic badge earned.':'Fan club badge earned.';if(e.type==='support')$('credits').textContent=[e.like?'Like for a gold mic badge.':'',e.comment?'Comment for a fan club badge.':''].filter(Boolean).join(' ')}});
let audio,osc,gain,vibrato,filters=[],soundfx,requestFX=false;
function arm(){try{if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();osc=audio.createOscillator();osc.type='sawtooth';const lfo=audio.createOscillator();lfo.frequency.value=5.3;vibrato=audio.createGain();vibrato.gain.value=0;lfo.connect(vibrato);vibrato.connect(osc.frequency);lfo.start();gain=audio.createGain();gain.gain.value=0;for(let i=0;i<2;i++){const f=audio.createBiquadFilter();f.type='bandpass';f.Q.value=7;filters.push(f);osc.connect(f);f.connect(gain)}gain.connect(audio.destination);osc.start()}audio.resume().catch(()=>{});if(!requestFX){requestFX=true;soundfx=makeEffects(audio)}}catch{}}
function voice(x,y,on){view.pose(x,y,on?1:0);if(!gain)return;const t=audio.currentTime;gain.gain.setTargetAtTime(on?.18:0,t,.024);vibrato.gain.setTargetAtTime(on&&level===2?4.8:.45,t,.10);
 const pitch=[114,137,164][level];osc.frequency.setTargetAtTime(pitch+(1-y)*36,t,.035);
 let sum=0,first=0,second=0;
 for(const [,px,py,f1,f2] of points){const w=1/(.0008+(x-px)**2+(y-py)**2);sum+=w;first+=f1*w;second+=f2*w}
 filters[0].frequency.setTargetAtTime(first/sum,t,.03);filters[1].frequency.setTargetAtTime(second/sum,t,.03)}
function cue(ok){
 const panel=$('pad');
 panel.animate?.(ok?[{boxShadow:'inset 0 0 0 2px #a4e6bc'},{boxShadow:'inset 0 0 0 0 transparent'}]:[{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'none'}],{duration:220});
try{soundfx?.ZZFX.audioContext.resume().catch(()=>{});soundfx?.zzfx(.34,0,ok?650:120,.008,.05,.09,ok?0:3,1,ok?3:-1)}catch{}view.hit(ok)}
const pad=$('pad'),go=$('go');let mode='menu',level=0,line=0,note=0,miss=0,id=null,targetX=.5,targetY=.5;
let lineMiss=0,breaths=0,sealed=0,selected=null;
const tape=takeRecorder({sound:voice,pose:(x,y,v)=>view.pose(x,y,v),
 highlight(i){Array.from($('meter').children).forEach((el,n)=>el.classList.toggle('sounding',n===i))},
 onStop(){view.judge(mode==='line'||mode==='result',lineMiss===0);$('listen').textContent='▶ Take'}
});
function updatePressing(){const el=$('pressing');el.textContent='✦'.repeat(sealed)+'◇'.repeat(3-sealed);el.title='Three clean lines earn a gold pressing.'}
function resetLine(){
 tape.clear();lineMiss=0;breaths=0;$('listen').hidden=true;$('passes').hidden=true;
}
function castMenu(){
 const list=$('passes');list.replaceChildren();list.hidden=profile.best.every(v=>!v);
 ['Desk','Radio','Theatre'].forEach((label,i)=>{
  const b=document.createElement('button');b.setAttribute('aria-label',label+' audition');b.type='button';b.disabled=i>unlocked();
  b.textContent=(profile.seals[i]?'✦ ':profile.best[i]?'★ ':'')+label;
  b.setAttribute('aria-pressed',String((selected??unlocked())===i));
  b.onclick=()=>{selected=i;view.judge(false);view.set(i);go.textContent='Play '+label+' →';castMenu()};
  list.append(b);
 });
}
$('listen').onclick=()=>{
 if(!tape.playing){arm();view.judge(false);$('listen').textContent='■ Stop'}
 tape.listen();
};
const unlocked=()=>Math.min(2,profile.best.findIndex(x=>!x)<0?2:profile.best.findIndex(x=>!x));
const marks=points.map(([text,x,y])=>{let el=document.createElement('span');el.textContent=text;el.style.left=x*100+'%';el.style.top=y*100+'%';pad.append(el);return el});
function prompt(){updatePressing();view.judge(false);const sc=scenes[level],seq=sc.lines[line][1];$('title').textContent=sc.name;$('line').textContent=sc.lines[line][0];$('slate').textContent=sc.client.toUpperCase();$('take').textContent='LINE '+(line+1)+' / 3';$('meter').replaceChildren(...seq.map((_,i)=>{let e=document.createElement('i');e.textContent=points[seq[i]][0];e.className=i<note?'lit':i===note?'now':'';return e}));marks.forEach((e,i)=>e.classList.toggle('target',i===seq[note]));$('guide').textContent=level===1?'Hold '+points[seq[note]][0]+' until the strip fills, then lift.':level===2?'Glide through the lit vowels in one breath.':'Touch '+points[seq[note]][0]+' and lift to speak.';$('signal').hidden=false;}
function start(){arm();level=selected??(mode==='menu'?unlocked():level);selected=null;resetLine();sealed=0;line=note=miss=0;mode='play';view.set(level);go.hidden=true;pad.hidden=false;sdk.prepare();sdk.start();prompt()}
function finish(){$('signal').hidden=true;view.judge(true);mode='result';sdk.end();let stars=miss===0?3:miss<4?2:1;if(sealed===3)profile.seals[level]=true;profile.best[level]=Math.max(stars,profile.best[level]);save();sdk.save();pad.hidden=true;go.hidden=false;$('slate').textContent='AUDITION COMPLETE';$('title').textContent=['Callback!','On the air!','Curtain call!'][level];$('line').textContent=scenes[level].win;$('guide').textContent='★'.repeat(stars)+'☆'.repeat(3-stars)+'  ·  '+(miss?miss+' vocal slips':'Flawless take')+(sealed===3?' · Gold pressing!':'');$('take').textContent='SIGNED';go.textContent=level===2?'Tour again →':'Next studio →';castMenu()}
let buttonPressed=false;go.onpointerdown=()=>{buttonPressed=true};go.onpointercancel=()=>{buttonPressed=false};go.onclick=e=>{if(e.detail>0&&!buttonPressed)return;buttonPressed=false;if(mode==='result')level=(level+1)%3;if(mode==='line'){resetLine();line++;note=0;mode='play';pad.hidden=false;go.hidden=true;prompt()}else start()};
function move(e){const r=pad.getBoundingClientRect();targetX=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));targetY=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));if(!zone())inZoneSince=0;else if(!inZoneSince)inZoneSince=performance.now();voice(targetX,targetY,true);tape.capture(targetX,targetY);const cross=$('cross');cross.style.display='block';cross.style.left=targetX*100+'%';cross.style.top=targetY*100+'%'}
let inZoneSince=0,frameToken=0,armed=true;
function zone(){
 const target=points[scenes[level].lines[line][1][note]];
 return Math.hypot((targetX-target[1])/.18,(targetY-target[2])/.29)<=1;
}
function tracking(t){
 if(id===null||mode!=='play')return;
 const inside=zone(),duration=level===1?330:level===2?210:100;
 if(inside&&!inZoneSince)inZoneSince=t;
 if(!inside){inZoneSince=0;armed=true}
 const amount=inside?Math.min(1,(t-inZoneSince)/duration):0;
 $('signal').style.transform='scaleX('+amount+')';
 marks.forEach(m=>m.classList.toggle('tuned',inside&&m.classList.contains('target')));
 if(level===2&&armed&&amount===1){
  armed=false;commit();inZoneSince=0;
  if(mode!=='play'){silence();return}
 }
 frameToken=requestAnimationFrame(tracking);
}
function silence(){cancelAnimationFrame(frameToken);inZoneSince=0;armed=true;id=null;$('signal').style.transform='scaleX(0)';marks.forEach(m=>m.classList.remove('tuned'));voice(targetX,targetY,false);$('cross').style.display='none'}
pad.onpointerdown=e=>{if(mode!=='play'||id!==null)return;e.preventDefault();buttonPressed=false;id=e.pointerId;try{pad.setPointerCapture?.(id)}catch{}arm();move(e);breaths++;tape.begin(targetX,targetY);inZoneSince=zone()?performance.now():0;armed=true;frameToken=requestAnimationFrame(tracking)};
pad.onpointermove=e=>{if(id===e.pointerId)move(e)};
function commit(){const seq=scenes[level].lines[line][1],p=points[seq[note]];if(Math.hypot((targetX-p[1])/.18,(targetY-p[2])/.29)>1){miss++;lineMiss++;cue(false);$('guide').textContent='Loose tooth! Try '+p[0]+' again.';return}tape.keep(seq[note],targetX,targetY);cue(true);note++;if(note<seq.length){prompt();if(level===2)tape.begin(targetX,targetY);return}
 const stamp=lineMiss===0&&(level!==2||breaths===1);if(stamp)sealed++;updatePressing();
 $('listen').hidden=false;$('listen').textContent='▶ Take';if(line===2){finish();return}mode='line';$('signal').hidden=true;view.judge(true,lineMiss===0);pad.hidden=true;go.hidden=false;go.textContent='Next line →';$('slate').textContent=stamp?'DIRECTOR · CLEAN TAKE':'DIRECTOR · PRINT IT';$('meter').querySelectorAll('i').forEach(e=>e.className='lit');$('guide').textContent=[['“That sounded almost natural.”','The panel exchanges a nod.'],['The ON AIR light flickers.','The producer turns you up.'],['A hush falls over the hall.','Someone in the balcony cheers.']][level][line]};
pad.onpointerup=e=>{
 if(id!==e.pointerId)return;
 move(e);
 const short=level===1&&zone()&&(!inZoneSince||performance.now()-inZoneSince<310);
 const glided=level===2&&!armed;
 silence();
 if(short){$('guide').textContent='Hold the vowel a little longer, then lift.';return}
 if(level===2&&!glided&&zone()){$('guide').textContent='Stay on the light until it rings. Then glide.';return}
 if(!glided)commit();
};
pad.onpointercancel=silence;pad.onlostpointercapture=()=>{if(id!==null)silence()};
document.addEventListener('visibilitychange',()=>{if(document.hidden){silence();tape.stop()}});addEventListener('blur',silence);addEventListener('pagehide',()=>{silence();save();sdk.stop()});if(unlocked())go.textContent='Resume auditions →';

view.awards(profile.rewards);castMenu();

