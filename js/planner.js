import {toMin,toTime,fmtRange,money,uid} from './utils.js';

export class Planner{
 constructor({activities,plans,state,onChange}){this.activities=activities;this.byId=Object.fromEntries(activities.map(a=>[a.id,a]));this.plans=plans;this.state=state;this.onChange=onChange;this.selectedDay=state.selectedDay||0;}
 init(){if(!this.state.mode)this.state.mode='family';if(!this.state.weather)this.state.weather='sunny';if(!this.state.days)this.resetAll(false);}
 basePlan(mode=this.state.mode,weather=this.state.weather){let base=this.plans?.[mode]?.[weather];if(!base||!base.length)base=this.plans?.[mode]?.sunny||[];return JSON.parse(JSON.stringify(base));}
 resetAll(save=true){this.state.days=this.basePlan().map(day=>day.map(b=>({...b,id:uid()})));if(save)this.changed();}
 resetDay(day=this.selectedDay){this.state.days[day]=this.basePlan()[day].map(b=>({...b,id:uid()}));this.changed();}
 setMode(mode){this.state.mode=mode;this.resetAll();}
 setWeather(weather){this.state.weather=weather;this.weatherSwap();this.changed();}
 weatherSwap(){const w=this.state.weather;this.state.days.forEach(day=>day.forEach(b=>{const a=this.byId[b.activity];if(a&&!a.weather.includes(w)){const alt=this.bestAlternative(a,b.time,w);if(alt)b.activity=alt.id;}}));}
 bestAlternative(oldAct,start,weather){return this.activities.filter(a=>a.weather.includes(weather)&&a.modes.includes(this.state.mode)&&a.category===oldAct.category)[0]||this.activities.filter(a=>a.weather.includes(weather)&&a.modes.includes(this.state.mode))[0];}
 addBlock(){const day=this.state.days[this.selectedDay];const last=day[day.length-1];const time=last?toTime(toMin(last.time)+Number(last.duration)+15):'09:00';const activity=this.suggestActivity(time)?.id||this.activities[0].id;day.push({id:uid(),time,duration:this.byId[activity].duration,activity});this.changed();}
 removeBlock(id){this.state.days[this.selectedDay]=this.state.days[this.selectedDay].filter(b=>b.id!==id);this.changed();}
 updateBlock(id,patch,shift=false){const day=this.state.days[this.selectedDay];const i=day.findIndex(b=>b.id===id);if(i<0)return;day[i]={...day[i],...patch};if(patch.activity&&!patch.duration){day[i].duration=this.byId[patch.activity]?.duration||day[i].duration}if(shift)this.shiftAfter(i);this.changed();}
 shiftAfter(index){const day=this.state.days[this.selectedDay];for(let i=index+1;i<day.length;i++){const prev=day[i-1];day[i].time=toTime(toMin(prev.time)+Number(prev.duration)+15)}}
 optimizeDay(){const w=this.state.weather,mode=this.state.mode;const templates=this.basePlan(mode,w)[this.selectedDay]||[];this.state.days[this.selectedDay]=templates.map(b=>({id:uid(),...b,activity:(this.byId[b.activity]?.weather.includes(w)?b.activity:(this.suggestActivity(b.time)?.id||b.activity))}));this.changed();}
 suggestActivity(time){const m=toMin(time),w=this.state.weather,mode=this.state.mode;let pool=this.activities.filter(a=>a.weather.includes(w)&&a.modes.includes(mode));pool=pool.filter(a=>m>=toMin(a.open)-30&&m<=toMin(a.close)-30);return pool.sort((a,b)=>Math.abs(toMin(a.bestStart)-m)-Math.abs(toMin(b.bestStart)-m))[0];}
 conflicts(block){const a=this.byId[block.activity];if(!a)return[];const s=toMin(block.time),e=s+Number(block.duration),open=toMin(a.open),close=toMin(a.close);const out=[];if(!a.weather.includes(this.state.weather))out.push({type:'bad',text:`Not recommended for ${this.state.weather} weather. Swap activity or change weather plan.`});if(s<open||e>close)out.push({type:'bad',text:`Hours conflict: suggested ${fmtRange(block.time,block.duration)}, but typical planning hours are ${a.open}–${a.close}. Confirm official hours before going.`});else if(close-e<=45)out.push({type:'warn',text:`Close to closing: this ends within ${close-e} minutes of typical closing time. Consider moving earlier.`});if(a.id==='boardwalk_bikes'&&s>=toMin('11:00'))out.push({type:'warn',text:'Boardwalk biking is best early. Summer boardwalk riding can be restricted after noon; move this earlier.'});return out;}
 totalCost(){return this.state.days.flat().reduce((sum,b)=>sum+(this.byId[b.activity]?.cost||0),0)}
 changed(){this.onChange?.(this.state)}
}
