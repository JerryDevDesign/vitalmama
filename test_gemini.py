from google import genai

# The client automatically picks up the GEMINI_API_KEY environment variable
client = genai.Client()

# We are using Google's modern flagship Flash model
response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Give me a 1-sentence tagline for a digital maternal health platform.",
)

print("--- Gemini's Response ---")
print(response.text)