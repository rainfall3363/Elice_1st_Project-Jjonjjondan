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

export const loginLogout = () => {
  // 세션스토리지에 로그인 정보를 확인해서, 로그인 돼 있는 사람이면 로그인 - 로그아웃
  // 상태가 로그아웃이라면 클릭 시 로그아웃 되고 , 로그인으로 변경
  const data = sessionStorage.getItem('token');
  const login = document.getElementById('login_id');
  if (data) {
    login.innerText = '로그아웃';
  }
  if (login.innerText === '로그아웃') {
    login.addEventListener('click', (logout) => {
      logout.preventDefault();
      login.innerText = '로그인';
      sessionStorage.clear();
      location.reload();
    });
  }
};
