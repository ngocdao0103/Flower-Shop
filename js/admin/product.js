import {ProductService} from "../../services/admin/product.service.js";

const productService = new ProductService();

function parsePrice(str) {
	if (!str) return 0;
	const num = String(str).replace(/[^0-9.-]+/g, '');
	return Number(num) || 0;
}

function clearAddForm() {
	const name = document.getElementById('productName');
	const price = document.getElementById('productPrice');
	const category = document.getElementById('productCategory');
	const image = document.getElementById('productImageUrl');
	if (name) name.value = '';
	if (price) price.value = '';
	if (category) category.selectedIndex = 0;
	if (image) image.value = '';
}

async function init() {
	await productService.getList();

	const saveBtn = document.getElementById('saveProductBtn');
	if (saveBtn) {
		saveBtn.addEventListener('click', (evt) => {
			evt.preventDefault();
			const nameInput = document.getElementById('productName');
			const priceInput = document.getElementById('productPrice');
			const categoryInput = document.getElementById('productCategory');
			const imageInput = document.getElementById('productImageUrl');

			const name = nameInput?.value.trim();
			const price = parsePrice(priceInput?.value);
			const category = categoryInput?.value || '';
			const image_url = imageInput?.value.trim() || '';

			const nameError = document.getElementById('productNameError');
			if (nameError) nameError.textContent = '';

			if (!name) {
				if (nameError) nameError.textContent = 'Tên sản phẩm không được để trống!';
				return;
			}else if (name.length < 3) {
				if (nameError) nameError.textContent = 'Tên sản phẩm phải có ít nhất 3 ký tự!';
				return;
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
				image_url
			};

			productService.createProduct(payload);
			clearAddForm();
		});
	}

	window.productService = productService;
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

