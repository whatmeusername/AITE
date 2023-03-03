import {AiteNode} from "./AiteNode";
import {AiteTextNode} from "./AiteTextNode";

const generateKey = (() => {
	let i = 1;
	return (): number => {
		return i++;
	};
})();

function isEventProp(name: string): boolean {
	return name.startsWith("on");
}

function isAiteNode(node: any): node is AiteNode {
	return node instanceof AiteNode;
}

function isAiteTextNode(node: any): node is AiteTextNode {
	return node instanceof AiteTextNode;
}

function isNotEmpty(value: any): boolean {
	if (value === null || value === undefined || value === "") return false;
	return true;
}

export {generateKey, isEventProp, isAiteNode, isNotEmpty, isAiteTextNode};
