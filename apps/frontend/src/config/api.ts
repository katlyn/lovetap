import LovetapApi from "api-wrapper"

const API_BASE = import.meta.env.VITE_API_BASE_URL.length > 0 ? import.meta.env.VITE_API_BASE_URL : window.location.origin + "/api"

export default new LovetapApi(API_BASE)
