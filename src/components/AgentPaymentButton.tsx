"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { User } from "@/contexts/auth-context";

export default function AgentPaymentButton({
  aiWorkerId,
  pricePerRun,
  user,
  cycles,
  isBuying,
}: {
  aiWorkerId: string;
  pricePerRun: number;
  user: User;
  cycles: number;
  isBuying: boolean;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setErrorMessage(null); // reset error before starting

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMessage("Failed to load Razorpay SDK. Please try again.");
        return;
      }

      const amount = cycles * pricePerRun;

      // Step 1: Create order
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ aiWorkerId, cycles }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderBody = await orderRes.json();
      console.log("Order response:", orderBody);
      if (!orderBody.order?.id) {
        throw new Error("Invalid order response from server");
      }

      // Step 2: Open Razorpay modal
      const razorpay = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderBody.order.amount,
        currency: "INR",
        name: "AIPLAXE",
        description: "Rent AI Agent",
        order_id: orderBody.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id,
                aiWorkerId,
                cycles,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification request failed");
            }

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              window.open(verifyData.invoice, "_blank");
            } else {
              setErrorMessage("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            setErrorMessage("An error occurred during payment verification.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#6366F1",
        },
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Payment Error:", error);
      setErrorMessage(error?.message || "Something went wrong during payment.");
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-2">
      <Button className="text-center" onClick={handlePayment}>
        {isBuying ? "Processing..." : "Buy Runs & Run Agent"}
      </Button>
      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
