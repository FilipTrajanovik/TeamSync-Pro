import axiosInstance from "../axios/axios.js";

const stripeRepository = {
    getActivePlans: () => {
        return axiosInstance.get(`/billing/plans`)
    },
    createCheckoutSession: (planId) => {
        return axiosInstance.post(`/billing/checkout`, {planId})
    }
}
export default stripeRepository