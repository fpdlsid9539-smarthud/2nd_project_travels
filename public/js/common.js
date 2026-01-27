// Firebase 초기화 변수
let auth = null;

// Firebase 초기화 함수
function initFirebase() {
    if (typeof firebase !== 'undefined') {
        const firebaseConfig = {
            apiKey: "AIzaSyDY0t_RalBk-y_bbHLyz5HAUXAmOKjql-Y",
            authDomain: "smart-2nd-project.firebaseapp.com",
            projectId: "smart-2nd-project",
            storageBucket: "smart-2nd-project.firebasestorage.app",
            messagingSenderId: "1077633477341",
            appId: "1:1077633477341:web:cbb3f327a4a4b593b54934",
            measurementId: "G-SR2L6SKVTS"
        };

        // Firebase 초기화 (이미 초기화되지 않았다면)
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
        return true;
    }
    return false;
}

// ============= Header 자동 생성 =============
function createHeader() {
    const headerHTML = `
        <header>
            <div id="headerContainer">
                <div id="headerHomeBtn">
                    <a href="index.html">
                        <img src="./IMG/rogo.png" alt="로고">
                        <span class="logo-text">어디가까</span>
                    </a>
                </div>

                <div id="headerBtns">
                    <!-- 로그인 전 표시 -->
                    <div id="beforeLogin">
                        <button class="headerBtn1">
                            <img src="./IMG/login.png" class="btnIcon" alt="로그인">
                        </button>
                    </div>
                    
                    <!-- 로그인 후 표시 -->
                    <div id="afterLogin" style="display: none;">
                        <div id="welcomeMessage">
                            <span id="userName"></span>님, 환영합니다
                        </div>
                        <button id="logoutBtn" class="headerBtn1">
                            <img src="./IMG/login.png" class="btnIcon" alt="로그아웃">
                        </button>
                        <button id="bookmarkBtn" class="headerBtn2">
                            <img src="./IMG/bookmark.png" class="btnIcon" alt="즐겨찾기">
                        </button>
                    </div>
                </div>
            </div>
        </header>
    `;

    const headerContainer = document.getElementById('header');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
    }
}

// ============= Footer 자동 생성 =============
function createFooter() {
    const footerHTML = `
        <footer>
            <div id="footerContainer">
                <div class="footerInfo">
                    <h3>스마트 인재 개발원</h3>
                    <p>주소: 광주광역시 동구 중앙로 196</p>
                    <p>전화: 1522-7800</p>
                    <p>이메일: osuri9539@naver.com</p>
                </div>
                <div class="footerCopyright">
                    Copyright © 2026 스마트 인재 개발원. All rights reserved.
                </div>
            </div>
        </footer>
    `;

    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

// ============= 로그인 상태 UI 업데이트 =============
function updateAuthUI(user) {
    const beforeLogin = document.getElementById('beforeLogin');
    const afterLogin = document.getElementById('afterLogin');
    const userNameSpan = document.getElementById('userName');
    const logoutBtnImg = document.querySelector('#logoutBtn .btnIcon');

    if (user) {
        // 로그인 상태
        const displayName = user.displayName || user.email.split('@')[0];
        userNameSpan.textContent = displayName;
        
        // 로그아웃 버튼 이미지 변경
        if (logoutBtnImg) {
            logoutBtnImg.src = './IMG/logout.png';
            logoutBtnImg.alt = '로그아웃';
        }
        
        beforeLogin.style.display = 'none';
        afterLogin.style.display = 'flex';
    } else {
        // 로그아웃 상태
        beforeLogin.style.display = 'block';
        afterLogin.style.display = 'none';
    }
}

// ============= Header 버튼 이벤트 =============
function initHeaderEvents() {
    // 로그인 버튼
    const loginBtn = document.querySelector('#beforeLogin .headerBtn1');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // 현재 페이지 URL 저장
            sessionStorage.setItem('returnUrl', window.location.href);
            window.location.href = 'login.html';
        });
    }

    // 로그아웃 버튼
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (auth) {
                auth.signOut().then(() => {
                    alert('로그아웃 되었습니다.');
                    // 현재 페이지 새로고침
                    window.location.reload();
                }).catch((error) => {
                    console.error('로그아웃 오류:', error);
                });
            }
        });
    }

    // 즐겨찾기 버튼 (로그인 후에만 표시)
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            window.location.href = 'createroot.html';
        });
    }
}

// ============= Firebase 인증 상태 감지 =============
function initAuthStateListener() {
    if (auth) {
        auth.onAuthStateChanged((user) => {
            updateAuthUI(user);
        });
    }
}

// ============= 초기화 =============
document.addEventListener('DOMContentLoaded', () => {
    // Firebase 초기화
    const firebaseLoaded = initFirebase();
    
    // Header 생성
    if (document.getElementById('header')) {
        createHeader();
    }
    
    // Footer 생성
    if (document.getElementById('footer')) {
        createFooter();
    }
    
    // Header 버튼 이벤트 등록
    initHeaderEvents();
    
    // Firebase가 로드되었다면 인증 상태 리스너 시작
    if (firebaseLoaded) {
        initAuthStateListener();
    }
});