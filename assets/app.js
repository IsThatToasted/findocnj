const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.day-panel');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

menuBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

const activities = [
  { icon:'🎡', title:"Playland's Castaway Cove", note:'Boardwalk amusement rides, arcade, mini golf, and go-karts.', facts:[['Best time','6:30–8:30 PM'],['Duration','1.5–2.5 hrs'],['Age fit','All kids'],['Cost','Tickets/rides']], body:'Start with kiddie rides, then split up if older kids want bigger rides. Use a firm exit time for toddlers.', links:[['Official site','https://oceancityfun.com/'],['Ticket info','https://oceancityfun.com/ticket-sales/'],['Map','https://www.google.com/maps/search/Playland\'s+Castaway+Cove+1020+Boardwalk+Ocean+City+NJ']] },
  { icon:'🐬', title:'Dolphin Cruise / Bay Boat Ride', note:'A memorable animal-focused water activity.', facts:[['Best time','10:30 AM'],['Duration','1.5–2 hrs'],['Age fit','6–11 best'],['Book?','Yes']], body:'Choose shorter cruises for younger kids. Bring hats, snacks, water, and a light layer for wind.', links:[['Options map','https://www.google.com/maps/search/Ocean+City+NJ+dolphin+cruise'],['OCNJ boating info','https://oceancityvacation.com/things-to-do/activities/boating-marinas/']] },
  { icon:'🦁', title:'Cape May County Park & Zoo', note:'Free-admission zoo and park; excellent for mixed kid ages.', facts:[['Best time','10:00 AM'],['Duration','2–3 hrs'],['Age fit','Excellent'],['Cost','Free/donation']], body:'One of the strongest family day-trip anchors. Bring a stroller for toddlers and check zoo hours before leaving.', links:[['Official zoo','https://capemaycountynj.gov/1008/Park-Zoo---Do-Not-Delete'],['Plan visit','https://capemaycountynj.gov/1148/Plan-Your-Visit'],['Map','https://www.google.com/maps/search/Cape+May+County+Park+%26+Zoo']] },
  { icon:'🗼', title:'Cape May Lighthouse', note:'Historic lighthouse, visitor area, gift shop, and views.', facts:[['Best time','Early afternoon'],['Duration','45–90 min'],['Age fit','6–11 climb'],['Toddlers','Grounds']], body:'Great for older kids who can handle stairs. For younger kids, keep it to the grounds, visitor area, and photos.', links:[['Official info','https://capemaymac.org/experience/cape-may-lighthouse/'],['Map','https://www.google.com/maps/search/Cape+May+Lighthouse']] },
  { icon:'🌾', title:"Corson's Inlet State Park", note:'Nature walk, shell hunting, birding, photos, and quieter scenery.', facts:[['Best time','8:30 AM'],['Duration','45–90 min'],['Age fit','Short visit'],['Heat risk','High midday']], body:'Keep this short with young kids. It is best as a nature/photo stop, not a full beach day replacement.', links:[['Official park info','https://dep.nj.gov/parksandforests/state-park/corsons-inlet-state-park/'],['Map','https://www.google.com/maps/search/Corson\'s+Inlet+State+Park+Ocean+City+NJ']] },
  { icon:'🐘', title:'Lucy the Elephant', note:'Iconic six-story elephant landmark in Margate.', facts:[['Best time','9:00 AM'],['Duration','45–75 min'],['Age fit','All kids'],['Drive','~20 min']], body:'Short, easy, and memorable. Great for a final-day photo stop before returning to Ocean City.', links:[['Official site','https://lucytheelephant.org/'],['Map','https://www.google.com/maps/search/Lucy+the+Elephant+Margate+NJ']] },
  { icon:'⛱️', title:'Ocean City Beach Tags', note:'Beach access planning for mid-July.', facts:[['Who needs tags','Ages 12+'],['Season','June–Sept'],['Buy','Online/in town'],['Plan','Before beach']], body:'Beach tags are a practical planning item. Kids under 12 are typically exempt, but adults and older kids need tags during the season.', links:[['Official beach tag store','https://store.ocnj.us/'],['Beach tags info','https://www.ocnj.us/beachtags']] },
  { icon:'🎵', title:'Music Pier & Summer Events', note:'Concerts, family nights, and seasonal events.', facts:[['Best time','Evening'],['Duration','Varies'],['Age fit','Depends event'],['Book?','Some shows']], body:'Use this as the flexible Day 4 evening slot. Check exact July dates before the trip and again that morning.', links:[['Music Pier','https://www.ocnj.us/music-pier'],['Summer concerts','https://www.ocnj.us/SummerConcertSeries'],['Events calendar','https://oceancityvacation.com/resources/events-calendar/']] }
];

const activityCards = document.getElementById('activityCards');
if (activityCards) {
  activityCards.innerHTML = activities.map((a, i) => `
    <details class="activity" ${i === 0 ? 'open' : ''}>
      <summary><div><h3>${a.icon} ${a.title}</h3><div class="summary-note">${a.note}</div></div><div class="chev">⌄</div></summary>
      <div class="activity-content">
        <div class="facts">${a.facts.map(f => `<div class="fact"><strong>${f[0]}</strong><span>${f[1]}</span></div>`).join('')}</div>
        <p>${a.body}</p>
        <div class="links">${a.links.map(l => `<a target="_blank" href="${l[1]}">${l[0]}</a>`).join('')}</div>
      </div>
    </details>
  `).join('');
}

function calculateGas() {
  const baseMiles = Number(document.getElementById('baseMiles').value) || 0;
  const extraMiles = Number(document.getElementById('extraMiles').value) || 0;
  const mpg = Number(document.getElementById('mpg').value) || 1;
  const gasPrice = Number(document.getElementById('gasPrice').value) || 0;
  const roundTrip = document.getElementById('roundTrip').checked;
  const totalMiles = (roundTrip ? baseMiles * 2 : baseMiles) + extraMiles;
  const gallons = totalMiles / mpg;
  const cost = gallons * gasPrice;
  document.getElementById('totalMiles').textContent = totalMiles.toFixed(0);
  document.getElementById('gallonsNeeded').textContent = gallons.toFixed(1);
  document.getElementById('fuelCost').textContent = cost.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

document.getElementById('gasForm')?.addEventListener('submit', event => { event.preventDefault(); calculateGas(); });
document.querySelectorAll('#gasForm input').forEach(input => input.addEventListener('input', calculateGas));
calculateGas();

const checklistInputs = document.querySelectorAll('.checklist input[type="checkbox"]');
const savedChecklist = JSON.parse(localStorage.getItem('ocnjChecklist') || '[]');
checklistInputs.forEach((input, index) => {
  input.checked = Boolean(savedChecklist[index]);
  input.addEventListener('change', () => {
    const states = Array.from(checklistInputs).map(item => item.checked);
    localStorage.setItem('ocnjChecklist', JSON.stringify(states));
  });
});

document.addEventListener('DOMContentLoaded',()=>{
const solo=document.getElementById('soloBtn');
const fam=document.getElementById('familyBtn');
if(solo){
solo.addEventListener('click',()=>alert('Solo/Couples planner version coming next update. This toggle is now visible and ready for separate itinerary data.'));
fam.addEventListener('click',()=>{});
}
});
