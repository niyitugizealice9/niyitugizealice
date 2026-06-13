export async function getChatResponse(userMessage: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });
    
    if (!response.ok) {
      throw new Error(`Cloud connection failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that. You can reach Alice at niyitugizealice9@gmail.com!";
  } catch (error) {
    console.error("AI client fetch error:", error);
    return "I'm having trouble contacting my neural core network. Please try again or reach Alice directly at niyitugizealice9@gmail.com!";
  }
}
