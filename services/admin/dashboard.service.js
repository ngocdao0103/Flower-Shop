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
    }
};
