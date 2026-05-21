# PDF RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot that allows users to upload PDF documents and ask questions about their content.

## Features

- PDF upload support
- Text extraction using PyPDF
- Semantic search with ChromaDB
- Embeddings generated using Ollama (`nomic-embed-text`)
- Answer generation using Llama 3
- React frontend
- FastAPI backend

## Tech Stack

- React
- FastAPI
- ChromaDB
- Ollama
- PyPDF

## Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Ollama Models

```bash
ollama pull llama3
ollama pull nomic-embed-text
ollama serve
```

## How It Works

1. Upload a PDF
2. Extract and chunk text
3. Generate embeddings
4. Store vectors in ChromaDB
5. Retrieve relevant context
6. Generate answers using Llama 3
