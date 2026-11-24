// ===== সব প্রোডাক্ট এখানে। নতুন পণ্য যোগ করতে শুধু একটি লাইন যোগ করুন: { n:'নাম', p:দাম, img:'ছবির লিংক' } =====
const CATALOG = {  // নতুন ৬টি ক্যাটেগরির পণ্য ও দাম নমুনা মাত্র (hero = ক্যাটেগরির ব্যানার ছবি), আসল পণ্য দিয়ে বদলে নিন
  laptop: { title: 'All Laptop Series', page: 'laptop.html', items: [
    { n:'Apple MacBook Air M1', p:95000, img:'images/Laptop.jpg' },
    { n:'HP Pavilion 15 Core i5', p:68500, img:'images/Laptop.jpg' },
    { n:'Dell Inspiron 14 Ryzen 5', p:62000, img:'images/Laptop.jpg' },
    { n:'Asus VivoBook 15 OLED', p:74000, img:'images/Laptop.jpg' },
    { n:'Lenovo IdeaPad Slim 3', p:55000, img:'images/Laptop.jpg' },
    { n:'Acer Nitro 5 Gaming', p:88000, img:'images/Laptop.jpg' } ] },
  mobile: { title: 'All Mobile Series', page: 'mobile.html', items: [
    { n:'Apple iPhone 15 Pro', p:135000, img:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300' },
    { n:'Samsung Galaxy S24 Ultra', p:125000, img:'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300' },
    { n:'Xiaomi 14 Pro', p:85000, img:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300' },
    { n:'OnePlus 12 5G', p:76000, img:'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300' },
    { n:'Realme GT 5 Pro', p:65000, img:'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300' } ] },
  computer: { title: 'All Desktop & Gaming PC Series', page: 'computer.html', items: [
    { n:'Ryzen 7 5700X RGB Gaming PC', p:92000, img:'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300' },
    { n:'Intel Core i5 12th Gen Full Set', p:54500, img:'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300' },
    { n:'Apple iMac 24-inch M3 (8GB/256GB)', p:165000, img:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300' },
    { n:'Ryzen 5 5600G Budget Desktop', p:42000, img:'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300' },
    { n:'ASUS TUF 24" 165Hz Gaming Monitor', p:24800, img:'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=300' },
    { n:'NVIDIA RTX 4060 8GB Graphics Card', p:46500, img:'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300' },
    { n:'Keychron K2 RGB Mechanical Keyboard', p:8900, img:'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300' },
    { n:'Corsair 4000D Airflow Mid-Tower Case', p:10500, img:'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=300' } ] },
  electronics: { title: 'All Electronics & Gadgets', page: 'electronics.html', items: [
    { n:'Sony WH-1000XM5 Headphone', p:32500, img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300' },
    { n:'Apple Watch Series 9', p:45000, img:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300' },
    { n:'JBL Flip 6 Bluetooth Speaker', p:12800, img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300' },
    { n:'Canon EOS 250D DSLR Camera', p:68000, img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300' },
    { n:'Apple AirPods Pro (2nd Gen)', p:25500, img:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300' },
    { n:'Samsung 43" 4K Smart TV', p:52000, img:'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300' },
    { n:'Anker 20000mAh Power Bank', p:4500, img:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300' },
    { n:'Logitech MX Master 3S Mouse', p:11200, img:'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300' } ] },
  cosmetics: { title: 'Cosmetics & Beauty Collection', page: 'cosmetics.html', items: [
    { n:'Maybelline Matte Lipstick', p:1200, img:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300' },
    { n:'The Ordinary Face Serum', p:1800, img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300' } ] },
  baby: { title: 'Baby Toys & Kids', page: 'baby.html', icon: 'fa-baby', hero: 'images/baby_toys.jpg', items: [
    { n:'Soft Teddy Bear', p:850 }, { n:'Baby Rattle & Teether Set', p:450 },
    { n:'Wooden Stacking Rings', p:650 }, { n:'Baby Story Board Book', p:380 } ] },
  books: { title: 'Books & Stationery', page: 'books.html', icon: 'fa-book', hero: 'images/books.jpg', items: [
    { n:'গল্পের বই সংকলন', p:350 }, { n:'English Grammar Guide', p:420 },
    { n:'Children Colouring Book', p:180 }, { n:'Hardcover Notebook', p:250 } ] },
  kitchen: { title: 'Kitchen Products', page: 'kitchen.html', icon: 'fa-utensils', hero: 'images/kitchen_product.jpg', items: [
    { n:'Electric Rice Cooker 1.8L', p:4200 }, { n:'Stainless Steel Pressure Cooker', p:3800 },
    { n:'Hand Blender', p:2900 }, { n:'Electric Kettle 1.7L', p:1800 } ] },
  foods: { title: 'Snacks & Foods', page: 'foods.html', icon: 'fa-cookie-bite', hero: 'images/Foods.jpg', items: [
    { n:'Potato Chips Family Pack', p:120, img:'images/chips3.png' }, { n:'Classic Chips Pack', p:60, img:'images/offer.jpg' },
    { n:'Assorted Biscuits Pack', p:150 }, { n:'Chocolate Candy Jar', p:280 } ] },
  dryfoods: { title: 'Dry Foods & Grocery', page: 'dryfoods.html', icon: 'fa-bowl-food', hero: 'images/dry_foods.jpg', items: [
    { n:'Tea Bags (80 pcs)', p:320 }, { n:'Canned Green Peas', p:160 },
    { n:'Canned Baked Beans', p:190 }, { n:'Cooking Oil 1L', p:210 } ] },
  fashion: { title: 'Top Fashion', page: 'fashion.html', icon: 'fa-shirt', hero: 'images/Fashion-Clothes.jpg', items: [
    { n:"Men's Casual Jacket", p:3200 }, { n:'Striped Cotton Pullover', p:1500 },
    { n:"Women's Winter Coat", p:4200 }, { n:'Slim Fit Denim Jeans', p:2200 } ] }
};
