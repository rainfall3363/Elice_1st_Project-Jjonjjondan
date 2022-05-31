import * as Api from '/api.js';
import { setRegister } from '/useful-functions.js';
import { logoutUser } from '/useful-functions.js';
import { loginUser } from '/useful-functions.js';
import { addCommas } from '/useful-functions.js';

init();

async function init() {
  loginUser();
  logoutUser();
  setRegister();
  await renderProduct();
  await buttonEvents();
}

//query String 값 가져오기
const params = new URLSearchParams(document.location.search);
const productId = params.get('productId');

//개별 상품 렌더링
async function renderProduct() {
  const brandSection = await document.getElementById('brandSection');
  const data = await Api.get(`/api/productInfo/${productId}`);
  const title = data.title;
  const imageURL = data.image;
  const maker = data.maker;
  const price = addCommas(Number(data.price));
  const description = data.description;

  brandSection.insertAdjacentHTML(
    'beforeend',
    `
  <section id="productContent">
  <div id="imgBox">
    <img id="productImage" src="${imageURL}" alt="">
  </div>
  <div id="contents">
    <div id="innercontents">
      <ul>
        <li id="brand">${maker}</li>
      </ul>
      <p id="title">${title}</p>
      <p id="price">${price}원</p>
      <p id="description">${description}</p>
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

//장바구니 버튼, 바로구매 버튼
function buttonEvents() {
  const inputCartbutton = document.getElementById('inputCart');
  const buyNowbutton = document.getElementById('buyNow');

  inputCartbutton.addEventListener('click', inputCart);
  buyNowbutton.addEventListener('click', buyNow);
}

//장바구니 클릭 시 알림
function inputCart() {
  alert('장바구니에 추가되었습니다.');
}

//바로 구매 클릭 시 이동
function buyNow() {
  console.log(2);
}
