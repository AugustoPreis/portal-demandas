module.exports = {
	'root': true,
	'parser': '@typescript-eslint/parser',
	'plugins': [
		'@typescript-eslint',
	],
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	'rules': {
		'@typescript-eslint/no-explicit-any': 1,
		'@typescript-eslint/no-unused-vars': 1,
		'@typescript-eslint/no-empty-function': 1,
		'@typescript-eslint/no-empty-interface': 1,
		'@typescript-eslint/no-var-requires': 1,
		'@typescript-eslint/no-non-null-assertion': 1,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/no-inferrable-types': 0,
		'@typescript-eslint/no-this-alias': 0,
		'@typescript-eslint/no-namespace': 0,
		'no-console': 1,
		'no-undef': 0,
		'quotes': ['warn', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
	},
}