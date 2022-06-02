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
}
