import * as Api from '../api.js';

renderUserInfo();

async function renderUserInfo() {
  const user = await Api.get('/api/userInfo');
  addUserInfo(user);
}

function addUserInfo(user) {
  // elements
  const nameInput = document.querySelector('#nameInput');
  const phoneNumberInput = document.querySelector('#phoneNumberInput');
  const postalCode = document.querySelector('#postalCode');
  const address1 = document.querySelector('#address1');
  const address2 = document.querySelector('#address2');

  nameInput.value = user.fullName;
  phoneNumberInput.value = user.phoneNumber;

  const userAddress = user.address;

  if (userAddress) {
    postalCode.value = userAddress.postalCode;
    address1.value = userAddress.address1;
    address2.value = userAddress.address2;
  }
}
