import ScholarsApi from "api-wrapper"

export default new ScholarsApi(import.meta.env.VITE_API_BASE_URL + "/")
