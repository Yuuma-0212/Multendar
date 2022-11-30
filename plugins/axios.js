import axios from "axios";

export default () => {
    return axios.create({
        baseURL: process.env.BROWSER_BASE_URL || "https://" + process.env.WEBSITE_HOSTNAME + "/api"
    });
}