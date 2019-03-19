var express = require('express');
var session = require('express-session');

var router = express.Router();
var pool = require('../config/DataBaseUtill');


// 로그인 요청
router.post('/login', (req, res, next) => {
  console.log('/GeneralMember/login 요청 처리');
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `SELECT *
               FROM generalmember
               WHERE MemberId=? and password=?`;

    var memberId = req.body.memberId;
    var password = req.body.password;
    var values = [
      memberId,
      password
    ];
    conn.query(sql, values, (err, row) => {
      if (err) {
        throw err;
      }

      if (row.length !== 0) {
        req.session.isLogin = true;
        req.session.userInfo = row[0];
        res.redirect('/franchiseInfo/readList');
      } else {
        req.session.isLogin = false;
        res.render('login');
      }
    })
  })
});
/* GET Product page. */

// 회원가입 요청
router.post('/write', function (req, res, next) {
  console.log('/generalMember/write 요청 처리');
  var values = [
    req.body.memberId,
    req.body.password,
    req.body.Name,
    req.body.tele1 + '-' + req.body.tele2 + '-' + req.body.tele3,
    req.body.email1 + req.body.email2
  ];
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `INSERT INTO GeneralMember(MemberId, Password, Name, ContactNumber, Email, RegDate, ModifiDate) 
                            VALUES(?, ?, ?, ?, ?, now(), now())`;

    conn.query(sql, values, (err, row) => {
      if (err) {
        throw err;
      }

      if (row) {
        res.render('Login');
      } else {
        res.render('Signup', { result: false });
      }
    })
  })
});

// 마이페이지 요청
router.get('/readMyPage', function (req, res, next) {
  console.log('/GeneralMember/readMyPage 요청 처리');


  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }
    
    var sql = `SELECT * FROM GeneralMember WHERE MemberId = ?`;
    var sql2 = `SELECT * FROM GeneralInquiry WHERE MemberId = ?`;
    var sql3 = `SELECT * FROM StartBusinessConsultInquiry WHERE MemberId = ?`;
    var sql4 = `SELECT * FROM FranchiseConsultInquiry WHERE MemberId = ?`;
    var result = [];
    // 사용자 정보 추출
    var MemberId = req.session.userInfo.MemberId;
    conn.query(sql, [ MemberId ], (err, row1) => {
      if (err) {
        throw err;
      }

      if (row.length !== 0) {
        conn.query(sql2, [ MemberId ], (err, row2) => {
          if (err) {
            throw err;
          }
          conn.query(sql3, [ MemberId ], (err, row3) => {
            if (err) {
              throw err;
            }
            conn.query(sql4, [ MemberId ], (err, row4) => {
              if (err) {
                throw err;
              }
              res.render('UserPage', { userInfo: row1[0], generalInquiries: row2, startBusinessInquiries: row3, FranchiseInquiries: row4 })
            });
          });
        });
      } else {
        res.redirect('/franchiseInfo/readList');
      }
    });
  })
});
router.get('/login', (req, res, next)=>{
  console.log("로그인 화면 요청");
  res.render('login');
});
router.get('/signUp', (req, res, next)=>{
  console.log("회원가입 화면 요청");
  res.render('Signup');
});
router.get('/logout', (req, res, next)=>{
  req.session.destroy(function(err){
    if(err) throw err;
    res.redirect('/franchiseInfo/readList');    
  });
});

module.exports = router;
