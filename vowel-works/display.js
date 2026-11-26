function createDisplay() {
 const canvas=document.getElementById('stage');
 const still=document.createElement('img');
 still.id='portrait';still.alt='Studio performance';still.hidden=true;canvas.after(still);
 const state={level:0,judge:false,x:.5,y:.5,voicing:false,slip:0};
 let active=null,slipTimer,previous='';
 function showStill(){
  const poses=[[.16,.3],[.5,.77],[.84,.32],[.59,.28]];
  let closest=0,dist=Infinity;
  poses.forEach(([x,y],i)=>{const d=Math.hypot(state.x-x,state.y-y);if(d<dist){dist=d;closest=i}});
  const idx=state.judge?6:state.slip?5:state.voicing?closest+1:0;
  const key=state.level+'-'+idx;if(key===previous)return;
  previous=key;still.src=portraitFrames[key];
 }
 function switchToStill(){
  active=null;canvas.hidden=true;still.hidden=false;showStill();
 }
 try{active=makeStage()}catch{switchToStill()}
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();switchToStill()});
 return {
  judge(value){state.judge=value;if(active)active.judge(value);else showStill()},
  awards(rewards){document.querySelector('main').classList.toggle('gold-mic',!!rewards.like);if(active)active.awards(rewards)},
  pose(x,y,on){Object.assign(state,{x,y,voicing:on});if(active)active.pose(x,y,on);else showStill()},
  hit(ok){if(active){active.hit(ok);return}if(!ok){state.slip=1;clearTimeout(slipTimer);slipTimer=setTimeout(()=>{state.slip=0;showStill()},480)}showStill();still.animate?.([{transform:'translateX(-2px)'},{transform:'translateX(2px)'},{transform:'none'}],{duration:200})},
  set(level){state.level=level;if(active)active.set(level);else showStill()}
 };
}
const view=createDisplay();
