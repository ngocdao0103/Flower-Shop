import { BlogDetailService } from "../../services/admin/blog-detail.service.js";

document.addEventListener("DOMContentLoaded", () => {
    const blogDetailService = new BlogDetailService();

    // Lấy blogId từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("blogId");

    if (blogId) {
        blogDetailService.getBlogById(blogId);
    } else {
        document.getElementById("blog-detail").innerHTML = `
            <div class="alert alert-warning text-center">
                Không tìm thấy bài viết.
            </div>
        `;
    }
});
