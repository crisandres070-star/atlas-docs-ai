import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No se recibió archivo" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);

        // ✅ unpdf: extractor de texto sin worker/canvas
        const { extractText } = await import("unpdf");
        const result = await extractText(data);

        // result.text suele venir bien listo
        const text = (result?.text ?? "").toString();

        return NextResponse.json({ text });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Error procesando PDF" },
            { status: 500 }
        );
    }
}
