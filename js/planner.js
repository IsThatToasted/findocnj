import {toMin,toTime,uid} from './utils.js';

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
  if(!this.state.days){this.resetAll(false)} else this.repairAll(false);
 }
 basePlan(mode=this.state.mode,weather=this.state.weather){
  let base=this.plans?.[mode]?.[weather];
  if(!base||!base.length)base=this.plans?.[mode]?.sunny||[];
  return JSON.parse(JSON.stringify(base));
 }
 windowFor(a){
  if(!a)return null;
  const open=toMin(a.open||'00:00');
  const closeRaw=toMin(a.close||'23:59');
  const buffer=Number(a.closeBufferMin ?? (a.important?45:15));
  const latest=Math.max(open, closeRaw - buffer - Number(a.duration||60));
  return {open,closeRaw,buffer,latest};
 }
 fitsActivity(a,start,duration=a?.duration||60){
  if(!a) return false;
  if(!a.modes?.includes(this.state.mode) || !a.weather?.includes(this.state.weather)) return false;
  const w=this.windowFor(a); if(!w) return true;
  const s=toMin(start||a.bestStart||'12:00');
  return s>=w.open && (s+Number(duration)) <= (w.closeRaw-w.buffer);
 }
 safeStartFor(a,wanted){
  const w=this.windowFor(a); if(!w)return wanted||a.bestStart||'12:00';
  const target=toMin(wanted||a.bestStart||'12:00');
  return toTime(Math.min(Math.max(target,w.open),w.latest));
 }
 scoreActivity(a,start,oldCat){
  const m=toMin(start||'12:00'); let score=0;
  if(a.weather.includes(this.state.weather)) score+=90;
  if(a.modes.includes(this.state.mode)) score+=90;
  if(oldCat && a.category===oldCat) score+=45;
  if(this.fitsActivity(a,start,a.duration)) score+=100; else score-=150;
  if(a.important) score+=15;
  score-=Math.abs(toMin(a.bestStart||start)-m)/8;
  if(a.tags?.includes('reset')&&m>=720&&m<=960)score+=25;
  return score;
 }
 bestAlternative(oldAct,start){
  const oldCat=oldAct?.category;
  return this.activities
   .filter(a=>a.weather.includes(this.state.weather)&&a.modes.includes(this.state.mode))
   .sort((a,b)=>this.scoreActivity(b,start,oldCat)-this.scoreActivity(a,start,oldCat))[0];
 }
 repairBlock(block){
  let a=this.byId[block.activity];
  if(!a || !a.modes.includes(this.state.mode) || !a.weather.includes(this.state.weather)){
   a=this.bestAlternative(a,block.time); if(a){block.activity=a.id; block.duration=a.duration;}
  }
  a=this.byId[block.activity]; if(!a)return block;
  if(!this.fitsActivity(a,block.time,block.duration)){
    const safe=this.safeStartFor(a,block.time);
    if(this.fitsActivity(a,safe,block.duration)) block.time=safe;
    else { const alt=this.bestAlternative(a,block.time); if(alt){block.activity=alt.id; block.duration=alt.duration; block.time=this.safeStartFor(alt,block.time);} }
  }
  return block;
 }
 repairDay(dayIndex=this.selectedDay, save=false){
  const day=this.state.days[dayIndex]||[];
  day.forEach(b=>this.repairBlock(b));
  day.sort((a,b)=>toMin(a.time)-toMin(b.time));
  for(let i=1;i<day.length;i++){
    const prev=day[i-1], cur=day[i]; const needed=toMin(prev.time)+Number(prev.duration)+15;
    if(toMin(cur.time)<needed) cur.time=toTime(needed);
    this.repairBlock(cur);
  }
  if(save)this.changed();
 }
 repairAll(save=true){(this.state.days||[]).forEach((_,i)=>this.repairDay(i,false)); if(save)this.changed();}
 resetAll(save=true){this.state.days=this.basePlan().map(day=>day.map(b=>this.repairBlock({...b,id:uid()}))); this.repairAll(false); if(save)this.changed();}
 resetDay(day=this.selectedDay){this.state.days[day]=this.basePlan()[day].map(b=>this.repairBlock({...b,id:uid()}));this.repairDay(day,false);this.changed();}
 setMode(mode){this.state.mode=mode;this.resetAll();}
 setWeather(weather){this.state.weather=weather;this.resetAll();}
 weatherSwap(){this.repairAll(true);}
 addBlock(){
  const day=this.state.days[this.selectedDay];
  const last=day[day.length-1];
  const time=last?toTime(toMin(last.time)+Number(last.duration)+15):'09:00';
  const activity=this.suggestActivity(time)?.id||this.activities[0].id;
  day.push(this.repairBlock({id:uid(),time,duration:this.byId[activity].duration,activity}));
  this.repairDay(this.selectedDay,false); this.changed();
 }
 removeBlock(id){this.state.days[this.selectedDay]=this.state.days[this.selectedDay].filter(b=>b.id!==id);this.changed();}
 updateBlock(id,patch,shift=false){
  const day=this.state.days[this.selectedDay]; const i=day.findIndex(b=>b.id===id); if(i<0)return;
  day[i]={...day[i],...patch}; if(patch.activity&&!patch.duration)day[i].duration=this.byId[patch.activity]?.duration||day[i].duration;
  this.repairBlock(day[i]); if(shift)this.shiftAfter(i); this.repairDay(this.selectedDay,false); this.changed();
 }
 shiftAfter(index){const day=this.state.days[this.selectedDay];for(let i=index+1;i<day.length;i++){const prev=day[i-1];day[i].time=toTime(toMin(prev.time)+Number(prev.duration)+15);}}
 optimizeDay(){this.resetDay(this.selectedDay);}
 suggestActivity(time){return this.activities.filter(a=>a.weather.includes(this.state.weather)&&a.modes.includes(this.state.mode)&&this.fitsActivity(a,time,a.duration)).sort((a,b)=>Math.abs(toMin(a.bestStart)-toMin(time))-Math.abs(toMin(b.bestStart)-toMin(time)))[0];}
 totalCost(){return this.state.days.flat().reduce((sum,b)=>sum+(this.byId[b.activity]?.cost||0),0)}
 changed(){this.onChange?.(this.state)}
}
