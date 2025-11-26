function showAlert(message, className = "success") {
  const alertHTML = `
    <div id="custom-alert" class="alert alert-${className} alert-dismissible fade show shadow-lg" 
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
  setTimeout(() => {
    alertBox.style.opacity = "1";
    alertBox.style.transform = "translateY(0)";
  }, 100);

  setTimeout(() => {
    alertBox.style.opacity = "0";
    alertBox.style.transform = "translateY(-20px)";
    setTimeout(() => alertBox.remove(), 600);
  }, 3000);
}

import {
  dashboardService,
  initializeChartTabSwitching,
} from "../../services/admin/dashboard.service.js";
import { dashboardService, initializeChartTabSwitching } from "../../services/admin/dashboard.service.js";
const message = sessionStorage.getItem("successMessage");
const classMessage = sessionStorage.getItem("classMessage");
if (message) {
    // Tạo alert nhỏ ở góc phải
    const alertHTML = `
      <div id="custom-alert" class="alert alert-${classMessage} alert-dismissible fade show shadow-lg" 
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
    sessionStorage.removeItem("successMessage");
    sessionStorage.removeItem("classMessage");
}
document.addEventListener("DOMContentLoaded", () => {
  initializeChartTabSwitching();
});

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("countUsers").innerText =
    await dashboardService.countUsers();

  document.getElementById("countOrders").innerText =
    await dashboardService.countOrders();

  document.getElementById("countProducts").innerText =
    await dashboardService.countProducts();

  document.getElementById("countCategories").innerText =
    await dashboardService.countCategories();
  // <--đếm-->
  const deliveredData = await dashboardService.getDeliveredOrdersByMonth();
  const totalRevenueData = await dashboardService.getTotalRevenueByMonth();
  const ctx = document.getElementById("revenueChart");
  const ctx2 = document.getElementById("totalRevenueChart");

<<<<<<< HEAD
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ],
      datasets: [
        {
          label: "Đơn giao thành công",
          data: deliveredData,
          backgroundColor: "rgba(54,162,235,0.6)",
          borderRadius: 6,
        },
      ],
    },
  });
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ],
      datasets: [
        {
          label: "Tổng doanh thu đơn hàng giao thành công",
          data: totalRevenueData,
          backgroundColor: "rgba(35, 158, 10, 0.6)",
          borderRadius: 6,
        },
      ],
    },
  });
  document
    .getElementById("filterDateBtn")
    .addEventListener("click", async () => {
      const start = document.getElementById("startDate").value;
      const end = document.getElementById("endDate").value;
=======
    document.getElementById("countCategories").innerText =
        await dashboardService.countCategories();
    // <--đếm-->
    const deliveredData = await dashboardService.getDeliveredOrdersByMonth();
    const totalRevenueData = await dashboardService.getTotalRevenueByMonth();
    const ctx = document.getElementById("revenueChart");
    const ctx2 = document.getElementById("totalRevenueChart");
>>>>>>> 61a152f ([JS_Client]_ Thêm thông báo đăng nhập thành công cho admin)

      if (!start || !end) {
        showAlert("Vui lòng nhập ngày", "danger");
        return;
      }

      const data = await dashboardService.filterOrdersByDate(start, end);

      const labels = Object.keys(data);
      const values = Object.values(data);

      const ctxFiltered = document.getElementById("filteredChart");
      const filteredContainer = document.querySelector(
        '[data-chart="dayFilter"]'
      );
      const orderContainer = document.querySelector("order-chart-container");

      if (orderContainer) {
        orderContainer.classList.add("d-none");
      }
      if (filteredContainer) {
        filteredContainer.classList.remove("d-none");
      }
      // xóa chart cũ neus có
      if (window.filteredChartInstance) {
        window.filteredChartInstance.destroy();
      }

      window.filteredChartInstance = new Chart(ctxFiltered, {
        type: "bar",
        data: {
<<<<<<< HEAD
          labels: labels,
          datasets: [
            {
              label: "Đơn hàng giao thành công theo ngày",
              data: values,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderRadius: 6,
            },
          ],
        },
        // options: {
        //   scales: {
        //     x: {
        //       ticks: { maxRotation: 90, minRotation: 45 },
        //       stacked: false,
        //     },
        //   },
        //   responsive: true,
        //   maintainAspectRatio: false,
        // },
      });
      ctxFiltered.chartInstance = window.filteredChartInstance;
    });
  // xóa
  function resetFilter() {
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";

    const filteredContainer = document.querySelector(
      '[data-chart="dayFilter"]'
    );
    const orderContainer = document.getElementById("order-chart-container");

    if (window.filteredChartInstance) {
      window.filteredChartInstance.destroy();
      window.filteredChartInstance = null;
    }
    if (filteredContainer) {
      filteredContainer.classList.add("d-none");
    }
    if (orderContainer) {
      orderContainer.classList.remove("d-none");
    }
  }
  document.getElementById("cancel").addEventListener("click", resetFilter);

  document.getElementById("total_tab").addEventListener("click", () => {
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
  });

  document.getElementById("order_tab").addEventListener("click", resetFilter);
});
=======
            labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
            datasets: [{
                label: "Đơn giao thành công",
                data: deliveredData,
                backgroundColor: "rgba(54,162,235,0.6)",
                borderRadius: 6
            }]
        }
    });
    new Chart(ctx2, {
        type: "bar",
        data: {
            labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
            datasets: [{
                label: "Tổng doanh thu đơn hàng giao thành công",
                data: totalRevenueData,
                backgroundColor: "rgba(35, 158, 10, 0.6)",
                borderRadius: 6
            }]
        }
    });
});
>>>>>>> 61a152f ([JS_Client]_ Thêm thông báo đăng nhập thành công cho admin)
