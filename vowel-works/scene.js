function makeStage(){
 const T=THREE, canvas=document.querySelector('canvas'),renderer=new T.WebGLRenderer({canvas,antialias:true}),scene=new T.Scene(),cam=new T.PerspectiveCamera(33,1,.1,40);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.87;scene.background=new T.Color(0x38706a);
 const mats=new Map();function mesh(p,g,color,x,y,z){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color:new T.Color(color).convertSRGBToLinear(),roughness:.42,metalness:.22}));const o=new T.Mesh(g,mats.get(color));o.position.set(x,y,z);p.add(o);return o}
 const sphere=new T.SphereGeometry(1,32,20),cube=new T.BoxGeometry(1,1,1);
 function egg(p,c,x,y,z,a,b,d){const o=mesh(p,sphere,c,x,y,z);o.scale.set(a,b,d);return o}
 function box(p,c,x,y,z,a,b,d){const o=mesh(p,cube,c,x,y,z);o.scale.set(a,b,d);return o}
 function group(p,x,y,z){const o=new T.Group();p.add(o);o.position.set(x,y,z);return o}
 const ink=0x20383d, gold=0xc18e54,cream=0xffe7b4,green=0x389c91;
 scene.add(new T.HemisphereLight(0xffedcb,0x819eaa,1.02));for(const [x,y,z,c,i] of [[-3,5,4,0xffe0af,1.55],[3,2,-1,0x83ffff,1.05]]){const l=new T.DirectionalLight(c,i);l.position.set(x,y,z);scene.add(l)}
 box(scene,0x325952,0,1,-3,13,10,.3);for(let i=-8;i<=8;i++)box(scene,i%2?0x345c55:0x41685e,i*.45,2,-2.7,.33,7,.27);
 for(const side of [-1,1]){box(scene,gold,side*1.8,1,-2.5,.04,7,.04);for(let j=0;j<4;j++)box(scene,0xc98457,side*2.25,2.9-j*.16,-2.35,.67,.055,.04)}
 const body=group(scene,0,-.03,0);egg(body,green,0,-.66,0,.91,.83,.55);box(body,ink,0,-.38,.5,.62,.26,.06);for(let i=0;i<5;i++)box(body,cream,-.21+i*.105,-.38,.55,.05,.08,.03);
 const head=group(body,0,.64,0);egg(head,gold,0,.03,-.05,.84,.92,.61);egg(head,0xf5ae66,0,.06,.04,.79,.86,.63);
 const eyes=[],brows=[];for(const s of [-1,1]){egg(head,ink,s*.83,.09,-.01,.16,.29,.23);egg(head,gold,s*.9,.1,.06,.12,.19,.18);egg(head,cream,s*.32,.28,.53,.255,.23,.15);eyes.push(egg(head,ink,s*.32,.27,.66,.102,.115,.06));egg(head,0xfff9db,s*.32-.027,.31,.714,.026,.028,.01);brows.push(box(head,ink,s*.32,.52,.5,.32,.057,.09))}
 egg(head,gold,0,.05,.68,.16,.115,.12);
 const mouth=egg(head,ink,0,-.23,.58,.44,.235,.12),tongue=egg(head,0xf7787c,0,-.32,.70,.21,.075,.055);
 const teeth=[];for(let i=-2;i<=2;i++)teeth.push(box(head,cream,i*.115,-.105,.686,.103,.093,.055));
 box(head,ink,-.47,.92,.02,.045,.34,.045);const lamp=egg(head,0xff634e,-.47,1.1,.02,.10,.10,.10);
 box(scene,0x875942,0,-1.19,.45,7,.19,2);const mic=group(scene,-.77,-.73,.83);box(mic,ink,0,-.12,0,.045,.65,.045);egg(mic,ink,0,.24,0,.16,.27,.16);for(let j=-2;j<=2;j++)box(mic,gold,0,.24+j*.063,.147,.19,.018,.022);
 const jury=group(scene,3.7,.35,-.2);
 egg(jury,0x43536a,0,-.67,0,.7,.64,.42);
 egg(jury,0xc18a6f,0,.14,0,.53,.66,.47);
 egg(jury,0x413d41,0,.56,-.035,.54,.32,.47);
 egg(jury,0xc18a6f,0,.02,.45,.12,.15,.10);
 for(const s of [-1,1]){
 egg(jury,cream,s*.205,.22,.393,.145,.103,.085);egg(jury,ink,s*.2,.22,.468,.055,.064,.03);
 const rim=mesh(jury,new T.TorusGeometry(.154,.022,7,28),gold,s*.205,.222,.475);rim.scale.y=.77;
 }
 box(jury,gold,0,.24,.485,.12,.023,.025);const smile=egg(jury,ink,0,-.13,.405,.16,.034,.023);
 const clipboard=box(jury,0xc79765,0,-.68,.49,.62,.72,.065);clipboard.rotation.z=.13;
 box(jury,cream,0,-.68,.54,.5,.56,.02);for(let i=0;i<3;i++)box(jury,ink,-.035,-.57-i*.08,.56,.29,.014,.01);
 const badge=egg(mic,gold,0,.08,.14,.07,.055,.025);badge.visible=false;
 const flag=box(mic,0xb45e6e,0,-.035,.035,.22,.14,.12);flag.visible=false;

 const sets=[0,1,2].map(()=>group(scene,0,0,0));
 function placard(parent,x,y,z,text,bg,fg){
  const c=document.createElement('canvas');c.width=512;c.height=128;
  const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,512,128);g.fillStyle=fg;
  g.fillRect(10,9,492,3);g.fillRect(10,116,492,3);g.font='900 60px system-ui';g.textAlign='center';g.fillText(text,256,84);
  const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;
  const panel=new T.Mesh(new T.PlaneGeometry(1.48,.37),new T.MeshBasicMaterial({map:tex}));panel.position.set(x,y,z);parent.add(panel);
 }
 for(const xPos of [0,3.7]){
  placard(sets[0],xPos+.58,2.09,-1.8,'CASTING','#153f43','#ead0a2');
  placard(sets[1],xPos+.58,2.09,-1.8,'ON AIR','#a73935','#ffe4b3');
  placard(sets[2],xPos+.58,2.09,-1.8,'THE LYRIC','#572f49','#f2cf91');
  for(const side of [-1,1]){
   for(let n=0;n<4;n++)box(sets[0],n%2?0x9c8659:0x586e5e,xPos+side*(1.06+n*.09),.62,-1.85,.043,1.75,.04);
   const speaker=box(sets[1],ink,xPos+side*1.03,.65,-1.78,.39,1.08,.28);
   for(const dy of [-.28,.14]){egg(sets[1],gold,speaker.position.x,.65+dy,-1.61,.145,.145,.04);egg(sets[1],ink,speaker.position.x,.65+dy,-1.56,.092,.092,.025)}
   for(let n=0;n<5;n++)egg(sets[2],n%2?0x8f334b:0xb84557,xPos+side*(1.03+n*.13),1.05,-1.75,.17,2.3,.19);
  }
 }
 const trim=group(body,0,0,0);
 for(const side of [-1,1]){
  egg(trim,green,side*.74,-.52,.15,.28,.43,.28);
  egg(trim,gold,side*.82,-.8,.26,.18,.19,.18);
  for(let k=0;k<3;k++)box(head,gold,side*(.55+k*.044),-.18,.48,.018,.11,.032);
  const ear=mesh(head,new T.TorusGeometry(.152,.025,8,24),gold,side*.865,.09,.12);
  ear.rotation.y=side*.7;
 }
 box(body,gold,0,-.32,.53,.62,.018,.03);

 const cart=group(scene,.79,-1.04,.5);
 box(cart,ink,0,0,0,.45,.12,.34);
 for(let k=0;k<3;k++){const knob=mesh(cart,new T.CylinderGeometry(.036,.045,.055,12),k===2?0xe86749:gold,-.13+.13*k,.09,.055)}
 for(const side of [-1,1]){
  for(const v of [.08,-.29]){
   const bolt=mesh(head,new T.CylinderGeometry(.034,.034,.02,6),gold,side*.63,v,.36);bolt.rotation.x=Math.PI/2;
  }
  const rim=mesh(head,new T.TorusGeometry(.105,.024,7,24),ink,side*.64,.03,.40);rim.scale.y=.58;
 }
 const cordPath=new T.CatmullRomCurve3([new T.Vector3(-.77,-.96,.83),new T.Vector3(-.65,-1.07,1.02),new T.Vector3(.16,-1.08,.92),new T.Vector3(.79,-1.04,.60)]);
 mesh(scene,new T.TubeGeometry(cordPath,20,.013,5,false),ink,0,0,0);
 const grille=[];for(let j=0;j<5;j++)grille.push(box(body,0xffc264,-.21+j*.105,-.37,.57,.05,.07,.02));
 let cut=false,focus=0;
 
 let x=.5,y=.5,open=0,pulse=0,error=0,act=0;sets.forEach((set,i)=>set.visible=i===0);function size(){renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);cam.aspect=canvas.clientWidth/canvas.clientHeight;cam.fov=Math.max(34,2*Math.atan(1.37/(5*cam.aspect))*180/Math.PI);cam.updateProjectionMatrix()}size();addEventListener('resize',size);
 function frame(ms){requestAnimationFrame(frame);if(document.hidden)return;const t=ms*.001;pulse*=.94;error*=.954;head.rotation.z=Math.sin(t*2)*.023+error*Math.sin(t*30)*.17;head.rotation.y=(x-.5)*.33;body.position.y=-.03+Math.sin(t*2.5)*.022;const roundness=open*Math.max(0,(x-.48)*1.8);
 mouth.scale.x=.43-roundness*.15;mouth.scale.y=.17+open*(.08+y*.12);
 tongue.scale.x=.21-roundness*.07;
 grille.forEach((bar,i)=>bar.scale.y=.04+open*(.035+.08*Math.abs(Math.sin(t*17+i))));
 tongue.position.x=(x-.5)*.44;tongue.position.y=-.34+(1-y)*.17;eyes.forEach((e,i)=>{e.position.x=(i?.32:-.32)+(x-.5)*.11;e.position.z=.66+error*.15;e.scale.y=.115*(.95+.05*Math.cos(t*2))});teeth[4].position.y=-.105-error*.41;teeth[4].rotation.z=error*1.4;brows.forEach((b,i)=>b.rotation.z=(i?1:-1)*(.07+error*.5-pulse*.32));lamp.scale.setScalar(.1+pulse*.035);focus+=((cut?3.7:0)-focus)*.12;jury.rotation.z=cut?Math.sin(t*3)*.045:0;smile.scale.y=.035+Math.abs(Math.sin(t*5))*(cut?.052:0);cam.position.set(focus+Math.sin(t*.42)*.09+act*.05, .64+pulse*.05,5.15-pulse*.14);cam.lookAt(focus,.48,0);renderer.render(scene,cam)}requestAnimationFrame(frame);
 return {judge(v){cut=v},awards(r){badge.visible=r.like;flag.visible=r.comment},pose(a,b,v){x=a;y=b;open=v},hit(good){if(good)pulse=1;else error=1},set(n){act=n;sets.forEach((set,i)=>set.visible=i===n);if(!body.children[0].userData.unique){body.children[0].material=body.children[0].material.clone();body.children[0].userData.unique=true}body.children[0].material.color.setHex([green,0x477ea9,0x9d617d][n]).convertSRGBToLinear()}};
}