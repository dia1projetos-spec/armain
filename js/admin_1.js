const auth = firebase.auth();
const db = firebase.firestore();

// CONFIG CLOUDINARY - reemplaza
const CLOUD_NAME = 'TU_CLOUD_NAME';
const UPLOAD_PRESET = 'armain_unsigned';

const loginBox = document.getElementById('login-box');
const panel = document.getElementById('panel');

document.getElementById('login').onclick = async ()=>{
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try{ await auth.signInWithEmailAndPassword(email, pass); }catch(e){ alert(e.message); }
};
document.getElementById('logout').onclick = ()=>auth.signOut();

auth.onAuthStateChanged(user=>{
  if(user){ loginBox.style.display='none'; panel.style.display='block'; initAdmin(); }
  else{ loginBox.style.display='block'; panel.style.display='none'; }
});

function initAdmin(){
  document.querySelectorAll('.sidebar nav button').forEach(b=>{
    b.onclick = ()=>{ document.querySelectorAll('.tab').forEach(t=>t.style.display='none'); document.getElementById('tab-'+b.dataset.tab).style.display='block'; };
  });
  loadSlidesAdmin(); loadCatsAdmin(); loadProdsAdmin(); loadCatSelect();
}

// SLIDES
async function uploadToCloudinary(file){
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
  const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(url,{method:'POST',body:fd}); return res.json();
}
document.getElementById('upload-slide').onclick = async ()=>{
  const f = document.getElementById('slide-file').files[0]; if(!f) return;
  const up = await uploadToCloudinary(f);
  await db.collection('slides').add({url: up.secure_url, orden: Date.now()});
  loadSlidesAdmin();
};
async function loadSlidesAdmin(){
  const snap = await db.collection('slides').orderBy('orden').get();
  const box = document.getElementById('slides-list'); box.innerHTML='';
  snap.forEach(doc=>{
    const s=doc.data();
    const div=document.createElement('div'); div.className='item';
    div.innerHTML=`<img src="${s.url}"/><button data-id="${doc.id}">Eliminar</button>`;
    div.querySelector('button').onclick=async()=>{ await db.collection('slides').doc(doc.id).delete(); loadSlidesAdmin(); };
    box.appendChild(div);
  });
}

// CATEGORIAS
document.getElementById('add-cat').onclick = async ()=>{
  const nombre = document.getElementById('cat-nombre').value;
  const descripcion = document.getElementById('cat-desc').value;
  if(!nombre) return;
  await db.collection('categorias').add({nombre,descripcion});
  loadCatsAdmin(); loadCatSelect();
};
async function loadCatsAdmin(){
  const snap = await db.collection('categorias').get();
  const box = document.getElementById('cats-list'); box.innerHTML='';
  snap.forEach(d=>{ const c=d.data(); const div=document.createElement('div'); div.className='item'; div.innerHTML=`<strong>${c.nombre}</strong><p>${c.descripcion||''}</p>`; box.appendChild(div); });
}
async function loadCatSelect(){
  const sel = document.getElementById('prod-cat'); sel.innerHTML='';
  const snap = await db.collection('categorias').get();
  snap.forEach(d=>{ const o=document.createElement('option'); o.value=d.id; o.textContent=d.data().nombre; sel.appendChild(o); });
}

// PRODUCTOS
document.getElementById('add-prod').onclick = async ()=>{
  const nombre = document.getElementById('prod-nombre').value;
  const marca = document.getElementById('prod-marca').value;
  const precio = Number(document.getElementById('prod-precio').value);
  const cat = document.getElementById('prod-cat').value;
  const desc = document.getElementById('prod-desc').value;
  const notas = document.getElementById('prod-notas').value.split(',').map(s=>s.trim()).filter(Boolean);
  const file = document.getElementById('prod-imagen-file').files[0];
  if(!nombre||!file) return alert('Completa nombre e imagen');
  const up = await uploadToCloudinary(file);
  await db.collection('productos').add({nombre,marca,precio,categoria:cat,descripcion:desc,notas,imagen:up.secure_url,creado:Date.now(),slug:nombre.toLowerCase().replace(/\s+/g,'-')});
  alert('Producto guardado'); loadProdsAdmin();
};
async function loadProdsAdmin(){
  const snap = await db.collection('productos').orderBy('creado','desc').get();
  const box = document.getElementById('prods-list'); box.innerHTML='';
  snap.forEach(d=>{ const p=d.data(); const div=document.createElement('div'); div.className='item'; div.innerHTML=`<img src="${p.imagen}"/><strong>${p.nombre}</strong><p>$${p.precio}</p><a href="producto.html?id=${d.id}" target="_blank">Ver página</a>`; box.appendChild(div); });
}

// ADMINS
document.getElementById('add-admin').onclick = async ()=>{
  const email = document.getElementById('new-admin-email').value;
  const pass = document.getElementById('new-admin-pass').value;
  try{
    // Nota: crear usuarios desde cliente requiere segunda app o Cloud Functions. Aquí demo simple:
    const secondary = firebase.initializeApp(firebase.app().options, 'secondary');
    await secondary.auth().createUserWithEmailAndPassword(email, pass);
    await secondary.auth().signOut();
    alert('Administrador creado: '+email);
  }catch(e){ alert('Error: '+e.message+' (recomendado usar Cloud Function)'); }
};
