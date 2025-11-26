import { Home } from "../../services/client/home.service.js";

// Alert Function
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

checkAlert("alert_success", "successClientLoginMessage");
checkAlert("alert_success", "successClientLogoutMessage");

const home = new Home();
// sản phẩm nổi bật
home.ListFuture();
// bài viết mới nhất
home.ListBlog();
