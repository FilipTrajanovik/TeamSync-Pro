import {useCallback, useEffect, useState} from "react";
import stripeRepository from "../repository/stripeRepository.js";

const useSubscriptionPlans = () => {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    const fetchPlans = useCallback(() => {
        stripeRepository.getActivePlans()
            .then((response) => {
                setPlans(response.data);
                setLoading(false);
                setError(null)
            }).catch((err) => {
            console.log(err);
        })
    }, [])

    const startCheckout = useCallback((planId) => {
        stripeRepository.createCheckoutSession(planId)
            .then((response) => {
                window.location.href = response.data.checkoutUrl;
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])
    return {plans, error, loading, fetchPlans, startCheckout}

}
export default useSubscriptionPlans