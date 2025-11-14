import { Register } from "../../services/client/register.service.js";

const register = new Register();

const createAction = (event) => {
    event.preventDefault();

    let name = document.querySelector("#name");
    let email = document.querySelector("#email");
    let phone = document.querySelector("#phone");
    let address = document.querySelector("#address");
    let password = document.querySelector("#password");

    let name_Error = document.querySelector("#name_error");
    let email_Error = document.querySelector("#email_error");
    let phone_Error = document.querySelector("#phone_error");
    let address_Error = document.querySelector("#address_error");
    let password_Error = document.querySelector("#password_error");

    const ERRORTEXT = "Không được để trống";
    const ERRORNUMBER = "Số điện thoại không hợp lệ"

    let isError = false;
    if (!name.value || !email.value || !phone.value || !address.value || !password.value) {
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
        } else if (phone.value.lenght != 10) {
            phone_Error.innerHTML = ERRORNUMBER;
        }
        else {
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
            password_Error.innerHTML = "";
        }

    } else {
        console.log("Success");
        register.register(name.value, email.value, phone.value, address.value, password.value);
    }
};

const btn = document.querySelector("#register-btn");
btn.addEventListener("click", createAction);

