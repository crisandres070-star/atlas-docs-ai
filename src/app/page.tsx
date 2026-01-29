"use client";
import React from "react";
import Image from "next/image";
import { FileText, Cpu, ShieldCheck, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <main className="bg-[#0F172A] text-white min-h-screen">
      {/* HERO */}
      <section className="px-6 md:px-20 py-28">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
            ATLAS DOCS AI
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300">
            Inteligencia Operativa 4.0 para analizar documentos industriales con IA avanzada.
            Convierte PDF en decisiones rápidas, confiables y automatizadas.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/analizador"
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 rounded-lg text-white font-semibold flex items-center gap-2"
            >
              Probar Analizador
              <ArrowRight size={20} />
            </a>
            <a
              href="#contacto"
              className="px-6 py-3 bg-white text-black rounded-lg hover:bg-slate-200 font-semibold"
            >
              Contactar
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-20 py-20 bg-[#111827] border-t border-slate-800">
        <h2 className="text-center text-3xl font-bold mb-16">¿Qué puede hacer Atlas Docs AI?</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Feature
            icon={<FileText size={40} className="text-[#38BDF8]" />}
            title="Carga documentos complejos"
            desc="Facturas, contratos, reportes operacionales, órdenes de compra, permisos y más."
          />

          <Feature
            icon={<Cpu size={40} className="text-[#38BDF8]" />}
            title="IA optimizada para industria"
            desc="Responde usando únicamente el contenido del PDF. Precisa, rápida y confiable."
          />

          <Feature
            icon={<ShieldCheck size={40} className="text-[#38BDF8]" />}
            title="Seguridad Corporativa"
            desc="Procesamiento local con backend dedicado. Control total de los datos."
          />
        </div>
      </section>

      {/* DEMO */}
      <section className="px-6 md:px-20 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Vista previa del sistema</h2>

        <div className="flex justify-center">
          <Image
            src="/demo.png"
            width={950}
            height={600}
            alt="Demo"
            className="rounded-xl shadow-lg border border-slate-700"
          />
        </div>

        <p className="text-center text-slate-400 mt-4 text-sm">
          *Interfaz de análisis real usando IA conectada a Groq (Llama 3).*
        </p>
      </section>

      {/* PRICING */}
      <section className="px-6 md:px-20 py-20 bg-[#111827] border-t border-slate-800">
        <h2 className="text-center text-3xl font-bold mb-16">Planes</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <PriceCard
            title="Starter"
            price="49.000"
            items={[
              "1 usuario",
              "30 documentos mensuales",
              "Soporte básico",
            ]}
          />

          <PriceCard
            title="Empresa"
            price="149.000"
            items={[
              "5 usuarios",
              "150 documentos mensuales",
              "Soporte prioritario",
              "Implementación guiada",
            ]}
          />

          <PriceCard
            title="Industrial"
            price="450.000"
            items={[
              "Usuarios ilimitados",
              "Documentos ilimitados",
              "Infraestructura dedicada",
              "Integraciones especiales",
              "Soporte 24/7",
            ]}
          />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contacto" className="px-6 md:px-20 py-20">
        <h2 className="text-center text-3xl font-bold mb-10">Contacto Comercial</h2>

        <div className="max-w-xl mx-auto text-center">
          <p className="text-slate-300 mb-4">
            Escríbeme para cotizaciones, demostraciones o integraciones empresariales.
          </p>

          <a
            href="mailto:contacto@atlasdocs.ai"
            className="inline-block px-6 py-3 bg-[#2563EB] hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            contacto@atlasdocs.ai
          </a>
        </div>
      </section>

      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} ATLAS DOCS AI — Inteligencia Operativa 4.0
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800 shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}


function PriceCard({
  title,
  price,
  items,
}: {
  title: string;
  price: string;
  items: string[];
}) {
  return (
    <div className="bg-[#0F172A] p-8 rounded-xl border border-slate-700 shadow-md">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-4xl font-extrabold mt-4 mb-6">${price} CLP</p>

      <ul className="space-y-2 text-slate-300">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>

      <button className="mt-8 w-full px-4 py-2 bg-[#2563EB] hover:bg-blue-700 rounded-lg text-white font-semibold">
        Contratar
      </button>
    </div>
  );
}
