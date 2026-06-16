# CyberifyDesk — Database Schema Documentation

> **Database**: MongoDB (via Mongoose) · **Vector Store**: Qdrant · **Queue**: Redis (BullMQ/Valkey)
---

## Architecture Overview

The project has **two services** with different data stores:

| Service | Store | Purpose |
|---|---|---|
| **CyberifyDesk** | MongoDB (`cyberifydesk` db) | Users, Tickets, Messages |
| **DeskRAG** | Qdrant (`pdf-docs` collection) | RAG document embeddings |
| **DeskRAG** | Redis / Valkey | BullMQ job queue for async file processing |

---

---

## MongoDB Collections

### 1. `users`

**Model**: `User.model.ts`
**Interface**: `IUser`

| Field | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | auto | auto | Primary Key | Mongoose auto-generated |
| `fullName` | `String` | ✅ | — | trimmed | Full name of the user |
| `email` | `String` | ✅ | — | **unique**, trimmed | Login email address |
| `password` | `String` | ✅ | — | bcrypt hashed (10 rounds) | Hashed on save via pre-save hook |
| `isVerified` | `Boolean` | ✗ | `false` | — | Email/OTP verification status |
| `organization` | `String` | ✗ | `null` | — | Organization the user belongs to |
| `role` | `String` | ✗ | `"user"` | enum: `user`, `agent` | Determines access level |
| `otp` | `String` | ✗ | `null` | — | One-time password for verification flows |
| `refreshToken` | `String` | ✗ | `null` | — | JWT refresh token for session management |
| `createdAt` | `Date` | auto | auto | — | Mongoose timestamp |
| `updatedAt` | `Date` | auto | auto | — | Mongoose timestamp |

**Instance Methods**:

| Method | Signature | Description |
|---|---|---|
| `isPasswordCorrect` | `(password: string) → Promise<boolean>` | Compares plaintext password against stored bcrypt hash |
| `generateAccessToken` | `() → string` | Signs a JWT with `_id`, `email`, `fullName`, `role`. Expires per `ACCESS_TOKEN_EXPIRY` (default `1d`) |
| `generateRefreshToken` | `() → string` | Signs a JWT with `_id` only. Expires per `REFRESH_TOKEN_EXPIRY` (default `7d`) |

**Hooks**:
- **pre-save**: If `password` field is modified, it is automatically hashed with bcrypt (salt rounds = 10) before persisting.

---

### 2. `tickets`

**Model**: `Ticket.model.ts`
**Interface**: `ITicket`

| Field | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | auto | auto | Primary Key | Mongoose auto-generated |
| `title` | `String` | ✅ | — | trimmed | Short summary of the issue |
| `priority` | `String` | ✅ | `"medium"` | enum: `low`, `medium`, `high` | Urgency level |
| `description` | `String` | ✅ | — | — | Detailed problem description |
| `status` | `String` | ✅ | `"open"` | enum: `open`, `close`, `pending` | Current ticket state |
| `customer` | `ObjectId` | ✅ | — | **ref → User** | The user who created the ticket |
| `organization` | `String` | ✅ | — | — | Scoped to the customer's organization |
| `summary` | `String` | ✗ | — | — | AI-generated or agent-written summary |
| `solution` | `String` | ✗ | — | — | Resolution details |
| `rootCause` | `String` | ✗ | — | — | Root cause analysis |
| `createdAt` | `Date` | auto | auto | — | Mongoose timestamp |
| `updatedAt` | `Date` | auto | auto | — | Mongoose timestamp |

---

### 3. `messages`

**Model**: `Message.model.ts`
**Interface**: `IMessage`

| Field | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | auto | auto | Primary Key | Mongoose auto-generated |
| `ticketId` | `ObjectId` | ✅ | — | **ref → Ticket**, **indexed** | The ticket this message belongs to |
| `senderId` | `ObjectId` | ✗ | `null` | **ref → User** | The user who sent the message (`null` for system messages) |
| `senderType` | `String` | ✅ | — | enum: `user`, `agent`, `system` | Who or what sent the message |
| `message` | `String` | ✅ | — | trimmed | Message body text |
| `createdAt` | `Date` | auto | auto | — | Mongoose timestamp (updatedAt disabled) |

---

## Indexes & Constraints

| Collection | Field(s) | Type | Notes |
|---|---|---|---|
| `users` | `email` | Unique | Enforced at schema level |
| `users` | `_id` | Primary | Mongoose default |
| `messages` | `ticketId` | Index | Explicit `index: true` for fast ticket message lookups |
| `tickets` | `_id` | Primary | Mongoose default |
| `messages` | `_id` | Primary | Mongoose default |

---

## Qdrant Vector Store (DeskRAG)

**Collection Name**: `pdf-docs`
**Embedding Model**: `gemini-embedding-2` (Google GenAI)

Used by the RAG pipeline in `DeskRAG` for knowledge-base document retrieval.

| Property | Details |
|---|---|
| Collection | `pdf-docs` |
| Embedding Dimensions | Determined by `gemini-embedding-2` output |
| Chunk Size | 10,000 characters |
| Chunk Overlap | 100 characters |
| Supported File Types | PDF (`.pdf`), plain text (`.txt`) |
| Max Upload Size | 250 KB |

**Pipeline Flow**:

---

## Redis / BullMQ Queue

**Queue Name**: `data-upload-queue`
**Backend**: Valkey (Redis-compatible)

| Property | Value |
|---|---|
| Queue Name | `data-upload-queue` |
| Worker Concurrency | 100 |
| Default Host | `localhost` / `valkey` (Docker) |
| Default Port | `6379` |

**Job Payload** (`file-ready`):

```json
{
  "filename": "1718528400000-123456789-document.pdf",
  "destination": "uploads/",
  "path": "uploads/1718528400000-123456789-document.pdf"
}
```

---

## Environment Variables (Database-Related)

| Variable | Service | Description |
|---|---|---|
| `MONGODB_URI` | CyberifyDesk | MongoDB connection string (db name `cyberifydesk` appended) |
| `ACCESS_TOKEN_SECRET` | CyberifyDesk | JWT signing secret for access tokens |
| `ACCESS_TOKEN_EXPIRY` | CyberifyDesk | Access token TTL (default `1d`) |
| `REFRESH_TOKEN_SECRET` | CyberifyDesk | JWT signing secret for refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | CyberifyDesk | Refresh token TTL (default `7d`) |
| `QDRANT_URL` | DeskRAG | Qdrant server URL (default `http://localhost:6333`) |
| `REDIS_HOST` | DeskRAG | Redis/Valkey host (default `localhost`) |
| `REDIS_PORT` | DeskRAG | Redis/Valkey port (default `6379`) |
| `GOOGLE_API_KEY` | DeskRAG | Google GenAI API key for embeddings |
| `DESKRAG_API_KEY` | DeskRAG | API key for authenticating requests to DeskRAG |
