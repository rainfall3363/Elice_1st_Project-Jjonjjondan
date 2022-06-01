import * as Api from '../api.js';
import { loginUser, logoutUser } from '../useful-functions.js';

const deleteButton = document.querySelector('#deleteButton');

(() => {
  renderUserInfo();
  loginUser();
  logoutUser();
  addAllEvents();
})();

function addAllEvents() {
  deleteButton.addEventListener('click', deleteUserInfo);
}

async function renderUserInfo() {
  const user = await Api.get('/api/user/info');
  addUserInfo(user);
}

function addUserInfo(user) {
  const userName = document.querySelector('#userName');
  const userEmail = document.querySelector('#userEmail');
  const userPhoneNumber = document.querySelector('#userPhoneNumber');
  const userAddress = document.querySelector('#userAddress');

  userName.innerText = user.fullName;
  userEmail.innerText = user.email;
  userPhoneNumber.innerText = user.phoneNumber;
  userAddress.innerText = user.address
    ? `${user.address.address1} ${user.address.address2}`
    : '주소 정보가 없습니다.';
}

async function deleteUserInfo() {
  try {
    const result = await Api.delete('/api/user/delete');
    alert(`${result.fullName}님의 계정이 탈퇴되었습니다.`);
    sessionStorage.removeItem('token');
    window.location.href = '/';
  } catch (err) {
    alert('회원 탈퇴처리가 정상적으로 진행되지 않았습니다. 다시 시도해주세요.');
  }
}
