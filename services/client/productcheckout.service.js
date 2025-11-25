import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class ProductCheckoutService {
  products = [];

  async init() {
    axios
      .get(apiURL + endpoints.products)
      .then((res) => {
        if (res.status == status.OK) {
          this.products = res.data;
        }
      })
      .catch((err) => console.error(err));
  }

  getProducts() {
    return this.products;
  }
}
