const express = require('express');
const app = new express();


const mysql = require('mysql');
const bodyParser = require('body-parser');
const Joi = require('joi');
const multer = require('multer')
app.set('view engine','ejs');
var path=require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'/img')));
app.set('view engine', 'ejs');

app.get('/canh-dep', (req, res) => {
    res.send('xin chào Cảnh đẹp zai đến  với Express');
});
//khai báo biến
app.get('/', (req, res) => {
    res.render('Trangchu');
});

// app.get('/San-pham', (req, res) => {
//     var sp = [{ tensp: "Laptop Dell", Hinhanh: "https://cdni.dienthoaivui.com.vn/x420,webp,q100/https://dashboard.dienthoaivui.com.vn/uploads/wp-content/uploads/images/dell-01.png", gia: 5000000 },
//     { tensp: "Laptop lenovo", Hinhanh: "https://hanoicomputercdn.com/media/product/79109_laptop_lenovo_thinkpad_e15_g4__21e600fbva____2_.jpg", gia: 8000000 },
//     { tensp: "Laptop Dell", Hinhanh: "https://cdni.dienthoaivui.com.vn/x420,webp,q100/https://dashboard.dienthoaivui.com.vn/uploads/wp-content/uploads/images/dell-01.png", gia: 5000000 },
//     { tensp: "Laptop Dell", Hinhanh: "https://cdn2.fptshop.com.vn/unsafe/256x0/filters:quality(100)/2024_2_21_638441349664828683_lenovo-thinkbook-14-G6-irl-i5-13500h-5.jpg", gia: 5000000 },
//     ]
//     res.render('sanpham',{sanpham:sp});
// });
//mảng
app.get('/menu', (req, res) => {
    var data = { name: "Tuyển Cảnh" };
    var menu = [{ name: "gà rán" }, { name: "Thịt Quay" }, { name: "Văn Trung" }];
    res.render('home', { name: menu, hoten: data });
});


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'qlhh',

});
conn.connect(function (err) {
    if (err) throw err;
    console.log("kết nối thành công");
})
//cấu hình lưu file upload hình ảnh
var fileanh;
const luutru= multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./img');
    },
    filename:(req,file,callback)=>{
        fileanh=`${Date.now()}-${file.originalname}`;
        callback(null,fileanh);
    }

})
//khai báo biến upload để thực thi

var upload=multer({storage:luutru});
app.get('/San-pham', (req, res) => {
    //lấy dữ liệu từ mysql

    var sql = "select * from category";
    conn.query(sql, (err, cate) => {
        if (err) throw err;
        res.render('sanpham', { cat: cate });
    })


});
app.get('/cate', (req, res) => {
    //lấy dữ liệu từ mysql

    var sql = "select * from category";
    conn.query(sql, (err, cate) => {
        if (err) throw err;
        res.render('Category/Danhsach', { cat: cate });
    })


});
app.get('/cate/them', (req, res) => {
    res.render('Category/AddCate');
});

app.post('/cate/luu',upload.single('hinhanh'), (req, res) => {

    const Schema = Joi.object().keys({
        name: Joi.string().required().messages({ 'string.empty': 'Tên nhóm không được trống' }),
        gia: Joi.string().required().messages({ 'string.empty': 'giá không được trống' }),
      
    });
    const { error } = Schema.validate(req.body, Joi.options);
    if (error) {
       
        res.render('Category/AddCate', { err: error.details });
    }
    else {
        var sql = "INSERT INTO category (name,img,gia) VALUES ('" + req.body.name + "','"+ fileanh +"','" + req.body.gia + "')";
        conn.query(sql, (err, cate) => {
            if (err) throw err;
            res.redirect('/cate');
        })
    }

});







app.get('/cate/edit/:id', (req, res) => {
    //lấy dữ liệu từ mysql

    var sql = "select * from category where id=" + req.params.id;
    conn.query(sql, (err, cate) => {
        if (err) throw err;
        res.render('Category/EditCate', { cat: cate[0] });
    })


});

app.post('/edit/luu',upload.single('hinhanh'), (req, res) => {
   
    const Schema = Joi.object().keys({
        name: Joi.string().required().messages({ 'string.empty': 'Tên nhóm không được trống' }),
        gia: Joi.string().required().messages({ 'string.empty': 'giá không được trống' }),
        id: Joi.string().required().messages({ 'string.empty': 'giá không được trống' }),
    });
    const { error } = Schema.validate(req.body, Joi.options);
    if (error) {
        var sql = "select * from category where id=" + req.body.id;
        conn.query(sql, (err, cate) => {
        if (err) throw err;
        res.render('Category/EditCate', { cat: cate[0],err:error.details });
    });
        
    }
    else {
    var sql = `UPDATE category SET name='${req.body.name}',img='${fileanh}',gia='${req.body.gia}' WHERE id=${req.body.id}`;
    conn.query(sql, (err, cate) => {
        if (err) throw err;
        res.redirect('/cate');
    })
}
});
app.get('/cate/delete/:id', (req, res) => {
    //lấy dữ liệu từ mysql

    var sql = "delete  from category where id=" + req.params.id;
    conn.query(sql, (err, cate) => {
        if (err) throw err;
        res.redirect('/cate');
    })


});


app.listen(3000, () => {
    console.log("server đã được khởi tạo");
});