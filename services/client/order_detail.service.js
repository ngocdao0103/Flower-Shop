import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export class OrderDetailService {
    orders = [];
    order = {};
    constructor() {
    }
    async getOderByUserId(userId,orderId) {
        try {
            await axios.get(
                apiURL + endpoints.ORDER + `?userId=${userId}`
            ).then((response) => this.orders = response.data
            );
            console.log(this.orders);
            await this.getOrderById(orderId);
        } catch (error) {
            console.error("Error fetching orders by user ID:", error);
            throw error;
        }
    }
    async getOrderById(orderId) {
        try {
            await axios.get(
                apiURL + endpoints.ORDER + `/${orderId}`
            ).then((response) => this.order = response.data
            );
            console.log(this.order);
            this.renderOrderDetails();
        } catch (error) {
            console.error("Error fetching order by ID:", error);
            throw error;
        }
    }
    renderOrderDetails() {
        let order = this.order;
        let html = `
        <!-- Header đơn hàng -->
            <div class="card shadow-sm mb-4 order-header">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start flex-wrap">
                        <div>
                            <h3 class="mb-1 fw-bold">#${order.order_id}</h3>
                            <p class="text-muted mb-0">
                                Đặt ngày: <strong>${new Date(order.order_date).toLocaleString()}</strong>
                            </p>
                        </div>
                        <div class="text-end">
                            <span class="badge badge-${order.status == 'Processing' ? 'processing' : order.status == 'Delivering' ? 'delivering' : order.status == 'Delivered' ? 'delivered' : 'cancelled'} fs-5 px-4 py-2">${order.status == 'Processing' ? 'Đang xử lý' : order.status == 'Delivering' ? 'Đang giao' : order.status == 'Delivered' ? 'Đã giao' : 'Đã hủy'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Thông tin giao hàng -->
            <div class="card shadow-sm mb-4">
                <div class="card-body border-start-primary">
                    <h5 class="fw-bold mb-3"><i class="bi bi-truck text-primary"></i> Thông tin giao hàng</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Người nhận:</strong> ${order.receiver_name}</p>
                            <p class="mb-1"><strong>Số điện thoại:</strong> ${order.receiver_phone}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Địa chỉ:</strong> ${order.receiver_address}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Chi tiết sản phẩm trong đơn hàng
        let itemHtml = ``;
        order.items.forEach(item => {
            itemHtml += `       <tr>
                                    <td width="100">
                                        <img src="${item.image_url}"
                                             alt="Bó Hoa Hồng Đỏ" class="rounded product-img">
                                    </td>
                                    <td>
                                        <h6 class="mb-1 fw-bold">${item.product_name}</h6>
                                        <small class="text-muted">Mã SP: ${item.variant_id}</small>
                                    </td>
                                    <td class="text-center">${item.quantity} × ${item.unit_price.toLocaleString()} ₫</td>
                                    <td class="text-end fw-bold text-danger">${(item.total_price).toLocaleString()} ₫</td>
                                </tr>`
        });
            
        document.getElementById("order-items").innerHTML = itemHtml;
        document.getElementById("order-detail").innerHTML = html;
    }
}