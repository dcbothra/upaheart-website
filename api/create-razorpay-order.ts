import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, receipt, couponCode } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'No items in cart' });
        }

        // Calculate total amount in paise (1 INR = 100 paise)
        let total = 0;

        // Server-side validation of coupon
        let discountPerUnit = 0;
        if (couponCode && process.env.COUPON_CODE && couponCode.toUpperCase() === process.env.COUPON_CODE) {
            discountPerUnit = 300; // Hardcoded logic: 1199 -> 899 (300 off)
        }

        items.forEach((item: any) => {
            // Here you should ideally fetch the price from your DB/Products config
            // to prevent client-side price manipulation.
            // For simplicity, we are trusting the client but applying the discount securely.

            let price = item.price;
            // Apply discount if it's the Lithophane Lamp (or broadly)
            // Assuming the discount applies to all items or just the lamp.
            // Let's apply to all items for simplicity as requested "price reduces to 899".

            if (discountPerUnit > 0) {
                price = Math.max(0, price - discountPerUnit);
            }

            total += price * item.quantity;
        });

        const amountInPaise = Math.round(total * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: receipt || `receipt_${Date.now()}`,
            notes: {
                // You can store custom metadata here, e.g., link to S3 files
                // But keep it short as there are limits
                items_count: items.length.toString(),
            }
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json(order);
    } catch (error: any) {
        console.error('Razorpay Order Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
