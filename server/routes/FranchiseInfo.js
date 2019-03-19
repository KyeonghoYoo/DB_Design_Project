var express = require('express');
var router = express.Router();
var pool = require('../config/DataBaseUtill');
var multer = require('multer');

var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: _storage });
var http = require('http');



router.post('/testPhoto', upload.single('file'), (req, res, next) => {
  console.log('public/images/' + req.file.originalname);
  res.send({
    a: req.file,
    b: req.body
  })
});
/* GET Product page. */

// 등록 요청
router.post('/write', upload.single('photo'), function (req, res, next) {
  console.log('/FranchiseInfo/write 요청 처리');
  var values = [
    req.body.FranchiseNum,
    req.body.PostStartDate,
    req.body.PostEndDate,
    req.body.ExpenseInfo,
    req.body.ExpectedProfitInfo,
    req.body.DetailContent,
    'public/images/' + req.file.originalname
  ];

  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `INSERT INTO franchiseinfo(FranchiseNum, RegDate, ModifiDate, PostStartDate, PostEndDate, ExpenseInfo, ExpectedProfitInfo, DetailContent, photoURL) 
                            VALUES(?, now(), now(), ?, ?, ?, ?, ?, ?)`;

    conn.query(sql, values, (err, row) => {
      if (err) {
        throw err;
      }

      if (row) {
        res.redirect('/franchiseInfo/readList');
      } else {
        res.send(500, {
          result: "fail",
          status: 500
        });
      }
    })
  })
});

// 리스트 조회 요청(메인화면)
router.get('/readList', function (req, res, next) {
  console.log('/franchiseInfo/readList 요청 처리');
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `SELECT a.FranchiseInfoNum, b.Name, c.BusinessTypeName , a.photoURL FROM FranchiseInfo a, Franchise b, businesstype c 
    where a.FranchiseNum = b.FranchiseNum and b.BusinessTypeCode = c.BusinessTypeCode`; // and now() >= a.PostStartDate and now() <= a.PostEndDate`;

    conn.query(sql, (err, row) => {
      if (err) {
        throw err;
      }

      if (row.length !== 0) {
        res.render('main', { session: req.session, result: 'Sucess', FranchiseList: row });
      } else {
        res.render('main', { session: req.session, result: 'Fail', FranchiseList: row });
      }
    })
  })
});

// 가맹정보 상세보기 요청
router.get('/read', function (req, res, next) {
  console.log('/franchiseInfo/read 요청 처리');
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `SELECT a.*, b.Name, c.BusinessTypeName
    FROM FranchiseInfo a, Franchise b, businesstype c 
    where a.FranchiseNum = b.FranchiseNum 
    and b.BusinessTypeCode = c.BusinessTypeCode
    and a.FranchiseInfoNum = ?`;

    conn.query(sql, [req.query.franchiseInfoNum], (err, row) => {
      if (err) {
        throw err;
      }
      if (row.length !== 0) {
        res.render('ReadStore', { session: req.session, result: 'Sucess', FranchiseInfo: row[0] });
      } else {
        res.redirect('/franchiseInfo/readList');
      }
    })
  });
});

// 가맹정보 검색
router.get('/search', function (req, res, next) {
  console.log('/search 요청 처리');
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `SELECT a.FranchiseInfoNum, a.photoURL, b.Name, c.BusinessTypeName FROM franchiseinfo a, franchise b, businesstype c WHERE a.FranchiseNum = b.FranchiseNum 
               and b.BusinessTypeCode = c.BusinessTypeCode and b.Name LIKE CONCAT('%',? ,'%')` //and now() >= a.PostStartDate and now() <= a.PostEndDate`;

    conn.query(sql, [req.query.keyword], (err, row) => {
      if (err) {
        throw err;
      }
      if (row.length !== 0) {
        res.render('main', { session: req.session, result: 'Sucess', FranchiseList: row });
      } else {
        res.redirect('/franchiseInfo/readList');
      }
    })
  })
});

module.exports = router;
