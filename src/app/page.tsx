"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity,
  Heart,
  AlertCircle,
  Play,
  Menu,
  Send,
  Loader2,
  Home as HomeIcon,
  BookOpen,
  PhoneCall,
  Mic,
  MicOff
} from "lucide-react";
import { sendTriageMessage, transcribeAudioFile } from "./api";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  riskStatus?: "Normal" | "Critical" | "Error";
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "guides" | "emergency">("home");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
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

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // MediaRecorder Refs for capturing raw audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const toggleVoiceGuide = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      const lastBotMessage = [...messages].reverse().find((m) => m.sender === "bot");
      if (!lastBotMessage) return;

      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
      utteranceRef.current = utterance;

      const voices = synthRef.current.getVoices();
      const selectedVoice = voices.find(v => v.lang.includes("en-NG") || v.lang.includes("en-GB") || v.lang.includes("en"));
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.rate = 0.85; 
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      synthRef.current.speak(utterance);
    }
  };

  // --- Whisper Media Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        
        try {
          // Transcribe using backend Whisper API
          const textTranscript = await transcribeAudioFile(audioBlob);
          if (textTranscript.trim()) {
            setInputValue(textTranscript);
            // Submit the transcribed text instantly to the Chat flow
            await handleSendMessage(undefined, textTranscript);
          }
        } catch (err) {
          console.error("Transcription pipeline failed", err);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access blocked or unsupported", err);
      alert("Please ensure microphone permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      // Turn off microphone input device stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      if (synthRef.current && isPlaying) {
        synthRef.current.cancel();
        setIsPlaying(false);
      }
      startRecording();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const textToSend = directText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    setInputValue("");
    
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const data = await sendTriageMessage(textToSend, 28);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: data.response,
      riskStatus: data.risk_status,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F3] flex items-center justify-center font-sans antialiased">
      <div className="w-full h-screen sm:h-[840px] sm:max-w-[410px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 bg-[#FAFAF9] overflow-hidden flex flex-col relative text-slate-800">
        <div className="h-6 bg-white shrink-0 hidden sm:block" />

        {/* Header */}
        <header className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-[#2E5A44] p-1.5 rounded-xl text-white">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-[#1C3E2F]">
              Vital<span className="text-[#65A765]">Mama</span>
            </span>
          </div>
          <Menu className="h-5 w-5 text-slate-500" />
        </header>

        {/* Body content based on tab selection */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#FAF9F6]">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div 
                key="home" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Progress Card */}
                <div className="bg-white p-4 mx-4 mt-4 rounded-2xl border border-slate-100 shadow-sm space-y-3 shrink-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Patient Status</p>
                      <h4 className="text-sm font-extrabold text-slate-800">Amina Oke</h4>
                    </div>
                    <span className="text-xs bg-[#E2F0D9] text-[#2E5A44] font-bold px-3 py-1 rounded-full shadow-sm">Week 28</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-xl text-pink-500 shrink-0">
                      <Heart className="h-4 w-4 fill-pink-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>Gestational Progress</span>
                        <span>70%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-400 to-[#65A765] h-full w-[70%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Message Box */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 flex flex-col">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-[#2E5A44] text-white self-end rounded-br-none"
                          : "bg-white text-slate-800 self-start rounded-bl-none border border-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.riskStatus && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${msg.riskStatus === "Critical" ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Triage Status: {msg.riskStatus}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 text-xs self-start rounded-bl-none shadow-sm flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2E5A44]" />
                      <span className="text-slate-400 italic">Processing audio transcript...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Localized Audio Playback Bar */}
                <div className="bg-white px-4 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 shadow-inner">
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={toggleVoiceGuide}
                      className="bg-[#2E5A44] p-2.5 rounded-xl text-white hover:bg-[#234735] transition-colors"
                    >
                      <Play className={`h-3.5 w-3.5 fill-white ${isPlaying ? "animate-pulse" : ""}`} />
                    </button>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Trimester 3 Clinical Guide</p>
                      <p className="text-[10px] text-slate-400 font-medium">Audio (Nigerian Accent Dialect)</p>
                    </div>
                  </div>
                  {isPlaying && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse border border-emerald-100">Speaking...</span>}
                </div>

                {/* Input Controls */}
                <form onSubmit={(e) => handleSendMessage(e)} className="bg-white border-t border-slate-100 p-3 flex gap-2 items-center shrink-0">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-3 rounded-2xl transition-all shadow-md active:scale-95 ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-[#E2F0D9] text-[#2E5A44] hover:bg-[#d0e5c5]"}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isListening ? "Listening closely... Tap to stop" : "Describe symptoms or ask anything..."}
                    disabled={isLoading}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#2E5A44] text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-[#2E5A44] text-white p-3 rounded-2xl hover:bg-[#234735]"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* Guides Section */}
            {activeTab === "guides" && (
              <motion.div key="guides" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 p-6 space-y-4 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-800">Maternal Education Hub</h3>
                <p className="text-xs text-slate-500">Offline-optimized audio lessons for your pregnancy stage.</p>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-[#2E5A44]">Lesson 1: Preeclampsia Warning Signs</h4>
                  <p className="text-[11px] text-slate-500">Learn how to spot dangerous blood pressure elevations at home.</p>
                </div>
              </motion.div>
            )}

            {/* Emergency tab */}
            {activeTab === "emergency" && (
              <motion.div key="emergency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 p-6 space-y-4 overflow-y-auto text-center justify-center flex flex-col">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-800">Emergency Dispatch</h3>
                <p className="text-xs text-slate-500">Instantly register critical cases directly to local transport networks.</p>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl text-xs mt-4">Trigger Emergency Assistance</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Bar */}
        <nav className="bg-white border-t border-slate-100 py-3 px-6 flex justify-between items-center shrink-0 shadow-lg">
          <button type="button" onClick={() => setActiveTab("home")} className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-[#2E5A44]" : "text-slate-400"}`}>
            <HomeIcon className="h-5 w-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button type="button" onClick={() => setActiveTab("guides")} className={`flex flex-col items-center gap-1 ${activeTab === "guides" ? "text-[#2E5A44]" : "text-slate-400"}`}>
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-bold">Guides</span>
          </button>
          <button type="button" onClick={() => setActiveTab("emergency")} className={`flex flex-col items-center gap-1 ${activeTab === "emergency" ? "text-red-500" : "text-slate-400"}`}>
            <PhoneCall className="h-5 w-5" />
            <span className="text-[10px] font-bold">Emergency</span>
          </button>
        </nav>
      </div>
    </div>
  );
}