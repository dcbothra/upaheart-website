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
        const { items, receipt } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'No items in cart' });
        }

        // Calculate total amount in smallest currency unit (paise for INR)
        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const amountInPaise = Math.round(totalAmount * 100);

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
