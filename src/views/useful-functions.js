// 문자열+숫자로 이루어진 랜덤 5글자 반환
export const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

// 이메일 형식인지 확인 (true 혹은 false 반환)
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
export const convertToNumber = (string) => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

// ms만큼 기다리게 함.
export const wait = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

//로그인 시 로그인 글씨 로그아웃으로 변경
//세션 스토리지 내 토큰 활용
export const loginUser = () => {
  const data = sessionStorage.getItem('token');
  const login = document.getElementById('loginId');
  if (data) {
    login.innerText = '로그아웃';
  }
};

//로그아웃 클릭 시 로그인으로 변경
export const logoutUser = () => {
  const data = sessionStorage.getItem('token');
  const login = document.getElementById('loginId');
  if (data) {
    login.addEventListener('click', (logout) => {
      logout.preventDefault();
      login.innerText = '로그인';
      sessionStorage.clear();
      location.href = '/';
    });
  }
};

//로그인 시 회원가입 텍스트 계정관리로 변경
export const setRegister = () => {
  const data = sessionStorage.getItem('token');
  const register = document.getElementById('registerId');
  if (data) {
    register.innerText = '마이페이지';
    register.href = '/account'; //임시 테스트 이동경로, 계정관리 페이지 구현 시 수정
  }
};

//LocalStorage에서 key에 해당하는 객체 반환. key가 없을 경우 list로 초기화 후 반환
export const getLocalStorageList = (key) => {
  const valueList = window.localStorage.getItem(key);
  if (valueList === null) {
    window.localStorage.setItem(key, JSON.stringify([]));
    return JSON.parse(window.localStorage.getItem(key));
  } else {
    return JSON.parse(window.localStorage.getItem(key));
  }
};

//localStorage에서 key에 해당하는 list 객체에 value를 push
export const addLocalStorageList = (key, value) => {
  const valueList = getLocalStorageList(key);
  valueList.push(value);
  window.localStorage.setItem(key, JSON.stringify(valueList));
  return JSON.parse(window.localStorage.getItem(key));
};

//localStorage에서 해당 key의 value인 리스트 내 해당 id가 있는 요소 삭제
export const deleteLocalStorageListById = (key, id) => {
  const storageList = getLocalStorageList(key);
  const remainStorageList = storageList.filter((e) => e.id !== id);
  window.localStorage.setItem(key, JSON.stringify(remainStorageList));
  return getLocalStorageList(key);
};

//localStorage에서 해당 key의 값이 value인 요소 삭제
export const deleteLocalStorageList = (key, value) => {
  const storageList = getLocalStorageList(key);
  const remainStorageList = storageList.filter((e) => e !== value);
  window.localStorage.setItem(key, JSON.stringify(remainStorageList));
  return getLocalStorageList(key);
};

export const calculateTotalPrice = (price) => {
  const DELIVERY_FEE = 3000;
  return addCommas(Number(price) + DELIVERY_FEE);
};
