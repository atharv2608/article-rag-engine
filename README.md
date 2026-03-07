# Article RAG Engine

A Retrieval-Augmented Generation (RAG) engine that enables intelligent Q&A over your article knowledge base. Upload articles, and the system automatically chunks, embeds, and indexes them for semantic search, then uses Google's Gemini to generate accurate answers grounded in your content.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Express   │────▶│   MongoDB   │     │   ChromaDB  │
│   REST API  │     │  (Articles) │     │ (Embeddings)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │            ┌─────────────┐            │
       └───────────▶│   Gemini    │◀───────────┘
                    │  2.5 Flash  │
                    └─────────────┘
```

**Data Flow:**
1. Articles are stored in MongoDB and chunked into segments
2. Each chunk is embedded via Gemini and stored in ChromaDB
3. User questions are embedded and matched against stored vectors
4. Top relevant chunks are retrieved and passed to Gemini for answer generation

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Vector Store | ChromaDB |
| AI/Embeddings | Google Gemini (gemini-2.5-flash, gemini-embedding-001) |

## Prerequisites

- Node.js 18+
- MongoDB instance
- ChromaDB server running on `localhost:8000`
- Google AI API key

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd article-rag-engine
npm install
```

### 2. Configure Environment

```bash
cp .env.sample .env
```

Edit `.env` with your credentials:

```env
MONGODB_URI="mongodb://localhost:27017/rag-knowledge"
PORT=3000
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Start ChromaDB

```bash
docker run -p 8000:8000 chromadb/chroma
```

### 4. Run the Service

```bash
npm start
```

## API Reference

### Articles

#### Add Article
```http
POST /api/articles
Content-Type: application/json

{
  "title": "Introduction to RAG",
  "content": "Retrieval-Augmented Generation combines..."
}
```

**Response:** `201 Created`
```json
{
  "message": "Article saved. Processing started"
}
```

Articles are processed asynchronously. Status transitions: `processing` → `ready` | `error`

#### Update Article
```http
PUT /api/articles/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### Chat

#### Ask a Question
```http
POST /api/chat
Content-Type: application/json

{
  "question": "What is RAG?"
}
```

**Response:**
```json
{
  "answer": "RAG (Retrieval-Augmented Generation) is...",
  "sources": [
    "chunk content 1...",
    "chunk content 2...",
    "chunk content 3..."
  ]
}
```

## Project Structure

```
src/
├── controllers/
│   ├── article.controller.js   # Article CRUD operations
│   └── chat.controller.js      # Q&A endpoint
├── db/
│   ├── chroma.js               # ChromaDB client
│   └── connectToDb.js          # MongoDB connection
├── models/
│   └── Article.js              # Mongoose schema
├── routes/
│   ├── article.routes.js
│   └── chat.routes.js
├── services/
│   ├── generationService.js    # Gemini answer generation
│   ├── processArticles.js      # Chunk & embed pipeline
│   └── retrievalService.js     # Vector similarity search
└── utils/
    ├── chunkText.js            # Text chunking (300 words, 50 overlap)
    ├── createEmbedding.js      # Gemini embedding wrapper
    └── geminiClient.js         # Gemini SDK client
```

## How It Works

### Ingestion Pipeline
1. Article received via API
2. Text split into overlapping chunks (300 words, 50-word overlap)
3. Each chunk embedded using `gemini-embedding-001`
4. Embeddings stored in ChromaDB with article metadata

### Query Pipeline
1. User question embedded using same model
2. Top-K similar chunks retrieved from ChromaDB (default: 3)
3. Chunks passed as context to `gemini-2.5-flash`
4. Model generates answer strictly from provided context

## License

ISC
