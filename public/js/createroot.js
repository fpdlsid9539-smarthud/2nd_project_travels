// Firebase 모듈 import
import { 
  addFavorite, 
  removeFavorite as removeFromFirebase,
  getFavorites 
} from "./firebase.js";


/***********************
 * 상태
 ***********************/
let map;
let basePlace = null;
let selectedPlaces = [];
let markers = [];
let polyline = null;
let deletedStack = [];
let favorites = []; // 즐겨찾기 데이터
// 드래그 상태
let draggedCard = null;
let draggedIndex = -1;

/***********************
 * 로그인 체크
 ***********************/
async function checkAuth() {
  return new Promise((resolve) => {
    // common.js의 Firebase auth 사용
    if (typeof firebase === 'undefined' || !firebase.auth) {
      console.error('Firebase 인증 초기화 실패');
      alert('로그인이 필요한 페이지입니다.');
      window.location.href = 'login.html';
      return;
    }

    const auth = firebase.auth();
    
    auth.onAuthStateChanged((user) => {
      if (!user) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
      } else {
        console.log('로그인된 사용자:', user.email);
        resolve(user);
      }
    });
  });
}

/***********************
 * Firebase에서 즐겨찾기 불러오기
 ***********************/
async function loadFavoritesFromFirebase() {
  try {
    const favData = await getFavorites();
    
    // Firebase 데이터를 createroot 형식으로 변환
    favorites = favData.map(item => ({
      id: item.id,
      name: item.title,
      lat: Number(item.mapy),
      lng: Number(item.mapx),
      image: item.firstimage || "https://placehold.co/400x260?text=No+Image"
    }));
    
    console.log('✅ 즐겨찾기 불러오기 성공:', favorites.length, '개');
  } catch (error) {
    console.error('즐겨찾기 불러오기 실패:', error);
    favorites = [];
  }
}

/***********************
 * 초기화
 ***********************/
async function initMap() {
  if (typeof kakao === 'undefined') {
    console.error('카카오 지도 API가 로드되지 않았습니다.');
    return;
  }

  // ✅ 1. 로그인 체크
  await checkAuth();
  
  // ✅ 2. Firebase에서 즐겨찾기 불러오기
  await loadFavoritesFromFirebase();

  map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(35.159, 129.16),
    level: 6
  });

  document.getElementById("undoBtn").onclick = handleUndo;
  createCards();
  updateRouteList();
}

/***********************
 * 카드 선택
 ***********************/
function selectPlace(place) {
  const idx = selectedPlaces.findIndex(p => p.id === place.id);

  if (idx !== -1) {
    selectedPlaces.splice(idx, 1);
    if (basePlace && basePlace.id === place.id) {
      basePlace = selectedPlaces[0] || null;
    }
  } else {
    selectedPlaces.push(place);

    if (!basePlace) {
      basePlace = place;
      const moveLatLng = new kakao.maps.LatLng(place.lat, place.lng);
      map.panTo(moveLatLng);
    }
  }
  
  createCards();
  redrawRoute();
}

/***********************
 * 카드 생성 (드래그 앤 드롭 추가, 지도 번호와 동일한 초록색 뱃지)
 ***********************/
function createCards() {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  // 거리순 정렬된 순서 가져오기
  const sortedRoute = getSortedRoute();

  // 선택되지 않은 카드들
  const unselected = favorites.filter(f => !selectedPlaces.find(s => s.id === f.id));

  // 선택된 카드(거리순) + 선택 안 된 카드
  const ordered = [...sortedRoute, ...unselected];

  ordered.forEach(p => {
    const idx = sortedRoute.findIndex(s => s.id === p.id);
    const selected = idx !== -1;

    const card = document.createElement("div");
    card.className = "card" + (selected ? " selected" : "");
    card.draggable = selected;

    // 지도와 동일한 초록색 번호 뱃지 추가
    card.innerHTML = `
      <div class="card-image">
        <img src="${p.image}" draggable="false">
        ${selected ? `<div class="number-marker">${idx + 1}</div>` : ""}
        <span class="star">★</span>
      </div>
      <div class="card-body">${p.name}</div>
    `;

    card.onclick = () => selectPlace(p);

    card.querySelector(".star").onclick = e => {
      e.stopPropagation();
      removeFavorite(p.id);
    };

    // 드래그 앤 드롭 (선택된 카드만)
    if (selected) {
      card.ondragstart = (e) => {
        draggedCard = p;
        draggedIndex = idx;
        card.style.opacity = '0.5';
      };

      card.ondragend = (e) => {
        card.style.opacity = '1';
      };

      card.ondragover = (e) => {
        e.preventDefault();
      };

      card.ondrop = (e) => {
        e.preventDefault();
        if (draggedCard && draggedCard.id !== p.id) {
          const toIdx = sortedRoute.findIndex(pl => pl.id === p.id);
          
          if (draggedIndex !== -1 && toIdx !== -1) {
            // selectedPlaces 배열에서 순서 변경
            const draggedOriginal = selectedPlaces.find(pl => pl.id === draggedCard.id);
            const targetOriginal = selectedPlaces.find(pl => pl.id === p.id);
            
            const fromOriginalIdx = selectedPlaces.indexOf(draggedOriginal);
            const toOriginalIdx = selectedPlaces.indexOf(targetOriginal);
            
            const [removed] = selectedPlaces.splice(fromOriginalIdx, 1);
            selectedPlaces.splice(toOriginalIdx, 0, removed);
            
            createCards();
            redrawRoute();
          }
        }
      };
    }

    container.appendChild(card);
  });
}

