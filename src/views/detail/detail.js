import {
  getLocalStorageList,
  getLocalStorageListById,
  addLocalStorageList,
  editQuantityLocalStorageListById,
} from '/useful-functions.js';

let localStorageGetBtnElement = document.getElementById('localStorageGetBtn');
localStorageGetBtnElement.addEventListener('click', function () {
  let cartList = getLocalStorageList('cart');
  // console.log(cartList);
});

let localStorageAddBtnElement = document.getElementById('localStorageAddBtn');
localStorageAddBtnElement.addEventListener('click', function () {
  let productDummySchema = {
    id: prompt('id?'),
    quantity: prompt('수량은?'),
    product: prompt('상품?'),
    price: prompt('가격?'),
  };

  const valueList = getLocalStorageList('cart');
  const storeId = productDummySchema.id;
  const StorageList = valueList.filter((e) => e.id == storeId);

  if (StorageList === null) {
    addLocalStorageList('cart', productDummySchema);
  } else {
    let quantityValue = parseInt(
      getLocalStorageListById('cart', storeId).quantity
    );
    quantityValue++;
    if (quantityValue >= 99) {
      editQuantityLocalStorageListById('cart', storeId, 99);
    } else {
      editQuantityLocalStorageListById('cart', storeId, quantityValue);
    }
  }
});
