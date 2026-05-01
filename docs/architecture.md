# Architecture Document

## System Overview
The Voter Intelligence Platform is built using a modern, serverless architecture to ensure rapid development, high availability, and resilience against API rate limits. It utilizes a monolithic Next.js structure where the frontend and backend APIs are tightly integrated for optimized deployment via Docker to Google Cloud Run.

## Tech Stack
- **Frontend Framework**: Next.js 14 (App Router) with React
- **Styling**: Material-UI (MUI) and Custom Vanilla CSS (Glassmorphism/Modern Aesthetics)
- **State Management**: React Context API (`LanguageContext`)
- **Conversational AI**: Google Generative AI REST API (Gemini 3.1 Flash Lite, Gemini 2.5 Flash, Gemma 2 2B)
- **External Data APIs**: NewsData.io (Live News), Google Maps API (`@vis.gl/react-google-maps`)
- **Deployment Target**: Next.js Standalone build via Docker (Google Cloud Run)

## Core Mechanisms
1. **REST-Based Model Cascade**: To ensure high availability on free-tier limits, backend API routes implement an automatic fallback sequence. If a primary Gemini model hits a `429 Rate Limit`, the system automatically reroutes the request to the local `gemma-2-2b-it` parameter model without failing the user request.
2. **Whitelist Prompt Wrapping**: Security and domain restriction are enforced dynamically at the AI level. The final user query is wrapped in a strict evaluator prompt that forces the AI to analyze the query's relevance to civic governance *before* generating an answer, eliminating the need for brittle hardcoded JavaScript filters.
3. **Global Multi-lingual Context**: A centralized Context Provider instantly propagates language translations (7 Indian Languages) to both static UI elements and dynamic AI system prompts.

## Component Architecture

### 1. Frontend UI Components
- `context/LanguageContext.jsx`: Global state provider for translations and language preferences.
- `components/ChatBot.jsx`: Client interface for the Voter Assistant, handling streaming responses and model selection.
- `components/Timeline.jsx`: CSS-driven interactive component displaying the sequential electoral process.
- `components/CandidateProfiler.jsx`: Educational UI simulating the breakdown of candidate affidavits (assets, liabilities, cases).
- `app/pulse/page.jsx`: The Election Pulse dashboard rendering live news feeds and AI sentiment scores.
- `app/manifesto/page.jsx`: The Manifesto Analyzer interface for evaluating political text.

### 2. Backend API (Next.js Route Handlers)
- `/api/chat`: Processes user messages, enforces Prompt Wrapping, executes the Model Cascade, and returns the AI's civic response.
- `/api/news`: Fetches live political news via NewsData.io, formats the headlines, and prompts the AI cascade to generate an aggregated Voter Sentiment score.
- `/api/manifesto`: Evaluates user-submitted manifesto text using the AI cascade to extract core promises and score their legislative feasibility.
