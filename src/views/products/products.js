import * as Api from '/api.js';
import {
  setRegister,
  loginUser,
  logoutUser,
  addCommas,
  changetoAdmin,
} from '/useful-functions.js';

init();

async function init() {
  loginUser();
  logoutUser();
  setRegister();
  changetoAdmin();
  productsData();
}

//query String 값 가져오기
const params = new URLSearchParams(document.location.search);
const categoryName = params.get('categoryName');
//데이터 받아오기
async function productsData() {
  const productSection = document.getElementById('productSection');
  try {
    const data = await Api.get('/api/product/list');
    await data.forEach((elem) => {
      const category = elem.categoryName;
      const title = elem.title;
      const imageURL = elem.image;
      const maker = elem.maker;
      const price = addCommas(Number(elem.price));
      const productId = elem._id;

      if (category === categoryName) {
        productSection.insertAdjacentHTML(
          'beforeend',
          `
    <a href="/productDetail?productId=${productId}">
    <div class="box">
    <div id="product">
      <img src="${imageURL}" id="productImage" alt="">
    </div>
    <div>
      <p class="title">${title}</p>
      <p class="description">${maker}</p>
      <p class="price">${price}원</p>
    </div>
    </div>
    </a>
    `
        );
      }
    });
  } catch (err) {
    console.error(err.stack);
    alert(`상품 정보를 불러오는 데 실패하였습니다.${err.message}`);
  }
}
