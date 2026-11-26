import {bridge} from './sdk.mjs';
const T=THREE,$=s=>document.querySelector(s),canvas=$('canvas'),key='rivet-ring-v1';
const clean=p=>({tier:Math.max(0,Math.min(4,Math.floor(+p?.tier||0))),wins:Math.max(0,Math.floor(+p?.wins||0)),rewards:{like:p?.rewards?.like===true,comment:p?.rewards?.comment===true}});
let profile=clean();try{profile=clean(JSON.parse(localStorage.getItem(key)));}catch{}
function persist(){try{localStorage.setItem(key,JSON.stringify(profile));}catch{}}
const sdk=bridge({read:()=>profile,write:(p,merge)=>{const q=clean(p);if(merge){q.tier=Math.max(q.tier,profile.tier);q.wins=Math.max(q.wins,profile.wins);q.rewards.like||=profile.rewards.like;q.rewards.comment||=profile.rewards.comment;}profile=q;persist();}});
const S=new T.Scene(),cam=new T.PerspectiveCamera(39,1,.1,80);
let R;try{R=new T.WebGLRenderer({canvas,antialias:true});}catch{$('p').textContent='WebGL is required to enter the ring.';throw Error('WebGL unavailable');}
R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;
S.background=new T.Color('#425567');S.fog=new T.FogExp2('#526576',.043);
S.add(new T.HemisphereLight('#fff1c7','#748c99',1.25));const sun=new T.DirectionalLight('#ffe6ba',2.3);sun.position.set(-6,10,5);S.add(sun);
const cache=new Map(),C=new T.BoxGeometry(),B=new T.SphereGeometry(1,20,12),D=new T.CylinderGeometry(1,1,1,48),metal='#b78858',dark='#29363c',cream='#ffe3a3';
function part(p,g,c,x,y,z,a,b,d){if(!cache.has(c))cache.set(c,new T.MeshStandardMaterial({color:c,metalness:c===metal?.58:.13,roughness:c===metal?.32:.52}));const m=new T.Mesh(g,cache.get(c));m.position.set(x,y,z);m.scale.set(a,b,d);p.add(m);return m;}
const box=(...v)=>part(v[0],C,...v.slice(1)),ball=(...v)=>part(v[0],B,...v.slice(1)),disc=(...v)=>part(v[0],D,...v.slice(1));
function hoop(p,c,x,y,z,r,t){const o=part(p,new T.TorusGeometry(r,t,8,72),c,x,y,z,1,1,1);o.rotation.x=Math.PI/2;return o;}
const arena=disc(S,'#455e63',0,-.26,0,4,.52,4);
hoop(S,metal,0,.012,0,3.94,.064);hoop(S,cream,0,.014,0,3.52,.022);hoop(S,'#8eaaa6',0,.012,0,1.12,.023);
for(let i=0;i<48;i++){const a=i*Math.PI/24;const mark=box(S,i%4?metal:cream,Math.sin(a)*3.76,.022,Math.cos(a)*3.76,i%4?.032:.077,.022,.17);mark.rotation.y=a;}
disc(S,dark,0,-.66,0,3.78,.4,3.78);box(S,'#535559',0,-1.35,0,32,.4,32);
for(let i=-4;i<=4;i++){const x=i*2;box(S,'#5d7180',x,1,-7,1.95,4.7,.32);box(S,metal,x,2.6,-6.79,1.69,.17,.15);for(let j=0;j<4;j++)box(S,dark,x,.68+j*.19,-6.78,1.25,.065,.08);}
for(const x of [-5.7,5.7]){box(S,dark,x,1,-1,.32,5,.32);for(let j=0;j<4;j++){const m=box(S,'#d99c53',x,1.15+j*.36,-.79,.33,.15,.06);m.rotation.z=.32;}ball(S,cream,x,3.75,-1,.38,.2,.38);}
function bot(c,rival){
 const root=new T.Group();S.add(root);
 const shadow=disc(root,'#344d52',0,.02,0,.64,.013,.77);
 // Bevelled one-piece enamel shell. Its tapered nose is also the ram.
 const outline=new T.Shape();outline.moveTo(-.42,-.72);outline.lineTo(.42,-.72);outline.lineTo(.56,-.4);outline.lineTo(.48,.48);outline.lineTo(.28,.68);outline.lineTo(-.28,.68);outline.lineTo(-.48,.48);outline.lineTo(-.56,-.4);outline.closePath();
 const shell=part(root,new T.ExtrudeGeometry(outline,{depth:.24,bevelEnabled:true,bevelSize:.065,bevelThickness:.07,bevelSegments:3}),c,0,.24,0,1,1,1);shell.rotation.x=-Math.PI/2;
 for(const s of [-1,1]){box(root,dark,s*.57,.24,0,.23,.33,1.15);
 for(let i=0;i<7;i++)box(root,'#586064',s*.57,.413,-.47+i*.15,.245,.04,.07);
 for(const z of [-.38,0,.38]){const w=disc(root,metal,s*.695,.24,z,.13,.04,.13);w.rotation.z=Math.PI/2;}
 box(root,cream,s*.37,.52,.21,.045,.014,.63);ball(root,metal,s*.34,.535,-.35,.045,.023,.045);}
 const face=box(root,dark,0,.64,.19,.68,.28,.42);for(const s of [-1,1])ball(root,'#abfff2',s*.16,.65,.407,.082,.045,.02);
 if(rival){for(const s of [-1,1]){const horn=part(root,new T.ConeGeometry(.13,.47,10),cream,s*.29,.88,.17,1,1,1);horn.rotation.z=-s*.3;}}
 else{disc(root,c,0,.81,.16,.33,.085,.3);const aerial=box(root,metal,-.27,.92,-.17,.026,.4,.026);ball(root,cream,-.27,1.13,-.17,.064,.064,.064);}
 for(const s of [-1,1]){const fork=box(root,metal,s*.29,.18,.76,.19,.13,.46);fork.rotation.x=.13;}
 return {root,x:0,z:0,vx:0,vz:0,a:0,shadow,shell};
}
const me=bot('#238d85',false),foe=bot('#c75746',true),names=['Copper Kid','Sidewinder','Iron Finch','Red Comet','The Foreman'];
let mode='menu',age=0,clock=0,hold=null,dx=0,dz=-1,charge=0,aiTimer=0,locked=false,hitCD=0,dash=0,loser=null,tier=0,audio;
function tone(f){try{audio??=new AudioContext();audio.resume().catch(()=>{});const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.type='triangle';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.55,t+.14);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.19);o.connect(g);g.connect(audio.destination);o.start();o.stop(t+.2);}catch{}}
function reset(){Object.assign(me,{x:0,z:1.65,vx:0,vz:0,a:Math.PI});Object.assign(foe,{x:0,z:-1.65,vx:0,vz:0,a:0});for(const b of [me,foe])b.root.rotation.set(0,0,0);}
function start(){reset();tier=profile.tier;mode='intro';age=0;aiTimer=.9;locked=false;hold=null;dx=0;dz=-1;charge=dash=hitCD=0;loser=null;$('section').hidden=true;$('footer').hidden=false;$('#badge').textContent=names[tier];$('#score').textContent='Wins '+profile.wins;$('aside').textContent='Face off';sdk.prepare();sdk.start();tone(440);}
$('button').onclick=start;
canvas.onpointerdown=e=>{if(mode!=='fight'||hold)return;hold={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);charge=0;};
canvas.onpointermove=e=>{if(hold?.id!==e.pointerId)return;const x=e.clientX-hold.x,z=e.clientY-hold.y,n=Math.hypot(x,z);if(n>5){dx=x/n;dz=z/n;}};
canvas.onpointerup=e=>{if(hold?.id!==e.pointerId)return;hold=null;me.vx+=dx*(4+charge*2.4);me.vz+=dz*(4+charge*2.4);dash=.43;tone(245);};
canvas.onpointercancel=()=>hold=null;
function ringOut(b){mode='out';age=0;hold=null;loser=b;sdk.end();const win=b===foe;if(win){profile.wins++;profile.tier=Math.min(4,tier+1);persist();sdk.save();}tone(win?720:170);$('footer').hidden=true;$('aside').textContent=win?'RING OUT!':'OVER THE RIM';}
function fight(dt){
 hitCD-=dt;dash-=dt;aiTimer-=dt;
 const clamp=(v,l,h)=>Math.min(h,Math.max(l,v));
 if(hold){charge=Math.min(1,charge+dt*1.6);me.vx+=dx*dt*7;me.vz+=dz*dt*7;me.a=Math.atan2(dx,dz);}
 // Port of RamFire.onScannedBot: acquire bearing, face target, drive beyond its current position.
 if(aiTimer<=0){if(!locked){foe.a=Math.atan2(me.x-foe.x,me.z-foe.z);locked=true;aiTimer=.55;foe.shell.material.emissive.setHex(0x43160a);}
 else{const drive=Math.min(5+tier*.3,Math.hypot(me.x-foe.x,me.z-foe.z)+1.5);foe.vx+=Math.sin(foe.a)*drive;foe.vz+=Math.cos(foe.a)*drive;aiTimer=1.0-tier*.08;locked=false;foe.shell.material.emissive.setHex(0);}}
 for(const b of [me,foe]){const drag=Math.exp(-dt*(b===me&&dash>0?1.45:2.1));b.vx*=drag;b.vz*=drag;b.x+=b.vx*dt;b.z+=b.vz*dt;}
 let x=foe.x-me.x,z=foe.z-me.z,d=Math.max(.001,Math.hypot(x,z));
 if(d<1.25){x/=d;z/=d;const dep=(1.25-d)*.5;me.x-=x*dep;me.z-=z*dep;foe.x+=x*dep;foe.z+=z*dep;
 const rel=(me.vx-foe.vx)*x+(me.vz-foe.vz)*z;
 if(rel>0){const impulse=rel*.72;me.vx-=x*impulse;me.vz-=z*impulse;foe.vx+=x*impulse;foe.vz+=z*impulse;
 if(dash>0){const flank=1-Math.abs(x*Math.sin(foe.a)+z*Math.cos(foe.a));foe.vx+=x*(2+flank*2.8);foe.vz+=z*(2+flank*2.8);dash=0;}
 if(hitCD<=0){tone(150+clamp(rel,0,8)*33);hitCD=.27;aiTimer=Math.min(aiTimer,.32);}}}
 for(const b of [foe,me])if(Math.hypot(b.x,b.z)>3.89){ringOut(b);break;}
}
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.04,(now-prev)/1000);prev=now;if(document.hidden)return;age+=dt;clock+=dt;
 if(mode==='intro'&&age>.95){mode='fight';age=0;$('aside').textContent='';}
 if(mode==='fight')fight(dt);
 if(mode==='out'&&age>1.3){mode='result';$('section').hidden=false;$('h1').textContent=loser===foe?'Ring champion':'Back to the pit';$('p').textContent=loser===foe?'Clean push. '+profile.wins+' career wins.':'Try a side hit while the rival is charging.';$('button').textContent=loser===foe?'NEXT BOUT':'REMATCH';}
 for(const b of [me,foe]){const fall=b===loser?Math.min(age,1.3):0;b.root.position.set(b.x*(1+fall*.18),-.01-2.4*fall*fall,b.z*(1+fall*.18));b.root.rotation.set(fall*2.3,b.a,fall*.8);b.shadow.visible=!fall;}
 const close=mode==='menu'||mode==='intro',out=mode==='out'||mode==='result';const focus=out?loser:me;
 const cameraTarget=close?new T.Vector3(2.5,2.9,7.1):out?new T.Vector3(focus.x*.55,5.5,focus.z*.4+8):new T.Vector3(0,13,9.6);
 cam.position.lerp(cameraTarget,1-Math.exp(-dt*5));cam.lookAt(close?0:out?focus.x*.65:0,close?.36:0,close?.85:out?focus.z*.6:0);R.render(S,cam);}
let prev=performance.now();reset();cam.position.set(2.5,2.9,7.1);function resize(){R.setSize(canvas.clientWidth,canvas.clientHeight,false);cam.aspect=canvas.clientWidth/canvas.clientHeight;cam.updateProjectionMatrix();}resize();addEventListener('resize',resize);addEventListener('pagehide',()=>{sdk.stop();persist();});requestAnimationFrame(frame);
