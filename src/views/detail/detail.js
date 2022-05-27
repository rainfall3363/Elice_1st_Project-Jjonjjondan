function getLocalStorageList(key) {
  let valueList = window.localStorage.getItem(key);
  if (valueList === null) {
    window.localStorage.setItem(key, JSON.stringify([]));
    return JSON.parse(window.localStorage.getItem(key));
  } else {
    return JSON.parse(window.localStorage.getItem(key));
  }
}

function addLocalStorageList(key, value) {
  let valueList = getLocalStorageList(key);
  valueList.push(value);
  window.localStorage.setItem(key, JSON.stringify(valueList));
  return JSON.parse(window.localStorage.getItem(key));
}

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
