import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export class OrderService {
  orders = [];
  order = [];
  constructor() {}
  getOrders() {
    axios.get(apiURL + endpoints.ORDER).then((res) => {
      if (res.status === 200) {
        this.orders = res.data;
        this.renderOrders();
      }
    });
  }
  renderOrders() {
    let htmlAll = "";
    let htmlProcessing = "";
    let htmlDelivered = "";
    let htmlCancelled = "";
    let htmlDelivering = "";
    let statusBadge = "";
    let status = "";
    let sttProcessing = 1;
    let sttDelivering = 1;
    let sttDelivered = 1;
    let sttCancelled = 1;
    this.orders.forEach((order, index) => {
      if (order.status === "Processing") {
        status = `Đang xử lý`;
        statusBadge = `bg-warning`;
      } else if (order.status === "Delivering") {
        status = `Đang giao hàng`;
        statusBadge = `bg-info`;
      } else if (order.status === "Delivered") {
        status = `Đã giao hàng`;
        statusBadge = `bg-success`;
      } else if (order.status === "Cancelled") {
        status = `Đã hủy`;
        statusBadge = `bg-danger`;
      }
      htmlAll += `
                              <tr>
                <td>${index + 1}</td>
                <td>${order.order_id}</td>
                <td>${order.receiver_name}</td>
                <td>${order.order_date}</td>
                <td>${order.grand_total.toLocaleString()}₫</td>
                <td><span class="badge ${statusBadge}">${status}</span>
                <button class="btn btn-sm btn-outline-danger" onclick="modalStatus('${
                  order.status
                }', '${
        order.id
      }')" data-bs-toggle="modal" data-bs-target="#editOrder">
                    <i class="bi bi-pencil-square"></i>
                  </button></td>
                <td>
                  <a href="./order-detail.html?orderId=${order.id}" class="btn btn-sm btn-outline-info me-1">
                    <i class="bi bi-eye"></i>
                  </a>
                </td>
              </tr>
            `;
      if (order.status === "Processing") {
        htmlProcessing += `
                              <tr>
                <td>${sttProcessing++}</td>
                <td>${order.order_id}</td>
                <td>${order.receiver_name}</td>
                <td>${order.order_date}</td>
                <td>${order.grand_total.toLocaleString()}₫</td>
                <td><span class="badge ${statusBadge}">${status}</span>
                                   <button class="btn btn-sm btn-outline-danger" onclick="modalStatus('${
                                     order.status
                                   }', '${
          order.id
        }')" data-bs-toggle="modal" data-bs-target="#editOrder">
                   <i class="bi bi-pencil-square"></i>
                  </button>
                  </td>
                <td>
                  <a href="./order-detail.html?orderId=${order.id}" class="btn btn-sm btn-outline-info me-1">
                    <i class="bi bi-eye"></i>
                    </a>
                </td>
              </tr>
            `;
      } else if (order.status === "Delivered") {
        htmlDelivered += `
                              <tr>
                <td>${sttDelivered++}</td>
                <td>${order.order_id}</td>
                <td>${order.receiver_name}</td>
                <td>${order.order_date}</td>
                <td>${order.grand_total.toLocaleString()}₫</td>
                <td><span class="badge ${statusBadge}">${status}</span>
                                   <button class="btn btn-sm btn-outline-danger" onclick="modalStatus('${
                                     order.status
                                   }', '${
          order.id
        }')" data-bs-toggle="modal" data-bs-target="#editOrder">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  </td>
                <td>
                  <a href="./order-detail.html?orderId=${order.id}" class="btn btn-sm btn-outline-info me-1">
                    <i class="bi bi-eye"></i>
                    </a>
                </td>
              </tr>
            `;
      } else if (order.status === "Cancelled") {
        htmlCancelled += `
                              <tr>
                <td>${sttCancelled++}</td>
                <td>${order.order_id}</td>
                <td>${order.receiver_name}</td>
                <td>${order.order_date}</td>
                <td>${order.grand_total.toLocaleString()}₫</td>
                <td><span class="badge ${statusBadge}">${status}</span>
                                   <button class="btn btn-sm btn-outline-danger" onclick="modalStatus('${
                                     order.status
                                   }', '${
          order.id
        }')" data-bs-toggle="modal" data-bs-target="#editOrder">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  </td>
                <td>
                  <a href="./order-detail.html?orderId=${order.id}" class="btn btn-sm btn-outline-info me-1">
                    <i class="bi bi-eye"></i>
                    </a>
                </td>
              </tr>
            `;
      } else if (order.status === "Delivering") {
        htmlDelivering += `
                              <tr>
                <td>${sttDelivering++}</td>
                <td>${order.order_id}</td>
                <td>${order.receiver_name}</td>
                <td>${order.order_date}</td>
                <td>${order.grand_total.toLocaleString()}₫</td>
                <td><span class="badge ${statusBadge}">${status}</span>
                                   <button class="btn btn-sm btn-outline-danger" onclick="modalStatus('${
                                     order.status
                                   }', '${
          order.id
        }')" data-bs-toggle="modal" data-bs-target="#editOrder">
                   <i class="bi bi-pencil-square"></i>
                  </button>
                  </td>
                <td>
                  <a href="./order-detail.html?orderId=${order.id}" class="btn btn-sm btn-outline-info me-1">
                    <i class="bi bi-eye"></i>
                    </a>
                </td>
              </tr>
            `;
      }
    });
    document.getElementById("order-table-body-all").innerHTML = htmlAll;
    document.getElementById("order-table-body-processing").innerHTML =
      htmlProcessing;
    document.getElementById("order-table-body-delivered").innerHTML =
      htmlDelivered;
    document.getElementById("order-table-body-cancelled").innerHTML =
      htmlCancelled;
    document.getElementById("order-table-body-delivering").innerHTML =
      htmlDelivering;
    $(document).ready(function () {
      $("#order-table-all").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json",
        },
      });
      $("#order-table-processing").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json",
        },
      });
      $("#order-table-delivered").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json",
        },
      });
      $("#order-table-cancelled").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json",
        },
      });
      $("#order-table-delivering").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json",
        },
      });
    });
  }
  updateOrderStatus(orderId, status) {
    axios.get(apiURL + endpoints.ORDER + `/${orderId}`).then((res) => {
      if (res.status === 200) {
        this.order = res.data;
        console.log(this.order);
        axios
          .put(apiURL + endpoints.ORDER + `/${orderId}`, {
            ...this.order,
            status: status,
          })
          .then((res) => {
            if (res.status === 200) {
              sessionStorage.setItem("updateOrderSuccess", "Cập nhật trạng thái đơn hàng thành công");
              location.reload();
            }
          })
          .catch((error) => {
            console.error("Error updating order status:", error);
            alert("Cập nhật trạng thái đơn hàng thất bại. Vui lòng thử lại.");
          });
      }
    });
  }
}
