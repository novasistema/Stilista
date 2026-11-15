// Acciones del creador que necesitan permisos de administrador de Firebase:
// borrar un comercio completo y cambiar la contraseña de su administrador.
const {init}=require('./_lib');
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).end();
  try{
    const a=init();const db=a.firestore();
    const tok=(req.headers.authorization||'').replace(/^Bearer /,'');const dec=await a.auth().verifyIdToken(tok);
    const ce=(process.env.CREATOR_EMAIL||'').toLowerCase();
    if(!ce||!dec.email||dec.email.toLowerCase()!==ce)return res.status(403).json({error:'Solo el creador puede hacer esto'});
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});const {action,sid}=body;
    if(!/^[a-z0-9-]{2,40}$/.test(sid||''))return res.status(400).json({error:'Comercio inválido'});
    if(action==='setPassword'){
      const pw=String(body.password||'');if(pw.length<6)return res.status(400).json({error:'La contraseña tiene que tener al menos 6 caracteres'});
      const q=await db.collection('users').where('salonId','==',sid).where('role','==','admin').get();
      if(q.empty)return res.status(404).json({error:'No encontré el administrador de este comercio'});
      const u=q.docs[0];await a.auth().updateUser(u.id,{password:pw});
      return res.json({ok:true,email:u.data().email});
    }
    if(action==='delete'){
      const q=await db.collection('users').where('salonId','==',sid).get();const uids=q.docs.map(d=>d.id);
      await db.recursiveDelete(db.doc('salons/'+sid));
      await db.doc('licenses/'+sid).delete().catch(()=>{});
      for(const d of q.docs)await d.ref.delete();
      if(uids.length)await a.auth().deleteUsers(uids);
      return res.json({ok:true,deletedUsers:uids.length});
    }
    res.status(400).json({error:'Acción desconocida'});
  }catch(e){res.status(500).json({error:String(e.message||e)})}
};
