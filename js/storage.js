const KEY='ocnj_complete_planner_v1';
export function loadState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state));}
export function clearState(){localStorage.removeItem(KEY)}
