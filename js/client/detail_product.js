import { DetailProductService } from "../../services/client/detail_product.service.js";

function checkAlert(alertTypeId, sessionName) {
  if (sessionStorage.getItem(sessionName)) {
    let alert = document.querySelector("#" + alertTypeId);
    alert.style.display = "flex";

    alert.lastElementChild.innerText = sessionStorage.getItem(sessionName);

    sessionStorage.removeItem(sessionName);

    setInterval(() => {
      document.querySelector("#" + alertTypeId).style.display = "none";
    }, 4000);
  }
}

checkAlert("alert_success", "add_to_cart");

const detailProductServiceInstance = new DetailProductService();
