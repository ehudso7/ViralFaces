"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Pricing() {
  const handleCheckout = async (priceId: string) => {
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: priceId.includes("sub") ? "subscription" : "payment",
      successUrl: window.location.origin + "/success",
      cancelUrl: window.location.href,
    });
  };

  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-12">Remove Watermark Forever</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        <div className="p-8 bg-gray-900 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4">1 Video</h3>
          <p className="text-6xl font-bold mb-6">$9</p>
          <button onClick={() => handleCheckout("price_1XYZ123")} className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl">
            Buy Now
          </button>
        </div>
        {/* Add more tiers */}
      </div>
    </div>
  );
}
