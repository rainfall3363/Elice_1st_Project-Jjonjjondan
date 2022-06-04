import * as Api from '/api.js';
import {
  updateOrderSummary,
  loginUser,
  logoutUser,
  setRegister,
  changetoAdmin,
  getLocalStorageKeyObj,
  getLocalStorageList,
} from '/useful-functions.js';

init();

async function init() {
  loginUser();
  logoutUser();
  setRegister();
  changetoAdmin();

  const userInfo = await renderUserInfo();
  renderDeliveryInfo(userInfo);
  const localStorageKeyObj = getLocalStorageKeyObj();
  if (Object.keys(localStorageKeyObj).length === 0) {
    alert('정상적인 경로로 다시 주문 진행하여 주시기 바랍니다.');
    return;
  }
  updateOrderSummary(localStorageKeyObj);
  addAllEvents();
  window.addEventListener('beforeunload', deleteStorageAfterBuy);
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
  const postalCodeInput = document.getElementById('postalCode');
  const address1Input = document.getElementById('address1');
  const address2Input = document.getElementById('address2');

  receiverName.value = userInfo.fullName;

  if (userInfo.hasOwnProperty('phoneNumber')) {
    receiverPhoneNumber.value = userInfo.phoneNumber;
  }
  if (userInfo.hasOwnProperty('address')) {
    postalCodeInput.value = userInfo.address.postalCode;
    address1Input.value = userInfo.address.address1;
    address2Input.value = userInfo.address.address2;
  }
}

function addAllEvents() {
  const searchAddressButton = document.getElementById('searchAddressButton');
  searchAddressButton.addEventListener('click', searchAddress);

  const purchaseButton = document.getElementById('purchaseButton');
  purchaseButton.addEventListener('click', addNewOrder);
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
      const postalCodeInput = document.getElementById('postalCode');
      const address1Input = document.getElementById('address1');
      const address2Input = document.getElementById('address2');

      postalCodeInput.value = data.zonecode;
      address1Input.value = `${addr} ${extraAddr}`;
      address2Input.value = '';
      address2Input.placeholder = '상세 주소 입력';
      address2Input.focus();
    },
  }).open();
}

async function addNewOrder() {
  const localStorageKeyObj = getLocalStorageKeyObj();
  const receiverName = document.getElementById('receiverName');
  const receiverPhoneNumber = document.getElementById('receiverPhoneNumber');
  const postalCodeInput = document.getElementById('postalCode');
  const address1Input = document.getElementById('address1');
  const address2Input = document.getElementById('address2');
  const requestSelectBox = document.getElementById('requestSelectBox');

  const newOrder = {
    recipientFullName: receiverName.value,
    recipientPhoneNumber: receiverPhoneNumber.value,
    recipientAddress: {
      postalCode: postalCodeInput.value,
      address1: address1Input.value,
      address2: address2Input.value,
    },
    orderList: makeOrderList(localStorageKeyObj),
    orderRequest:
      requestSelectBox.options[requestSelectBox.selectedIndex].text ===
      '배송시 요청사항을 선택해 주세요.'
        ? ''
        : requestSelectBox.options[requestSelectBox.selectedIndex].text,
  };

  if (!checkIntegrity(newOrder)) {
    return alert('모든 값을 입력해주세요.');
  }

  try {
    const result = await Api.post('/api/order/register', newOrder);
    if (result) {
      deleteStorageAfterBuy();
      window.location.href = '/completeOrder';
    }
  } catch (err) {
    alert(err.message);
  }
}

function makeOrderList(localStorageKeyObj) {
  const cartList = getLocalStorageList(localStorageKeyObj.cart);
  const checkList = getLocalStorageList(localStorageKeyObj.checkList);
  const checkedCartList = cartList
    .filter((e) => checkList.includes(e.id))
    .map((e) => {
      return {
        productId: e.id,
        productName: e.title,
        quantity: e.quantity,
        price: e.price,
      };
    });
  return checkedCartList;
}

function checkIntegrity(newOrder) {
  if (
    newOrder.recipientFullName === '' ||
    newOrder.recipientPhoneNumber === '' ||
    newOrder.recipientAddress.postalCode === '' ||
    newOrder.recipientAddress.address1 === '' ||
    newOrder.recipientAddress.address2 === '' ||
    newOrder.orderRequest === ''
  ) {
    return false;
  }
  return true;
}

function deleteStorageAfterBuy() {
  const localStorageKeyObj = getLocalStorageKeyObj();
  if (Object.keys(localStorageKeyObj).length === 0) {
    alert(
      '이미 결제하신 내역이 있습니다. 주문 상세페이지에서 다시 주문하여 주시기 바랍니다.'
    );
    return;
  }
  const cartList = getLocalStorageList(localStorageKeyObj.cart);
  const checkList = getLocalStorageList(localStorageKeyObj.checkList);

  const refreshCartList = cartList.filter((e) => !checkList.includes(e.id));

  window.localStorage.setItem(
    localStorageKeyObj.cart,
    JSON.stringify(refreshCartList)
  );
  window.localStorage.setItem(localStorageKeyObj.checkList, JSON.stringify([]));
  window.localStorage.setItem(localStorageKeyObj.order, JSON.stringify({}));
  window.localStorage.setItem('localStorageKeyObj', JSON.stringify({}));
}
