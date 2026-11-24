// ================= Shopner Hat: Cart, Checkout, Search, Carousel =================

// ---- দোকানের সেটিংস (এখানে নিজের নম্বর বসান) ----
const SHOP = {
  whatsapp: '8801743619981',          // অর্ডার এই WhatsApp নম্বরে যাবে (country code সহ, + ছাড়া)
  pay: {                              // প্রতিটি পেমেন্ট মাধ্যমের নম্বর
    bkash:  { label: 'bKash',  number: '017XXXXXXXX', color: '#e2136e' },
    nagad:  { label: 'Nagad',  number: '017XXXXXXXX', color: '#f6921e' },
    rocket: { label: 'Rocket', number: '017XXXXXXXX', color: '#8c3494' },
    cod:    { label: 'ক্যাশ অন ডেলিভারি', number: '', color: '#27ae60' }
  }
};

const bn = n => Number(n).toLocaleString('bn-BD');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = id => document.getElementById(id);

let cart = [];
try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { cart = []; }
// পুরনো ফরম্যাটের কার্ট (qty ছাড়া) ঠিক করা
cart = cart.map(i => ({ name: i.name, price: i.price, qty: i.qty || 1 }));

const saveCart = () => localStorage.setItem('cart', JSON.stringify(cart));
const cartTotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);

// ---------- Cart ----------
function addToCart(name, price) {
  const found = cart.find(i => i.name === name);
  found ? found.qty++ : cart.push({ name, price, qty: 1 });
  saveCart(); updateCartUI(); openCart();
}
function changeQty(index, d) {
  cart[index].qty += d;
  if (cart[index].qty < 1) cart.splice(index, 1);
  saveCart(); updateCartUI();
}
function removeItem(index) { cart.splice(index, 1); saveCart(); updateCartUI(); }

function openCart()  { $('cartDrawer')?.classList.add('open');    $('cartOverlay')?.classList.add('show'); }
function closeCart() { $('cartDrawer')?.classList.remove('open'); $('cartOverlay')?.classList.remove('show'); }
function toggleCart() { $('cartDrawer')?.classList.contains('open') ? closeCart() : openCart(); }

function updateCartUI() {
  document.querySelectorAll('.cart-count').forEach(e => e.textContent = bn(cart.reduce((s, i) => s + i.qty, 0)));
  const box = $('cartItemsContainer'), total = $('totalPriceText');
  if (!box || !total) return;
  if (!cart.length) {
    box.innerHTML = '<p class="empty-cart-text">আপনার কার্ট খালি আছে।</p>';
    total.textContent = 'মোট: ৳ ০';
    return;
  }
  box.innerHTML = cart.map((it, i) => `
    <div class="cart-item">
      <div>
        <strong>${esc(it.name)}</strong><br><small>৳ ${bn(it.price)}</small>
        <div class="qty-box">
          <button type="button" onclick="changeQty(${i},-1)" aria-label="কমান">−</button>
          <span>${bn(it.qty)}</span>
          <button type="button" onclick="changeQty(${i},1)" aria-label="বাড়ান">+</button>
        </div>
      </div>
      <button type="button" class="remove-btn" onclick="removeItem(${i})" title="মুছুন"><i class="fa-solid fa-trash"></i></button>
    </div>`).join('');
  total.textContent = 'মোট: ৳ ' + bn(cartTotal());
}

// ---------- Checkout ----------
function checkoutOrder() {
  if (!cart.length) { alert('আপনার কার্ট খালি আছে! প্রথমে কিছু পণ্য যোগ করুন।'); return; }
  closeCart();
  $('checkoutForm').style.display = 'block';
  $('orderSuccess').style.display = 'none';
  $('orderSummary').innerHTML = cart.map(i => `${esc(i.name)} × ${bn(i.qty)} = ৳ ${bn(i.price * i.qty)}`).join('<br>');
  $('modalTotalAmount').textContent = 'পরিশোধযোগ্য মোট: ৳ ' + bn(cartTotal());
  onPayMethodChange();
  $('bkashModal').classList.add('show');
}

function onPayMethodChange() {
  const m = SHOP.pay[$('payMethod').value];
  const online = $('payMethod').value !== 'cod';
  $('payInstruction').innerHTML = online
    ? `নিচের <strong>${m.label}</strong> নম্বরে <strong>Send Money</strong> করুন:<h4 class="pay-number" style="color:${m.color}">${esc(m.number)} (Personal)</h4>`
    : 'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।';
  $('onlinePayFields').style.display = online ? 'block' : 'none';
  document.querySelector('.payment-box').style.borderTopColor = m.color;
}

