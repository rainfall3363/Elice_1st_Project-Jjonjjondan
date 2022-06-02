import * as Api from '/api.js';
import {
  updateOrderSummary,
  loginUser,
  logoutUser,
  getLocalStorageKeyObj,
} from '/useful-functions.js';

const FAIL_MESSAGE =
  '주문에 실패했습니다. 입력 사항을 다시 한 번 확인하고 시도해주세요.';

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
  if (userInfo.hasOwnProperty('phoneNumber')) {
    receiverPhoneNumber.value = userInfo.phoneNumber;
  }
  if (userInfo.hasOwnProperty('address')) {
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

async function postOrderInfo() {
  // const newOrder = {
  //   orderer: {
  //     userId: '628c691d587f8e4eda07ef61ㅁㅁㅁ',
  //     fullName: '테스트',
  //     phoneNumber: '01012345678',
  //   },
  //   recipient: {
  //     fullName: '김재민',
  //     phoneNumber: '01012345567',
  //     address: {
  //       postalCode: '12234',
  //       address1: '대전시 대덕구 중리동 232-23',
  //       address2: 'ㅇㅇ빌 ㅇㅇㅇ호',
  //     },
  //   },
  //   order: {
  //     status: '상품 배송중',
  //     orderList: [],
  //   },
  // };

  const newOrder = {
    ordererUserId: '628c691d587f8e4eda07ef61',
    ordererFullName: '테스트',
    ordererPhoneNumber: '01012345678',
    recipientFullName: '김재민',
    recipientPhoneNumber: '01012345567',
    recipientAddress: {
      postalCode: '12234',
      address1: '대전광역시 대덕구 중리동',
      address2: '무슨빌 3층 303호',
    },
    orderList: [],
    orderRequest: '문앞요',
    orderStatus: '상품 배송중',
  };

  try {
    const result = await Api.post('/api/order/register', newOrder);
    if (result) {
      window.location.href = '/completeOrder';
    }
  } catch {
    alert(FAIL_MESSAGE);
  }
}

function deleteBuyNowStorage() {
  window.localStorage.setItem('localStorageKeyObj', JSON.stringify({}));
}

// console.log(userInfo);
