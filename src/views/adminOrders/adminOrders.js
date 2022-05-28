import {
  loginUser,
  logoutUser,
  calculateTotalPrice,
} from '../../useful-functions.js';
import * as Api from '../../api.js';

init();

async function init() {
  loginUser();
  logoutUser();
  await renderOrders();
  addAllEvents();
}

async function renderOrders() {
  const list = await (await fetch('./orderlist.json')).json();
  const tableBody = document.querySelector('#tableBody');

  for (let data in list) {
    const html = createOrderTable(list[data]);
    tableBody.insertAdjacentHTML('beforeend', html);
  }
}

function createOrderTable(data) {
  const productNameString = data.order.orderList.reduce((str, element) => {
    return (str += `<p>${element.productName} ${element.orderQuantity}개</p>`);
  }, ``);
  const totalPrice = data.order.orderList.reduce(
    (_, element) => element.price,
    0
  );

  return `
  <tr>
    <th>${data.order.orderNumber}
    <td>${data.createdAt}</td>
    <td>
      ${productNameString}
    </td>
    <td>${calculateTotalPrice(totalPrice)}원</td>
    <td>
      <div class="select">
        <select id="orderStatusSelect">
          <option ${
            data.orderStatus === '상품 준비중' && 'selected'
          }>상품 준비중</option>
          <option ${
            data.orderStatus === '상품 배송중' && 'selected'
          }>상품 배송중</option>
          <option ${
            data.orderStatus === '배송 완료' && 'selected'
          } class="has-background-success-lighter">배송 완료</option>
        </select>
      </div>
    </td>
    <td>
      <button class="button is-danger is-outlined cancel-button" data-id="${
        data.order.orderNumber
      }">취소하기</button>
    </td>
  </tr>
  `;
}

function addAllEvents() {
  const calcelButton = document.querySelectorAll('.cancel-button');
  const select = document.querySelector('#orderStatusSelect');
  const modalBackground = document.querySelector('.modal-background');

  calcelButton.forEach((node) => {
    node.addEventListener('click', openCancelModal);
  });
  modalBackground.addEventListener('click', closeCancelModal);
  select.addEventListener('change', patchStatus);
}

function openCancelModal(event) {
  const modalYesButton = document.querySelector('#modalYesButton');
  const modalCancelButton = document.querySelector('#modalCancelButton');
  const orderId = event.target.dataset['id'];

  modalYesButton.addEventListener('click', cancelOrder(orderId));
  modalCancelButton.addEventListener('click', closeCancelModal);
  modal.classList.add('is-active');
}

function patchStatus() {
  /* TODO: 상태 변경시 주문 patch 요청 보내는 로직 */
  console.log('Status changed!');
}

function cancelOrder(orderId) {
  return async function (event) {
    /* TODO: 비동기로 취소 처리하는 코드 */

    event.stopPropagation();
    alert(`${orderId}주문에 대한 취소요청이 완료되었습니다.`);
    window.location.reload();
  };
}

function closeCancelModal(event) {
  event.stopPropagation();
  modal.classList.remove('is-active');
}
