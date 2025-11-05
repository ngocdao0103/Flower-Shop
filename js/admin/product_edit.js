import { ProductEditService } from '../../services/admin/product_edit.service.js';
import { apiURL } from "../../environments/environment.js";
import { endpoint } from "../../config/api-endpoint.config.js";

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const service = new ProductEditService();

async function saveChanges(id) {
  const name = document.getElementById('editProductName')?.value.trim();
  const base_price = Number((document.getElementById('editProductPrice')?.value || 0)) || 0;
  const category = document.getElementById('editProductCategory')?.value || '';
  const image_url = document.getElementById('editProductImageUrl')?.value.trim() || '';
  const description = document.getElementById('editProductDescription')?.value.trim() || '';

  if (!name) {
    alert('Tên sản phẩm không được để trống');
    return;
  }

  const payload = Object.assign({}, service.product, {
    name,
    base_price,
    category,
    image_url,
    description,
  });

  try {
    const res = await axios.put(`${apiURL}${endpoint.PRODUCT}/${encodeURIComponent(id)}`, payload);
    if (res && (res.status === 200 || res.status === 204 || res.status === 201)) {
      window.location.href = 'product.html';
    } else {
      alert('Lưu thay đổi không thành công.');
    }
  } catch (err) {
    console.error('Update failed', err);
    alert('Lưu thay đổi thất bại. Kiểm tra console để biết chi tiết.');
  }
}

async function init() {
  const id = getQueryParam('id');
  if (!id) {
    alert('Không có id sản phẩm.');
    return;
  }

  await service.load(id);

  const imageInput = document.getElementById('editProductImageUrl');
  if (imageInput) {
    imageInput.addEventListener('input', (e) => {
      const preview = document.getElementById('editProductImagePreview');
      if (preview) preview.src = e.target.value || preview.src;
    });
  }

  const saveBtn = document.getElementById('saveEditBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveChanges(id);
    });
  }

  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'product.html';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
