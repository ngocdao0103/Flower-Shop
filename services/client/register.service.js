import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export class Register {
  register(name, email, phone, address, password) {
    axios
      .post(apiURL + endpoints.USER, {
        name: name,
        email: email,
        phone: phone,
        address: address,
        password: password,
        role: "customer",
      })
      .then((response) => {
        console.log(response);
        alert("Đăng kí thành công!");
      })
      .catch((error) => console.error(error));
  }
}
