import { loginUser, logoutUser } from '../../useful-functions.js';
import * as Api from '../../api.js';

init();

async function init() {
  loginUser();
  logoutUser();
  await renderProducts();
}

async function renderProducts() {
  const products = await Api.get('/api/productlist');
  const tableBody = document.querySelector('#tableBody');

  for (const product of products) {
    const html = createProductTable(product);
    tableBody.insertAdjacentHTML('beforeend', html);
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
      <td>${product.category}</td>
      <td>
        <button class="button is-link is-outlined update-button" data-id="${product._id}">수정</button>
      </td>
      <td>
        <button class="button is-danger is-outlined cancel-button" data-id="${product._id}">삭제</button>
      </td>
    </tr>
  `;
}
