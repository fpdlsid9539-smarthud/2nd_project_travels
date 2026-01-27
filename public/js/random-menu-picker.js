// random-menu-picker.js
// 모달 안에 "🎲 랜덤 메뉴 고르기" UI를 주입하고,
// 인원수만큼 menu에서 랜덤으로 뽑아 결과 표시 + localStorage 저장

const DEFAULTS = {
  sectionId: "randomMenuSection",
  btnId: "randomMenuBtn",
  formId: "randomMenuForm",
  inputId: "randomMenuPeople",
  pickBtnId: "randomMenuPickBtn",
  resultId: "randomMenuResult",
  storageKey: "randomMenuHistory",
  modalBodySelector: ".modal-body",
};

let state = {
  place: null,
  menu: [],
  tabKey: null,
};

let onceBound = false;

function ensureStyle() {
  if (document.getElementById("randomMenuStyle")) return;

  const style = document.createElement("style");
  style.id = "randomMenuStyle";
  style.textContent = `
    #${DEFAULTS.sectionId}{
      margin-top:12px;
      padding:12px;
      border:1px solid rgba(255,255,255,.12);
      border-radius:10px;
      background:rgba(0,0,0,.25);
      display: flex; /* 가로 배치를 위한 설정 */
      align-items: center;
      gap: 12px;
      flex-wrap: nowrap;
    }
    
      #${DEFAULTS.btnId}:hover, #${DEFAULTS.pickBtnId}:hover {
      transform: translateY(-1px);
      opacity: 0.9;
    }
 #${DEFAULTS.btnId}, #${DEFAULTS.pickBtnId} {
      padding: 10px 16px;
      border-radius: 10px;
      border: 0;
      cursor: pointer;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      white-space: nowrap;
    }
  
    
    
    #${DEFAULTS.formId}{
      display: none; /* 초기에는 숨김 (클릭 시 나타남) */
      align-items: center;
      gap: 8px;
      
    }
    #${DEFAULTS.inputId}{
      width: 80px; /* 입력창 크기 고정 */
      padding: 8px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,.2);
      background: rgba(0,0,0,.3);
      color: #fff;
      text-align: center;
    }
    #${DEFAULTS.resultId} {
      width: 100%;          /* 결과는 아래로 떨어지게 설정 */
      margin-top: 10px;
      color: #fff;
      font-size: 14px;
    }
    #${DEFAULTS.resultId} ul{
      margin:8px 0 0;
      gap: 15px;
      padding-left:18px;
      list-style: none;
    }
    #${DEFAULTS.resultId} .hint{
      opacity:.8;
      font-size:12px;
      margin-top:6px;
    }
  `;
  document.head.appendChild(style);
}

