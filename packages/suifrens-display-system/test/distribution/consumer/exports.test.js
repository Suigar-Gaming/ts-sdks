import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { expect, test } from 'vitest';

test('the installed package exposes the documented entry points and uniquely named declarations', () => {
	const manifest = JSON.parse(
		readFileSync('node_modules/@suigar/suifrens-display-system/package.json', 'utf8'),
	);
	const program = ts.createProgram(['entries.mts'], {
		module: ts.ModuleKind.NodeNext,
		target: ts.ScriptTarget.ES2022,
		strict: true,
		noEmit: true,
	});
	const diagnostics = ts.getPreEmitDiagnostics(program);
	expect(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))).toEqual([]);

	const checker = program.getTypeChecker();
	const entries = [];
	const owners = new Map();
	for (const statement of program.getSourceFile('entries.mts').statements) {
		const entry = statement.moduleSpecifier.text;
		entries.push('.' + entry.slice(manifest.name.length));
		const module = checker.getSymbolAtLocation(statement.moduleSpecifier);
		for (const symbol of checker.getExportsOfModule(module)) {
			const name = symbol.getName();
			expect(owners.has(name), `${name} exported by both ${owners.get(name)} and ${entry}`).toBe(
				false,
			);
			owners.set(name, entry);
			const target =
				symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
			expect(Boolean(target.flags & ts.SymbolFlags.Value), `${entry}: ${name}`).toBe(
				!entry.endsWith('/types'),
			);
		}
	}
	expect(entries.sort()).toEqual(Object.keys(manifest.exports).sort());
	expect(owners.get('SuiFrenSpecies')).toBe(manifest.name + '/types');
	expect(owners.has('SuiFrenType')).toBe(false);
});
