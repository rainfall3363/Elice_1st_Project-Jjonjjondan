import * as Api from '/api.js';
import {
  setRegister,
  loginUser,
  logoutUser,
  addCommas,
  changetoAdmin,
  inputCart,
} from '/useful-functions.js';

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

// query String 값 가져오기

async function productData() {
  const params = new URLSearchParams(document.location.search);
  const productId = params.get('productId');
  const data = await Api.get(`/api/productInfo/${productId}`);
  data.id = productId;
  return data;
}

//개별 상품 렌더링
async function renderProduct(productData) {
  const brandSection = await document.getElementById('brandSection');
  // const data = await Api.get(`/api/productInfo/${productId}`);
  // const title = data.title;
  // const imageURL = data.image;
  // const maker = data.maker;
  // const price = addCommas(Number(data.price));
  // const description = data.description;

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
    <button id="inputCart" class="button is-info is-outlined button is-medium is-fullwidth">장바구니 담기</button>
    <button id="buyNow" class="button is-success is-outlined button is-medium is-fullwidth">바로 구매하기</button>
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

  inputCartbutton.addEventListener('click', inputcartbuttondata(data));
  buyNowbutton.addEventListener('click', buyNow);
}

//장바구니 버튼 클릭 시 로컬스토리지에 해당 상품 정보 저장
function inputcartbuttondata(data) {
  return function () {
    inputCart(data.id, data);
  };
}

//바로 구매 클릭 시 이동
function buyNow() {
  window.location.href = '/order';
}
