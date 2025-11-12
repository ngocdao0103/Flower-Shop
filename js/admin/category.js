import { CategoryService } from "../../services/admin/category.service.js";

const categoryService = new CategoryService();
const message = sessionStorage.getItem("successMessage");
const classMessage = sessionStorage.getItem("classMessage");
if (message) {
    // Tạo alert nhỏ ở góc phải
    const alertHTML = `
      <div id="custom-alert" class="alert alert-${classMessage} alert-dismissible fade show shadow-lg" 
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

    // Hiệu ứng trượt vào
    setTimeout(() => {
        alertBox.style.opacity = "1";
        alertBox.style.transform = "translateY(0)";
    }, 100);

    // Tự ẩn sau 3 giây (và trượt ra)
    setTimeout(() => {
        alertBox.style.opacity = "0";
        alertBox.style.transform = "translateY(-20px)";
        setTimeout(() => alertBox.remove(), 600);
    }, 3000);

    // Xóa message để không hiện lại
    sessionStorage.removeItem("successMessage");
    sessionStorage.removeItem("classMessage");
}
// --- CLOUDINARY CONFIG ---
const CLOUD_NAME = "djbobb5oe";
const UPLOAD_PRESET = "jsnangcao";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// --- DOM ELEMENTS ---
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const previewContainer = document.getElementById("preview-container");
const btnSave = document.getElementById("btn-save-category");

// --- FILE STATE ---
let selectedFile = null;

// --- CHỌN HOẶC KÉO THẢ ẢNH ---
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
    });
});

dropZone.addEventListener("dragover", () => dropZone.classList.add("border-primary"));
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("border-primary"));
dropZone.addEventListener("drop", e => {
    dropZone.classList.remove("border-primary");
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    handleFile(file);
});

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

// --- XÓA ẢNH ---
previewContainer.addEventListener("click", e => {
    if (e.target.closest(".remove-image")) {
        selectedFile = null;
        previewContainer.innerHTML = "";
    }
});

// --- NÚT LƯU ---
btnSave.addEventListener("click", async () => {
    const name = document.getElementById("category-name").value.trim();
    const description = document.getElementById("category-description").value.trim();
    const image = document.getElementById("file-input").value.trim();

    let isValid = true;
    let message_name = "";
    let message_img = "";
    let message_description = "";
    categoryService.categories.forEach(category => {
        if (name === category.name) {
            message_name = "Tên danh mục đã tồn tại!";
            isValid = false;
        }
    });
    if (!name.trim()) {
        message_name = "Vui lòng nhập tên danh mục!";
        isValid = false;
    } else if (name.trim().length < 3) {
        message_name = "Tên danh mục phải có ít nhất 3 ký tự!";
        isValid = false;
    }
    if (!image) {
        message_img = "Vui lòng chọn hình ảnh!";
        isValid = false;
    }
    if (!description.trim()) {
        message_description = "Vui lòng nhập mô tả!";
        isValid = false;
    }
    document.getElementById('name-error').innerText = message_name;
    document.getElementById('image-error').innerText = message_img;
    document.getElementById('description-error').innerText = message_description;

    if (!isValid) return;

    let image_url = "";

    try {
        // Upload ảnh lên Cloudinary
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "Js_nang_cao");

        const res = await axios.post(CLOUDINARY_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        image_url = res.data.secure_url;
        console.log("Ảnh upload thành công:", image_url);

    } catch (error) {
        console.error("❌ Lỗi khi tải ảnh:", error.response?.data || error);
        alert("Không thể tải ảnh lên Cloudinary. Vui lòng thử lại!");
        return; // Dừng lại, không chạy tiếp
    }

    try {
        // Gọi API tạo danh mục
        await categoryService.createCategory(name, description, image_url, 0);
        location.reload();
        bootstrap.Modal.getInstance(document.getElementById("addCategory")).hide();

        // Reset form
        document.getElementById("category-name").value = "";
        document.getElementById("category-description").value = "";
        previewContainer.innerHTML = "";
        selectedFile = null;

    } catch (error) {
        console.error("❌ Lỗi khi lưu danh mục:", error.response?.data || error);
        alert("Không thể lưu danh mục. Vui lòng thử lại!");
    }
});

// Update Category
window.previewNewImage = (event, id) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById(`preview-${id}`).src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// --- Cập nhật danh mục ---
window.updateCategory = async (id) => {
    const name = document.getElementById(`edit-name-${id}`).value.trim();
    const description = document.getElementById(`edit-description-${id}`).value.trim();
    const fileInput = document.getElementById(`edit-image-${id}`);
    const statusCategory = parseInt(document.getElementById(`edit-status-${id}`).value);
    const previewImg = document.getElementById(`preview-${id}`);

    let image_url = previewImg.src; // Ảnh cũ mặc định

    // Nếu có chọn ảnh mới thì upload lên Cloudinary
    if (fileInput.files && fileInput.files[0]) {
        try {
            const formData = new FormData();
            formData.append("file", fileInput.files[0]);
            formData.append("upload_preset", UPLOAD_PRESET);
            const res = await axios.post(CLOUDINARY_URL, formData);
            image_url = res.data.secure_url;
        } catch (error) {
            alert("❌ Lỗi khi tải ảnh mới lên Cloudinary!");
            console.error(error);
            return;
        }
    }

    try {
        await categoryService.updateCategory(id, name, description, image_url, statusCategory);
        location.reload();
    } catch (error) {
        alert("❌ Lỗi khi cập nhật danh mục!");
        console.error(error);
    }
};

function deleteCategory(id) {
    categoryService.deleteCategory(id);
}
window.deleteCategory = deleteCategory;


