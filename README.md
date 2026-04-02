# Smart Competitor Intelligence System

An AI-powered dashboard for real-time monitoring of competitor websites, product updates, pricing changes, and social buzz. This system provides actionable insights and automated reports to help businesses stay ahead of the competition.

## 👥 Created By

| Name                 |
| -------------------- |
| **Sheetalkumar S C** |
| **Rohit Bhavi**      |

## 🚀 Features

- **Real-time Dashboard:** Overview of market share, competitor trends, and overall sentiment.
- **AI-Powered Insights:** Automated analysis of competitor moves using Gemini AI.
- **Competitor Tracking:** Detailed monitoring of specific competitor profiles and updates.
- **Sentiment Analysis:** Visual distribution of customer sentiment across different competitors.
- **Automated Reports:** Generate and download comprehensive intelligence reports.
- **Notifications:** Stay alerted on critical pricing changes or product launches.
- **Responsive Design:** Fully optimized for desktop and mobile viewing.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts (D3-based)
- **AI Engine:** Google Gemini API (@google/genai)
- **Icons:** Lucide React (Custom implementations)

## 📁 Project Structure

```text
├── components/
│   ├── charts/         # Recharts implementations (Market Share, Trends, etc.)
│   ├── icons/          # Custom Lucide-based icon components
│   ├── pages/          # Main view components (Dashboard, Insights, etc.)
│   └── shared/         # Reusable UI components (Button, Card)
├── services/
│   └── geminiService.ts # AI integration logic
├── types.ts            # Global TypeScript definitions
├── App.tsx             # Main application routing and layout
└── index.tsx           # Entry point
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key

### Installation

1. Clone the repository or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🤖 AI Integration

The system leverages the **Gemini 3 Flash** model to:

- Summarize competitor news and updates.
- Identify market trends from raw data.
- Provide strategic recommendations based on competitor pricing shifts.
