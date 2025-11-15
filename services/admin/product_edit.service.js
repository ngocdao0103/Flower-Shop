import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

export class ProductEditService {
  product = null;
  pendingVariantDeleteId = null;
  editingVariantId = null;

  constructor() {}

  async load(id) {
    try {
      const res = await axios.get(`${apiURL}${endpoints.PRODUCT}/${encodeURIComponent(id)}`);
      this.product = res.data;
    } catch (err) {
      console.warn('product_edit.service: API fetch failed, falling back to local db', err);
      try {
        const res = await axios.get('/data/db.json');
        const data = res && res.data ? res.data : {};
        const products = data.products || [];
        this.product = products.find((p) => String(p.id) === String(id));
      } catch (err2) {
        console.error('product_edit.service: failed to load local db', err2);
        this.product = null;
      }
    }

    this.renderForm();
    this.renderVariants();
    this.setupVariantHandlers();
  }

  renderForm() {
    if (!this.product) return;
    const name = document.getElementById('editProductName');
    const price = document.getElementById('editProductPrice');
    const category = document.getElementById('editProductCategory');
    const image = document.getElementById('editProductImageUrl');
    const preview = document.getElementById('editProductImagePreview');
    const desc = document.getElementById('editProductDescription');

    if (name) name.value = this.product.name || '';
    if (price) price.value = this.product.base_price != null ? String(this.product.base_price) : '';
    if (category) {
      const opts = Array.from(category.options).map((o) => o.value);
      if (this.product.category && !opts.includes(this.product.category)) {
        const opt = document.createElement('option');
        opt.text = this.product.category;
        opt.value = this.product.category;
        category.add(opt);
      }
      if (this.product.category) category.value = this.product.category;
    }
    if (image) image.value = this.product.image_url || '';
    if (preview) preview.src = this.product.image_url || preview.src;
    if (desc) desc.value = this.product.description || '';
  }

