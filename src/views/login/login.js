import * as Api from '../api.js';
import { validateEmail } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const loginButton = document.querySelector('#loginButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  loginButton.addEventListener('click', handleSubmit);
}

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert(
      '비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.'
    );
  }

  try {
    const data = { email, password };

    const result = await Api.post('/api/login', data);
    const token = result.token;

    sessionStorage.setItem('token', token);

    alert(`정상적으로 로그인되었습니다.`);

    // 로그인 성공

    window.location.href = '/';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다: ${err.message}`);
  }
}
