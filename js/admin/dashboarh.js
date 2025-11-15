import { dashboardService } from "../../services/admin/dashboard.service.js";

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
    const ctx = document.getElementById("revenueChart");

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
});
