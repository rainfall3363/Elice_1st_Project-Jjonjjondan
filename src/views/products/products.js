import * as Api from '/api.js';
import {
  setRegister,
  loginUser,
  logoutUser,
  addCommas,
  changetoAdmin,
} from '/useful-functions.js';

//query String 값 가져오기
const params = new URLSearchParams(document.location.search);
const paramsCategoryName = params.get('categoryName');
const paramsProductName = params.get('searchWord');

init();

async function init() {
  loginUser();
  logoutUser();
  setRegister();
  changetoAdmin();
  productsData();
  const data = await categoryData();
  categorymenuRender(data);
  addEvent();
}

async function categoryData() {
  try {
    const data = await Api.get('/api/category/list');
    return data;
  } catch (err) {
    console.error(err.stack);
    alert(`카테고리 정보를 불러오는 데 실패하였습니다.${err.message}`);
  }
}

//카테고리 메뉴바 렌더링
function categorymenuRender(data) {
  data.forEach((elem) => {
    const categoryName = elem.categoryName;
    if (categoryName) {
      const navContainer = document.getElementById('navContainer');
      navContainer.insertAdjacentHTML(
        'beforeend',
        `
        <a class="navbar-item" href="/products?categoryName=${categoryName}">${categoryName}
        </a>
          `
      );
    }
    if (paramsCategoryName === categoryName) {
      const changecategoryname = document.getElementById('changecategoryname');
      changecategoryname.innerText = `${categoryName}`;
    }
  });
}

//데이터 받아오기
async function productsData() {
  const productSection = document.getElementById('productSection');
  let data;

  try {
    if (paramsProductName) {
      const searchInput = document.querySelector('#searchInput');
      searchInput.value = paramsProductName;

      data = await Api.get(
        '/api/product/search',
        `?searchWord=${paramsProductName}`
      );
    } else {
      data = await Api.get('/api/product/list');
    }

    await data.forEach((elem) => {
      const category = elem.categoryName;
      const title = elem.title;
      const imageURL = elem.image;
      const maker = elem.maker;
      const price = addCommas(Number(elem.price));
      const productId = elem._id;
      if (category === paramsCategoryName) {
        productSection.insertAdjacentHTML(
          'beforeend',
          `
          <div class="box">
          <a href="/productDetail?productId=${productId}">
          <div class="product">
          <img src="${imageURL}" id="productImage" alt="">
          </div>
          <div class="product">
          <p class="description">${maker}</p>
        </div>
        <div class="product">
          <p class="title">${title}</p>
        </div>
        <div class="product">
        <p class="price is-font-orange">${price}원</p>
        </div>
        </a>
    </div>
    
    `
        );
      }
      if (paramsCategoryName === null) {
        productSection.insertAdjacentHTML(
          'beforeend',
          `
  <div class="box">
    <a href="/productDetail?productId=${productId}">
    <div class="product">
    <img src="${imageURL}" id="productImage" alt="">
      </div>
      <div class="product">
       <p class="description">${maker}</p>
       </div>
      <div class="product">
        <p class="title">${title}</p>
      </div>
      <div class="product">
        <p class="price is-font-orange">${price}원</p>
      </div>
    </a>
  </div>`
        );
      }
    });
  } catch (err) {
    console.error(err.stack);
    alert(`상품 정보를 불러오는 데 실패하였습니다.${err.message}`);
  }
}

function addEvent() {
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('#searchInput');

  searchButton.addEventListener('click', searchResult);
  searchInput.addEventListener('keyup', searchResult);
}

function searchResult(event) {
  const searchInput = document.querySelector('#searchInput');
  const productName = searchInput.value;

  if (event.key === 'Enter') {
    if (productName.length < 2) {
      alert('검색어를 2글자 이상 입력해주세요.');
    } else {
      window.location.href = `/products/?searchWord=${productName}`;
    }
  }
}
