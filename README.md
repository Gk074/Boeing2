# AI Code Documentation Assistant

An AI-powered code documentation assistant that combines a **FastAPI backend** with a **VS Code extension frontend** to help users understand, document, and query code repositories.

The system indexes a repository, retrieves relevant code context, and uses an LLM-backed workflow to generate grounded code explanations and documentation.

---

## Why I built this

Large and legacy codebases are often difficult to understand when documentation is missing, outdated, or scattered. This project explores how retrieval-augmented generation can help developers ask questions about a codebase and receive answers grounded in the actual repository files.

---

## Project structure

```txt
Boeing2/
├── BoeingAgent/        # FastAPI backend
└── AIDocExtension/     # VS Code extension frontend
```

---

## Architecture

```txt
GitHub Repository
        ↓
Repository Ingestion
        ↓
Code Chunking and Embeddings
        ↓
Vector Search / Retrieval
        ↓
LLM Response Generation
        ↓
VS Code Extension Panel
```

---

## Features

- Index a GitHub repository
- Retrieve relevant code context
- Ask questions about a codebase
- Generate code explanations and documentation
- Use a VS Code extension as the frontend
- Run backend and frontend separately for local development

---

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Python, FastAPI, Uvicorn |
| AI / Retrieval | LLMs, Embeddings, ChromaDB |
| Frontend | TypeScript, VS Code Extension API |
| APIs | Groq, Cohere, GitHub API |
| Environment | Python venv, Node.js, npm |

---

## Setup

The project has two parts:

```txt
BoeingAgent     = backend
AIDocExtension  = VS Code extension frontend
```

Run them in two separate terminals.

---

## 1. Clone the repository

```bash
git clone https://github.com/Gk074/Boeing2.git
cd Boeing2
```

Make sure the folder structure looks like this:

```txt
Boeing2/
├── BoeingAgent/
└── AIDocExtension/
```

---

## 2. Run the backend

Open Terminal 1:

```bash
cd BoeingAgent
```

Create and activate a virtual environment:

### macOS / Linux

```bash
python3.12 -m venv venv312
source venv312/bin/activate
```

### Windows PowerShell

```powershell
py -3.12 -m venv venv312
.\venv312\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If any package is missing:

```bash
python -m pip install chromadb cohere groq python-dotenv requests fastapi uvicorn streamlit
```

Create a `.env` file inside `BoeingAgent`:

```env
CO_API_KEY=your_cohere_api_key
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token_optional
CHROMA_MODE=local
CHROMA_COLLECTION=boeingagent_kb
CHROMA_DIR=.chroma
GROQ_MODEL=llama-3.1-8b-instant
```

Start the backend:

```bash
python -m uvicorn backend:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

Keep this terminal running.

---

## 3. Run the VS Code extension

Open Terminal 2:

```bash
cd AIDocExtension
```

Install dependencies:

```bash
npm install
```

Compile the extension:

```bash
npm run compile
```

Then:

1. Open the `AIDocExtension` folder in VS Code.
2. Press `F5`.
3. A new Extension Development Host window will open.
4. Press `Ctrl + Shift + P` on Windows or `Cmd + Shift + P` on macOS.
5. Run:

```txt
AI Doc Agent: Open Panel
```

---

## 4. Test the app

Inside the extension panel:

1. Paste a GitHub repository URL.
2. Click `Index Repo`.
3. Choose `Code` or `Text`.
4. Ask a question.
5. Click `Ask Repo`.

Sample repo:

```txt
https://github.com/lua/lua
```

Sample question:

```txt
What is the role of lapi.c in this repository?
```

Sample code generation prompt:

```txt
Generate a new C helper function in the style of lapi.c called lua_pushintpair that pushes two lua_Integer values and returns the new stack top count.
```

---

## Screenshots

Add screenshots here later.

```txt
screenshots/
├── vscode-panel.png
├── backend-running.png
├── repo-indexed.png
└── sample-answer.png
```

---

## Current status

This project is a working prototype for AI-assisted repository understanding.

Planned improvements:

- Better prompt design
- More structured documentation generation
- Improved VS Code panel UI
- Better indexing progress messages
- Evaluation on larger legacy repositories

---

## What I learned

- Building a backend and VS Code extension together
- Designing a repository-aware RAG workflow
- Managing embeddings and vector retrieval
- Connecting LLM responses to actual code context
- Structuring AI tools for developer workflows
