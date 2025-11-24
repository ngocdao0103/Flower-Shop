import { OrderService } from "../../services/client/order.service.js";
let userId = sessionStorage.getItem("customer_login");
const orderService = new OrderService();
orderService.getOrdersByUserId(String(userId));