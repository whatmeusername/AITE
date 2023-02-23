import {AiteNode} from './AiteNode';

const generateKey = (() => {
	let i = 1;
	return (): number => {
		return i++;
	};
})();

function isEventProp(name: string): boolean {
	return name.startsWith('on');
}

function isAiteNode(node: any): node is AiteNode {
	return node instanceof AiteNode;
}

function isNotEmpty(value: any): boolean {
	if (value === null || value === undefined || value === '') return false;
	return true;
}

export {generateKey, isEventProp, isAiteNode, isNotEmpty};
