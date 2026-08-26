# Companion AI

Standalone AI character chat designed for local, private use.

## Features
- No account or login required
- Character catalog and search
- Create and edit characters
- Character personality prompts
- Persistent chat history in browser localStorage
- Local LLM inference with WebLLM/WebGPU
- No external AI API key required
- Responsive mobile layout

## Run
Open `index.html` from a static web server. WebGPU works best in current Chrome or Edge. On first AI use, the selected model is downloaded to the browser cache; subsequent sessions can reuse it.

## Privacy
Conversation and character data are stored locally in the browser. No application backend is required for the AI chat.

## Important
"Unlimited" here means the app does not impose a message quota and inference does not consume a hosted API quota. Actual speed, context size and storage depend on the user's device/browser.
