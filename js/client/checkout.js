import { CartCheckoutService } from "../../services/client/cartcheckout.service.js";
import { ProductCheckoutService } from "../../services/client/productcheckout.service.js";

let productService = new ProductCheckoutService();
let cartService = new CartCheckoutService();
let cartList = [];

if (!sessionStorage.getItem("customer_login")) {
  window.location.href = "http://127.0.0.1:5501";
}

async function init() {
  await productService.init();
  let productList = productService.getProducts();
  await cartService.init();

  let userId = sessionStorage.getItem("customer_login");

  cartList = cartService.getCarts();
  let cartToCheck = cartList.find(
    (cartCheckItem) => cartCheckItem.user_id == userId
  );

  if (cartToCheck.items.length <= 0 || cartToCheck.items == "") {
    window.location.href = "http://127.0.0.1:5501/pages/client/cart.html";
  }

  if (sessionStorage.getItem("customer_login")) {
    document.querySelector("#user_id").value = userId;
  }

  console.log(document.querySelector("#cart_render"));
  document.querySelector("#cart_render").innerHTML = cartService.render(
    userId,
    productList
  );
}

init();
