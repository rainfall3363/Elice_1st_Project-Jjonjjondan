function getLocalStorage() {
  let cartList = window.localStorage.getItem('cart');
  if (cartList === null) {
    window.localStorage.setItem('cart', JSON.stringify([]));
    return window.localStorage.getItem('cart');
  } else {
    return window.localStorage.getItem('cart');
  }
}

let localStorageBtnElement = document.getElementById('localStorageBtn');
localStorageBtnElement.addEventListener('click', function () {});
