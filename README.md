Setup and Run

Your parent folder is:

Boeing2

Inside it, there are two separate folders:

Boeing2/
├─ AIDocExtension/
└─ BoeingAgent/

You must run them separately.

BoeingAgent = backend

AIDocExtension = VS Code extension frontend

Step by step
1. Clone or download the project

After pulling from GitHub, make sure your structure looks like:

Boeing2/
├─ AIDocExtension/
└─ BoeingAgent/
2. Open two terminals

Open two windows/terminals in VSC.

Windows/Terminal 1

Go to backend:

cd Boeing2/BoeingAgent
Windows/Terminal 2

Go to extension frontend:

cd Boeing2/AIDocExtension
3. Backend setup in Terminal 1

Inside BoeingAgent:

Create virtual environment
macOS
python3.12 -m venv venv312
source venv312/bin/activate
Windows PowerShell
py -3.12 -m venv venv312
.\venv312\Scripts\Activate.ps1
Install requirements
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

If some packages are missing, install them manually:

python -m pip install chromadb cohere groq python-dotenv requests fastapi uvicorn streamlit
Create .env

Create a .env file inside BoeingAgent with:

CO_API_KEY=your_cohere_api_key
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token_optional
CHROMA_MODE=local
CHROMA_COLLECTION=boeingagent_kb
CHROMA_DIR=.chroma
GROQ_MODEL=llama-3.1-8b-instant
Run backend
python -m uvicorn backend:app --reload

Keep this terminal running.

Backend runs at:

http://127.0.0.1:8000
4. Frontend setup in Terminal 2

Inside AIDocExtension:

Install Node dependencies
npm install
Compile extension
npm run compile
5. Run the extension

Open the AIDocExtension folder in VS Code.

Press:

F5

This opens a new Extension Development Host window.

6. Open the panel

In the new Extension Development Host window:

press Ctrl + Shift + P on Windows

press Cmd + Shift + P on macOS

Run:

AI Doc Agent: Open Panel
7. Test the app

Inside the panel:

paste repo URL

click Index Repo

choose Code or Text

ask a question

click Ask Repo

Good test repo
https://github.com/lua/lua
Good text test
What is the role of lapi.c in this repository?
Good code test
Generate a new C helper function in the style of lapi.c called lua_pushintpair that pushes two lua_Integer values and returns the new stack top count.
8. Important

Both must be running:

Terminal 1: backend in BoeingAgent

VS Code extension launched from AIDocExtension

If backend is not running, the panel will not work.