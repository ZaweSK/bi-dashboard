import * as vscode from 'vscode';
import { PanelProvider } from './panel-provider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new PanelProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('toolHelper.panelView', provider)
  );
}

export function deactivate() {}
