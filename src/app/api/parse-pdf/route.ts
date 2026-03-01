import { NextRequest, NextResponse } from "next/server";
// Using CommonJS require for pdf-parse to avoid default export issue
// No static import for pdf-parse; will be dynamically imported in the handler

/**
 * PDF Parsing API Route (Server Side)
 * Receives FormData with a "file" field containing the PDF.
 * Returns { text: string }.
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided in request." },
                { status: 400 }
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are supported." },
                { status: 400 }
            );
        }

        // Convert file to buffer for pdf-parse
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Require pdf-parse (CommonJS) – works in Next.js server environment
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdf = require("pdf-parse");
        // Extract text using pdf-parse
        const data = await pdf(buffer);

        return NextResponse.json({
            text: data.text,
            numPages: data.numpages,
            info: data.info,
        });
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        return NextResponse.json(
            { error: "Failed to parse PDF document. Please ensure it's not encrypted." },
            { status: 500 }
        );
    }
}
