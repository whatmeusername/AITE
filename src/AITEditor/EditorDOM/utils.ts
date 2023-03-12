import {BlockNode, BlockNodeType, BlockTypes, NodeTypes} from "../nodes/BlockNode";
import {isBaseBlockNode} from "../EditorUtils";
import {ContentNode} from "../nodes";
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

function filterNode(this: BlockNode, ...nodes: NodeTypes[]): NodeTypes[] {
	const res: NodeTypes[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		res.push(node);
	}
	return res;
}

function filterBlock(this: ContentNode, ...nodes: BlockNodeType[]): BlockNodeType[] {
	const res: BlockNodeType[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (isBaseBlockNode(node)) {
			res.push(node);
		}
	}
	return res;
}

export {generateKey, isEventProp, isAiteNode, isNotEmpty, isAiteTextNode, filterNode, filterBlock};
