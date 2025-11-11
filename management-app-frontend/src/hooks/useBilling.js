import { useState, useCallback } from 'react';
import billingRepository from '../repository/billingRepository.js';

const useBilling = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Start checkout - converts plan name to ID and redirects
    const startCheckout = useCallback(async (planName) => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔍 Fetching plans to find:', planName);

            // Get all plans
            const plansResponse = await billingRepository.getPlans();
            console.log('📦 Plans:', plansResponse.data);

            // Find the plan by name
            const plan = plansResponse.data.find(p => p.name === planName);

            if (!plan) {
                throw new Error(`Plan ${planName} not found`);
            }

            console.log('✅ Found plan:', plan);
            console.log('💳 Creating checkout for plan ID:', plan.id);

            // Create checkout session
            const checkoutResponse = await billingRepository.createCheckout(plan.id);
            console.log('🎫 Checkout response:', checkoutResponse.data);

            // Get the checkout URL
            const checkoutUrl = checkoutResponse.data.checkoutUrl ||
                checkoutResponse.data.url ||
                checkoutResponse.data;

            if (checkoutUrl && typeof checkoutUrl === 'string') {
                console.log('🚀 Redirecting to:', checkoutUrl);
                window.location.href = checkoutUrl;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (err) {
            console.error('❌ Checkout error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        startCheckout
    };
};

export default useBilling;