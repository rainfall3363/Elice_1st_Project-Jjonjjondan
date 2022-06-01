// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from '/api.js';
import {
  setRegister,
  loginUser,
  logoutUser,
  changetoAdmin,
} from '/useful-functions.js';

init();

async function init() {
  loginUser();
  logoutUser();
  setRegister();
  changetoAdmin();
  const data = await categoryData();
  categoryRender(data);
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

function categoryRender(data) {
  data.forEach((elem) => {
    const description = elem.description;
    const imageURL = elem.imageUrl;
    const categoryName = elem.categoryName;
    if (categoryName) {
      const slideContainer = document.getElementById('slideContainer');
      slideContainer.insertAdjacentHTML(
        'beforeend',
        `
          <div class="slideBox">
          <a href="/products?categoryName=${categoryName}" class="slidesAtag">
            <img src="${imageURL}" style="width: 50rem; height: 30rem";>
          </a>
          <p class="brandName">Camping</p>
          <h3 class="categoryName">${categoryName}</h3>
          <p class="categoryDescription">${description}</p>
          </div>
          `
      );
    }
  });

  //이미지 자동 슬라이드
  let autoslideIndex = 0;
  async function autoSlides() {
    let slides = document.getElementsByClassName('slideBox');
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    autoslideIndex++;
    if (autoslideIndex > slides.length) {
      autoslideIndex = 1;
    }

    slides[autoslideIndex - 1].style.display = 'block';
    setTimeout(autoSlides, 10000);
  }
  autoSlides();
}

// //슬라이드 JS
let slideIndex = 1;
// 좌, 우 버튼
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

prevButton.addEventListener('click', (n) => plusSlides(-1));
nextButton.addEventListener('click', (n) => plusSlides(1));

function plusSlides(n) {
  showSlides((slideIndex += n));
}

//좌, 우 버튼 클릭 시 이미지 슬라이드
function showSlides(n) {
  let slides = document.getElementsByClassName('slideBox');
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slides[slideIndex - 1].style.display = 'block';
}
