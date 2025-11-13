import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class BlogService {
    id;
    title;
    slug;
    content;
    thumbnail_url;
    author;
    category;
    created_at;
    blog = [];

    constructor() {
        this.renderBlogList();
    }

    async renderBlogList() {
        const blogTable = document.getElementById("blog-table");
        const res = await axios.get(apiURL + endpoints.BLOG);
        if (res.status == status.OK) {
            this.blog = res.data;
            console.log(this.blog);
            let index = 0;
            let html = ``;
            this.blog.forEach(blog => {
                index++;
                let shortContent = blog.content.length > 50
                    ? blog.content.substring(0, 50) + "..."
                    : blog.content;
                html += `
                    <tr>
                        <td>${index}</td>
                        <td><strong>${blog.title}</strong></td>
                        <td>
                            <img src="${blog.thumbnail_url}" width="110" height="110" class="img-fluid" />
                        </td>
                        <td>${shortContent}</td>
                        <td>
                            <a href="./blog-detail.html?blogId=${blog.id}" class="btn btn-sm btn-outline-info">
                                <i class="bi bi-eye"></i>
                            </a>
                            <button class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal"
                                data-bs-target="#editBlog-${blog.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal"
                                data-bs-target="#deleteBlog-${blog.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>

                    <!-- Modal Edit -->
                    <div class="modal fade" id="editBlog-${blog.id}">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header bg-info text-white">
                                    <h5><i class="bi bi-pencil-square"></i> Sửa bài viết</h5>
                                    <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <label>Tiêu đề</label>
                                    <input id="edit-title-${blog.id}" value="${blog.title}" class="form-control mb-2" />

                                    <label>Slug</label>
                                    <input id="edit-slug-${blog.id}" value="${blog.slug}" class="form-control mb-2" />

                                    <label>Danh mục</label>
                                    <input id="edit-category-${blog.id}" value="${blog.category}" class="form-control mb-2" />

                                    <label>Tác giả</label>
                                    <input id="edit-author-${blog.id}" value="${blog.author}" class="form-control mb-2" />

                                    <label>Nội dung</label>
                                    <textarea id="edit-content-${blog.id}" class="form-control mb-3" rows="4">${blog.content}</textarea>

                                    <label>Ảnh hiện tại</label>
                                    <div class="text-center mb-3">
                                        <img src="${blog.thumbnail_url}" id="preview-${blog.id}" class="img-fluid rounded shadow" style="max-height: 150px;">
                                    </div>

                                    <label>Chọn ảnh mới (nếu có)</label>
                                    <input type="file" id="edit-image-${blog.id}" class="form-control mb-3" accept="image/*">
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                    <button class="btn btn-info text-white" onclick="updateBlog('${blog.id}')">Cập nhật</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Delete -->
                    <div class="modal fade" id="deleteBlog-${blog.id}">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content border-0 shadow">
                                <div class="modal-body text-center p-4">
                                    <i class="bi bi-exclamation-triangle text-danger display-5 mb-3"></i>
                                    <h5>Bạn có chắc muốn xóa bài viết <b>${blog.title}</b> này?</h5>
                                    <div class="mt-3">
                                        <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                        <button class="btn btn-danger ms-2" onclick="deleteBlog('${blog.id}')">Xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>              
                `;
            });
            blogTable.innerHTML = html;
        }
    }

    // --- Thêm blog ---
    async createBlog(title, slug, content, thumbnail_url, author, category) {
        const newBlog = {
            id: "ART" + Math.floor(Math.random() * 1000 + 1),
            title,
            slug,
            content,
            thumbnail_url,
            author,
            category,
            created_at: new Date().toISOString()
        };

        const res = await axios.post(apiURL + endpoints.BLOG, newBlog);
        if (res.status === status.CREATED || res.status === status.OK) {
            await this.renderBlogList();
            return res.data;
        } else {
            throw new Error("Không thể thêm blog");
        }
    }

    // --- Xóa blog ---
    async deleteBlog(id) {
        const res = await axios.delete(`${apiURL + endpoints.BLOG}/${id}`);
        if (res.status === status.OK) {
            await this.renderBlogList();
        } else {
            throw new Error("Không thể xóa blog");
        }
    }

    // --- Cập nhật blog ---
    async updateBlog(id, title, slug, content, thumbnail_url, author, category) {
        try {
            const res = await axios.put(`${apiURL + endpoints.BLOG}/${id}`, {
                title, slug, content, thumbnail_url, author, category
            });
            if (res.status === status.OK) {
                console.log("✅ Cập nhật blog thành công!");
                return res.data;
            }
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật blog:", error);
            throw error;
        }
    }

    // --- Lấy chi tiết 1 blog ---
    async getBlogById(id) {
        try {
            const res = await axios.get(`${apiURL + endpoints.BLOG}/${id}`);
            if (res.status === status.OK) {
                return res.data;
            } else {
                throw new Error("Không thể lấy chi tiết bài viết");
            }
        } catch (error) {
            console.error("❌ Lỗi khi lấy chi tiết blog:", error);
            throw error;
        }
    }
}