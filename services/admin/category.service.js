import { API_URL } from "../../environments/environment.js";
import { endpoint, status } from "../../config/api-endpoint.config.js";
export class CategoryService {
    id;
    name;
    status;
    categories = [];
    constructor() {
        this.renderCategoryList();
        const idUrl = new URLSearchParams(window.location.search).get('id');
        if (idUrl) {
            console.log(idUrl)
            this.productDetail(idUrl);
        }
    }

    async renderCategoryList() {
        const table_categories = document.getElementById("table-categories");
        const res = await axios.get(API_URL + endpoint.CATEGORY);
        if (res.status == status.OK) {
            this.categories = res.data;
            console.log(this.categories);
            let index = 0;
            let html = ``;
            this.categories.forEach(category => {
                index++;
                html += `
                    <tr>
                                    <td>${index}</td>
                                    <td>${category.name}</td>
                                    <td>
                                        <img src="${category.image_url}" alt="${category.name}" width="200" height="200" class="img-fluid" />
                                    </td>
                                    <td>${category.description}</td>
                                    <td>${category.statusCategory == 0 ? '<span class="badge bg-success">Hiển thị</span>' : '<span class="badge bg-secondary">Ẩn</span>'}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal"
                                            data-bs-target="#editCategory-${category.id}"><i class="bi bi-pencil"></i></button>
                                    <button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal"
                                        data-bs-target="#deleteCategory-${category.id}"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                                <!-- Modal Edit -->
                            <div class="modal fade" id="editCategory-${category.id}">
                                <div class="modal-dialog">
                                    <div class="modal-content border-0 shadow-${category.id}">
                                        <div class="modal-header bg-info text-white">
                                            <h5><i class="bi bi-pencil-square"></i> Sửa danh mục</h5>
                                            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            <label>Tên danh mục</label>
                                            <input id="edit-name-${category.id}" value="${category.name}" class="form-control mb-2" />

                                            <label>Mô tả</label>
                                            <textarea id="edit-description-${category.id}" class="form-control mb-3">${category.description}</textarea>

                                            <label>Trạng thái</label>
                                            <select id="edit-status-${category.id}" class="form-select mb-3">
                                                <option value="1" ${category.status == 1 ? "selected" : ""}>Hiển thị</option>
                                                <option value="0" ${category.status == 0 ? "selected" : ""}>Ẩn</option>
                                            </select>

                                            <label>Ảnh hiện tại</label>
                                            <div class="file-input mb-3 text-center">
                                            <img src="${category.image_url}"
                                                id="preview-${category.id}"
                                                class="img-fluid rounded shadow"
                                                style="max-height: 150px; object-fit: cover;">
                                            </div>


                                            <label>Chọn ảnh mới (nếu có)</label>
                                            <input type="file" id="edit-image-${category.id}" class="form-control mb-3" accept="image/*">

                                            <div id="new-image-preview-${category.id}" class="text-center"></div>
                                        </div>
                                        <div class="modal-footer">
                                            <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button class="btn btn-info text-white" onclick="updateCategory('${category.id}')">Cập nhật</button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <!-- Modal Delete -->
                            <div class="modal" id="deleteCategory-${category.id}">
                                <div class="modal-dialog modal-dialog-centered-${category.id}">
                                    <div class="modal-content border-0 shadow">
                                        <div class="modal-body text-center p-4"><i
                                                class="bi bi-exclamation-triangle text-danger display-5 mb-3"></i>
                                            <h5>Bạn có chắc muốn xóa danh mục <b>${category.name}</b> này?</h5>
                                            <div class="mt-3"><button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button><button
                                                    class="btn btn-danger ms-2" onclick="deleteCategory('${category.id}')">Xóa</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
            });
            table_categories.innerHTML = html;
        }
    }

    // --- Thêm danh mục ---
    async createCategory(name, description, image_url, statusCategory = 0) {
        const newCategory = {
            id: "CAT" + Math.floor(Math.random() * 1000 + 1),
            name,
            description,
            image_url,
            statusCategory
        };

        const res = await axios.post(API_URL + endpoint.CATEGORY, newCategory);

        if (res.status === status.CREATED || res.status === status.OK) {
            console.log("✅ Thêm danh mục thành công:", res.data);
            await this.renderCategoryList(); // Cập nhật lại danh sách ngay sau khi thêm
            return res.data;
        } else {
            throw new Error("Không thể thêm danh mục");
        }
    }

    // --- Xóa danh mục ---
    async deleteCategory(id) {
        const res = await axios.delete(`${API_URL + endpoint.CATEGORY}/${id}`);
        if (res.status === status.OK) {
            await this.renderCategoryList();
        } else {
            throw new Error("Không thể xóa danh mục");
        }
    }

    async updateCategory(id, name, description, image_url, status) {
        try {
            const res = await axios.put(`${API_URL + endpoint.CATEGORY}/${id}`, {
                name,
                description,
                image_url,
                status
            });

            if (res.status === status.OK) {
                console.log("✅ Cập nhật danh mục thành công!");
                return res.data;
            }
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật danh mục:", error);
            throw error;
        }
    }
}