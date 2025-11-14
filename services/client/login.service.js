export class Login {
  user = [];

  constructor() {}

  login(email, password) {
    axios.get("http://localhost:3000/users")
      .then(response => {
        if (response.status === 200) {
          this.user = response.data;

          const foundUser = this.user.find(u => 
            u.email === email && u.password === password
          );

          if (foundUser) {
            alert("Đăng nhập thành công!");
            localStorage.setItem("userLogin", JSON.stringify(foundUser));

            window.location.href = "http://127.0.0.1:5500/index.html";
          } else {
            alert("Sai email hoặc sai mật khẩu!");
          }
        }
      })
      .catch(error => alert("Lỗi đăng nhập:", error));
  }
}
