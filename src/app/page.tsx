"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { 
  Activity,
  Heart,
  Calendar,
  AlertCircle,
  Play,
  CheckCircle,
  Menu,
  ChevronRight,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  PhoneCall
} from "lucide-react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [triageStep, setTriageStep] = useState<"idle" | "q1" | "q2" | "normal" | "alert">("idle");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#E2F0D9] selection:text-[#2E5A44]">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAFAF9]/80 border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#2E5A44] p-2 rounded-xl text-white">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1C3E2F]">
              Vital<span className="text-[#65A765]">Mama</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-[#2E5A44] transition-colors">Features</a>
            <Link href="/impact" className="hover:text-[#2E5A44] transition-colors">Our Impact</Link>
            <a href="#preview" className="hover:text-[#2E5A44] transition-colors">App Preview</a>
          </nav>

          <div className="flex items-center gap-4 relative z-50">
            <Link href="/dashboard">
              <button className="bg-[#2E5A44] hover:bg-[#234735] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md">
                Launch Web App
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#EAF5E5] rounded-full filter blur-[100px] -z-10 opacity-70" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-[#F9F0E1] rounded-full filter blur-[80px] -z-10 opacity-60" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <motion.div 
            className="lg:col-span-6 flex flex-col space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[#E2F0D9] text-[#2E5A44] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider w-fit">
              ✨ Modern Maternal Health PWA
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1C3E2F] leading-[1.1]">
              Critical Care. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E5A44] to-[#65A765]">Anywhere, Offline or Online.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              A responsive, progressive web experience built to empower mothers. Access autonomous triage guides, track key gestational milestones, and bridge communication barriers with voice-first local accent guides.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="inline-flex items-center justify-center bg-[#2E5A44] hover:bg-[#234735] text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-md group">
                Install App & Onboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl transition-all shadow-sm">
                How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Modern PWA App Mockup */}
          <div id="preview" className="lg:col-span-6 flex flex-col items-center">
            <div className="relative mx-auto w-full max-w-[340px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800">
              
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-900 rounded-b-2xl z-20 flex justify-center items-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* PWA Screen Screen View */}
              <div className="w-full aspect-[9/19] bg-[#FAFAF9] rounded-[38px] overflow-hidden flex flex-col select-none relative text-slate-800">
                
                {/* PWA App Status Bar */}
                <div className="bg-white px-6 pt-10 pb-3 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#2E5A44] p-1.5 rounded-lg text-white">
                      <Activity className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold tracking-tight text-[#1C3E2F]">VitalMama</span>
                  </div>
                  <Menu className="h-4 w-4 text-slate-400" />
                </div>

                {/* Dashboard App View */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  
                  {/* Hello & Progress Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Welcome Back</p>
                        <h4 className="text-sm font-bold text-slate-800">Amina Oke</h4>
                      </div>
                      <span className="text-[10px] bg-[#E2F0D9] text-[#2E5A44] font-bold px-2 py-0.5 rounded-full">
                        Week 28
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="p-2 bg-pink-50 rounded-xl text-pink-500">
                        <Heart className="h-4 w-4 fill-pink-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span>Gestational Progress</span>
                          <span>70% Complete</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-pink-400 to-[#65A765] h-full w-[70%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive PWA Triage Component inside the App */}
                  <div className="bg-[#F3F7F2] p-4 rounded-2xl border border-[#E2F0D9] shadow-sm">
                    <AnimatePresence mode="wait">
                      {triageStep === "idle" && (
                        <motion.div key="idle" className="space-y-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-[#2E5A44] mt-0.5 shrink-0" />
                            <div>
                              <h4 className="text-xs font-bold text-[#1C3E2F]">Daily Symptom Check</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5">Quickly screen for preeclampsia indicators.</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setTriageStep("q1")}
                            className="w-full bg-[#2E5A44] hover:bg-[#234735] text-white text-[11px] font-bold py-2 rounded-xl transition-all"
                          >
                            Start Assessment
                          </button>
                        </motion.div>
                      )}

                      {triageStep === "q1" && (
                        <motion.div key="q1" className="space-y-3">
                          <p className="text-xs font-bold text-slate-800">Do you have severe headaches or vision blur today?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setTriageStep("alert")} className="flex-1 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg">Yes</button>
                            <button onClick={() => setTriageStep("q2")} className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg">No</button>
                          </div>
                        </motion.div>
                      )}

                      {triageStep === "q2" && (
                        <motion.div key="q2" className="space-y-3">
                          <p className="text-xs font-bold text-slate-800">Are you feeling normal baby movements?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setTriageStep("normal")} className="flex-1 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[10px] font-bold rounded-lg">Yes</button>
                            <button onClick={() => setTriageStep("alert")} className="flex-1 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg">No</button>
                          </div>
                        </motion.div>
                      )}

                      {triageStep === "normal" && (
                        <motion.div key="normal" className="space-y-2 text-center py-2">
                          <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                          <p className="text-[11px] font-bold text-slate-700">All Parameters Normal</p>
                          <button onClick={() => setTriageStep("idle")} className="text-[9px] font-semibold text-[#2E5A44] hover:underline">Done</button>
                        </motion.div>
                      )}

                      {triageStep === "alert" && (
                        <motion.div key="alert" className="space-y-2 text-center py-2">
                          <AlertCircle className="h-8 w-8 text-red-500 mx-auto animate-pulse" />
                          <p className="text-[11px] font-bold text-red-700">Alert Dispatched</p>
                          <p className="text-[9px] text-slate-400">Local emergency transport coordinators have been flagged.</p>
                          <button onClick={() => setTriageStep("idle")} className="text-[9px] font-semibold text-slate-500 hover:underline">Reset</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Accent Audio Card */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-[#2E5A44] p-2 rounded-xl text-white hover:bg-[#234735]"
                      >
                        <Play className="h-3 w-3 fill-white" />
                      </button>
                      <div>
                        <p className="text-[10px] font-bold text-slate-800">Trimester 3 Guide</p>
                        <p className="text-[8px] text-slate-400">Nigerian Accent Accent Guide</p>
                      </div>
                    </div>
                    {isPlaying && <span className="text-[8px] text-emerald-500 font-semibold animate-pulse">Playing</span>}
                  </div>

                </div>

                {/* Bottom App Bar Navigation */}
                <div className="bg-white border-t border-slate-100 py-3 px-6 flex justify-between text-slate-400 text-[10px] font-bold">
                  <span className="text-[#2E5A44]">Home</span>
                  <span>Guides</span>
                  <span>Emergency</span>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="bg-[#F5F5F0] py-20 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C3E2F]">The Maternal Support Architecture</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Universal access to medical knowledge, optimized specifically to run lightweight on modern PWA containers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="p-3 bg-[#E2F0D9] w-fit rounded-xl text-[#2E5A44] mb-6">
                <PhoneCall className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Localized Voice Guides</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interact with voice-first maternal support custom-tailored with familiar pacing, regional accents, and supportive vocabulary.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="p-3 bg-[#E2F0D9] w-fit rounded-xl text-[#2E5A44] mb-6">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Lightweight Footprint</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Designed to download in seconds and work flawlessly over standard 3G/2G network environments, bypassing high-cost bandwidth hurdles.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="p-3 bg-[#E2F0D9] w-fit rounded-xl text-[#2E5A44] mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Autonomous Screening</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Step-by-step risk-screening metrics designed to flag alerts instantly and interface directly with supportive local clinic hubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 bg-[#FAFAF9]">
        © 2026 VitalMama Platform. All rights reserved.
      </footer>
    </div>
  );
}