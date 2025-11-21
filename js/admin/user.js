import { User } from "../../services/admin/user.service.js";
const user = new User();

const create_us = document.getElementById("btn_submit_user");
if (create_us) {
  create_us.addEventListener("click", submit);
}

function submit() {
  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const role = document.getElementById("role").value;
  const status = document.getElementById("status").value;
  const nameError = document.getElementById("name_error");
  const passwordError = document.getElementById("password_error");
  const emailError = document.getElementById("email_error");
  const phoneError = document.getElementById("phone_error");
  const addressError = document.getElementById("address_error");


  nameError.innerText = "";
  passwordError.innerText = "";
  emailError.innerText = "";
  phoneError.innerText = "";
  addressError.innerText = "";

  let isError = false;

  if (name === "") {
    nameError.innerText = "Vui lòng điền tên người dùng";
    isError = true;
  } else if (
    Array.isArray(user.users) &&
    user.users.some((item) => item.name.toLowerCase() === name.toLowerCase())
  ) {
    nameError.innerText = "Tên người dùng đã tồn tại";
    isError = true;
  }

  if (password === "") {
    passwordError.innerText = "Vui lòng nhập mật khẩu";
    isError = true;
  }

   if (email === "") {
    emailError.innerText = "Vui lòng điền email";
    isError = true;
  } else if (
    Array.isArray(user.users) &&
    user.users.some((item) => item.email.toLowerCase() === email.toLowerCase())
  ) {
    emailError.innerText = "Email đã tồn tại";
    isError = true;
  }

  if (phone === "") {
    phoneError.innerText = "Vui lòng nhập số điện thoại";
    isError = true;
  } else if (!/^0\d{9,10}$/.test(phone)) {
    phoneError.innerText =
      "Số điện thoại phải bắt đầu bằng 0 và có 10 đến 11 số";
    isError = true;
  }

  if (address === "") {
    addressError.innerText = "Vui lòng điền địa chỉ";
    isError = true;
  }

  if (isError) return;
  user.create(name, password, email, phone, address, role, status);
  user.List();
  nameError.innerText = "";
  passwordError.innerText = "";
  emailError.innerText = "";
  phoneError.innerText = "";
  addressError.innerText = "";
}

let deleteId = null;

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-delete");
  if (!btn) return;

  deleteId = btn.dataset.id;
  new bootstrap.Modal(document.getElementById("deleteModal")).show();
});

document.querySelector("#btn_delete").addEventListener("click", () => {
  if (!deleteId) return;
  const us = user.users.find((item) => item.id == deleteId);
  if (us.role == "admin"){
    alert("Không thể xóa quản trị viên!");
    deleteId = null;
    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
    return;
  }
  user.delete(deleteId);
  bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
});

const deleteModalEl = document.getElementById("deleteModal");
deleteModalEl.addEventListener("hidden.bs.modal", () => {
  deleteId = null;
});


let editId = null;
const editModalEl = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalEl);
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-edit");
  if (!btn) return;
  editId = btn.dataset.id;
  const us = user.users.find((item) => item.id == editId);
  if (!us) return;
  document.getElementById("edit_name").value = us.name;
  document.getElementById("edit_email").value = us.email;
  document.getElementById("edit_phone").value = us.phone;
  document.getElementById("edit_address").value = us.address;
  document.getElementById("edit_role").value = us.role;
  document.getElementById("edit_status").value = us.status;

  const reasonGroup = document.getElementById("reason_group");
  const editReason = document.getElementById("edit_reason");
  if (us.status == "0") {
    reasonGroup.style.display = "block";
    editReason.value = us.reason || "";
  } else {
    reasonGroup.style.display = "none";
    editReason.value = "";
  }

  const editRole = document.getElementById("edit_role");

if (us.role == "admin") {
    editRole.disabled = true;
} else {
    editRole.disabled = false;
}

  editModal.show();
});

const editStatus = document.getElementById("edit_status");
const reasonGroup = document.getElementById("reason_group");
editStatus.addEventListener("change", () => {
  if (editStatus.value === "0") {
    reasonGroup.style.display = "block";
  } else {
    reasonGroup.style.display = "none";
    document.getElementById("edit_reason").value = "";
  }
});

document.getElementById("btn_edit_user").addEventListener("click", (e) => {
  if (!editId) return;
  e.preventDefault();
  const name = document.getElementById("edit_name").value;
  const email = document.getElementById("edit_email").value;
  const phone = document.getElementById("edit_phone").value;
  const address = document.getElementById("edit_address").value;
  const role = document.getElementById("edit_role").value;
  const status = document.getElementById("edit_status").value;
  const reason = document.getElementById("edit_reason").value || "";

  const  us = user.users.find((item) => item.id == editId);
  const password = us.password;
  user.edit(name,password, email, phone, address, role, status, editId, reason);

  editId = null;
  editModal.hide();
});
