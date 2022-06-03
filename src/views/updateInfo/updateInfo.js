import * as Api from '../../api.js';

// elements
const nameInput = document.querySelector('#nameInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordCheckInput = document.querySelector('#passwordCheckInput');
const postalCodeInput = document.querySelector('#postalCode');
const address1Input = document.querySelector('#address1');
const address2Input = document.querySelector('#address2');
const searchAddressButton = document.querySelector('#searchAddressButton');
const submitButton1 = document.querySelector('#submitButton1');
const cancelButton1 = document.querySelector('#cancelButton1');
const modal = document.querySelector('#modal');
const submitButton2 = document.querySelector('#submitButton2');
const cancelButton2 = document.querySelector('#cancelButton2');
const currentPasswordInput = document.querySelector('#currentPasswordInput');
let role;

getUserInfo();
addAllevents();

function addAllevents() {
  phoneNumberInput.addEventListener('input', maxLengthCheck);
  passwordInput.addEventListener('input', checkPasswordInput);
  passwordCheckInput.addEventListener('input', checkPasswordCorrect);
  searchAddressButton.addEventListener('click', searchAddress);
  submitButton1.addEventListener('click', checkCurrentPassword);
  cancelButton1.addEventListener('click', handleCancel);
}

async function getUserInfo() {
  const user = await Api.get('/api/user/info');
  role = user.role;
  renderUserInfo(user);
}

function renderUserInfo(user) {
  const userAddress = user.address;
  nameInput.value = user.fullName;
  phoneNumberInput.value = user.phoneNumber;

  if (userAddress) {
    postalCodeInput.value = userAddress.postalCode;
    address1Input.value = userAddress.address1;
    address2Input.value = userAddress.address2;
  }
}

function maxLengthCheck(event) {
  if (event.target.value.length > event.target.maxLength) {
    event.target.value = event.target.value.slice(0, event.target.maxLength);
  }
}

function checkPasswordInput() {
  const passwordCorrect = document.querySelector('#passwordCorrect');
  const passwordNotCorrect = document.querySelector('#passwordNotCorrect');

  if (passwordInput.value === '') {
    passwordCorrect.classList.add('is-hidden');
    passwordNotCorrect.classList.add('is-hidden');
    passwordInput.classList.remove('is-danger');
    passwordInput.classList.remove('is-success');
    passwordCheckInput.classList.remove('is-danger');
    passwordCheckInput.classList.remove('is-success');
    passwordCheckInput.value = '';
    submitButton1.disabled = false;
  } else {
    if (passwordInput.value === passwordCheckInput.value) {
      allCorrect();
    } else {
      notCorrect();
    }
  }
}

// 비밀번호 변경 시 변경 비밀번호와 비밀번호 확인이 일치하는 지 확인하는 함수
function checkPasswordCorrect() {
  const passwordCorrect = document.querySelector('#passwordCorrect');
  const passwordNotCorrect = document.querySelector('#passwordNotCorrect');

  if (passwordCheckInput.value === '' && passwordInput.value === '') {
    passwordInput.classList.remove('is-danger');
    passwordInput.classList.remove('is-success');
    passwordCheckInput.classList.remove('is-danger');
    passwordCheckInput.classList.remove('is-success');
    passwordCorrect.classList.add('is-hidden');
    passwordNotCorrect.classList.add('is-hidden');
    submitButton1.disabled = false;
  } else {
    if (passwordInput.value === passwordCheckInput.value) {
      allCorrect();
    } else {
      notCorrect();
    }
  }
}

function allCorrect() {
  const passwordCorrect = document.querySelector('#passwordCorrect');
  const passwordNotCorrect = document.querySelector('#passwordNotCorrect');

  passwordCorrect.classList.remove('is-hidden');
  passwordNotCorrect.classList.add('is-hidden');
  passwordInput.classList.remove('is-danger');
  passwordInput.classList.add('is-success');
  passwordCheckInput.classList.remove('is-danger');
  passwordCheckInput.classList.add('is-success');
  submitButton1.disabled = false;
}

function notCorrect() {
  const passwordCorrect = document.querySelector('#passwordCorrect');
  const passwordNotCorrect = document.querySelector('#passwordNotCorrect');

  passwordNotCorrect.classList.remove('is-hidden');
  passwordCorrect.classList.add('is-hidden');
  passwordInput.classList.remove('is-success');
  passwordInput.classList.add('is-danger');
  passwordCheckInput.classList.remove('is-success');
  passwordCheckInput.classList.add('is-danger');
  submitButton1.disabled = true;
}

// 주소검색 API 사용 함수
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr +=
            extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      }

      postalCodeInput.value = data.zonecode;
      address1Input.value = `${addr} ${extraAddr}`;
      address2Input.value = '';
      address2Input.placeholder = '상세 주소 입력';
      address2Input.focus();
    },
  }).open();
}

// 현재 비밀번호 입력을 받는 모달 창 출력을 위한 함수
function checkCurrentPassword() {
  if (!checkIntegrity()) {
    return;
  }
  modal.classList.add('is-active');
  submitButton2.addEventListener('click', updateUserInfo);
  cancelButton2.addEventListener('click', modalDeactivate);
}

function checkIntegrity() {
  if (nameInput.value.length < 2) {
    alert('이름은 반드시 2글자 이상이어야 합니다.');
    return false;
  } else if (passwordInput.value.length < 4) {
    alert('비밀번호는 반드시 4글자 이상이어야 합니다.');
    return false;
  }

  return true;
}

// 모달 창을 없애는 이벤트 처리 함수
function modalDeactivate() {
  modal.classList.remove('is-active');
  currentPasswordInput.value = '';
}

// 입력받은 정보를 바탕으로 DB에 patch요청을 보내는 이벤트 처리 함수
async function updateUserInfo() {
  const userName = nameInput.value;
  const phoneNumber = phoneNumberInput.value;
  const password = passwordInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const currentPassword = currentPasswordInput.value;

  const address = {
    postalCode,
    address1,
    address2,
  };

  const data = {
    fullName: userName,
    password,
    address,
    phoneNumber,
    role,
    currentPassword,
  };

  try {
    const result = await Api.patch(`/api/user/update`, '', data);
    if (result) {
      alert('회원님의 정보가 정상적으로 수정되었습니다.');
      window.location.href = '/account';
    }
  } catch (err) {
    alert(err.message);
  }
}

function handleCancel() {
  const confirmFlag = confirm(
    '작성하신 정보가 전부 삭제됩니다. 나가시려면 확인을 눌러주세요.'
  );
  if (confirmFlag) {
    window.location.href = '/account';
  }
}
