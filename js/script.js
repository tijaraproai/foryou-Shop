let products = JSON.parse(localStorage.getItem("products")) || [];

document.getElementById("productForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    let title = document.getElementById("title").value;
    let price = document.getElementById("price").value;
    let image = document.getElementById("image").value;
    let description = document.getElementById("description").value;
    
    let newProduct = {title, price, image, description};
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    alert("تم رفع المنتج بنجاح!");
    this.reset();
});
