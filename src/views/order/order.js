import { getLocalStorageList, addCommas } from '/useful-functions.js';

function makeOrderSummary(orderSummary) {
  return `
      <div class="box order-summary">
        <div class="header">
          <p>결제정보</p>
        </div>
        <div class="order-info">
          <div class="info">
            <p>상품수</p>
            <p id="productsCount">${addCommas(
              parseInt(orderSummary.productsCount)
            )}</p>
          </div>
          <div class="info">
            <p>상품금액</p>
            <p id="productsTotal">${addCommas(
              parseInt(orderSummary.productsTotal)
            )}</p>
          </div>
          <div class="info">
            <p>배송비</p>
            <p id="deliveryFee">${addCommas(3000)}</p>
          </div>
        </div>
        <div class="total">
          <p class="total-label">총 결제금액</p>
          <p class="total-price" id="orderTotal">${addCommas(
            parseInt(orderSummary.productsTotal) + 3000
          )}</p>
        </div>
        <div class="purchase">
          <button class="button is-info" id="purchaseButton">
            구매하기
          </button>
        </div>
      </div>
    `;
}

function renderOrderSummary() {
  const orderSummary = document.getElementById('orderSummary');
  const getOrderLocalStorageObj = getLocalStorageList('order');
  orderSummary.innerHTML = makeOrderSummary(getOrderLocalStorageObj);
}

function updateOrderSummary() {
  const orderLocalStorage = window.localStorage.getItem('order');
  const isOrder = orderLocalStorage !== null;
  let orderObject = {};

  if (isOrder) {
    const cartList = getLocalStorageList('cart');
    const checkList = getLocalStorageList('checkList');

    const checkedCartList = cartList.filter((e) => checkList.includes(e.id));
    orderObject = {
      ids: checkedCartList.map((e) => e.id),
      productsCount: checkedCartList.length,
      productsTotal: checkedCartList.reduce(
        (acc, e) => acc + parseInt(e.price) * parseInt(e.quantity),
        0
      ),
    };
  } else {
    orderObject = {
      ids: [],
      productsCount: 0,
      productsTotal: 0,
    };
  }
  window.localStorage.setItem('order', JSON.stringify(orderObject));
  renderOrderSummary();
}

updateOrderSummary();
