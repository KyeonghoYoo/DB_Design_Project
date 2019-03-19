document.getElementById("dup_check").removeAttribute("disabled");
document.getElementById("signup_button").removeAttribute("disabled");
document.getElementById("reset2").removeAttribute("disabled");

document.getElementById("dup_check").onclick = duplicationCheck;
document.getElementById("signup_button").onclick = signup;

function duplicationCheck() {
    username_in = document.getElementById("username2").value;

    var localStorage = window.localStorage;
    if (!localStorage) {
        // local storage is not supported by this browser.
        // do nothing
    }
    else {
        numUsers = localStorage.numUsers;

        var duplicate = false;
        if (numUsers != undefined) {
            for(i=0;i<numUsers;i++) {
                username = localStorage["user"+i];
                if (username == username_in) {
                    duplicate = true;
                    break;
                 }
            }
        }

        if (duplicate)
            alert(username_in + " 는 중복된 ID입니다. 다른 ID를 입력해주세요.");
        else
            alert(username_in + "는 사용 가능한 아이디입니다.");
    }
}

function signup() {
    username_in = document.getElementById("username2").value;
    password_in1 = document.getElementById("pass1").value;

    var localStorage = window.localStorage;
    if (!localStorage) {
        // local storage is not supported by this browser.
        // do nothing
    }
    else {
        numUsers = localStorage.numUsers;
        if (numUsers == undefined) numUsers = "0";
        localStorage["user"+numUsers] = username_in;
        localStorage["pass"+numUsers] = password_in1;
        localStorage.numUsers = parseInt(numUsers) + 1;
        alert("가입 성공!\n" + "Number of users: " + localStorage.numUsers);
    }
}