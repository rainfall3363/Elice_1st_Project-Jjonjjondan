import * as Api from '../api.js';
import { validateEmail } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const fullNameInput = document.querySelector('#fullNameInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const submitButton = document.querySelector('#submitButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  phoneNumberInput.addEventListener('input', maxLengthCheck);
}

function maxLengthCheck(event) {
  if (event.target.value.length > event.target.maxLength) {
    event.target.value = event.target.value.slice(0, event.target.maxLength);
  }
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const phoneNumber = String(phoneNumberInput.value);

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isPhoneNumberValid = phoneNumber.length !== 0;

  if (!isEmailValid) {
    return alert('이메일 형식이 맞지 않습니다.');
  }

  if (!isPasswordValid) {
    return alert('비밀번호를 4글자 이상 입력해 주세요.');
  }

  if (!isPasswordSame) {
    return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
  }

  if (!isFullNameValid || !isPasswordValid) {
    return alert('이름은 2글자 이상이어야 합니다.');
  }

  if (!isPhoneNumberValid) {
    return alert('전화번호을 입력해 주세요.');
  }

  // 회원가입 api 요청
  try {
    const data = { fullName, email, password, phoneNumber };

    await Api.post('/api/user/register', data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = '/login';
  } catch (err) {
    console.error(err.stack);
    alert(err.message);
  }
}
