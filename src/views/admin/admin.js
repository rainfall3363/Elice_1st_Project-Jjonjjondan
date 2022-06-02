import { loginUser, logoutUser, checkAdmin } from '../useful-functions.js';

init();

async function init() {
  loginUser();
  logoutUser();
  await checkAdmin();
}
