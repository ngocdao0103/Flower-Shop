import { apiURL } from "../../environments/environment.js";
import {
  endpoints,
  status as STATUS,
} from "../../config/api-endpoint.config.js";
export class User {
  username;
  email;
  phone;
  role;
  users = [];

  constructor() {
    this.List();
  }
  render() {
    let html = ``;
    this.users.forEach((item, index) => {
      html += `
 <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.name}</td>
                                    <td>${item.email}</td>
                                    <td>${
                                      item.role == "admin"
                                        ? "Quản trị viên"
                                        : "Khách hàng"
                                    }</td>
                                    <td><span class="badge ${
                                      item.status == 0
                                        ? "bg-danger"
                                        : "bg-success"
                                    }">${
        item.status == 0 ? "Khóa" : "Hoạt động"
      }</span>
                                      </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1 btn-edit" data-id="${
                                          item.id
                                        }"  data-bs-toggle="modal"
                                            data-bs-target="#editModal">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${
                                          item.id
                                        }">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
    `;
    });
    if (document.getElementById("List")) {
      document.getElementById("List").innerHTML = html;
    }
    $(document).ready(function () {
      $("#user_table").DataTable({
        destroy: true,
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json",
        },
      });
    });
  }

  List() {
    axios
      .get(apiURL + endpoints.USER)
      .then((res) => {
        if (res.status == STATUS.OK) {
          this.users = res.data;
          this.render();
        }
      })
      .catch((err) => console.error(err));
  }

  create(name, password, email, phone, address, role, status) {
    const obj = {
      name: name,
      password: password,
      email: email,
      phone: phone,
      address: address,
      avatar: "",
      birth: "",
      role: role,
      status: status,
    };
    axios
      .post(apiURL + endpoints.USER, obj)
      .then((res) => {
        if (res.status == STATUS.CREATED) {
          sessionStorage.setItem("successMessage", "Tạo người dùng thành công");
          sessionStorage.setItem("classMessage", "success");
          this.users.push(res.data);
          this.render();
        }
      })
      .catch((err) => console.error(err));
  }

  delete(id) {
    axios
      .delete(apiURL + endpoints.USER + `/${id}`)

      .then((res) => {
        if (res.status == STATUS.OK) {
          sessionStorage.setItem("successMessage", "Xóa người dùng thành công");
          sessionStorage.setItem("classMessage", "success");
          this.users = this.users.filter(
            (item) => String(item.id) != String(id)
          );
          this.render();
        }
      })
      .catch((err) => console.error(err));
  }
  edit(name, password, email, phone, address, role, status, id, reason = "") {
    const obj = {
      name: name,
      password: password,
      email: email,
      phone: phone,
      address: address,
      role: role,
      status: status,
    };

    if (status == 0) {
      obj.reason = reason;
    }

    axios
      .put(apiURL + endpoints.USER + `/${id}`, obj)
      .then((res) => {
        if (res.status == STATUS.OK) {
          sessionStorage.setItem("successMessage", "Cập nhật người dùng thành công");
          sessionStorage.setItem("classMessage", "success");
          this.users = this.users.map((item) =>
            String(item.id) == String(id) ? res.data : item
          );
          this.render();
        }
      })
      .catch((err) => console.error(err));
  }
}
