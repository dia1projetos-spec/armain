const db = firebase.firestore();
const slidesEl = document.getElementById('slides');
const gridCat = document.getElementById('grid-categorias');
const gridProd = document.getElementById('grid-productos');

// Slides
async function loadSlides(){
  const snap = await db.collection('slides').orderBy('orden').get();
  slidesEl.innerHTML = '';
  let i=0;
  snap.forEach(doc=>{
    const s = doc.data();
    const img = document.createElement('img');
    img.src = s.url;
    if(i===0) img.classList.add('active');
    slidesEl.appendChild(img);
    i++;
  });
  startSlider();
}
function startSlider(){
  const imgs = slidesEl.querySelectorAll('img');
  let idx=0;
  setInterval(()=>{
    imgs[idx].classList.remove('active');
    idx = (idx+1)%imgs.length;
    imgs[idx].classList.add('active');
  }, 4500);
}

// Categorías
async function loadCats(){
  const snap = await db.collection('categorias').orderBy('nombre').get();
  gridCat.innerHTML='';
  snap.forEach(doc=>{
    const c = doc.data();
    const div = document.createElement('div');
    div.className='cat-card';
    div.innerHTML = `<h3>${c.nombre}</h3><p>${c.descripcion||''}</p>`;
    gridCat.appendChild(div);
  });
}

// Productos
async function loadProds(){
  const snap = await db.collection('productos').orderBy('creado','desc').limit(12).get();
  gridProd.innerHTML='';
  snap.forEach(doc=>{
    const p = {id:doc.id, ...doc.data()};
    const card = document.createElement('div');
    card.className='prod-card';
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}"/>
      <div class="info">
        <h3>${p.nombre}</h3>
        <div class="precio">$${(p.precio||0).toLocaleString('es-AR')}</div>
        <button class="btn" onclick="addToCart('${p.id}','${p.nombre.replace(/'/g,"")}','${p.imagen}',${p.precio})">Agregar</button>
        <a href="producto.html?id=${p.id}" class="btn-ghost">Ver detalle</a>
      </div>`;
    gridProd.appendChild(card);
  });
}

loadSlides(); loadCats(); loadProds();
