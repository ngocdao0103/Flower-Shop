import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

class DetailProductService {
  constructor() {
    this.init();
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const container = document.getElementById("detailProductContainer");
    if (!container) return;

    // If user was redirected back here after adding to cart, show deferred messages
    try {
      const successMsg = sessionStorage.getItem("cart_success_msg");
      const errorMsg = sessionStorage.getItem("cart_error_msg");
      const el = document.getElementById("alert_success");
      if (el) {
        if (successMsg) {
          el.classList.remove("alert-warning", "alert-danger");
          el.classList.add("alert-success");
          el.innerHTML =
            '<i class="bi bi-check-circle me-2"></i><div>' +
            successMsg +
            "</div>";
          el.style.display = "flex";
          sessionStorage.removeItem("cart_success_msg");
          setTimeout(() => {
            el.style.display = "none";
            el.innerHTML = "<div></div>";
          }, 4000);
        } else if (errorMsg) {
          el.classList.remove("alert-success", "alert-warning");
          el.classList.add("alert-danger");
          el.innerHTML =
            '<i class="bi bi-x-circle-fill me-2"></i><div>' +
            errorMsg +
            "</div>";
          el.style.display = "flex";
          sessionStorage.removeItem("cart_error_msg");
          setTimeout(() => {
            el.style.display = "none";
            el.innerHTML = "<div></div>";
          }, 4000);
        }
      }
    } catch (e) {
      console.warn("show pending cart message error", e);
    }

    if (!id) {
      container.innerHTML = `<div class="text-center py-5"><p class="text-muted">Không tìm thấy sản phẩm (id thiếu).</p></div>`;
      return;
    }

    try {
      const res = await axios.get(apiURL + endpoints.PRODUCT + "/" + id);
      if (res.status !== status.OK) {
        container.innerHTML = `<div class="text-center py-5"><p class="text-muted">Sản phẩm không tồn tại.</p></div>`;
        return;
      }

      const prod = res.data;
      container.innerHTML = this.template(prod);
      this.bindEvents(prod);
      this.loadFeaturedProducts(prod.id);
    } catch (err) {
      console.error("Load product detail error:", err);
      container.innerHTML = `<div class="text-center py-5"><p class="text-muted">Lỗi khi tải sản phẩm.</p></div>`;
    }
  }

  async loadFeaturedProducts(currentProductId) {
    try {
      const res = await axios.get(apiURL + endpoints.PRODUCT);
      if (res.status !== status.OK) return;

      const featured = (res.data || []).filter(
        (p) => p.is_featured && p.id !== currentProductId
      );
      this.renderFeatured(featured);
    } catch (err) {
      console.error("Load featured products error:", err);
    }
  }

