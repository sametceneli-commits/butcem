import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Supabase Dashboard > Project Settings > API bölümündeki değerlerle doldur.
const SUPABASE_URL = "https://tuakoggrkucmlitbnnhr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ajLgpBjywlJYk_VLlAHrvw_arhRDzhd";
const configured = !SUPABASE_URL.includes("SUPABASE_") && !SUPABASE_ANON_KEY.includes("SUPABASE_");
const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY"}).format(Number(n||0));
const today = new Date().toISOString().slice(0,10);
let type = "expense", transactions = [], recurring = [], user = null;
const categories = {
  income:["Maaş","Serbest çalışma","Yatırım","Diğer"],
  expense:["Market","Konut","Fatura","Ulaşım","Yeme-İçme","Sağlık","Alışveriş","Eğlence","Abonelik","Diğer"]
};
function setMessage(id,msg){$(id).textContent=msg}
function setCategories(){ $("category").innerHTML=categories[type].map(x=>`<option>${x}</option>`).join(""); }
function showApp(session){user=session?.user||null;$("authPanel").classList.toggle("hidden",!!user);$("dashboard").classList.toggle("hidden",!user);$("signOut").classList.toggle("hidden",!user);if(user)loadData()}
async function loadData(){
  const [t,r]=await Promise.all([
    supabase.from("transactions").select("*").order("occurred_on",{ascending:false}).limit(500),
    supabase.from("recurring_payments").select("*").order("created_at",{ascending:false})
  ]);
  if(t.error||r.error){setMessage("txMessage",t.error?.message||r.error?.message);return}
  transactions=t.data||[];recurring=r.data||[];render();
}
function render(){
  const income=transactions.filter(x=>x.type==="income").reduce((s,x)=>s+Number(x.amount),0);
  const expense=transactions.filter(x=>x.type==="expense").reduce((s,x)=>s+Number(x.amount),0);
  $("balance").textContent=money(income-expense);$("incomeTotal").textContent=money(income);$("expenseTotal").textContent=money(expense);
  const month=$("month").value;
  const mt=transactions.filter(x=>x.occurred_on?.startsWith(month));
  $("monthIncome").textContent=money(mt.filter(x=>x.type==="income").reduce((s,x)=>s+Number(x.amount),0));
  $("monthExpense").textContent=money(mt.filter(x=>x.type==="expense").reduce((s,x)=>s+Number(x.amount),0));
  $("transactions").innerHTML=transactions.length?transactions.map(x=>`<div class="item"><div><b>${esc(x.description||x.category)}</b><small>${esc(x.category)} · ${x.occurred_on} · ${x.payment_method==="card"?"Kredi kartı":"Nakit / Banka"}${x.card_name?" · "+esc(x.card_name):""}</small></div><b class="${x.type==="income"?"positive":"negative"}">${x.type==="income"?"+":"−"}${money(x.amount)}</b><button data-delete="${x.id}">Sil</button></div>`).join(""):'<p class="muted">Henüz işlem yok.</p>';
  $("recurringList").innerHTML=recurring.length?recurring.map(x=>`<div class="item"><div><b>${esc(x.name)}</b><small>Her ayın ${x.day_of_month}. günü · ${esc(x.category)}</small></div><b>${money(x.amount)}</b><button data-rec-delete="${x.id}">Sil</button></div>`).join(""):'<p class="muted">Henüz tekrarlayan ödeme eklenmedi.</p>';
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("month").value=today.slice(0,7);$("date").value=today;setCategories();
document.querySelectorAll("[data-type]").forEach(b=>b.addEventListener("click",()=>{type=b.dataset.type;document.querySelectorAll("[data-type]").forEach(x=>x.classList.toggle("active",x===b));setCategories()}));
$("payment").addEventListener("change",()=>$("cardLabel").classList.toggle("hidden",$("payment").value!=="card"));
$("signUp").onclick=async()=>{if(!supabase){setMessage("authMessage","Önce Supabase proje bilgileri eklenmeli.");return}const {error}=await supabase.auth.signUp({email:$("email").value,password:$("password").value});setMessage("authMessage",error?.message||"Kayıt bağlantısı e-posta adresine gönderildi. E-postanı kontrol et.")};
$("signIn").onclick=async()=>{if(!supabase){setMessage("authMessage","Önce Supabase proje bilgileri eklenmeli.");return}const {error}=await supabase.auth.signInWithPassword({email:$("email").value,password:$("password").value});setMessage("authMessage",error?.message||"")};
$("forgotPassword").onclick=async()=>{
  if(!supabase){setMessage("authMessage","Supabase bağlantısı yapılandırılmamış.");return}
  const email=$("email").value.trim();
  if(!email){setMessage("authMessage","Önce e-posta adresini yaz.");$("email").focus();return}
  const redirectTo=`${window.location.origin}${window.location.pathname}?resetPassword=1`;
  const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo});
  setMessage("authMessage",error?`Şifre sıfırlama e-postası gönderilemedi: ${error.message}`:"Şifre sıfırlama bağlantısı e-posta adresine gönderildi. Gelen kutunu ve spam klasörünü kontrol et.");
};
$("passwordForm").onsubmit=async e=>{
  e.preventDefault();
  const password=$("newPassword").value;
  if(password.length<8){setMessage("passwordMessage","Şifre en az 8 karakter olmalı.");return}
  if(password!==$("confirmPassword").value){setMessage("passwordMessage","Girdiğin şifreler eşleşmiyor.");return}
  const {error}=await supabase.auth.updateUser({password});
  if(error){setMessage("passwordMessage",`Şifre değiştirilemedi: ${error.message}`);return}
  e.target.reset();
  setMessage("passwordMessage","Şifren başarıyla güncellendi.");
  if(new URLSearchParams(window.location.search).has("resetPassword")){
    window.history.replaceState({},document.title,window.location.pathname);
  }
};
$("signOut").onclick=()=>supabase.auth.signOut();
$("transactionForm").onsubmit=async e=>{e.preventDefault();const amount=Number($("amount").value);if(!(amount>0))return;const row={user_id:user.id,type,amount,category:$("category").value,occurred_on:$("date").value,payment_method:$("payment").value,card_name:$("payment").value==="card"?$("cardName").value:null,description:$("description").value.trim()};const {error}=await supabase.from("transactions").insert(row);if(error){setMessage("txMessage",error.message);return}e.target.reset();$("date").value=today;$("payment").value="cash";$("cardLabel").classList.add("hidden");setMessage("txMessage","İşlem kaydedildi.");await loadData()};
$("recurringForm").onsubmit=async e=>{e.preventDefault();const row={user_id:user.id,name:$("recName").value.trim(),amount:Number($("recAmount").value),day_of_month:Number($("recDay").value),category:$("recCategory").value};const {error}=await supabase.from("recurring_payments").insert(row);if(error){setMessage("txMessage",error.message);return}e.target.reset();await loadData()};
$("transactions").onclick=async e=>{const id=e.target.dataset.delete;if(id&&confirm("Bu işlemi silmek istiyor musun?")){await supabase.from("transactions").delete().eq("id",id);await loadData()}};
$("recurringList").onclick=async e=>{const id=e.target.dataset.recDelete;if(id&&confirm("Bu tekrarlayan ödemeyi silmek istiyor musun?")){await supabase.from("recurring_payments").delete().eq("id",id);await loadData()}};
$("month").onchange=render;
$("exportCsv").onclick=()=>{const rows=[["Tarih","Tür","Tutar (TRY)","Kategori","Ödeme yöntemi","Kart","Açıklama"],...transactions.map(x=>[x.occurred_on,x.type,x.amount,x.category,x.payment_method,x.card_name||"",x.description||""])];const csv="\uFEFF"+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="butcem-islemler.csv";a.click();URL.revokeObjectURL(a.href)};
if(!configured){$("authPanel").classList.remove("hidden");$("dashboard").classList.add("hidden");setMessage("authMessage","Kurulum gerekli: README dosyasındaki Supabase adımlarını tamamla.")}else{supabase.auth.getSession().then(({data})=>showApp(data.session));supabase.auth.onAuthStateChange((event,session)=>{
  showApp(session);
  if(event==="PASSWORD_RECOVERY" || new URLSearchParams(window.location.search).has("resetPassword")){
    $("accountSettings").open=true;
    setMessage("passwordMessage","Yeni şifreni belirleyebilirsin.");
    $("newPassword").focus();
  }
})}
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
