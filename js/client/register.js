import { Register } from "../../services/client/register.service.js";
import { User } from "../../services/client/user.service.js";

let userList = [];

const userService = new User();

async function init() {
  await userService.list();
  userList = userService.getUserList();

  const register = new Register();

  const createAction = (event) => {
    event.preventDefault();

    let name = document.querySelector("#name");
    let email = document.querySelector("#email");
    let phone = document.querySelector("#phone");
    let address = document.querySelector("#address");
    let password = document.querySelector("#password");
    let confirmpassword = document.querySelector("#confirmpassword");

    let name_Error = document.querySelector("#name_error");
    let email_Error = document.querySelector("#email_error");
    let phone_Error = document.querySelector("#phone_error");
    let address_Error = document.querySelector("#address_error");
    let password_Error = document.querySelector("#password_error");
    let confirmpassword_Error = document.querySelector("#confirmpassword_error");

    const ERRORTEXT = "Không được để trống";
    const ERRORNUMBER = "Số điện thoại không hợp lệ";

    let isError = false;
    if (
      !name.value ||
      !email.value ||
      !phone.value ||
      !address.value ||
      !password.value ||
      password.value.length < 6 ||
      confirmpassword.value !== password.value
    ) {
      isError = true;
    }

    if (isError) {
      if (!name.value) {
        name_Error.innerHTML = ERRORTEXT;
      } else {
        name_Error.innerHTML = "";
      }

      if (!email.value) {
        email_Error.innerHTML = ERRORTEXT;
      } else {
        email_Error.innerHTML = "";
      }

      if (!phone.value) {
        phone_Error.innerHTML = ERRORTEXT;
      } else if (isValidPhone(phone.value)) {
        phone_Error.innerHTML = ERRORNUMBER;
      } else {
        phone_Error.innerHTML = "";
      }

      if (!address.value) {
        address_Error.innerHTML = ERRORTEXT;
      } else {
        address_Error.innerHTML = "";
      }

      if (!password.value) {
        password_Error.innerHTML = ERRORTEXT;
      } else {
        if (password.value.length < 6)
          password_Error.innerHTML = "Mật khẩu phải từ 6-12 kí tự";
        else password_Error.innerHTML = "";
      }if (!confirmpassword.value) {
        confirmpassword_Error.innerHTML = ERRORTEXT;
      } else {
        if (confirmpassword.value !== password.value)
          confirmpassword_Error.innerHTML = "Mật khẩu không khớp";
        else confirmpassword_Error.innerHTML = "";
      }
    } else {
      let emailDuplicate = userList.find((item) => item.email == email.value);

      if (emailDuplicate) {
        email_Error.innerHTML = "Trùng email";
        console.log(emailDuplicate);
        return;
      }

      register.register(
        name.value,
        email.value,
        phone.value,
        address.value,
        password.value
      );
    }
  };

  const btn = document.querySelector("#register-btn");
  btn.addEventListener("click", createAction);
}

function isValidPhone(phone) {
  const regex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
  return regex.test(phone);
}

init();
