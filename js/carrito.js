let carrito=JSON.parse(localStorage.getItem('armain_cart')||'[]');
function guardar(){localStorage.setItem('armain_cart',JSON.stringify(carrito));actualizar()}
function agregarAlCarrito(id,nombre,precio,imagen){const e=carrito.find(i=>i.id===id);e?e.qty++:carrito.push({id,nombre,precio,imagen,qty:1});guardar();abrir()}
function actualizar(){const c=document.getElementById('cart-count');if(c)c.textContent=carrito.reduce((a,b)=>a+b.qty,0);const i=document.getElementById('carrito-items');if(i)i.innerHTML=carrito.map(p=>`<div class="carrito-item"><img src="${p.imagen}"><div><strong>${p.nombre}</strong><br>$${p.precio} x ${p.qty}</div></div>`).join('')||'<p style="opacity:.6;padding:20px">Carrito vacío</p>';const t=document.getElementById('carrito-total');if(t)t.textContent=carrito.reduce((a,b)=>a+b.precio*b.qty,0)}
function abrir(){document.getElementById('carrito')?.classList.add('open')}
function cerrar(){document.getElementById('carrito')?.classList.remove('open')}
document.addEventListener('DOMContentLoaded',()=>{actualizar();document.getElementById('abrir-carrito')?.addEventListener('click',abrir);document.getElementById('cerrar-carrito')?.addEventListener('click',cerrar);document.getElementById('checkout')?.addEventListener('click',()=>alert('Próximamente Mercado Pago'))});
