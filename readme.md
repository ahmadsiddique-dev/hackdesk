# HACKDESK

> Ticket management system that helps organizations manage client queries through an AI-powered Help Center with RAG-based knowledge retrieval.

## Tech Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Frontend & API   | Next.js, TypeScript, shadcn/ui        |
| Database         | MongoDB (Mongoose)                    |
| Auth             | JWT (Access + Refresh tokens), bcrypt |
| Validation       | Zod                                   |
| Email            | Resend                                |
| AI               | Google Gemini                         |
| RAG Pipeline     | LangChain, Qdrant (Vector DB), BullMQ |
| Queue/Cache      | Redis (Valkey)                        |
| Containerization | Docker Compose                        |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose
- MongoDB instance (local or Atlas)

### Clone

```bash
git clone https://github.com/ahmadsiddique-dev/cyberify-project
cd cyberify-project
```

### 1. HackDesk (Next.js App)

```bash
cd cyberifydesk
pnpm i
```

Copy `.env.example` to `.env` and fill in the values:

```bash
RESEND_API_KEY=your_resend_api_key
MONGODB_URI=your_mongodb_connection_string
DESKRAG_URI=http://localhost:7000
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
```

Start the dev server:

```bash
pnpm run dev
```

### 2. DeskRAG (RAG Microservice)

Open a new terminal:

```bash
cd deskrag
pnpm i
```

Spin up Qdrant and Valkey via Docker:

```bash
docker compose up -d
```

Copy `.env.example` to `.env` and fill in the values:

```bash
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
ALLOWED_ORIGIN=http://localhost:3000
DESKRAG_API_KEY=your_api_key
```

Start the API server and worker (two separate terminals):

```bash
pnpm run dev
```

```bash
pnpm run dev:worker
```
