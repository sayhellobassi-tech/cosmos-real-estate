export async function notifyEnquiry({id,url,serviceKey,emailKey,from='Cosmos Alerts <onboarding@resend.dev>',fetcher=fetch}){
 if(!emailKey)return {status:'not_configured'};
 const headers={apikey:serviceKey,Authorization:'Bearer '+serviceKey,'Content-Type':'application/json'};
 const api=(path,options={})=>fetcher(url+'/rest/v1/'+path,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(10000)});
 const claimed=await api('rpc/claim_enquiry_email',{method:'POST',body:JSON.stringify({p_id:id})});
 if(!claimed.ok||await claimed.json()!==true)return {status:'skipped'};
 let status='failed',providerId=null;
 try{
  const response=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+emailKey,'Content-Type':'application/json','Idempotency-Key':'cosmos-enquiry/'+id},body:JSON.stringify({from,to:['mngmntstd@gmail.com'],subject:'New Cosmos website enquiry',text:'A new enquiry is waiting in your private Cosmos inbox.\n\nOpen https://cosmos-real-estate-demo.vercel.app/admin/ and choose Enquiries.\n\nReference: '+id+'\n\nThis alert contains no customer contact details. Sign in to read and respond.'}),signal:AbortSignal.timeout(10000)});
  const result=await response.json().catch(()=>({}));if(response.ok&&result.id){status='sent';providerId=result.id;}
 }catch{/* The enquiry remains saved and the failed notification can be retried. */}
 const recorded=await api('enquiry_notifications?enquiry_id=eq.'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({status,provider_id:providerId,...(status==='sent'?{sent_at:new Date().toISOString()}:{})})});
 return {status:recorded.ok?status:'recording_failed'};
}
