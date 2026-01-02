import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Lock, UploadCloud, CheckCircle, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToS3 } from '../lib/upload';
import { loadRazorpay } from '../lib/razorpay';

export const Checkout: React.FC = () => {
    const { cart, cartTotal, clearCart, updateCustomizationFile, updateCartItem } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState<'details' | 'upload' | 'payment' | 'success'>('details');
    const [isProcessing, setIsProcessing] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);
    const [couponMessage, setCouponMessage] = useState({ text: '', isError: false });

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', address: '', city: '', zip: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const hasCustomizableItems = cart.some(item => item.isCustomizable);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(hasCustomizableItems ? 'upload' : 'payment');
    };

    const handleFileUpload = async (cartItemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            updateCustomizationFile(cartItemId, file);
            // Invalidate any previous URL so we know to upload the new file
            updateCartItem(cartItemId, { customizationFileUrl: undefined });
        }
    };

    const handleUploadSubmit = async () => {
        const missingFiles = cart.filter(item => item.isCustomizable && !item.customizationFile);
        if (missingFiles.length > 0) {
            alert("Please upload images for all customizable items before proceeding.");
            return;
        }

        setIsProcessing(true);
        try {
            // Upload all files that haven't been uploaded yet
            const uploadPromises = cart.map(async (item) => {
                if (item.isCustomizable && item.customizationFile && !item.customizationFileUrl) {
                    const url = await uploadToS3(item.customizationFile);
                    updateCartItem(item.cartItemId, { customizationFileUrl: url });
                }
            });

            await Promise.all(uploadPromises);
            setStep('payment');
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload images. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsProcessing(true);
        setCouponMessage({ text: '', isError: false });

        try {
            const res = await fetch('/api/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode })
            });
            const data = await res.json();

            if (data.valid) {
                // Calculate total discount
                // 300 discount per item
                const totalDiscount = cart.reduce((acc, item) => acc + (data.discountPerUnit * item.quantity), 0);

                setAppliedCoupon({ code: couponCode, discount: totalDiscount });
                setCouponMessage({ text: 'Coupon applied!', isError: false });
            } else {
                setAppliedCoupon(null);
                setCouponMessage({ text: 'Invalid code', isError: true });
            }
        } catch (err) {
            console.error(err);
            setCouponMessage({ text: 'Error applying coupon', isError: true });
        } finally {
            setIsProcessing(false);
        }
    };

    // Production Payment Call
    // Production Payment Call (Razorpay)
    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Razorpay failed to load. Are you online?");
                return;
            }

            // 2. Create Order on Server
            const response = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        images: item.images,
                        customizationFileUrl: item.customizationFileUrl
                    })),
                    receipt: `receipt_${Date.now()}`,
                    couponCode: appliedCoupon ? appliedCoupon.code : null // Send coupon to backend
                }),
            });

            if (!response.ok) throw new Error("Could not create order");
            const order = await response.json();

            // 3. Open Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use Environment Variable
                amount: order.amount,
                currency: order.currency,
                name: "UpaHeart Gifting",
                description: "Premium Personalized Gift",
                image: "https://your-logo-url.com/logo.png", // Replace with actual logo
                order_id: order.id,
                handler: function (response: any) {
                    // alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    // Successful payment -> clear cart, show success
                    clearCart();
                    setStep('success');
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: "9999999999" // In a real app, you'd collect phone number in the form
                },
                notes: {
                    address: formData.address
                },
                theme: {
                    color: "#1c1917" // warm-900 hex
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment error:", error);
            alert("There was an issue processing your payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0 && step !== 'success') {
        navigate('/shop');
        return null;
    }

    return (
        <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-warm-50">
            <div className="max-w-4xl mx-auto px-6">

                {/* Step Indicator */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center space-x-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                        <span className={step === 'details' ? 'text-warm-900' : 'text-gray-300'}>Shipping</span>
                        <div className="w-8 h-[1px] bg-gray-200" />
                        {hasCustomizableItems && (
                            <>
                                <span className={step === 'upload' ? 'text-warm-900' : 'text-gray-300'}>Customize</span>
                                <div className="w-8 h-[1px] bg-gray-200" />
                            </>
                        )}
                        <span className={step === 'payment' ? 'text-warm-900' : 'text-gray-300'}>Payment</span>
                    </div>
                </div>

                <motion.div
                    layout
                    className="bg-white border border-warm-200 shadow-sm rounded-sm overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {step === 'details' && (
                            <motion.form
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleDetailsSubmit}
                                className="p-8 md:p-12 space-y-8"
                            >
                                <h2 className="text-3xl font-display text-warm-900">Shipping Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">First Name</label>
                                        <input required name="firstName" onChange={handleInputChange} className="w-full bg-warm-50 border-b border-transparent focus:border-warm-900 p-4 outline-none transition-colors font-sans" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Last Name</label>
                                        <input required name="lastName" onChange={handleInputChange} className="w-full bg-warm-50 border-b border-transparent focus:border-warm-900 p-4 outline-none transition-colors font-sans" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                                    <input required type="email" name="email" onChange={handleInputChange} className="w-full bg-warm-50 border-b border-transparent focus:border-warm-900 p-4 outline-none transition-colors font-sans" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Shipping Address</label>
                                    <input required name="address" onChange={handleInputChange} className="w-full bg-warm-50 border-b border-transparent focus:border-warm-900 p-4 outline-none transition-colors font-sans" />
                                </div>
                                <button type="submit" className="w-full bg-warm-900 text-white py-5 text-xs font-bold uppercase tracking-[0.25em] hover:bg-black transition-all rounded-sm font-sans">
                                    Continue to Customization
                                </button>
                            </motion.form>
                        )}

                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 md:p-12 space-y-10"
                            >
                                <div className="flex justify-between items-end">
                                    <h2 className="text-3xl font-display text-warm-900">Personalize</h2>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Secure Upload
                                    </span>
                                </div>

                                <div className="space-y-8">
                                    {cart.filter(i => i.isCustomizable).map((item) => (
                                        <div key={item.cartItemId} className="group">
                                            <div className="flex items-center gap-6 mb-6">
                                                <div className="w-16 h-16 bg-warm-50 p-1 border border-warm-100 rounded-sm">
                                                    <img src={item.images[0]} className="w-full h-full object-cover" alt="product" />
                                                </div>
                                                <div>
                                                    <p className="font-display text-lg">{item.name}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reference Photo Required</p>
                                                </div>
                                            </div>
                                            <label className="relative block w-full border-2 border-dashed border-warm-200 bg-warm-50/50 p-10 text-center cursor-pointer hover:border-warm-900 hover:bg-warm-50 transition-all rounded-sm overflow-hidden">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(item.cartItemId, e)}
                                                />
                                                {item.customizationFile ? (
                                                    <div className="flex flex-col items-center text-warm-900">
                                                        <div className="w-12 h-12 bg-warm-900 text-white rounded-full flex items-center justify-center mb-4">
                                                            <CheckCircle className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-sm font-medium font-sans">{item.customizationFile.name}</span>
                                                        <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Click to replace</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400 group-hover:text-warm-900 transition-colors">
                                                        <UploadCloud className="w-10 h-10 mb-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                                        <span className="text-xs uppercase tracking-[0.2em] font-bold">Select High-Res Memory</span>
                                                        <p className="text-[10px] mt-2 font-light max-w-xs mx-auto">For lithophanes, high contrast photos work best. JPEG or PNG up to 20MB.</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleUploadSubmit}
                                    disabled={isProcessing}
                                    className="w-full bg-warm-900 text-white py-5 text-xs font-bold uppercase tracking-[0.25em] hover:bg-black transition-all rounded-sm font-sans flex justify-center items-center disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading Memories...
                                        </>
                                    ) : (
                                        "Review & Pay"
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {step === 'payment' && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 md:p-12 space-y-10"
                            >
                                <h2 className="text-3xl font-display text-warm-900">Summary</h2>

                                <div className="space-y-4">
                                    {/* Calculate totals locally for display */}
                                    {(() => {
                                        const originalTotal = cart.reduce((acc, item) => acc + (item.originalPrice || item.price), 0);
                                        const productDiscount = originalTotal - cartTotal;

                                        // If coupon is applied, final due reduces further
                                        const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
                                        const finalTotal = cartTotal - couponDiscount;

                                        return (
                                            <>
                                                <div className="flex justify-between items-center text-sm font-sans">
                                                    <span className="text-gray-500">Order Subtotal</span>
                                                    <span className="font-medium text-gray-400 line-through">₹{originalTotal.toFixed(2)}</span>
                                                </div>
                                                {productDiscount > 0 && (
                                                    <div className="flex justify-between items-center text-sm font-sans text-green-700">
                                                        <span className="">Sale Discount</span>
                                                        <span className="font-medium">-₹{productDiscount.toFixed(2)}</span>
                                                    </div>
                                                )}

                                                {/* Coupon Input */}
                                                <div className="py-2">
                                                    {!appliedCoupon ? (
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Coupon Code"
                                                                className="flex-grow bg-warm-50 border border-warm-200 p-2 text-xs uppercase tracking-widest font-bold outline-none focus:border-warm-900 transition-colors"
                                                                value={couponCode}
                                                                onChange={(e) => setCouponCode(e.target.value)}
                                                            />
                                                            <button
                                                                onClick={handleApplyCoupon}
                                                                disabled={!couponCode || isProcessing}
                                                                className="bg-warm-200 text-warm-900 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-warm-300 transition-colors disabled:opacity-50"
                                                            >
                                                                Apply
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between items-center bg-green-50 border border-green-100 p-2 px-3 rounded-sm">
                                                            <span className="text-xs font-bold text-green-800 flex items-center gap-2">
                                                                <CheckCircle className="w-3 h-3" /> {appliedCoupon.code}
                                                            </span>
                                                            <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); setCouponMessage({ text: '', isError: false }) }} className="text-[10px] text-green-700 underline">Remove</button>
                                                        </div>
                                                    )}
                                                    {couponMessage.text && (
                                                        <p className={`text-[10px] mt-1 ${couponMessage.isError ? 'text-red-500' : 'text-green-600'}`}>{couponMessage.text}</p>
                                                    )}
                                                </div>

                                                {appliedCoupon && (
                                                    <div className="flex justify-between items-center text-sm font-sans text-green-700 font-bold">
                                                        <span className="">Coupon Discount</span>
                                                        <span className="font-medium">-₹{couponDiscount.toFixed(2)}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center text-sm font-sans">
                                                    <span className="text-gray-500">Shipping</span>
                                                    <span className="text-green-700 font-bold uppercase text-[10px] tracking-widest">Free</span>
                                                </div>
                                                <div className="pt-4 border-t border-warm-100 flex justify-between items-end">
                                                    <div>
                                                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">Total Due</span>
                                                        <span className="text-4xl font-serif italic text-warm-900">₹{finalTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Secure Payment</p>
                                                        <div className="flex gap-2 justify-end opacity-40">
                                                            <CreditCard className="w-4 h-4" />
                                                            <Lock className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <div className="bg-warm-50 p-6 rounded-sm text-center">
                                    <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
                                        Clicking the button below will securely initialize your transaction. You will be redirected to our encrypted payment processor.
                                    </p>
                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className="w-full bg-warm-900 text-white py-5 text-xs font-bold uppercase tracking-[0.25em] hover:bg-black transition-all flex justify-center items-center rounded-sm font-sans shadow-xl disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            `Complete Purchase`
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-12 md:p-24 text-center space-y-8"
                            >
                                <div className="w-24 h-24 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-display text-warm-900">Your order is <br /> being prepared.</h2>
                                <p className="text-gray-500 max-w-md mx-auto font-sans font-light leading-relaxed">
                                    Thank you, {formData.firstName}. We've sent a confirmation to {formData.email}. Our artisans will now begin translating your memories into light.
                                </p>
                                <div className="pt-8">
                                    <button onClick={() => navigate('/')} className="text-[10px] font-bold uppercase tracking-[0.4em] border-b-2 border-warm-900 pb-2 hover:opacity-50 transition-all font-sans">
                                        Return to Gallery
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};