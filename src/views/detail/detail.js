import { getLocalStorageList, inputCart } from '/useful-functions.js';

let localStorageGetBtnElement = document.getElementById('localStorageGetBtn');
localStorageGetBtnElement.addEventListener('click', function () {
  let cartList = getLocalStorageList('cart');
});

let localStorageAddBtnElement = document.getElementById('localStorageAddBtn');
localStorageAddBtnElement.addEventListener('click', function () {
  let productDummySchema = {
    id: prompt('id?'),
    quantity: prompt('수량은?'),
    product: prompt('상품?'),
    price: prompt('가격?'),
  };
  inputCart(productDummySchema.id, productDummySchema);
});
