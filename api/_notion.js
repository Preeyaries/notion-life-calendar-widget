const NOTION_VERSION="2025-09-03";

async function notionFetch(path,opt={}){
  if(!process.env.NOTION_TOKEN) throw new Error("Missing NOTION_TOKEN.");
  if(!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID.");

  const r=await fetch(`https://api.notion.com${path}`,{
    ...opt,
    headers:{
      Authorization:`Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version":NOTION_VERSION,
      "Content-Type":"application/json",
      ...(opt.headers||{})
    }
  });

  const j=await r.json();
  if(!r.ok) throw new Error(j.message||`Notion API error ${r.status}`);
  return j;
}

async function getDataSource(){
  const db=await notionFetch(`/v1/databases/${process.env.NOTION_DATABASE_ID}`);
  if(!db.data_sources?.length) throw new Error("No data source found.");
  return db.data_sources[0];
}

function textOf(p){
  if(!p) return "";
  if(p.type==="title") return (p.title||[]).map(x=>x.plain_text||"").join("");
  if(p.type==="rich_text") return (p.rich_text||[]).map(x=>x.plain_text||"").join("");
  return "";
}

function moodOf(p){
  if(!p) return null;
  if(p.type==="select") return p.select?.name||null;
  if(p.type==="status") return p.status?.name||null;
  return null;
}

function dateOf(p){
  return p?.type==="date" ? p.date?.start?.slice(0,10)||null : null;
}

function numberOf(p){
  if(!p) return null;
  if(p.type==="number") return Number.isFinite(p.number) ? p.number : null;
  if(p.type==="formula" && p.formula?.type==="number")
    return Number.isFinite(p.formula.number) ? p.formula.number : null;
  return null;
}

function serializePage(page){
  const p=page.properties||{};
  return {
    id:page.id,
    date:dateOf(p.Date),
    mood:moodOf(p.Mood),
    diary:textOf(p["What happened today (Diary)"]),
    happiness:numberOf(p.Happiness)
  };
}

module.exports={notionFetch,getDataSource,serializePage};
