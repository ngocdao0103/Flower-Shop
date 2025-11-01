const navbar = document.getElementById('navbar');
navbar.innerHTML = `
<nav id="sidebarMenu" class="d-lg-block sidebar collapse bg-light border-end vh-100">
    <div class="position-sticky">
        <div class="list-group list-group-flush">
            <a href="../dashboard/dashboard.html" class="list-group-item list-group-item-action py-2 ripple">
                <i class="bi bi-speedometer2 me-3"></i><span>Tổng quan</span>
            </a>
            <a href="../user/user.html" class="list-group-item list-group-item-action py-2 ripple">
                <i class="bi bi-person-fill me-3"></i><span>Quản lý Người dùng</span>
            </a>
            <a href="../order/order.html" class="list-group-item list-group-item-action py-2 ripple">
                <i class="bi bi-bag-fill me-3"></i><span>Quản lý Đơn hàng</span>
            </a>
            <a href="../product/product.html" class="list-group-item list-group-item-action py-2 ripple">
                <i class="bi bi-box-seam-fill me-3"></i><span>Quản lý Sản phẩm</span>
            </a>
            <a href="../category/category.html" class="list-group-item list-group-item-action py-2 ripple">
                <i class="bi bi-tags-fill me-3"></i><span>Quản lý Danh mục</span>
            </a>
            <hr class="mx-3 my-2">
            <a href="#" class="list-group-item list-group-item-action py-2 ripple">
                <i class="bi bi-bar-chart-fill me-3"></i><span>Báo cáo & Thống kê</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action py-2 ripple">
                <i class="bi bi-gear-fill me-3"></i><span>Cài đặt hệ thống</span>
            </a>
        </div>
    </div>
</nav>
`;

// Highlight link active theo URL
const links = navbar.querySelectorAll('a.list-group-item');
links.forEach(link => {
    const hrefFile = link.getAttribute('href').split('/').pop();
    const currentFile = window.location.pathname.split('/').pop();
    if (hrefFile === currentFile) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'true');
    } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    }
});