function verifyAndCompleteOrder() {
  const v = id => $(id).value.trim();
  const method = v('payMethod'), online = method !== 'cod';
  const name = v('custName'), address = v('custAddress'), phone = v('custPhone');
  const payNum = v('custBkashNum'), trx = v('custTrxId');

  if (!name || !address || !phone) { alert('নাম, ঠিকানা ও ফোন নম্বর অবশ্যই দিতে হবে!'); return; }
  if (!/^01[3-9]\d{8}$/.test(phone)) { alert('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)।'); return; }
  if (online) {
    if (!/^01[3-9]\d{8}$/.test(payNum)) { alert('যে নম্বর থেকে টাকা পাঠিয়েছেন তা সঠিক ১১ ডিজিটে দিন।'); return; }
    if (trx.length < 6) { alert('সঠিক Transaction ID (TrxID) দিন।'); return; }
  }

  const order = {
    id: 'ORD-' + Date.now().toString().slice(-7),
    name, phone, address, method, payNumber: payNum, trxId: trx,
    note: v('custNote'), items: cart.map(i => ({ ...i })), total: cartTotal(), date: new Date().toLocaleString()
  };
  let all = [];
  try { all = JSON.parse(localStorage.getItem('shopnerHatOrders')) || []; } catch (e) {}
  all.push(order);
  localStorage.setItem('shopnerHatOrders', JSON.stringify(all));

  // WhatsApp-এ অর্ডার পাঠানোর লিংক (দোকানির কাছে অর্ডার পৌঁছানোর সহজ উপায়)
  const lines = [
    `নতুন অর্ডার ${order.id}`, `নাম: ${name}`, `ফোন: ${phone}`, `ঠিকানা: ${address}`,
    ...order.items.map(i => `• ${i.name} × ${i.qty} = ৳${i.price * i.qty}`),
    `মোট: ৳${order.total}`, `পেমেন্ট: ${SHOP.pay[method].label}` + (online ? ` (${payNum}, TrxID: ${trx})` : ''),
    order.note ? `নোট: ${order.note}` : ''
  ].filter(Boolean);
  $('waLink').href = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;

  $('successMsg').textContent = `ধন্যবাদ ${name}! আপনার অর্ডার গ্রহণ করা হয়েছে। অর্ডার আইডি: ${order.id}`;
  $('checkoutForm').style.display = 'none';
  $('orderSuccess').style.display = 'block';

  cart = []; saveCart(); updateCartUI();
  ['custName','custAddress','custPhone','custBkashNum','custTrxId','custNote'].forEach(id => $(id).value = '');
}

function closeBkashModal() { $('bkashModal')?.classList.remove('show'); }

// ---------- Product pages ----------
function productCard(p) {
  const safe = p.n.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  const pic = p.img
    ? `<img src="${esc(p.img)}" alt="${esc(p.n)}" loading="lazy" onerror="this.src='https://placehold.co/300x200?text=No+Image'">`
    : `<div class="icon-tile"><i class="fa-solid ${p.icon || 'fa-box'}"></i></div>`;
  return `<div class="item-card">
    ${pic}
    <h4>${esc(p.n)}</h4><p class="price">৳ ${bn(p.p)}</p>
    <button type="button" class="buy-btn" onclick="addToCart('${safe}', ${p.p})">Add to Cart</button></div>`;
}
function renderCategory(key) {
  const grid = $('productGrid'); if (!grid || !CATALOG[key]) return;
  const c = CATALOG[key];
  if (c.hero) grid.insertAdjacentHTML('beforebegin', `<div class="cat-hero"><img src="${esc(c.hero)}" alt="${esc(c.title)}"></div>`);
  grid.innerHTML = c.items.map(it => productCard({ icon: c.icon, ...it })).join('');
}
function renderSearch() {
  const q = (new URLSearchParams(location.search).get('q') || '').trim().toLowerCase();
  const grid = $('productGrid'); if (!grid) return;
  $('searchTitle').textContent = q ? `"${q}" এর ফলাফল` : 'সব পণ্য';
  const hits = Object.values(CATALOG).flatMap(c => c.items.map(it => ({ icon: c.icon, ...it }))).filter(p => !q || p.n.toLowerCase().includes(q));
  grid.innerHTML = hits.length ? hits.map(productCard).join('') : '<p class="empty-note">কোনো পণ্য পাওয়া যায়নি। অন্য নাম দিয়ে চেষ্টা করুন।</p>';
}
function handleGlobalSearch(e) {
  if (e.key !== 'Enter') return;
  const q = e.target.value.trim();
  if (q) location.href = 'search.html?q=' + encodeURIComponent(q);
}

// ---------- Carousel ----------
let currentSlide = 0;
function showSlide(i) {
  const slides = document.querySelectorAll('#shopnerCarousel .carousel-slide');
  if (!slides.length) return;
  currentSlide = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle('active', k === currentSlide));
}
const nextSlide = () => showSlide(currentSlide + 1);
const prevSlide = () => showSlide(currentSlide - 1);

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  if (document.querySelector('#shopnerCarousel .carousel-slide')) setInterval(nextSlide, 4000);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if ($('bkashModal')?.classList.contains('show')) closeBkashModal(); else closeCart();
});
