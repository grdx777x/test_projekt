# AfterDark — local-first AI companion

A static GitHub Pages companion app inspired by the feature set of modern AI companion platforms.

## Current stack
- GitHub Pages for free static hosting.
- Browser-local LLM through WebLLM/WebGPU when supported.
- Ollama as an optional stronger local backend.
- Browser speech recognition and speech synthesis for Live/Voice.
- localStorage for characters, conversations and memory.
- No mandatory paid API, account or token system.

## AI
Open **⚙ AI** in the app. **Uruchom AI w przeglądarce** loads a supported WebLLM model directly into the browser. The first download can be large and later runs use the browser cache. If WebGPU is unavailable, Ollama can be configured in the same panel.

## Hosting
GitHub Pages serves the static files. GitHub documents that Pages is available on public repositories under GitHub Free.

## Privacy
Character data, chats and memory are stored in browser localStorage. A remote AI provider is only used when the user explicitly configures one.

## Important
Free hosting does not mean unlimited remote compute. Browser-local inference avoids hosted token quotas, but speed and model size depend on the device. GitHub Pages can also take several minutes to publish a new commit.
