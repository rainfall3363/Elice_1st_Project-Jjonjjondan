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
      location.reload();
    });
  }
};
