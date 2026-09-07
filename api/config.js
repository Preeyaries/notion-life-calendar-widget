module.exports=async function handler(req,res){
res.setHeader("Cache-Control","no-store");
if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
if(!process.env.BIRTH_DATE)return res.status(500).json({error:"Missing BIRTH_DATE (YYYY-MM-DD) in Vercel."});
res.status(200).json({birthDate:process.env.BIRTH_DATE,lifespanYears:Number(process.env.LIFESPAN_YEARS||90)});
};