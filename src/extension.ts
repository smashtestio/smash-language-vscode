import * as vscode from 'vscode';
import FunctionCompletionProvider from './FunctionCompletionProvider';

export const LANG = 'smash';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
        LANG, new FunctionCompletionProvider(), '\t', ' '
    ));
};

export const deactivate = () => {};
