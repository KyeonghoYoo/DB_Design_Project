var express = require('express');
var session = require('express-session');

var router = express.Router();
var pool = require('../config/DataBaseUtill');

/* 상태코드
- 일반 문의
G01 = 답변 대기
G02 = 답변 완료
- 업체 등록 문의
R01 = 상담 대기
R02 = 상담 진행
R03 = 업체 등록 완료
R04 = 상담 완료
-창업 상담 문의
S01 = 상담 대기
S02 = 상담 진행
S03 = 가맹 계약 완료
S04 = 상담 완료
- 가맹정보별 창업 상담 문의
F01 = 상담 대기
F02 = 상담 진행
F03 = 가맹 계약 완료
F04 = 상담 완료
*/

// 등록 요청
router.post('/write', function (req, res, next) {
  console.log('/franchiseConsultInquiry/write 요청 처리');
  var values = [
    req.body.FranchiseInfoNum,
    req.session.memberInfo.MemberId,
    req.body.title,
    req.body.Content,
    req.body.City,
    req.body.County,
    req.body.Fund,
    'F01'
  ];
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `INSERT INTO FranchiseConsultInquiry(FranchiseInfoNum, MemberId, RegDate, ModifiDate, Title, Content, City, County, Fund, StateCode) 
                            VALUES(?, ?, now(), now(), ?, ?, ?, ?, ?, ?)`;

    conn.query(sql, values, (err, row) => {
      if (err) {
        throw err;
      }

      if (row) {
        res.redirect('/generalMember/readMyPage');
      } else {
        res.redirect('/generalMember/readMyPage');
      }
    })
  })
});


//삭제 요청
router.post('/delete', function (req, res, next) {
  console.log('/franchiseConsultInquiry/delete 요청 처리');
  var values = [
    req.body.InquiryNum 
  ];

  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `DELETE FROM FranchiseConsultInquiry where InquiryNum = ?`;

    conn.query(sql, values, (err, row) => {
      if (err) {
        throw err;
      }

      if (row) {
        res.redirect('/generalMember/readMyPage');
      } else {
        res.redirect('/generalMember/readMyPage');
      }
    })
  })
});

// 상세 보기
router.get('/read', function (req, res, next) {
  console.log('/FranchiseConsultInquiry/read 요청 처리');
  var values = [
    req.query.InquiryNum
  ];
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `SELECT * FROM FranchiseConsultInquiry WHERE InquiryNum = ?`;

    conn.query(sql, values, (err, row) => {
      if (err) {
        throw err;
      }

      if (row.length !== 0) {
        res.render('상세보기', { ConsultInquiry: row[0] });
      } else {
        res.redirect('/generalMember/readMyPage');
      }
    })
  })
});

module.exports = router;
