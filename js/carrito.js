let carrito = JSON.parse(localStorage.getItem('armain_cart')||'[]');
function guardar(){localStorage.setItem('armain_cart',JSON.stringify(carrito));actualizarUI()}
function agregarAlCarrito(id,nombre,precio,imagen){const e=carrito.find(i=>i.id===id);if(e){e.qty++}else{carrito.push({id,nombre,precio,imagen,qty:1})}guardar();abrirCarrito()}
function actualizarUI(){const c=document.getElementById('cart-count');if(c)c.textContent=carrito.reduce((a,b)=>a+b.qty,0);const items=document.getElementById('carrito-items');if(items){items.innerHTML=carrito.map(i=>`<div class="carrito-item"><img src="${i.imagen}"><div><strong>${i.nombre}</strong><br>$${i.precio} x ${i.qty}</div></div>`).join('')||'<p style="opacity:.6">Carrito vacío</p>'};const t=document.getElementById('carrito-total');if(t)t.textContent=carrito.reduce((a,b)=>a+b.precio*b.qty,0)}
function abrirCarrito(){document.getElementById('carrito')?.classList.add('open')}
function cerrarCarrito(){document.getElementById('carrito')?.classList.remove('open')}
document.addEventListener('DOMContentLoaded',()=>{actualizarUI();document.getElementById('abrir-carrito')?.addEventListener('click',abrirCarrito);document.getElementById('cerrar-carrito')?.addEventListener('click',cerrarCarrito);document.getElementById('checkout')?.addEventListener('click',()=>alert('Checkout próximamente - integraremos Mercado Pago'))});
