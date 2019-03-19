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
  console.log('/generalInquiry/modifi 요청 처리');
  var values = [
    'G01',
    req.session.memberInfo.MemberId,
    req.body.title,
    req.body.Content
  ];
  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `INSERT INTO GeneralInquiry(StateCode, MemberId, RegDate, ModifiDate, Title, Content) 
                            VALUES(?, ?, now(), now(), ?, ?)`;

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
  console.log('/generalInquiry/delete 요청 처리');
  var values = [
    req.body.InquiryNum 
  ];

  pool.getConnection((err, conn) => {
    conn.release();
    if (err) {
      console.log('컨넥션 실패');
      throw err;
    }

    var sql = `DELETE FROM GeneralInquiry where InquiryNum = ?`;

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

module.exports = router;
