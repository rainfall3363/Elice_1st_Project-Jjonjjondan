import * as Api from '../api.js';

// elements
const nameInput = document.querySelector('#nameInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordCheckInput = document.querySelector('#passwordCheckInput');
const postalCodeInput = document.querySelector('#postalCode');
const address1Input = document.querySelector('#address1');
const address2Input = document.querySelector('#address2');
const searchAddressButton = document.querySelector('#searchAddressButton');
const submitButton = document.querySelector('#submitButton');
const cancelButton = document.querySelector('#cancelButton');
let role;

getUserInfo();
addAllevents();

function addAllevents() {
  passwordCheckInput.addEventListener('input', checkPassword);
  searchAddressButton.addEventListener('click', searchAddress);
  submitButton.addEventListener('click', updateUserInfo);
  cancelButton.addEventListener('click', handleCancel);
}

async function getUserInfo() {
  const user = await Api.get('/api/userInfo');
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

function checkPassword() {
  const passwordCorrect = document.querySelector('#passwordCorrect');
  const passwordNotCorrect = document.querySelector('#passwordNotCorrect');

  if (!passwordCheckInput.value) {
    passwordInput.classList.remove('is-danger');
    passwordInput.classList.remove('is-success');
    passwordCheckInput.classList.remove('is-danger');
    passwordCheckInput.classList.remove('is-success');
    passwordCorrect.classList.add('is-hidden');
    passwordNotCorrect.classList.add('is-hidden');
    submitButton.disabled = true;
  } else {
    if (passwordInput.value === passwordCheckInput.value) {
      passwordCorrect.classList.remove('is-hidden');
      passwordNotCorrect.classList.add('is-hidden');
      passwordInput.classList.remove('is-danger');
      passwordInput.classList.add('is-success');
      passwordCheckInput.classList.remove('is-danger');
      passwordCheckInput.classList.add('is-success');
      submitButton.disabled = false;
    } else {
      passwordNotCorrect.classList.remove('is-hidden');
      passwordCorrect.classList.add('is-hidden');
      passwordInput.classList.remove('is-success');
      passwordInput.classList.add('is-danger');
      passwordCheckInput.classList.remove('is-success');
      passwordCheckInput.classList.add('is-danger');
      submitButton.disabled = true;
    }
  }
}

// 이벤트에 사용할 함수
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
      } else {
      }

      postalCodeInput.value = data.zonecode;
      address1Input.value = `${addr} ${extraAddr}`;
      address2Input.value = '';
      address2Input.placeholder = '상세 주소 입력';
      address2Input.focus();
    },
  }).open();
}

async function updateUserInfo() {
  const userName = nameInput.value;
  const phoneNumber = phoneNumberInput.value;
  const password = passwordInput.value;
  // const passwordCheck = passwordCheckInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;

  if (!userName || !phoneNumber || !postalCode || !address2) {
    return alert('배송지 정보를 모두 입력해 주세요.');
  }

  // 비밀번호 입력 구현
  const currentPassword = 'test';

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
    const result = await Api.patch(`/api/users/update`, '', data);
    if (result) {
      alert('회원님의 정보가 정상적으로 수정되었습니다.');
      window.location.href = '/account';
    }
  } catch (err) {
    alert('회원정보가 수정되지 않았습니다. 다시 시도해주세요.');
    window.location.href = '/updateInfo';
  }
}

function handleCancel() {
  window.location.href = '/account';
}
