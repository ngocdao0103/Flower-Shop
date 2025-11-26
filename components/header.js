const header = document.getElementById("header");

// Get session
const userCustomerLogin = sessionStorage.getItem("customer_login");
const userAdminLogin = sessionStorage.getItem("admin_login");
const userFullName = sessionStorage.getItem("fullname_login") ?? "";

// =====================================================
// 1) HÀM TẠO ACCOUNT DROPDOWN
// =====================================================
function generateAccountSection() {
  // Admin
  if (userAdminLogin) {
    return `
      <div class="nav-item dropdown">
        <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
          <i class="bi bi-person-gear"></i>
        </a>
        <div class="dropdown-menu bg-light rounded-0">
          <a href="/pages/admin/dashboard/dashboard.html" class="dropdown-item">
            <i class="bi bi-speedometer2 text-primary me-2"></i> Trang quản trị
          </a>
          <a href="#" id="logoutBtn" class="dropdown-item">
            <i class="bi bi-box-arrow-right text-danger me-2"></i> Đăng xuất
          </a>
        </div>
      </div>
    `;
  }

  // Customer
  if (userCustomerLogin) {
    return `
      <div class="nav-item dropdown">
        <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
          <i class="bi bi-person"></i>
        </a>
        <div class="dropdown-menu bg-light rounded-0">
          <a href="/pages/client/profile.html" class="dropdown-item">
            <i class="bi bi-file-earmark-person text-success me-2"></i> ${userFullName}
          </a>
          <a href="#" id="logoutBtn" class="dropdown-item">
            <i class="bi bi-box-arrow-right text-danger me-2"></i> Đăng xuất
          </a>
        </div>
      </div>
    `;
  }

  // Guest
  return `
    <div class="dropdown nav-item">
      <a class="dropdown-toggle" type="button" data-bs-toggle="dropdown">
        <i class="bi bi-person"></i>
      </a>
      <ul class="dropdown-menu">
        <a class="dropdown-item" href="/pages/client/login.html">Đăng nhập</a>
        <a class="dropdown-item" href="/pages/client/register.html">Đăng kí</a>
      </ul>
    </div>
  `;
}

// =====================================================
// 2) TẠO HTML HEADER — CHUNG CHO MỌI LOẠI USER
// =====================================================
header.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-light">
  <div class="container">

    <!-- Logo -->
    <a class="navbar-brand" href="/">Flo<span>Sun</span></a>

    <!-- Nút toggle -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Menu -->
    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="/">Trang chủ</a></li>
        <li class="nav-item"><a class="nav-link" href="/pages/client/product.html">Cửa hàng</a></li>
        <li class="nav-item"><a class="nav-link" href="/pages/client/blog.html">Bài viết</a></li>
        <li class="nav-item"><a class="nav-link" href="/pages/client/about.html">Về chúng tôi</a></li>
        <li class="nav-item"><a class="nav-link" href="/pages/client/contact.html">Liên hệ</a></li>
        <div class="d-block d-lg-none">
            <li class="nav-item"><a class="nav-link" href="/pages/client/login.html">Đăng nhập</a></li>
        <li class="nav-item"><a class="nav-link" href="/pages/client/register.html">Đăng ký</a></li>
        <li class="nav-item"><a class="nav-link" href="/pages/client/cart.html">Giỏ hàng</a></li>
        </div>
        ${
          userAdminLogin
            ? `<li class="nav-item"><a class="nav-link" href="/pages/admin/dashboard/dashboard.html">Quản trị</a></li>`
            : ""
        }
      </ul>
    </div>

    <!-- Icons bên phải -->
    <div class="d-none d-md-none d-lg-flex align-items-center navbar-icons gap-3">
      ${generateAccountSection()}
      <a href="/pages/client/cart.html" class="position-relative">
        <i class="bi bi-cart3 fs-5"></i>
      </a>

    </div>
  </div>
</nav>
`;

// =====================================================
// 3) LOGOUT
// =====================================================
setTimeout(() => {
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      sessionStorage.setItem("classMessage", "danger");
      sessionStorage.setItem("successMessage", "Đăng xuất thành công");
      window.location.href = "/index.html";
    });
  }
}, 10);
