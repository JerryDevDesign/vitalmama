"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ArrowRight,
  Smartphone,
  ShieldCheck,
  PhoneCall,
  Send,
  Loader2
} from "lucide-react";
import { sendTriageMessage } from "./api";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  riskStatus?: "Normal" | "Critical" | "Error";
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Real-time Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your VitalMama clinical helper. Tell me how you are feeling today.",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the phone mockup chat screen on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    
    // 1. Add user's message to the chat view
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Call local Python Backend
    const data = await sendTriageMessage(userText, 28);

    // 3. Add AI response to the chat view
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: data.response,
      riskStatus: data.risk_status,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

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

          {/* Right Column: Interactive PWA App Mockup */}
          <div id="preview" className="lg:col-span-6 flex flex-col items-center">
            <div className="relative mx-auto w-full max-w-[340px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800">
              
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-900 rounded-b-2xl z-20 flex justify-center items-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* PWA Screen View */}
              <div className="w-full aspect-[9/19] bg-[#FAFAF9] rounded-[38px] overflow-hidden flex flex-col select-none relative text-slate-800">
                
                {/* PWA App Status Bar */}
                <div className="bg-white px-6 pt-10 pb-3 flex items-center justify-between border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#2E5A44] p-1.5 rounded-lg text-white">
                      <Activity className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold tracking-tight text-[#1C3E2F]">VitalMama</span>
                  </div>
                  <Menu className="h-4 w-4 text-slate-400" />
                </div>

                {/* Patient Overview Card (Shrunk slightly to make room for chat) */}
                <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">Amina Oke</h4>
                    <p className="text-[9px] text-slate-400 font-medium">Gestational Progress</p>
                  </div>
                  <span className="text-[9px] bg-[#E2F0D9] text-[#2E5A44] font-bold px-2 py-0.5 rounded-full">
                    Week 28 (70%)
                  </span>
                </div>

                {/* Real-time Triage Chat Interface */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col bg-[#FAF9F6]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-[#2E5A44] text-white self-end rounded-br-none"
                          : "bg-white text-slate-800 self-start rounded-bl-none border border-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Risk Alert Badge for Triage Results */}
                      {msg.riskStatus && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-1.5">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            msg.riskStatus === "Critical" ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                          }`} />
                          <span className="text-[9px] font-bold text-slate-500 uppercase">
                            Risk: {msg.riskStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-3 text-[11px] self-start rounded-bl-none shadow-sm flex items-center gap-2 max-w-[85%]">
                      <Loader2 className="h-3 w-3 animate-spin text-[#2E5A44]" />
                      <span className="text-slate-400 italic">Thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Accent Audio Card (Docked above input) */}
                <div className="bg-white px-3 py-2 border-t border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-[#2E5A44] p-1.5 rounded-lg text-white hover:bg-[#234735]"
                    >
                      <Play className="h-2.5 w-2.5 fill-white" />
                    </button>
                    <div>
                      <p className="text-[9px] font-bold text-slate-800 leading-tight">Nigerian Accent Guide</p>
                    </div>
                  </div>
                  {isPlaying && <span className="text-[8px] text-emerald-500 font-semibold animate-pulse">Playing</span>}
                </div>

                {/* Input Bar (Type & Send message to backend) */}
                <form onSubmit={handleSendMessage} className="bg-white border-t border-slate-100 p-2 flex gap-1.5 items-center shrink-0">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type symptom or speak..."
                    disabled={isLoading}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-[#2E5A44] text-slate-800 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-[#2E5A44] text-white p-2 rounded-xl hover:bg-[#234735] disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>

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