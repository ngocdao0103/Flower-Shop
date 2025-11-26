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
