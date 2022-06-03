import * as Api from '/api.js';
import {
  updateOrderSummary,
  loginUser,
  logoutUser,
  setRegister,
  getLocalStorageKeyObj,
  getLocalStorageList,
} from '/useful-functions.js';

const FAIL_MESSAGE =
  '주문에 실패했습니다. 입력 사항을 다시 한 번 확인하고 시도해주세요.';

const newOrder = {
  recipientFullName: '',
  recipientPhoneNumber: '',
  recipientAddress: {
    postalCode: '',
    address1: '',
    address2: '',
  },
  orderList: [],
  orderRequest: '',
};

init();

async function init() {
  loginUser();
  logoutUser();
  setRegister();
  const userInfo = await renderUserInfo();
  renderDeliveryInfo(userInfo);
  searchAddressEvent();
  const localStorageKeyObj = getLocalStorageKeyObj();
  updateOrderSummary(localStorageKeyObj);

  const purchaseButton = document.getElementById('purchaseButton');
  purchaseButton.addEventListener('click', async () => {
    const orderList = makeOrderList(localStorageKeyObj);
    const receiverName = document.getElementById('receiverName');
    const receiverPhoneNumber = document.getElementById('receiverPhoneNumber');
    const postalCodeInput = document.getElementById('postalCode');
    const address1Input = document.getElementById('address1');
    const address2Input = document.getElementById('address2');
    const requestSelectBox = document.getElementById('requestSelectBox');

    newOrder.ordererFullName = userInfo.fullName;
    newOrder.ordererPhoneNumber = userInfo.hasOwnProperty('phoneNumber')
      ? userInfo.phoneNumber
      : undefined;
    newOrder.recipientFullName =
      receiverName.value === '' ? undefined : receiverName.value;
    newOrder.recipientPhoneNumber = receiverPhoneNumber.value;
    newOrder.recipientAddress.postalCode =
      postalCodeInput.value === '' ? undefined : postalCodeInput.value;
    newOrder.recipientAddress.address1 =
      address1Input.value === '' ? undefined : address1Input.value;
    newOrder.recipientAddress.address2 =
      address2Input.value === '' ? undefined : address2Input.value;

    newOrder.orderList = orderList;
    newOrder.orderRequest = requestSelectBox.value;

    try {
      const result = await Api.post('/api/order/register', newOrder);
      if (result) {
        deleteStorageAfterBuy();
        window.location.href = '/completeOrder';
      }
    } catch (err) {
      alert(err.message);
    }
  });
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

function searchAddressEvent() {
  const searchAddressButton = document.getElementById('searchAddressButton');
  searchAddressButton.addEventListener('click', searchAddress);
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

async function postOrderInfo(userInfo, orderList) {
  try {
    const result = await Api.post('/api/order/register', newOrder);
    if (result) {
      window.location.href = '/completeOrder';
    }
  } catch {
    alert(FAIL_MESSAGE);
  }
}

function deleteStorageAfterBuy() {
  const localStorageKeyObj = getLocalStorageKeyObj();
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
