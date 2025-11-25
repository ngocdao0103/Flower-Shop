import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

class CartService {
  constructor() {
    this.init();
  }

  async init() {
    const container = document.getElementById("cartContainer");
    if (!container) return;

    try {
      const successMsg = sessionStorage.getItem('cart_success_msg');
      const errorMsg = sessionStorage.getItem('cart_error_msg');
      const el = document.getElementById('alert_success');
      if (el) {
        if (successMsg) {
          el.classList.remove('alert-warning', 'alert-danger');
          el.classList.add('alert-success');
          el.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i><div>' + successMsg + '</div>';
          el.style.display = 'flex';
          sessionStorage.removeItem('cart_success_msg');
          setTimeout(() => { el.style.display = 'none'; el.innerHTML = '<div></div>'; }, 4000);
        } else if (errorMsg) {
          el.classList.remove('alert-success', 'alert-warning');
          el.classList.add('alert-danger');
          el.innerHTML = '<i class="bi bi-x-circle-fill me-2"></i><div>' + errorMsg + '</div>';
          el.style.display = 'flex';
          sessionStorage.removeItem('cart_error_msg');
          setTimeout(() => { el.style.display = 'none'; el.innerHTML = '<div></div>'; }, 4000);
        }
      }
    } catch (e) {
      console.warn('show pending cart message error', e);
    }

    const userId = sessionStorage.getItem("customer_login");
    if (!userId) {
      container.innerHTML = `
        <div class="text-center py-5">
          <p class="lead">Bạn chưa đăng nhập. Vui lòng <a href="../client/login.html">đăng nhập</a> để xem giỏ hàng.</p>
        </div>
      `;
      return;
    }

    try {
      const res = await axios.get(`${apiURL + endpoints.CART}?user_id=${userId}`);
      if (res.status !== status.OK) {
        container.innerHTML = `<div class="text-center py-5"><p class="text-muted">Không thể tải giỏ hàng.</p></div>`;
        return;
      }

      const cart = (res.data || [])[0];
      if (!cart || !cart.items || cart.items.length === 0) {
        container.innerHTML = `<div class="text-center py-5"><p class="lead">Giỏ hàng trống.</p></div>`;
        return;
      }

      const productsMap = {};
      await Promise.all(
        cart.items.map(async (it) => {
          try {
            const pRes = await axios.get(`${apiURL + endpoints.PRODUCT}/${it.product_id}`);
            if (pRes.status === status.OK) productsMap[it.product_id] = pRes.data;
          } catch (e) {
            console.warn('Failed load product', it.product_id, e);
          }
        })
      );

      container.innerHTML = this.template(cart, productsMap);
      this.bindEvents(cart, productsMap);

      try {
        const successMsg = sessionStorage.getItem('cart_success_msg');
        const errorMsg = sessionStorage.getItem('cart_error_msg');
        const el = document.getElementById('alert_success');
        if (el) {
          if (successMsg) {
            el.classList.remove('alert-warning', 'alert-danger');
            el.classList.add('alert-success');
            el.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i><div>' + successMsg + '</div>';
            el.style.display = 'flex';
            sessionStorage.removeItem('cart_success_msg');
            setTimeout(() => { el.style.display = 'none'; el.innerHTML = '<div></div>'; }, 4000);
          } else if (errorMsg) {
            el.classList.remove('alert-success', 'alert-warning');
            el.classList.add('alert-danger');
            el.innerHTML = '<i class="bi bi-x-circle-fill me-2"></i><div>' + errorMsg + '</div>';
            el.style.display = 'flex';
            sessionStorage.removeItem('cart_error_msg');
            setTimeout(() => { el.style.display = 'none'; el.innerHTML = '<div></div>'; }, 4000);
          }
        }
      } catch (e) {
        console.warn('show pending cart message error', e);
      }
    } catch (err) {
      console.error('Load cart error', err);
      container.innerHTML = `<div class="text-center py-5"><p class="text-muted">Lỗi khi tải giỏ hàng.</p></div>`;
    }
  }

