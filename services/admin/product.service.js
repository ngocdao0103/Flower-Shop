import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class ProductService {
    productList = [];

    constructor() {
    }

    async getList() {
        try {
            const res = await axios.get('/data/db.json');
            const data = res && res.data ? res.data : {};
            this.productList = data.products || [];
            this.renderList();
            this.setupConfirmDelete();
            return this.productList;
        } catch (err) {
            console.error('ProductService.getList error:', err);
            this.productList = [];
            this.renderList();
            return this.productList;
        }
    }

    renderList() {
        const tbody = document.querySelector('#productTableBody');
        if (!tbody) return; 

        tbody.innerHTML = '';

        const nf = new Intl.NumberFormat('vi-VN');

        this.productList.forEach((p, idx) => {
            const tr = document.createElement('tr');
            const price = typeof p.base_price === 'number' ? p.base_price : 0;
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td>${p.name || ''}</td>
                <td>${nf.format(price)}đ</td>
                <td>${p.category || ''}</td>
                <td><img src="${p.image_url || 'https://via.placeholder.com/50'}" class="rounded" style="width:50px;height:50px;object-fit:cover;" /></td>
                <td>
                    <a class="btn btn-sm btn-sm btn-outline-primary me-1" href="product_edit.html?id=${encodeURIComponent(p.id || '')}" title="Sửa"><i class="bi bi-pencil"></i></a>
                    <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${p.id || ''}" data-bs-toggle="modal" data-bs-target="#deleteModal" title="Xóa"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        if (this.productList.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="6" class="text-center text-muted">Chưa có sản phẩm</td>`;
            tbody.appendChild(tr);
        }
    }
    pendingDeleteId = null;
    setupConfirmDelete() {
        const confirmBtn = document.querySelector('#confirmDeleteBtn');
        if (!confirmBtn) return;

        if (confirmBtn._hasDeleteListener) return;
        confirmBtn._hasDeleteListener = true;

        document.querySelector('#productTableBody')?.addEventListener('click', (evt) => {
            const btn = evt.target.closest('.btn-delete');
            if (btn) {
                this.pendingDeleteId = btn.getAttribute('data-id');
            }
        });

        confirmBtn.addEventListener('click', () => {
            if (!this.pendingDeleteId) return;
            this.deleteProduct(this.pendingDeleteId);
            this.pendingDeleteId = null;
        });
    }

    deleteProduct(id) {
        axios
            .delete(apiURL + endpoints.PRODUCT + `/${id}`)
            .then((res) => {
                if (res.status == status.DELETED || res.status == status.OK) {
                    console.log('Deleted', res.data);
                    // set flash message and reload so the product list shows the notification
                    try {
                        sessionStorage.setItem('successMessage', 'Xóa sản phẩm thành công');
                        sessionStorage.setItem('classMessage', 'success');
                    } catch (e) {
                        /* ignore if sessionStorage unavailable */
                    }
                    this.productList = this.productList.filter((p) => p.id !== id);
                    this.renderList();
                    const deleteModalEl = document.getElementById('deleteModal');
                    if (deleteModalEl && typeof bootstrap !== 'undefined') {
                        const modalInstance = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
                        modalInstance.hide();
                    }
                    // reload to ensure the flash is displayed via product.js init
                    try {
                        window.location.reload();
                    } catch (e) {
                        // ignore
                    }
                } else {
                    console.warn('Delete returned unexpected status', res.status);
                }
            })
            .catch((err) => console.error(err));
    }

    createProduct(payload) {
        const tempId = `TEMP_${Date.now()}`;
        const temp = Object.assign({ id: tempId }, payload);
        this.productList.push(temp);
        this.renderList();
        const addModalEl = document.getElementById('addModal');
        if (addModalEl && typeof bootstrap !== 'undefined') {
            const modalInstance = bootstrap.Modal.getInstance(addModalEl) || new bootstrap.Modal(addModalEl);
            modalInstance.hide();
        }
        // return the axios promise so callers can react (e.g., show a flash message)
        return axios
            .post(apiURL + endpoints.PRODUCT, payload)
            .then((res) => {
                if (res.status == status.CREATED || res.status == status.OK) {
                    const created = res.data || payload;
                    if (!created.id) created.id = `PROD_${Date.now()}`;
                    this.productList = this.productList.map((p) => (p.id === tempId ? created : p));
                    this.renderList();
                    const addModalEl2 = document.getElementById('addModal');
                    if (addModalEl2 && typeof bootstrap !== 'undefined') {
                        const modalInstance = bootstrap.Modal.getInstance(addModalEl2) || new bootstrap.Modal(addModalEl2);
                        modalInstance.hide();
                    }
                } else {
                    console.warn('Create returned unexpected status', res.status);
                }
                return res;
            })
            .catch((err) => {
                console.error('Create product failed:', err);
                throw err;
            });
    }
}