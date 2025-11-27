import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class Home {
  products = [];
  articles = [];

  constructor() {}

  renderHomeFuture() {
    let html = ``;
    const featured = this.products.filter((p) => p.is_featured == true);
    const SortProduct = featured.slice(-4).reverse();

    SortProduct.forEach((item) => {
      const hasSale = item.sale_price && item.sale_price > 0;

      html += `
         <div class="col-12 col-lg-3 col-md-6">
        <div class="card product-card-home h-100 border-0 rounded-1 position-relative overflow-hidden">

          <div class="image-wrapper">
            <img 
             src="${item.image_url}"
             alt="${item.name}"
             style="width:100%;height:280px;object-fit:cover;"
             />

            <div class="product-actions d-flex justify-content-center align-items-center">
               <a class="btn btn-light btn-sm me-2" href="./pages/client/detail_product.html?id=${
                 item.id
               }"><i class="bi bi-eye"></i></a>
            </div>
          </div>

          <div class="card-body text-center">
            <h5 class="card-title">${item.name}</h5>

            <span class="d-flex justify-content-center align-items-center gap-2 py-1">

              ${
                hasSale
                  ? `
                    <p class="card-text mb-0 fw-bold  text-danger">
                        ${item.base_price.toLocaleString("vi-VN")}₫
                      </p>
                    `
                  : `
                      <p class="card-text mb-0 fw-bold  text-danger">
                        ${item.base_price.toLocaleString("vi-VN")}₫
                      </p>
                    `
              }

            </span>
          </div>
        </div>
      </div>
    `;
    });

    if (document.getElementById("List")) {
      document.getElementById("List").innerHTML = html;
    }
  }

  renderHomeBlog() {
    let html = ``;
    const SortArticles = this.articles.slice(-4).reverse();

    SortArticles.forEach((item) => {
      const shortContent =
        item.content.length > 100
          ? item.content.substring(0, 100) + "..."
          : item.content;

      html += `
         <div class="col-12 col-lg-3 col-md-6">
    <a href="./pages/client/detail_blog.html?blog=${item.slug}">
      <div class="card blog-card border-0 shadow-sm h-100">
        <img
          src="${item.thumbnail_url}"
          class="card-img-top"
          alt="Blog image"
          style="height: 250px; object-fit: cover"
          loading="lazy"
        />
        <div class="card-body d-flex flex-column">
          <h5
            class="card-title"
            style="
              min-height: 50px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            "
          >
            ${item.title}
          </h5>
          <small class="text-muted d-block mb-2">
            ${item.author || "Không rõ"} ${new Date(
        item.created_at
      ).toLocaleDateString("vi-VN")}
          </small>
          <p
            class="card-text"
            style="
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            "
          >
            ${shortContent}
          </p>
        </div>
      </div>
    </a>
  </div>
    `;
    });

    if (document.getElementById("ListBlog")) {
      document.getElementById("ListBlog").innerHTML = html;
    }
  }

  ListFuture() {
    axios
      .get(apiURL + endpoints.PRODUCT)
      .then((res) => {
        if (res.status === status.OK) {
          this.products = res.data;
          this.renderHomeFuture();
        }
      })
      .catch((err) => console.error(err));
  }

  ListBlog() {
    axios
      .get(apiURL + endpoints.BLOG)
      .then((res) => {
        if (res.status === status.OK) {
          this.articles = res.data;
          this.renderHomeBlog();
        }
      })
      .catch((err) => console.error(err));
  }
}
