// تحميل المنتجات
let products = JSON.parse(localStorage.getItem("products")) || [];

// رفع منتج جديد
document.getElementById("productForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    let title = document.getElementById("title").value;
    let price = document.getElementById("price").value;
    let description = document.getElementById("description").value;
    let region = document.getElementById("region").value;
    let district = document.getElementById("district").value;
    
    // رفع عدة صور
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

// عرض المنتجات مع تصفية حسب المنطقة
function displayProducts(regionFilter=null, districtFilter=null){
    let container = document.querySelector(".products");
    if(!container) return;
    container.innerHTML = "";
    let filtered = products.filter(p=>{
        if(regionFilter && p.region !== regionFilter) return false;
        if(districtFilter && p.district !== districtFilter) return false;
        return true;
    });
    filtered.forEach((p,index)=>{
        container.innerHTML += `
        <div class="product">
            <h3>${p.title}</h3>
            <p class="price">${p.price}$</p>
            <p>${p.description}</p>
            <p>المنطقة: ${p.region} | المقاطعة: ${p.district}</p>
            ${p.images.map(img=>`<img src="${img}" style="width:100%;border-radius:10px;margin-top:5px;">`).join("")}
            <div class="actions">
                <button onclick="editProduct(${index})">تعديل</button>
                <button onclick="deleteProduct(${index})">حذف</button>
            </div>
        </div>
        `;
    });
}

// تعديل وحذف المنتجات
function editProduct(index){ /* كما قبل مع إضافة region وdistrict */ }
function deleteProduct(index){ products.splice(index,1); localStorage.setItem("products", JSON.stringify(products)); displayProducts(); }

// توليد روابط المشاركة
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

// إذا كنا في صفحة products أو dashboard
if(document.querySelector(".products")) displayProducts();
