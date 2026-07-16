// src/app/api.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

// --- Send Triage Message ---
export async function sendTriageMessage(message: string, stageWeeks: number = 28) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        stage_weeks: stageWeeks,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch triage response");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch triage response:", error);
    // Return a clean fallback object so the UI doesn't crash on connection failures
    return {
      response: "Oh, I'm having trouble connecting right now. Please check if the local server is running, or seek clinical advice immediately.",
      risk_status: "Error"
    };
  }
}

// --- Transcribe Audio File ---
export async function transcribeAudioFile(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    const response = await fetch(`${BACKEND_URL}/api/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to transcribe audio");
    }

    const data = await response.json();
    return data.transcript || "";
  } catch (error) {
    console.error("Transcription pipeline failed:", error);
    throw error;
  }
}