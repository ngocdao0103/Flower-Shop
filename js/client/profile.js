import { ProfileService } from "../../services/client/profile.service.js";
document.addEventListener("DOMContentLoaded", function () {
  const message = sessionStorage.getItem("message");
  if (message) {
    // Tạo alert nhỏ ở góc phải
    const alertHTML = `
      <div id="custom-alert" class="alert alert-success alert-dismissible fade show shadow-lg" 
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
    sessionStorage.removeItem("message");
  }
});

let userCustomerLogin = sessionStorage.getItem("customer_login") ?? "";
let profileService = new ProfileService();
let user = {};
if (userCustomerLogin) {
  user = await profileService.fetchProfile(userCustomerLogin);
  let html = `<div class="profile-card">
        <h4 class="mb-4">Thông tin cá nhân</h4>
        <div class="text-center mb-4">
          <div class="profile-avatar mb-2">
            <img src="${
              user.avatar == ""
                ? "https://res.cloudinary.com/dfmoftnpw/image/upload/v1761575599/default_avatar_v9lenr.png"
                : user.avatar
            }" class="rounded-circle">
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label">Họ và tên</label>
          <div class="col-sm-9">
            <p class="form-control-plaintext">${user.name}</p>
          </div>
        </div>
          <div class="mb-3 row">
          <label class="col-sm-3 col-form-label">Email</label>
          <div class="col-sm-9">
            <p class="form-control-plaintext">${
              user.email ? user.email : "Chưa cập nhật"
            }</p>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label">Số điện thoại</label>
          <div class="col-sm-9">
            <p class="form-control-plaintext">${
              user.phone != "" ? user.phone : "Chưa cập nhật"
            }</p>
          </div>
        </div>
                <div class="mb-3 row">
          <label class="col-sm-3 col-form-label">Ngày sinh</label>
          <div class="col-sm-9">
            <p class="form-control-plaintext">${
              user.birth ? user.birth : "Chưa cập nhật"
            }</p>
          </div>
        </div>
                <div class="mb-3 row">
          <label class="col-sm-3 col-form-label">Địa chỉ</label>
          <div class="col-sm-9">
            <p class="form-control-plaintext">${user.address}</p>
          </div>
        </div>
        <div class="text-center">
          <button class="btn bg-pink rounded-3 text-white" onclick="editProfileFunc()">Chỉnh sửa thông tin</button>
        </div>
        </div>

      </div>`;
  let profilePage = document.getElementById("profilePage");
  profilePage.innerHTML = html;
  let editProfile = `<div class="container py-5" id="editProfilePage">
  <div class="profile-card shadow-sm">
    <div class="text-center mb-4">


  <div class="avatar mb-2">
            <img
          src="${
            user.avatar ? user.avatar : "https://res.cloudinary.com/dfmoftnpw/image/upload/v1761575599/default_avatar_v9lenr.png"
          }"
          id="avatar"
          alt="Avatar"
          width="100"
          height="100"
          class="rounded-circle"
        />
      </div>
      <div class="text-center">
  </div>
                 <button
                  type="button"
                  class="btn btn-outline-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                 <i class="bi bi-image-fill"></i> Chọn ảnh
                </button>
  <label for="avatar" class="change-avatar">Thay đổi ảnh đại diện</label>
  <div
                  class="modal fade"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          Thêm ảnh
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <div class="container my-5">
                          <h3 class="mb-4 text-center">
                            Tải lên nhiều hình ảnh (Kéo & Thả)
                          </h3>

                          <div
                            id="drop-zone"
                            class="p-5 border border-2 border-dashed rounded-3 text-center bg-light"
                          >
                            <i
                              class="bi bi-cloud-arrow-up-fill fs-1 text-primary mb-3"
                            ></i>
                            <p class="fs-5 fw-bold text-dark">
                              Kéo và thả các tập tin hình ảnh vào đây
                            </p>
                            <p class="text-muted mb-4">hoặc</p>

                            <input
                              type="file"
                              id="file-input"
                              multiple
                              accept="image/*"
                              class="d-none"
                            />
                            <label
                              for="file-input"
                              class="btn btn-primary shadow-sm"
                            >
                              Chọn tệp từ máy tính
                            </label>
                          </div>

                          <div
                            id="preview-container"
                            class="row mt-4 g-3"
                          ></div>
                          <button
                            id="upload-all-button"
                            class="btn btn-success mt-4"
                          >
                            <i class="bi bi-upload me-2"></i> Tải Lên Tất Cả
                            Hình Ảnh
                          </button>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-primary"
                          data-bs-dismiss="modal"
                        >
                          Xác Nhận
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
</div>
    <form>
      <!-- Họ và tên -->
      <div class="mb-3">
        <label for="fullname" class="form-label">Họ và tên</label>
        <input type="text" class="form-control" id="fullname" value="${
          user.name
        }">
        <small id="nameError" class="text-danger"></small>
      </div>

      <!-- Số điện thoại -->
      <div class="mb-3">
        <label for="phone" class="form-label">Số điện thoại</label>
        <input type="text" class="form-control" id="phone" placeholder="Nhập số điện thoại" value="${
          user.phone ? user.phone : ""
        }">
      </div>
      <!-- Ngày sinh -->
      <div class="mb-3">
        <label class="form-label">Ngày sinh</label>
        <div class="d-flex">
          <input type="date" class="form-control" id="birth" value="${
            user.birth ? user.birth : ""
          }" />
        </div>
        <small id="birthError" class="text-danger"></small>
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" placeholder="Nhập địa chỉ email" placeholder="Nhập địa chỉ email" value="${
          user.email ? user.email : ""
        }">
        <small id="emailError" class="text-danger"></small>
      </div>
      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <div class="d-flex">
          <input type="text" class="form-control" id="address" placeholder="Nhập địa chỉ" value="${
            user.address ? user.address : ""
          }" />
      </div>
      <!-- Button -->
      <button type="button" class="btn  bg-pink rounded-3 mt-4 text-white col-12" onclick="updateProfile()">Cập nhật thông tin</button>
    </form>
  </div>
