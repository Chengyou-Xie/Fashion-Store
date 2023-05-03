let inputAccount = document.querySelector("#account");
let inputPassword = document.querySelector("#password");
let inputName = document.querySelector("#name");
let inputBirthday = document.querySelector("#birthday");
let inputPhone = document.querySelector("#phone");

// 送出 btn
document.querySelector(".submit").addEventListener("click", async () => {
    let account = inputAccount.value;
    let password = inputPassword.value;
    let name = inputName.value;
    let birthday = inputBirthday.value;
    let phone = inputPhone.value;

    let result = await axios.post("http://localhost:3030/register", {
        account,
        password,
        name,
        birthday,
        phone,
    });

    // 帳號被註冊 result:0
    if (!result.data.result) {
        document.querySelector("#info").innerHTML = "*此帳號已被註冊*";
    } else {
        alert("註冊成功，可開始登入進行購物囉");
        location.href = "/pages/login.html";
    }
});

// 重設 btn
document.querySelector(".reset").addEventListener("click", () => {
    inputAccount.value = "";
    inputPassword.value = "";
    inputName.value = "";
    inputPhone.value = "";
    inputBirthday.value = "";
});
