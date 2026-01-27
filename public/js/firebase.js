// Firebase SDK 불러오기 (CDN 방식)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth // ✅ 추가
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//상훈 firebase
const firebaseConfig = {
  apiKey: "AIzaSyDY0t_RalBk-y_bbHLyz5HAUXAmOKjql-Y",
  authDomain: "smart-2nd-project.firebaseapp.com",
  databaseURL: "https://smart-2nd-project-default-rtdb.firebaseio.com",
  projectId: "smart-2nd-project",
  storageBucket: "smart-2nd-project.firebasestorage.app",
  messagingSenderId: "1077633477341",
  appId: "1:1077633477341:web:cbb3f327a4a4b593b54934",
  measurementId: "G-SR2L6SKVTS"
};

// 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // ✅ 추가

// 즐겨찾기 컬렉션 이름
const FAV_COLLECTION = "favorites"; 

/**
 * 1. 즐겨찾기 추가 (저장)
 */
export async function addFavorite(place) {
  try {
    const user = auth.currentUser; // ✅ 수정
    if (!user) return false;
    
    const userId = user.uid;
    const docRef = doc(db, FAV_COLLECTION, userId, "items", String(place.id));
    
    await setDoc(docRef, {
      id: String(place.id),
      title: place.title,
      addr1: place.raw?.addr1 || "",
      mapx: place.lng,
      mapy: place.lat,
      firstimage: place.image,
      source: "FAV",
      createdAt: new Date().toISOString()
    });
    console.log("즐겨찾기 저장 성공:", place.title);
    return true;
  } catch (e) {
    console.error("즐겨찾기 저장 실패:", e);
    return false;
  }
}

/**
 * 2. 즐겨찾기 삭제
 */
export async function removeFavorite(placeId) {
  try {
    const user = auth.currentUser; // ✅ 수정
    if (!user) return false;
    
    const userId = user.uid;
    const docRef = doc(db, FAV_COLLECTION, userId, "items", String(placeId));
    
    await deleteDoc(docRef);
    console.log("즐겨찾기 삭제 성공:", placeId);
    return true;
  } catch (e) {
    console.error("즐겨찾기 삭제 실패:", e);
    return false;
  }
}

/**
 * 3. 즐겨찾기 목록 전체 가져오기
 */
export async function getFavorites() {
  try {
    const user = auth.currentUser; // ✅ 수정
    if (!user) return [];
    
    const userId = user.uid;
    const querySnapshot = await getDocs(collection(db, FAV_COLLECTION, userId, "items"));
    
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    return list;
  } catch (e) {
    console.error("목록 가져오기 실패:", e);
    return [];
  }
}

/**
 * 4. 이미 즐겨찾기 된 항목인지 확인 (ID로 체크)
 */
export async function checkIsFavorite(placeId) {
  try {
    const user = auth.currentUser; // ✅ 수정
    if (!user) return false;
    
    const userId = user.uid;
    const docRef = doc(db, FAV_COLLECTION, userId, "items", String(placeId));
    
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (e) {
    return false;
  }
}

export const RTDB_BASE = firebaseConfig.databaseURL.replace(/\/$/, "");