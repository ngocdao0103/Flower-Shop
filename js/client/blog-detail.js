import { BlogDetailService } from "../../services/client/blog-detail.service.js";

document.addEventListener("DOMContentLoaded", () => {

    const blogDetailService = new BlogDetailService();

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("blog");

    if (slug) {
        blogDetailService.getBlogById(slug);
    } else {
        document.getElementById("blog-detail").innerHTML = `
            <div class="alert alert-warning text-center">Không tìm thấy bài viết.</div>
        `;
    }
});