module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		node: true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"overrides": [
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react",
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"off",
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"prefer-spread": "off",
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-this-alias": "off",
	}
};