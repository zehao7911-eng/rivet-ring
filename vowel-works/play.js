const $=id=>document.getElementById(id);
const points=[['EE',.16,.3,320,2250],['AH',.5,.77,780,1180],['OO',.84,.32,360,850],['OH',.59,.28,530,980]];
const scenes=[
 {name:'The interview',client:'Casting desk',lines:[['“Tell us your name.”',[0,1]],['“Can you sound human?”',[2,0,1]],['“One last word?”',[1,2,0]]],win:'You got the callback.'},
 {name:'Drive-time radio',client:'FM 106.2',lines:[['“Give us a station jingle.”',[2,3,0]],['“Now the traffic report.”',[1,0,3]],['“Sign off in harmony.”',[3,2,0,1]]],win:'The studio wants an encore.'},
 {name:'Opening night',client:'The Lyric Theatre',lines:[['“Warm up the balcony.”',[3,1,2]],['“Sing to the back row.”',[0,2,3,1]],['“Take the final solo.”',[1,0,3,2,1]]],win:'Standing ovation. The role is yours.'}
];
const key='vowel-works-v1';
function clean(v){return {best:scenes.map((_,i)=>Math.min(3,Math.max(0,Math.floor(+v?.best?.[i]||0)))),rewards:{like:v?.rewards?.like===true,comment:v?.rewards?.comment===true}}}
let profile=clean();try{profile=clean(JSON.parse(localStorage.getItem(key)))}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(profile))}catch{}}
function merge(v,combine){let p=clean(v);if(combine){p.best=p.best.map((n,i)=>Math.max(n,profile.best[i]));for(const k of ['like','comment'])p.rewards[k]||=profile.rewards[k]}profile=p;save();view.awards(p.rewards)}
const sdk=bridge({read:()=>profile,write:merge,changed(e){if(e.type==='reward')$('credits').textContent=e.kind==='like'?'Gold mic badge earned.':'Fan club badge earned.';if(e.type==='support')$('credits').textContent=[e.like?'Like for a gold mic badge.':'',e.comment?'Comment for a fan club badge.':''].filter(Boolean).join(' ')}});
let audio,osc,gain,filters=[],soundfx,requestFX=false;
function arm(){try{if(!audio){audio=new AudioContext();osc=audio.createOscillator();osc.type='sawtooth';gain=audio.createGain();gain.gain.value=0;for(let i=0;i<2;i++){const f=audio.createBiquadFilter();f.type='bandpass';f.Q.value=7;filters.push(f);osc.connect(f);f.connect(gain)}gain.connect(audio.destination);osc.start()}audio.resume().catch(()=>{});if(!requestFX){requestFX=true;import('./vendor/zzfx.js').then(m=>soundfx=m).catch(()=>{})}}catch{}}
function voice(x,y,on){view.pose(x,y,on?1:0);if(!gain)return;const t=audio.currentTime;gain.gain.setTargetAtTime(on?.18:0,t,.024);osc.frequency.setTargetAtTime(110+25*(1-y),t,.04);filters[0].frequency.setTargetAtTime(260+y*660,t,.035);filters[1].frequency.setTargetAtTime(700+(1-x)*1850,t,.035)}
function cue(ok){try{soundfx?.ZZFX.audioContext.resume().catch(()=>{});soundfx?.zzfx(.34,0,ok?650:120,.008,.05,.09,ok?0:3,1,ok?3:-1)}catch{}view.hit(ok)}
const pad=$('pad'),go=$('go');let mode='menu',level=0,line=0,note=0,miss=0,id=null,targetX=.5,targetY=.5;
const unlocked=()=>Math.min(2,profile.best.findIndex(x=>!x)<0?2:profile.best.findIndex(x=>!x));
const marks=points.map(([text,x,y])=>{let el=document.createElement('span');el.textContent=text;el.style.left=x*100+'%';el.style.top=y*100+'%';pad.append(el);return el});
function prompt(){view.judge(false);const sc=scenes[level],seq=sc.lines[line][1];$('title').textContent=sc.name;$('line').textContent=sc.lines[line][0];$('slate').textContent=sc.client.toUpperCase();$('take').textContent='LINE '+(line+1)+' / 3';$('meter').replaceChildren(...seq.map((_,i)=>{let e=document.createElement('i');if(i<note)e.className='lit';return e}));marks.forEach((e,i)=>e.classList.toggle('target',i===seq[note]));$('guide').textContent='Glide to '+points[seq[note]][0]+' · lift to speak';}
function start(){arm();level=mode==='menu'?unlocked():level;line=note=miss=0;mode='play';view.set(level);go.hidden=true;pad.hidden=false;sdk.prepare();sdk.start();prompt()}
function finish(){view.judge(true);mode='result';sdk.end();let stars=miss===0?3:miss<4?2:1;profile.best[level]=Math.max(stars,profile.best[level]);save();sdk.save();pad.hidden=true;go.hidden=false;$('slate').textContent='AUDITION COMPLETE';$('title').textContent=['Callback!','On the air!','Curtain call!'][level];$('line').textContent=scenes[level].win;$('guide').textContent='★'.repeat(stars)+'☆'.repeat(3-stars)+'  ·  '+(miss?miss+' vocal slips':'Flawless take');$('take').textContent='SIGNED';go.textContent=level===2?'Tour again →':'Next studio →'}
go.onclick=()=>{if(mode==='result')level=(level+1)%3;if(mode==='line'){line++;note=0;mode='play';pad.hidden=false;go.hidden=true;prompt()}else start()};
function move(e){const r=pad.getBoundingClientRect();targetX=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));targetY=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));voice(targetX,targetY,true);const cross=$('cross');cross.style.display='block';cross.style.left=targetX*100+'%';cross.style.top=targetY*100+'%'}
function silence(){id=null;voice(targetX,targetY,false);$('cross').style.display='none'}
pad.onpointerdown=e=>{if(mode!=='play'||id!==null)return;id=e.pointerId;pad.setPointerCapture(id);arm();move(e)};
pad.onpointermove=e=>{if(id===e.pointerId)move(e)};
pad.onpointerup=e=>{if(id!==e.pointerId)return;move(e);silence();const seq=scenes[level].lines[line][1],p=points[seq[note]];if(Math.hypot((targetX-p[1])/.18,(targetY-p[2])/.29)>1){miss++;cue(false);$('guide').textContent='Loose tooth! Try '+p[0]+' again.';return}cue(true);note++;if(note<seq.length){prompt();return}if(line===2){finish();return}mode='line';view.judge(true);pad.hidden=true;go.hidden=false;go.textContent='Next line →';$('meter').querySelectorAll('i').forEach(e=>e.className='lit');$('guide').textContent=[['“That sounded almost natural.”','The panel exchanges a nod.'],['The ON AIR light flickers.','The producer turns you up.'],['A hush falls over the hall.','Someone in the balcony cheers.']][level][line]};
pad.onpointercancel=silence;addEventListener('blur',silence);addEventListener('pagehide',()=>{silence();save();sdk.stop()});if(unlocked())go.textContent='Resume auditions →';

view.awards(profile.rewards);
