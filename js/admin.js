const auth = firebase.auth();
const db = firebase.firestore();
const CLOUD_NAME = 'dlizw7yxk';
const UPLOAD_PRESET = 'armain_unsigned';
const loginScreen = document.getElementById('login-screen');
const adminApp = document.getElementById('admin-app');
document.getElementById('login').onclick = async ()=>{
  const email=document.getElementById('email').value.trim();
  const pass=document.getElementById('password').value;
  const btn=document.getElementById('login');
  btn.disabled=true; btn.innerHTML='ENTRANDO...';
  try{
    const persistence=document.getElementById('remember')?.checked?firebase.auth.Auth.Persistence.LOCAL:firebase.auth.Auth.Persistence.SESSION;
    await auth.setPersistence(persistence);
    await auth.signInWithEmailAndPassword(email,pass);
  }catch(err){
    alert('Erro ao entrar: '+err.message);
    btn.disabled=false; btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> ENTRAR';
  }
};
document.getElementById('logout').onclick=()=>auth.signOut();
auth.onAuthStateChanged(user=>{
  if(user){loginScreen.style.display='none';adminApp.style.display='grid';initAdmin();}
  else{loginScreen.style.display='flex';adminApp.style.display='none';}
});
function initAdmin(){
  document.querySelectorAll('.sidebar nav button').forEach(b=>{b.onclick=()=>{document.querySelectorAll('.sidebar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tab').forEach(t=>t.style.display='none');document.getElementById('tab-'+b.dataset.tab).style.display='block'}});
  loadSlidesAdmin();loadCatsAdmin();loadProdsAdmin();loadCatSelect();
}
async function uploadToCloudinary(file){
  try{
    const url=`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
    const fd=new FormData();fd.append('file',file);fd.append('upload_preset',UPLOAD_PRESET);fd.append('folder','armain');
    const r=await fetch(url,{method:'POST',body:fd});
    const data=await r.json();
    if(!r.ok) throw new Error(data.error?.message||'Upload falhou');
    return data;
  }catch(e){
    alert('Cloudinary erro: '+e.message+'\n\nVerifique se o preset "'+UPLOAD_PRESET+'" existe como UNSIGNED em https://console.cloudinary.com');
    throw e;
  }
}
document.getElementById('upload-slide').onclick=async()=>{
  const f=document.getElementById('slide-file').files[0];
  if(!f) return alert('Selecione uma imagem');
  try{const up=await uploadToCloudinary(f);await db.collection('slides').add({url:up.secure_url,orden:Date.now()});alert('Slide salvo!');loadSlidesAdmin();}catch(e){}
};
async function loadSlidesAdmin(){const s=await db.collection('slides').orderBy('orden').get();const b=document.getElementById('slides-list');b.innerHTML='';s.forEach(d=>{const x=d.data();const i=document.createElement('div');i.innerHTML=`<img src="${x.url}"/><button onclick="if(confirm('Eliminar?')){db.collection('slides').doc('${d.id}').delete().then(loadSlidesAdmin)}">Eliminar</button>`;b.appendChild(i)});}
document.getElementById('add-cat').onclick=async()=>{const n=document.getElementById('cat-nombre').value;const d=document.getElementById('cat-desc').value;if(!n) return alert('Nombre requerido');try{await db.collection('categorias').add({nombre:n,descripcion:d});document.getElementById('cat-nombre').value='';document.getElementById('cat-desc').value='';loadCatsAdmin();loadCatSelect();}catch(e){alert('Firestore erro: '+e.message)}};
async function loadCatsAdmin(){try{const s=await db.collection('categorias').get();const b=document.getElementById('cats-list');b.innerHTML='';s.forEach(d=>{const c=d.data();b.innerHTML+=`<div><strong>${c.nombre}</strong><p>${c.descripcion||''}</p></div>`})}catch(e){console.error(e)}}
async function loadCatSelect(){const sel=document.getElementById('prod-cat');sel.innerHTML='<option value="">Selecione categoria</option>';const s=await db.collection('categorias').get();s.forEach(d=>{const o=document.createElement('option');o.value=d.id;o.textContent=d.data().nombre;sel.appendChild(o)})}
document.getElementById('add-prod').onclick=async()=>{const n=document.getElementById('prod-nombre').value;const m=document.getElementById('prod-marca').value;const p=Number(document.getElementById('prod-precio').value);const c=document.getElementById('prod-cat').value;const d=document.getElementById('prod-desc').value;const no=document.getElementById('prod-notas').value.split(',').map(s=>s.trim()).filter(Boolean);const f=document.getElementById('prod-imagen-file').files[0];if(!n||!f) return alert('Nombre e imagen requeridos');try{const btn=document.getElementById('add-prod');btn.disabled=true;btn.textContent='Subiendo...';const up=await uploadToCloudinary(f);await db.collection('productos').add({nombre:n,marca:m,precio:p,categoria:c,descripcion:d,notas:no,imagen:up.secure_url,creado:Date.now()});alert('Producto guardado!');btn.disabled=false;btn.textContent='Guardar producto';loadProdsAdmin();}catch(e){document.getElementById('add-prod').disabled=false;document.getElementById('add-prod').textContent='Guardar producto'}};
async function loadProdsAdmin(){try{const s=await db.collection('productos').orderBy('creado','desc').get();const b=document.getElementById('prods-list');b.innerHTML='';s.forEach(d=>{const p=d.data();b.innerHTML+=`<div><img src="${p.imagen}"><strong>${p.nombre}</strong><br><small>$${p.precio}</small></div>`})}catch(e){console.error(e)}}
