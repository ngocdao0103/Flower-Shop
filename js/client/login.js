import { Login } from "../../services/client/login.service.js";

const login = new Login();

const loginAction = (event) => {
  event.preventDefault();

  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  let email_Error = document.querySelector("#email_error");
  let password_Error = document.querySelector("#password_error");
  const ERRORTEXT = "Không được để trống";

  let isError = false;

  if (!email.value || !password.value) {
    isError = true;
  }

  if (isError) {
    email_Error.innerHTML = !email.value ? ERRORTEXT : "";
    password_Error.innerHTML = !password.value ? ERRORTEXT : "";
    return;
  }

  login.login(email.value, password.value);
};

document.querySelector("#login-btn").addEventListener("click", loginAction);
