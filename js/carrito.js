let cart = JSON.parse(localStorage.getItem('armain_cart')||'[]');
const cartEl = document.getElementById('carrito');
const btnCart = document.getElementById('btn-carrito');
const closeCart = document.getElementById('cerrar-carrito');
const itemsEl = document.getElementById('carrito-items');
const countEl = document.getElementById('cart-count');
const totalEl = document.getElementById('cart-total');

btnCart?.addEventListener('click',()=>cartEl.classList.add('open'));
closeCart?.addEventListener('click',()=>cartEl.classList.remove('open'));

function save(){ localStorage.setItem('armain_cart', JSON.stringify(cart)); render(); }
function addToCart(id,nombre,imagen,precio){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++; else cart.push({id,nombre,imagen,precio,qty:1});
  save(); cartEl.classList.add('open');
}
function removeFromCart(id){ cart = cart.filter(i=>i.id!==id); save(); }
function render(){
  countEl.textContent = cart.reduce((a,b)=>a+b.qty,0);
  totalEl.textContent = '$'+cart.reduce((a,b)=>a+b.precio*b.qty,0).toLocaleString('es-AR');
  itemsEl.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <img src="${i.imagen}"/>
      <div>
        <div>${i.nombre}</div>
        <small>$${i.precio.toLocaleString('es-AR')} x ${i.qty}</small><br/>
        <button onclick="removeFromCart('${i.id}')">Quitar</button>
      </div>
    </div>`).join('') || '<p>Carrito vacío</p>';
}
document.getElementById('checkout')?.addEventListener('click',()=>{
  alert('Checkout simulado. Aquí conectarías Mercado Pago / Stripe.');
  cart=[]; save();
});
render();
