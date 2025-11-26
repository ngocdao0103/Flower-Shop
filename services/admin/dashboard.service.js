import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export const dashboardService = {
    async getOrders() {
        return fetch(apiURL + endpoints.ORDER)
            .then(res => res.json());
    },

    async getDeliveredOrdersByMonth() {
        const orders = await this.getOrders();
        const result = Array(12).fill(0);

        orders.forEach(order => {
            if (order.status === "Delivered") {
                const month = new Date(order.order_date).getMonth();
                result[month] += 1;
            }
        });

        return result;
    },

    async getTotalRevenueByMonth() {
        const orders = await this.getOrders();
        const result = Array(12).fill(0);

        orders.forEach(order => {
            if (order.status === "Delivered"&&order.grand_total) {
                const month = new Date(order.order_date).getMonth();
                result[month] += order.grand_total;
            }
        });

        return result;
    },

    async getUsers() {
        return fetch(apiURL + endpoints.USER)
            .then(res => res.json());
    },

    async getProducts() {
        return fetch(apiURL + endpoints.PRODUCT)
            .then(res => res.json());
    },

    async getCategories() {
        return fetch(apiURL + endpoints.CATEGORY)
            .then(res => res.json());
    },

    async countUsers() {
        const data = await this.getUsers();
        return data.length;
    },

    async countOrders() {
        const data = await this.getOrders();
        return data.length;
    },

    async countProducts() {
        const data = await this.getProducts();
        return data.length;
    },

    async countCategories() {
        const data = await this.getCategories();
        return data.length;
    },

    async filterOrdersByDate(start, end) {
    const orders = await this.getOrders();
    const result = {};

    const startDate = new Date(start);
    const endDate = new Date(end);

    orders.forEach(order => {
        if (order.status === "Delivered") {
            const date = new Date(order.order_date);
            if (date >= startDate && date <= endDate) {
                const key = date.toISOString().split("T")[0];
                if (!result[key]) result[key] = 0;

                result[key] += 1;
            }
        }
    });

    return result; 
}

};



export function initializeChartTabSwitching() {
  const tabs = document.querySelectorAll('.nav-pills .nav-link');
  const chartContainers = document.querySelectorAll('.chart-container');

  tabs.forEach(tab => {
    tab.addEventListener('click', function(event) {
      event.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const targetChart = this.getAttribute('data-chart');
      chartContainers.forEach(container => {
        if (container.getAttribute('data-chart') === targetChart) {
          container.classList.remove('d-none');
        } else {
          container.classList.add('d-none');
          const canvas = container.querySelector('canvas');
          if (canvas && canvas.chartInstance) {
            canvas.chartInstance.destroy();
            canvas.chartInstance = null;
          }
        }
      });
    });
  });
}



