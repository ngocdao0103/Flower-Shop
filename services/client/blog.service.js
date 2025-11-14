import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class BlogService {
    id;
    title;
    slug;
    content;
    thumbnail_url;
    author;
    category;
    created_at;
    blog = [];

    constructor() {
        this.renderBlogCard();
    }

    async renderBlogCard() {
        const cardBlog = document.getElementById("card-blog");
        const res = await axios.get(apiURL + endpoints.BLOG);
        if (res.status == status.OK) {
            this.blog = res.data;
            console.log(this.blog);
            let index = 0;
            let html = ``;
            this.blog.forEach(blog => {
                index++;
                let shortContent = blog.content.length > 50
                    ? blog.content.substring(0, 50) + "..."
                    : blog.content;
                html += `
                    <div class="col-md-6">
                        <a href="../client/detail_blog.html?blog=${blog.slug}" >
                            <div class="card border-0 shadow-sm">
                                <img src="${blog.thumbnail_url}"
                                    class="card-img-top" alt="Blog image">
                                <div class="card-body">
                                    <h5 class="card-title">${blog.title}</h5>
                                    <small class="text-muted d-block mb-2">${blog.author || "Không rõ"} – ${new Date(blog.created_at).toLocaleDateString('vi-VN')}</small>
                                    <p class="card-text">${shortContent}</p>
                                    <a href="#" class="text-decoration-none text-dark fw-semibold">Read More →</a>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            });
            cardBlog.innerHTML = html;
        }
    }
}