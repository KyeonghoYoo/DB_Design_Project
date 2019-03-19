var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index')
var generalMemberRouter = require('./routes/GeneralMember');
var franchiseInfoRouter = require('./routes/FranchiseInfo');
var generalInquiryRouter = require('./routes/GeneralInquiry');
var startBusinessConsultInquiryRouter = require('./routes/StartBusinessConsultInquiry');
var franchiseConsultInquiryRouter = require('./routes/FranchiseConsultInquiry');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'@#@$MYSIGN#@$#$',
  resave: false, 
  saveUninitialized: true
}));

app.use('/', indexRouter);
/*
로그인 요청 /login,
회원가입 요청 /write,
마이페이지 요청 /readMyPage,
*/
app.use('/generalMember', generalMemberRouter);
/*
등록 요청 /write,
리스트 조회 요청(메인 화면) /readList,
가맹정보 상세보기 요청 /read,
가맹정보 검색 요청 /search,
*/
app.use('/franchiseInfo', franchiseInfoRouter);
/*
등록 요청 /write,
수정 요청 /modifi,
삭제 요청 /delete
*/
app.use('/generalInquiry', generalInquiryRouter);
/*
등록 요청 /write,
수정 요청 /modifi,
삭제 요청 /delete
*/
app.use('/startBusinessConsultInquiryRouter', startBusinessConsultInquiryRouter);
/*
등록 요청 /write,
수정 요청 /modifi,
삭제 요청 /delete
*/
app.use('/franchiseConsultInquiryRouter', franchiseConsultInquiryRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
