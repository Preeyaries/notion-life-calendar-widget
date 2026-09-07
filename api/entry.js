const{notionFetch,getDataSource,serializePage}=require("./_notion");
const title=v=>({title:v?[{text:{content:v.slice(0,1900)}}]:[]}),rich=v=>({rich_text:v?[{text:{content:v.slice(0,1900)}}]:[]});
module.exports=async function handler(req,res){
res.setHeader("Cache-Control","no-store");if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
try{
const{date,mood,diary}=req.body||{};if(!date)return res.status(400).json({error:"date is required"});const ds=await getDataSource(),schema=await notionFetch(`/v1/data_sources/${ds.id}`),p=schema.properties||{},name="What happened today (Diary)";
if(!p[name]||!p.Date||!p.Mood)throw new Error('Database needs "What happened today (Diary)", "Date", and "Mood".');
const found=await notionFetch(`/v1/data_sources/${ds.id}/query`,{method:"POST",body:JSON.stringify({page_size:2,filter:{property:"Date",date:{equals:date}}})});
const props={[name]:p[name].type==="title"?title(diary||""):rich(diary||""),Date:{date:{start:date}},Mood:p.Mood.type==="status"?{status:mood?{name:mood}:null}:{select:mood?{name:mood}:null}};
let page;if(found.results?.length)page=await notionFetch(`/v1/pages/${found.results[0].id}`,{method:"PATCH",body:JSON.stringify({properties:props})});else page=await notionFetch("/v1/pages",{method:"POST",body:JSON.stringify({parent:{type:"data_source_id",data_source_id:ds.id},properties:props})});
res.status(200).json({entry:serializePage(page)});
}catch(e){console.error(e);res.status(500).json({error:e.message||"Unable to save Notion entry."})}
};