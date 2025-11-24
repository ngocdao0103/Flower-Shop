import { OrderDetailService } from "../../services/client/order_detail.service.js";

let userId = sessionStorage.getItem("customer_login");
const orderDetailService = new OrderDetailService();
let order_id = new URLSearchParams(window.location.search).get("order_id");
if( order_id ){
    orderDetailService.getOderByUserId(String(userId),order_id)
}
