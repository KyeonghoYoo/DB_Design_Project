var express = require('express');
var session = require('express-session');

var router = express.Router();
var pool = require('../config/DataBaseUtill');

router.get('/login', (req, res, next) => {
    console.log("로그인 화면 요청");
    if (req.session.isLogin) {
        res.redirect('/franchiseInfo/readList');
    } else {
        res.render('login', { session: req.session });
    }
});
router.get('/signUp', (req, res, next) => {
    console.log("회원가입 화면 요청");
    if (req.session.isLogin) {
        res.redirect('/franchiseInfo/readList');
    } else {
        res.render('Signup', { session: req.session });
    }

});
router.get('/logout', (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) throw err;
        res.redirect('/franchiseInfo/readList');
    });
});

router.get('/company', (req, res, next) => {
    console.log('/company 요청 처리');
    var values = [
        req.query.InquiryNum
    ];
    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `SELECT a.*, b.StateName FROM FranchiseRegInquiry a, InquiryState b WHERE a.StateCode = b.StateCode`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }

            if (row.length !== 0) {
                res.render('company', { session: req.session, Inquiries: row });
            } else {
                res.redirect('/generalMember/readMyPage');
            }
        })
    })
});

router.get('/ReadBrand', (req, res, next) => {
    if (req.session.isLogin) {
        console.log('/ReadBrand 요청 처리');
    var values = [
        req.query.InquiryNum
    ];

    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `SELECT a.*, b.StateName FROM franchiseconsultinquiry a, InquiryState b 
                    WHERE a.StateCode = b.StateCode and a.InquiryNum = ?`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }

            if (row.length !== 0) {
                res.render('ReadBrand', { session: req.session, Inquiry: row[0] });
            } else {
                res.redirect('/franchiseInfo/readList')
            }
        })
    })
    } else {
        res.render('login', { session: req.session });
    }
});

router.get('/WriteConsult', (req, res, next) => {
    if (req.session.isLogin) {
        res.render('WriteConsult', { session: req.session });
    } else {
        res.render('login', { session: req.session });
    }

});

