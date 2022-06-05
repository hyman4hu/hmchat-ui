import axios from 'axios';
import qs from "qs";


axios.defaults.baseURL = '/chatapi';
axios.defaults.paramsSerializer = function(params) {
    return qs.stringify(params, { arrayFormat: "repeat" });
};

axios.defaults.timeout = 30000;

export default axios;