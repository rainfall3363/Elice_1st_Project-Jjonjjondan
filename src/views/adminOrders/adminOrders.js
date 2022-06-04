import {
  loginUser,
  logoutUser,
  calculateTotalPrice,
  checkAdmin,
} from '../../useful-functions.js';
import * as Api from '../../api.js';

init();

async function init() {
  await checkAdmin();
  loginUser();
  logoutUser();
  await renderOrders();
  addAllEvents();
}

async function renderOrders() {
  const tableBody = document.querySelector('#tableBody');
  try {
    const orders = await Api.get('/api/order/list');

    orders.forEach((order, index) => {
      const html = createOrderTable(order, index);
      tableBody.insertAdjacentHTML('beforeend', html);
    });
  } catch {
    alert('주문 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    window.location.href = '/admin';
  }
}

function createOrderTable(order, index) {
  const productNameString = order.order.orderList.reduce((str, element) => {
    return (str += `<p>${element.productName} ${element.quantity}개</p>`);
  }, ``);
  const totalPrice = order.order.orderList.reduce((acc, element) => {
    return (acc += element.price * element.quantity);
  }, 0);
  const orderDate = order.createdAt?.split('T')[0].replace(/[-]/g, '');
  const status = order.order.status.trim();

  return `
    <tr>
      <th>${order._id}
      <td>${orderDate}</td>
      <td>
        ${productNameString}
      </td>
      <td>${calculateTotalPrice(totalPrice)}원</td>
      <td>
        <div class="select">
          <select class="orderStatusSelect" data-id="${
            order._id
          }" data-index="${index}">
            <option ${
              status === '상품 준비중' && 'selected'
            }>상품 준비중</option>
            <option ${
              status === '상품 배송중' && 'selected'
            }>상품 배송중</option>
            <option ${
              status === '배송 완료' && 'selected'
            } class="has-background-success-lighter">배송 완료</option>
          </select>
        </div>
      </td>
      <td>
        <button class="button is-background-orange is-light cancel-button" data-id="${
          order._id
        }" data-index="${index}" ${
    status !== '상품 준비중' && 'disabled'
  }>취소하기</button>
      </td>
    </tr>
  `;
}

function addAllEvents() {
  const calcelButton = document.querySelectorAll('.cancel-button');
  const statusSelectBox = document.querySelectorAll('.orderStatusSelect');
  const modalBackground = document.querySelector('.modal-background');

  calcelButton.forEach((node) => {
    node.addEventListener('click', openCancelModal);
  });
  modalBackground.addEventListener('click', closeCancelModal);
  statusSelectBox.forEach((element) => {
    element.addEventListener('change', patchStatus);
  });
}

function openCancelModal(event) {
  const modalYesButton = document.querySelector('#modalYesButton');
  const modalCancelButton = document.querySelector('#modalCancelButton');
  const orderId = event.target.dataset['id'];

  modalYesButton.addEventListener('click', cancelOrder(orderId));
  modalCancelButton.addEventListener('click', closeCancelModal);
  modal.classList.add('is-active');
}

async function patchStatus(event) {
  const status = event.target.value;
  const cancelButton = document.querySelector(
    `button[data-index="${event.target.dataset['index']}"]`
  );
  try {
    await Api.patch('/api/order/update', event.target.dataset['id'], {
      status,
    });
    if (status !== '상품 준비중') {
      cancelButton.disabled = true;
    } else {
      cancelButton.disabled = false;
    }
  } catch {
    alert('주문 상태 수정에 실패했습니다. 다시 한번 시도해주세요.');
    window.location.reload();
  }
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
