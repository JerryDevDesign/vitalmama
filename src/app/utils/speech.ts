// src/app/utils/speech.ts

/**
 * Triggers the browser's native text-to-speech engine to read out clinical text.
 * Falls back to available English/local accent dialects if present.
 */
export const speakTriageResponse = (text: string) => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    // 1. Cancel any current speech so it doesn't overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 2. Fetch browser voices and look for English dialects
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(
      (voice) => voice.lang.includes("en-NG") || voice.lang.includes("en-GB") || voice.lang.includes("en-US")
    );
    
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    // 3. Set comfortable pacing and tone
    utterance.rate = 0.95;  // Slightly slower for clear, stress-free clinical comprehension
    utterance.pitch = 1.0; 

    // 4. Speak
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech synthesis is not supported on this browser.");
  }
};
// This forces browsers to pre-cache the system voices on load
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}