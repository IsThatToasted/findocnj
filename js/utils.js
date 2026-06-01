export function toMin(t){const [h,m]=String(t||'00:00').split(':').map(Number);return h*60+m}
export function toTime(min){min=((min%1440)+1440)%1440;const h=Math.floor(min/60),m=min%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`}
export function fmtTime(t){let [h,m]=t.split(':').map(Number);const ap=h>=12?'PM':'AM';h=h%12||12;return `${h}:${String(m).padStart(2,'0')} ${ap}`}
export function fmtRange(start,dur){return `${fmtTime(start)}–${fmtTime(toTime(toMin(start)+Number(dur)))}`}
export function money(n){return `$${Math.round(Number(n)||0).toLocaleString()}`}
export function uid(){return Math.random().toString(36).slice(2,9)}
