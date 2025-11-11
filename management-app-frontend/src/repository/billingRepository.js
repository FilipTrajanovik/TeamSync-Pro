import axiosInstance from "../axios/axios.js";

const billingRepository = {
    // Get all plans
    getPlans: async () => {
        return axiosInstance.get("/billing/plans");
    },

    // Create checkout session
    createCheckout: async (planId) => {
        return axiosInstance.post("/billing/checkout", { planId });
    }
};

export default billingRepository;