router.get('/WriteGeneral', (req, res, next) => {
    if (req.session.isLogin) {
        res.render('WriteGeneral', { session: req.session });
    } else {
        res.render('login', { session: req.session });
    }

});
router.post('/WriteGeneral', (req, res, next) => {
    console.log('/WriteCompany 요청 처리');
    var values = [
        'G01',
        req.session.userInfo.MemberId,
        req.body.title,
        req.body.content
    ];
    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `INSERT INTO generalinquiry(StateCode, MemberId,
                 RegDate, Title, Content) 
                 VALUES(?, ?, now(), ?, ?)`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }
            res.redirect('/UserPage');
        })
    })
});
router.get('/RecommendBrand', (req, res, next) => {
    console.log('/RecommendBrand 요청 처리');
    if (req.session.isLogin) {
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }
            var sql1 = `SELECT * 
            FROM interestedbusiness a, generalmember b, businesstype c 
            where a.memberid = b.memberid 
            and c.BusinessTypeCode = a.BusinessTypeCode
            and b.memberid = ?`;

            var sql2 = `SELECT a.FranchiseInfoNum, a.photoURL, b.Name, c.BusinessTypeName 
            FROM franchiseinfo a, franchise b, businesstype c 
            WHERE a.FranchiseNum = b.FranchiseNum 
            and b.BusinessTypeCode = c.BusinessTypeCode
            and b.BusinessTypeCode = ?`;
            /*and now() >= a.PostStartDate 
            and now() <= a.PostEndDate`;*/

            var franchiseInfoList = new Array();
            conn.query(sql1, [req.session.userInfo.MemberId], (err, row1) => {
                if (err) {
                    throw err;
                }
                if (row1.length !== 0) {
                    row1.forEach(function (el, index1) {
                        conn.query(sql2, [el.BusinessTypeCode], (err, row2) => {
                            if (err) {
                                throw err;
                            }
                            if (row2.length !== 0) {
                                row2.forEach(function (el, index2) {
                                    franchiseInfoList.push(el);
                                });
                            }
                            console.log('index1 ' + index1 + ', row1.lenth ' + row1.length);
                            if (index1 === row1.length - 1) {
                                console.log('result:' + franchiseInfoList);
                                res.render('RecommendBrand', { session: req.session, FranchiseList: franchiseInfoList });
                            }
                        })
                    });
                } else {
                    res.redirect('/franchiseInfo/readList');
                }
            })

        })

    } else {
        res.render('login', { session: req.session });
    }


});
router.get('/UserPage', (req, res, next) => {
    console.log('/UserPage 요청 처리');
    if (req.session.isLogin) {
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }

            var sql = `SELECT * FROM GeneralMember WHERE MemberId = ?`;
            var sql2 = `SELECT a.*, c.Name, b.StateName FROM GeneralInquiry a, 
                        InquiryState b, GeneralMember c WHERE a.StateCode = b.StateCode and a.MemberId = c.MemberId
                         and a.MemberId = ?`;
            var sql3 = `SELECT a.*, c.Name, b.StateName FROM startbusinessconsultinquiry a, 
                        InquiryState b, GeneralMember c WHERE a.StateCode = b.StateCode and a.MemberId = c.MemberId
                         and a.MemberId = ?`;
            var sql4 = `SELECT a.*, c.Name, d.Name as FranchiseName, b.StateName FROM franchiseconsultinquiry a, 
            InquiryState b, GeneralMember c, franchise d, franchiseinfo e WHERE a.StateCode = b.StateCode
             and a.MemberId = c.MemberId and a.FranchiseInfoNum = e.FranchiseInfoNum 
             and e.franchiseNum = d.franchiseNum
             and a.MemberId = ?`;
            var sql5 = `SELECT c.* FROM interestedbusiness a, generalmember b, businesstype c where a.memberid = b.memberid 
             and c.BusinessTypeCode = a.BusinessTypeCode and b.memberid = ?`;
            // 사용자 정보 추출
            var MemberId = req.session.userInfo.MemberId;
            conn.query(sql, [MemberId], (err, row1) => {
                if (err) {
                    throw err;
                }

                if (row1.length !== 0) {
                    conn.query(sql2, [MemberId], (err, row2) => {
                        if (err) {
                            throw err;
                        }
                        conn.query(sql3, [MemberId], (err, row3) => {
                            if (err) {
                                throw err;
                            }
                            conn.query(sql4, [MemberId], (err, row4) => {
                                if (err) {
                                    throw err;
                                }
                                conn.query(sql5, [MemberId], (err, row5) => {
                                    if (err) {
                                        throw err;
                                    }
                                    res.render('UserPage', {
                                        session: req.session, userInfo: row1[0], generalInquiries: row2,
                                        startBusinessInquiries: row3, FranchiseInquiries: row4, interestedbusiness: row5
                                    })
                                });
                            });
                        });
                    });
                } else {
                    res.redirect('/franchiseInfo/readList');
                }
            });
        })
    } else {
        res.render('login', { session: req.session });
    }

});
router.get('/WriteCompany', (req, res, next) => {
    res.render('WriteCompany', { session: req.session });
});
router.post('/WriteCompany', (req, res, next) => {
    console.log('/WriteCompany 요청 처리');
    var values = [
        'R01',
        req.body.name,
        req.body.password,
        req.body.contactNumber,
        req.body.email,
        req.body.title,
        req.body.content
    ];
    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `INSERT INTO franchisereginquiry(StateCode, RegDate, Name,
                 Password, ContactNumber, Email, Title, Content) 
                 VALUES(?, now(), ?, ?, ?, ?, ?, ?)`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }
            res.redirect('/Company');
        })
    })
});

router.get('/ReadCompany', (req, res, next) => {
    console.log('/ReadCompany 요청 처리');
    var values = [
        req.query.InquiryNum
    ];

    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `SELECT a.*, b.StateName FROM generalinquiry a, inquirystate b 
                    WHERE a.StateCode = b.StateCode and a.InquiryNum = ?`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }

            if (row.length !== 0) {
                res.render('ReadCompany', { session: req.session, Inquiry: row[0] });
            } else {
                res.redirect('/franchiseInfo/readList');
            }
        })
    })
});

router.get('/ReadConsult', (req, res, next) => {
    if (req.session.isLogin) {
        console.log('/ReadCompany 요청 처리');
    var values = [
        req.query.InquiryNum
    ];

    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `SELECT a.*, b.StateName FROM startbusinessconsultinquiry a, InquiryState b 
                    WHERE a.StateCode = b.StateCode and a.InquiryNum = ?`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }

            if (row.length !== 0) {
                res.render('ReadConsult', { session: req.session, Inquiry: row[0] });
            } else {
                res.redirect('/franchiseInfo/readList')
            }
        })
    })
    } else {
        res.render('login', { session: req.session });
    }
});
router.get('/ReadBrand', (req, res, next) => {
    if (req.session.isLogin) {
        console.log('/ReadCompany 요청 처리');
    var values = [
        req.query.InquiryNum
    ];

    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `SELECT a.*, b.StateName FROM FranchiseRegInquiry a, InquiryState b 
                    WHERE a.StateCode = b.StateCode and a.InquiryNum = ?`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }

            if (row.length !== 0) {
                res.render('ReadBrand', { session: req.session, Inquiry: row[0] });
            } else {
                res.redirect('/franchiseInfo/readList')
            }
        })
    })
    } else {
        res.render('login', { session: req.session });
    }
});
router.get('/ReadGeneral', (req, res, next) => {
    if (req.session.isLogin) {
        console.log('/ReadCompany 요청 처리');
    var values = [
        req.query.InquiryNum
    ];

    pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
            console.log('컨넥션 실패');
            throw err;
        }

        var sql = `SELECT a.*, b.StateName FROM generalinquiry a, InquiryState b 
                    WHERE a.StateCode = b.StateCode and a.InquiryNum = ?`;

        conn.query(sql, values, (err, row) => {
            if (err) {
                throw err;
            }

            if (row.length !== 0) {
                res.render('ReadGeneral', { session: req.session, Inquiry: row[0] });
            } else {
                res.redirect('/franchiseInfo/readList')
            }
        })
    })
    } else {
        res.render('login', { session: req.session });
    }
});

