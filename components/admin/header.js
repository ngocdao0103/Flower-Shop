const headerAdmin = document.getElementById("headerAdmin");

let fullNameLogin = sessionStorage.getItem("fullname_login") ?? "";
let adminLogin = sessionStorage.getItem("admin_login") ?? "";

if (!adminLogin) {
  window.location.href = "../../../index.html";
}

headerAdmin.innerHTML = `
<header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand me-5 fw-bold" href="#">
                <i class="bi bi-speedometer2 me-2"></i> ADMIN DASHBOARD
            </a>

            <div class="d-flex align-items-center">
                <div class="dropdown">
                    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://i.pinimg.com/736x/85/bd/b2/85bdb27c8cef704a132fdb0c55fc0629.jpg" alt="avatar" width="32" height="32" class="rounded-circle me-2">
                        <strong class="d-none d-md-inline">${fullNameLogin}</strong>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="#"><i class="bi bi-person-circle me-2"></i> Hồ sơ</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-gear-fill me-2"></i> Cài đặt</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button id="logoutBtnAdmin" class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i> Đăng xuất</button></li>
                    </ul>
                </div>

            </div>
        </div>
    </nav>
</header>
<div style="padding-top: 56px;"></div>
`;
headerAdmin.append(headerAdmin);
