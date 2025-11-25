import { CartCheckoutService } from "../../services/client/cartcheckout.service.js";
import { ProductCheckoutService } from "../../services/client/productcheckout.service.js";

let productService = new ProductCheckoutService();
let cartService = new CartCheckoutService();
let productList = [];

async function init() {
  await productService.init();
  productList = productService.getProducts();
  await cartService.init();

  let userId = sessionStorage.getItem("customer_login");

  if (sessionStorage.getItem("customer_login")) {
    document.querySelector("#user_id").value = userId;
  }

  cartService.render(userId, productList);
}

init();
