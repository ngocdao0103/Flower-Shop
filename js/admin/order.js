import { OrderService } from "../../services/admin/order.service.js";

const orderService = new OrderService();
orderService.getOrders();
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
function showAll() {
    let tabAll = document.getElementById('tab-all');
    tabAll.classList.add('active');
    document.getElementById('tab-processing').classList.remove('active');
    document.getElementById('tab-delivering').classList.remove('active');
    document.getElementById('tab-delivered').classList.remove('active');
    document.getElementById('tab-cancelled').classList.remove('active');
    document.getElementById('All').style.display = 'block';
    document.getElementById('Processing').style.display = 'none';
    document.getElementById('Delivering').style.display = 'none';
    document.getElementById('Delivered').style.display = 'none';
    document.getElementById('Cancelled').style.display = 'none';
}
function showProcessing() {
    let tabProcessing = document.getElementById('tab-processing');
    tabProcessing.classList.add('active');
    document.getElementById('tab-all').classList.remove('active');
    document.getElementById('tab-delivering').classList.remove('active');
    document.getElementById('tab-delivered').classList.remove('active');
    document.getElementById('tab-cancelled').classList.remove('active');
    document.getElementById('Processing').style.display = 'block';
    document.getElementById('All').style.display = 'none';
    document.getElementById('Delivering').style.display = 'none';
    document.getElementById('Delivered').style.display = 'none';
    document.getElementById('Cancelled').style.display = 'none';
}
function showDelivering() {
    let tabDelivering = document.getElementById('tab-delivering');
    tabDelivering.classList.add('active');
    document.getElementById('tab-all').classList.remove('active');
    document.getElementById('tab-processing').classList.remove('active');
    document.getElementById('tab-delivered').classList.remove('active');
    document.getElementById('tab-cancelled').classList.remove('active');
    document.getElementById('Delivering').style.display = 'block';
    document.getElementById('All').style.display = 'none';
    document.getElementById('Processing').style.display = 'none';
    document.getElementById('Delivered').style.display = 'none';
    document.getElementById('Cancelled').style.display = 'none';
}
function showDelivered() {
    let tabDelivered = document.getElementById('tab-delivered');
    tabDelivered.classList.add('active');
    document.getElementById('tab-all').classList.remove('active');
    document.getElementById('tab-processing').classList.remove('active');
    document.getElementById('tab-delivering').classList.remove('active');
    document.getElementById('tab-cancelled').classList.remove('active');
    document.getElementById('Delivered').style.display = 'block';
    document.getElementById('All').style.display = 'none';
    document.getElementById('Processing').style.display = 'none';
    document.getElementById('Delivering').style.display = 'none';
    document.getElementById('Cancelled').style.display = 'none';
}
function showCancelled() {
    let tabCancelled = document.getElementById('tab-cancelled');
    tabCancelled.classList.add('active');
    document.getElementById('tab-all').classList.remove('active');
    document.getElementById('tab-processing').classList.remove('active');
    document.getElementById('tab-delivering').classList.remove('active');
    document.getElementById('tab-delivered').classList.remove('active');
    document.getElementById('Cancelled').style.display = 'block';
    document.getElementById('All').style.display = 'none';
    document.getElementById('Processing').style.display = 'none';
    document.getElementById('Delivering').style.display = 'none';
    document.getElementById('Delivered').style.display = 'none';
}
function modalStatus(status, orderId) {
    let statusSelect = document.getElementById('order-status');
    statusSelect.innerHTML = `
      <select class="form-select" aria-label="Default select example">
        <option value="Processing" ${status === 'Processing' ? 'selected' : ''}>Đang xử lý</option>
        <option value="Delivering" ${status === 'Delivering' ? 'selected' : ''}>Đang giao hàng</option>
        <option value="Delivered" ${status === 'Delivered' ? 'selected' : ''}>Đã giao hàng</option>
        <option value="Cancelled" ${status === 'Cancelled' ? 'selected' : ''}>Đã hủy</option>
      </select>
    `;
    let btnUpdate = document.getElementById('btn-update');
    btnUpdate.onclick = function() {
        let selectElement = statusSelect.querySelector('select');
        let selectedStatus = selectElement.value;
        orderService.updateOrderStatus(orderId, selectedStatus);
    };
}

window.modalStatus = modalStatus;
window.showAll = showAll;
window.showProcessing = showProcessing;
window.showDelivering = showDelivering;
window.showDelivered = showDelivered;
window.showCancelled = showCancelled;
