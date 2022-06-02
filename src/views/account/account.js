import * as Api from '../api.js';
import { loginUser, logoutUser } from '../useful-functions.js';

const userInformation = document.querySelector('#userInformation');

init();

function init() {
  loginUser();
  logoutUser();
  renderUserInfo();
  addAllEvents();
}

function addAllEvents() {
  const deleteButton = document.querySelector('#deleteButton');
  deleteButton.addEventListener('click', deleteUserInfo);
}

async function renderUserInfo() {
  try {
    const user = await Api.get('/api/user/info');
    addUserInfo(user);
  } catch (error) {
    alert('회원 정보를 불러오는 데 실패했습니다. 다시 한번 시도해 주세요.');
    window.location.reload();
  }
}

function addUserInfo(user) {
  const userName = userInformation.querySelector('#userName');
  const userEmail = userInformation.querySelector('#userEmail');
  const userPhoneNumber = userInformation.querySelector('#userPhoneNumber');
  const userAddress = userInformation.querySelector('#userAddress');

  userName.innerText = user.fullName;
  userEmail.innerText = user.email;
  userPhoneNumber.innerText = user.phoneNumber;
  userAddress.innerText = user.address
    ? `${user.address.address1} ${user.address.address2}`
    : '주소 정보가 없습니다.';
}

async function deleteUserInfo() {
  const deleteFlag = confirm(
    '탈퇴시 삭제된 정보는 다시 복구되지 않습니다. 탈퇴 하시겠습니까?'
  );
  if (deleteFlag) {
    try {
      const result = await Api.delete('/api/user/delete');
      alert(`${result.fullName}님의 계정이 탈퇴되었습니다.`);
      sessionStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      alert(
        '회원 탈퇴처리가 정상적으로 진행되지 않았습니다. 다시 시도해주세요.'
      );
    }
  }
}
