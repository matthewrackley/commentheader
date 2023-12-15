import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.insertCommentWithActiveLine', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active text editor!');
			return; // No open text editor
		}
		function isLengthOdd(item:string) {
			return item.length % 2 === 1;
		}
		let decorationType = vscode.window.createTextEditorDecorationType({
			backgroundColor: 'rgba(0, 0, 0, .8)',
		});
		const document = editor.document;
		const activeLine = editor.selection.active.line;
		const activeLineRange = document.lineAt(activeLine).range;
		const activeLineText = document.lineAt(activeLine).text;
		const regex = new RegExp(`${activeLineText}`, 'g');
		let inputRange;
		function createPadding(totalWidth?: number, input: string = activeLineText, minimumPadding: number = 10) {
			const inputLength = input.length;
			const maxWidth = inputLength + (minimumPadding * 2);
			if (!totalWidth) {
				totalWidth = maxWidth > 60 ? 60 : maxWidth;
			}

			const totalPadding = totalWidth - inputLength;
			const leftPaddingSize = Math.floor(totalPadding / 2);
			const rightPaddingSize = (totalPadding - leftPaddingSize);
			const leftPadding = ' '.repeat(leftPaddingSize > minimumPadding ? leftPaddingSize + minimumPadding : minimumPadding);
			const padding = ' '.repeat(minimumPadding - 1);
			const rightPadding = ' '.repeat(rightPaddingSize > minimumPadding ? rightPaddingSize + minimumPadding : minimumPadding);
			return `//___============================>${padding + padding}<============================___\\
//___|| =================== ||${leftPadding}${input.length % 2 === 1 ? ' ' + input.toUpperCase() : input.toUpperCase()}${rightPadding}|| =================== ||___\\
//___============================>${padding + padding}<============================___\\`;
		}
		// Define the regex pattern to match the predefined comment
		const pattern = createPadding();
		let editRange;
		editor.edit(editBuilder => {;
			const editRange = new vscode.Range(editor.selection.start.line, 0, editor.selection.end.line, editor.selection.end.character);
			editBuilder.delete(activeLineRange);
			editBuilder.insert(editor.selection.start, pattern + '\n');
			editor.setDecorations(decorationType, [editRange]);
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
