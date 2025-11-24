import { dashboardService, initializeChartTabSwitching} from "../../services/admin/dashboard.service.js";

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


    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
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
            labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
            datasets: [{
                label: "Tổng doanh thu đơn hàng giao thành công",
                data: totalRevenueData,
                backgroundColor: "rgba(35, 158, 10, 0.6)",
                borderRadius: 6
            }]
        }
    });
});