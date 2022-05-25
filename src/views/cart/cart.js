function getCartList() {
  let productsCardsElement = document.getElementById('cartList');

  let store = db.transaction('order', 'readonly').objectStore('order');
  let getAllReq = store.getAll();

  getAllReq.addEventListener('success', function (event) {
    let productsCards = event.target.result;

    let resultCards = '';
    for (let i = 0; i < productsCards.length; i++) {
      resultCards += `
        <div class="cart-product-item" id="productItem-{_id}">
          <label class="checkbox">
            <input type="checkbox" id="checkbox-{_id}" checked />
          </label>
          <button class="delete-button" id="delete-{_id}">
            <span class="icon">
              <i class="fas fa-trash-can"></i>
            </span>
          </button>
          <figure class="image is-96x96">
            <img id="image-{_id}" src="https://ifh.cc/g/o5yDfg.jpg" alt="product-image" />
          </figure>
          <div class="content">
            <p id="title-{_id}">${productsCards[i].product}</p>
            <div class="quantity">
              <button class="button is-rounded" id="minus-{_id}" disabled>
                <span class="icon is-small">
                  <i class="fas fa-thin fa-minus"></i>
                </span>
              </button>
              <input
                class="input"
                id="quantityInput-{_id}"
                type="number"
                min="1"
                max="99"
                value="1"
              />
              <button class="button is-rounded" id="plus-{_id}">
                <span class="icon">
                  <i class="fas fa-lg fa-plus"></i>
                </span>
              </button>
            </div>
          </div>
          <div class="calulation">
            <p id="unitPrice-{_id}">${productsCards[i].price}</p>
            <p>
              <span class="icon">
                <i class="fas fa-thin fa-xmark"></i>
              </span>
            </p>
            <p id="quantity-{_id}">제품 수량</p>
            <p>
              <span class="icon">
                <i class="fas fa-thin fa-equals"></i>
              </span>
            </p>
            <p id="total-{_id}">합산 값</p>
          </div>
        </div>

      `;
    }
    productsCardsElement.innerHTML = resultCards;
  });
}

const dbReq = indexedDB.open('shopping', 1);
let db;

dbReq.addEventListener('success', function (event) {
  db = event.target.result;
  getCartList();
});

dbReq.addEventListener('error', function (event) {
  const error = event.target.error;
  console.log('error', error.name);
});

dbReq.addEventListener('upgradeneeded', function (event) {
  db = event.target.result;
  let oldVersion = event.oldVersion;
  if (oldVersion < 1) {
    db.createObjectStore('order', {
      keyPath: 'id',
      autoIncrement: true,
    });
  }
});
