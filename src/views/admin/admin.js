import { loginUser, logoutUser } from '../useful-functions.js';
import * as Api from '../api.js';

init();

async function init() {
  loginUser();
  logoutUser();
  await checkAdmin();
}

async function checkAdmin() {
  const userInfo = await Api.get('/api/userInfo');
  if (userInfo.role !== 'admin') {
    alert('관리자 전용 페이지 입니다.');
    window.location.href = '/';
  }
}
