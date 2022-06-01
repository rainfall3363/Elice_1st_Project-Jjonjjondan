import * as Api from '/api.js';

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
export const setRegister = async () => {
  const register = document.getElementById('registerId');
  const userInfo = await Api.get('/api/userInfo');
  const role = userInfo.role;
  if (role === 'basic-user') {
    register.innerText = '';
    register.insertAdjacentHTML(
      'beforeend',
      `
    <li>
    <a href="/account" aria-current="page">
      <span class="icon">
      <i class="fas fa-user"></i>
      </span>
      <span>계정관리</span>
    </a>
  </li>
  `
    );
  }
};

//로그인 시 관리자면 회원가입 텍스트 페이지 관리로 변경
export const changetoAdmin = async () => {
  const register = document.getElementById('registerId');
  const userInfo = await Api.get('/api/userInfo');
  const role = userInfo.role;
  if (role === 'admin') {
    register.innerText = '';
    register.insertAdjacentHTML(
      'beforeend',
      `
    <li>
    <a href="/admin" aria-current="page">
      <span class="icon">
        <i class="fas fa-cog"></i>
      </span>
      <span>페이지 관리</span>
    </a>
  </li>
  `
    );
    register.href = '/admin';
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

//localStorage에서 id에 해당하는 object를 반환합니다.
export const getLocalStorageListById = (key, id) => {
  const valueList = getLocalStorageList(key);
  const StorageList = valueList.filter((e) => e.id === id);

  if (StorageList === null) {
    StorageList.push({ id: id });
    window.localStorage.setItem(key, JSON.stringify(StorageList));
    return JSON.parse(window.localStorage.getItem(key));
  } else {
    return StorageList[0];
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

//localStorage에서 id에 해당하는 object quantity key의 value를 수정
export const editQuantityLocalStorageListById = (key, id, value) => {
  const storageList = getLocalStorageList(key);
  storageList.forEach((e) => {
    if (e.id === id) {
      e.quantity = value;
    }
  });
  window.localStorage.setItem(key, JSON.stringify(storageList));
  return getLocalStorageList(key);
};

//productDetail에서 장바구니 추가시 localStorage 기능
export const inputCart = (productDetailData) => {
  productDetailData.quantity = 1;
  const cartList = getLocalStorageList('cart');
  //cart localStorage에 productId가 없다면 0 있다면 해당 productId가 있는 element 개수를 반환
  const isId = cartList.filter(
    (cartElement) => cartElement.id == productId
  ).length;

  //만약 해당 제품 id가 cart localStorage에 없다면 상품 상세 정보를 cart에 추가
  if (!isId) {
    addLocalStorageList('cart', productDetailData);
  } else {
    //만약 해당 제품 id가 cart localStorage에 있다면 수량 증분만 진행
    let quantityValue = parseInt(
      getLocalStorageListById('cart', productId).quantity
    );
    quantityValue++;
    //최대 수량이 99이므로 99이상인 경우 처리
    if (quantityValue >= 99) {
      editQuantityLocalStorageListById('cart', productId, 99);
    } else {
      editQuantityLocalStorageListById('cart', productId, quantityValue);
    }
  }
  alert('장바구니에 추가되었습니다.');
  return getLocalStorageList('cart');
};

export const calculateTotalPrice = (price) => {
  const DELIVERY_FEE = 3000;
  return addCommas(Number(price) + DELIVERY_FEE);
};
