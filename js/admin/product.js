import {ProductService} from "../../services/admin/product.service.js";

const productService = new ProductService();

// Cloudinary config
const CLOUD_NAME = "dfa75ewka";
const UPLOAD_PRESET = "code-js";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

let _currentImageTargetId = null;
let _selectedFile = null;

function parsePrice(str) {
	if (!str) return 0;
	const num = String(str).replace(/[^0-9.-]+/g, '');
	return Number(num) || 0;
}

function clearAddForm() {
	const name = document.getElementById('productName');
	const price = document.getElementById('productPrice');
	const category = document.getElementById('productCategory');
	const image = document.getElementById('productImage');
	const description = document.getElementById('productDescription');
	if (name) name.value = '';
	if (price) price.value = '';
	if (category) category.selectedIndex = 0;
	if (image) image.value = '';
	if (description) description.value = '';

	const preview = document.getElementById('productImagePreview');
	if (preview) {
		preview.src = '';
		preview.classList.add('d-none');
	}
}

async function init() {
	// load categories from local db (or API) into the Add modal select
	await loadCategories();
	await productService.getList();

	// show flash message from sessionStorage (if any)
	(function showFlashFromSession() {
		const message = sessionStorage.getItem('successMessage');
		const classMessage = sessionStorage.getItem('classMessage');
		if (!message) return;
		const alertHTML = `
		  <div id="custom-alert" class="alert alert-${classMessage || 'success'} alert-dismissible fade show shadow-lg" 
		       role="alert" 
		       style="
		         position: fixed; 
		         top: 40px; 
		         right: 20px; 
		         width: 300px; 
		         z-index: 1050; 
		         opacity: 0; 
		         transform: translateY(-20px);
		         transition: all 0.6s ease;
		       ">
		    ${message}
		    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		  </div>
		`;
		document.body.insertAdjacentHTML('beforeend', alertHTML);
		const alertBox = document.getElementById('custom-alert');
		setTimeout(() => {
			if (alertBox) {
				alertBox.style.opacity = '1';
				alertBox.style.transform = 'translateY(0)';
			}
		}, 100);
		setTimeout(() => {
			if (alertBox) {
				alertBox.style.opacity = '0';
				alertBox.style.transform = 'translateY(-20px)';
				setTimeout(() => alertBox && alertBox.remove(), 600);
			}
		}, 3000);
		sessionStorage.removeItem('successMessage');
		sessionStorage.removeItem('classMessage');
	})();

	const saveBtn = document.getElementById('saveProductBtn');
	if (saveBtn) {
		saveBtn.addEventListener('click', async (evt) => {
			evt.preventDefault();
			const nameInput = document.getElementById('productName');
			const priceInput = document.getElementById('productPrice');
			const categoryInput = document.getElementById('productCategory');
			const imageInput = document.getElementById('productImage');
			const descriptionInput = document.getElementById('productDescription');

			const name = nameInput?.value.trim();
			const price = parsePrice(priceInput?.value);
			const category = categoryInput?.value || '';
			const image_url = imageInput?.value.trim() || '';
			const description = descriptionInput?.value.trim() || '';

			const nameError = document.getElementById('productNameError');
			const priceError = document.getElementById('productPriceError');
			const imageError = document.getElementById('productImageError');
			if (nameError) nameError.textContent = '';
			if (priceError) priceError.textContent = '';
			if (imageError) imageError.textContent = '';

			// collect validation errors so all messages show at once
			let hasError = false;
			if (!name) {
				if (nameError) nameError.textContent = 'Không được để trống!';
				hasError = true;
			}

			// price validation: required and positive
			if (price == null || isNaN(price) || Number(price) <= 0) {
				if (priceError) priceError.textContent = 'Giá phải là số dương và không được để trống';
				hasError = true;
			}

			// image required
			if (!image_url) {
				if (imageError) imageError.textContent = 'Vui lòng chọn hoặc upload hình ảnh';
				hasError = true;
			} else {
				// enforce upload to Cloudinary (prevent external/pasted URLs)
				if (!image_url.includes(`res.cloudinary.com/${CLOUD_NAME}`)) {
					if (imageError) imageError.textContent = 'Vui lòng upload ảnh bằng nút "Select Image" (Cloud).';
					hasError = true;
				}
			}

			const isDuplicate = productService.productList.some((p) => p.name.toLowerCase() === name.toLowerCase());
			if (isDuplicate) {
				if (nameError) nameError.textContent = 'Tên sản phẩm đã tồn tại!';
				return;
			}

			const payload = {
				name,
				base_price: price,
				category,
				image_url,
				description
			};

			try {
				await productService.createProduct(payload);
				// set flash and reload so flash displays on page load
				sessionStorage.setItem('successMessage', 'Thêm sản phẩm thành công');
				sessionStorage.setItem('classMessage', 'success');
				// clear form then reload
				clearAddForm();
				window.location.reload();
			} catch (err) {
				console.error('Failed to create product (caller):', err);
				alert('Tạo sản phẩm thất bại. Xem console để biết chi tiết.');
			}
		});
	}

	// clear validation errors on input
	const priceInputEl = document.getElementById('productPrice');
	if (priceInputEl) {
		priceInputEl.addEventListener('input', () => {
			const err = document.getElementById('productPriceError');
			if (err) err.textContent = '';
		});
	}
	const imageInputEl = document.getElementById('productImage');
	if (imageInputEl) {
		imageInputEl.addEventListener('input', () => {
			const err = document.getElementById('productImageError');
			if (err) err.textContent = '';
		});
	}


	// Image upload modal logic

async function loadCategories() {
	try {
		const res = await axios.get('/data/db.json');
		const data = res && res.data ? res.data : {};
		const categories = Array.isArray(data.categories) ? data.categories : [];
		const sel = document.getElementById('productCategory');
		if (!sel) return;
		sel.innerHTML = categories.map(c => `<option value="${(c.name||'').replace(/"/g,'&quot;')}">${c.name || ''}</option>`).join('');
	} catch (err) {
		console.warn('loadCategories: failed to load categories', err);
	}
}
	function renderPreviewInModal(file) {
		const previewContainer = document.getElementById('preview-container');
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
			// set the value on target input and preview in add modal
			if (!_currentImageTargetId) return;
			const target = document.getElementById(_currentImageTargetId);
			const addPreview = document.getElementById('productImagePreview');
			if (target) target.value = ''; // cleared until upload completes
			if (addPreview) {
				addPreview.src = img.src;
				addPreview.classList.remove('d-none');
			}
			// remember selected file to upload when user clicks Upload
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
			body: form
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
				// put url into target input and preview
				if (_currentImageTargetId) {
					const target = document.getElementById(_currentImageTargetId);
					if (target) target.value = url;
				}
				const addPreview = document.getElementById('productImagePreview');
				if (addPreview) {
					addPreview.src = url;
					addPreview.classList.remove('d-none');
				}
				// close modal
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

	// called by the inline button in HTML
	window.openImageUploadModal = function(targetInputId) {
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

	// initialize modal handlers after DOM ready
	initImageUploadModal();

	window.productService = productService;
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

