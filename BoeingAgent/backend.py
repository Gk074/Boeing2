from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agent.doc_agent import generate_documentation_for_repo
from agent.indexer import index_repo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "hint": "POST /analyze"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/analyze")
def analyze(data: dict = Body(...)):
    repo_url = data.get("repo_url")
    if not repo_url or not isinstance(repo_url, str):
        raise HTTPException(status_code=400, detail="repo_url is required")

    try:
        print("📩 Incoming repo_url:", repo_url)
        report = generate_documentation_for_repo(repo_url)
        print("📤 Generated report length:", len(report))
        return {"report": report}

    except Exception as e:
        import traceback
        print("❌ ERROR inside /analyze:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/index")
def index_endpoint(data: dict = Body(...)):
    repo_url = data.get("repo_url")
    if not repo_url or not isinstance(repo_url, str):
        raise HTTPException(status_code=400, detail="repo_url is required")

    try:
        stats = index_repo(repo_url)
        return {"status": "indexed", **stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
from agent.rag_orchestrator import RAGOrchestrator

rag = RAGOrchestrator()

@app.post("/rag")
def rag_endpoint(data: dict = Body(...)):
    query = data.get("query")
    mode = data.get("mode", "code")

    if not query or not isinstance(query, str):
        raise HTTPException(status_code=400, detail="query is required")

    try:
        result = rag.run(query=query, mode=mode)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))