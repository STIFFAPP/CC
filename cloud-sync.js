(function(){
const SUPABASE_URL='https://cxrfobwwjfnzwjunzrvs.supabase.co';
const SUPABASE_KEY='sb_publishable_a7nF_FXsb6HRHPxQsUDfWQ_DPsx2jnS';
const SYNC_APP_KEY='confidence-hub';
const SYNC_PREFIXES=['confidenceState:','confidenceWeek:','confidenceActivePlan','privateCourseV3Complete','stiffAdminSettings','kb-life-manager-v1','kb-workout-','hubCustomApps'];
let sb=null,user=null,pushTimer=null,applying=false;
function tracked(k){return SYNC_PREFIXES.some(p=>k===p||k.startsWith(p));}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
async function init(){
 try{
  await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.0/dist/umd/supabase.min.js');
  sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,experimental:{passkey:true}}});
  window.KBSupabase=sb;
  const {data}=await sb.auth.getSession(); user=data.session?.user||null; if(user) await pull(); renderCloudUi();
  sb.auth.onAuthStateChange(async(_e,s)=>{user=s?.user||null;if(user)await pull();renderCloudUi();});
 }catch(e){console.warn('Cloud sync unavailable',e);renderCloudUi();}
}
function snapshot(){const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(tracked(k))o[k]=localStorage.getItem(k)}return o}
async function pull(){
 if(!sb||!user)return;
 const {data,error}=await sb.from('user_app_data').select('data').eq('user_id',user.id).eq('app_key',SYNC_APP_KEY).maybeSingle();
 if(error){console.warn('Cloud pull failed',error);return}
 if(data?.data){applying=true;for(const [k,v] of Object.entries(data.data))localStorage.setItem(k,v);applying=false;window.dispatchEvent(new Event('kb-cloud-loaded'));}
 else await push();
}
async function push(){
 if(!sb||!user||applying)return;
 const payload={user_id:user.id,app_key:SYNC_APP_KEY,data:snapshot(),updated_at:new Date().toISOString()};
 const {error}=await sb.from('user_app_data').upsert(payload,{onConflict:'user_id,app_key'});
 if(error)console.warn('Cloud push failed',error);
}
const oldSet=Storage.prototype.setItem,oldRemove=Storage.prototype.removeItem;
Storage.prototype.setItem=function(k,v){oldSet.call(this,k,v);if(this===localStorage&&tracked(String(k))&&!applying){clearTimeout(pushTimer);pushTimer=setTimeout(push,500)}};
Storage.prototype.removeItem=function(k){oldRemove.call(this,k);if(this===localStorage&&tracked(String(k))&&!applying){clearTimeout(pushTimer);pushTimer=setTimeout(push,500)}};
async function emailSignIn(){
 if(!sb)return alert('Cloud service is not ready yet.');
 const email=prompt('Enter your email address. We’ll send you a secure sign-in link.');if(!email)return;
 const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:location.href.split('#')[0].split('?')[0]}});
 alert(error?error.message:'Check your email for the sign-in link, then return here.');
}
async function addPasskey(){
 if(!sb||!user)return alert('Sign in by email first, then add Face ID / Touch ID.');
 const {error}=await sb.auth.registerPasskey();
 alert(error?error.message:'Passkey added. You can now sign in with Face ID / Touch ID on supported devices.');
}
async function passkeySignIn(){if(!sb)return;const {error}=await sb.auth.signInWithPasskey();if(error)alert(error.message);}
async function signOut(){if(sb)await sb.auth.signOut();location.reload();}
function renderCloudUi(){
 document.getElementById('cloudSyncBox')?.remove();
 const box=document.createElement('div');box.id='cloudSyncBox';
 box.style.cssText='position:fixed;right:12px;bottom:12px;z-index:99999;background:#111827;color:white;border:1px solid #374151;border-radius:14px;padding:10px;box-shadow:0 8px 30px #0005;font:13px system-ui;max-width:280px';
 const signed=!!user;
 box.innerHTML=signed?`<b>☁ Synced</b><div style="opacity:.75;margin:3px 0 8px">${user.email||'Signed in'}</div><button id="kbPass">Add Face ID / Touch ID</button> <button id="kbOut">Sign out</button>`:`<b>🔒 Private sync</b><div style="opacity:.75;margin:3px 0 8px">Sign in to sync this app across devices.</div><button id="kbFace">Unlock with Face ID / Passkey</button><br><button id="kbEmail" style="margin-top:6px">First-time email sign-in</button>`;
 document.body.appendChild(box);
 for(const b of box.querySelectorAll('button'))b.style.cssText='border:0;border-radius:8px;padding:7px 9px;cursor:pointer;margin-right:3px';
 box.querySelector('#kbEmail')?.addEventListener('click',emailSignIn);box.querySelector('#kbFace')?.addEventListener('click',passkeySignIn);box.querySelector('#kbPass')?.addEventListener('click',addPasskey);box.querySelector('#kbOut')?.addEventListener('click',signOut);
}
window.KBCloud={push,pull};init();
})();
