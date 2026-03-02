import { NextRequest, NextResponse } from "next/server";

/**
 * Application Submit Proxy
 * Forwards application data to the n8n webhook from the server.
 * Avoids CORS issues when the browser would call n8n directly.
 */
export async function POST(req: NextRequest) {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook URL not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const rawText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Resource issue. Please try again later." },
        { status: response.status }
      );
    }

    let data: unknown;
    try {
      data = rawText.trim() ? JSON.parse(rawText) : {};
    } catch {
      data = { received: true };
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Resource issue. Please try again later." },
      { status: 500 }
    );
  }
}
