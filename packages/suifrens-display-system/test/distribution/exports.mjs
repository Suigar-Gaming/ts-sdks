import assert from 'node:assert/strict';
import ts from 'typescript';

const program = ts.createProgram(['entries.mts'], { module: ts.ModuleKind.NodeNext });
const checker = program.getTypeChecker();
const owners = new Map();
for (const statement of program.getSourceFile('entries.mts').statements) {
	if (!ts.isImportDeclaration(statement)) continue;
	const entry = statement.moduleSpecifier.text;
	const module = checker.getSymbolAtLocation(statement.moduleSpecifier);
	assert.ok(module, `Missing declarations for ${entry}`);
	for (const symbol of checker.getExportsOfModule(module)) {
		const name = symbol.getName();
		assert.ok(!owners.has(name), `${name} exported by both ${owners.get(name)} and ${entry}`);
		owners.set(name, entry);
		const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
		assert.equal(
			Boolean(target.flags & ts.SymbolFlags.Value),
			!entry.endsWith('/types'),
			`${entry}: ${name}`,
		);
	}
}
