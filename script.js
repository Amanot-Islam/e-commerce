// ================= Global Cart & Checkout System =================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// পেজ লোড হওয়ার সাথে সাথে কার্ট ইউআই আপডেট করা
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// Add to Cart ফাংশন
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    // প্রোডাক্ট যোগ করার পর অটোমেটিক কার্ট ড্রয়ার ওপেন হবে
    let drawer = document.getElementById('cartDrawer');
    if (drawer) {
        drawer.style.right = '0';
    }
}

// কার্ট ড্রয়ার ওপেন/ক্লোজ টগল করা
function toggleCart() {
    let drawer = document.getElementById('cartDrawer');
    if (drawer) {
        if (drawer.style.right === '0px') {
            drawer.style.right = '-350px';
        } else {
            drawer.style.right = '0';
        }
    }
}

// কার্ট UI এবং মোট দাম আপডেট করা
function updateCartUI() {
    const countElem = document.getElementById('cartCount');
    const container = document.getElementById('cartItemsContainer');
    const totalText = document.getElementById('totalPriceText');

    if (countElem) {
        countElem.innerText = cart.length;
    }

    if (!container || !totalText) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px;">আপনার কার্ট খালি আছে।</p>';
        totalText.innerText = 'মোট: ৳ ০';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>৳ ${item.price.toLocaleString()}</small>
                </div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer;" title="Remove"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });

    container.innerHTML = html;
    totalText.innerText = `মোট: ৳ ${total.toLocaleString()}`;
}

// কার্ট থেকে আইটেম ডিলিট করা
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// কার্ট ড্রয়ারের চেকআউট বাটনে ক্লিক করলে বিকাশ পেমেন্ট পপ-আপ আসবে
function checkoutOrder() {
    if (cart.length === 0) {
        alert('আপনার কার্ট খালি আছে! প্রথমে কিছু পণ্য যোগ করুন।');
        return;
    }

    // মোট টাকা হিসাব করা
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    
    let modalAmountElem = document.getElementById('modalTotalAmount');
    if (modalAmountElem) {
        modalAmountElem.innerText = 'পরিশোধযোগ্য মোট টাকা: ৳ ' + totalAmount.toLocaleString();
    }

    // কার্ট ড্রয়ার বন্ধ করা
    let drawer = document.getElementById('cartDrawer');
    if (drawer) {
        drawer.style.right = '-350px';
    }

    // বিকাশ পেমেন্ট মডাল ওপেন করা
    let bkashModal = document.getElementById('bkashModal');
    if (bkashModal) {
        bkashModal.style.display = 'flex';
    }
}

// পেমেন্ট তথ্য যাচাই করে অর্ডার কনফার্ম করা
function verifyAndCompleteOrder() {
    let customerName = document.getElementById('custName').value.trim();
    let customerAddress = document.getElementById('custAddress').value.trim();
    let customerPhone = document.getElementById('custPhone').value.trim();
    let bkashNum = document.getElementById('custBkashNum').value.trim();
    let trxId = document.getElementById('custTrxId').value.trim();

    if (!customerName || !customerAddress || !customerPhone || !bkashNum || !trxId) {
        alert('অর্ডার সম্পন্ন করতে নাম, ঠিকানা, ফোন নম্বর, বিকাশ নম্বর এবং TrxID অবশ্যই দিতে হবে!');
        return;
    }

    if (bkashNum.length < 11) {
        alert('দয়া করে সঠিক ১১ ডিজিটের বিকাশ নম্বর দিন!');
        return;
    }

    // আগের অর্ডারগুলো লোড করা
    let allOrders = JSON.parse(localStorage.getItem('shopnerHatOrders')) || [];

    // নতুন অর্ডার তৈরি
    let newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        bkashNumber: bkashNum,
        trxId: trxId,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date().toLocaleString()
    };

    allOrders.push(newOrder);
    localStorage.setItem('shopnerHatOrders', JSON.stringify(allOrders));

    alert('ধন্যবাদ ' + customerName + '! আপনার বিকাশ পেমেন্ট ও অর্ডার সফলভাবে গ্রহণ করা হয়েছে। অর্ডার আইডি: ' + newOrder.id);
    
    // কার্ট খালি করা
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    
    // ফর্ম ইনপুট খালি করা ও মডাল বন্ধ করা
    document.getElementById('custName').value = '';
    document.getElementById('custAddress').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('custBkashNum').value = '';
    document.getElementById('custTrxId').value = '';
    
    closeBkashModal();
}

// পপ-আপ বন্ধ করার ফাংশন
function closeBkashModal() {
    let bkashModal = document.getElementById('bkashModal');
    if (bkashModal) {
        bkashModal.style.display = 'none';
    }
}


   // Image Carosel


let currentSlide = 0;
const slides = document.querySelectorAll('#shopnerCarousel .carousel-slide');

function showSlide(index) {
    if (slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

setInterval(nextSlide, 4000);

















