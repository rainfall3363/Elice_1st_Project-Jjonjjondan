import { loginUser, logoutUser, checkAdmin } from '../../useful-functions.js';
import * as Api from '../../api.js';

const deleteModal = document.querySelector('#deleteModal');

init();

async function init() {
  await checkAdmin();
  loginUser();
  logoutUser();
  await renderProducts();
  addAllEvents();
}

async function renderProducts() {
  const tableBody = document.querySelector('#tableBody');

  try {
    const products = await Api.get('/api/product/list');

    products.forEach((product) => {
      const html = createProductTable(product);
      tableBody.insertAdjacentHTML('beforeend', html);
    });
  } catch (error) {
    alert('상품 목록을 가져오는 데 실패했습니다. 다시 시도해 주세요.');
    window.location.href = '/admin';
  }
}

function createProductTable(product) {
  const maker = product.maker !== '' ? product.maker : 'X';

  return `
    <tr>
      <th>${product.title}
      <td>${product.price}원</td>
      <td>
        ${maker}
      </td>
      <td>${product.categoryName}</td>
      <td>${product.inventory}</td>
      <td>
        <a href="/admin/products/update/${product._id}">
          <button class="button submit-button is-link is-outlined update-button" data-id="${product._id}">수정</button>
        </a>
      </td>
      <td>
        <button class="button delete-button is-danger is-outlined cancel-button" data-id="${product._id}">삭제</button>
      </td>
    </tr>
  `;
}

function addAllEvents() {
  const deleteButtonList = document.querySelectorAll('.delete-button');
  const modalBackground = deleteModal.querySelector('.modal-background');

  deleteButtonList.forEach((node) => {
    node.addEventListener('click', openDeleteModal);
  });
  modalBackground.addEventListener('click', closeDeleteModal);
}

function openDeleteModal(event) {
  const modalYesButton = deleteModal.querySelector('#modalYesButton');
  const modalCancelButton = deleteModal.querySelector('#modalCancelButton');

  modalYesButton.addEventListener(
    'click',
    deleteProduct(event.target.dataset['id'])
  );
  modalCancelButton.addEventListener('click', closeDeleteModal);
  deleteModal.classList.add('is-active');
}

function deleteProduct(productId) {
  return async function (event) {
    try {
      await Api.delete('/api/product/delete', productId);
      event.stopPropagation();
      alert(`상품 삭제 요청이 정상적으로 처리되었습니다.`);
      window.location.reload();
    } catch {
      event.stopPropagation();
      alert('상품 삭제에 실패했습니다. 다시 한번 시도해주세요.');
    }
  };
}

function closeDeleteModal(event) {
  event.stopPropagation();
  deleteModal.classList.remove('is-active');
}
