"use client";

import React from "react";
import { Navbar } from "@/modules/web/header";

import Link from "next/link";

export default function Home() {
  return (
    <div className="landing-body min-h-screen bg-[#020202] text-white">
      {/* Vercel-style Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(circle at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 40%, transparent 100%)",
        }}
      ></div>

      {/* Navigation */}
      <Navbar />

      {/* Main Hero Content */}
      <main className="relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-32 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[36px_36px]" />
          <div className="absolute -top-40 left-95 w-full max-w-[720px] h-[500px] bg-blue-500/30 blur-[160px] rounded-full pointer-events-none" />
        </div>
        <div className="max-w-[90rem] mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-sm font-medium mb-12 hover:bg-white/10 transition-colors cursor-pointer group backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Gitpilot v1.0 is now live
            {/* @ts-ignore */}
            {/* <iconify-icon
              icon="solar:arrow-right-linear"
              width="16"
              class="group-hover:translate-x-0.5 transition-transform"
            ></iconify-icon> */}
          </div>

          {/* Headline */}
          <h1 className="animate-reveal delay-100 max-w-6xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 leading-[1.05] mb-8 drop-shadow-2xl">
            The self-healing <br className="hidden md:block" /> Gitpilot agent.
          </h1>

          {/* Subheadline */}
          <p className="animate-reveal delay-200 max-w-3xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 tracking-wide">
            Stop debugging pipelines. Gitpilot autonomously detects build
            errors, analyzes logs, and suggests fixes in real-time without
            config files.
          </p>

          {/* CTA Buttons */}
          <div className="animate-reveal delay-300 flex flex-col sm:flex-row items-center gap-4 mb-20">
            <Link
              href="/auth"
              className="px-5 py-2 rounded-full border border-white/10 text-white hover:bg-white/5 text-base font-medium transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              Get Started
              {/* @ts-ignore */}
              {/* <iconify-icon
                icon="solar:plain-3-linear"
                width="16"
              ></iconify-icon> */}
            </Link>
            <button className="px-5 py-2 rounded-full border border-white/10 text-white hover:bg-white/5 text-base font-medium transition-all flex items-center gap-2 backdrop-blur-sm">
              {/* @ts-ignore */}
              {/* <iconify-icon
                icon="solar:file-text-linear"
                width="20"
              ></iconify-icon> */}
              Read Documentation
            </button>
          </div>

          {/* Visual Interface (The Product) */}
          <div className="animate-reveal delay-500 relative w-full max-w-5xl mx-auto perspective-1000">
            {/* Glow Effect behind container */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 animate-subtle-pulse"></div>

            {/* Main Container */}
            <div className="relative bg-[#0A0A0C] border border-white/10 rounded-xl shadow-2xl overflow-hidden text-left">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  {/* @ts-ignore */}
                  {/* <iconify-icon
                    icon="solar:lock-keyhole-linear"
                    width="12"
                  ></iconify-icon> */}
                  gitpilot-agent-live
                </div>
                <div className="text-slate-600">
                  {/* @ts-ignore */}
                  {/* <iconify-icon
                    icon="solar:settings-linear"
                    width="16"
                  ></iconify-icon> */}
                </div>
              </div>

              {/* Split View Content */}
              <div className="grid md:grid-cols-12 min-h-[400px]">
                {/* Left: Pipeline Steps */}
                <div className="md:col-span-4 border-r border-white/5 bg-black/20 p-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                    Pipeline Status
                  </div>

                  {/* Step 1: Done */}
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      {/* @ts-ignore */}
                      {/* <iconify-icon
                        icon="solar:check-circle-linear"
                        width="14"
                      ></iconify-icon> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200 font-medium">
                        Environment Setup
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Completed in 2s
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Processing (The Error Fix) */}
                  <div className="relative flex items-center gap-3 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/20 overflow-hidden">
                    {/* Loading bar */}
                    <div className="absolute bottom-0 left-0 h-[1px] bg-indigo-500 w-3/4"></div>

                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 animate-spin-slow">
                      {/* @ts-ignore */}
                      {/* <iconify-icon
                        icon="solar:refresh-circle-linear"
                        width="14"
                      ></iconify-icon> */}
                    </div>
                    <div className="flex flex-col z-10">
                      <span className="text-xs text-white font-medium">
                        Dependency Conflict
                      </span>
                      <span className="text-[10px] text-indigo-300">
                        Autofixing...
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Pending */}
                  <div className="flex items-center gap-3 p-2 rounded-lg opacity-50">
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">
                        Integration Tests
                      </span>
                      <span className="text-[10px] text-slate-600">
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* Step 4: Pending */}
                  <div className="flex items-center gap-3 p-2 rounded-lg opacity-50">
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">
                        Production Deploy
                      </span>
                      <span className="text-[10px] text-slate-600">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Terminal/Logs */}
                <div className="md:col-span-8 p-6 font-mono text-xs leading-relaxed relative overflow-hidden">
                  {/* Gradient Fade for Terminal */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0C] pointer-events-none"></div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-slate-600">10:42:01</span>
                      <span className="text-blue-400">info</span>
                      <span className="text-slate-400">
                        Initializing agent instance 0x4A...
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-600">10:42:02</span>
                      <span className="text-blue-400">info</span>
                      <span className="text-slate-400">
                        Analyzing package.json dependencies
                      </span>
                    </div>
                    <div className="flex gap-2 bg-red-500/5 p-1 -mx-1 rounded">
                      <span className="text-slate-600">10:42:04</span>
                      <span className="text-red-400">error</span>
                      <span className="text-red-200">
                        Module 'sharp' mismatch detected (arch=x64)
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-600">10:42:04</span>
                      <span className="text-purple-400">agent</span>
                      <span className="text-purple-200">
                        Attempting autonomous resolution strategy:
                        REBUILD_BINDINGS
                      </span>
                    </div>
                    <div className="flex gap-2 pl-4 border-l border-purple-500/20">
                      <span className="text-slate-700">&gt;</span>
                      <span className="text-slate-500">
                        npm rebuild sharp --platform=linux --arch=x64
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-600">10:42:08</span>
                      <span className="text-green-400">success</span>
                      <span className="text-slate-300">
                        Patch applied. Resuming build process.
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-50">
                      <span className="text-slate-600">10:42:09</span>
                      <span className="text-blue-400">info</span>
                      <span className="text-slate-400">
                        Compiling assets...
                      </span>
                    </div>
                    <div className="animate-pulse flex gap-2">
                      <span className="text-slate-600">_</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements around Main Visual */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>
          </div>
        </div>
      </main>

      {/* Trusted By / Social Proof */}
      <section className="border-t border-white/5 py-10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-medium text-slate-500 mb-8 uppercase tracking-widest">
            Trusting autonomy at scale
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Using Text as Logos for accuracy to request */}
            <h3 className="text-lg font-semibold tracking-tight font-sans text-white">
              ACME <span className="font-light">Corp</span>
            </h3>
            <h3 className="text-xl font-bold tracking-tighter italic font-serif text-white">
              Vertex
            </h3>
            <h3 className="text-lg font-medium tracking-tight font-mono text-white">
              nebula.io
            </h3>
            <div className="flex items-center gap-1 text-white font-bold tracking-tight text-lg">
              <div className="w-4 h-4 bg-white rounded-full"></div> Sphere
            </div>
            <h3 className="text-xl font-light tracking-[0.2em] uppercase text-white">
              Onyx
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
}
