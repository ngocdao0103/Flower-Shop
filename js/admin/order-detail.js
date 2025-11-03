import { OrderService } from "../../services/admin/order.service.js";
import { OrderDetailService } from "../../services/admin/order-detail.service.js";

const orderDetailService = new OrderDetailService();
const orderService = new OrderService();
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const message = sessionStorage.getItem("updateOrderSuccess");
        if (message) {
          // Tạo alert nhỏ ở góc phải
          const alertHTML = `
      <div id="custom-alert" class="alert alert-success alert-dismissible fade show shadow-lg" 
           role="alert" 
           style="
             position: fixed; 
             top: 40px; 
             right: 20px; 
             width: 300px; 
             z-index: 1050; 
             opacity: 0; 
             transform: translateY(-20px);
             transition: all 0.6s ease;
           ">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
          document.body.insertAdjacentHTML("beforeend", alertHTML);

          const alertBox = document.getElementById("custom-alert");

          // Hiệu ứng trượt vào
          setTimeout(() => {
            alertBox.style.opacity = "1";
            alertBox.style.transform = "translateY(0)";
          }, 100);

          // Tự ẩn sau 3 giây (và trượt ra)
          setTimeout(() => {
            alertBox.style.opacity = "0";
            alertBox.style.transform = "translateY(-20px)";
            setTimeout(() => alertBox.remove(), 600);
          }, 3000);

          // Xóa message để không hiện lại
          sessionStorage.removeItem("updateOrderSuccess");
        }
orderDetailService.getOrderById(orderId);

function updateOrderStatus() {
    let statusSelect = document.getElementById('order-status-select');
    let status = statusSelect.value;
    orderService.updateOrderStatus(orderId, status);
}

window.updateOrderStatus = updateOrderStatus;