import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export class BlogDetailService {
    constructor() {}

    // Lấy chi tiết blog theo ID
    async getBlogById(blogId) {
        try {
            const res = await axios.get(`${apiURL}${endpoints.BLOG}/${blogId}`);
            if (res.status === 200) {
                const blog = res.data;
                this.renderBlogDetail(blog);
            } else {
                throw new Error("Không thể lấy chi tiết bài viết");
            }
        } catch (error) {
            console.error("❌ Lỗi khi lấy chi tiết blog:", error);
            document.getElementById("blog-detail").innerHTML = `
                <div class="alert alert-danger text-center">
                    Lỗi khi tải bài viết. Vui lòng thử lại.
                </div>
            `;
        }
    }

    // Hiển thị chi tiết blog
    renderBlogDetail(blog) {
        const container = document.getElementById("blog-detail");
        container.innerHTML = `
        <div class="card-body">
            <h2 class="fw-bold mb-3 text-center">${blog.title}</h2>
            <p class="text-muted text-center">
                <i class="bi bi-person"></i> ${blog.author || "Không rõ"} 
                &nbsp; | &nbsp; 
                <i class="bi bi-tags"></i> ${blog.category || "Chưa có danh mục"}
                &nbsp; | &nbsp;
                <i class="bi bi-calendar"></i> ${new Date(blog.created_at).toLocaleDateString('vi-VN')}
            </p>

            <div class="text-center mb-4">
                <img src="${blog.thumbnail_url}" class="img-fluid blog-thumbnail shadow-sm" alt="${blog.title}">
            </div>

            <div class="blog-content fs-5">
                ${blog.content}
            </div>
        </div>
        `;
    }
}
