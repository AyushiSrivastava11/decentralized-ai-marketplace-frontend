"use client";

import { Button } from "@/components/ui/button";
import { loadRazorpayScript } from "@/utils/loadRazorpay";

export default function AgentPaymentButton({ aiWorkerId, pricePerRun, user, cycles, isBuying }: { aiWorkerId: string; pricePerRun: number; user: any; cycles: number; isBuying: boolean; }) {
  const handlePayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) return alert("Razorpay SDK failed to load");

    // const cycles = prompt("Enter number of runs:");
    // if (!cycles) return;

    const amount = cycles * pricePerRun;

    // 1. Create order from backend
    const orderRes = await fetch("/api/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ aiWorkerId, cycles }),
    });
    const order = await orderRes.json();

    if (!order.id) return alert("Order creation failed");

    // 2. Open Razorpay modal
    const razorpay = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "AIPLAXE",
      description: "Rent AI Agent",
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify payment
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

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert("Payment successful! Invoice will be downloaded.");
          // Optional: download invoice from `verifyData.invoiceUrl`
          window.open(verifyData.invoiceUrl, "_blank");
        } else {
          alert("Payment failed!");
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
  };

  return <Button className="text-center" onClick={handlePayment}>{isBuying ? "Processing..." : "Buy Runs & Run Agent"}</Button>;
}
