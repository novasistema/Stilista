// Envía la notificación push de un aviso guardado en Firestore.
const {init,sendTo}=require('./_lib');
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).end();
  try{
    const a=init();const db=a.firestore();
    const tok=(req.headers.authorization||'').replace(/^Bearer /,'');const dec=await a.auth().verifyIdToken(tok);
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});const {sid,id}=body;
    if(!/^[a-z0-9-]{2,40}$/.test(sid||'')||!id)return res.status(400).json({error:'bad request'});
    const ref=db.doc(`salons/${sid}/notifs/${id}`);const snap=await ref.get();if(!snap.exists)return res.status(404).json({});
    const n=snap.data();if(n.pushed)return res.json({ok:true,already:true});
    const isCreator=process.env.CREATOR_EMAIL&&dec.email&&dec.email.toLowerCase()===process.env.CREATOR_EMAIL.toLowerCase();
    const su=(await db.doc('users/'+dec.uid).get()).data()||{};
    if(!isCreator&&su.salonId!==sid)return res.status(403).json({error:'forbidden'});
    let uids=[];
    if(n.to==='admin'){const q=await db.collection('users').where('salonId','==',sid).where('role','==','admin').get();uids=q.docs.map(d=>d.id)}
    else{if(!isCreator&&su.role!=='admin'&&n.to!==dec.uid)return res.status(403).json({error:'forbidden'});uids=[n.to]}
    const sal=(await db.doc('salons/'+sid).get()).data()||{};
    const sent=await sendTo(a,uids,{title:(sal.salon&&sal.salon.name)||'Stilista',body:n.text,link:'/'+sid});
    await ref.update({pushed:true});
    res.json({ok:true,sent});
  }catch(e){res.status(500).json({error:String(e.message||e)})}
};
