

// // FINAL WORKING CODE - v11 (Using Your Improved Cleaning Logic)
// document.addEventListener('DOMContentLoaded', () => {

//     const commandInput = document.getElementById('command-input');
//     const generateBtn = document.getElementById('generate-btn');
//     const previewScreen = document.getElementById('preview-screen');

//     const GEMINI_API_KEY = 'PASTE_YOUR_API_KEY_HERE'; // Use your newest API key
    
//     async function runAiGenerator() {
//         if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
//             previewScreen.innerHTML = `<p class="loading-text" style="color:red;">Error: Please paste your API Key into script.js</p>`;
//             return;
//         }
        
//         const userCommand = commandInput.value.trim();
//         if (userCommand === '') {
//             previewScreen.innerHTML = `<p class="loading-text" style="color:orange;">Please enter a command.</p>`;
//             return;
//         }

//         previewScreen.innerHTML = '<p class="loading-text">Generating animation...</p>';

//         const prompt = `
//             You are an expert motion graphics designer who ONLY responds with raw HTML code.
//             The user wants an animation for: "${userCommand}"

//             Generate a single, self-contained HTML element with an inline <style> tag.
//             The <style> tag must contain a CSS animation using @keyframes.

//             To create a countdown or multi-step text animation, create separate HTML elements for each number or word. Animate the opacity or transform of these individual elements to make them appear in sequence.
            
//             IMPORTANT: Do NOT try to animate the CSS 'content' property inside @keyframes, as it is not supported.
//             IMPORTANT: Do not include any extra symbols, icons, or non-alphanumeric characters unless specifically asked for in the user's request.
            
//             Your entire response must be ONLY the raw HTML code. Do not use markdown or any explanations.
//         `;
        
//         const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        
//         const requestBody = {
//             "contents": [{ "parts": [{ "text": prompt }] }],
//             "generationConfig": {
//                 "temperature": 0.2,
//                 "topK": 1,
//                 "topP": 1,
//                 "maxOutputTokens": 4096
//             }
//         };

//         try {
//             const response = await fetch(apiURL, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(requestBody)
//             });

//             const data = await response.json();

//             if (data.candidates && data.candidates.length > 0) {
//                 // =================================================================
//                 // YOUR NEW, MORE ROBUST CLEANING CODE
//                 // =================================================================
//                 let rawResponse = data.candidates[0].content.parts[0].text;

//                 const htmlBlockRegex = /```html\s*([\s\S]*?)\s*```/;
//                 const match = rawResponse.match(htmlBlockRegex);

//                 let cleanedCode = rawResponse;

//                 if (match && match[1]) {
//                     cleanedCode = match[1].trim();
//                 } else {
//                     const startIndex = cleanedCode.indexOf('<');
//                     const lastIndex = cleanedCode.lastIndexOf('>');
//                     if (startIndex !== -1 && lastIndex !== -1) {
//                         cleanedCode = cleanedCode.substring(startIndex, lastIndex + 1).trim();
//                     }
//                 }
                
//                 const txt = document.createElement("textarea");
//                 txt.innerHTML = cleanedCode;
//                 previewScreen.innerHTML = txt.value;

//             } else {
//                 console.error("Invalid response from AI:", data);
//                 let errorMessage = "AI response was empty or invalid.";
//                 if (data.promptFeedback && data.promptFeedback.blockReason) {
//                     errorMessage += ` Reason: ${data.promptFeedback.blockReason}`;
//                 } else if(data.error) {
//                     errorMessage += ` API Error: ${data.error.message}`;
//                 }
//                 previewScreen.innerHTML = `<p class="loading-text" style="color:red;">${errorMessage}</p>`;
//             }

//         } catch (error) {
//             console.error("Critical Error:", error);
//             previewScreen.innerHTML = `<p class="loading-text" style="color:red;">A critical error occurred. Check the browser console.</p>`;
//         }
//     }

//     generateBtn.addEventListener('click', runAiGenerator);
// });






