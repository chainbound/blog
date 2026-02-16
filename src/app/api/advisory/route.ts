import { NextResponse } from "next/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const N8N_WEBHOOK_URL = "https://n8n.chainbound.io/webhook/cb-advisory-interest-form";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const password = process.env.N8N_WEBHOOK_PASSWORD;
    if (!password) {
      console.error("N8N_ADVISORY_WEBHOOK_PASSWORD is not set");
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }

    const auth = Buffer.from(`chainbound:${password}`).toString("base64");
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      console.error("n8n webhook failed:", res.status, await res.text());
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
