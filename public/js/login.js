// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDY0t_RalBk-y_bbHLyz5HAUXAmOKjql-Y",
    authDomain: "smart-2nd-project.firebaseapp.com",
    projectId: "smart-2nd-project",
    storageBucket: "smart-2nd-project.firebasestorage.app",
    messagingSenderId: "1077633477341",
    appId: "1:1077633477341:web:cbb3f327a4a4b593b54934",
    measurementId: "G-SR2L6SKVTS"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM 요소
const body = document.getElementById("body");
const popupArea = document.getElementById("popupArea");

// 로그인 input
const userV = document.getElementById("user");
const passV = document.getElementById("pass");
const loginBtn = document.getElementById("loginBtn");
const signUpBtnL = document.getElementById("signUpBtnL");

// 회원가입 input
const signUpUser = document.getElementById("signUpUser");
const signUpName = document.getElementById("signUpName");
const signUpPass = document.getElementById("signUpPass");
const signUpPassV = document.getElementById("signUpPassV");
const signUpBtnS = document.getElementById("signUpBtnS");

const messageV = document.getElementById("message");

// ===== 함수 선언 (function 키워드 사용) =====

// 메시지 관련 함수들 (먼저 선언)
function clearMessage() {
    messageV.classList.remove("show", "success", "error");
    messageV.innerText = "";
}

function hideMessage() {
    messageV.classList.remove("show");
    
    setTimeout(() => {
        messageV.innerText = "";
        messageV.classList.remove("success", "error");
    }, 250);
}

function showMessage(msg, type, duration = 1000) {
    clearMessage();
    
    messageV.innerText = msg;
    messageV.classList.add("show", type);
    
    setTimeout(hideMessage, duration);
}

// 폼 초기화
function resetForm() {
    userV.value = "";
    passV.value = "";
    signUpUser.value = "";
    signUpName.value = "";
    signUpPass.value = "";
    signUpPassV.value = "";
    clearMessage();
}

// 팝업 열기
function openPopup(target) {
    // 현재 페이지 URL 저장 (login.html이 아닌 경우)
    if (document.querySelector('header')) {
        sessionStorage.setItem('returnUrl', window.location.href);
    }
    
    popupArea.style.display = "block";
    popupArea.offsetHeight;
    popupArea.classList.add("show");

    if (target === "signup") {
        popupArea.classList.add("signup");
    } else {
        popupArea.classList.remove("signup");
    }

    resetForm();
}

// 팝업 닫기
function closePopup() {
    popupArea.classList.remove("show");

    setTimeout(() => {
        popupArea.style.display = "none";
    }, 400);
}

// 회원가입
function signUp() {
    const email = signUpUser.value.trim();
    const name = signUpName.value.trim();
    const password = signUpPass.value.trim();
    const passwordVerify = signUpPassV.value.trim();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    // 입력값 검증
    if (!email && !name && !password && !passwordVerify) {
        showMessage("회원가입 정보를 입력해주세요.", "error", 1500);
        return;
    }
    if (!email) {
        showMessage("이메일을 입력해주세요.", "error", 1500);
        return;
    }
    if (!name) {
        showMessage("닉네임을 입력해주세요.", "error", 1500);
        return;
    }
    if (!password) {
        showMessage("비밀번호를 입력해주세요.", "error", 1500);
        return;
    }
    if (!passwordVerify) {
        showMessage("비밀번호 확인을 입력해주세요.", "error", 1500);
        return;
    }
    if (!passwordRegex.test(password)) {
        showMessage("비밀번호는 영문+숫자 조합 6자 이상이어야 합니다.", "error", 1500);
        return;
    }
    if (password !== passwordVerify) {
        showMessage("비밀번호가 일치하지 않습니다.", "error", 1500);
        signUpPassV.focus();
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            showMessage("회원이 되신 걸 축하합니다. 로그인 해주세요.", "success", 1500);
            setTimeout(() => {
                popupArea.classList.remove("signup");
            }, 1500);
        })
        .catch((error) => {
            let errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
                showMessage("이미 있는 계정입니다.", "error", 1500);
            } else if (error.code === "auth/invalid-email") {
                showMessage("이메일을 제대로 입력해주세요.", "error", 1500);
            }
        });
}

// 로그인
function login() {
    let loginEmail = userV.value.trim();
    let loginPassword = passV.value.trim();

    if (!loginEmail && !loginPassword) {
        showMessage("이메일과 비밀번호를 입력해주세요.", "error");
        return;
    }

    if (!loginEmail) {
        showMessage("이메일을 입력해주세요.", "error", 1500);
        userV.focus();
        return;
    }

    if (!loginPassword) {
        showMessage("비밀번호를 입력해주세요.", "error", 1500);
        passV.focus();
        return;
    }

    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            const name = user.displayName || "회원";

            showMessage(`환영합니다, ${name}님!`, "success", 1500);
            
            setTimeout(() => {
                // sessionStorage에 저장된 URL이 있으면 복귀
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl) {
                    sessionStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    // 저장된 URL이 없으면 index.html로 이동
                    window.location.href = 'index.html';
                }
            }, 1500);
        })
        .catch((error) => {
            console.log(error.code);
            if (error.code === "auth/invalid-login-credentials" ||
                error.code === "auth/invalid-credential") {
                showMessage("이메일 또는 비밀번호가 올바르지 않습니다.", "error", 1500);
            } else if (error.code === "auth/invalid-email") {
                showMessage("이메일 형식이 올바르지 않습니다.", "error", 1500);
            }
        });
}

// ===== 이벤트 리스너 등록 =====

// 페이지 로드 시 자동으로 팝업 열기 (login.html 페이지일 때만)
window.addEventListener('DOMContentLoaded', () => {
    // header가 없으면 login.html 페이지로 판단
    if (!document.querySelector('header')) {
        openPopup();
    }
});

// 로그인 내부 회원가입 버튼 → 회원가입 탭
signUpBtnL.addEventListener("click", () => {
    popupArea.classList.add("signup");
    resetForm();
});

// 배경 클릭 시 닫기 (다른 페이지에서 팝업으로 사용할 때만)
if (body) {
    body.addEventListener("click", (e) => {
        if (e.target === body && document.querySelector('header')) {
            closePopup();
        }
    });
}

// 회원가입 버튼
signUpBtnS.addEventListener("click", signUp);

// 로그인 버튼
loginBtn.addEventListener("click", login);