import {
  loginUser,
  logoutUser,
  calculateTotalPrice,
} from '../../useful-functions.js';
import * as Api from '../../api.js';

// elements
const modal = document.querySelector('#modal');

init();

// 첫 렌더링시 실행되는 함수
async function init() {
  loginUser();
  logoutUser();
  await renderOrders();
  addAllEvents();
}

// #tableBody에 주문 목록을 추가하는 함수
async function renderOrders() {
  const orders = await Api.get('/api/order/info/userId');
  const tableBody = document.querySelector('#tableBody');

  for (const order of orders) {
    const html = createOrderTable(order);
    tableBody.insertAdjacentHTML('beforeend', html);
  }
}

// 주문 테이블을 작성해 반환하는 함수
function createOrderTable(order) {
  const productNameString = order.order.orderList.reduce((str, element) => {
    return (str += `<p>${element.productName} ${element.quantity}개</p>`);
  }, ``);
  const totalPrice = order.order.orderList.reduce(
    (_, element) => element.price,
    0
  );
  const orderDate = order.createdAt.slice(0, 10).replaceAll('-', '');
  const status = order.order.status;

  return `
  <tr>
    <th>${order._id}
    <td>${orderDate}</td>
    <td>
      ${productNameString}
    </td>
    <td>${calculateTotalPrice(totalPrice)}원</td>
    <td>${status}</td>
    <td>
      <button class="button is-background-orange is-light cancel-button" data-id="${
        order._id
      }" ${status !== '상품 준비중' && 'disabled'}>취소하기</button>
    </td>
  </tr>
  `;
}

function addAllEvents() {
  const calcelButton = document.querySelectorAll('.cancel-button');
  const modalBackground = document.querySelector('.modal-background');

  calcelButton.forEach((node) => {
    node.addEventListener('click', openCancelModal);
  });
  modalBackground.addEventListener('click', closeCancelModal);
}

// 모달창을 여는 이벤트 처리 함수
function openCancelModal(event) {
  const modalYesButton = document.querySelector('#modalYesButton');
  const modalCancelButton = document.querySelector('#modalCancelButton');
  const orderId = event.target.dataset['id'];

  modalYesButton.addEventListener('click', cancelOrder(orderId));
  modalCancelButton.addEventListener('click', closeCancelModal);
  modal.classList.add('is-active');
}

function cancelOrder(orderId) {
  return async function (event) {
    try {
      await Api.delete('/api/order/delete', orderId);
      event.stopPropagation();
      alert(`${orderId} 주문에 대한 취소요청이 완료되었습니다.`);
      window.location.reload();
    } catch {
      alert('주문 취소에 실패했습니다. 다시 한번 시도해주세요.');
    }
  };
}

function closeCancelModal(event) {
  event.stopPropagation();
  modal.classList.remove('is-active');
}
