let inputAccount = document.querySelector("#account");
let inputPassword = document.querySelector("#password");

let btnSubmit = document.querySelector("#submit");
btnSubmit.addEventListener("click", async () => {
    let account = inputAccount.value;
    let password = inputPassword.value;

    let resopnse = await axios.post("http://localhost:3030/login", { account, password });
    let result = await resopnse.data;

    switch (result.result) {
        case 0:
            document.querySelector("#info").innerHTML = "*此帳號尚未註冊*";
            console.log("帳號未註冊");
            break;
        case 1:
            document.querySelector("#info").innerHTML = "*密碼錯誤*";
            console.log("密碼錯誤");
            break;
        case 2:
            console.log("登入成功");
            localStorage.setItem("userLoginID", result.uid);
            localStorage.setItem("userLoginName", result.name);
            location.href = "/pages/index.html";
            break;
        default:
            break;
    }
});
