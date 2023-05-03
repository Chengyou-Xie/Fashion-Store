// 處理圖片檔 (前端處理，也可後端處理)
function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

// 圖片上傳預覽
let file = document.querySelector("#productPicture");
let addPic = document.querySelector("#addPic");
file.addEventListener("change", (e) => {
    let type = document.querySelector("#productType").value;
    let name = e.target.files[0].name;

    addPic.src = `./images/${type}/${name}`;
});

// 編輯商品 tab

// 一開始先顯示上衣的編輯欄位
let shirtContainer = document.querySelector(".shirtContainer");
let pantsContainer = document.querySelector(".pantsContainer");
let jacketContainer = document.querySelector(".jacketContainer");
let accessoriesContainer = document.querySelector(".accessoriesContainer");

axios.get("http://localhost:3030/products/上衣").then((res) => {
    let result = res.data;

    result.forEach((item) => {
        showEditProduct(item, shirtContainer);
    });
});

let btnShirt = document.querySelector(".shirt");
let btnPants = document.querySelector(".pants");
let btnJacket = document.querySelector(".jacket");
let btnAccessories = document.querySelector(".accessories");

btnShirt.addEventListener("click", (e) => {
    let type = e.target.innerText;
    axios
        .get("http://localhost:3030/products/" + type)
        .then((res) => {
            let result = res.data;
            result.forEach((item) => {
                showEditProduct(item, shirtContainer);
            });
        })
        .catch((err) => console.log(err));
});
btnPants.addEventListener("click", (e) => {
    let type = e.target.innerText;
    axios
        .get("http://localhost:3030/products/" + type)
        .then((res) => {
            let result = res.data;
            result.forEach((item) => {
                showEditProduct(item, pantsContainer);
            });
        })
        .catch((err) => console.log(err));
});
btnJacket.addEventListener("click", (e) => {
    let type = e.target.innerText;
    axios
        .get("http://localhost:3030/products/" + type)
        .then((res) => {
            let result = res.data;
            result.forEach((item) => {
                showEditProduct(item, jacketContainer);
            });
        })
        .catch((err) => console.log(err));
});
btnAccessories.addEventListener("click", (e) => {
    let type = e.target.innerText;
    axios
        .get("http://localhost:3030/products/" + type)
        .then((res) => {
            let result = res.data;
            result.forEach((item) => {
                showEditProduct(item, accessoriesContainer);
            });
        })
        .catch((err) => console.log(err));
});

function showEditProduct(item, container) {
    let { pid, name, type, price, img } = item;
    let src = `data:image/png;base64,${toBase64(img.data)}`;

    container.innerHTML += `
    <div class="editProductContainer">
        <img src="${src}" alt="" id="addPic${pid}" />
            <form action="http://localhost:3030/edit/${pid}" method="post" enctype="multipart/form-data">
                <input type="file" name="productPicture" id="productPicture${pid}"><br />

                <div class="formContainer">
                    <label for="productName">商品名稱：</label>
                    <input type="text" name="productName" id="productName" value="${name}"/><br />

                    <label for="productType">商品類型：</label>
                    <select name="productType" id="productType${pid}">
                        <option disabled>請選擇</option>
                        <option value="上衣" ${type == "上衣" ? "selected" : ""}>上衣</option>
                        <option value="褲子" ${type == "褲子" ? "selected" : ""}>褲子</option>
                        <option value="外套" ${type == "外套" ? "selected" : ""}>外套</option>
                        <option value="飾品" ${
                            type == "飾品" ? "selected" : ""
                        }>飾品</option></select
                    ><br />

                    <label for="productPrice">商品價格：</label>
                    <input type="number" name="productPrice" id="productPrice" value="${price}"/><br />

                    <div class="btnContainer">
                        <button class="submit" type="submit">修改</button>
                        <button class="delete" type="button" onclick="deleteProduct(${pid})">刪除</button>
                    </div>
                </div>
            </form>
    </div>`;

    // let file = document.querySelector(`#productPicture${pid}`);
    // let addPic = document.querySelector(`#addPic${pid}`);
    // console.log(file);

    // file.addEventListener("change", (e) => {
    //     alert("ok");
    //     let type = document.querySelector(`#productType${pid}`).value;
    //     let name = e.target.files[0].name;

    //     addPic.src = `./images/${type}/${name}`;
    // });
}

function deleteProduct(pid) {
    axios.post("http://localhost:3030/delete/" + pid);
}