</div>`;
  function editProfileFunc() {
    document.getElementById("profilePage").innerHTML = editProfile;
    upload();
  }
  window.editProfileFunc = editProfileFunc;

  function upload() {
    let imageUrl = "";
    const CLOUD_NAME = "dfmoftnpw";
    const UPLOAD_PRESET = "Coder-lord";
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("preview-container");
    const uploadAllButton = document.getElementById("upload-all-button");

    let selectedFiles = [];

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    dropZone.addEventListener(
      "dragenter",
      () => dropZone.classList.add("drop-zone-active"),
      false
    );
    dropZone.addEventListener(
      "dragleave",
      () => dropZone.classList.remove("drop-zone-active"),
      false
    );
    dropZone.addEventListener(
      "dragover",
      () => dropZone.classList.add("drop-zone-active"),
      false
    );

    dropZone.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
      dropZone.classList.remove("drop-zone-active");
      let dt = e.dataTransfer;
      let files = dt.files;

      handleFiles(files);
    }

    fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

    function handleFiles(files) {
      [...files].forEach((file) => {
        if (file.type.startsWith("image/")) {
          selectedFiles.push(file);
          previewFile(file);
        }
      });
    }

    function previewFile(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col-6", "col-md-3");

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("position-relative", "mb-3");
        imgWrapper.dataset.filename = file.name;

        const img = document.createElement("img");
        img.src = reader.result;
        img.classList.add("preview-img");

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add(
          "bi",
          "bi-x-circle-fill",
          "text-danger",
          "position-absolute",
          "top-0",
          "start-100",
          "translate-middle",
          "cursor-pointer"
        );
        deleteIcon.addEventListener("click", () => {
          colDiv.remove();
          console.log(`Đã xóa ảnh: ${file.name}`);
        });

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(deleteIcon);
        colDiv.appendChild(imgWrapper);
        previewContainer.appendChild(colDiv);
      };
    }

    async function uploadAllImages() {
      if (selectedFiles.length === 0) {
        alert("Vui lòng chọn ít nhất một hình ảnh để tải lên.");
        return;
      }

      console.log(`Bắt đầu tải lên ${selectedFiles.length} hình ảnh...`);
      uploadAllButton.disabled = true;

      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        document.querySelector("#loadingOverlay").classList.add("d-flex");
        formData.append("folder", "js-nangcao-images");

        try {
          console.log(`Đang tải lên: ${file.name}`);
          const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          uploadedUrls.push({
            name: file.name,
            url: response.data.secure_url,
          });
          console.log(
            `Tải lên thành công (${file.name}): ${response.data.secure_url}`
          );
        } catch (error) {
          console.error(
            `Lỗi khi tải lên file ${file.name}:`,
            error.response ? error.response.data : error.message
          );
          alert(
            `Tải lên file ${file.name} thất bại! Vui lòng kiểm tra console.`
          );
          uploadAllButton.disabled = false;
          return;
        }
      }
      imageUrl = uploadedUrls[0]?.url || "";
      document.getElementById("avatar").src = imageUrl;
      uploadAllButton.disabled = false;
      alert(`Tải lên hoàn tất! ${uploadedUrls.length} ảnh đã được xử lý.`);
        document.querySelector("#loadingOverlay").classList.remove("d-flex");
      console.log("Tất cả URL đã tải lên:", uploadedUrls);
      selectedFiles = [];
      previewContainer.innerHTML = "";
    }

    if (uploadAllButton) {
      uploadAllButton.addEventListener("click", uploadAllImages);
    }
  }

  function updateProfile() {
    let fullname = document.getElementById("fullname").value;
    let phone = document.getElementById("phone").value;
    let birth = document.getElementById("birth").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;
    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let birthError = document.getElementById("birthError");

    if (fullname.trim() === "") {
      nameError.textContent = "Họ và tên không được để trống.";
    }else {
      nameError.textContent = "";
    }
    if (email.trim() === "") {
      emailError.textContent = "Email không được để trống.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = "Định dạng email không hợp lệ.";
    } else {
      emailError.textContent = "";
    }
    if(birth > new Date().toISOString().split("T")[0]){
      birthError.textContent = "Ngày sinh không được lớn hơn ngày hiện tại.";
    } else {
      birthError.textContent = "";
    }
    if (nameError.textContent || emailError.textContent || birthError.textContent) {
      return;
    }
    const updatedUser = {
      ...user,
      name: fullname,
      phone: phone,
      avatar: document.getElementById("avatar").src,
      birth: birth,
      email: email,
      address: address,
    };
    profileService.update(updatedUser);
  }
  window.updateProfile = updateProfile;
  function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
  }
  window.logout = logout;
} else {
  window.location.href = "../client/login.html";
}
