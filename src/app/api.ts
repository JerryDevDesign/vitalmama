export interface TriageResponse {
  response: string;
  risk_status: "Normal" | "Critical" | "Error";
}

export const sendTriageMessage = async (
  userMessage: string,
  stageWeeks: number = 28
): Promise<TriageResponse> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
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