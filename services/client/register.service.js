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
        role: "customer",
        status: "1"
      })
      .then((response) => {
        console.log(response);
        alert("Đăng kí thành công!");
      })
      .catch((error) => console.error(error));
  }
}
