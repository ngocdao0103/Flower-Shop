import { BlogService } from "../../services/client/blog.service.js";

const blogService = new BlogService();

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search_blog");

  // bỏ dấu
  function removeVietnameseTones(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }

  searchInput.addEventListener("input", () => {
    const query = removeVietnameseTones(searchInput.value.trim());
    document.querySelectorAll("#card-blog .col-md-6").forEach((card) => {
      const title = removeVietnameseTones(card.querySelector(".card-title").textContent);

      if (title.includes(query)) {
        card.style.display = ""; 
      } else {
        card.style.display = "none";
      }
    });
  });
});
