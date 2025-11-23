import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class User {
  users = [];

  getUserList() {
    return this.users;
  }

  async list() {
    await axios
      .get(apiURL + endpoints.USER)
      .then((res) => {
        if (res.status == status.OK) {
          this.users = res.data;
        }
      })
      .catch((err) => console.error(err));
  }
}
