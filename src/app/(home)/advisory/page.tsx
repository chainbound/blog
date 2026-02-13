"use client";

import { useState } from "react";

const fontMono = "font-[family-name:var(--font-at-hauss-mono)]";

export default function AdvisoryPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message");
    }
  }

  return (
    <div className="advisory-page min-h-screen bg-fd-background">
      {/* Hero section */}
      <section className="border-b border-fd-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fd-primary/10 text-fd-primary border border-fd-primary/20 text-xs mb-6 page-entrance page-entrance-delay-1 ${fontMono}`}
          >
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fd-primary opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-fd-primary" />
            </span>
            accepting new clients
          </span>
          <h1 className={`text-3xl font-medium mb-4 page-entrance page-entrance-delay-2 ${fontMono}`}>
            Advisory Services
          </h1>
          <p className="text-fd-muted-foreground leading-relaxed max-w-2xl page-entrance page-entrance-delay-3">
            Chainbound offers strategic advisory for teams building blockchain infrastructure.
            <br />
            We bring deep expertise in MEV, protocol engineering, and high-performance systems.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Services (3 cols) */}
          <div className="lg:col-span-3 page-entrance-block">
            <h2 className={`text-sm text-fd-muted-foreground mb-6 ${fontMono}`}>
              areas of expertise
            </h2>
            <div className="space-y-5">
              {[
                {
                  title: "Networking",
                  desc: "Custom networking solutions for decentralized systems, delivering higher throughput, lower latency and maximum robustness.",
                },
                {
                  title: "Cryptography",
                  desc: "Cryptographic solutions like ZK, MPC and TEEs, to build truly private, secure, and verifiable protocols.",
                },
                {
                  title: "Performance Engineering",
                  desc: "Improving the performance of networks, distributed systems and cryptographic primitives, to provide web3 experiences on par with web2.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border-l-2 border-fd-border pl-4 hover:border-fd-primary transition-colors"
                >
                  <h3 className={`text-sm font-medium mb-1 ${fontMono}`}>{item.title}</h3>
                  <p className="text-fd-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className={`mt-12 pt-8 border-t border-fd-border ${fontMono}`}>
              <div className="flex gap-6 text-sm">
                <a
                  href="https://x.com/chainbound_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-primary transition-colors"
                >
                  x/twitter ↗
                </a>
                <a
                  href="https://github.com/chainbound"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-primary transition-colors"
                >
                  github ↗
                </a>
              </div>
            </div>
          </div>

          {/* Right: Form (2 cols) */}
          <div className="lg:col-span-2 lg:border-l lg:border-fd-border lg:pl-12 page-entrance-block">
            <h2 className={`text-sm text-fd-muted-foreground mb-6 ${fontMono}`}>get in touch</h2>

            {status === "success" ? (
              <div className={`border border-fd-primary/50 bg-fd-primary/10 p-6 ${fontMono}`}>
                <p className="text-sm text-fd-primary mb-2">Message sent!</p>
                <p className="text-sm text-fd-muted-foreground">We&apos;ll get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-sm text-fd-muted-foreground hover:text-fd-primary transition-colors"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="name"
                    required
                    className={`w-full bg-transparent border border-fd-border px-4 py-3 text-sm focus:outline-none focus:border-fd-primary transition-colors ${fontMono}`}
                    placeholder="Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    className={`w-full bg-transparent border border-fd-border px-4 py-3 text-sm focus:outline-none focus:border-fd-primary transition-colors ${fontMono}`}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className={`w-full bg-transparent border border-fd-border px-4 py-3 text-sm focus:outline-none focus:border-fd-primary transition-colors resize-none ${fontMono}`}
                    placeholder="Tell us about your project..."
                  />
                </div>

                {status === "error" && (
                  <p className={`text-sm text-red-500 ${fontMono}`}>{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`w-full py-3 bg-fd-primary cursor-pointer text-fd-background text-sm font-medium hover:bg-fd-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${fontMono}`}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
