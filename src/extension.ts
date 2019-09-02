import { commands, window, workspace, WorkspaceFolder, ExtensionContext, StatusBarAlignment } from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);
// this also declared in package.json
const OPEN_COMMAND = 'vscode-codeowners.open';

const parseOwners = (stdout: string): string[] => {
	return stdout
			.split(/\r?\n/)
			.filter(line => line)
			.reduce<string[]>((acc, line) => acc.concat(line.split(/\s+?/)), []);
};

const fetchOwners = async (file: string, folder: WorkspaceFolder): Promise<string[]> => {
	try {
		const out = await execAsync(`git codeowners ${file}`, {
			cwd: folder.uri.fsPath
		});
		return parseOwners(out.stdout);
	}
	catch (err) {
		console.error(`failed to fetch code owners for file ${file}: ${err}`);
		throw err;
	}
};

const ownerText = (owners: string[]): string => {
	switch (owners.length) {
		case 0:	return 'no one';
		case 1: return owners[0];
		default: return `${owners[0]} +`;
	}
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	console.log('vs-codeowners is now active');

	const ownersHint = window.createStatusBarItem(StatusBarAlignment.Right);
	ownersHint.tooltip = 'Open in CODEOWNERS';
	ownersHint.command = OPEN_COMMAND;

  context.subscriptions.push(ownersHint);

	context.subscriptions.push(workspace.onDidOpenTextDocument(
		() => {
			const editor = window.activeTextEditor;
			if (!editor) {
				return;
			}
			const { uri, fileName } = editor.document;
			const folder = workspace.getWorkspaceFolder(uri);
			if (!folder) {
				return;
			}
			const file = fileName.split(`${folder.uri.fsPath}${path.sep}`)[1];
			fetchOwners(file, folder).then(
				(owners) => {
					ownersHint.text = "Codeowner " + ownerText(owners);
					ownersHint.show();
				}
			).catch(
				() => {
					ownersHint.hide();
				}
			);
		}
	));
	const disposable = commands.registerCommand(OPEN_COMMAND, async () => {
		return workspace.findFiles('CODEOWNERS', '**​/node_modules/**', 1)
			.then(
				(files) => {
					if (files) {
						console.log(files[0]);
						//https://code.visualstudio.com/api/references/vscode-api
						// fixme: how to link to line in file?
						// https://github.com/Microsoft/vscode/issues/18696
						// https://github.com/microsoft/vscode/issues/586
						window.showTextDocument(files[0]);
					}
				}
			);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
