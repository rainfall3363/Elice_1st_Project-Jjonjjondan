import * as Api from '../api.js';
import { loginUser, logoutUser } from '../useful-functions.js';

(() => {
  renderUserInfo();
  loginUser();
  logoutUser();
  // addAllEvents();
})();

function addAllEvents() {}

async function renderUserInfo() {
  const user = await Api.get('/api/userInfo');
  addUserInfo(user);
}

async function addUserInfo(user) {
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
