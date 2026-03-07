"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const features = [
  {
    title: "Fast Detection",
    description: "Capture a leaf and get disease feedback in seconds.",
  },
  {
    title: "Clear Severity",
    description: "Understand urgency quickly with confidence and severity levels.",
  },
  {
    title: "Saved History",
    description: "Track scans over time and review past results anytime.",
  },
];

const steps = ["Capture leaf", "AI analyzes", "Get result"];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/camera");
    }
  }, [user, router]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="surface overflow-hidden p-6 sm:p-10">
        <div className="mx-auto max-w-3xl text-left">
          <p className="mb-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-800">
            Rice Leaf Disease Detection
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            A simple way to detect rice leaf diseases with AI
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-lg">
            PaddySense helps farmers diagnose leaf diseases quickly from mobile devices, with clear confidence and severity indicators.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link href="/register" className="btn-primary w-full sm:w-auto">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary w-full sm:w-auto">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {features.map((feature) => (
          <article key={feature.title} className="surface p-5">
            <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="surface p-6 sm:p-8">
        <h2 className="section-title text-center">How It Works</h2>
        <p className="section-subtitle text-center">Three quick steps from image to diagnosis.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {steps.map((step, index) => (
            <div key={step} className="surface-soft p-4 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <p className="mt-3 text-sm font-medium text-slate-800">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
