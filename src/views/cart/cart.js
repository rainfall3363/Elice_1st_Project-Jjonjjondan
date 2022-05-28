import {
  getLocalStorageList,
  addLocalStorageList,
  deleteLocalStorageListById,
  deleteLocalStorageList,
} from '/useful-functions.js';

function makeProductsCard(productsCardsElement) {
  return `
    <div class="cart-product-item" id="productItem-${productsCardsElement.id}">
      <label class="checkbox">
        <input type="checkbox" class="cart-checkbox" id="checkbox-${productsCardsElement.id}"/>
      </label>
      <button class="delete-button" id="delete-${productsCardsElement.id}">
        <span class="icon">
          <i class="fas fa-trash-can"></i>
        </span>
      </button>
      <figure class="image is-96x96">
        <img
          id="image-${productsCardsElement.id}"
          src="https://ifh.cc/g/o5yDfg.jpg"
          alt="product-image"
        />
      </figure>
      <div class="content">
        <p id="title-${productsCardsElement.id}">${productsCardsElement.product}</p>
        <div class="quantity">
          <button class="button is-rounded" id="minus-${productsCardsElement.id}" disabled>
            <span class="icon is-small">
              <i class="fas fa-thin fa-minus"></i>
            </span>
          </button>
          <input
            class="input"
            id="quantityInput-${productsCardsElement.id}"
            type="number"
            min="1"
            max="99"
            value="1"
          />
          <button class="button is-rounded" id="plus-${productsCardsElement.id}">
            <span class="icon">
              <i class="fas fa-lg fa-plus"></i>
            </span>
          </button>
        </div>
      </div>
      <div class="calulation">
        <p id="unitPrice-${productsCardsElement.id}">${productsCardsElement.price}</p>
        <p>
          <span class="icon">
            <i class="fas fa-thin fa-xmark"></i>
          </span>
        </p>
        <p id="quantity-${productsCardsElement.id}">제품 수량</p>
        <p>
          <span class="icon">
            <i class="fas fa-thin fa-equals"></i>
          </span>
        </p>
        <p id="total-${productsCardsElement.id}">합산 값</p>
      </div>
    </div>
  `;
}

function renderCartList() {
  let productsCardsElement = document.getElementById('cartList');

  let productsCards = getLocalStorageList('cart');
  let resultCards = productsCards.reduce(
    (acc, element) => acc + makeProductsCard(element),
    ''
  );
  productsCardsElement.innerHTML = resultCards;
}

function allSelectCheckboxEvent() {
  const cartCheckboxElements = document.getElementsByClassName('cart-checkbox');
  const allSelectCheckboxElement = document.getElementById('allSelectCheckbox');

  allSelectCheckboxElement.addEventListener('change', (e) => {
    if (e.currentTarget.checked) {
      for (let element of cartCheckboxElements) {
        element.checked = true;
      }
    } else {
      for (let element of cartCheckboxElements) {
        element.checked = false;
      }
    }
  });
}

function selectCheckBoxEvent() {
  const cartCheckboxElements = document.getElementsByClassName('cart-checkbox');
  Array.from(cartCheckboxElements).forEach((element) =>
    element.addEventListener('change', function (e) {
      let storageId = this.id.split('-')[1];
      if (e.currentTarget.checked) {
        // checkList가 없다면 []로 초기화
        getLocalStorageList('checkList');
        addLocalStorageList('checkList', storageId);
        element.checked = true;
      } else {
        deleteLocalStorageList('checkList', storageId);
        element.checked = false;
      }
    })
  );
}

function deleteButtonsEvent() {
  const deleteButtonElements = document.getElementsByClassName('delete-button');
  Array.from(deleteButtonElements).forEach((element) =>
    element.addEventListener('click', function (e) {
      let storageId = this.id.split('-')[1];
      deleteLocalStorageListById('cart', storageId);
      renderCartMain();
    })
  );
}

function renderCartMain() {
  renderCartList();
  allSelectCheckboxEvent();
  selectCheckBoxEvent();
  deleteButtonsEvent();
}

renderCartMain();
