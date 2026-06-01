const KEY='ocnjCompletePlannerV6';
export function loadState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
export function saveState(s){localStorage.setItem(KEY,JSON.stringify(s))}
export function clearState(){localStorage.removeItem(KEY)}
export {KEY as STORAGE_KEY};
