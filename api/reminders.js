// Recordatorio 30 minutos antes de cada turno confirmado.
// Llamar cada 5 minutos: /api/reminders?key=CRON_SECRET (por ejemplo desde cron-job.org)
const {init,sendTo}=require('./_lib');
const pad=n=>String(n).padStart(2,'0');
module.exports=async(req,res)=>{
  if(!process.env.CRON_SECRET||(req.query&&req.query.key)!==process.env.CRON_SECRET)return res.status(401).json({error:'unauthorized'});
  try{
    const a=init();const db=a.firestore();
    const now=new Date(Date.now()-3*3600e3);// hora de Argentina (UTC-3)
    const date=`${now.getUTCFullYear()}-${pad(now.getUTCMonth()+1)}-${pad(now.getUTCDate())}`;const nowMin=now.getUTCHours()*60+now.getUTCMinutes();
    const salons=await db.collection('salons').get();let count=0;
    for(const s of salons.docs){
      const lic=(await db.doc('licenses/'+s.id).get()).data()||{};if(lic.status==='suspendida')continue;
      const sal=s.data();const appts=await db.collection(`salons/${s.id}/appts`).where('date','==',date).get();
      for(const d of appts.docs){const x=d.data();if(x.status!=='confirmado'||x.rem30Sent||x.rem30)continue;
        const [h,m]=String(x.time).split(':').map(Number);const diff=h*60+m-nowMin;if(diff<=0||diff>35)continue;
        const svc=(sal.services||[]).find(v=>v.id===x.serviceId)||{name:'tu turno'};
        const text=`⏰ Recordatorio: ${svc.name} hoy a las ${x.time} hs (en ${diff} min). ¡Te esperamos!`;
        const nid='rem'+d.id;
        await db.doc(`salons/${s.id}/notifs/${nid}`).set({id:nid,to:x.userId,text,ts:Date.now(),read:false,icon:'clock',pushed:true});
        await d.ref.update({rem30Sent:true,rem30:true});
        await sendTo(a,[x.userId],{title:(sal.salon&&sal.salon.name)||'Stilista',body:text,link:'/'+s.id});count++}
    }
    res.json({ok:true,date,sent:count});
  }catch(e){res.status(500).json({error:String(e.message||e)})}
};
