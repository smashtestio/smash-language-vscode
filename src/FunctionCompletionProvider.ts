import * as vscode from 'vscode';

const correctCase = (func: string): string => {
    const configCase = vscode.workspace.getConfiguration('smash').get('intellisenseCase');

    if (configCase === 'Automatic') {
        return func;
    }

    // save variables - don't want to update their case
    const variables = func.match(/\{\{?(\w+\:?)\}\}?/g) || [];

    if (configCase === 'Capitalize first') {
        func = func.substr(0, 1).toUpperCase() + func.substr(1).toLowerCase();
        variables.forEach((variable) => {
            func = func.replace(variable.toLowerCase(), variable);
        });
    } else if (configCase === 'all lower case') {
        func = func.toLowerCase();
        variables.forEach((variable) => {
            func = func.replace(variable.toLowerCase(), variable);
        });
    }

    return func;
};

const getFullDeclaration = (func: string): string => {
    const matches = func.match(/^\s*\*\s*((?:[\w-=]| |\{\{?\w+\:?\}?\})+\s*(?:\!\!)?\s*(?:\#\w*)?)\s*(?:\{)?\s*$/);
    return matches && matches.length > 1 ? matches[1] : 'Could no load declaration';
};

export default class FunctionCompletionProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ) {
        const currentLine = document.getText().split('\n')[position.line];
        if (!/^\s*\w?$/.test(currentLine)) {
            return [];
        }

        const funcLines = document.getText().match(/^\s*\*\s*(.*)\s*$/gm);
        if (funcLines) {
            return funcLines.map(line => {
                const funcMatch = line.match(/^\s*\*\s*((?:[\w-=]| |\{\{?\w+\:?\}?\})+)\s*(?:\!\!?)?\s*(?:\#.*)?(?:\{)?\s*$/);
                return [
                    line,
                    funcMatch && funcMatch.length > 1 ? funcMatch[1] : null
                ];
            })
                .filter(([line, func]) => func !== null)
                .map(([line, func]) => {
                    const item = new vscode.CompletionItem(
                        correctCase(func!).trim(),
                        vscode.CompletionItemKind.Function
                    );
                    item.detail = getFullDeclaration(line!);
                    return item;
                });
        }
        return [];
    }
}
