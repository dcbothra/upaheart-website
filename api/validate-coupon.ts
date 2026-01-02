import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { couponCode } = req.body;

    try {
        const validCode = process.env.COUPON_CODE;

        if (couponCode && couponCode.toUpperCase() === validCode) {
            // Return valid status and the target price per unit
            // Or discount logic. For this specific request: Price reduces to 899.
            // Current price is 1199. So discount is 300.
            return res.status(200).json({
                valid: true,
                discountPerUnit: 300,
                message: 'Coupon applied successfully!'
            });
        }

        return res.status(200).json({
            valid: false,
            message: 'Invalid coupon code'
        });

    } catch (error) {
        console.error('Coupon validation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
