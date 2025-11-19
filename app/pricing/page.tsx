"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

export default function Pricing() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (priceId: string, mode: "payment" | "subscription" = "payment") => {
    try {
      setIsProcessing(true);

      // Lazy load Stripe at runtime
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        console.error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
        alert("Payment system is not configured. Please contact support.");
        return;
      }

      const stripePromise = loadStripe(publishableKey);
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode,
        successUrl: window.location.origin + "/success",
        cancelUrl: window.location.href,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        alert("Payment initialization failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-12">Remove Watermark Forever</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        <div className="p-8 bg-gray-900 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4">1 Video</h3>
          <p className="text-6xl font-bold mb-6">$9</p>
          <button
            onClick={() => handleCheckout("price_1XYZ123", "payment")}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Buy Now"}
          </button>
          <p className="mt-4 text-xs text-gray-500">
            TODO: Replace price_1XYZ123 with real Stripe price ID
          </p>
        </div>
        {/* Add more tiers */}
      </div>
    </div>
  );
}
