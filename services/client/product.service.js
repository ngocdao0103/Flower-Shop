import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class ProductService {

    constructor() {
        this.searchKeyword = "";
        this.maxPrice = 5000000;
        this.selectedCategory = null;

        this.registerSearch();
        this.registerPriceFilter();

        this.loadCategories();
        this.loadProducts();
    }

    async loadCategories() {
        const categoryContainer = document.getElementById("categoryContainer");
        if (!categoryContainer) return;

        try {
            const res = await axios.get(apiURL + endpoints.CATEGORY);
            if (res.status !== status.OK) return;

            let html = "";
            res.data.forEach(cat => {
                html += `<span class="tag category-tag" data-id="${cat.id}">${cat.name}</span>`;
            });

            categoryContainer.innerHTML = html;
            this.registerCategoryClick();
        } catch (err) {
            console.error("Load category error:", err);
        }
    }

    async loadProducts() {
        try {
            const res = await axios.get(apiURL + endpoints.PRODUCT);
            if (res.status !== status.OK) return;

            this.allProducts = res.data;
            this.applyFilters();
        } catch (err) {
            console.error("Load product error:", err);
        }
    }

    applyFilters() {
        let filtered = [...this.allProducts];

        // Lọc theo danh mục
        if (this.selectedCategory) {
            filtered = filtered.filter(p => p.category_id == this.selectedCategory);
        }

        // Lọc theo giá
        filtered = filtered.filter(p => {
            let price = p.sale_price ?? p.base_price;
            return price <= this.maxPrice;
        });

        // Lọc theo tìm kiếm
        if (this.searchKeyword.trim() !== "") {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
            );
        }

        this.renderProducts(filtered);
    }

// Click danh mục
    registerCategoryClick() {
        document.querySelectorAll(".category-tag").forEach(tag => {
            tag.addEventListener("click", () => {

                document.querySelectorAll(".category-tag")
                    .forEach(t => t.classList.remove("active-category"));

                tag.classList.add("active-category");

                this.selectedCategory = tag.dataset.id;
                this.applyFilters();
            });
        });
    }

// Tìm kiếm
    registerSearch() {
        const searchInput = document.querySelector("input[placeholder='Tìm kiếm cửa hàng']");
        if (!searchInput) return;

        searchInput.addEventListener("input", () => {
            this.searchKeyword = searchInput.value;
            this.applyFilters();
        });
    }
// Lọc giá
    registerPriceFilter() {
        const priceRange = document.getElementById("priceRange");
        const priceLabel = document.querySelector(".price-label");
        const filterBtn = document.querySelector(".filter-btn");

        if (!priceRange || !priceLabel) return;

        priceRange.addEventListener("input", () => {
            let value = priceRange.value * 10000;
            priceLabel.textContent = `0đ - ${value.toLocaleString()}đ`;
            this.maxPrice = value;
        });

        filterBtn.addEventListener("click", () => {
            this.applyFilters();
        });
    }

    renderProducts(products) {
        const productContainer = document.getElementById("productContainer");
        productContainer.innerHTML = "";

        const formatter = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        });

        // Nếu không có sản phẩm
        if (products.length === 0) {
            productContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">Không tìm thấy sản phẩm phù hợp</p>
            </div>
        `;
            return;
        }

        let html = "";

        products.forEach(prod => {

            let priceHtml = "";
            if (prod.sale_price) {
                priceHtml = `
                <p class="text-danger fw-bold">${formatter.format(prod.sale_price)}</p>
                <s class="text-secondary">${formatter.format(prod.base_price)}</s>
            `;
            } else {
                priceHtml = `
                <p class="text-dark fw-bold">${formatter.format(prod.base_price)}</p>
            `;
            }

            html += `
            <div class="col-md-4 col-sm-6">
                <div class="product-card position-relative">

                    <div class="product-img position-relative overflow-hidden">
                        <img src="${prod.image_url}" class="img">

                        <div class="product-actions">
                            <button class="btn btn-light rounded-circle"><i class="bi bi-eye"></i></button>
                            <button class="btn btn-light rounded-circle"><i class="bi bi-cart4"></i></button>
                        </div>
                    </div>

                    <h6 class="mt-3">${prod.name}</h6>
                    ${priceHtml}
                </div>
            </div>
        `;
        });

        productContainer.innerHTML = html;
    }

}

