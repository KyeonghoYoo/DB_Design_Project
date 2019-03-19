document.getElementById("login_button").removeAttribute("disabled");
document.getElementById("reset").removeAttribute("disabled");

document.getElementById("login_button").onclick = checkUser;

function checkUser() {
    username_in = document.getElementById("username").value;
    password_in = document.getElementById("password").value;

    var localStorage = window.localStorage;
    if (!localStorage) {
        // local storage is not supported by this browser.
        // do nothing
    }
    else {
        numUsers = localStorage.numUsers;

        var login_success = false;
        if (numUsers != undefined) {
            for(i=0;i<numUsers;i++) {
                username = localStorage["user"+i];
                password = localStorage["pass"+i];

                if (username == username_in && password== password_in) {
                    login_success = true;
                    break;
                 }
            }
        }

        if (login_success)
            alert("로그인 성공!");
        else
            alert("등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.");
    }
}