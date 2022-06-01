// plus minus 버튼 기능 완성하였고 localStorage에 update되도록 만들 예정입니다.
// 결제정보는 localStorage에 order key를 만들어 object로 저장하여 관리할 예정입니다.
// 백엔드에서 구현한 실제 제품 스키마를 적용하여 데이터를 뿌려줄 예정입니다.
// 이후 주문서 작성 페이지 만들 예정입니다.

import {
  loginUser,
  logoutUser,
  getLocalStorageList,
  addLocalStorageList,
  deleteLocalStorageListById,
  deleteLocalStorageList,
  getLocalStorageListById,
  editQuantityLocalStorageListById,
  addCommas,
  updateOrderSummary,
} from '/useful-functions.js';

function makeProductsCard(productsCardsElement) {
  return `
    <div class="cart-product-item" id="productItem-${productsCardsElement.id}">
      <label class="checkbox">
        <input type="checkbox" class="cart-checkbox" id="checkbox-${
          productsCardsElement.id
        }"/>
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
        <p id="title-${productsCardsElement.id}">${
    productsCardsElement.product
  }</p>
        <div class="quantity">
          <button class="button is-rounded" id="minus-${
            productsCardsElement.id
          }">
            <span class="icon is-small">
              <i class="fas fa-thin fa-minus"></i>
            </span>
          </button>
          <input
            class="quantity input"
            id="quantityInput-${productsCardsElement.id}"
            type="number"
            min="1"
            max="99"
            value=${productsCardsElement.quantity}
            disabled
          />
          <button class="button is-rounded" id="plus-${
            productsCardsElement.id
          }">
            <span class="icon">
              <i class="fas fa-lg fa-plus"></i>
            </span>
          </button>
        </div>
      </div>
      <div class="calulation">
        <p id="unitPrice-${productsCardsElement.id}">${addCommas(
    productsCardsElement.price
  )}원</p>
        <p>
          <span class="icon">
            <i class="fas fa-thin fa-xmark"></i>
          </span>
        </p>
        <p id="quantity-${productsCardsElement.id}">${
    productsCardsElement.quantity
  }개</p>
        <p>
          <span class="icon">
            <i class="fas fa-thin fa-equals"></i>
          </span>
        </p>
        <p id="total-${productsCardsElement.id}">${addCommas(
    productsCardsElement.price * productsCardsElement.quantity
  )}원</p>
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
      for (const element of cartCheckboxElements) {
        let storageId = element.id.split('-')[1];
        getLocalStorageList('checkList');
        addLocalStorageList('checkList', storageId);
        updateOrderSummary();
        element.checked = true;
      }
    } else {
      for (const element of cartCheckboxElements) {
        let storageId = element.id.split('-')[1];
        deleteLocalStorageList('checkList', storageId);
        updateOrderSummary();
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
        updateOrderSummary();
        element.checked = true;
      } else {
        deleteLocalStorageList('checkList', storageId);
        updateOrderSummary();
        element.checked = false;
      }
    })
  );
}

function deletePartEvent() {
  const partialDeleteLabel = document.getElementById('partialDeleteLabel');
  partialDeleteLabel.addEventListener('click', function () {
    let checkList = getLocalStorageList('checkList');
    checkList.forEach((storageId) => {
      deleteLocalStorageListById('cart', storageId);
      deleteLocalStorageList('checkList', storageId);
      renderCartMain();
    });
  });
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

function quantityPlusButtonEvent() {
  const plusMinusButton = document.getElementsByClassName('button is-rounded');

  Array.from(plusMinusButton).forEach((element) => {
    let buttonKind = element.id.split('-')[0];
    let storeId = element.id.split('-')[1];
    if (buttonKind === 'plus') {
      element.addEventListener('click', function () {
        const quantityInput = document.getElementById(
          `quantityInput-${storeId}`
        );
        const minusButton = document.getElementById(`minus-${storeId}`);

        let quantityValue = parseInt(
          getLocalStorageListById('cart', storeId).quantity
        );
        quantityValue++;

        if (quantityValue >= 99) {
          element.disabled = true;
          quantityInput.value = `99`;
          editQuantityLocalStorageListById('cart', storeId, `99`);
          renderCartMain();
        }
        if (quantityValue >= 1 && quantityValue < 99) {
          minusButton.disabled = false;
          quantityInput.value = `${quantityValue}`;
          editQuantityLocalStorageListById('cart', storeId, quantityValue);
          renderCartMain();
        }
      });
    } else {
      element.addEventListener('click', function () {
        const quantityInput = document.getElementById(
          `quantityInput-${storeId}`
        );
        const plusButton = document.getElementById(`plus-${storeId}`);
        let quantityValue = parseInt(
          getLocalStorageListById('cart', storeId).quantity
        );
        quantityValue--;

        if (quantityValue <= 0) {
          element.disabled = true;
          quantityInput.value = `0`;
          editQuantityLocalStorageListById('cart', storeId, `0`);
          renderCartMain();
        }
        if (quantityValue >= 1 && quantityValue < 99) {
          plusButton.disabled = false;
          quantityInput.value = `${quantityValue}`;
          editQuantityLocalStorageListById('cart', storeId, quantityValue);
          renderCartMain();
        }
      });
    }
  });
}

function setDummyData() {
  const dummyData = [
    {
      id: '7',
      quantity: 98,
      product: 'asdfg',
      price: '32456',
    },
    {
      id: '8',
      quantity: 1,
      product: 'asdfgh',
      price: '34567',
    },
    {
      id: '9',
      quantity: 1,
      product: 'sadfgh',
      price: '2345',
    },
    {
      id: '10',
      quantity: 1,
      product: 'asdfgh',
      price: '234567',
    },
  ];
  window.localStorage.setItem('cart', JSON.stringify(dummyData));
}

function renderCartMain() {
  loginUser();
  logoutUser();
  renderCartList();
  allSelectCheckboxEvent();
  selectCheckBoxEvent();
  quantityPlusButtonEvent();
  deletePartEvent();
  deleteButtonsEvent();
}
setDummyData();
renderCartMain();
