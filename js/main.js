document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const header = document.getElementById('header');
  
  // Loader elegante
  setTimeout(() => loader.classList.add('hidden'), 2200);

  // Header scroll
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll); onScroll();

  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle?.addEventListener('click', () => menu.classList.toggle('active'));

  // Slider
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  let current = 0, timer;

  function show(n){
    slides.forEach(s=>s.classList.remove('active'));
    dots.forEach(d=>d.classList.remove('active'));
    slides[n].classList.add('active');
    dots[n].classList.add('active');
    current = n;
  }
  function nextSlide(){ show((current+1)%slides.length) }
  function prevSlide(){ show((current-1+slides.length)%slides.length) }
  
  dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);reset()}));
  next?.addEventListener('click',()=>{nextSlide();reset()});
  prev?.addEventListener('click',()=>{prevSlide();reset()});
  
  function reset(){ clearInterval(timer); timer = setInterval(nextSlide, 6500) }
  reset();

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target) } })
  },{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Perfumes - listo para Firebase/Cloudinary
  const perfumes = [
    { nombre:'Armain No.1 Marino', nota:'Bergamota, sal marina, cedro azul', precio:'$45.000 ARS', img:'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=900' },
    { nombre:'Armain No.2 Beige', nota:'Vainilla bourbon, sándalo, almizcle blanco', precio:'$48.000 ARS', img:'https://images.unsplash.com/photo-1595425964072-0b78702f9971?q=80&w=900' },
    { nombre:'Armain No.3 Noche', nota:'Incienso, cuero, ámbar negro', precio:'$52.000 ARS', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=900' },
    { nombre:'Armain No.4 Alba', nota:'Neroli, té blanco, musgo de roble', precio:'$45.000 ARS', img:'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=900' },
    { nombre:'Armain No.5 Pampa', nota:'Yerba mate, lavanda, vetiver', precio:'$46.500 ARS', img:'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7cf?q=80&w=900' },
    { nombre:'Armain No.6 Oro', nota:'Azafrán, rosa turca, oud', precio:'$58.000 ARS', img:'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=900' },
  ];

  const grid = document.getElementById('perfumeGrid');
  if(grid){
    grid.innerHTML = perfumes.map(p=>`
      <article class="perfume-card reveal">
        <div class="perfume-img"><img src="${p.img}" alt="${p.nombre}" loading="lazy"></div>
        <div class="perfume-info">
          <h3>${p.nombre}</h3>
          <p class="perfume-note">${p.nota}</p>
          <div class="perfume-meta">
            <span class="perfume-price">${p.precio}</span>
            <a href="#" class="perfume-link">Ver detalle →</a>
          </div>
        </div>
      </article>
    `).join('');
    // re-observe new cards
    document.querySelectorAll('.perfume-card').forEach(el=>io.observe(el));
  }
});
