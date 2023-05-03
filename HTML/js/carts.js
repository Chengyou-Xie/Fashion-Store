if (!localStorage.getItem("userLoginName")) {
    alert("請先登入！");
    location.href = "/pages/login.html";
}

// 改 title
document.title = localStorage.getItem("userLoginName") + "的購物車";

// 登出
document.querySelector(".logout").addEventListener("click", () => {
    localStorage.removeItem("userLoginID");
    localStorage.removeItem("userLoginName");
    location.href = "/pages/login.html";
});

let cartsContainer = document.querySelector("#cartsContainer");
let uid = localStorage.getItem("userLoginID");

// 處理圖片檔 (前端處理，也可後端處理)
function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

// 取得購物車資訊
getCarts();
async function getCarts() {
    let res = await axios.post("http://localhost:3030/carts", { uid });
    let response = res.data;

    response.forEach((item) => {
        let { pid, name, price } = item.detail;
        let { count } = item;
        let src = `data:image/png;base64,${toBase64(item.detail.img.data)}`;

        cartsContainer.innerHTML += `            
            <tr class="item">
                <td><img src="${src}" alt="" /></td>
                <td>${name}</td>
                <td>${price}</td>
                <td>
                    <span class="add" onclick="btnAddHandler(this, ${pid})"> + </span> <span id="pricec${pid}">${count}</span> <span class="sub"  onclick="btnSubHandler(this,${pid})"> - </span>
                </td>
                <td>${price * count}</td>
            </tr>
        `;

        // document.querySelectorAll(".add").forEach((addBtn) => {
        //     addBtn.addEventListener("click", (e) => {
        //         let countShow = e.target.nextElementSibling;
        //         let count = countShow.innerHTML * 1 + 1;

        //         // 改使用者畫面數量
        //         countShow.innerHTML = count;

        //         // 改資料庫數量
        //         axios.post("/carts/edit", {});
        //     });
        // });

        // document.querySelectorAll(".sub").forEach((addBtn) => {
        //     addBtn.addEventListener("click", (e) => {
        //         let countShow = e.target.previousElementSibling;
        //         let count = countShow.innerHTML * 1 - 1;
        //         if (count >= 0) {
        //             countShow.innerHTML = count;
        //         }
        //     });
        // });
    });
}

function btnAddHandler(btn, pid) {
    let countShow = btn.nextElementSibling;

    let count = countShow.innerHTML * 1 + 1;

    // 改使用者畫面數量
    countShow.innerHTML = count;

    // 改資料庫數量
    axios.post("http://localhost:3030/carts/edit", { uid, pid, count });
}

function btnSubHandler(btn, pid) {
    let countShow = btn.previousElementSibling;
    let count = countShow.innerHTML * 1 - 1;

    if (count >= 0) {
        // 改使用者畫面數量
        countShow.innerHTML = count;

        // 改資料庫數量
        axios.post("http://localhost:3030/carts/edit", { uid, pid, count });
    }

    if (count == 0) {
        cartsContainer.innerHTML = `
            <tr>
                <th colspan="2">商品</th>
                <th>價格</th>
                <th>數量</th>
                <th>總計</th>
            </tr>
        `;
        getCarts();
    }
}
