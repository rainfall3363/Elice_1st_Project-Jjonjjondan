import * as Api from '/api.js';
import { setRegister } from '/useful-functions.js';
import { logoutUser } from '/useful-functions.js';
import { loginUser } from '/useful-functions.js';
import { addCommas } from '/useful-functions.js';

loginUser();
logoutUser();
setRegister();

//query String 값 가져오기
const params = new URLSearchParams(document.location.search);
const categoryId = params.get('categoryId');
//데이터 받아오기
async function productsData() {
  const productSection = document.getElementById('productSection');
  const data = await Api.get('/api/productlist');
  await data.forEach((elem) => {
    const category = elem.category;
    const title = elem.title;
    const imageURL = elem.image;
    const maker = elem.maker;
    const price = addCommas(Number(elem.price));
    const productId = elem._id;

    if (elem.category === Number(categoryId)) {
      productSection.insertAdjacentHTML(
        'beforeend',
        `
    <a href="/productDetail/?productId=${productId}">
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
}
productsData();
