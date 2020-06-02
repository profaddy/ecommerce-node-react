import axios from "axios";
import Cookies from "js-cookie";

const shopOrigin = Cookies.get("shopOrigin");
const apiVersion = "2020-04";
const accessToken = Cookies.get("accessToken");
const apiEndPointHost = `https://${shopOrigin}/admin/api/${apiVersion}/`

const api = axios.create({
    baseURL: apiEndPointHost,
    "crossDomain": true,
    headers: {
        "X-Shopify-Access-Token":accessToken,
        "Content-type": "application/json",
      },
});


export default api;


