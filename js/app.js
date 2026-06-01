import {loadState,saveState,clearState} from './storage.js';
import {Planner} from './planner.js';
import {fmtRange,money,uid,fmtTime} from './utils.js';

const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const [activitiesRaw, restaurants, packing, plans, hoursData, eventsRaw]=await Promise.all([
 fetch('data/activities.json').then(r=>r.json()),
 fetch('data/restaurants.json').then(r=>r.json()),
 fetch('data/packing.json').then(r=>r.json()),
 fetch('data/defaultPlans.json').then(r=>r.json()),
 fetch('data/hours.json').then(r=>r.json()).catch(()=>({activities:[]})),
 fetch('data/events.json').then(r=>r.json()).catch(()=>[])
]);
const localHours=JSON.parse(localStorage.getItem('ocnjHoursOverrideV1')||'{}');
const hoursById=Object.fromEntries([...(hoursData.activities||[]).map(h=>[h.id,h]), ...Object.values(localHours).map(h=>[h.id,h])]);
const eventActivities=eventsRaw.map(ev=>eventToActivity(ev));
const activities=[...activitiesRaw.map(a=>({...a, ...(hoursById[a.id]||{})})), ...eventActivities];

function eventToActivity(ev){
 const duration=Math.max(30, toMinutes(ev.end)-toMinutes(ev.start));
 return {
  id:'event_'+ev.id, name:'📅 '+ev.title, desc:ev.desc, category:'2026 Events', duration, bestStart:ev.start,
  open:ev.start, close:ev.end==='00:00'?'24:00':ev.end, closeBufferMin:0, allDay:false, important:true, cost:ev.cost||0,
  modes:ev.audience||['family','solo'], weather:ev.weather||['sunny','cloudy','rainy'], tags:[...(ev.tags||[]),'2026-event'],
  links:[...(ev.links||[]), ['Map', 'https://www.google.com/maps/search/'+encodeURIComponent((ev.venue||'Ocean City NJ')+' '+ev.title)]],
  eventDate:ev.date, eventStart:ev.start, eventEnd:ev.end, venue:ev.venue, source:ev.source
 }
}
function toMinutes(t){const [h,m]=String(t||'00:00').split(':').map(Number);return h*60+m}
let state=loadState();
state.favorites ||= [];
state.expenses ||= [{id:uid(),name:'Souvenirs / treats',amount:75}];
state.checks ||= {};
state.tripBudget ||= 600;
state.groupSize ||= 4;
state.tripStart ||= '';
const planner=new Planner({activities,plans,state,onChange:autosave});
planner.init();

function autosave(){saveState(state); $('#saveStatus').textContent='Saved locally • '+new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}); renderAll(false)}
function renderAll(full=true){renderControls();renderDays();renderTimeline();renderEventSuggestions();renderActivities();renderFood();renderGas();renderBudget();renderPacking();}

