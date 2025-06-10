# AI Motion Graphics - Proof of Concept

A simple web-based proof of concept for a tool that generates HTML/CSS animations and motion graphics from natural language text prompts using the Google Gemini API.

![Screenshot of the POC in action](PASTE_A_LINK_TO_A_SCREENSHOT_HERE)
*(Suggestion: Take a screenshot of a successful animation and upload it to a site like [Imgur](https://imgur.com/upload) to get a link.)*

---

## The Concept

This project explores the idea of a revolutionary video editing tool where complex animations and transitions are not manually created with keyframes, but are generated instantly by an AI. The goal is to dramatically speed up the video creation workflow and empower creators to produce high-quality motion graphics with ease.

This POC demonstrates the core mechanic: a user types a command, and the AI generates the corresponding HTML and CSS animation code in real-time.

## How It Works

* **Frontend:** Plain HTML, CSS, and JavaScript.
* **AI Backend:** The application calls the Google Gemini API (`gemini-1.5-flash-latest` model) to translate the user's text prompt into code.
* **Rendering:** The generated HTML/CSS code is injected directly into the DOM and rendered in a preview window, simulating how it would be overlaid on a video track.

## Setup and Usage

To run this project locally, follow these steps:

1.  **Download the Code:** Clone this repository or download it as a ZIP file.
2.  **Get an API Key:** Go to [Google AI Studio](https://aistudio.google.com/) and generate a free API key.
3.  **Add Your Key:** Open the `script.js` file and paste your API key into the `GEMINI_API_KEY` constant.
    ```javascript
    const GEMINI_API_KEY = 'PASTE_YOUR_API_KEY_HERE';
    ```
4.  **Run with Live Server:**
    * Open the project folder in VS Code.
    * Make sure you have the "Live Server" extension installed.
    * Right-click on `index.html` and select "Open with Live Server".

## Prompt Examples

Here are some prompts that work well with the current setup:

* `Show the text 'Welcome!' with a bounce animation`
* `Create a blue square that spins`
* `Animate a pulsing red heart`
* `A countdown from 3 to 1`

## Next Steps & Future Ideas

This is just the beginning! The vision for this project includes:

* [ ] Integrating this into a real video editor timeline (like a Desktop App).
* [ ] Allowing users to drag, drop, and resize the generated animations.
* [ ] Creating more complex transitions between video clips.
* [ ] Building a library of saved user-generated animations.
