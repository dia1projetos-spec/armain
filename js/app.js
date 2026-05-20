// Loader Armain
window.addEventListener('load', ()=>{
  const loader = document.getElementById('loader');
  const vid = document.getElementById('loader-video');
  const hide = ()=> { if(!loader) return; loader.classList.add('hide'); setTimeout(()=>loader.remove(),700); };
  if(vid){ vid.onended = hide; }
  setTimeout(hide, 4200);
});
const db = firebase.firestore();
const slidesEl = document.getElementById('slides');
const gridCat = document.getElementById('grid-categorias');
const gridProd = document.getElementById('grid-productos');
async function loadSlides(){const snap=await db.collection('slides').orderBy('orden').get();slidesEl.innerHTML='';let i=0;snap.forEach(doc=>{const s=doc.data();const img=document.createElement('img');img.src=s.url;if(i===0)img.classList.add('active');slidesEl.appendChild(img);i++});setInterval(()=>{const imgs=slidesEl.querySelectorAll('img');if(!imgs.length)return;const a=slidesEl.querySelector('.active');let n=a?a.nextElementSibling:imgs[0];if(!n)n=imgs[0];a&&a.classList.remove('active');n.classList.add('active')},4500)}
async function loadCats(){const snap=await db.collection('categorias').orderBy('nombre').get();gridCat.innerHTML='';snap.forEach(doc=>{const c=doc.data();const d=document.createElement('div');d.className='cat-card';d.innerHTML=`<h3>${c.nombre}</h3><p>${c.descripcion||''}</p>`;gridCat.appendChild(d)})}
async function loadProds(){const snap=await db.collection('productos').orderBy('creado','desc').limit(12).get();gridProd.innerHTML='';snap.forEach(doc=>{const p={id:doc.id,...doc.data()};const c=document.createElement('div');c.className='prod-card';c.innerHTML=`<img src="${p.imagen}" alt="${p.nombre}"/><div class="info"><h3>${p.nombre}</h3><div class="precio">$${(p.precio||0).toLocaleString('es-AR')}</div><button class="btn" onclick="addToCart('${p.id}','${p.nombre.replace(/'/g,"")}','${p.imagen}',${p.precio})">Agregar</button><a href="producto.html?id=${p.id}" style="display:block;text-align:center;margin-top:8px;color:#122C54">Ver detalle</a></div>`;gridProd.appendChild(c)})}
loadSlides();loadCats();loadProds();
