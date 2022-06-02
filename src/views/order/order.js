import * as Api from '/api.js';
import {
  updateOrderSummary,
  loginUser,
  logoutUser,
} from '/useful-functions.js';

init();

async function init() {
  loginUser();
  logoutUser();
  const userInfo = await renderUserInfo();
  renderDeliveryInfo(userInfo);
  const localStorageKeyObj = getLocalStorageKeyObj();
  updateOrderSummary(localStorageKeyObj);
  postOrderInfo();
  deleteBuyNowStorage();
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

function postOrderInfo() {}

function deleteBuyNowStorage() {}

// console.log(userInfo);
