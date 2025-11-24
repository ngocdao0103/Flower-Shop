import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";


export class OrderService {
    orders = [];
    order = [];
    constructor() {}
    async getOrdersByUserId(userId) {
        await axios.get(apiURL + endpoints.ORDER + `?user_id=${userId}`)
            .then((response) => {
                this.orders = response.data;
                this.getStatisticalOrders();
                this.renderOrders();
                console.log("Đơn hàng:", this.orders);
            })
            .catch((error) => console.error("Lỗi lấy đơn hàng:", error));
    }

    getStatisticalOrders() {
        let totalOrders = this.orders.length;
        let processingOrders = this.orders.filter(order => order.status === 'Processing').length;
        let deliveringOrders = this.orders.filter(order => order.status === 'Delivering').length;
        let totalSpent = this.orders.reduce((sum, order) => sum + order.grand_total, 0);
        let html = `
                    <div class="col-md-3 col-6">
                <div class="card border-0 shadow-sm text-center p-4 bg-white rounded-4">
                    <h5 class="text-muted">Tổng đơn hàng</h5>
                    <h3 class="fw-bold text-primary">${totalOrders}</h3>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="card border-0 shadow-sm text-center p-4 bg-white rounded-4">
                    <h5 class="text-muted">Đang xử lý</h5>
                    <h3 class="fw-bold text-warning">${processingOrders}</h3>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="card border-0 shadow-sm text-center p-4 bg-white rounded-4">
                    <h5 class="text-muted">Đang giao</h5>
                    <h3 class="fw-bold text-info">${deliveringOrders}</h3>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="card border-0 shadow-sm text-center p-4 bg-white rounded-4">
                    <h5 class="text-muted">Tổng chi tiêu</h5>
                    <h3 class="fw-bold text-success">${totalSpent.toLocaleString()} ₫</h3>
                </div>
            </div>
        `;
        document.getElementById("statistical").innerHTML = html;
    }
    renderOrders() {
        let processing = '';
        let delivering = '';
        let delivered = '';
        let cancelled = '';
        this.orders.forEach(order => {
            processing += order.status === 'Processing' ? `
                            <div class="row g-4">
                    <!-- Mẫu đơn hàng -->
                    <div class="col-12">
                        <div class="card order-card rounded-4">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 class="card-title mb-1">#${order.order_id}</h5>
                                        <small class="text-muted">Đặt ngày ${new Date(order.order_date).toLocaleDateString()}</small>
                                    </div>
                                    <span class="badge badge-processing fs-6 px-3 py-2">Đang xử lý</span>
                                </div>
                                <div class="row align-items-center">
                                    <div class="col-md-8">
                                        <ul class="list-unstyled mb-0">
                                        ${order.items.slice(0, 2).map(item => `<li>${item.product_name} × ${item.quantity}</li>`).join('')}
                                        ${order.items.length > 2 ? `<li class="text-muted">+ ${order.items.length - 2} sản phẩm khác</li>` : ''}
                                        </ul>
                                    </div>
                                    <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                        <p class="mb-1 fw-bold fs-5 text-danger">1.290.000 ₫</p>
                                        <small class="text-muted">Thanh toán khi nhận hàng</small>
                                    </div>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-end gap-2">
                                    <a class="btn btn-outline-secondary btn-sm" href="order_detail.html?order_id=${order.id}">Xem chi tiết</a>
                                    <button class="btn btn-outline-danger btn-sm">Hủy đơn</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Thêm đơn khác nếu cần -->
                </div>
            ` : ``;
            delivering += order.status === 'Delivering' ? `
                            <div class="row g-4">
                    <div class="col-12">
                        <div class="card order-card rounded-4">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 class="card-title mb-1">#${order.order_id}</h5>
                                        <small class="text-muted">Đặt ngày ${new Date(order.order_date).toLocaleDateString()}</small>
                                    </div>
                                    <span class="badge badge-delivering fs-6 px-3 py-2">Đang giao</span>
                                </div>
                                <p class="mb-2"><strong>Giao đến:</strong> ${order.receiver_address}</p>
                                <p class="mb-2"><strong>Vận chuyển:</strong> Giao hàng tiết kiệm – Mã vận đơn: <span class="text-primary">SPXVN123456789</span></p>
                                <div class="text-end">
                                    <p class="fw-bold fs-5">${order.grand_total.toLocaleString()} ₫</p>
                                    <a class="btn btn-secondary btn-sm" href="order_detail.html?order_id=${order.id}">Xem chi tiết</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ``;
            delivered += order.status === 'Delivered' ? `
            <div class="row g-4">
                    <!-- Mẫu đơn hàng -->
                    <div class="col-12">
                        <div class="card order-card rounded-4">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 class="card-title mb-1">#${order.order_id}</h5>
                                        <small class="text-muted">Đặt ngày ${new Date(order.order_date).toLocaleDateString()}</small>
                                    </div>
                                    <span class="badge badge-delivered fs-6 px-3 py-2">Đã giao</span>
                                </div>
                                <div class="row align-items-center">
                                    <div class="col-md-8">
                                        <ul class="list-unstyled mb-0">
                                        ${order.items.slice(0, 2).map(item => `<li>${item.product_name} × ${item.quantity}</li>`).join('')}
                                        ${order.items.length > 2 ? `<li class="text-muted">+ ${order.items.length - 2} sản phẩm khác</li>` : ''}
                                        </ul>
                                    </div>
                                    <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                        <p class="mb-1 fw-bold fs-5 text-danger">1.290.000 ₫</p>
                                    </div>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-end gap-2">
                                    <a class="btn btn-secondary btn-sm" href="order_detail.html?order_id=${order.id}">Xem chi tiết</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Thêm đơn khác nếu cần -->
                </div>
            ` : ``;
            cancelled += order.status === 'Cancelled' ? `
                            <div class="row g-4">
                    <div class="col-12">
                        <div class="card order-card rounded-4">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 class="card-title mb-1">#${order.order_id}</h5>
                                        <small class="text-muted">Đặt ngày ${new Date(order.order_date).toLocaleDateString()}</small>
                                    </div>
                                    <span class="badge badge-cancelled fs-6 px-3 py-2">Đã hủy</span>
                                </div>
                                <p class="mb-0"><strong>Lý do hủy:</strong> Không thích giao cho bạn nên shop hủy</p>
                                <div class="text-end mt-3">
                                    <p class="fw-bold mb-0">${(order.grand_total).toLocaleString()} ₫ (Đã hoàn tiền)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `: ``;
        })
        if (processing === '') {
            processing = `<p class="text-center text-muted">Không có đơn hàng nào đang xử lý.</p>`;
        }
        if (delivering === '') {
            delivering = `<p class="text-center text-muted">Không có đơn hàng nào đang giao.</p>`;
        }
        if (delivered === '') {
            delivered = `<p class="text-center text-muted">Không có đơn hàng nào đã giao.</p>`;
        }
        if (cancelled === '') {
            cancelled = `<p class="text-center text-muted">Không có đơn hàng nào đã hủy.</p>`;
        }
        document.getElementById("processing").innerHTML = processing;
        document.getElementById("processingQuantity").textContent = this.orders.filter(order => order.status === 'Processing').length;
        document.getElementById("delivering").innerHTML = delivering;
        document.getElementById("deliveringQuantity").textContent = this.orders.filter(order => order.status === 'Delivering').length;
        document.getElementById("delivered").innerHTML = delivered;
        document.getElementById("deliveredQuantity").textContent = this.orders.filter(order => order.status === 'Delivered').length;
        document.getElementById("cancelled").innerHTML = cancelled;
        document.getElementById("cancelledQuantity").textContent = this.orders.filter(order => order.status === 'Cancelled').length;
    }
}