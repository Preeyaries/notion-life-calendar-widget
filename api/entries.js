const{notionFetch,getDataSource,serializePage}=require("./_notion");
function before(s){const[y,m,d]=s.split("-").map(Number),x=new Date(Date.UTC(y,m-1,d));x.setUTCDate(x.getUTCDate()-1);return x.toISOString().slice(0,10)}
module.exports=async function handler(req,res){
res.setHeader("Cache-Control","no-store");if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
try{
const{from,to}=req.query;if(!from||!to)return res.status(400).json({error:"from and to are required"});const ds=await getDataSource();
let entries=[],cursor;do{const j=await notionFetch(`/v1/data_sources/${ds.id}/query`,{method:"POST",body:JSON.stringify({page_size:100,filter:{and:[{property:"Date",date:{on_or_after:from}},{property:"Date",date:{on_or_before:to}}]},sorts:[{property:"Date",direction:"ascending"}],...(cursor?{start_cursor:cursor}:{})})});entries.push(...(j.results||[]).map(serializePage).filter(x=>x.date));cursor=j.has_more?j.next_cursor:undefined}while(cursor);
let all=[],c;do{const j=await notionFetch(`/v1/data_sources/${ds.id}/query`,{method:"POST",body:JSON.stringify({page_size:100,...(c?{start_cursor:c}:{})})});all.push(...(j.results||[]).map(serializePage).filter(x=>x.date));c=j.has_more?j.next_cursor:undefined}while(c);
const set=new Set(all.map(x=>x.date));let cur=new Date().toISOString().slice(0,10);if(!set.has(cur))cur=before(cur);let streak=0;while(set.has(cur)){streak++;cur=before(cur)}
res.status(200).json({entries,totalEntries:all.length,streak});
}catch(e){console.error(e);res.status(500).json({error:e.message||"Unable to read Notion entries."})}
};