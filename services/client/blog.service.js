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
                            <div class="card border-0 shadow-sm h-100">
                                <img src="${blog.thumbnail_url}"
                                    class="card-img-top" 
                                    alt="Blog image"
                                    style="height: 250px; object-fit: cover;"
                                    loading="lazy">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title" style="min-height: 50px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                        ${blog.title}
                                    </h5>
                                    <small class="text-muted d-block mb-2">${blog.author || "Không rõ"} – ${new Date(blog.created_at).toLocaleDateString('vi-VN')}</small>
                                    <p class="card-text" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                        ${shortContent}
                                    </p>
                                    <a href="#" class="text-decoration-none text-dark fw-semibold mt-auto">Read More →</a>
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