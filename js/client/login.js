import { Login } from "../../services/client/login.service.js";

function checkAlert(alertTypeId, sessionName) {
  if (sessionStorage.getItem(sessionName)) {
    let alert = document.querySelector("#" + alertTypeId);
    alert.style.display = "flex";

    alert.lastElementChild.innerText = sessionStorage.getItem(sessionName);

    sessionStorage.removeItem(sessionName);

    setInterval(() => {
      document.querySelector("#" + alertTypeId).style.display = "none";
    }, 4000);
  }
}

checkAlert("alert_success", "register_success");
checkAlert("alert_danger", "buy_must_login");
checkAlert("alert_danger", "account_block");

const loginControl = new Login();

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

  loginControl.login(email.value, password.value);
};

document.querySelector("#login-btn").addEventListener("click", loginAction);
