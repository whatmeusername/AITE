import {BaseBlockNode, BlockNode, NodeTypes} from "../nodes/BlockNode";

import {ContentNode} from "../nodes";
import {AiteNode} from "./AiteNode";
import {AiteTextNode} from "./AiteTextNode";
import {isBaseBlockNode} from "../typeguards";

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

function filterNode(this: BlockNode, ...nodes: NodeTypes[]): NodeTypes[] {
	const res: NodeTypes[] = [];
	for (let i = 0; i < nodes.length; i++) {
		res.push(nodes[i]);
	}
	return res;
}

function filterBlock(this: ContentNode, ...nodes: BaseBlockNode[]): BaseBlockNode[] {
	const res: BaseBlockNode[] = [];
	for (let i = 0; i < nodes.length; i++) {
		if (isBaseBlockNode(nodes[i])) {
			res.push(nodes[i]);
		}
	}
	return res;
}

export {generateKey, isEventProp, isAiteNode, isNotEmpty, isAiteTextNode, filterNode, filterBlock};
