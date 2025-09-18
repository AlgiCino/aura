const KEY="ent:RolePermission"
function _read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
function _write(a){localStorage.setItem(KEY,JSON.stringify(a));return a}
export const RolePermission = {async list(params = {}) {
  const { filter, limit, orderBy } = params;
  let d=_read()
if(filter){d=d.filter(r=>Object.entries(filter).every(([k,v])=>r?.[k]===v))}
if(orderBy){const[k,dir='asc']=orderBy;d=d.slice().sort((a,b)=>(a[k]>b[k]?1:-1)*(dir==='desc'?-1:1))}
if(limit)d=d.slice(0,limit);return d},async get(id){return _read().find(r=>r.id===id)||null},
async create(rec){const now=new Date().toISOString();const id=rec.id||crypto.randomUUID?.()||String(Date.now())
const r={id,created_date:now,updated_date:now,...rec};const d=_read();d.unshift(r);_write(d);return r},
async update(id,patch){const d=_read();const i=d.findIndex(r=>r.id===id);if(i===-1)return null
d[i]={...d[i],...patch,updated_date:new Date().toISOString()};_write(d);return d[i]},async remove(id){
_write(_read().filter(r=>r.id!==id));return{ok:true}}};export default RolePermission