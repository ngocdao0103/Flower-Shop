import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class CartCheckoutService {
  carts = [];

  async init() {
    await axios.get(apiURL + endpoints.CART).then((res) => {
      if (res.status == status.OK) {
        this.carts = res.data;
        console.log(this.carts);
        // this.render();
      }
    });
  }

  render(userId, productList) {
    let cartCurrent = this.carts.find((item) => item.user_id == userId);

    cartCurrent.items.forEach((itemCart) => {
      //   let proCurrent = productList.find((pro) => pro.id == itemCart.product_id);
      //   let proVariantCurrent = proCurrent.variants.find(
      //     (variant) => variant.variant_id == itemCart.variant_id
      //   );

      console.log(itemCart);
      return;
      let cartHTMLItem = `
            <tr>
                <td>Hoa hồng đỏ</td>
                <td>x2</td>
                <td>100.000.000.000đ</td>
            </tr>
            `;
    });

    let html = `
    <tr>
        <td>Hoa hồng đỏ</td>
        <td>x2</td>
        <td>100.000.000.000đ</td>
    </tr>
    <tr>
        <td>Hoa Tulip</td>
        <td>x3</td>
        <td>100.000.000.000đ</td>
    </tr>
    <tr>
        <td>Hoa hồng trắng</td>
        <td>x4</td>
        <td>100.000.000.000đ</td>
    </tr>
    <tr class="border-0">
        <td>
            <h6 class="fw-bold">Tổng giỏ hàng:</h6>
        </td>
        <td></td>
        <td>
            100.000.000.000đ
        </td>
    </tr>
    <tr>
        <td>Phương thức thanh toán:</td>
        <td></td>
        <td>Thanh toán online (Ví dụ)</td>
    </tr>
    <tr>
        <td>Phí vận chuyển:</td>
        <td></td>
        <td>35.000đ</td>
    </tr>
    <tr>
        <td>
            <h5 class="fw-bold">Phí vận chuyển:</h5>
        </td>
        <td></td>
        <td>
            <h5 class="fw-bold text-danger">100.000.035.000đ</h5>
        </td>
    </tr>
    `;
  }
}