  renderFeatured(products) {
    const container = document.querySelector(
      ".featured-products .row.mt-4.g-4"
    );
    if (!container) return;

    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    if (!products || products.length === 0) {
      container.innerHTML =
        '<div class="col-12 text-center py-3"><p class="text-muted">Không có sản phẩm nổi bật</p></div>';
      return;
    }

    let html = "";
    products.forEach((prod) => {
      let priceHtml = "";
      if (prod.sale_price && prod.sale_price > 0) {
        priceHtml = `
            <p class="text-danger fw-bold">${formatter.format(
              prod.sale_price
            )}</p>
            <s class="text-secondary">${formatter.format(prod.base_price)}</s>
        `;
      } else {
        priceHtml = `
            <p class="text-dark fw-bold">${formatter.format(
              prod.base_price
            )}</p>
        `;
      }

      html += `
        <div class="col-md-4 col-sm-6">
            <div class="product-card position-relative">
                <div class="product-img position-relative overflow-hidden">
                    <img src="${prod.image_url}" class="img-fluid" alt="${
        prod.name || ""
      }">

                    <div class="product-actions">
                      <a class="btn btn-light rounded-circle" href="detail_product.html?id=${
                        prod.id
                      }"><i class="bi bi-eye"></i></a>
                      <button class="btn btn-light rounded-circle"><i class="bi bi-cart4"></i></button>
                    </div>
                </div>

                <h6 class="mt-3">${prod.name}</h6>
                ${priceHtml}
            </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  template(p) {
    const fmt = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    const baseDisplayPrice = p.base_price;

    const attrNames = [];
    if (p.variants && Array.isArray(p.variants)) {
      for (const v of p.variants) {
        for (const a of v.attributes || []) {
          if (!attrNames.includes(a.name)) attrNames.push(a.name);
        }
      }
    }

    const priceHtml = ` <div id="priceDisplay" class="text-danger">${fmt.format(
      baseDisplayPrice
    )}</div>`;

    const selectHtml = (() => {
      if (!attrNames || attrNames.length === 0) return "";
      const names = attrNames.slice(0, 2);
      let out = "";
      names.forEach((name, idx) => {
        const values = Array.from(
          new Set(
            (p.variants || [])
              .map((v) => {
                const attr = (v.attributes || []).find((a) => a.name === name);
                return attr ? attr.value : null;
              })
              .filter((x) => x != null)
          )
        );

        out += `
          <div class="mb-2 w-50 me-3">
            <label class="form-label small d-block text-truncate">${name}</label>
            <select class="form-select form-select-sm w-100" id="selectAttr${idx}" data-attr-name="${name}">
              <option value="" disabled selected>Chọn ${name}</option>
              ${values
                .map((vv) => `<option value="${vv}">${vv}</option>`)
                .join("")}
            </select>
          </div>
        `;
      });
      return out;
    })();

    return `
      <div class="row g-4 d-flex justify-content-center">
        <div class="col-lg-5 col-md-6 col-12">
          <div class="product-img-detail mb-3">
            <div class="ratio ratio-4x3 rounded bg-white">
              <img id="mainProductImage" src="${
                p.image_url ||
                "https://via.placeholder.com/520x400?text=No+Image"
              }" alt="${
      p.name || ""
    }" class="img-fluid w-100 h-100  object-fit-cover picture">
            </div>
          </div>
        </div>

        <div class="col-lg-5 col-md-6 col-12">
          <h3 class="mb-2">${p.name || ""}</h3>
          <h4 class="price-detail mb-1 text-success fw-bold">
            ${priceHtml}
          </h4>
          <p class="text-muted mb-2">SKU: ${p.sku || p.id}</p>
          <p id="shortDescription">${
            p.short_description || p.description || ""
          }</p>

          <div id="variantSelectors" class="mb-5">
            ${selectHtml}
            <div id="variantMessage" class="small text-danger mt-1"></div>
            <div id="adminMessage" class="small text-danger mt-1"></div>
          </div>

          <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-4">
              <div class="d-flex align-items-center border p-1 rounded">
                <button class="btn btn-light border-0 px-3 fw-bold" id="qtyMinus">−</button>
                <input type="text" class="form-control border-0 text-center" id="qtyInput" value="1" style="width: 60px;">
                <button class="btn btn-light border-0 px-3 fw-bold" id="qtyPlus">+</button>
              </div>
              <div>
                <button class="btn btn-dark px-4" id="btnAddToCart">
                  <span class="text">Thêm vào giỏ</span>
                </button>
              </div>
            </div>
        </div>
      </div>

      <div class="product-tabs mt-5">
        <ul class="nav nav-tabs border-0" id="productTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">Mô tả</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="rev-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">Đánh giá</button>
          </li>
        </ul>

        <div class="tab-content p-4 bg-white border border-top-0" id="productTabContent">
          <div class="tab-pane fade show active" id="description" role="tabpanel">
            <p>${p.description || ""}</p>
          </div>
          <div class="tab-pane fade" id="reviews" role="tabpanel">
            <div class="review-box border p-4 mb-4">
              <div class="d-flex mb-2">
                <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" width="50" height="50" class="me-3 rounded-circle" alt="User">
                <div>
                  <div class="text-warning">★★★★☆</div>
                  <strong>Quản trị viên</strong>
                  <p class="mt-2 mb-0">No reviews yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderThumbs(p) {
    if (!p.images || !Array.isArray(p.images) || p.images.length === 0)
      return ` <img src="${p.image_url || ""}" class="me-2" width="60"> `;
    return p.images
      .map((img) => `<img src="${img}" class="me-2" width="60">`)
      .join("");
  }

  bindEvents(prod) {
    const qtyInput = document.getElementById("qtyInput");
    const plus = document.getElementById("qtyPlus");
    const minus = document.getElementById("qtyMinus");
    const addBtn = document.getElementById("btnAddToCart");

    const select0 = document.getElementById("selectAttr0");
    const select1 = document.getElementById("selectAttr1");
    const variantMessage = document.getElementById("variantMessage");
    const adminMessage = document.getElementById("adminMessage");
    const isAdmin = !!sessionStorage.getItem("admin_login");
    // initial admin state: disable add button and show message if admin
    if (isAdmin) {
      if (addBtn) addBtn.disabled = true;
      if (adminMessage)
        adminMessage.textContent =
          "Admin không thể thực hiện chức năng mua hàng";
    } else {
      if (adminMessage) adminMessage.textContent = "";
    }
    const mainImage = document.getElementById("mainProductImage");
    const priceDisplay = document.getElementById("priceDisplay");

    const findVariantBySelection = () => {
      const selects = Array.from(
        document.querySelectorAll("#variantSelectors select")
      );
      const selections = selects
        .map((s) => ({ name: s.dataset.attrName, value: s.value }))
        .filter((s) => s.value);

      const totalSelects = selects.length;

      if (selections.length < totalSelects) return null;

      return (
        (prod.variants || []).find((v) => {
          return selections.every((sel) => {
            const attr = (v.attributes || []).find((a) => a.name === sel.name);
            return attr && attr.value === sel.value;
          });
        }) || null
      );
    };

    const updateVariantUI = () => {
      const selects = Array.from(
        document.querySelectorAll("#variantSelectors select")
      );
      const selections = selects
        .map((s) => ({ name: s.dataset.attrName, value: s.value }))
        .filter((s) => s.value);
      const totalSelects = selects.length;

      if (selections.length === 0) {
        variantMessage.textContent = "";
        addBtn.disabled = true;
        mainImage.src = prod.image_url || mainImage.src;
        priceDisplay.textContent = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(prod.base_price);
        return;
      }

      if (selections.length < totalSelects) {
        variantMessage.textContent = "Vui lòng chọn đầy đủ thuộc tính.";
        addBtn.disabled = true;
        mainImage.src = prod.image_url || mainImage.src;
        priceDisplay.textContent = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(prod.base_price);
        return;
      }

      const variant = findVariantBySelection();
      if (!variant) {
        variantMessage.textContent = "Không có hàng cho lựa chọn này.";
        addBtn.disabled = true;
        mainImage.src = prod.image_url || mainImage.src;
        priceDisplay.textContent = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(prod.base_price);
        return;
      }

      variantMessage.textContent = "";
      addBtn.disabled = false;
      // if admin, keep add disabled and show admin message
      if (isAdmin) {
        addBtn.disabled = true;
        if (adminMessage)
          adminMessage.textContent =
            "Admin không thể thực hiện chức năng mua hàng";
      } else {
        if (adminMessage) adminMessage.textContent = "";
      }
      if (variant.image_url) mainImage.src = variant.image_url;
      const finalPrice = prod.base_price + (variant.price_modifier || 0);
      priceDisplay.textContent = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(finalPrice);
    };

    select0?.addEventListener("change", updateVariantUI);
    select1?.addEventListener("change", updateVariantUI);

    plus?.addEventListener("click", () => {
      let v = parseInt(qtyInput.value) || 1;
      v++;
      qtyInput.value = v;
    });
    minus?.addEventListener("click", () => {
      let v = parseInt(qtyInput.value) || 1;
      v = Math.max(1, v - 1);
      qtyInput.value = v;
    });

    addBtn?.addEventListener("click", async () => {
      const qty = parseInt(qtyInput.value) || 1;
      const selectedVariant = findVariantBySelection();
      const userId = sessionStorage.getItem("customer_login");

      // Prevent admin users from performing add-to-cart even if button enabled programmatically
      if (isAdmin) {
        if (adminMessage)
          adminMessage.textContent =
            "Admin không thể thực hiện chức năng mua hàng";
        return;
      }

      const showPageAlert = (msg, type = "success") => {
        try {
          const key =
            type === "success"
              ? "cart_success"
              : type === "warning"
              ? "cart_warning"
              : "cart_error";
          sessionStorage.setItem(key, "1");
          const el = document.getElementById("alert_success");
          if (el) {
            el.classList.remove(
              "alert-success",
              "alert-warning",
              "alert-danger"
            );
            let iconHtml = '<i class="bi bi-check-circle-fill me-2"></i>';
            if (type === "success") {
              el.classList.add("alert-success");
              iconHtml = '<i class="bi bi-check-circle-fill me-2"></i>';
            } else if (type === "warning") {
              el.classList.add("alert-warning");
              iconHtml = '<i class="bi bi-exclamation-triangle-fill me-2"></i>';
            } else {
              el.classList.add("alert-danger");
              iconHtml = '<i class="bi bi-x-circle-fill me-2"></i>';
            }

            el.innerHTML = iconHtml + `<div><span>${msg}</span></div>`;
            el.style.display = "flex";
            setTimeout(() => {
              sessionStorage.removeItem(key);
              el.style.display = "none";
              el.classList.remove(
                "alert-success",
                "alert-warning",
                "alert-danger"
              );
            }, 4000);
          } else {
            alert(msg);
          }
        } catch (e) {
          console.warn("showPageAlert error", e);
        }
      };

      if (!userId) {
        // showPageAlert(
        //   "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
        //   "warning"
        // );
        sessionStorage.setItem("buy_must_login", "Vui lòng đăng nhập");
        window.location.href = "http://127.0.0.1:5501/pages/client/login.html";
        return;
      }

      if (!selectedVariant) {
        if (variantMessage)
          variantMessage.textContent = "Không có hàng cho lựa chọn này.";
        return;
      }

      const newItem = {
        cart_item_id: Date.now(),
        product_id: prod.id,
        variant_id: selectedVariant.variant_id,
        quantity: qty,
      };
      try {
        const cartsRes = await axios.get(
          `${apiURL + endpoints.CART}?user_id=${userId}`
        );
        if (cartsRes.status !== status.OK)
          throw new Error("Không thể lấy giỏ hàng");
        const existing = (cartsRes.data || [])[0];
        if (!existing) {
          const payload = {
            user_id: userId,
            items: [newItem],
          };
          const createRes = await axios.post(apiURL + endpoints.CART, payload);
          if (
            createRes.status === status.CREATED ||
            createRes.status === status.OK
          ) {
            // showPageAlert("Đã thêm sản phẩm vào giỏ hàng.", "success");
            sessionStorage.setItem("add_to_cart", "Thêm thành công");
            window.location.reload();
          } else {
            throw new Error("Tạo giỏ hàng thất bại");
          }
        } else {
          const updated = { ...existing };
          updated.items = updated.items || [];
          const found = updated.items.find(
            (it) =>
              it.product_id === newItem.product_id &&
              it.variant_id === newItem.variant_id
          );
          if (found) {
            found.quantity = (parseInt(found.quantity) || 0) + newItem.quantity;
          } else {
            updated.items.push(newItem);
          }
          const putRes = await axios.put(
            `${apiURL + endpoints.CART}/${existing.id}`,
            updated
          );
          if (putRes.status === status.OK) {
            // defer showing success until next page load
            sessionStorage.setItem("cart_success_msg", "Thêm thành công");
          } else {
            throw new Error("Cập nhật giỏ hàng thất bại");
          }
        }
      } catch (err) {
        console.error("Add to cart error:", err);
        sessionStorage.setItem(
          "cart_error_msg",
          "Có lỗi khi thêm vào giỏ hàng. Vui lòng thử lại sau."
        );
      }
    });
  }
}

new DetailProductService();
