const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");

//設置圖片檔暫存
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // 限制 2 MB
    },
    fileFilter(req, file, callback) {
        // 限制檔案格式為 image
        if (!file.mimetype.match(/^image/)) {
            callback((new Error().message = "檔案格式錯誤"));
        } else {
            callback(null, true);
        }
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(3030, () => {
    console.log("server監聽中╰(*°▽°*)╯");
    console.log("//////////////////////////////////////////");
});

const db = mysql.createConnection({
    host: "localhost",
    user: "jimuser",
    password: "1234",
    database: "shopping_practice",
});

app.get("/", (req, res) => {
    res.send("根目錄");
});

// 取得商品
app.get("/products/:type", (req, res) => {
    let type = req.params.type;
    let sql = `select * from products where type=?`;

    db.query(sql, [type], (err, result) => {
        console.log("取得商品...");
        res.send(result);
    });
});

// 新增商品
app.post("/addProduct", upload.single("productPicture"), (req, res) => {
    console.log("新增商品...");

    let name = req.body.productName;
    let type = req.body.productType;
    let price = req.body.productPrice;
    let img = req.file.buffer;

    let sql = "insert into products (name, type, price, img) values (?,?,?,?)";
    db.query(sql, [name, type, price, img]);

    res.send("成功新增");
});

// 更改商品資訊
app.post("/edit/:pid", upload.single("productPicture"), (req, res) => {
    console.log("更改商品資訊....");

    let pid = req.params.pid * 1;
    let name = req.body.productName;
    let type = req.body.productType;
    let price = req.body.productPrice * 1;

    if (req.file) {
        let img = req.file.buffer;
        let sql = "update products set name=?, type=?, price=?, img=? where pid=?";
        db.query(sql, [name, type, price, img, pid]);
    } else {
        let sql = "update products set name=?, type=?, price=? where pid=?";
        db.query(sql, [name, type, price, pid]);
    }
});

// 刪除商品
app.post("/delete/:pid", (req, res) => {
    console.log("刪除商品...");

    let pid = req.params.pid;
    let sql = "delete from products where pid=?";

    db.query(sql, [pid]);
});

// 會員登入
app.post("/login", (req, res) => {
    console.log("會員登入中...");

    let { account, password } = req.body;
    let sql = "select * from members where account=?";

    // 0:帳號未註冊、1:已註冊但密碼錯誤、2:成功登入
    db.query(sql, [account], (err, result) => {
        if (result.length == 0) {
            res.json({ result: 0 });
        } else {
            if (result[0].password != password) {
                res.json({ result: 1 });
            } else {
                res.json({ result: 2, uid: result[0].uid, name: result[0].name });
            }
        }
    });
});

// 會員註冊
app.post("/register", (req, res) => {
    console.log("會員註冊...");

    let { account, password, name, birthday, phone } = req.body;
    let sql = "select * from members where account=?";
    console.log(req.body);

    db.query(sql, [account], (err, result) => {
        // 帳號被註冊了
        if (result.length) {
            res.json({ result: 0 });
        }

        let sql_register =
            "insert into members (account, password, name, birthday, phone) values (?,?,?,?,?)";
        db.query(sql_register, [account, password, name, birthday, phone]);
        res.json({ result: 1 });
    });
});

// 購物車查詢
app.post("/carts", (req, res) => {
    console.log("購物車查詢...");

    let uid = req.body.uid;
    let sql = "select * from carts where uid=?";
    db.query(sql, [uid], (err, result) => {
        // 以 carts 的 pid 再去抓商品詳細資訊

        let carts = [];
        let sql = "select * from products where pid=?";
        let promises = [];

        result.forEach((item, index) => {
            let promise = new Promise((resolve) => {
                db.query(sql, item.pid, (err, res) => {
                    let detail = { detail: res[0], count: result[index].count };
                    carts.push(detail);
                    resolve();
                });
            });
            // 將每筆以 pid 查詢產品詳細資訊存至 promise
            promises.push(promise);
        });

        // 確認所有查詢 (promise) 都 ok 後再處理最後結果
        Promise.all(promises).then(() => {
            // console.log(carts);
            res.send(carts);
        });

        // res.send(carts.result);
    });
});

// 加入購物車
app.post("/carts/add", (req, res) => {
    console.log("加入購物車...");
    let { uid, pid, count } = req.body;
    let sql = "select * from carts where uid=? and pid=?";

    db.query(sql, [uid, pid], (err, result) => {
        if (!result.length) {
            // 如果沒加過購物車
            let sql = "insert into carts (pid, uid, count) values (?, ?, ?)";
            db.query(sql, [pid, uid, count]);
        } else {
            // 已經在購物車有的
            let sql = "update carts set count=count+? where pid=? and uid=?";
            db.query(sql, [count, pid, uid]);
        }
    });
});

// 編輯購物車
app.post("/carts/edit", (req, res) => {
    let { uid, pid, count } = req.body;
    let sql = "update carts set count=? where uid=? and pid=?";
    let sql2 = "select count from carts  where uid=? and pid=?";

    if (count) {
        db.query(sql, [count, uid, pid]);
        db.query(sql2, [uid, pid], (err, response) => {
            console.log(response);
            res.send(response);
        });
    } else {
        let sql = "delete from carts where uid=? and pid=?";
        db.query(sql, [uid, pid]);
    }
});

// 刪除購物車
app.post("/carts/delete", (req, res) => {});
