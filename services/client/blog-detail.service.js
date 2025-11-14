import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export class BlogDetailService {
    constructor() { }

    async getAllBlogs() {
        const res = await axios.get(apiURL + endpoints.BLOG);
        return res.data;
    }

    // Lấy chi tiết blog theo SLUG
    async getBlogById(slug) {
        try {
            const allBlogs = await this.getAllBlogs();

            // Tìm blog theo slug
            const blog = allBlogs.find(b => b.slug === slug);

            if (!blog) {
                document.getElementById("blog-detail").innerHTML = `
                    <div class="alert alert-warning text-center">Không tìm thấy bài viết.</div>
                `;
                return;
            }

            // Tìm vị trí bài hiện tại
            const index = allBlogs.findIndex(b => b.id === blog.id);

            // Xác định bài trước / sau
            const prevBlog = allBlogs[index - 1] || null;
            const nextBlog = allBlogs[index + 1] || null;

            this.renderBlogDetail(blog, prevBlog, nextBlog);

        } catch (error) {
            console.error(error);
        }
    }

    // Hiển thị chi tiết blog
    renderBlogDetail(blog, prevBlog, nextBlog) {
        const container = document.getElementById("blog-detail");

        container.innerHTML = `
            <img src="${blog.thumbnail_url}" class="img-fluid mb-4 rounded" style="width: 1200px; object-fit: cover;">
            
            <h2 class="fw-bold text-uppercase mb-4">${blog.title}</h2>

            <p>${blog.content}</p>

            <blockquote class="blockquote bg-light p-4 border-start border-4 border-danger ms-md-5 my-4 shadow-sm">
                <em>
                    Contrary to popular belief, Lorem Ipsum is not simply random text...
                </em>
                <footer class="blockquote-footer mt-2">${blog.author || "Không rõ"}</footer>
            </blockquote>

            <!-- Điều hướng bài viết -->
            <div class="d-flex justify-content-between align-items-center my-4">

                <!-- Older Post -->
                ${prevBlog
                    ? `<a href="../client/detail_blog.html?blog=${prevBlog.slug}"
                        class="text-decoration-none text-secondary"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="${prevBlog.title}">
                        &larr; ${prevBlog.title}
                    </a>`
                    : `<span></span>`
                }
                <div>
                    <span class="me-2 fw-bold">Share the article</span>
                    <a href="#" class="text-decoration-none me-2"><img
                            src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20"></a>
                    <a href="#" class="text-decoration-none me-2"><img
                            src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="20"></a>
                    <a href="#" class="text-decoration-none me-2"><img
                            src="https://cdn-icons-png.flaticon.com/512/733/733558.png" width="20"></a>
                    <a href="#" class="text-decoration-none"><img
                            src="https://cdn-icons-png.flaticon.com/512/733/733558.png" width="20"></a>
                </div>

                <!-- Newer Post -->
                ${nextBlog
                    ? `<a href="../client/detail_blog.html?blog=${nextBlog.slug}"
                        class="text-decoration-none text-secondary"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="${nextBlog.title}">
                        ${nextBlog.title} &rarr;
                    </a>`
                    : `<span></span>`
                }

            </div>
        `;
        // Tooltip
        new bootstrap.Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']"
        });
    }
}
