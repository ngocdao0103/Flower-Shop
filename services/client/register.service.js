import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class Register {
  register(name, email, phone, address, password) {
    axios
      .post(apiURL + endpoints.USER, {
        name: name,
        email: email,
        phone: phone,
        address: address,
        password: password,
        avatar: "",
        birth: "",
        role: "customer",
        status: "1",
      })
      .then((response) => {
        if (response.status == status.CREATED) {
          sessionStorage.setItem("register_success", "Đăng ký thành công");
          window.location.href = "/pages/client/login.html";
        } else {
          alert("Lỗi hệ thống");
        }
      })
      .catch((error) => console.error(error));
  }
}
