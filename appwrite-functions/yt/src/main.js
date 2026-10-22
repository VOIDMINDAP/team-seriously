// Team Seriously · YouTube upload broker. Secrets come from function env vars only.
const EP=process.env.APPWRITE_FUNCTION_API_ENDPOINT||'https://fra.cloud.appwrite.io/v1',PJ=process.env.APPWRITE_FUNCTION_PROJECT_ID;
const ORIGIN='https://team-seriously.surge.sh',CLAN='clan';
const token=async()=>{const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
 body:new URLSearchParams({client_id:process.env.YT_CLIENT_ID,client_secret:process.env.YT_CLIENT_SECRET,refresh_token:process.env.YT_REFRESH_TOKEN,grant_type:'refresh_token'})});
 const j=await r.json();if(!j.access_token)throw new Error('oauth '+(j.error||r.status));return j.access_token};
export default async({req,res,log,error})=>{
 const ok=(o,s=200)=>res.json(o,s);
 if(!(process.env.YT_CLIENT_ID&&process.env.YT_CLIENT_SECRET&&process.env.YT_REFRESH_TOKEN))return ok({error:'NOT_CONFIGURED'},503);
 if(req.headers['x-appwrite-user-id']!==CLAN)return ok({error:'FORBIDDEN'},401);
 let b={};try{b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.bodyJson||req.body||{})}catch(_){}
 const slot=+b.slot;if(!(slot>=1&&slot<=4))return ok({error:'BAD_SLOT'},400);
 const KEY=req.headers['x-appwrite-key'];const db=(m,p,body)=>fetch(`${EP}/databases/ts/collections/slots/documents${p}`,{method:m,headers:{'X-Appwrite-Project':PJ,'X-Appwrite-Key':KEY,'Content-Type':'application/json'},body:body&&JSON.stringify(body)});
 try{
  if(b.action==='start'){
   if((await db('GET','/slot'+slot)).ok)return ok({error:'SLOT_TAKEN'},409);
   const size=+b.size||0,mime=String(b.mime||'video/mp4').slice(0,40),title=String(b.title||'').slice(0,60);
   const t=await token();
   const r=await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',{method:'POST',
    headers:{Authorization:'Bearer '+t,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':mime,'X-Upload-Content-Length':String(size),Origin:ORIGIN},
    body:JSON.stringify({snippet:{title:('Team Seriously – '+(title||'Clip '+slot)).slice(0,100),description:'Clip del Registro de combate · team-seriously.surge.sh',categoryId:'20'},status:{privacyStatus:process.env.YT_PRIVACY||'public',selfDeclaredMadeForKids:false,embeddable:true}})});
   const url=r.headers.get('location');if(!url){const tx=await r.text();error(tx);return ok({error:'YT_START',detail:tx.slice(0,300)},502)}
   return ok({uploadUrl:url})}
  if(b.action==='finish'){
   const id=String(b.videoId||'');if(!/^[\w-]{11}$/.test(id))return ok({error:'BAD_ID'},400);
   const t=await token();const v=await(await fetch(`https://www.googleapis.com/youtube/v3/videos?part=status,snippet&id=${id}&mine=true`,{headers:{Authorization:'Bearer '+t}})).json().catch(()=>({}));
   const it=(v.items||[])[0];if(!it)return ok({error:'NOT_FOUND'},404);
   const r=await db('POST','',{documentId:'slot'+slot,data:{slot,title:String(b.title||'').slice(0,60),ytId:id,mime:'youtube'},permissions:[]});
   if(!r.ok)return ok({error:'DB',status:r.status},r.status===409?409:500);
   return ok({ok:true,ytId:id,privacy:it.status.privacyStatus})}
  return ok({error:'BAD_ACTION'},400)}catch(e){error(String(e));return ok({error:'SERVER',detail:String(e).slice(0,200)},500)}};
