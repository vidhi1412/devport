import { PortfolioData } from "../types";

/**
 * Invokes the backend API route securely to parse the prompt using Gemini
 */
export async function generateAIPortfolio(prompt: string, currentData: PortfolioData): Promise<PortfolioData> {
  const response = await fetch("/api/generate-portfolio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, currentData }),
  });
  
  if (!response.ok) {
    let errorMsg = "";
    try {
      const errData = await response.json();
      errorMsg = errData.error || response.statusText;
    } catch {
      try {
        errorMsg = await response.text() || response.statusText;
      } catch {
        errorMsg = response.statusText;
      }
    }
    throw new Error(errorMsg);
  }
  
  return response.json() as Promise<PortfolioData>;
}
