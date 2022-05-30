import { loginUser, logoutUser } from '../../useful-functions.js';
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
  const list = await (await fetch('./orderlist.json')).json();
  const tableBody = document.querySelector('#tableBody');

  for (let data in list) {
    const html = createOrderTable(list[data]);
    tableBody.insertAdjacentHTML('beforeend', html);
  }
}

// 주문 테이블을 작성해 반환하는 함수
function createOrderTable(data) {
  const productNameString = data.order.orderList.reduce((str, element) => {
    return (str += `<p>${element.productName} ${element.orderQuantity}개</p>`);
  }, ``);

  return `
  <tr>
    <th>${data.order.orderNumber}
    <td>${data.createdAt}</td>
    <td>
      ${productNameString}
    </td>
    <td>${data.orderStatus}</td>
    <td>
      <button class="button is-danger is-outlined cancel-button" data-id="${data.order.orderNumber}">취소하기</button>
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
    // await으로 주문 취소 요청 보내는 코드
    event.stopPropagation();
    alert(`${orderId}주문에 대한 취소요청이 완료되었습니다.`);
    window.location.reload();
  };
}

function closeCancelModal(event) {
  event.stopPropagation();
  modal.classList.remove('is-active');
}
