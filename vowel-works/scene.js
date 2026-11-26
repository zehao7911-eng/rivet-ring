const view=(()=>{
 const T=THREE, canvas=document.querySelector('canvas'),renderer=new T.WebGLRenderer({canvas,antialias:true}),scene=new T.Scene(),cam=new T.PerspectiveCamera(33,1,.1,40);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.outputEncoding=T.sRGBEncoding;scene.background=new T.Color(0x38706a);
 const mats=new Map();function mesh(p,g,color,x,y,z){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.42,metalness:.22}));const o=new T.Mesh(g,mats.get(color));o.position.set(x,y,z);p.add(o);return o}
 const sphere=new T.SphereGeometry(1,32,20),cube=new T.BoxGeometry(1,1,1);
 function egg(p,c,x,y,z,a,b,d){const o=mesh(p,sphere,c,x,y,z);o.scale.set(a,b,d);return o}
 function box(p,c,x,y,z,a,b,d){const o=mesh(p,cube,c,x,y,z);o.scale.set(a,b,d);return o}
 function group(p,x,y,z){const o=new T.Group();p.add(o);o.position.set(x,y,z);return o}
 const ink=0x20383d, gold=0xc18e54,cream=0xffe7b4,green=0x389c91;
 scene.add(new T.HemisphereLight(0xffedcb,0x819eaa,1.35));for(const [x,y,z,c,i] of [[-3,5,4,0xffe0af,2],[3,2,-1,0x83ffff,1.7]]){const l=new T.DirectionalLight(c,i);l.position.set(x,y,z);scene.add(l)}
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
 let cut=false,focus=0;
 let x=.5,y=.5,open=0,pulse=0,error=0,act=0;function size(){renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);cam.aspect=canvas.clientWidth/canvas.clientHeight;cam.fov=Math.max(34,2*Math.atan(1.37/(5*cam.aspect))*180/Math.PI);cam.updateProjectionMatrix()}size();addEventListener('resize',size);
 function frame(ms){requestAnimationFrame(frame);if(document.hidden)return;const t=ms*.001;pulse*=.94;error*=.954;head.rotation.z=Math.sin(t*2)*.023+error*Math.sin(t*30)*.17;head.rotation.y=(x-.5)*.33;body.position.y=-.03+Math.sin(t*2.5)*.022;mouth.scale.y=.18+open*.11;tongue.position.x=(x-.5)*.44;tongue.position.y=-.34+(1-y)*.17;eyes.forEach((e,i)=>{e.position.x=(i?.32:-.32)+(x-.5)*.11;e.position.z=.66+error*.15;e.scale.y=.115*(.95+.05*Math.cos(t*2))});teeth[4].position.y=-.105-error*.41;teeth[4].rotation.z=error*1.4;brows.forEach((b,i)=>b.rotation.z=(i?1:-1)*(.07+error*.5-pulse*.32));lamp.scale.setScalar(.1+pulse*.035);focus+=((cut?3.7:0)-focus)*.12;jury.rotation.z=cut?Math.sin(t*3)*.045:0;smile.scale.y=.035+Math.abs(Math.sin(t*5))*(cut?.052:0);cam.position.set(focus+Math.sin(t*.42)*.09+act*.05, .64+pulse*.05,5.15-pulse*.14);cam.lookAt(focus,.48,0);renderer.render(scene,cam)}requestAnimationFrame(frame);
 return {judge(v){cut=v},awards(r){badge.visible=r.like;flag.visible=r.comment},pose(a,b,v){x=a;y=b;open=v},hit(good){if(good)pulse=1;else error=1},set(n){act=n;body.children[0].material=new T.MeshStandardMaterial({color:[green,0x477ea9,0x9d617d][n],roughness:.42})}};
})();

