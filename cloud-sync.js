(function(){
const SUPABASE_URL='https://cxrfobwwjfnzwjunzrvs.supabase.co';
const SUPABASE_KEY='sb_publishable_a7nF_FXsb6HRHPxQsUDfWQ_DPsx2jnS';
const SYNC_APP_KEY='confidence-hub';
const SYNC_PREFIXES=['confidenceState:','confidenceWeek:','confidenceActivePlan','privateCourseV3Complete','stiffAdminSettings','kb-life-manager-v1','kb-workout-','hubCustomApps'];
let sb=null,user=null,pushTimer=null,applying=false;
const $=id=>document.getElementById(id);
function tracked(k){return SYNC_PREFIXES.some(p=>k===p||k.startsWith(p));}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
async function init(){
 try{
  await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.0/dist/umd/supabase.min.js');
  sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,experimental:{passkey:true}}});
  window.KBSupabase=sb;
  const {data}=await sb.auth.getSession(); user=data.session?.user||null; if(user) await pull(); renderAuthUi();
  sb.auth.onAuthStateChange(async(_e,s)=>{user=s?.user||null;if(user)await pull();renderAuthUi();});
 }catch(e){console.warn('Cloud sync unavailable',e);renderAuthUi('Cloud service could not load. Refresh and try again.');}
}
function snapshot(){const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(tracked(k))o[k]=localStorage.getItem(k)}return o}
async function pull(){if(!sb||!user)return;const {data,error}=await sb.from('user_app_data').select('data').eq('user_id',user.id).eq('app_key',SYNC_APP_KEY).maybeSingle();if(error){console.warn('Cloud pull failed',error);return}if(data?.data){applying=true;for(const [k,v] of Object.entries(data.data))localStorage.setItem(k,v);applying=false;window.dispatchEvent(new Event('kb-cloud-loaded'));}else await push();}
async function push(){if(!sb||!user||applying)return;const payload={user_id:user.id,app_key:SYNC_APP_KEY,data:snapshot(),updated_at:new Date().toISOString()};const {error}=await sb.from('user_app_data').upsert(payload,{onConflict:'user_id,app_key'});if(error)console.warn('Cloud push failed',error);}
const oldSet=Storage.prototype.setItem,oldRemove=Storage.prototype.removeItem;
Storage.prototype.setItem=function(k,v){oldSet.call(this,k,v);if(this===localStorage&&tracked(String(k))&&!applying){clearTimeout(pushTimer);pushTimer=setTimeout(push,500)}};
Storage.prototype.removeItem=function(k){oldRemove.call(this,k);if(this===localStorage&&tracked(String(k))&&!applying){clearTimeout(pushTimer);pushTimer=setTimeout(push,500)}};
async function emailSignIn(){if(!sb)return alert('Cloud service is not ready yet.');const email=prompt('Enter your email address. We’ll send you a secure sign-in link.');if(!email)return;const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:location.href.split('#')[0].split('?')[0]}});alert(error?error.message:'Check your email for the sign-in link, then return here.');}
async function addPasskey(){if(!sb||!user)return alert('Sign in by email first, then add Face ID / Touch ID.');const {error}=await sb.auth.registerPasskey();alert(error?error.message:'Passkey added. You can now sign in with Face ID / Touch ID on supported devices.');}
async function passkeySignIn(){if(!sb)return;const {error}=await sb.auth.signInWithPasskey();if(error)alert(error.message);}
async function signOut(){if(sb)await sb.auth.signOut();location.reload();}
function closeAccount(){ $('accountPopover')?.classList.add('hidden'); }
function renderAccount(){
 const pop=$('accountPopover'); if(!pop||!user)return;
 pop.innerHTML=`<div class="account-title">MOJOMAN</div><div class="account-email">${user.email||'Signed in'} · ☁ Synced</div><button id="acctAdd">＋ Add App</button><button id="acctManage">⚙ Manage Apps</button><button id="acctPass">🔐 Add Face ID / Touch ID</button><button id="acctOut">↪ Sign out</button>`;
 $('acctAdd').onclick=()=>{closeAccount();window.openAdmin?.(false)};$('acctManage').onclick=()=>{closeAccount();window.openAdmin?.(true)};$('acctPass').onclick=addPasskey;$('acctOut').onclick=signOut;
}
function renderAuthUi(errorText=''){
 document.body.classList.remove('auth-pending');
 const signed=!!user, auth=$('authLanding'), account=$('accountButton');
 if(signed){auth?.classList.add('hidden');account?.classList.remove('hidden');renderAccount();}
 else{auth?.classList.remove('hidden');account?.classList.add('hidden');closeAccount();$('landing')?.classList.add('hidden');$('app')?.classList.add('hidden');}
 if($('authStatus'))$('authStatus').textContent=errorText;
}
$('landingEmail')?.addEventListener('click',emailSignIn);$('landingPasskey')?.addEventListener('click',passkeySignIn);
$('accountButton')?.addEventListener('click',()=>{const p=$('accountPopover');p.classList.toggle('hidden');if(!p.classList.contains('hidden'))renderAccount();});
document.addEventListener('click',e=>{const p=$('accountPopover'),b=$('accountButton');if(p&&!p.classList.contains('hidden')&&!p.contains(e.target)&&!b?.contains(e.target))closeAccount();});
window.KBCloud={push,pull};init();
})();
