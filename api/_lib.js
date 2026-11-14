const admin=require('firebase-admin');
function init(){if(!admin.apps.length){const sa=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT||'{}');admin.initializeApp({credential:admin.credential.cert(sa)})}return admin}
async function tokensFor(db,uids){const out=[];for(const uid of uids){const d=await db.doc('users/'+uid).get();const t=(d.exists&&d.data().tokens)||[];t.forEach(x=>out.push({uid,t:x}))}return out}
async function sendTo(a,uids,{title,body,link}){
  const db=a.firestore();const list=await tokensFor(db,uids);if(!list.length)return 0;
  const r=await a.messaging().sendEachForMulticast({tokens:list.map(x=>x.t),webpush:{notification:{title,body,icon:'/icon-192.png'},fcmOptions:{link}}});
  const bad=[];r.responses.forEach((x,i)=>{if(!x.success&&/registration-token-not-registered|invalid-registration-token|invalid-argument/.test(x.error&&x.error.code||''))bad.push(list[i])});
  for(const b of bad)await db.doc('users/'+b.uid).update({tokens:admin.firestore.FieldValue.arrayRemove(b.t)}).catch(()=>{});
  return r.successCount}
module.exports={init,sendTo,admin};
