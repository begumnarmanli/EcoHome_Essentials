// Sepeti yükle
window.onload = function() {
    loadCart();
  };
  
  // Sepeti LocalStorage'dan al veya boş bir dizi oluştur
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // 'Sepete Ekle' butonlarına tıklama
  const addToCartButtons = document.querySelectorAll('.btn');
  
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function(event) {
      event.preventDefault(); // Sayfanın yenilenmesini engelle
  
      let productName, productPrice, productImage;
  
      // Menü kısmındaki ürünler için veri çekme
      if (button.closest('.menu')) {
        const productBox = button.closest('.box');
        productName = productBox.querySelector('h3').textContent;
        productPrice = productBox.querySelector('.price').textContent.trim().split(' ')[0];  // Fiyatı sadece sayısal kısım
        productImage = productBox.querySelector('img').src;
      }
  
      // Ürünler kısmındaki ürünler için veri çekme
      else if (button.closest('.products')) {
        productName = button.getAttribute('data-name');
        productPrice = button.getAttribute('data-price');
        productImage = button.getAttribute('data-image');
      }
  
      if (!productName || !productPrice || !productImage) {
        console.error('Ürün bilgileri eksik!');
        return;
      }
  
      // Benzersiz ID oluşturma (isim + fiyat + resim)
      const productId = productName + productPrice + productImage;
  
      // Aynı üründen var mı kontrol et
      const existingProduct = cart.find(item => item.id === productId);
  
      if (existingProduct) {
        // Eğer ürün varsa, miktarını arttır
        existingProduct.quantity++;
      } else {
        // Yeni ürün ekle
        const product = {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1 // Başlangıçta 1
        };
        cart.push(product);
      }
  
      localStorage.setItem('cart', JSON.stringify(cart));
  
      alert(`${productName} sepete eklendi!`);
      loadCart();
    });
  });
  
  function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Sepet:', cart);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.innerText = cart.length;  // Sepet sayısını doğru şekilde güncelle
    }
  
    const cartContainer = document.querySelector('.cart-items-container');
    cartContainer.innerHTML = ''; // Önce sepeti temizle
  
    let total = 0; // Toplam tutar için değişken
  
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
        <p>${item.name} - ${item.price}</p>
        <p>Adet: ${item.quantity}</p>
        <button class="increase-btn">+</button>
        <button class="decrease-btn">-</button>
        <button class="remove-btn">Kaldır</button>
      `;
  
      // Artırma butonuna tıklama
      cartItem.querySelector('.increase-btn').addEventListener('click', function(event) {
        event.stopPropagation(); // Sepetin kapanmasını engelle
        increaseQuantity(item.id);
      });
  
      // Azaltma butonuna tıklama
      cartItem.querySelector('.decrease-btn').addEventListener('click', function(event) {
        event.stopPropagation(); // Sepetin kapanmasını engelle
        decreaseQuantity(item.id);
      });
  
      // Ürünü sepetten kaldırma
      cartItem.querySelector('.remove-btn').addEventListener('click', function(event) {
        event.stopPropagation(); // Sepetin kapanmasını engelle
        removeFromCart(item.id);
      });
  
      cartContainer.appendChild(cartItem);
  
      // Toplam tutarı hesapla
      total += parseFloat(item.price.replace("₺", "").trim()) * item.quantity;
    });
  
    // Sepet alt kısmına toplam tutarı yazdır
    const totalPriceElement = document.createElement('div');
    totalPriceElement.classList.add('total-price');
    totalPriceElement.innerHTML = `
      <p>Toplam Tutar: ₺${total.toFixed(2)}</p>
    `;
    cartContainer.appendChild(totalPriceElement);
  }
  
  // Artırma fonksiyonu
  function increaseQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
      product.quantity++;
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
    }
  }
  
  // Azaltma fonksiyonu
  function decreaseQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    if (product && product.quantity > 1) {
      product.quantity--;
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
    }
  }
  
  // Sepetten ürün çıkarma
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
  
  // Sepet butonuna tıklama işlemi
  const cartBtn = document.querySelector("#cart-btn");
  const cartItem = document.querySelector(".cart-items-container");
  
  // Sepeti açma ve kapama işlemi
  cartBtn.addEventListener("click", function (event) {
    event.stopPropagation();  // Butona tıklandığında sepetin kapanmamasını sağlar
    cartItem.classList.toggle("active");  // Sepeti aç / kapa
  });
  
  // Sayfa içindeki diğer yerlere tıklanınca sepetin kapanması
  document.addEventListener("click", function (event) {
    if (!cartItem.contains(event.target) && !cartBtn.contains(event.target)) {
      cartItem.classList.remove("active");  // Sepeti kapat
    }
  });
  