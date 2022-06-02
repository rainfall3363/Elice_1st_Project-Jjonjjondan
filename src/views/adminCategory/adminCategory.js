import { loginUser, logoutUser, checkAdmin } from '../../useful-functions.js';
import * as Api from '../../api.js';

const categoryModal = document.querySelector('#categoryModal');
const deleteModal = document.querySelector('#deleteModal');

init();

async function init() {
  await checkAdmin();
  loginUser();
  logoutUser();
  await render();
  addAllEvents();
}

async function render() {
  const categoryContainer = document.querySelector('#categoryContainer');
  const categoryList = await Api.get('/api/category/list');
  categoryList.forEach((category) => {
    const html = createCategoryElement(category);
    categoryContainer.insertAdjacentHTML('beforeend', html);
  });
}

function createCategoryElement(category) {
  return `
    <div class="card">
      <div class="card-image">
        <figure class="image is-5by3">
          <img
            src="${category.imageUrl}"
            alt="category image"
          />
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">${category.categoryName}</p>
          </div>
        </div>
        <div class="content">
          <p>${category.description}</p>
          <div>
            <button class="button updateButton is-link is-outlined" data-id="${category._id}">수정</button>
            <button class="button deleteButton is-danger is-outlined" data-id="${category._id}">삭제</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function addAllEvents() {
  const createButton = document.querySelector('#createButton');
  const updateButtonList = document.querySelectorAll('.updateButton');
  const deleteButtonList = document.querySelectorAll('.deleteButton');

  createButton.addEventListener('click', openCategoryModal);
  updateButtonList.forEach((updateButton) => {
    updateButton.addEventListener('click', openCategoryModal);
  });
  deleteButtonList.forEach((deleteButton) => {
    deleteButton.addEventListener('click', openDeleteModal);
  });
}

async function openCategoryModal(event) {
  const saveButton = categoryModal.querySelector('#saveButton');
  const cancelButton = categoryModal.querySelector('#cancelButton');
  const modalBackground = categoryModal.querySelector('.modal-background');
  const categoryName = categoryModal.querySelector('#categoryName');
  const categoryDescription = categoryModal.querySelector(
    '#categoryDescription'
  );

  const categoryId = event.target.dataset['id'];
  if (categoryId) {
    const categoryData = await Api.get('/api/category/info', categoryId);
    categoryName.value = categoryData.categoryName;
    categoryDescription.value = categoryData.description;
    saveButton.dataset['id'] = categoryId;
  } else {
    categoryName.value = '';
    categoryDescription.value = '';
    delete saveButton.dataset['id'];
  }

  saveButton.addEventListener('click', addNewCategory);
  cancelButton.addEventListener('click', closeCategoryModal);
  modalBackground.addEventListener('click', closeCategoryModal);
  categoryModal.classList.add('is-active');
}

async function addNewCategory(event) {
  const categoryName = categoryModal.querySelector('#categoryName').value;
  const categoryDescription = categoryModal.querySelector(
    '#categoryDescription'
  ).value;
  const categoryImage = categoryModal.querySelector('#categoryImage').value;
  const categoryId = event.target.dataset['id'];

  if (categoryName.length === 0) {
    return alert('카테고리 명은 반드시 한 글자 이상이어야 합니다.');
  }

  const data = {
    categoryName,
    description: categoryDescription,
    imageUrl: '/',
  };

  if (!categoryId) {
    try {
      await Api.post('/api/category/register', data);
      alert('새로운 카테고리 생성에 성공하였습니다.');
      window.location.reload();
    } catch (error) {
      alert('새로운 카테고리 생성에 실패하였습니다.' + error);
    }
  } else {
    try {
      await Api.patch('/api/category/update', categoryId, data);
      alert('카테고리 수정에 성공하였습니다.');
      window.location.reload();
    } catch (error) {
      alert('카테고리 수정에 실패하였습니다.' + error);
    }
  }
}

function openDeleteModal(event) {
  const deleteButton = deleteModal.querySelector('#deleteButton');
  const deleteCancelButton = deleteModal.querySelector('#deleteCancelButton');
  const modalBackground = deleteModal.querySelector('.modal-background');
  deleteButton.setAttribute('data-id', event.target.dataset['id']);

  deleteButton.addEventListener('click', deleteCategory);
  deleteCancelButton.addEventListener('click', closeDeleteModal);
  modalBackground.addEventListener('click', closeDeleteModal);
  deleteModal.classList.add('is-active');
}

async function deleteCategory(event) {
  const categoryId = event.target.dataset['id'];
  try {
    const result = await Api.delete('/api/category/delete', categoryId);
    if (result) {
      alert('카테고리 삭제에 성공했습니다.');
      window.location.reload();
    }
  } catch (error) {
    alert(`카테고리 삭제에 실패했습니다. 다시 시도해주세요. ${error}`);
  }
}

function closeCategoryModal() {
  const deleteButton = deleteModal.querySelector('#deleteButton');

  delete deleteButton.dataset['id'];
  categoryModal.classList.remove('is-active');
}

function closeDeleteModal() {
  deleteModal.classList.remove('is-active');
}
