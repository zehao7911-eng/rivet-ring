// A take contains control-pad gestures only. Store timing and pitch locally in memory.
function takeRecorder({sound,pose,highlight,onStop}){
 let phrase=[],stroke=null,started=0,lastStamp=0,frame=0,playing=false;
 function capture(x,y){
  if(!stroke)return;
  const elapsed=Math.min(900,performance.now()-started);
  if(stroke.length&&elapsed-lastStamp<45)return;
  lastStamp=elapsed;
  stroke.push({ms:elapsed,x,y});
 }
 function begin(x,y){stroke=[];started=performance.now();lastStamp=-100;capture(x,y)}
 function keep(vowel,x,y){
  const duration=Math.max(150,Math.min(900,performance.now()-started));
  const samples=stroke?.length?stroke.slice():[];
  samples.push({ms:duration,x,y});phrase.push({vowel,duration,samples});stroke=null;
 }
 function stop(){
  if(!playing)return;
  playing=false;cancelAnimationFrame(frame);sound(.5,.5,false);pose(.5,.5,0);highlight(-1);onStop();
 }
 function listen(){
  if(!phrase.length)return;
  if(playing){stop();return}
  const take=phrase.slice();const began=performance.now();playing=true;
  function tick(now){
   let time=now-began;
   for(let i=0;i<take.length;i++){
    const item=take[i];
    if(time<item.duration){
     const p=item.samples.find(v=>v.ms>=time)||item.samples[item.samples.length-1];
     sound(p.x,p.y,true);highlight(i);frame=requestAnimationFrame(tick);return;
    }
    if(time<item.duration+110){sound(.5,.5,false);highlight(-1);frame=requestAnimationFrame(tick);return}
    time-=item.duration+110;
   }
   stop();
  }
  frame=requestAnimationFrame(tick);
 }
 return {begin,capture,keep,listen,stop,clear(){stop();phrase=[];stroke=null},get count(){return phrase.length},get playing(){return playing}};
}
