const header = document.getElementById("header");

// nếu có đăng nhập thì hiện dropdown tài khoản & đăng xuất
// nếu chưa đăng nhập thì hiện dropdown đăng kí đăng nhập

let userCustomerLogin = sessionStorage.getItem("customer_login") ?? "";
let userAdminLogin = sessionStorage.getItem("admin_login") ?? "";
let userFullName = sessionStorage.getItem("fullname_login") ?? "";

let accountSection = "";

// Xử lí account
if (userCustomerLogin) {
  accountSection = `
        <div class="nav-item dropdown">
            <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                <i class="bi bi-person"></i>
            </a>
            <div class="dropdown-menu bg-light rounded-0 m-0">
                <a href="" class="dropdown-item">
                    <i class="bi bi-file-earmark-person me-2 text-success"></i> ${userFullName}
                </a>
                <a href="" class="dropdown-item" id="logoutBtn"><i class="bi bi-box-arrow-in-right text-danger me-2"></i>Đăng xuất</a>
            </div>
        </div>
    `;
} else {
  accountSection = `
        <div class="dropdown nav-item">
            <a class="dropdown-toggle" type="button" id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <i class="bi bi-person"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="triggerId">
            <a class="dropdown-item" href="/pages/client/login.html">Đăng nhập</a>
                <a class="dropdown-item" href="/pages/client/register.html">Đăng kí</a>
            </ul>
        </div>
    `;
}

// Xử lí header
let headerHTML = "";
if (userAdminLogin) {
  headerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand" href="#">Flo<span>Sun</span></a>

            <!-- Nút toggle -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Menu -->
            <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link active" href="/">Trang chủ</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/product.html">Cửa hàng</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/blog.html">Bài viết</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/about.html">Về chúng tôi</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/contact.html">Liên hệ</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/admin/dashboard/dashboard.html">Quản trị</a></li>
                </ul>
            </div>

            <!-- Icon phải -->
            <div class="navbar-icons">
                ${accountSection}
            
                <a href="/pages/client/cart.html">
                    <div class="cart-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        <span class="badge">3</span>
                    </div>
                </a>
            </div>
        </div>  
    </nav>
`;
} else {
  headerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand" href="#">Flo<span>Sun</span></a>

            <!-- Nút toggle -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Menu -->
            <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link active" href="/">Trang chủ</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/product.html">Cửa hàng</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/blog.html">Bài viết</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/about.html">Về chúng tôi</a></li>
                    <li class="nav-item"><a class="nav-link" href="/pages/client/contact.html">Liên hệ</a></li>
                </ul>
            </div>

            <!-- Icon phải -->
            <div class="navbar-icons">
                ${accountSection}
            
                <a href="/pages/client/cart.html">
                    <div class="cart-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        <span class="badge">3</span>
                    </div>
                </a>
            </div>
        </div>  
    </nav>
`;
}

header.innerHTML = headerHTML;

// Thực hiện đăng xuất
const logoutBtn = document.querySelector("#logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("admin_login");
    sessionStorage.removeItem("customer_login");
    sessionStorage.removeItem("fullname_login");
    alert("Bạn đã đăng xuất thành công!");
    window.location.href = "../../index.html";
  });
}
