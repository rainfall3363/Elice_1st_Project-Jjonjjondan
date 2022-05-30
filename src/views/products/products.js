import * as Api from '/api.js';
import { setRegister } from '/useful-functions.js';
import { logoutUser } from '/useful-functions.js';
import { loginUser } from '/useful-functions.js';
import { addCommas } from '/useful-functions.js';

loginUser();
logoutUser();
setRegister();

//query String value값 선언
const [_, query] = location.href.split('?');
const [queryKey, queryValue] = query.split('=');
//데이터 받아오기
async function productsdata() {
  const productSection = document.getElementById('productSection');
  const data = await Api.get('/api/productlist');
  const productLists = await data.forEach((elem) => {
    const category = elem.category;
    const title = elem.title;
    const imageURL = elem.image;
    const maker = elem.maker;
    const price = addCommas(Number(elem.price));
    const productId = elem._id;
    if (elem.category === queryValue) {
      productSection.insertAdjacentHTML(
        'beforeend',
        `
    <a href="/products/?categoryId=${category}&productId=${productId}">
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
productsdata();
