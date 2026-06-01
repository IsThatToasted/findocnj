import {toMin,toTime,fmtRange,fmtTime,uid} from './utils.js';

export class Planner{
 constructor({activities,plans,state,onChange}){
  this.activities=activities;
  this.byId=Object.fromEntries(activities.map(a=>[a.id,a]));
  this.plans=plans;
  this.state=state;
  this.onChange=onChange;
  this.selectedDay=state.selectedDay||0;
 }
 init(){
  if(!this.state.mode)this.state.mode='family';
  if(!this.state.weather)this.state.weather='sunny';
  if(!this.state.days){this.resetAll(false)}
  else this.normalizeAll(false);
 }
 basePlan(mode=this.state.mode,weather=this.state.weather){
  let base=this.plans?.[mode]?.[weather];
  if(!base||!base.length)base=this.plans?.[mode]?.sunny||[];
  return JSON.parse(JSON.stringify(base));
 }
 normalizeBlock(block){
  const a=this.byId[block.activity];
  if(!a||!a.modes.includes(this.state.mode)||!a.weather.includes(this.state.weather)){
   const alt=this.bestAlternative(a||{},block.time,this.state.weather);
   if(alt){ block.activity=alt.id; block.duration=block.duration||alt.duration; }
  }
  return block;
 }
 normalizeAll(save=true){
  (this.state.days||[]).forEach(day=>day.forEach(b=>this.normalizeBlock(b)));
  if(save)this.changed();
 }
 resetAll(save=true){
  this.state.days=this.basePlan().map(day=>day.map(b=>this.normalizeBlock({...b,id:uid()})));
  if(save)this.changed();
 }
 resetDay(day=this.selectedDay){
  this.state.days[day]=this.basePlan()[day].map(b=>this.normalizeBlock({...b,id:uid()}));
  this.changed();
 }
 setMode(mode){this.state.mode=mode;this.resetAll();}
 setWeather(weather){this.state.weather=weather;this.resetAll();}
 weatherSwap(){this.normalizeAll(true);}
 activityFitsTime(a,start,duration=60){
  if(!a?.open||!a?.close)return true;
  const s=toMin(start), e=s+Number(duration||a.duration||60), open=toMin(a.open), close=toMin(a.close);
  return s>=open && e<=close;
 }
 bestAlternative(oldAct,start,weather){
  const mode=this.state.mode;
  const oldCat=oldAct?.category;
  const m=toMin(start||'12:00');
  const pool=this.activities.filter(a=>a.weather.includes(weather)&&a.modes.includes(mode));
  const scored=pool.map(a=>{
   let score=0;
   if(oldCat&&a.category===oldCat)score+=80;
   if(this.activityFitsTime(a,start,a.duration))score+=60;
   score-=Math.abs(toMin(a.bestStart||start)-m)/20;
   if(a.tags?.includes('reset')&&m>=720&&m<=930)score+=20;
   return {a,score};
  }).sort((x,y)=>y.score-x.score);
  return scored[0]?.a;
 }
 addBlock(){
  const day=this.state.days[this.selectedDay];
  const last=day[day.length-1];
  const time=last?toTime(toMin(last.time)+Number(last.duration)+15):'09:00';
  const activity=this.suggestActivity(time)?.id||this.activities.find(a=>a.weather.includes(this.state.weather)&&a.modes.includes(this.state.mode))?.id||this.activities[0].id;
  day.push({id:uid(),time,duration:this.byId[activity].duration,activity});
  this.changed();
 }
 removeBlock(id){this.state.days[this.selectedDay]=this.state.days[this.selectedDay].filter(b=>b.id!==id);this.changed();}
 updateBlock(id,patch,shift=false){
  const day=this.state.days[this.selectedDay];
  const i=day.findIndex(b=>b.id===id); if(i<0)return;
  day[i]={...day[i],...patch};
  if(patch.activity&&!patch.duration)day[i].duration=this.byId[patch.activity]?.duration||day[i].duration;
  this.normalizeBlock(day[i]);
  if(shift)this.shiftAfter(i);
  this.changed();
 }
 shiftAfter(index){
  const day=this.state.days[this.selectedDay];
  for(let i=index+1;i<day.length;i++){
   const prev=day[i-1]; day[i].time=toTime(toMin(prev.time)+Number(prev.duration)+15);
  }
 }
 optimizeDay(){this.resetDay(this.selectedDay);}
 suggestActivity(time){
  const m=toMin(time),w=this.state.weather,mode=this.state.mode;
  let pool=this.activities.filter(a=>a.weather.includes(w)&&a.modes.includes(mode));
  pool=pool.filter(a=>this.activityFitsTime(a,time,a.duration));
  return pool.sort((a,b)=>Math.abs(toMin(a.bestStart)-m)-Math.abs(toMin(b.bestStart)-m))[0];
 }
 conflicts(block){
  const a=this.byId[block.activity]; if(!a)return[];
  const s=toMin(block.time),e=s+Number(block.duration),open=toMin(a.open),close=toMin(a.close); const out=[];
  if(!a.weather.includes(this.state.weather))out.push({type:'bad',text:`Not recommended for ${this.state.weather} weather. The planner weather setting overrides the default plan, so swap this activity or regenerate the day.`});
  if(a.open&&a.close){
   if(s<open||e>close)out.push({type:'bad',text:`Hours conflict: scheduled ${fmtRange(block.time,block.duration)}, but typical planning hours are ${fmtTime(a.open)}–${fmtTime(a.close)}. Confirm official hours before going.`});
   else if(close-e<=45)out.push({type:'warn',text:`Close to closing: this ends within ${close-e} minutes of typical closing time. Consider moving earlier.`});
  }
  if(a.id==='boardwalk_bikes'&&s>=toMin('11:00'))out.push({type:'warn',text:'Boardwalk biking is best early. Summer boardwalk riding can be restricted after noon; move this earlier.'});
  if(a.id==='quiet_beach_sunrise'&&s>=toMin('08:30'))out.push({type:'warn',text:'Best near sunrise. This time is still okay for a beach walk, but it may be hotter/brighter.'});
  return out;
 }
 totalCost(){return this.state.days.flat().reduce((sum,b)=>sum+(this.byId[b.activity]?.cost||0),0)}
 changed(){this.onChange?.(this.state)}
}
