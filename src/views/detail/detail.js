function getLocalStorageList(key) {
  let cartList = window.localStorage.getItem(key);
  if (cartList === null) {
    window.localStorage.setItem(key, JSON.stringify([]));
    return JSON.parse(window.localStorage.getItem(key));
  } else {
    return JSON.parse(window.localStorage.getItem(key));
  }
}

let localStorageBtnElement = document.getElementById('localStorageReadBtn');
localStorageBtnElement.addEventListener('click', function () {
  let cartList = getLocalStorageList('cart');
  console.log(cartList);
});
