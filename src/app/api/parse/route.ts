import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

/**
 * PDF Parsing API Route
 * Accepts FormData with a "file" field containing the PDF.
 * Uses unpdf (Mozilla PDF.js) for robust text extraction.
 * Returns { text: string }.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Use FormData with 'file' field." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });

    return NextResponse.json({ text: text ?? "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    const userMessage =
      message.toLowerCase().includes("encrypt") || message.toLowerCase().includes("password")
        ? "PDF appears to be encrypted or password-protected. Please use an unencrypted PDF."
        : "Failed to parse PDF. Try a different file or ensure it's not corrupted.";

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
