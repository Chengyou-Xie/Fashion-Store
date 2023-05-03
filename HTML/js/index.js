// 處理圖片檔 (前端處理，也可後端處理)
function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

// 商品放這裡
let productContainer = document.querySelector(".container");

// 一開始載入上衣商品
axios.get("http://localhost:3030/products/上衣").then((res) => {
    let result = res.data;
    showProducts(result);
});

// 顯示商品、設定加入購物車按鈕
function showProducts(result) {
    productContainer.innerHTML = "";

    result.forEach((item) => {
        let { pid, name, price, img } = item;

        // 這裡可改成後端處理完再傳回前端
        let src = `data:image/png;base64,${toBase64(img.data)}`;

        productContainer.innerHTML += `
            <div class="product">
                <img src="${src}" alt="商品圖" />
                <h3>${name}</h3>
                <h3>$${price}</h3>
                <h5>🌕🌕🌕🌕🌗 57</h5>
                <div class="cartContainer">
                    <select name="count" id="count${pid}">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <button class="addCarts">加入購物車</button>
                </div>
            </div>
        `;
    });

    let addCartsBtns = document.querySelectorAll(".addCarts");
    addCartsBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (localStorage.getItem("userLoginID")) {
                let uid = localStorage.getItem("userLoginID");
                let count = btn.previousElementSibling.value;
                let pid = btn.previousElementSibling.id.replace(/[^0-9]/gi, "");

                axios.post("http://localhost:3030/carts/add", { uid, pid, count });
                alert("成功加入購物車");
            } else {
                alert("請先登入！");
                location.href = "/pages/login.html";
            }
        });
    });
}

// 根據點選不同類型，顯示相對應商品
let btnProductsTypeArr = document.querySelectorAll(".btnProductsType");
btnProductsTypeArr.forEach((btnProductsType) => {
    btnProductsType.addEventListener("click", (e) => {
        let type = e.target.innerText;
        axios.get("http://localhost:3030/products/" + type).then((res) => {
            let result = res.data;
            showProducts(result);
        });
    });
});

// 確認是否已登入，並改 navbar
if (localStorage.getItem("userLoginID")) {
    console.log("成功登入...");
    document.querySelector(".isLoginNav").innerHTML = `
        <li><a href="/pages/carts.html">購物車</a></li>
        <li><a class="logout">你好${localStorage.getItem("userLoginName")}，登出</a></li>
    
    `;

    document.querySelector(".logout").addEventListener("click", (e) => {
        localStorage.removeItem("userLoginID");
        localStorage.removeItem("userLoginName");
        location.href = "/pages/login.html";
    });
}
