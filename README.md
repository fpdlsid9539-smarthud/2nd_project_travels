# ✈️ 랜덤 여행 추천 사이트 프로젝트

<br>

## 사이트 실행 방법

- Terminal에 희망하는 경로를 설정후, git clone https://github.com/fpdlsid9539-smarthud/2nd_project_travel.git 을 입력하여 파일을 받습니다.
- .env.example 파일의 이름을 .env로 변경해줍니다.
- https://developers.kakao.com/docs/latest/ko/tutorial/start 카카오 로컬 API사이트에 접속하여 javascript key를 받습니다.
- 카카오 로컬 API 도메인 등록란에는 http://localhost:3000 혹은 http://127.0.0.1:3000 추가로 등록해야합니다.
- https://www.data.go.kr/data/15101578/openapi.do 공공데이터포털에 접속해 일반 인증키를 받습니다.
- .env파일에 각 api키를 입력해줍니다.
- server.js와 같은 경로상의 Terminal에 npm i 를 입력하여 node_modules를 설치합니다.
- node server.js를 입력하여 실행합니다.


## 프로젝트 소개

- 이번 프로젝트는 여행을 테마로 사이트를 제작하였습니다.
- MZ / Z세대에서 유행하는 즉흥적인 여행에서 영감을 얻었습니다.
- 여행을 기획하는 단계에서 오는 피로감을 감소시킬 수 있습니다.
- 한번에 여러 목적지를 선택할 수 있고, 즐겨찾기 기능을 통하여 목적지간 최단 직선 거리를 검색할 수 있습니다.

<br>

## 팀원 구성

<div align="center">

| **장윤정** | **김상훈** | **김형민** | **채유진** |
| :------: |  :------: | :------: | :------: |

</div>

<br>

## 역할 분담

### 🍊장윤정

- PM(프로젝트 관리) 및 프론트엔드 총괄

<br>
    
### 👻김상훈

- Tour API를 활용하여 페이지 제작, 각 페이지별 공통 css/js 제작

<br>

### 😎김형민

- FireBase DB연동 / 카카오 로컬 API를 활용하여 페이지 제작.

<br>

### 🐬채유진

- FireBase DB기반 로그인기능 / 카카오 로컬 API를 활용한 즐겨찾기 기능 연동 및 페이지 제작

<br>

## 개발 환경

- Front : HTML, CSS, JAVASCRIPT
- 개발 환경 : Visual Studio Code, Figma
- Back-end : FIRE-BASE
- 사용 API : 카카오 로컬 API, 한국관광포털 Tour-API
- 버전 및 이슈관리 : Github
- 협업 툴 : Discord

<br>

## 프로젝트 구조

```
├── README.md
├── server.js
├── .gitignore
├── .env.example
├── node_modules
├── package-lock.json
├── package.json
│
├── public
     ├── body틀.html
     ├── createroot.html
     ├── loading.html
     ├── login.html
     ├── render-places.html
     ├── result.html
     ├── test.html
     ├── index.html
     ├── js
     │   ├── common.js
     │   ├── createroot.js
     │   ├── firebase.js
     │   ├── index.js
     │   ├── loading.js
     │   ├── login.js
     │   ├── random-menu-picker.js
     │   ├── render-places.js
     │   ├── result.js
     │   └── test.js
     │          
     ├── IMG
     │   ├── add-user.png
     │   ├── arrow-left.png
     │   ├── arrow-right.png
     │   ├── bookmark.png
     │   ├── busan_main.jpg
     │   ├── close.png
     │   ├── close2.png
     │   ├── Earth Roulette.jpg
     │   ├── global-223_256.gif
     │   ├── login.png
     │   ├── logout.png
     │   ├── mainImg.jpg
     │   ├── no-image.png
     │   ├── rogo.png
     │   ├── wishlist.png
     │   └── wishlist2.png
     └── css
         ├── createroot.css
         ├── index.css
         ├── loading.css
         ├── login.css
         ├── main.css
         ├── pubHF.css
         ├── public.css
         ├── render-places.css
         ├── result.css
         └── test.css

```

<br>


## 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간 : 2026-01-19 ~ 2026-01-26
- UI 구현 : 2026-01-19 ~ 2026-01-26
- 기능 구현 : 2026-01-19 ~ 2026-01-26

<br>

### 작업 관리

- GitHub Projects와 Issues를 사용하여 진행 상황을 공유했습니다.
- 매일 오전회의를 진행하며 개인 작업 상태와 방향을 확인하여, 개발 방향을 정하였습니다.

<br>


## 프로젝트 후기

### 🍊 장윤정

이번 두번째 프로젝트에서 조장을 맡아 팀원들과 프레임구성단계부터 의도한  페이지가 나와 좋았습니다. 하지만, 이번프로젝트에서 총괄을 맡으면서 각 페이지를 취합하고 의견을 정리하는 과정이 힘들다는 것을 느꼈습니다.

<br>

### 👻 김상훈

AI를 처음 이용해봤는데, 복잡한 기능을 AI가 쉽게 구현하는 것을 보고 놀랐습니다. 결과물을 확인하니, 생각보다 아는 내용이 많아, 결국 배운내용의 복습(반복)이라는 것을 알았습니다. 하지만, 이번프로젝트에서 로그인 하지 않아도 로그아웃을 하지 않은 상태에서 서버에 재접속을 하면 로그인한 상태가 유지된다는 점과, 같이 사용할 css와 js를 초반에 정하고 가지않아, 페이지 취합 후 수정하기 어려웠습니다.

<br>

### 😎 김형민

정적 웹 페이지 제작때보다 사용해야 할 기술들도 많아지고, 외부 데이터까지 가져와서 응용해야하니 힘들었습니다. 랜덤 추천이 단순조건 기반으로 이루어져, 사용자상황(날씨, 시간, 동행인 등)을 반영하지 못한 점이 아쉬웠습니다.

<br>

### 🐬 채유진

외관으로 봐선 어떤 행동을 해야 자연스러운지 생각이 되야되는데, 직접 기술쪽으로 응용을 하려니 복잡해지고 이해도가 높지 않으면 연결이 쉽지 않다는것을 꺠달았습니다. 이번 프로젝트에서 로딩창을 선택창과 동일한 크기로 하면 더 자연스럽지 않았을까 생각하게 되었습니다. 또, 예산이나 거리(날짜)를 조건에 집어넣을 수 있었으면 좋았을거 같습니다.