function ensureSection(modalBodySelector) {
  ensureStyle();

  const modalBody = document.querySelector(modalBodySelector);
  if (!modalBody) return null;

  let section = document.getElementById(DEFAULTS.sectionId);
  if (!section) {
    section = document.createElement("div");
    section.id = DEFAULTS.sectionId;

    section.innerHTML = `
      <button id="${DEFAULTS.btnId}" type="button">🎲 랜덤 메뉴 고르기</button>

      <div id="${DEFAULTS.formId}">
        <input
          id="${DEFAULTS.inputId}"
          type="number"
          min="1"
          inputmode="numeric"
          placeholder="인원수(예: 2)"
        />
        <button id="${DEFAULTS.pickBtnId}" type="button">메뉴 뽑기</button>
      </div>

      <div id="${DEFAULTS.resultId}"></div>
    `;

    // 모달 안에서 어디에 넣을지: 맨 아래에 붙임 (원하면 위치만 바꾸면 됨)
    modalBody.appendChild(section);
  }

  return section;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickMenus(menu, count) {
  if (!Array.isArray(menu) || menu.length === 0) return [];

  // 원칙: 가능한 한 "중복 없이" 뽑고, 인원수가 메뉴보다 크면 중복 허용으로 채움
  const unique = shuffle(menu);
  if (count <= unique.length) return unique.slice(0, count);

  const result = [...unique];
  while (result.length < count) {
    result.push(menu[Math.floor(Math.random() * menu.length)]);
  }
  return result;
}

function saveHistory(record, storageKey) {
  try {
    const prev = JSON.parse(localStorage.getItem(storageKey) || "[]");
    prev.unshift(record);
    // 최근 30개만 유지
    localStorage.setItem(storageKey, JSON.stringify(prev.slice(0, 30)));
  } catch (e) {
    console.warn("randomMenuHistory 저장 실패:", e);
  }
}

function renderResult({ place, picked, people }, storageKey) {
  const resultEl = document.getElementById(DEFAULTS.resultId);
  if (!resultEl) return;

  if (!picked || picked.length === 0) {
    resultEl.innerHTML = `<div>뽑을 메뉴가 없습니다.</div>`;
    return;
  }

  const list = picked.map((m, i) => `<li>${i + 1}. ${escapeHtml(m)}</li>`).join("");
  resultEl.innerHTML = `
    <div><b>${escapeHtml(place?.title || "가게")}</b> - ${people}명 메뉴 추천</div>
    <ul>${list}</ul>
    
  `;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindOnce(storageKey) {
  if (onceBound) return;
  onceBound = true;

  document.addEventListener("click", (e) => {
    const btn = e.target?.closest?.(`#${DEFAULTS.btnId}`);
    const pickBtn = e.target?.closest?.(`#${DEFAULTS.pickBtnId}`);

    if (btn) {
      const form = document.getElementById(DEFAULTS.formId);
      const input = document.getElementById(DEFAULTS.inputId);

      if (form) form.style.display = (form.style.display === "none" ? "flex" : "none");
      if (input) {
        input.value = "";
        input.focus();
        // 메뉴 길이에 맞춰 max 설정
        if (Array.isArray(state.menu) && state.menu.length > 0) {
          input.max = String(Math.max(1, state.menu.length * 10)); // 너무 빡빡하지 않게
        }
      }
      return;
    }

    if (pickBtn) {
      const input = document.getElementById(DEFAULTS.inputId);
      const people = Number(input?.value);

      if (!Number.isFinite(people) || people <= 0) {
        alert("인원수를 1 이상으로 입력해주세요.");
        return;
      }
      if (!state.place || !Array.isArray(state.menu) || state.menu.length === 0) {
        alert("이 식당에는 메뉴 데이터가 없습니다.");
        return;
      }

      const picked = pickMenus(state.menu, people);

      const record = {
        at: new Date().toISOString(),
        placeId: String(state.place.id ?? ""),
        title: state.place.title ?? "",
        tabKey: state.tabKey ?? "",
        people,
        picked,
      };

      saveHistory(record, storageKey);
      renderResult({ place: state.place, picked, people }, storageKey);
      return;
    }
  });
}

/**
 * 모달이 열릴 때마다 호출:
 * - 맛집/RTDB + menu 있으면 섹션 표시
 * - 아니면 섹션 숨김
 */
export function renderRandomMenuPickerForPlace(place, opts = {}) {
  const options = { ...DEFAULTS, ...opts };
  const section = ensureSection(options.modalBodySelector);
  if (!section) return;

  bindOnce(options.storageKey);

  // 초기화(숨김)
  const form = document.getElementById(DEFAULTS.formId);
  const resultEl = document.getElementById(DEFAULTS.resultId);
  const btn = document.getElementById(DEFAULTS.btnId);

  if (form) form.style.display = "none";
  if (resultEl) resultEl.innerHTML = "";
  if (btn) btn.textContent = `🎲 랜덤 메뉴 고르기`;

  // place가 없으면 무조건 숨김
  if (!place) {
    section.style.display = "none";
   // state = { place: null, menu: [], tabKey: null };
    return;
  }
const tabKey = opts.tabKey ?? null;
  const isFood = tabKey === "food" || place?.raw?.category === "food";
  const menu = place?.raw?.menu;
  const hasMenu = Array.isArray(menu) && menu.length > 0;

  if (!isFood || !hasMenu) {
    section.style.display = "none";
    state = { place: null, menu: [], tabKey };
    return;
  }

  // 이 부분이 block이면 가로 정렬(flex)이 깨집니다. 
  // ensureStyle에서 이미 flex를 줬으므로 여기서는 flex로 보여줘야 합니다.
  section.style.display = "flex"; 
  state = { place, menu, tabKey };
  
}