  renderVariants() {
    const tbody = document.getElementById('variantTableBody');
    if (!tbody) return;
    tbody.innerHTML = ''; 
    const variants = Array.isArray(this.product?.variants) ? this.product.variants : [];

    const attrNames = [];
    variants.forEach((v) => {
      const attrs = Array.isArray(v.attributes) ? v.attributes : [];
      attrs.forEach((a) => {
        const name = (a && a.name) ? String(a.name).trim() : '';
        if (name && !attrNames.some(n => n.toLowerCase() === name.toLowerCase())) {
          attrNames.push(name);
        }
      });
    });
    this.variantAttrNames = attrNames;

    const thead = document.getElementById('variantTableHead');
    if (thead) {
      const ths = ['#', ...attrNames, 'Giá', 'Ảnh', 'Hành động'];
      thead.innerHTML = `<tr>${ths.map(t => `<th>${this._escapeHtml(t)}</th>`).join('')}</tr>`;
    }

    try {
      const addBody = document.querySelector('#addVariantModal .modal-body');
      const editBody = document.querySelector('#editVariantModal .modal-body');
      if (addBody) {
        let html = '';
        if (attrNames.length > 0) {
          attrNames.forEach((n, i) => {
            html += `<div class="mb-3"><label class="form-label">${this._escapeHtml(n)}</label><input id="variantAttr_${i}" class="form-control" /></div>`;
          });
        } else {
          html += '<div id="newAttrsContainer">';
          for (let i = 0; i < 2; i++) {
            html += `<div class="d-flex gap-2 mb-2 attr-pair"><input id="variantNewAttrName_${i}" class="form-control" placeholder="Tên cột" /><input id="variantAttrVal_${i}" class="form-control" placeholder="Giá trị" /></div>`;
          }
          html += '</div>';
          html += '<div class="mb-2"><button id="addVariantAttrNameBtn" type="button" class="btn btn-sm btn-outline-secondary">Thêm cột</button></div>';
        }
        html += '<div class="mb-3"><label class="form-label">Giá</label><input id="variantPrice" class="form-control"></div>';
        html += '<div class="mb-3"><label class="form-label">Ảnh (URL)</label><input id="variantImageUrl" type="text" class="form-control" placeholder="https://..."></div>';
        addBody.innerHTML = html;
        if (!attrNames.length) {
          const addBtn = addBody.querySelector('#addVariantAttrNameBtn');
          if (addBtn) {
            addBtn.addEventListener('click', (e) => {
              e.preventDefault();
              const container = addBody.querySelector('#newAttrsContainer');
              if (!container) return;
              const idx = container.querySelectorAll('.attr-pair').length;
              const div = document.createElement('div');
              div.className = 'd-flex gap-2 mb-2 attr-pair';
              div.innerHTML = `<input id="variantNewAttrName_${idx}" class="form-control" placeholder="Tên cột" /><input id="variantAttrVal_${idx}" class="form-control" placeholder="Giá trị" />`;
              container.appendChild(div);
            });
          }
        }
      }
      if (editBody) {
        let html2 = '';
        if (attrNames.length > 0) {
          attrNames.forEach((n, i) => {
            html2 += `<div class="mb-3"><label class="form-label">${this._escapeHtml(n)}</label><input id="editVariantAttr_${i}" class="form-control" /></div>`;
          });
        } else {
          html2 += '<div class="mb-3"><label class="form-label">Màu sắc</label><input id="editVariantColor" class="form-control"></div>';
          html2 += '<div class="mb-3"><label class="form-label">Kích thước</label><input id="editVariantSize" class="form-control"></div>';
        }
        html2 += '<div class="mb-3"><label class="form-label">Giá</label><input id="editVariantPrice" class="form-control"></div>';
        html2 += '<div class="mb-3"><label class="form-label">Ảnh (URL)</label><input id="editVariantImageUrl" type="text" class="form-control"></div>';
        editBody.innerHTML = html2;
      }
    } catch (e) {
      console.warn('Unable to render dynamic variant inputs', e);
    }

    if (variants.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" class="text-center text-muted">Chưa có biến thể</td>`;
      tbody.appendChild(tr);
      return;
    }

    variants.forEach((v, idx) => { 
      const tr = document.createElement('tr');
      const attrs = Array.isArray(v.attributes) ? v.attributes : [];
      const cells = [];
      attrNames.forEach((colName) => {
        const found = attrs.find(a => String(a.name).trim().toLowerCase() === String(colName).trim().toLowerCase());
        const value = found ? found.value : '';
        cells.push(`<td>${this._escapeHtml(value || '')}</td>`);
      });
      const displayPrice = v.price_modifier != null ? (this.product.base_price || 0) + v.price_modifier : v.price || 0;
      tr.innerHTML = `
        <td>${idx + 1}</td>
        ${cells.join('')}
        <td>${this._formatPrice(displayPrice)}</td>
        <td><img src="${v.image_url || 'https://via.placeholder.com/50'}" class="rounded" style="width:50px;height:50px;object-fit:cover;" /></td>
        <td>
          <button class="btn btn-sm btn-outline-info me-1 btn-variant-edit" data-variant-id="${v.variant_id || v.variantId || v.id || ''}" title="Sửa"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-variant-delete" data-variant-id="${v.variant_id || v.variantId || v.id || ''}" title="Xóa"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  setupVariantHandlers() {
    const tbody = document.getElementById('variantTableBody');
    if (!tbody) return;

    tbody.addEventListener('click', (evt) => {
      const editBtn = evt.target.closest('.btn-variant-edit');
      const delBtn = evt.target.closest('.btn-variant-delete');
      if (editBtn) {
        const vid = editBtn.getAttribute('data-variant-id');
        this.showEditVariantModal(vid);
      } else if (delBtn) {
        const vid = delBtn.getAttribute('data-variant-id');
        this.showDeleteVariantModal(vid);
      }
    });

    const addSave = document.getElementById('addVariantSaveBtn');
    if (addSave) {
      addSave.addEventListener('click', (e) => {
        e.preventDefault();
        this.addVariantFromForm();
      });
    }

    const saveVariant = document.getElementById('saveVariantBtn');
    if (saveVariant) {
      saveVariant.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveEditedVariant();
      });
    }

    const confirmDel = document.getElementById('confirmDeleteVariantBtn');
    if (confirmDel) {
      confirmDel.addEventListener('click', (e) => {
        e.preventDefault();
        this.confirmDeleteVariant();
      });
    }
  }

  async addVariantFromForm() {
    const attrs = [];
    if (Array.isArray(this.variantAttrNames) && this.variantAttrNames.length > 0) {
      this.variantAttrNames.forEach((name, i) => {
        const val = document.getElementById(`variantAttr_${i}`)?.value.trim() || '';
        attrs.push({ name: name, value: val });
      });
    } else {
      const newContainer = document.querySelector('#addVariantModal #newAttrsContainer');
      if (newContainer) {
        const pairs = Array.from(newContainer.querySelectorAll('.attr-pair'));
        const names = [];
        pairs.forEach((pair) => {
          const inputs = pair.querySelectorAll('input');
          const nm = inputs[0]?.value.trim() || '';
          const val = inputs[1]?.value.trim() || '';
          if (nm) {
            names.push(nm);
            attrs.push({ name: nm, value: val });
          }
        });
        if (names.length > 0) this.variantAttrNames = names;
      } else {
        const color = document.getElementById('variantColor')?.value.trim() || '';
        const size = document.getElementById('variantSize')?.value.trim() || '';
        attrs.push({ name: 'Màu sắc', value: color });
        attrs.push({ name: 'Kích cỡ', value: size });
      }
    }

    const price = Number((document.getElementById('variantPrice')?.value || 0)) || 0;
    const image = document.getElementById('variantImageUrl')?.value.trim() || '';

    const variant = {
      variant_id: `VAR_${Date.now()}`,
      attributes: attrs,
      price_modifier: price - (this.product.base_price || 0),
      stock_quantity: 0,
      sku: `SKU_${Date.now()}`,
      image_url: image
    };

    if (!Array.isArray(this.product.variants)) this.product.variants = [];
    this.product.variants.push(variant);
    this.renderVariants();

    // show success alert in-page that variant was added to the UI
    try {
      this.showAlert('Thêm biến thể thành công', 'success');
    } catch (e) {
      // ignore if DOM not ready
    }

    try {
      if (this.product && this.product.id) {
        const res = await axios.put(`${apiURL}${endpoints.PRODUCT}/${encodeURIComponent(this.product.id)}`, this.product);
        if (!res || (res.status !== 200 && res.status !== 204 && res.status !== 201)) {
          console.warn('Failed to persist variant to API, status:', res && res.status);
          try { this.showAlert('Đã thêm biến thể nhưng không thể lưu lên server (kiểm tra API).', 'warning'); } catch (e) { /* ignore */ }
        }
      } else {
        console.warn('Product has no id, cannot persist to API.');
      }
    } catch (err) {
      console.warn('Persisting new variant failed (API unreachable?):', err);
      try { this.showAlert('Đã thêm biến thể vào giao diện nhưng chưa lưu được vào server. Hãy ấn "Lưu thay đổi" để thử lại.', 'warning'); } catch (e) { /* ignore */ }
    }

    const addModalEl = document.getElementById('addVariantModal');
    if (addModalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getInstance(addModalEl) || new bootstrap.Modal(addModalEl);
      modalInstance.hide();
    }
  }

  showEditVariantModal(variantId) {
    this.editingVariantId = variantId;
    const variant = this._findVariantById(variantId);
    const attrs = Array.isArray(variant.attributes) ? variant.attributes : [];
    const price = typeof variant.price_modifier === 'number' ? (this.product.base_price || 0) + variant.price_modifier : (variant.price || 0);

    if (Array.isArray(this.variantAttrNames) && this.variantAttrNames.length > 0) {
      this.variantAttrNames.forEach((name, i) => {
        const val = attrs.find(a => String(a.name).trim().toLowerCase() === String(name).trim().toLowerCase())?.value || '';
        const el = document.getElementById(`editVariantAttr_${i}`);
        if (el) el.value = val;
      });
    } else {
      const color = attrs.find(a => /màu|color/i.test(a.name))?.value || attrs[0]?.value || '';
      const size = attrs.find(a => /kích|size|số lượng|kích thước/i.test(a.name))?.value || attrs[1]?.value || attrs[0]?.value || '';
      const cEl = document.getElementById('editVariantColor');
      const sEl = document.getElementById('editVariantSize');
      if (cEl) cEl.value = color;
      if (sEl) sEl.value = size;
    }

    const priceEl = document.getElementById('editVariantPrice');
    const imgEl = document.getElementById('editVariantImageUrl');
    if (priceEl) priceEl.value = price;
    if (imgEl) imgEl.value = variant.image_url || '';

    const modal = new bootstrap.Modal(document.getElementById('editVariantModal'));
    modal.show();
  }

  saveEditedVariant() {
    if (!this.editingVariantId) return;
    const variant = this._findVariantById(this.editingVariantId);
    if (!variant) return;
    const newAttrs = [];
    if (Array.isArray(this.variantAttrNames) && this.variantAttrNames.length > 0) {
      this.variantAttrNames.forEach((name, i) => {
        const val = document.getElementById(`editVariantAttr_${i}`)?.value.trim() || '';
        newAttrs.push({ name: name, value: val });
      });
    } else {
      const color = document.getElementById('editVariantColor')?.value.trim() || '';
      const size = document.getElementById('editVariantSize')?.value.trim() || '';
      newAttrs.push({ name: 'Màu sắc', value: color });
      newAttrs.push({ name: 'Kích cỡ', value: size });
    }
    const price = Number((document.getElementById('editVariantPrice')?.value || 0)) || 0;
    const image = document.getElementById('editVariantImageUrl')?.value.trim() || '';

    variant.attributes = newAttrs;
    variant.price_modifier = price - (this.product.base_price || 0);
    variant.image_url = image;

    this.renderVariants();

    const editModalEl = document.getElementById('editVariantModal');
    if (editModalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
      modalInstance.hide();
    }

    this.editingVariantId = null;
  }

  showDeleteVariantModal(variantId) {
    this.pendingVariantDeleteId = variantId;
    const modal = new bootstrap.Modal(document.getElementById('deleteVariantModal'));
    modal.show();
  }

  confirmDeleteVariant() {
    if (!this.pendingVariantDeleteId) return;
    this.product.variants = (this.product.variants || []).filter(v => (v.variant_id || v.variantId || v.id) !== this.pendingVariantDeleteId);
    this.renderVariants();
    this.pendingVariantDeleteId = null;
    const deleteModalEl = document.getElementById('deleteVariantModal');
    if (deleteModalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getInstance(deleteModalEl) || new bootstrap.Modal(deleteModalEl);
      modalInstance.hide();
    }
  }

  _findVariantById(id) {
    if (!this.product || !Array.isArray(this.product.variants)) return null;
    return this.product.variants.find(v => (v.variant_id || v.variantId || v.id) === id);
  }

  _formatPrice(val) {
    try {
      return new Intl.NumberFormat('vi-VN').format(Number(val)) + 'đ';
    } catch (e) {
      return String(val);
    }
  }

  showAlert(message, className = 'success') {
    try {
      const id = 'product-edit-alert';
      // remove existing
      const old = document.getElementById(id);
      if (old) old.remove();

      const el = document.createElement('div');
      el.id = id;
      el.className = `alert alert-${className} alert-dismissible fade show shadow-lg`;
      el.setAttribute('role', 'alert');
      el.style.position = 'fixed';
      el.style.top = '40px';
      el.style.right = '20px';
      el.style.width = '300px';
      el.style.zIndex = '1050';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-20px)';
      el.style.transition = 'all 0.6s ease';
      el.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
      document.body.appendChild(el);
      // animate in
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50);
      // auto remove
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        setTimeout(() => el.remove(), 600);
      }, 3000);
    } catch (e) {
      console.warn('showAlert failed', e);
    }
  }

  _escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]; });
  }
}
