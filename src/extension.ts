import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    vscode.languages.getLanguages().then(l => console.log(l));
    const disposable = vscode.languages.registerHoverProvider('smash', {
        provideHover(document, position, token) {
            return new vscode.Hover('This is the hover');
        }
    });

    context.subscriptions.push(disposable);
};

export const deactivate = () => {};
