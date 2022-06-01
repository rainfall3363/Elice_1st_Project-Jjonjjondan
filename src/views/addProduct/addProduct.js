import { loginUser, logoutUser } from '../../../useful-functions.js';
import * as Api from '../../../api.js';

const productFormSection = document.querySelector('#productFormSection');
const categorySelect = productFormSection.querySelector('#categorySelect');
const SUCCESS_MESSAGE = '신규 상품 등록에 성공했습니다.';
const FAIL_MESSAGE = '신규 상품 등록에 실패했습니다. 다시 한 번 시도해주세요.';

init();

async function init() {
  loginUser();
  logoutUser();
  await render();
  addAllEvents();
}

async function render() {
  const categoryList = await Api.get('/api/category/list');
  const fragment = new DocumentFragment();

  categoryList.forEach((category) => {
    const option = document.createElement('option');
    option.innerText = category.categoryName;
    fragment.appendChild(option);
  });
  categorySelect.appendChild(fragment);
}

function addAllEvents() {
  const postButton = productFormSection.querySelector('#postButton');
  const cancelButton = productFormSection.querySelector('#cancelButton');

  postButton.addEventListener('click', addNewProduct);
  cancelButton.addEventListener('click', handleCancel);
}

async function addNewProduct() {
  const productName = productFormSection.querySelector('#productName');
  const productPrice = productFormSection.querySelector('#productPrice');
  const productMaker = productFormSection.querySelector('#productMaker');
  const productStock = productFormSection.querySelector('#productStock');
  const productImage = productFormSection.querySelector('#productImage');
  const productDescription = productFormSection.querySelector(
    '#productDescription'
  );

  const newProduct = {
    title: productName.value,
    price: productPrice.value === '' ? undefined : Number(productPrice.value),
    description: productDescription.value,
    maker: productMaker.value,
    categoryName: categorySelect.value,
    image: productImage.value,
    inventory:
      productStock.value === '' ? undefined : Number(productStock.value),
  };

  if (!checkIntegrity(newProduct)) {
    return alert('모든 값을 정확히 입력해주세요.');
  }

  try {
    const result = await Api.post('/api/product/register', newProduct);
    if (result) {
      alert(SUCCESS_MESSAGE);
      window.location.href = '/admin/products';
    }
  } catch {
    alert(FAIL_MESSAGE);
  }
}

function checkIntegrity({
  title,
  price,
  description,
  categoryName,
  inventory,
}) {
  if (title === '' || description === '' || categoryName === '') {
    return false;
  } else if (!price || !inventory) {
    return false;
  }
  return true;
}

function handleCancel() {
  const action = confirm(
    '작성한 정보가 모두 사라집니다. 나가려면 확인을 눌러주세요.'
  );

  if (action) {
    window.location.href = '/admin/products';
  }
}
