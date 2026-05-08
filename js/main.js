// Armain - main.js
document.addEventListener('DOMContentLoaded', () => {
  // LOADER
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1800);
  });

  // NAV MOBILE
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle.addEventListener('click', () => menu.classList.toggle('active'));

  // SLIDER
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  
  function showSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[n].classList.add('active');
    dots[n].classList.add('active');
    current = n;
  }
  
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });
  
  setInterval(() => {
    let next = (current + 1) % slides.length;
    showSlide(next);
  }, 6000);

  // GALERIA - Listo para Firebase + Cloudinary
  // Reemplaza este array con datos de Firebase Firestore
  const perfumes = [
    { id: 1, nombre: 'Armain No.1 Marino', nota: 'Bergamota, sal marina, cedro', precio: '$45.000', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800' },
    { id: 2, nombre: 'Armain No.2 Beige', nota: 'Vainilla, sándalo, almizcle', precio: '$48.000', img: 'https://images.unsplash.com/photo-1595425964072-0b78702f9971?q=80&w=800' },
    { id: 3, nombre: 'Armain No.3 Noche', nota: 'Incienso, cuero, ámbar negro', precio: '$52.000', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800' },
    { id: 4, nombre: 'Armain No.4 Alba', nota: 'Neroli, té blanco, musgo', precio: '$45.000', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800' },
    { id: 5, nombre: 'Armain No.5 Pampa', nota: 'Hierba mate, lavanda, vetiver', precio: '$46.500', img: 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7cf?q=80&w=800' },
    { id: 6, nombre: 'Armain No.6 Oro', nota: 'Azafrán, rosa turca, oud', precio: '$58.000', img: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800' },
    { id: 7, nombre: 'Armain No.7 Costa', nota: 'Limón, algas, madera drift', precio: '$44.000', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800' },
    { id: 8, nombre: 'Armain No.8 Invierno', nota: 'Pino, canela, haba tonka', precio: '$49.000', img: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800' },
  ];

  const grid = document.getElementById('perfumeGrid');
  if (grid) {
    grid.innerHTML = perfumes.map(p => `
      <div class="perfume-card">
        <div class="perfume-img">
          <img src="${p.img}" alt="${p.nombre}" loading="lazy">
        </div>
        <div class="perfume-info">
          <h3>${p.nombre}</h3>
          <p>${p.nota}</p>
          <div class="perfume-price">${p.precio}</div>
        </div>
      </div>
    `).join('');
  }

  // --- CONFIGURACIÓN FIREBASE (pega tus claves aquí) ---
  /*
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "armain.firebaseapp.com",
    projectId: "armain",
    storageBucket: "armain.appspot.com"
  };
  const app = initializeApp(firebaseConfig);
  // Luego reemplaza el array 'perfumes' con datos de Firestore
  */

  // --- CLOUDINARY ---
  // Para usar Cloudinary, cambia las URLs a: https://res.cloudinary.com/TU_CLOUD/image/upload/v1/armain/perfume1.jpg
});
