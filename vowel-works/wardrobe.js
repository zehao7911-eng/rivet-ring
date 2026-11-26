// Stage wardrobe and the casting director's mechanical cue paddle.
function dressStudio({T,head,body,jury,mic,ink,gold,cream,group,mesh,box,egg}){
 const outfits=[0,1,2].map(()=>group(head,0,0,0));
 const collars=[0,1,2].map(()=>group(body,0,0,0));
 const torus=new T.TorusGeometry(1,.10,8,40);
 function band(parent,color,x,y,z,rx,ry){
  const m=mesh(parent,torus,color,x,y,z);m.scale.set(rx,ry,Math.min(rx,ry));return m;
 }
 function cable(parent,color,positions,radius){
  const path=new T.CatmullRomCurve3(positions.map(p=>new T.Vector3(...p)));
  return mesh(parent,new T.TubeGeometry(path,18,radius,6,false),color,0,0,0);
 }
 // Narrow lens seats and moving eyelids give the eyes a readable silhouette.
 const lids=[];
 for(const s of [-1,1]){
  band(head,0x87674a,s*.32,.28,.54,.26,.23);
  lids.push(egg(head,0xf6b970,s*.32,.485,.57,.235,.03,.10));
 }
 const lip=band(head,0xbd704c,0,-.235,.594,.43,.22);
 for(let i=0;i<3;i++)band(head,0x725440,-.47,.90+i*.064,.02,.046,.025).rotation.x=Math.PI/2;
 // Audition cap with stitched panels, visor and brass button.
 egg(outfits[0],0x286456,0,.73,-.01,.655,.29,.51);
 egg(outfits[0],0x204d46,0,.69,.37,.64,.052,.42);
 egg(outfits[0],gold,0,1.024,-.02,.05,.033,.052);
 for(const s of [-1,1])cable(outfits[0],0x638579,[[s*.49,.78,.30],[s*.36,.91,.29],[0,1.018,0]],.012);
 // Padded broadcast cans, ribbed headband and boom microphone.
 cable(outfits[1],ink,[[-.82,.13,0],[-.78,.66,0],[-.4,.94,0],[0,1,0],[.4,.94,0],[.78,.66,0],[.82,.13,0]],.074);
 for(const s of [-1,1]){
  egg(outfits[1],0x283944,s*.865,.16,0,.147,.32,.25);
  egg(outfits[1],0xaa603d,s*.95,.16,.015,.095,.24,.20);
  for(let i=0;i<3;i++)box(outfits[1],gold,s*.98,.08+i*.075,.157,.045,.028,.055);
 }
 cable(outfits[1],ink,[[.85,.06,.14],[.83,-.16,.27],[.65,-.29,.49],[.48,-.30,.70]],.027);
 egg(outfits[1],ink,.47,-.30,.70,.09,.062,.055);
 // Stage hat has a flared brim and contrasting grosgrain ribbon.
 const hat=group(outfits[2],.04,.79,-.025);hat.rotation.z=-.10;
 egg(hat,ink,0,0,.02,.71,.068,.58);
 mesh(hat,new T.CylinderGeometry(.43,.39,.39,40),0x35303f,0,.21,0);
 mesh(hat,new T.CylinderGeometry(.405,.398,.09,40),0xb44559,0,.085,0);
 for(const s of [-1,1]){const wing=egg(collars[2],0x9b344b,s*.15,-.22,.48,.18,.095,.07);wing.rotation.z=s*.30}
 egg(collars[2],gold,0,-.22,.55,.065,.061,.055);
 const tie=box(collars[0],0xad6141,0,-.71,.55,.096,.24,.036);tie.rotation.z=-.08;
 // Swing the cue paddle up only when the director is reacting.
 const arm=group(jury,.49,-.58,.12);
 egg(arm,0x43536a,.06,.06,.03,.17,.26,.17);
 box(arm,gold,.10,.36,.12,.036,.54,.036);
 const board=box(arm,ink,.10,.67,.13,.50,.38,.05);
 const lights=[-1,0,1].map(i=>egg(arm,0x83dbab,.10+.125*i,.67,.17,.045,.053,.025));
 for(let i=0;i<2;i++)box(arm,gold,.1,.67+(i?.15:-.15),.166,.44,.012,.01);
 // Ribbon microphone yoke, dual knuckles and die-cast foot.
 cable(mic,gold,[[-.20,.29,0],[-.2,.075,0],[0,-.025,0],[.2,.075,0],[.2,.29,0]],.024);
 for(const s of [-1,1])egg(mic,cream,s*.20,.25,.03,.037,.044,.03);
 egg(mic,ink,0,-.37,0,.23,.033,.16);
 let wanted=0,armAngle=-1.25;
 function stage(n){outfits.forEach((m,i)=>m.visible=i===n);collars.forEach((m,i)=>m.visible=i===n)}
 stage(0);
 return {stage, verdict(clean){wanted=clean?3:2;lights.forEach((m,i)=>m.visible=i<wanted)},
 update(t,cut,open,y,pulse){
  const blink=Math.pow(Math.max(0,Math.cos(t*1.33)),100);
  for(const lid of lids){lid.scale.y=.03+blink*.135;lid.position.y=.485-.12*blink}
  lip.scale.y=.18+open*(.065+y*.105);
  const angle=cut?-.16+Math.sin(t*4.5)*.12:-1.25;
  armAngle+=(angle-armAngle)*.12;arm.rotation.z=armAngle;
  hat.rotation.x=.05*Math.sin(t*1.8)+.11*pulse;
 }};
}
