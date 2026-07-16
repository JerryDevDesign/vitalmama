export interface TriageResponse {
  response: string;
  risk_status: "Normal" | "Critical" | "Error";
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

const response = await fetch(`${BACKEND_URL}/api/chat`, { ... })

const response = await fetch(`${BACKEND_URL}/api/transcribe`, { ... })

export const sendTriageMessage = async (
  userMessage: string,
  stageWeeks: number = 28
): Promise<TriageResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        stage_weeks: stageWeeks,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as TriageResponse;
  } catch (error) {
    console.error("Failed to fetch triage response:", error);
    return {
      response: "Oh, I'm having trouble connecting right now. Please check if the local server is running, or seek clinical advice immediately.",
      risk_status: "Error",
    };
  }
};

// --- NEW: Transcribe Audio Helper ---
export const transcribeAudioFile = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    const response = await fetch(`${BACKEND_URL}/api/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Transcription server error");
    }

    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error("Failed to transcribe audio:", error);
    throw error;
  }
};