import { BlogService } from "../../services/admin/blog.service.js";

const blogService = new BlogService();

// --- CLOUDINARY CONFIG ---
const CLOUD_NAME = "djbobb5oe";
const UPLOAD_PRESET = "jsnangcao";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// --- DOM ELEMENTS ---
const btnSave = document.getElementById("btn-save-blog");
const previewContainer = document.getElementById("preview-container");
const fileInput = document.getElementById("file-input");
let selectedFile = null;

// --- CHỌN ẢNH ---
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

(function showFlashFromSession() {
  const message = sessionStorage.getItem("delete_blog_success");
  const classMessage = sessionStorage.getItem("classMessage");
  if (!message) return;
  const alertHTML = `
		  <div id="custom-alert" class="alert alert-${
        classMessage || "success"
      } alert-dismissible fade show shadow-lg" 
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
    if (alertBox) {
      alertBox.style.opacity = "1";
      alertBox.style.transform = "translateY(0)";
    }
  }, 100);
  setTimeout(() => {
    if (alertBox) {
      alertBox.style.opacity = "0";
      alertBox.style.transform = "translateY(-20px)";
      setTimeout(() => alertBox && alertBox.remove(), 600);
    }
  }, 3000);
  sessionStorage.removeItem("delete_blog_success");
  sessionStorage.removeItem("classMessage");
})();

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("Vui lòng chọn tệp hình ảnh hợp lệ!");
    return;
  }
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    previewContainer.innerHTML = `
        <div class="position-relative d-inline-block">
            <img src="${reader.result}" class="img-fluid rounded shadow" width="200" height="200">
            <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 remove-image">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>`;
  };
  reader.readAsDataURL(file);
}

previewContainer.addEventListener("click", (e) => {
  if (e.target.closest(".remove-image")) {
    selectedFile = null;
    previewContainer.innerHTML = "";
  }
});

// --- NÚT LƯU ---
btnSave.addEventListener("click", async () => {
  const title = document.getElementById("blog-title").value.trim();
  const content = document.getElementById("blog-content").value.trim();
  const author = document.getElementById("blog-author").value.trim();

  let isValid = true;
  let msg = { title: "", content: "", image: "", author: "" };

  if (!title) {
    msg.title = "Vui lòng nhập tiêu đề!";
    isValid = false;
  }
  if (!content) {
    msg.content = "Vui lòng nhập nội dung!";
    isValid = false;
  }
  if (!selectedFile) {
    msg.image = "Vui lòng chọn ảnh!";
    isValid = false;
  }
  if(!author){
    msg.author = "Vui lòng nhập tác giả!";
    isValid = false;
  }

  document.getElementById("title-error").innerText = msg.title;
  document.getElementById("content-error").innerText = msg.content;
  document.getElementById("image-error").innerText = msg.image;
  document.getElementById("author-error").innerText = msg.author;
  if (!isValid) return;

  let thumbnail_url = "";

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", UPLOAD_PRESET);
    document.querySelector("#loadingOverlay").classList.add("d-flex");
    const res = await axios.post(CLOUDINARY_URL, formData);
    thumbnail_url = res.data.secure_url;
    document.querySelector("#loadingOverlay").classList.remove("d-flex");
  } catch (error) {
    alert("Lỗi upload ảnh!");
    return;
  }

  try {
    document.querySelector("#loadingOverlay").classList.add("d-flex");
    await blogService.createBlog(
      title,
      content,
      thumbnail_url,
      author,
    );
    document.querySelector("#loadingOverlay").classList.remove("d-flex");
    // alert("Thêm blog thành công!");
    location.reload();
  } catch (error) {
    // alert("Lỗi khi thêm blog!");
    console.error(error);
  }
});

// --- Cập nhật blog ---
window.updateBlog = async (id) => {
  const title = document.getElementById(`edit-title-${id}`).value.trim();
  const content = document.getElementById(`edit-content-${id}`).value.trim();
  const author = document.getElementById(`edit-author-${id}`).value.trim();
  const fileInput = document.getElementById(`edit-image-${id}`);
  const previewImg = document.getElementById(`preview-${id}`);

  const titleError = document.getElementById(`edit-title-error-${id}`);
  const contentError = document.getElementById(`edit-content-error-${id}`);
  const authorError = document.getElementById(`edit-author-error-${id}`);
  titleError.innerText = "";
  contentError.innerText = "";
  authorError.innerText = "";
  let isValid = true;
  if (!title){
    titleError.innerText = "Vui lòng nhập tiêu đề!";
    isValid = false;
  }
  if (!content){
    contentError.innerText = "Vui lòng nhập nội dung!";
    isValid = false;
  }
  if (!author){
    authorError.innerText = "Vui lòng nhập tác giả!";
    isValid = false;
  }
  if (!isValid) return;
  let thumbnail_url = previewImg.src;

  if (fileInput.files && fileInput.files[0]) {
    try {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await axios.post(CLOUDINARY_URL, formData);
      thumbnail_url = res.data.secure_url;
    } catch (error) {
      alert("Lỗi khi upload ảnh mới!");
      return;
    }
  }

  try {
    await blogService.updateBlog(
      id,
      title,
      content,
      thumbnail_url,
      author,
    );
    location.reload();
  } catch (error) {
    alert("Lỗi khi cập nhật!");
  }
};

// --- Xóa blog ---
window.deleteBlog = async (id) => {
  try {
    await blogService.deleteBlog(id);
    location.reload();
  } catch (error) {
    alert("Lỗi khi xóa!");
  }
};
