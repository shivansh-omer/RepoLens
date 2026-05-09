# 🔍 RepoLens AI

RepoLens AI is an AI-powered GitHub repository analyzer. Understand any public codebase in seconds with intelligent architecture analysis, tech stack detection, and an interactive file explorer.

![RepoLens Preview](https://github.com/shivansh-omer/RepoLens/assets/placeholder.png) <!-- Update with your actual image -->

## 🚀 The Problem It Solves
Understanding a new GitHub repository is one of the most time-consuming tasks in software development. Large repos have hundreds of files, and without an architectural overview, it's easy to get lost. 

**RepoLens AI** offers instant, zero-setup, AI-powered analysis of any public GitHub repo via a simple URL input—combined with an interactive file explorer and per-file AI explanations. No sign-up required. No repo integration needed.

## ✨ Key Features
- **Instant Repository Overview**: Get a clear summary of what the project does.
- **Tech Stack Detection**: Automatically identifies frameworks, languages, databases, and tools.
- **Architecture & Data Flow Analysis**: Identifies patterns (MVC, microservices) and explains how data moves through the system.
- **Key Module Breakdown**: Lists the most important modules with their purpose and location.
- **Interactive File Explorer**: Browse the repository tree directly within the app.
- **AI File Explanations**: Click "Explain with AI" on any file to get a breakdown of its purpose, dependencies, and architectural role.
- **Health Indicators**: Assesses documentation quality, code organization, and project maturity.

## 🛠️ Technology Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Vercel Serverless Functions
- **AI Engine**: Google Gemini AI
- **Data Source**: GitHub REST API

## 🚦 Getting Started (Local Development)

### Prerequisites
- Node.js & npm installed
- A free **Google Gemini API Key**

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/shivansh-omer/RepoLens.git
   cd RepoLens
   ```

2. **Install dependencies:**
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

## ☁️ Deployment (Vercel)

This project is optimized for deployment on Vercel. 

1. Push your code to your GitHub repository.
2. Import the project into Vercel.
3. In Vercel's **Environment Variables** settings, add:
   - Key: `GEMINI_API_KEY`
   - Value: `<Your Google Gemini API Key>`
4. Deploy! Vercel will automatically configure the serverless backend (from the `api/` directory) and handle the SPA routing.

## 👨‍💻 Developer
Developed by Shivansh Omer.

---
*Built with React, Vite, and Gemini AI.*
