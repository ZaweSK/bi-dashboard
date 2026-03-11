import * as vscode from 'vscode';

export class PanelProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case 'start-web':
          this.startWeb();
          break;
        case 'go-to-web':
          this.goToWeb();
          break;
        case 'save-work':
          this.saveWork();
          break;
        case 'restore':
          this.restore();
          break;
      }
    });
  }

  private getWorkspaceRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  private findOrCreateTerminal(name: string): vscode.Terminal {
    const existing = vscode.window.terminals.find((t) => t.name === name);
    if (existing) {
      return existing;
    }
    return vscode.window.createTerminal({
      name,
      cwd: this.getWorkspaceRoot(),
    });
  }

  private startWeb() {
    const terminal = this.findOrCreateTerminal('Web server');
    terminal.sendText('npm run dev');
    terminal.show();
  }

  private goToWeb() {
    vscode.env.openExternal(vscode.Uri.parse('http://localhost:3000'));
  }

  private saveWork() {
    const terminal = this.findOrCreateTerminal('Git');
    terminal.sendText('git add -A && git commit -m "save"');
    terminal.show();
  }

  private async restore() {
    const answer = await vscode.window.showWarningMessage(
      'Naozaj chceš obnoviť posledný checkpoint? Všetky neuložené zmeny sa stratia!',
      { modal: true },
      'Áno, obnoviť'
    );
    if (answer === 'Áno, obnoviť') {
      const terminal = this.findOrCreateTerminal('Git');
      terminal.sendText('git reset --hard HEAD');
      terminal.show();
    }
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    return /*html*/ `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      padding: 12px;
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
    }
    h3 {
      margin: 0 0 16px 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--vscode-foreground);
    }
    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 14px;
      margin-bottom: 8px;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      color: var(--vscode-button-foreground);
      background: var(--vscode-button-background);
    }
    .btn:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .btn .icon {
      font-size: 16px;
      flex-shrink: 0;
    }
    .btn-danger {
      background: var(--vscode-errorForeground);
      color: #fff;
      margin-top: 16px;
    }
    .btn-danger:hover {
      opacity: 0.85;
    }
    .divider {
      border: none;
      border-top: 1px solid var(--vscode-widget-border);
      margin: 12px 0;
    }
  </style>
</head>
<body>
  <h3>Ahoj! Čo chceš urobiť? 💛</h3>

  <button class="btn" id="start-web">
    <span class="icon">▶️</span> Spustiť web
  </button>

  <button class="btn" id="go-to-web">
    <span class="icon">🌐</span> Otvoriť web
  </button>

  <hr class="divider">

  <button class="btn" id="save-work">
    <span class="icon">💾</span> Uložiť prácu
  </button>

  <button class="btn btn-danger" id="restore">
    <span class="icon">⚠️</span> Obnoviť posledný checkpoint
  </button>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    document.getElementById('start-web').addEventListener('click', () => {
      vscode.postMessage({ type: 'start-web' });
    });
    document.getElementById('go-to-web').addEventListener('click', () => {
      vscode.postMessage({ type: 'go-to-web' });
    });
    document.getElementById('save-work').addEventListener('click', () => {
      vscode.postMessage({ type: 'save-work' });
    });
    document.getElementById('restore').addEventListener('click', () => {
      vscode.postMessage({ type: 'restore' });
    });
  </script>
</body>
</html>`;
  }
}

function getNonce(): string {
  let text = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}
