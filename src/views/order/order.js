import * as Api from '/api.js';
import {
  updateOrderSummary,
  loginUser,
  logoutUser,
  getLocalStorageKeyObj,
} from '/useful-functions.js';

init();

async function init() {
  loginUser();
  logoutUser();
  const userInfo = await renderUserInfo();
  renderDeliveryInfo(userInfo);
  searchAddressEvent();
  const localStorageKeyObj = getLocalStorageKeyObj();
  updateOrderSummary(localStorageKeyObj);
  postOrderInfo();
  // deleteBuyNowStorage();
}

async function renderUserInfo() {
  try {
    const result = await Api.get('/api/user/info');
    return result;
  } catch {
    alert('로그인 하세요.');
    window.location.href = '/login/';
    // document.referrer
  }
}

function renderDeliveryInfo(userInfo) {
  const receiverName = document.getElementById('receiverName');
  const receiverPhoneNumber = document.getElementById('receiverPhoneNumber');
  const postalCode = document.getElementById('postalCode');
  const address1 = document.getElementById('address1');
  const address2 = document.getElementById('address2');

  receiverName.value = userInfo.fullName;
  if ('phoneNumber' in userInfo) {
    receiverPhoneNumber.value = userInfo.phoneNumber;
  }
  if ('address' in userInfo) {
    postalCode.value = userInfo.address.postalCode;
    address1.value = userInfo.address.address1;
    address2.value = userInfo.address.address2;
  }
}

// 주소검색 API 사용 함수
function searchAddress() {
  const postalCodeInput = document.getElementById('postalCode');
  const address1Input = document.getElementById('address1');
  const address2Input = document.getElementById('address2');

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

function searchAddressEvent() {
  const searchAddressButton = document.getElementById('searchAddressButton');
  searchAddressButton.addEventListener('click', searchAddress);
}

function postOrderInfo() {}

function deleteBuyNowStorage() {
  window.localStorage.setItem('localStorageKeyObj', JSON.stringify({}));
}

// console.log(userInfo);
