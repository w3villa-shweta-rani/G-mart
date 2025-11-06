const mainBox = document.getElementById('mainBox');
const catSelect = document.getElementById('catSelect');
const btnSearch = document.getElementById('btnSearch');
const searchBoxDiv = document.getElementById('searchBoxDiv');
const searchInput = document.getElementById('searchInput');
const btnCart = document.getElementById('btnCart');
const cartDiv = document.getElementById('cartDiv');
const formCheckout = document.getElementById('formCheckout');

let allProducts = [];
let cartItems = JSON.parse(localStorage.getItem('myCart')) || [];


async function loadData() {
  const res = await fetch('https://fakestoreapi.com/products');
  allProducts = await res.json();
  showCats();
  showProducts(allProducts);
}
function showProducts(data) {
  mainBox.innerHTML = "";
  data.forEach(item => {
    let div = document.createElement('div');
    div.className = 'productDiv';
    div.innerHTML = `
      <img src="${item.image}">
      <div class="productTitle">${item.title}</div>
      <div class="productPrice">$${item.price}</div>
      <button class="btnAdd" onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    mainBox.appendChild(div);
  });
}
function showCats() {
  let cats = [...new Set(allProducts.map(p => p.category))];
  cats.forEach(c => {
    let opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    catSelect.appendChild(opt);
  });
}
function addToCart(id) {
  let product = allProducts.find(p => p.id === id);
  let exist = cartItems.find(x => x.id === id);
  if (exist) {
    exist.qty += 1;
  } else {
    cartItems.push({ ...product, qty: 1 });
  }
  localStorage.setItem('myCart', JSON.stringify(cartItems));
  alert('Item added to cart!');
}
btnCart.addEventListener('click', () => {
  mainBox.style.display = 'none';
  formCheckout.style.display = 'none';
  cartDiv.style.display = 'block';
  showCartItems();
});

function showCartItems() {
  cartDiv.innerHTML = "<h2>Your Cart</h2>";
  let total = 0;
  cartItems.forEach(item => {
    total += item.price * item.qty;
    cartDiv.innerHTML += `
      <div class="cartItem">
        <span>${item.title} x${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
  });
  cartDiv.innerHTML += `<h3>Total: $${total.toFixed(2)}</h3>`;
  cartDiv.innerHTML += `<button class="btnCheckout" id="btnCheckout">Checkout</button>`;

  document.getElementById('btnCheckout').addEventListener('click', () => {
    cartDiv.style.display = 'none';
    formCheckout.style.display = 'block';
  });
}
btnSearch.addEventListener('click', () => {
  if (searchBoxDiv.style.display === "block") {
    searchBoxDiv.style.display = "none";
    searchInput.value = "";
    showProducts(allProducts);
  } else {
    searchBoxDiv.style.display = "block";
    searchInput.focus();
  }
});
searchInput.addEventListener('input', (e) => {
  let val = e.target.value.toLowerCase();
  let filtered = allProducts.filter(p => p.title.toLowerCase().includes(val));
  showProducts(filtered);
});
catSelect.addEventListener('change', (e) => {
  let cat = e.target.value;
  if (cat === 'all') {
    showProducts(allProducts);
  } else {
    let filtered = allProducts.filter(p => p.category === cat);
    showProducts(filtered);
  }
});
formCheckout.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Order placed successfully! (Demo)');
  cartItems = [];
  localStorage.removeItem('myCart');
  formCheckout.reset();
  formCheckout.style.display = 'none';
  mainBox.style.display = 'grid';
  loadData();
});

loadData();
//run it