/***********************
 * 지도
 ***********************/
function clearMap() {
  markers.forEach(m => m.setMap(null));
  markers = [];
  if (polyline) polyline.setMap(null);
}

function redrawRoute() {
  clearMap();
  updateRouteList();
  if (!basePlace) return;

  const route = getSortedRoute();
  const path = [];

  route.forEach((p, i) => {
    const pos = new kakao.maps.LatLng(p.lat, p.lng);
    const overlay = new kakao.maps.CustomOverlay({
      position: pos,
      content: `<div class="number-marker">${i + 1}</div>`,
      yAnchor: 1
    });
    overlay.setMap(map);
    markers.push(overlay);
    path.push(pos);
  });

  if (path.length > 1) {
    polyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 4,
      strokeColor: "#962525"
    });
    polyline.setMap(map);
  }
}

/***********************
 * 거리 정렬
 ***********************/
function getDistance(a, b, c, d) {
  const R = 6371;
  const dLat = (c - a) * Math.PI / 180;
  const dLng = (d - b) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(a * Math.PI / 180) *
    Math.cos(c * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function getSortedRoute() {
  if (!basePlace) return [];

  const stillSelected = selectedPlaces.find(p => p.id === basePlace.id);
  if (!stillSelected) return [];

  const others = selectedPlaces.filter(p => p.id !== basePlace.id);
  others.sort((a, b) =>
    getDistance(basePlace.lat, basePlace.lng, a.lat, a.lng) -
    getDistance(basePlace.lat, basePlace.lng, b.lat, b.lng)
  );

  return [basePlace, ...others];
}

/***********************
 * 리스트
 ***********************/
function updateRouteList() {
  const ul = document.getElementById("routeList");
  ul.innerHTML = "";

  if (!basePlace) {
    ul.innerHTML = "<li class='empty'>카드를 선택하세요</li>";
    return;
  }

  getSortedRoute().forEach((p, i) => {
    const li = document.createElement("li");

    const star = document.createElement("span");
    star.className = "route-star";
    star.textContent = "★";

    star.onclick = e => {
      e.stopPropagation();
      removeFavorite(p.id);
    };

    const text = document.createElement("span");
    text.textContent = ` ${i + 1}. ${p.name}`;

    li.appendChild(star);
    li.appendChild(text);
    ul.appendChild(li);
  });
}

/***********************
 * 즐겨찾기 삭제 / 되돌리기
 ***********************/
async function removeFavorite(id) {
  const item = favorites.find(p => p.id === id);
  if (!item) return;

  deletedStack.push(item);

  // ✅ 이제 firebase의 함수를 올바르게 호출
  const success = await removeFromFirebase(String(id));
  if (!success) {
    alert('즐겨찾기 삭제에 실패했습니다.');
    return;
  }

  favorites = favorites.filter(p => p.id !== id);
  selectedPlaces = selectedPlaces.filter(p => p.id !== id);

  if (basePlace && basePlace.id === id) {
    basePlace = selectedPlaces.length > 0 ? selectedPlaces[0] : null;
  }

  document.getElementById("undoBtn").disabled = false;
  createCards();
  redrawRoute();
}

function handleUndo() {
  if (!deletedStack.length) return;
  favorites.push(deletedStack.pop());
  if (!deletedStack.length) {
    document.getElementById("undoBtn").disabled = true;
  }
  createCards();
}

/***********************
 * SDK 로드 - 수정됨
 ***********************/
// 페이지 로드 완료 후 실행
window.addEventListener('load', function() {
  // kakao 객체가 있는지 확인
  if (typeof kakao !== 'undefined' && kakao.maps) {
    // autoload=false인 경우
    kakao.maps.load(function() {
      initMap();
    });
  } else {
    // 스크립트 로드 대기
    let checkCount = 0;
    const checkInterval = setInterval(function() {
      checkCount++;
      if (typeof kakao !== 'undefined' && kakao.maps) {
        clearInterval(checkInterval);
        kakao.maps.load(function() {
          initMap();
        });
      } else if (checkCount > 50) {
        // 5초 대기 후에도 로드 안되면 에러
        clearInterval(checkInterval);
        console.error('카카오 지도 API를 로드할 수 없습니다.');
        alert('카카오 지도 API 로드 실패. API 키를 확인해주세요.');
      }
    }, 100);
  }
});