# RepoLens AI

RepoLens AI is an AI-powered GitHub repository analyzer. Understand any codebase in seconds with architecture analysis and tech stack detection.

## Features

- Analyze any public GitHub repository.
- Get a complete breakdown of the project's tech stack.
- Understand the architecture pattern and data flow.
- Identify key modules and critical files.
- Receive AI-driven suggestions for improvement and health indicators.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase Edge Functions (Boilerplate)
- Google Gemini AI API

## Getting Started

### Prerequisites

- Node.js & npm installed

### Development Requirements
**Important:** You need a free Google Gemini API Key to run this app locally.

### Installation

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install the dependencies:**
   ```sh
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

## Deployment (Vercel)

This project is configured to deploy directly to [Vercel](https://vercel.com/) with secure Serverless Functions for handling API calls.

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. In Vercel's **Environment Variables** settings, add:
   - Key: `GEMINI_API_KEY`
   - Value: `<Your Google Gemini API Key>`
4. Deploy! Because we have `api/` endpoints and a `vercel.json` specified, Vercel will automatically set up the serverless backend and handle React Router's SPA routing.

## Usage

Simply enter a GitHub repository URL or the owner/repo format (e.g., `facebook/react`) into the search bar to begin the analysis.
