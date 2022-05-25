function getCartList() {
  let productsCardsElement = document.getElementsByClassName(
    'cart-products-cards'
  )[0];

  let store = db.transaction('order', 'readonly').objectStore('order');
  let getAllReq = store.getAll();

  getAllReq.addEventListener('success', function (event) {
    let productsCards = event.target.result;

    let resultCards = '';
    for (let i = 0; i < productsCards.length; i++) {
      resultCards += `
                    <div class="card">
                        <div class="container">
                            <h4><b>${productsCards[i].product}</b></h4>
                            <p>${productsCards[i].price}</p>
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
