import { ProductEditService } from '../../services/admin/product_edit.service.js';
import { apiURL } from "../../environments/environment.js";
import { endpoints } from "../../config/api-endpoint.config.js";

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const service = new ProductEditService();

// Cloudinary config (same as product.js)
const CLOUD_NAME = "dfa75ewka";
const UPLOAD_PRESET = "code-js";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

let _currentImageTargetId = null;
let _selectedFile = null;

function renderPreviewInModal(file) {
  const previewContainer = document.getElementById('preview-container');
  if (!previewContainer) return;
  previewContainer.innerHTML = '';
  if (!file) return;

  const col = document.createElement('div');
  col.className = 'col-3';
  const card = document.createElement('div');
  card.className = 'card p-2';
  const img = document.createElement('img');
  img.className = 'img-fluid';
  img.style.maxHeight = '150px';
  img.src = URL.createObjectURL(file);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'd-flex gap-2 mt-2';

  const selectBtn = document.createElement('button');
  selectBtn.className = 'btn btn-outline-primary btn-sm flex-fill';
  selectBtn.textContent = 'Select as Image';
  selectBtn.addEventListener('click', () => {
    if (!_currentImageTargetId) return;
    const target = document.getElementById(_currentImageTargetId);
    const addPreview = document.getElementById('editProductImagePreview');
    if (target) target.value = ''; // cleared until upload completes
    if (addPreview) {
      addPreview.src = img.src;
    }
    _selectedFile = file;
  });

  btnGroup.appendChild(selectBtn);
  card.appendChild(img);
  card.appendChild(btnGroup);
  col.appendChild(card);
  previewContainer.appendChild(col);
}

async function uploadToCloudinary(file) {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url || data.url;
}

function initImageUploadModal() {
  const fileInput = document.getElementById('file-input');
  const dropZone = document.getElementById('drop-zone');
  const uploadBtn = document.getElementById('upload-all-button');
  if (!fileInput || !dropZone || !uploadBtn) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      _selectedFile = file;
      renderPreviewInModal(file);
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('bg-white');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('bg-white');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('bg-white');
    const dt = e.dataTransfer;
    const file = dt.files && dt.files[0];
    if (file) {
      _selectedFile = file;
      renderPreviewInModal(file);
    }
  });

  uploadBtn.addEventListener('click', async () => {
    if (!_selectedFile) {
      alert('Please select an image first');
      return;
    }
    try {
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';
      const url = await uploadToCloudinary(_selectedFile);
      if (_currentImageTargetId) {
        const target = document.getElementById(_currentImageTargetId);
        if (target) target.value = url;
      }
      const addPreview = document.getElementById('editProductImagePreview');
      if (addPreview) addPreview.src = url;
      const modalEl = document.getElementById('imageUploadModal');
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload Selected Images';
    }
  });
}

window.openImageUploadModal = function (targetInputId) {
  _currentImageTargetId = targetInputId;
  _selectedFile = null;
  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) previewContainer.innerHTML = '';
  const fileInput = document.getElementById('file-input');
  if (fileInput) fileInput.value = '';
  const modalEl = document.getElementById('imageUploadModal');
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
};


async function saveChanges(id) {
  const name = document.getElementById('editProductName')?.value.trim();
  const base_price = Number((document.getElementById('editProductPrice')?.value || 0)) || 0;
  const category = document.getElementById('editProductCategory')?.value || '';
  const image_url = document.getElementById('editProductImageUrl')?.value.trim() || '';
  const description = document.getElementById('editProductDescription')?.value.trim() || '';

  const priceErrorEl = document.getElementById('editProductPriceError');
  const imageErrorEl = document.getElementById('editProductImageError');
  if (priceErrorEl) priceErrorEl.textContent = '';
  if (imageErrorEl) imageErrorEl.textContent = '';

  // validate all fields and show all errors at once
  let hasError = false;
  if (!name) {
    if (priceErrorEl) {} // keep linter happy
    // name field uses alert in this context, but we'll show inline errors for others
    // show alert only if name missing (because edit UI doesn't have a nameError element)
    alert('Tên sản phẩm không được để trống');
    hasError = true;
  }

  if (isNaN(base_price) || Number(base_price) <= 0) {
    if (priceErrorEl) priceErrorEl.textContent = 'Giá phải là số dương và không được để trống';
    hasError = true;
  }

  if (!image_url) {
    if (imageErrorEl) imageErrorEl.textContent = 'Vui lòng chọn hoặc upload hình ảnh';
    hasError = true;
  }

  if (hasError) return;

  const payload = Object.assign({}, service.product, {
    name,
    base_price,
    category,
    image_url,
    description,
  });

  try {
    const res = await axios.put(`${apiURL}${endpoints.PRODUCT}/${encodeURIComponent(id)}`, payload);
    if (res && (res.status === 200 || res.status === 204 || res.status === 201)) {
      // set flash message for successful edit and redirect to product list
      sessionStorage.setItem('successMessage', 'Cập nhật sản phẩm thành công');
      sessionStorage.setItem('classMessage', 'success');
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

  // populate category select from db.json before rendering the form
  await loadEditCategories();

  await service.load(id);

  console.log('product_edit.init: id=', id, 'loaded product=', service.product);

  // initialize image upload modal listeners (if modal exists)
  try { initImageUploadModal(); } catch (e) { /* ignore if modal missing */ }

  const imageInput = document.getElementById('editProductImageUrl');
  if (imageInput) {
    imageInput.addEventListener('input', (e) => {
      const preview = document.getElementById('editProductImagePreview');
      if (preview) preview.src = e.target.value || preview.src;
    });
  }

  // clear validation errors on input
  const priceInputEl = document.getElementById('editProductPrice');
  if (priceInputEl) {
    priceInputEl.addEventListener('input', () => {
      const err = document.getElementById('editProductPriceError');
      if (err) err.textContent = '';
    });
  }
  const imageInputEl = document.getElementById('editProductImageUrl');
  if (imageInputEl) {
    imageInputEl.addEventListener('input', () => {
      const err = document.getElementById('editProductImageError');
      if (err) err.textContent = '';
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

async function loadEditCategories() {
  try {
    const res = await axios.get('/data/db.json');
    const data = res && res.data ? res.data : {};
    const categories = Array.isArray(data.categories) ? data.categories : [];
    const sel = document.getElementById('editProductCategory');
    if (!sel) return;
    sel.innerHTML = categories.map(c => `<option value="${(c.name||'').replace(/"/g,'&quot;')}">${c.name || ''}</option>`).join('');
  } catch (err) {
    console.warn('loadEditCategories: failed to load categories', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