function renderControls(){
 $$('#modeSegment button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
 $$('#weatherSegment button').forEach(b=>b.classList.toggle('active',b.dataset.weather===state.weather));
 $('#tripStart').value=state.tripStart||''; $('#groupSize').value=state.groupSize||4;
 $('#builderMode').value=state.mode; $('#builderWeather').value=state.weather;
}
function renderDays(){
 $('#dayTabs').innerHTML=state.days.map((d,i)=>`<button class="${i===planner.selectedDay?'active':''}" data-day="${i}">Day ${i+1}<small>${d.length} blocks • ${money(d.reduce((s,b)=>s+(planner.byId[b.activity]?.cost||0),0))}</small></button>`).join('');
 $$('#dayTabs button').forEach(b=>b.onclick=()=>{planner.selectedDay=Number(b.dataset.day);state.selectedDay=planner.selectedDay;autosave();});
 const date=state.tripStart?new Date(state.tripStart+'T12:00:00'):null;
 const dateText=date?new Date(date.getTime()+planner.selectedDay*86400000).toLocaleDateString([], {weekday:'long',month:'short',day:'numeric'}):`Day ${planner.selectedDay+1}`;
 $('#plannerTitle').textContent=`${dateText} Planner`;
 $('#plannerSubtitle').textContent=`${state.mode==='family'?'Family':'Solo / couples'} mode • ${state.weather} plan • ${state.days[planner.selectedDay].length} blocks`;
 const note={sunny:'Sunny plan: outdoor activities prioritized. Watch heat midday and keep shade/water breaks.',cloudy:'Cloudy plan: flexible outdoor day. Good for biking, zoo, shopping, or mini golf.',rainy:'Rainy plan: indoor/covered activities prioritized. Outdoor water plans are swapped when possible.'}[state.weather];
 $('#weatherNotice').textContent=note; $('#weatherNotice').classList.add('show');
}

function selectedDateISO(){
 if(!state.tripStart) return '';
 const d=new Date(state.tripStart+'T12:00:00'); d.setDate(d.getDate()+planner.selectedDay);
 return d.toISOString().slice(0,10);
}
function eventMatchesSelectedDay(ev){
 const iso=selectedDateISO();
 if(!iso) return ev.date.startsWith('2026-07');
 return ev.date===iso;
}
function eventScore(ev){
 let score=0;
 if((ev.audience||[]).includes(state.mode)) score+=80;
 if((ev.weather||[]).includes(state.weather)) score+=60;
 if(state.mode==='family' && (ev.tags||[]).includes('kids')) score+=35;
 if((ev.tags||[]).includes('free')) score+=15;
 if((ev.tags||[]).includes('signature')) score+=50;
 if(state.weather==='rainy' && (ev.tags||[]).includes('indoor')) score+=70;
 return score;
}
function visibleEvents(){
 const q=($('#eventSearch')?.value||'').toLowerCase();
 const cat=$('#eventCategory')?.value||'all';
 const when=$('#eventWhen')?.value||'selected';
 let list=eventsRaw.filter(ev=>when==='all' ? ev.date.startsWith('2026-07') : eventMatchesSelectedDay(ev));
 list=list.filter(ev=>(cat==='all'||ev.category===cat) && (`${ev.title} ${ev.desc} ${ev.venue} ${(ev.tags||[]).join(' ')}`.toLowerCase().includes(q)));
 return list.sort((a,b)=>eventScore(b)-eventScore(a) || (a.date+a.start).localeCompare(b.date+b.start));
}
function renderEventSuggestions(){
 const wrap=$('#eventSuggestions'); if(!wrap) return;
 const cat=$('#eventCategory');
 if(cat && cat.options.length===1){[...new Set(eventsRaw.map(e=>e.category))].sort().forEach(c=>cat.innerHTML+=`<option value="${c}">${c}</option>`)}
 const list=visibleEvents();
 const dateLabel=selectedDateISO()?new Date(selectedDateISO()+'T12:00:00').toLocaleDateString([], {weekday:'long',month:'short',day:'numeric'}):'all July dates';
 $('#eventHint').textContent=`Showing ${list.length} event ideas for ${dateLabel}. Use Add or Swap to place an event into the selected day.`;
 wrap.innerHTML=list.slice(0,36).map(ev=>{
  const start=fmtTime(ev.start), end=fmtTime(ev.end==='00:00'?'24:00':ev.end);
  const aId='event_'+ev.id;
  const day=state.days[planner.selectedDay]||[];
  const swapButtons=day.map((b,i)=>`<button class="mini-btn" data-swap-event="${aId}" data-block="${b.id}">Swap slot ${i+1}</button>`).join('');
  return `<article class="event-card ${ev.category}"><div class="event-date">${ev.date.replace('2026-','')} • ${start}–${end}</div><h3>${ev.title}</h3><p>${ev.desc}</p><div class="event-venue">📍 ${ev.venue||'Ocean City, NJ'}</div><div class="chip-row">${[ev.category,...(ev.tags||[]).slice(0,4),money(ev.cost||0)].map(x=>`<span class="chip">${x}</span>`).join('')}</div><div class="card-actions"><button class="favorite" data-add-event="${aId}">+ Add event</button>${swapButtons}${(ev.links||[]).slice(0,2).map(l=>`<a class="link-chip" target="_blank" href="${l[1]}">${l[0]}</a>`).join('')}</div></article>`
 }).join('') || '<div class="empty">No matching events for this filter/date. Try All July events.</div>';
 $$('[data-add-event]').forEach(b=>b.onclick=()=>{const a=planner.byId[b.dataset.addEvent]; state.days[planner.selectedDay].push({id:uid(),time:a.bestStart,duration:a.duration,activity:a.id}); planner.repairDay(planner.selectedDay,false); autosave(); location.hash='#planner';});
 $$('[data-swap-event]').forEach(b=>b.onclick=()=>{const a=planner.byId[b.dataset.swapEvent]; planner.updateBlock(b.dataset.block,{activity:a.id,time:a.bestStart,duration:a.duration},true); autosave(); location.hash='#planner';});
}

function renderTimeline(){
 const timeline=$('#timeline'); const day=state.days[planner.selectedDay];
 const tpl=$('#blockTemplate'); timeline.innerHTML='';
 day.forEach(block=>{
  const a=planner.byId[block.activity]; const node=tpl.content.cloneNode(true); const card=node.querySelector('.time-card');
  card.dataset.id=block.id; card.querySelector('.time-range').textContent=fmtRange(block.time,block.duration);
  const start=card.querySelector('.start-input'); start.value=block.time; start.onchange=e=>planner.updateBlock(block.id,{time:e.target.value},true);
  const dur=card.querySelector('.duration-input'); dur.value=block.duration; dur.onchange=e=>planner.updateBlock(block.id,{duration:Number(e.target.value)||60},true);
  const select=card.querySelector('.activity-select'); select.innerHTML=activities.filter(x=>x.modes.includes(state.mode) && (!x.eventDate || x.eventDate===selectedDateISO())).map(x=>`<option value="${x.id}">${x.name}</option>`).join(''); select.value=block.activity; select.onchange=e=>planner.updateBlock(block.id,{activity:e.target.value},false);
  card.querySelector('.activity-title').textContent=a?.name||'Unknown activity'; card.querySelector('.activity-desc').textContent=a?.desc||'';
  const hoursLabel = a?.allDay ? 'Hours 24 hours' : `Hours ${fmtTime(a?.open||'00:00')}–${a?.close==='24:00'?'12:00 AM':fmtTime(a?.close||'23:59')}`;
  card.querySelector('.meta-chips').innerHTML=[...(a?.eventDate?[a.eventDate]:[]),...(a?.weather||[]),...(a?.modes||[]),...(a?.tags||[]).slice(0,3)].map(t=>`<span class="chip ${t}">${t}</span>`).join('')+`<span class="chip">${money(a?.cost||0)}</span>`+`<span class="chip">${hoursLabel}</span>`;
  card.querySelector('.link-row').innerHTML=(a?.links||[]).map(l=>`<a class="link-chip" target="_blank" href="${l[1]}">${l[0]}</a>`).join('');
  card.querySelector('.remove-block').onclick=()=>planner.removeBlock(block.id);
  timeline.appendChild(node);
 });
 if(!day.length) timeline.innerHTML='<div class="empty">No blocks yet. Add a block or generate a day.</div>';
}
function renderActivities(){
 const cat=$('#activityCategory'); if(cat.options.length===1){[...new Set(activities.map(a=>a.category))].sort().forEach(c=>cat.innerHTML+=`<option value="${c}">${c}</option>`)}
 const q=$('#activitySearch').value?.toLowerCase()||'', c=cat.value, w=$('#activityWeather').value, fav=$('#favoritesOnly').checked;
 const list=activities.filter(a=>(c==='all'||a.category===c)&&(w==='all'||a.weather.includes(w))&&(!fav||state.favorites.includes(a.id))&&(`${a.name} ${a.desc} ${a.tags.join(' ')}`.toLowerCase().includes(q)));
 $('#activityGrid').innerHTML=list.map(a=>`<article class="activity-card"><h3>${a.name}</h3><p>${a.desc}</p><div class="chip-row"><span class="chip">${a.category}</span><span class="chip">${a.duration} min</span><span class="chip">${money(a.cost)}</span></div><div class="card-actions"><a class="link-chip" href="admin.html">Edit hours</a><button class="favorite ${state.favorites.includes(a.id)?'active':''}" data-fav="${a.id}">★ Favorite</button><button class="favorite" data-add="${a.id}">+ Add to day</button>${a.links.slice(0,2).map(l=>`<a class="link-chip" target="_blank" href="${l[1]}">${l[0]}</a>`).join('')}</div></article>`).join('')||'<div class="empty">No activities match your filters.</div>';
 $$('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];autosave();});
 $$('[data-add]').forEach(b=>b.onclick=()=>{const a=planner.byId[b.dataset.add];state.days[planner.selectedDay].push({id:uid(),time:a.bestStart,duration:a.duration,activity:a.id});autosave();location.hash='#planner';});
}
function renderFood(){
 const type=$('#foodType'); if(type.options.length===1){[...new Set(restaurants.map(r=>r.type))].sort().forEach(t=>type.innerHTML+=`<option value="${t}">${t}</option>`)}
 const q=$('#foodSearch').value?.toLowerCase()||'', t=type.value;
 const list=restaurants.filter(r=>(t==='all'||r.type===t)&&(`${r.name} ${r.desc} ${r.type}`.toLowerCase().includes(q)));
 $('#foodGrid').innerHTML=list.map(r=>`<article class="food-card"><h3>${r.name}</h3><p>${r.desc}</p><div class="chip-row"><span class="chip">${r.type}</span><span class="chip">${r.cost}</span></div><div class="link-row">${r.links.map(l=>`<a class="link-chip" target="_blank" href="${l[1]}">${l[0]}</a>`).join('')}</div></article>`).join('');
}
function renderGas(){
 const miles=+$('#gasMiles').value||0, mpg=+$('#gasMpg').value||1, price=+$('#gasPrice').value||0, extras=+$('#gasExtras').value||0;
 $('#gasTotal').textContent=money((miles/mpg)*price+extras);
}
function renderBudget(){
 $('#tripBudget').value=state.tripBudget; const planned=planner.totalCost()+state.expenses.reduce((s,e)=>s+(+e.amount||0),0); const rem=state.tripBudget-planned;
 $('#plannedCost').textContent=money(planned); $('#remainingBudget').textContent=money(rem); $('#budgetBar').style.width=Math.min(100, planned/(state.tripBudget||1)*100)+'%'; if(planned>state.tripBudget)$('#budgetBar').style.background='linear-gradient(90deg,#ca8a04,#dc2626)';
 $('#expenseList').innerHTML=state.expenses.map(e=>`<div class="expense-row" data-exp="${e.id}"><input class="exp-name" value="${e.name}"><input class="exp-amount" type="number" value="${e.amount}"><button>×</button></div>`).join('');
 $$('.expense-row').forEach(row=>{const id=row.dataset.exp;row.querySelector('.exp-name').onchange=e=>{state.expenses.find(x=>x.id===id).name=e.target.value;autosave()};row.querySelector('.exp-amount').onchange=e=>{state.expenses.find(x=>x.id===id).amount=+e.target.value||0;autosave()};row.querySelector('button').onclick=()=>{state.expenses=state.expenses.filter(x=>x.id!==id);autosave()}})
}
function renderPacking(){
 $('#packingGrid').innerHTML=packing.map((g,gi)=>`<div class="check-card"><h3>${g.title}</h3>${g.items.map((it,ii)=>{const key=`${gi}-${ii}`;return `<label><input type="checkbox" data-check="${key}" ${state.checks[key]?'checked':''}> ${it}</label>`}).join('')}</div>`).join('');
 $$('[data-check]').forEach(c=>c.onchange=()=>{state.checks[c.dataset.check]=c.checked;autosave()});
}

$('#modeSegment').onclick=e=>{if(e.target.dataset.mode)planner.setMode(e.target.dataset.mode)};
$('#weatherSegment').onclick=e=>{if(e.target.dataset.weather)planner.setWeather(e.target.dataset.weather)};
$('#tripStart').onchange=e=>{state.tripStart=e.target.value;autosave()}; $('#groupSize').onchange=e=>{state.groupSize=+e.target.value||1;autosave()};
$('#resetDayBtn').onclick=()=>confirm('Reset this day?')&&planner.resetDay(); $('#resetAllBtn').onclick=()=>{if(confirm('Clear all saved trip edits on this device?')){clearState();location.reload()}};
$('#addBlockBtn').onclick=()=>planner.addBlock(); $('#optimizeBtn').onclick=()=>planner.optimizeDay(); $('#printBtn').onclick=()=>window.print();
$('#quickGenerateBtn').onclick=()=>{location.hash='#builder'}; $('#applyBuilderBtn').onclick=()=>{state.mode=$('#builderMode').value;state.weather=$('#builderWeather').value;planner.resetDay(planner.selectedDay);planner.weatherSwap();autosave();location.hash='#planner'};
['activitySearch','activityCategory','activityWeather','favoritesOnly'].forEach(id=>$('#'+id).addEventListener('input',renderActivities));
['eventSearch','eventCategory','eventWhen'].forEach(id=>{const el=$('#'+id); if(el) el.addEventListener('input',renderEventSuggestions)});
['foodSearch','foodType'].forEach(id=>$('#'+id).addEventListener('input',renderFood));
['gasMiles','gasMpg','gasPrice','gasExtras'].forEach(id=>$('#'+id).addEventListener('input',renderGas));
$('#tripBudget').onchange=e=>{state.tripBudget=+e.target.value||0;autosave()}; $('#addExpenseBtn').onclick=()=>{state.expenses.push({id:uid(),name:'New expense',amount:0});autosave()};
$('#menuBtn').onclick=()=>$('#mainNav').classList.toggle('open'); $$('.nav a').forEach(a=>a.onclick=()=>$('#mainNav').classList.remove('open'));
renderAll();
