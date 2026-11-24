const allowedOrigins=new Set(['https://cosmos-real-estate-demo.vercel.app','http://127.0.0.1:4173','http://localhost:4173']);
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')||'';
 const cors={'Access-Control-Allow-Origin':allowedOrigins.has(origin)?origin:'https://cosmos-real-estate-demo.vercel.app','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin','Cache-Control':'no-store'};
 const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
 if(!allowedOrigins.has(origin))return reply(403,{error:'This website is not allowed.'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return reply(405,{error:'Use POST.'});
 try{
  if(Number(req.headers.get('content-length')||0)>12000)return reply(413,{error:'Your message is too long.'});
  const raw=await req.text();if(raw.length>12000)return reply(413,{error:'Your message is too long.'});
  let data;try{data=JSON.parse(raw);}catch{return reply(400,{error:'Invalid enquiry.'});}
  const {request_id,name,email,property_id,message,locale,consent,website}=data;
  if(website)return reply(200,{received:true});
  if(typeof request_id!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(request_id)||typeof name!=='string'||name.trim().length<2||name.length>100||typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof message!=='string'||message.trim().length<10||message.length>4000||consent!==true||!['en','fr','es','ar'].includes(locale)||(property_id!==null&&(typeof property_id!=='string'||!/^[A-Za-z0-9-]{1,40}$/.test(property_id))))return reply(400,{error:'Please check your name, email, message and consent.'});
  const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(secret+':'+ip));
  const ipHash=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
  const response=await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/rpc/submit_cosmos_enquiry',{method:'POST',headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json'},body:JSON.stringify({p_request_id:request_id,p_name:name,p_email:email,p_property_id:property_id,p_message:message,p_locale:locale,p_ip_hash:ipHash})});
  if(!response.ok){const error=await response.json().catch(()=>({}));if(error.message?.includes('Too many'))return reply(429,{error:'Too many enquiries. Please try again later or contact us on WhatsApp.'});if(error.message?.includes('Property is not available'))return reply(400,{error:'This listing is no longer available. Please refresh the page.'});return reply(503,{error:'We could not save your enquiry. Please try email or WhatsApp.'});}
  return reply(201,{received:true,reference:await response.json()});
 }catch{return reply(503,{error:'We could not save your enquiry. Please try email or WhatsApp.'});}
});
