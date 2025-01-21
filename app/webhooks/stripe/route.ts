import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const jobId = charge.metadata.jobId;

    if (jobId === null) return new NextResponse("Bad Request", { status: 400 });

    const { data, error: notFoundError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (notFoundError) {
      throw notFoundError;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { error: updateError } = await supabase
      .from("jobs")
      .update({
        paymentStatus: "paid",
        expiryDate: expiryDate.toISOString(),
      })
      .eq("id", jobId);

    if (updateError) {
      throw updateError;
    }

    // email sending for confirmation
  }

  return new NextResponse();
}