router.get('/WriteBrand', (req, res, next) => {
    if (req.session.isLogin) {
        res.render('WriteBrand', { session: req.session, FranchiseInfo: req.query.FranchiseInfo });
    } else {
        res.render('login', { session: req.session });
    }
});

router.post('/WriteBrand', (req, res, next) => {
    if (req.session.isLogin) {
        var values = [
            'F01',
            req.session.userInfo.MemberId,
            req.body.FranchiseInfo,
            req.body.title,
            req.body.content,
            req.body.city,
            req.body.county,
            req.body.fund,
            
        ];
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }

            var sql = `INSERT INTO franchiseconsultinquiry(StateCode, MemberId, FranchiseInfoNum,
                 RegDate, ModifiDate, Title, Content, City, County, Fund) 
            VALUES(?, ?, ?, now(), now(), ?, ?, ?, ?, ?)`;

            conn.query(sql, values, (err, row) => {
                if (err) {
                    throw err;
                }
                if (row) {
                    res.redirect('/UserPage');
                } else {
                    res.redirect('/franchiseInfo/readList')
                }
            });
        });
    } else {
        res.render('login', { session: req.session });
    }
});
router.post('/insertInterested', (req, res, next) => {
    if (req.session.isLogin) {
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }

            var sql = `INSERT INTO InterestedBusiness(MemberId, BusinessTypeCode) 
                     VALUES(?, ?)`;

            conn.query(sql, [req.session.userInfo.MemberId, req.body.businessType], (err, row) => {
                if (err) {
                    throw err;
                }
                res.redirect('/UserPage');
            })
        })
    } else {
        res.render('login', { session: req.session });
    }
});
router.get('/deleteInterested', (req, res, next) => {
    if (req.session.isLogin) {
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }

            var sql = `DELETE FROM InterestedBusiness 
                     WHERE MemberId = ? and BusinessTypeCode = ?`;

            conn.query(sql, [req.session.userInfo.MemberId, req.query.businessTypeCode], (err, row) => {
                if (err) {
                    throw err;
                }
                res.redirect('/UserPage');
            });
        });
    } else {
        res.render('login', { session: req.session });
    }
});
router.get('/deleteGeneral', (req, res, next) => {
    if (req.session.isLogin) {
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }

            var sql = `DELETE FROM InterestedBusiness 
                     WHERE MemberId = ? and BusinessTypeCode = ?`;

            conn.query(sql, [req.session.userInfo.MemberId, req.query.businessTypeCode], (err, row) => {
                if (err) {
                    throw err;
                }
                res.redirect('/UserPage');
            });
        });
    } else {
        res.render('login', { session: req.session });
    }
});
router.get('/deleteConsult', (req, res, next) => {
    if (req.session.isLogin) {
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }

            var sql = `DELETE FROM InterestedBusiness 
                     WHERE MemberId = ? and BusinessTypeCode = ?`;

            conn.query(sql, [req.session.userInfo.MemberId, req.query.businessTypeCode], (err, row) => {
                if (err) {
                    throw err;
                }
                res.redirect('/UserPage');
            });
        });
    } else {
        res.render('login', { session: req.session });
    }
});
router.get('/deleteBrand', (req, res, next) => {
    if (req.session.isLogin) {
        pool.getConnection((err, conn) => {
            conn.release();
            if (err) {
                console.log('컨넥션 실패');
                throw err;
            }

            var sql = `DELETE FROM InterestedBusiness 
                     WHERE MemberId = ? and BusinessTypeCode = ?`;

            conn.query(sql, [req.session.userInfo.MemberId, req.query.businessTypeCode], (err, row) => {
                if (err) {
                    throw err;
                }
                res.redirect('/UserPage');
            });
        });
    } else {
        res.render('login', { session: req.session });
    }
});
module.exports = router;
