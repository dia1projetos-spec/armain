const auth = firebase.auth();
const db = firebase.firestore();
const CLOUD_NAME = 'TU_CLOUD_NAME';
const UPLOAD_PRESET = 'armain_unsigned';
const loginBox = document.getElementById('login-box');
const panel = document.getElementById('panel');
document.getElementById('login').onclick = async ()=>{const e=document.getElementById('email').value;const p=document.getElementById('password').value;try{await auth.signInWithEmailAndPassword(e,p)}catch(err){alert(err.message)}};
document.getElementById('logout').onclick = ()=>auth.signOut();
auth.onAuthStateChanged(user=>{
  const sidebar = document.querySelector('.sidebar');
  const layout = document.querySelector('.admin-layout');
  if(user){loginBox.style.display='none';panel.style.display='block';sidebar.style.display='flex';layout.style.gridTemplateColumns='240px 1fr';initAdmin();}
  else{loginBox.style.display='block';panel.style.display='none';sidebar.style.display='none';layout.style.gridTemplateColumns='1fr';}
});
function initAdmin(){document.querySelectorAll('.sidebar nav button').forEach(b=>{b.onclick=()=>{document.querySelectorAll('.tab').forEach(t=>t.style.display='none');document.getElementById('tab-'+b.dataset.tab).style.display='block'}});loadSlidesAdmin();loadCatsAdmin();loadProdsAdmin();loadCatSelect();}
async function uploadToCloudinary(file){const url=`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;const fd=new FormData();fd.append('file',file);fd.append('upload_preset',UPLOAD_PRESET);const r=await fetch(url,{method:'POST',body:fd});return r.json()}
document.getElementById('upload-slide').onclick=async()=>{const f=document.getElementById('slide-file').files[0];if(!f)return;const up=await uploadToCloudinary(f);await db.collection('slides').add({url:up.secure_url,orden:Date.now()});loadSlidesAdmin()};
async function loadSlidesAdmin(){const s=await db.collection('slides').orderBy('orden').get();const b=document.getElementById('slides-list');b.innerHTML='';s.forEach(d=>{const x=d.data();const i=document.createElement('div');i.innerHTML=`<img src="${x.url}" style="width:100%;height:120px;object-fit:cover;border-radius:8px"/><button onclick="db.collection('slides').doc('${d.id}').delete().then(loadSlidesAdmin)">Eliminar</button>`;b.appendChild(i)})}
document.getElementById('add-cat').onclick=async()=>{const n=document.getElementById('cat-nombre').value;const d=document.getElementById('cat-desc').value;if(!n)return;await db.collection('categorias').add({nombre:n,descripcion:d});loadCatsAdmin();loadCatSelect()};
async function loadCatsAdmin(){const s=await db.collection('categorias').get();const b=document.getElementById('cats-list');b.innerHTML='';s.forEach(d=>{const c=d.data();b.innerHTML+=`<div><strong>${c.nombre}</strong><p>${c.descripcion||''}</p></div>`})}
async function loadCatSelect(){const sel=document.getElementById('prod-cat');sel.innerHTML='';const s=await db.collection('categorias').get();s.forEach(d=>{const o=document.createElement('option');o.value=d.id;o.textContent=d.data().nombre;sel.appendChild(o)})}
document.getElementById('add-prod').onclick=async()=>{const n=document.getElementById('prod-nombre').value;const m=document.getElementById('prod-marca').value;const p=Number(document.getElementById('prod-precio').value);const c=document.getElementById('prod-cat').value;const d=document.getElementById('prod-desc').value;const no=document.getElementById('prod-notas').value.split(',').map(s=>s.trim()).filter(Boolean);const f=document.getElementById('prod-imagen-file').files[0];if(!n||!f)return alert('Completa');const up=await uploadToCloudinary(f);await db.collection('productos').add({nombre:n,marca:m,precio:p,categoria:c,descripcion:d,notas:no,imagen:up.secure_url,creado:Date.now()});alert('Guardado');loadProdsAdmin()};
async function loadProdsAdmin(){const s=await db.collection('productos').orderBy('creado','desc').get();const b=document.getElementById('prods-list');b.innerHTML='';s.forEach(d=>{const p=d.data();b.innerHTML+=`<div><img src="${p.imagen}" style="width:100%;height:100px;object-fit:cover"><strong>${p.nombre}</strong></div>`})}
