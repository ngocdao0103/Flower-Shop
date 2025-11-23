import { Home } from "../../services/client/home.service.js";
const home = new Home();

// sản phẩm nổi bật
home.ListFuture();
// bài viết mới nhất
home.ListBlog();
