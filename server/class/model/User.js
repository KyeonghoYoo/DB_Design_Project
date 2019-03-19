var DataBaseUtill = require('../../config/DataBaseUtill');


class User{
    id;
    password;
    email;
    name;
    conn;

    // 유저 상세보기 조회
    getUser(){
        conn = DataBaseUtill.getConnection();



        DataBaseUtill.end(conn);
    }
    // 유저 등록
    insertUser(){
        conn = DataBaseUtill.getConnection();
    }
}

module.exports = User;