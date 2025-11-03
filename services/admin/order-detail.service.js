import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export class OrderDetailService {
    order = [];
    constructor() {}
    getOrderById(orderId) {
        return axios.get(apiURL + endpoints.ORDER + `/${orderId}`).then((res) => {
            if (res.status === 200) {
                this.order = res.data;
                this.renderOrderDetail(this.order);
            }
        });
    }
    renderOrderDetail(order) {
        let html = `
                <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="fw-semibold mb-3">Thông tin khách hàng</h5>
              <p><strong>Họ tên:</strong> ${order.receiver_name}</p>
              <p><strong>Số điện thoại:</strong> ${order.receiver_phone}</p>
              <p><strong>Địa chỉ:</strong> ${order.receiver_address}</p>
            </div>
            <div class="col-md-6">
              <h5 class="fw-semibold mb-3">Thông tin đơn hàng</h5>
              <p><strong>Mã đơn:</strong> ${order.order_id}</p>
              <p><strong>Ngày đặt:</strong> ${order.order_date}</p>
              <p><strong>Tổng tiền:</strong> <span class="text-danger fw-bold">${order.grand_total.toLocaleString()}đ</span></p>
              <div class="mb-2">
                <label class="form-label fw-semibold">Trạng thái đơn hàng</label>
                <select class="form-select w-auto" id="order-status-select">
                  <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Đang xử lý</option>
                  <option value="Delivering" ${order.status === "Delivering" ? "selected" : ""}>Đang giao</option>
                  <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Hoàn tất</option>
                  <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Đã hủy</option>
                </select>
              </div>
              <button class="btn btn-primary mt-2" id="btn-update-status" onclick="updateOrderStatus()">
                <i class="bi bi-save me-1"></i> Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
        `;
        let itemsHtml = "";
        let totalPrice = 0;
        order.items.forEach((item, index) => {
            totalPrice += item.unit_price * item.quantity;
            itemsHtml += `
                            <tr>
                              <td>${index + 1}</td>
                              <td>${item.product_name}</td>
                              <td><img src="${item.image_url}" width="50" class="rounded"></td>
                              <td>${item.quantity}</td>
                              <td>${item.unit_price.toLocaleString()}đ</td>
                              <td>${(item.unit_price * item.quantity).toLocaleString()}đ</td>
                            </tr>`;
        });
        document.getElementById('total-price').innerText = totalPrice.toLocaleString() + 'đ';
        document.getElementById('shipping-fee').innerText = order.shipping_fee.toLocaleString() + 'đ';
        document.getElementById('grand-total').innerText = order.grand_total.toLocaleString() + 'đ';
        document.getElementById('order-items-body').innerHTML = itemsHtml;
        document.getElementById('order-detail').innerHTML = html;
    }
}
