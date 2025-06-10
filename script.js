


// FINAL WORKING CODE - v9 (Stricter Prompt to Remove Symbols)
document.addEventListener('DOMContentLoaded', () => {

    const commandInput = document.getElementById('command-input');
    const generateBtn = document.getElementById('generate-btn');
    const previewScreen = document.getElementById('preview-screen');

   const GEMINI_API_KEY = 'AIzaSyCbD2M0Ain9pQLhc7A1ofbR-HHm_7TQjRs'; // Use your newest API key  constants
    
    async function runAiGenerator() {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
            previewScreen.innerHTML = `<p class="loading-text" style="color:red;">Error: Please paste your API Key into script.js</p>`;
            return;
        }
        
        const userCommand = commandInput.value.trim();
        if (userCommand === '') {
            previewScreen.innerHTML = `<p class="loading-text" style="color:orange;">Please enter a command.</p>`;
            return;
        }

        previewScreen.innerHTML = '<p class="loading-text">Generating animation...</p>';

        // =================================================================
        // THE NEW, EVEN STRICTER PROMPT IS HERE
        // =================================================================
        const prompt = `
            You are an expert motion graphics designer who ONLY responds with raw HTML code.
            The user wants an animation for: "${userCommand}"

            Generate a single, self-contained HTML element with an inline <style> tag.
            The <style> tag must contain a CSS animation using @keyframes.

            To create a countdown or multi-step text animation, create separate HTML elements for each number or word. Animate the opacity or transform of these individual elements to make them appear in sequence.
            
            IMPORTANT: Do NOT try to animate the CSS 'content' property inside @keyframes, as it is not supported.
            IMPORTANT: Do not include any extra symbols, icons, or non-alphanumeric characters unless specifically asked for in the user's request.
            
            Your entire response must be ONLY the raw HTML code. Do not use markdown or any explanations.
        `;
        
        const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        
        const requestBody = {
            "contents": [{ "parts": [{ "text": prompt }] }],
            "generationConfig": { "temperature": 0.7, "maxOutputTokens": 4096 }
        };

        try {
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                const rawResponse = data.candidates[0].content.parts[0].text;
                
                const htmlStartIndex = rawResponse.indexOf('<');
                let processedResponse = rawResponse;

                if (htmlStartIndex !== -1) {
                    processedResponse = rawResponse.substring(htmlStartIndex);
                }
                
                const txt = document.createElement("textarea");
                txt.innerHTML = processedResponse;
                const cleanedCode = txt.value;

                previewScreen.innerHTML = cleanedCode;

            } else {
                console.error("Invalid response from AI:", data);
                let errorMessage = "AI response was empty or invalid.";
                if (data.promptFeedback && data.promptFeedback.blockReason) {
                    errorMessage += ` Reason: ${data.promptFeedback.blockReason}`;
                } else if(data.error) {
                    errorMessage += ` API Error: ${data.error.message}`;
                }
                previewScreen.innerHTML = `<p class="loading-text" style="color:red;">${errorMessage}</p>`;
            }

        } catch (error) {
            console.error("Critical Error:", error);
            previewScreen.innerHTML = `<p class="loading-text" style="color:red;">A critical error occurred. Check the browser console.</p>`;
        }
    }

    generateBtn.addEventListener('click', runAiGenerator);
});