// FINAL WORKING CODE - v13 with Image Animation
document.addEventListener('DOMContentLoaded', () => {

    const commandInput = document.getElementById('command-input');
    const generateBtn = document.getElementById('generate-btn');
    const previewScreen = document.getElementById('preview-screen');
    const imageUploader = document.getElementById('image-uploader'); // NEW: Get the image uploader

    // ... (References to the edit panel are the same)
    const editPanel = document.getElementById('edit-panel');
    const colorPicker = document.getElementById('color-picker');
    const durationSlider = document.getElementById('duration-slider');
    const durationLabel = document.getElementById('duration-label');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeLabel = document.getElementById('font-size-label');


    const GEMINI_API_KEY = 'PASTE_YOUR_API_KEY_HERE'; // Use your newest API key  constants
    
    // NEW: A function to convert an image file to Base64 text
    function fileToGenerativePart(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({
                    inlineData: {
                        data: reader.result.split(',')[1], // Remove the "data:image/jpeg;base64," part
                        mimeType: file.type
                    }
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function runAiGenerator() {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
            previewScreen.innerHTML = `<p class="loading-text" style="color:red;">Error: Please paste your API Key into script.js</p>`;
            return;
        }

        const userCommand = commandInput.value.trim();
        const imageFile = imageUploader.files[0]; // Get the selected image file

        // Check if there's either a command or an image
        if (userCommand === '' && !imageFile) {
            previewScreen.innerHTML = `<p class="loading-text" style="color:orange;">Please enter a command or upload an image.</p>`;
            return;
        }

        previewScreen.innerHTML = '<p class="loading-text">Generating animation...</p>';
        editPanel.style.display = 'none';

        // NEW: Construct the request parts (prompt + optional image)
        const requestParts = [];

        // Add the text prompt if it exists
        if (userCommand) {
             const prompt = `
                You are an expert motion graphics designer who ONLY responds with raw HTML code.
                The user wants an animation for the provided text and/or image based on this request: "${userCommand}"

                Generate a single, self-contained HTML element with an inline <style> tag that contains a CSS animation.
                If there is an image, use an <img> tag. If there is text, use a <span> or <div>.
                The main animated element MUST have the class "editable-text".
                Your entire response must be ONLY the raw HTML code. Do not use markdown or any explanations.
            `;
            requestParts.push({ text: prompt });
        }

        // Add the image if it exists
        if (imageFile) {
            try {
                const imagePart = await fileToGenerativePart(imageFile);
                requestParts.push(imagePart);
            } catch (error) {
                console.error("Error converting file:", error);
                previewScreen.innerHTML = `<p class="loading-text" style="color:red;">Error reading the image file.</p>`;
                return;
            }
        }
        
        const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        
        // NEW: The request body now contains our array of parts
        const requestBody = {
            "contents": [{ "parts": requestParts }],
            "generationConfig": { "temperature": 1, "maxOutputTokens": 8192 }
        };

        try {
            const response = await fetch(apiURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                // ... (The response cleaning logic is the same)
                let rawResponse = data.candidates[0].content.parts[0].text;
                const htmlStartIndex = rawResponse.indexOf('<');
                let processedResponse = rawResponse;
                if (htmlStartIndex !== -1) { processedResponse = rawResponse.substring(htmlStartIndex); }
                const txt = document.createElement("textarea");
                txt.innerHTML = processedResponse;
                previewScreen.innerHTML = txt.value;

                editPanel.style.display = 'block';

            } else {
                console.error("Invalid response from AI:", data);
                let errorMessage = "AI response was empty or invalid.";
                if (data.promptFeedback && data.promptFeedback.blockReason) { errorMessage += ` Reason: ${data.promptFeedback.blockReason}`; } 
                else if(data.error) { errorMessage += ` API Error: ${data.error.message}`; }
                previewScreen.innerHTML = `<p class="loading-text" style="color:red;">${errorMessage}</p>`;
            }
        } catch (error) {
            console.error("Critical Error:", error);
            previewScreen.innerHTML = `<p class="loading-text" style="color:red;">A critical error occurred. Check the browser console.</p>`;
        }
    }

    generateBtn.addEventListener('click', runAiGenerator);

    // ... (The edit panel event listeners remain the same)
    colorPicker.addEventListener('input', (event) => {
        const animatedElement = document.querySelector('.editable-text');
        if (animatedElement) { animatedElement.style.color = event.target.value; }
    });
    durationSlider.addEventListener('input', (event) => {
        const animatedElement = document.querySelector('.editable-text, #preview-screen img');
        if (animatedElement) {
            animatedElement.style.animationDuration = `${event.target.value}s`;
            durationLabel.textContent = `${event.target.value}s`;
        }
    });
    fontSizeSlider.addEventListener('input', (event) => {
        const animatedElement = document.querySelector('.editable-text');
        if (animatedElement) {
            animatedElement.style.fontSize = `${event.target.value}em`;
            fontSizeLabel.textContent = `${event.target.value}em`;
        }
    });
});