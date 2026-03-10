import * as vscode from "vscode";

const BACKEND_URL = "http://127.0.0.1:8000";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "aidocagent.openPanel",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "aiDocAgent",
        "🤖Boeing Agent",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      panel.webview.html = getWebviewHTML();

      panel.webview.onDidReceiveMessage(async (message) => {
        try {
          if (message.command === "analyze") {
            const response = await fetch(`${BACKEND_URL}/analyze`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ repo_url: message.url })
            });

            const data: any = await response.json();

            panel.webview.postMessage({
              command: "result",
              text: data.report || data.detail || "⚠ No output returned"
            });
          }

          if (message.command === "index") {
            const response = await fetch(`${BACKEND_URL}/index`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ repo_url: message.url })
            });

            const data: any = await response.json();

            panel.webview.postMessage({
            command: "result",
            text: `✅ Indexing finished\n\n${JSON.stringify(data, null, 2)}`
          });
          }

          if (message.command === "rag") {
            const response = await fetch(`${BACKEND_URL}/rag`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: message.query,
                mode: message.mode
              })
            });

            const data: any = await response.json();

            const text =
              data.mode === "code"
                ? (data.code || "No code returned.")
                : (data.answer || "No answer returned.");

            panel.webview.postMessage({
              command: "result",
              text
            });
          }
          
        } catch (error) {
          panel.webview.postMessage({
            command: "result",
            text:
              "❌ Could not reach backend.\n\nRun:\npython -m uvicorn backend:app --reload"
          });
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

function getWebviewHTML(): string {
  return `
  <html>
  <body style="font-family: sans-serif; padding: 16px; background: #1e1e1e; color: white;">
    <h2>🤖 HASAIM</h2>
    <p>Index a repo, then generate grounded code or text from retrieved context.</p>

    <label>Repository URL</label><br/>
    <input id="urlBox" style="
        width: 80%;
        padding: 8px;
        border-radius: 4px;
        border: none;
        margin-bottom: 10px;
    " placeholder="https://github.com/user/repo" />

    <div style="margin-bottom: 16px;">
      <button id="indexBtn" style="
          padding: 8px 12px;
          margin-right: 8px;
          cursor: pointer;
          background: #2d7d46;
          color: white;
          border: none;
          border-radius: 4px;
      ">Index Repo</button>

      <button id="analyzeBtn" style="
          padding: 8px 12px;
          cursor: pointer;
          background: #0078d4;
          color: white;
          border: none;
          border-radius: 4px;
      ">Analyze</button>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="margin-right: 12px;">
        <input type="radio" name="mode" value="code" checked />
        Code
      </label>

      <label>
        <input type="radio" name="mode" value="text" />
        Text
      </label>
    </div>

    <label>Ask about the repo</label><br/>
    <input id="queryBox" style="
        width: 80%;
        padding: 8px;
        border-radius: 4px;
        border: none;
    " placeholder="Generate a helper function for lapi.c" />

    <button id="askBtn" style="
        padding: 8px 12px;
        margin-left: 8px;
        cursor: pointer;
        background: #a05cff;
        color: white;
        border: none;
        border-radius: 4px;
    ">Ask Repo</button>

    <div style="margin-top: 18px; display: flex; justify-content: space-between; align-items: center;">
      <strong>Output</strong>
      <button id="copyBtn" style="
          padding: 6px 10px;
          cursor: pointer;
          background: #238636;
          color: white;
          border: none;
          border-radius: 6px;
      ">Copy</button>
    </div>

    <pre id="output" style="
        margin-top: 12px;
        white-space: pre-wrap;
        background: #0d1117;
        color: #e6edf3;
        padding: 16px;
        border-radius: 10px;
        height: 520px;
        overflow-y: auto;
        border: 1px solid #30363d;
        font-family: Consolas, 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
    ">Ready.</pre>

    <script>
      const vscode = acquireVsCodeApi();

      function getSelectedMode() {
        const selected = document.querySelector('input[name="mode"]:checked');
        return selected ? selected.value : "code";
      }

      document.getElementById("indexBtn").addEventListener("click", () => {
        const url = document.getElementById("urlBox").value;
        document.getElementById("output").textContent = "⏳ Indexing repository...";
        vscode.postMessage({ command: "index", url });
      });

      document.getElementById("analyzeBtn").addEventListener("click", () => {
        const url = document.getElementById("urlBox").value;
        document.getElementById("output").textContent = "⏳ Generating documentation...";
        vscode.postMessage({ command: "analyze", url });
      });

      document.getElementById("askBtn").addEventListener("click", () => {
        const query = document.getElementById("queryBox").value;
        const mode = getSelectedMode();
        document.getElementById("output").textContent = "⏳ Running RAG query...";
        vscode.postMessage({ command: "rag", query, mode });
      });

      document.getElementById("copyBtn").addEventListener("click", async () => {
        const text = document.getElementById("output").textContent || "";
        await navigator.clipboard.writeText(text);
      });

      window.addEventListener("message", event => {
        const msg = event.data;
        if (msg.command === "result") {
          const output = document.getElementById("output");
          output.textContent = msg.text;

          const selected = document.querySelector('input[name="mode"]:checked');
          const mode = selected ? selected.value : "code";

          if (mode === "code") {
            output.style.color = "#79c0ff";
            output.style.background = "#0d1117";
          } else {
            output.style.color = "#e6edf3";
            output.style.background = "#111111";
          }
        }
      });
    </script>
  </body>
  </html>
  `;
}