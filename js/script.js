let products = JSON.parse(localStorage.getItem("products")) || [];

document.getElementById("productForm")?.addEventListener("submit", function(e){
  e.preventDefault();
  let title = document.getElementById("title").value;
  let price = document.getElementById("price").value;
  let description = document.getElementById("description").value;
  let region = document.getElementById("region").value;
  let district = document.getElementById("district").value;

  let imagesInput = document.getElementById("images");
  let images = [];
  for(let i=0;i<imagesInput.files.length;i++){
    images.push(URL.createObjectURL(imagesInput.files[i]));
  }

  let newProduct = {title, price, description, region, district, images};
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));
  alert("تم رفع المنتج بنجاح!");
  this.reset();
  window.location.href = "dashboard.html";
});

function generateShareLinks(product){
  let url = window.location.href;
  let text = `شاهد هذا المنتج: ${product.title} بسعر ${product.price}$\n${product.description}`;
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text+"\n"+url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  };
}

function displayProducts(regionFilter=null, districtFilter=null){
  let container = document.querySelector(".products");
  if(!container) return;
  let filtered = products.filter(p=>{
    if(regionFilter && p.region !== regionFilter) return false;
    if(districtFilter && p.district !== districtFilter) return false;
    return true;
  });
  container.innerHTML = "";
  filtered.forEach((p,index)=>{
    let links = generateShareLinks(p);
    container.innerHTML += `
    <div class="product">
      <img src="${p.images[0] || ''}">
      <h3>${p.title}</h3>
      <p class="price">${p.price}$</p>
      <p>${p.description}</p>
      <p>المنطقة: ${p.region} | المقاطعة: ${p.district}</p>
      <div class="actions">
        <button onclick="editProduct(${index})">تعديل</button>
        <button onclick="deleteProduct(${index})">حذف</button>
      </div>
      <div style="margin-top:10px;">
        <a href="${links.facebook}" target="_blank">📘 فيسبوك</a> |
        <a href="${links.twitter}" target="_blank">🐦 تويتر</a> |
        <a href="${links.whatsapp}" target="_blank">💬 واتساب</a> |
        <a href="${links.telegram}" target="_blank">📨 تلجرام</a>
      </div>
    </div>
    `;
  });
}

function displayDashboardProducts(regionFilter=null, districtFilter=null){
  let container = document.querySelector(".products");
  if(!container) return;
  let filtered = products.filter(p=>{
    if(regionFilter && p.region !== regionFilter) return false;
    if(districtFilter && p.district !== districtFilter) return false;
    return true;
  });
  updateStats(filtered);
  container.innerHTML = "";
  filtered.forEach((p,index)=>{
    container.innerHTML += `
    <div class="product">
      <img src="${p.images[0] || ''}">
      <h3>${p.title}</h3>
      <p class="price">${p.price}$</p>
      <p>${p.description}</p>
      <p>المنطقة: ${p.region} | المقاطعة: ${p.district}</p>
      <div class="actions">
        <button class="edit" onclick="editProduct(${index})">تعديل</button>
        <button class="delete" onclick="deleteProduct(${index})">حذف</button>
      </div>
    </div>
    `;
  });
}

function updateStats(filteredProducts){
  if(filteredProducts.length === 0){
    document.getElementById("totalProducts")?.innerText = "عدد المنتجات: 0";
    document.getElementById("highestPrice")?.innerText = "أعلى سعر: 0$";
    document.getElementById("lowestPrice")?.innerText = "أقل سعر: 0$";
    return;
  }
  let prices = filteredProducts.map(p=>Number(p.price));
  document.getElementById("totalProducts")?.innerText = `عدد المنتجات: ${filteredProducts.length}`;
  document.getElementById("highestPrice")?.innerText = `أعلى سعر: ${Math.max(...prices)}$`;
  document.getElementById("lowestPrice")?.innerText = `أقل سعر: ${Math.min(...prices)}$`;
}

function editProduct(index){
  let p = products[index];
  let title = prompt("تعديل اسم المنتج:", p.title); if(title) p.title=title;
  let price = prompt("تعديل السعر:", p.price); if(price) p.price=price;
  let desc = prompt("تعديل الوصف:", p.description); if(desc) p.description=desc;
  let region = prompt("تعديل المنطقة:", p.region); if(region) p.region=region;
  let district = prompt("تعديل المقاطعة:", p.district); if(district) p.district=district;
  products[index]=p;
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
  displayDashboardProducts();
}

function deleteProduct(index){
  if(confirm("هل أنت متأكد من حذف هذا المنتج؟")){
    products.splice(index,1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    displayDashboardProducts();
  }
}

if(document.querySelector(".products")) displayProducts();
