import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

type UiMsg = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);

        const documentText = String(body?.documentText ?? "");
        const messagesIn = (body?.messages ?? []) as UiMsg[];

        const systemMsg: UiMsg = {
            role: "system",
            content: documentText.trim()
                ? `Eres un analizador de documentos industriales.
Reglas:
- Responde SOLO usando el contenido del PDF.
- Si no está en el PDF, di: "No encuentro esa información en el PDF".
- Sé claro y directo.`
                : `Eres un asistente empresarial profesional.`,
        };

        const contextMsg: UiMsg | null = documentText.trim()
            ? { role: "system", content: `CONTENIDO PDF:\n${documentText}` }
            : null;

        const finalMessages: UiMsg[] = [
            systemMsg,
            ...(contextMsg ? [contextMsg] : []),
            ...messagesIn
                .filter((m) => m?.role && typeof m.content === "string")
                .map((m) => ({ role: m.role, content: m.content })),
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0.2,
            messages: finalMessages,
        });

        const text = completion.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ text });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Error en el chat" },
            { status: 500 }
        );
    }
}
