import { getLocalStorageList, addLocalStorageList } from '/useful-functions.js';

let localStorageGetBtnElement = document.getElementById('localStorageGetBtn');
localStorageGetBtnElement.addEventListener('click', function () {
  let cartList = getLocalStorageList('cart');
  console.log(cartList);
});

let localStorageAddBtnElement = document.getElementById('localStorageAddBtn');
localStorageAddBtnElement.addEventListener('click', function () {
  let productDummySchema = {
    product: prompt('상품?'),
    price: prompt('가격?'),
  };

  let cartList = addLocalStorageList('cart', productDummySchema);
  console.log(cartList);
});