  template(cart, productsMap) {
    const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
    let rows = '';
    let subtotal = 0;

    (cart.items || []).forEach((it) => {
      const p = productsMap[it.product_id] || {};
      const img = p.image_url || (p.images && p.images[0]) || 'https://via.placeholder.com/120x90?text=No+Image';
      const variant = (p.variants || []).find(v => v.variant_id === it.variant_id) || null;
      const price = (p.base_price || 0) + (variant ? (variant.price_modifier || 0) : 0);
      const qty = parseInt(it.quantity) || 1;
      const line = price * qty;
      subtotal += line;

      let variantLabel = '';
      if (variant) {
        if (variant.name) variantLabel = variant.name;
        else if (Array.isArray(variant.attributes) && variant.attributes.length) {
          variantLabel = variant.attributes.map(a => a.value).join(' / ');
        }
      }

      rows += `
        <tr data-item-id="${it.cart_item_id}">
          <td class="pro-thumbnail"><a href="#"><img src="${img}" alt="" style="max-width:120px; height:auto;"></a></td>
          <td class="pro-title">
            <a class="text-decoration-none" href="#">${p.name || 'Sản phẩm'}</a>
            ${variantLabel ? `<div class="small text-muted">${variantLabel}</div>` : ''}
          </td>
          <td class="pro-price text-success">${fmt.format(price)}</td>
          <td class="pro-quantity">
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-light dec">−</button>
              <input type="text" class="form-control form-control-sm mx-2 qty-input" value="${qty}" style="width:70px; text-align:center;">
              <button class="btn btn-sm btn-light inc">+</button>
            </div>
          </td>
          <td class="pro-subtotal text-danger">${fmt.format(line)}</td>
          <td class="pro-remove"><button class="btn btn-outline-danger btn-sm remove"><i class="bi bi-trash"></i></button></td>
        </tr>
      `;
    });

    const shipping = 30000;
    const total = subtotal + shipping;

    return `
      <div class="cart-main-wrapper mt-no-text">
        <div class="cart-table table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="pro-thumbnail">Ảnh</th>
                <th class="pro-title">Tên sản phẩm</th>
                <th class="pro-price">Giá</th>
                <th class="pro-quantity">Số lượng</th>
                <th class="pro-subtotal">Tổng cộng</th>
                <th class="pro-remove">Xóa</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>

        <div class="row">
          <div class="col-lg-5 ms-auto mt-4">
            <div class="cart-calculator-wrapper border p-3">
              <h5>Tóm tắt giỏ hàng</h5>
              <table class="table">
                <tbody>
                  <tr><td>Tạm tính</td><td id="cartSubtotal" class="fw-bold">${fmt.format(subtotal)}</td></tr>
                  <tr><td>Phí vận chuyển</td><td id="cartShipping" class="fw-bold">${fmt.format(shipping)}</td></tr>
                  <tr class="grand-total fw-bold"><td>Tổng cộng</td><td id="cartTotal" class="text-success">${fmt.format(total)}</td></tr>
                </tbody>
              </table>
              <a href="../client/checkout.html" class="btn btn-dark checkout-btn">Tiến hành thanh toán</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(cart, productsMap) {
    const table = document.querySelector('#cartContainer table');
    if (!table) return;

    const updateServer = async (updatedCart) => {
      try {
        const res = await axios.put(`${apiURL + endpoints.CART}/${cart.id}`, updatedCart);
        if (res.status === status.OK) {
          this.init();
        }
      } catch (e) {
        console.error('Update cart failed', e);
      }
    };

    table.querySelectorAll('tbody tr').forEach((tr) => {
      const itemId = tr.dataset.itemId;
      const dec = tr.querySelector('.dec');
      const inc = tr.querySelector('.inc');
      const qtyInput = tr.querySelector('.qty-input');
      const removeBtn = tr.querySelector('.remove');

      dec?.addEventListener('click', () => {
        let v = parseInt(qtyInput.value) || 1;
        v = Math.max(1, v - 1);
        qtyInput.value = v;
        const updated = { ...cart };
        updated.items = (updated.items || []).map(it => it.cart_item_id == itemId ? { ...it, quantity: v } : it);
        updateServer(updated);
      });

      inc?.addEventListener('click', () => {
        let v = parseInt(qtyInput.value) || 1;
        v = v + 1;
        qtyInput.value = v;
        const updated = { ...cart };
        updated.items = (updated.items || []).map(it => it.cart_item_id == itemId ? { ...it, quantity: v } : it);
        updateServer(updated);
      });

      removeBtn?.addEventListener('click', () => {
        const updated = { ...cart };
        updated.items = (updated.items || []).filter(it => it.cart_item_id != itemId);
        updateServer(updated);
      });
    });
  }
}

new CartService();
