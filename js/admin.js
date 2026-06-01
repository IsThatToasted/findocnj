const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const [activities, hoursData]=await Promise.all([
  fetch('data/activities.json').then(r=>r.json()),
  fetch('data/hours.json').then(r=>r.json()).catch(()=>({activities:[]}))
]);
const LOCAL_KEY='ocnjHoursOverrideV1';
let local=JSON.parse(localStorage.getItem(LOCAL_KEY)||'{}');
let records=activities.map(a=>({
  id:a.id, name:a.name, category:a.category, open:a.open||'00:00', close:a.close||'23:59', bestStart:a.bestStart||'09:00', duration:a.duration||60,
  important:!!a.important, allDay:!!a.allDay, hoursMode:a.hoursMode||'', closeBufferMin:a.closeBufferMin ?? (a.important?45:15), planningNote:a.planningNote||'', hoursSource:a.hoursSource||{label:'Planning default',url:a.links?.[0]?.[1]||'',note:'Editable planning default.'},
  ...(hoursData.activities||[]).find(h=>h.id===a.id),
  ...(local[a.id]||{})
}));
[...new Set(records.map(r=>r.category))].sort().forEach(c=>$('#category').innerHTML+=`<option value="${c}">${c}</option>`);
function render(){
 const q=$('#search').value.toLowerCase(), cat=$('#category').value, imp=$('#importance').value;
 const list=records.filter(r=>(cat==='all'||r.category===cat)&&(imp==='all'||(imp==='important')===!!r.important)&&(`${r.name} ${r.id} ${r.category}`.toLowerCase().includes(q)));
 $('#hoursGrid').innerHTML=list.map(r=>`<article class="admin-card" data-id="${r.id}">
  <header><div><h3>${r.name}</h3><div class="source-line"><strong>${r.category}</strong> • Source: ${r.hoursSource?.url?`<a target="_blank" href="${r.hoursSource.url}">${r.hoursSource.label||'source'}</a>`:(r.hoursSource?.label||'Planning default')}<br>${r.hoursSource?.note||''}</div></div><span class="chip">${r.id}</span></header>
  <div class="admin-fields">
    <label>Open<input type="time" data-field="open" value="${r.open}"></label>
    <label>Close<input type="time" data-field="close" value="${r.close}"></label>
    <label>Best start<input type="time" data-field="bestStart" value="${r.bestStart}"></label>
    <label>Duration<input type="number" data-field="duration" value="${r.duration}" min="15" step="15"></label>
    <label>Close buffer<input type="number" data-field="closeBufferMin" value="${r.closeBufferMin}" min="0" step="15"></label>
    <label>Important<select data-field="important"><option value="true" ${r.important?'selected':''}>Yes</option><option value="false" ${!r.important?'selected':''}>No</option></select></label>
    <textarea data-field="planningNote">${r.planningNote||''}</textarea>
  </div>
 </article>`).join('');
 $$('[data-field]').forEach(el=>el.oninput=()=>{const id=el.closest('[data-id]').dataset.id; const rec=records.find(r=>r.id===id); let v=el.value; if(['duration','closeBufferMin'].includes(el.dataset.field)) v=Number(v)||0; if(el.dataset.field==='important') v=v==='true'; rec[el.dataset.field]=v;});
}
function saveLocal(){local={}; records.forEach(r=>local[r.id]={id:r.id,name:r.name,open:r.open,close:r.close,bestStart:r.bestStart,duration:r.duration,important:r.important,allDay:!!r.allDay,hoursMode:r.hoursMode||'',closeBufferMin:r.closeBufferMin,planningNote:r.planningNote,hoursSource:r.hoursSource}); localStorage.setItem(LOCAL_KEY,JSON.stringify(local)); alert('Saved local hours override on this device. Refresh the planner to test it.');}
function exportJson(){const out={version:Date.now(),note:'Exported from admin.html. Commit this file as data/hours.json for GitHub Pages.',activities:records.map(r=>({id:r.id,name:r.name,open:r.open,close:r.close,bestStart:r.bestStart,duration:r.duration,important:r.important,allDay:!!r.allDay,hoursMode:r.hoursMode||'',closeBufferMin:r.closeBufferMin,planningNote:r.planningNote,hoursSource:r.hoursSource}))}; const blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='hours.json'; a.click(); URL.revokeObjectURL(a.href);}
$('#saveLocal').onclick=saveLocal; $('#exportJson').onclick=exportJson; $('#clearLocal').onclick=()=>{localStorage.removeItem(LOCAL_KEY); location.reload()}; $('#importJson').onchange=async e=>{const f=e.target.files[0]; if(!f)return; const j=JSON.parse(await f.text()); records=records.map(r=>({...r,...(j.activities||[]).find(x=>x.id===r.id)})); render();}; ['search','category','importance'].forEach(id=>$('#'+id).addEventListener('input',render)); render();
