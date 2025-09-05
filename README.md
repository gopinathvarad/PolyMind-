# PolyMind - AI Model Comparison Platform

PolyMind is a web application that allows users to compare responses from multiple AI models simultaneously. You can select from GPT-4, Claude 3.5 Sonnet, Gemini 2.0 Flash, and DeepSeek Chat, send a message, and see all responses side by side.

## Features

- **Multi-Model Comparison**: Compare responses from up to 4 AI models simultaneously
- **Real-time Responses**: All models respond in parallel for faster comparison
- **Responsive Design**: Adaptive column layout based on the number of selected models
- **Copy Functionality**: Easy copying of individual responses
- **Modern UI**: Clean, dark-mode compatible interface
- **OpenRouter Integration**: Uses OpenRouter API for accessing multiple AI models

## Supported AI Models

- **GPT-4o** (OpenAI) - Most capable GPT-4 model
- **Claude 3.5 Sonnet** (Anthropic) - Latest Claude model with enhanced capabilities
- **Gemini 2.0 Flash** (Google) - Google's latest multimodal model
- **DeepSeek Chat** (DeepSeek) - Advanced reasoning and coding capabilities

## Getting Started

### Prerequisites

- Node.js 18+
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai/keys))

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd PolyMind
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select Models**: Click "Add Model" to select which AI models you want to compare
2. **Send Message**: Type your question or prompt in the message box at the bottom
3. **Compare Responses**: View all responses side by side in organized columns
4. **Copy Responses**: Click the copy button on any response to copy it to your clipboard

## Project Structure

```
├── app/
│   ├── api/chat/          # API route for handling AI requests
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ModelSelector.tsx  # Model selection component
│   ├── MessageInput.tsx   # Message input component
│   └── ResponseColumn.tsx # Individual response display
├── lib/
│   ├── ai-models.ts       # AI model configurations
│   └── openrouter.ts      # OpenRouter API integration
└── types/
    └── ai.ts              # TypeScript type definitions
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenRouter** - AI model access
- **Lucide React** - Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
