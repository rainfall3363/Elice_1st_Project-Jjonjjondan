import * as Api from '/api.js';
import {
  setRegister,
  loginUser,
  logoutUser,
  addCommas,
  changetoAdmin,
  inputCart,
  addLocalStorageList,
  setLocalStorageKeyObj,
} from '/useful-functions.js';

const localStorageKeyObj = {};
localStorageKeyObj.order = 'buyNowOrder';
localStorageKeyObj.cart = 'buyNowCart';
localStorageKeyObj.checkList = 'buyNowCheckList';

init();

async function init() {
  loginUser();
  logoutUser();
  setRegister();
  changetoAdmin();
  const data = await productData();
  await renderProduct(data);
  await buttonEvents(data);
}

/**상품 정보 불러오기*/
async function productData() {
  try {
    const params = new URLSearchParams(document.location.search);
    const productId = params.get('productId');
    const data = await Api.get(`/api/product/info/${productId}`);
    data.id = productId;
    data.quantity = 1;
    return data;
  } catch (err) {
    console.error(err.stack);
    alert('상품 정보를 가져오는 데 실패하였습니다.');
  }
}

//개별 상품 렌더링
async function renderProduct(productData) {
  const brandSection = await document.getElementById('brandSection');
  brandSection.insertAdjacentHTML(
    'beforeend',
    `
  <section id="productContent">
  <div id="imgBox">
    <img id="productImage" src="${productData.image}" alt="">
  </div>
  <div id="contents">
    <div id="innercontents">
      <ul>
        <li id="brand">${productData.maker}</li>
      </ul>
      <p id="title">${productData.title}</p>
      <p id="price">${addCommas(Number(productData.price))}원</p>
      <p id="description">${productData.description}</p>
    </div>
  <div id="cartandbuyButtons">
    <button id="inputCart" class="button is-info is-outlined is-medium is-fullwidth">장바구니 담기</button>
    <button id="buyNow" class="button is-success is-outlined is-medium is-fullwidth">바로 구매하기</button>
  </div>
  </div>
  </section>
  `
  );
}

//장바구니 버튼, 바로구매 버튼 클릭 시 이벤트
function buttonEvents(data) {
  const inputCartbutton = document.getElementById('inputCart');
  const buyNowbutton = document.getElementById('buyNow');

  if (data.inventory === 0) {
    inputCartbutton.setAttribute('disabled', true);
    inputCartbutton.innerText = '매진';
    inputCartbutton.classList.remove('is-info');
    buyNowbutton.setAttribute('disabled', true);
    buyNowbutton.innerText = '매진';
    buyNowbutton.classList.remove('is-success');
  }

  inputCartbutton.addEventListener('click', inputcartbuttondata(data));
  buyNowbutton.addEventListener('click', buyNow(data));
}

//장바구니 버튼 클릭 시 로컬스토리지에 해당 상품 정보 저장
function inputcartbuttondata(data) {
  return function () {
    inputCart(data);
  };
}

//바로 구매 클릭 시 이동
function buyNow(data) {
  return function () {
    //만약 해당 key가 없다면 add함수 속 get함수로 초기화
    addLocalStorageList(localStorageKeyObj.cart, data);
    addLocalStorageList(localStorageKeyObj.checkList, data.id);
    // updateOrderSummary('buynowOrder','')
    setLocalStorageKeyObj(localStorageKeyObj);

    window.location.href = '/order';
  };
  // //order.js에서 결제 주문 버튼 누르고 완료시
  // deleteLocalStorageList('checkList', data.id);
  // deleteLocalStorageListById('cart', data.id);
}
