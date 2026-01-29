"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, User, Send, FileText, Upload, Trash2 } from "lucide-react";

type ChatMsg = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

function uid() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatIndustrial() {
    const [documentText, setDocumentText] = useState<string>("");
    const [docName, setDocName] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState<string>("");
    const [isSending, setIsSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const hasDoc = useMemo(() => documentText.trim().length > 0, [documentText]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isUploading, isSending]);

    async function uploadPdf(file: File) {
        setErrorMsg("");
        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });

            const data = await res.json().catch(() => ({} as any));
            if (!res.ok) throw new Error(data?.error ?? "Error al procesar PDF");

            setDocumentText(String(data?.text ?? ""));
            setDocName(file.name);
            setMessages([]);
        } catch (e: any) {
            setErrorMsg(e?.message ?? "Error subiendo PDF");
        } finally {
            setIsUploading(false);
        }
    }

    async function sendMessage() {
        const text = input.trim();
        if (!text || isSending) return;

        setErrorMsg("");
        setIsSending(true);

        const userMsg: ChatMsg = { id: uid(), role: "user", content: text };
        const nextMessages = [...messages, userMsg];

        setMessages(nextMessages);
        setInput("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    documentText,
                    messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await res.json().catch(() => ({} as any));
            if (!res.ok) throw new Error(data?.error ?? "Error en /api/chat");

            const assistantMsg: ChatMsg = {
                id: uid(),
                role: "assistant",
                content: String(data?.text ?? ""),
            };

            setMessages((prev) => [...prev, assistantMsg]);
        } catch (e: any) {
            setErrorMsg(e?.message ?? "Error enviando mensaje");
        } finally {
            setIsSending(false);
        }
    }

    function onPickFile() {
        fileInputRef.current?.click();
    }

    function onClearAll() {
        setDocumentText("");
        setDocName("");
        setMessages([]);
        setInput("");
        setErrorMsg("");
    }

    return (
        <main className="flex flex-col h-screen bg-slate-50">
            <header className="p-4 bg-white border-b flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" />
                    <h1 className="font-bold text-slate-800">Analizador IA Industrial 4.0</h1>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadPdf(f);
                            e.currentTarget.value = "";
                        }}
                    />

                    <button
                        type="button"
                        onClick={onPickFile}
                        disabled={isUploading}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        <Upload size={18} />
                        {isUploading ? "Procesando..." : "Cargar PDF"}
                    </button>

                    <button
                        type="button"
                        onClick={onClearAll}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-200 text-slate-900 hover:bg-slate-300"
                    >
                        <Trash2 size={18} />
                        Limpiar
                    </button>
                </div>
            </header>

            <section className="px-4 py-3 border-b bg-white">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-slate-700">
                        <span className="font-semibold">Documento:</span>{" "}
                        {hasDoc ? (
                            <span className="text-slate-900">{docName || "PDF cargado"}</span>
                        ) : (
                            <span className="text-slate-500">No hay PDF cargado</span>
                        )}
                    </div>
                    <div className="text-xs text-slate-500">
                        {hasDoc ? "Contexto activo para el chat" : "Sube un PDF para analizar"}
                    </div>
                </div>
            </section>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="max-w-2xl mx-auto bg-white border rounded-xl p-4 text-slate-700">
                        <p className="font-semibold text-slate-900 mb-1">Cómo usar</p>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li>Carga un PDF.</li>
                            <li>Pregunta cosas como “¿Cuál es el total?”.</li>
                            <li>Responderá usando el contenido del PDF.</li>
                        </ol>
                    </div>
                ) : null}

                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg flex gap-3 ${m.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-slate-800 border"
                                }`}
                        >
                            {m.role === "user" ? <User size={20} /> : <Bot size={20} />}
                            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                        </div>
                    </div>
                ))}

                {errorMsg ? (
                    <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-sm">
                        Error: {errorMsg}
                    </div>
                ) : null}

                <div ref={bottomRef} />
            </div>

            <footer className="p-4 bg-white border-t">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="flex gap-2"
                >
                    <input
                        className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-600"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            hasDoc ? "Pregunta sobre el PDF..." : "Sube un PDF para análisis..."
                        }
                    />

                    <button
                        type="submit"
                        disabled={isSending || isUploading || !input.trim()}
                        className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-2"
                    >
                        <Send size={18} />
                        {isSending ? "Enviando..." : "Enviar"}
                    </button>
                </form>
            </footer>
        </main>
    );
}
