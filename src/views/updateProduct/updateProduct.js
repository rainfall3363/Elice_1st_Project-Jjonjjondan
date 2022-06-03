import { loginUser, logoutUser } from '../../../../useful-functions.js';
import * as Api from '../../../../api.js';

const productFormSection = document.querySelector('#productFormSection');
const productId = window.location.pathname.slice(23, -1);
const SUCCESS_MESSAGE = '상품 수정에 성공했습니다.';
const FAIL_MESSAGE = '상품 수정에 실패했습니다. 다시 한 번 시도해주세요.';

init();

async function init() {
  loginUser();
  logoutUser();
  await render();
  addAllEvents();
}

async function render() {
  const productName = productFormSection.querySelector('#productName');
  const productPrice = productFormSection.querySelector('#productPrice');
  const productMaker = productFormSection.querySelector('#productMaker');
  const productStock = productFormSection.querySelector('#productStock');
  const productDescription = productFormSection.querySelector(
    '#productDescription'
  );

  const categoryList = await Api.get('/api/category/list');
  const productInfo = await Api.get('/api/product/info', productId);
  const fragment = new DocumentFragment();

  productName.value = productInfo.title;
  productPrice.value = productInfo.price;
  productMaker.value = productInfo.maker;
  productStock.value = productInfo.inventory;
  productDescription.value = productInfo.description;

  categoryList.forEach((category) => {
    const option = document.createElement('option');
    option.innerText = category.categoryName;
    if (category.categoryName === productInfo.categoryName) {
      option.setAttribute('selected', 'true');
    }
    fragment.appendChild(option);
  });
  categorySelect.appendChild(fragment);
}

function addAllEvents() {
  const patchButton = productFormSection.querySelector('#patchButton');
  const cancelButton = productFormSection.querySelector('#cancelButton');

  patchButton.addEventListener('click', updateProduct);
  cancelButton.addEventListener('click', handleCancel);
}

async function updateProduct() {
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
    const result = await Api.patch(
      '/api/product/update',
      productId,
      newProduct
    );
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
