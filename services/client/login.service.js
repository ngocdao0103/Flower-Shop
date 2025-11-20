import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class Login {
  user = [];

  login(email, password) {
    axios
      .get(apiURL + endpoints.USER)
      .then((response) => {
        if (response.status == status.OK) {
          this.user = response.data;

          let foundUser = this.user.find(
            (u) => u.email == email && u.password == password
          );

          if (foundUser) {
            if (foundUser.role == "admin") {
              sessionStorage.setItem("admin_login", foundUser.id);
              sessionStorage.setItem("customer_login", foundUser.id);
              sessionStorage.setItem("fullname_login", foundUser.name);
              alert("Đăng nhập thành công!");
              window.location.href =
                "../../pages/admin/dashboard/dashboard.html";
              return;
            }

            if (foundUser.role == "customer") {
              sessionStorage.setItem("customer_login", foundUser.id);
              sessionStorage.setItem("fullname_login", foundUser.name);
              alert("Đăng nhập thành công!");
              window.location.href = "../../index.html";
              return;
            }
          } else {
            alert("Sai email hoặc sai mật khẩu!");
          }
        }
      })
      .catch((error) => alert("Lỗi đăng nhập:", error));
  }
}
