import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class CartCheckoutService {
  carts = [];

  async init() {
    await axios.get(apiURL + endpoints.CART).then((res) => {
      if (res.status == status.OK) {
        this.carts = res.data;
      }
    });
  }

  getCarts() {
    return this.carts;
  }

  render(userId, productList) {
    let cartCurrent = this.carts.find((item) => item.user_id == userId);

    let html = "";
    let total = 0;

    cartCurrent.items.forEach((itemCart) => {
      let proCurrent = productList.find((pro) => pro.id == itemCart.product_id);

      let proVariantCurrent = proCurrent.variants.find(
        (variant) => variant.variant_id == itemCart.variant_id
      );

      total +=
        (Number(proCurrent.base_price) +
          Number(proVariantCurrent.price_modifier)) *
        itemCart.quantity;

      let cartHTMLItem = `
            <tr>
                <td>${proCurrent.name}</td>
                <td>${itemCart.quantity}</td>
                <td>${this.formatPrice(total) ?? 0}</td>
            </tr>
            `;

      html += cartHTMLItem;
    });

    let totalHTML = `
        <tr class="border-0">
        <td>
            <h6 class="fw-bold">Tổng giỏ hàng:</h6>
        </td>
        <td></td>
        <td>
            ${this.formatPrice(total) ?? 0}
        </td>
    </tr>
    <tr>
        <td>Phương thức thanh toán:</td>
        <td></td>
        <td>Thanh toán online</td>
    </tr>
    <tr>
        <td>Phí vận chuyển:</td>
        <td></td>
        <td>${this.formatPrice(30000)}</td>
    </tr>
    <tr>
        <td>
            <h5 class="fw-bold">Tổng:</h5>
        </td>
        <td></td>
        <td>
            <h5 class="fw-bold text-danger">${
              this.formatPrice(total + 30000) ?? 0
            }</h5>
        </td>
    </tr>
    `;

    document.querySelector("#amount").value = total;

    html += totalHTML;
    return html;
  }

  formatPrice(x) {
    x = x.toLocaleString("vi", { style: "currency", currency: "VND" });
    return x;
  }
}
