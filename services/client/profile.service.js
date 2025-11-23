import { apiURL } from "../../environments/environment.js";
import { endpoints, status } from "../../config/api-endpoint.config.js";

export class ProfileService {
    user = {};
    constructor() {

    }
    async fetchProfile(user_id) {
            await axios.get(`${apiURL + endpoints.USER}/${user_id}`).then((response) => {
            if (response.status === status.OK) {
                this.user = response.data;
            }
        });
        return this.user;
    }
    async update(profileData) {
        try {
            await axios.put(`${apiURL + endpoints.USER}/${profileData.id}`, profileData);
            sessionStorage.setItem('message', 'Cập nhật thông tin thành công!');
            sessionStorage.setItem('loggedInUser', JSON.stringify(profileData));
        } catch (error) {
            console.error("Error updating profile:", error);
            return null;
        }
    }
}