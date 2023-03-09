import {KeyboardEventCommand} from "./editorCommandsTypes";

import {getEditorState, BlockNode, AiteHTMLNode, ContentNode, HorizontalRuleNode, BaseBlockNode} from "./index";
import {BaseNode, BreakLine, HeadNode, LeafNode, TextNode} from "./nodes/index";

import defaultInlineStyles from "./defaultStyles/defaultInlineStyles";

function unpackNode(node: HTMLElement): Array<HTMLElement> {
	return Array.from(node.children) as Array<HTMLElement>;
}

function getChildrenNodes(blockNode: HTMLElement): Array<HTMLElement> {
	let childrens = unpackNode(blockNode);
	for (let i = 0; i < childrens.length; i++) {
		const node = childrens[i];
		const dataset = node.dataset;
		if (dataset.aiteNodeLeaf !== undefined) {
			const children = Array.from(node.children) as Array<HTMLElement>;
			childrens = [...childrens.slice(0, i), ...children, ...childrens.slice(i + 1)];
		}
	}
	return childrens;
}

function isLeafNode(node: any): node is LeafNode {
	return node instanceof LeafNode;
}

function isHeadNode(node: any): node is HeadNode {
	return node instanceof HeadNode;
}
function isBaseNode(node: any): node is BaseNode {
	return node instanceof BaseNode;
}

function getIndexPathFromKeyPath(keyPath: Array<number>) {
	const contentNode = getEditorState().contentNode;
	const indexArray: Array<number> = [];

	if (keyPath.length === 0) {
		return [];
	} else if (keyPath.length === 1) {
		return [contentNode.children.findIndex((obj) => obj.key === keyPath[0])];
	} else {
		const index = contentNode.children.findIndex((obj) => obj.key === keyPath[0]);
		let currentNode: any = contentNode.children[index];

		indexArray.push(index);

		for (let i = 1; i < keyPath.length; i++) {
			if (currentNode instanceof BlockNode) {
				const index = currentNode.children.findIndex((obj) => obj.key === keyPath[i]);
				currentNode = currentNode.children[index];
				indexArray.push(index);
			} else if (currentNode instanceof ContentNode) {
				const index = currentNode.children.findIndex((obj) => obj.key === keyPath[i]);
				currentNode = currentNode.children[index];
				indexArray.push(index);
			} else if (currentNode && !(currentNode instanceof BlockNode) && !(currentNode instanceof ContentNode)) {
				if (currentNode.ContentNode) {
					const index = currentNode.ContentNode.BlockNodes.findIndex((obj: BlockNode) => obj.key === keyPath[i]);
					currentNode = currentNode.ContentNode.BlockNodes[index];
					indexArray.push(index);
				} else if (currentNode.getChildren) {
					const index = currentNode.getChildren().findIndex((obj: BlockNode) => obj.key === keyPath[i]);
					currentNode = currentNode.getChildren()[index];
					indexArray.push(index);
				}
			} else return undefined;
		}
		return indexArray;
	}
}

function keyCodeValidator(event: KeyboardEvent | React.KeyboardEvent): boolean {
	const SYMBOLS = [
		"Comma",
		"Period",
		"Minus",
		"Equal",
		"IntlBackslash",
		"Slash",
		"Quote",
		"Semicolon",
		"Backslash",
		"BracketRight",
		"BracketLeft",
		"Backquote",
	];

	if (event.code.startsWith("Key") || event.code === "Space" || event.code.startsWith("Digit") || SYMBOLS.includes(event.code)) return true;
	return false;
}

function isArrow(event: KeyboardEventCommand): boolean {
	return event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "ArrowUp" || event.code === "ArrowDown";
}

function isArrowLeft(event: KeyboardEventCommand): boolean {
	return event.code === "ArrowLeft";
}

function isArrowRight(event: KeyboardEventCommand): boolean {
	return event.code === "ArrowRight";
}

function isArrowUp(event: KeyboardEventCommand): boolean {
	return event.code === "ArrowUp";
}

function isArrowDown(event: KeyboardEventCommand): boolean {
	return event.code === "ArrowDown";
}

function editorWarning(shoudThrow: boolean, message: string): void {
	if (shoudThrow) {
		console.warn(`AITE internal warning: ${message}`);
	}
}

function isTextNode(node: any): node is TextNode {
	return node instanceof TextNode;
}

function isHorizontalRuleNode(node: any): node is HorizontalRuleNode {
	return node instanceof HorizontalRuleNode;
}

function isBlockNode(node: any): node is BlockNode {
	return node instanceof BlockNode;
}

function isBaseBlockNode(node: any): node is BaseBlockNode {
	return node instanceof BaseBlockNode;
}

function isContentNode(node: any): node is ContentNode {
	return node instanceof ContentNode;
}

function isBreakLine(node: any): node is BlockNode {
	if (isLeafNode(node)) return false;
	return node.children.length === 1 && (node.children[0] instanceof BreakLine || (node.children[0] as TextNode).content === "");
}

function isDefined(obj: any): boolean {
	return obj !== undefined && obj !== null;
}

function isApple(): boolean {
	return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

function isMeta(event: KeyboardEventCommand): boolean {
	if (isApple()) {
		return event.metaKey;
	}
	return false;
}

function isAlt(event: KeyboardEventCommand): boolean {
	return event.altKey;
}

function isCtrl(event: KeyboardEventCommand): boolean {
	return event.ctrlKey;
}

function isForwardBackspace(event: KeyboardEventCommand): boolean {
	return (event.code === "Delete" || event.code === "Backspace") && event.which === 46;
}

function isBackwardRemoveLine(event: KeyboardEventCommand): boolean {
	if (isApple()) {
		return (event.code === "Delete" || event.code === "Backspace") && isMeta(event);
	} else return false;
}

function isForwardRemoveLine(event: KeyboardEventCommand): boolean {
	if (isApple()) {
		return (event.code === "Delete" || event.code === "Backspace") && event.which === 46 && isMeta(event);
	} else return false;
}

function isBackwardRemoveWord(event: KeyboardEventCommand | React.KeyboardEvent): boolean {
	if (isApple()) {
		return event.code === "Backspace" && isAlt(event);
	} else return event.code === "Backspace" && isCtrl(event);
}

function isForwardRemoveWord(event: KeyboardEventCommand): boolean {
	if (isApple()) {
		return (event.code === "Delete" || event.code === "Backspace") && isAlt(event) && event.which === 46;
	} else return (event.code === "Delete" || event.code === "Backspace") && isCtrl(event) && event.which === 46;
}

// DEPRECATED / REPLACE WITH NEW FUNCTION
function findStyle(StyleKey: string) {
	const style = defaultInlineStyles.find((style) => style.style === StyleKey);
	if (style !== undefined) {
		return style;
	} else throw new Error(`Can't find inline style with name ${StyleKey}, because its not defineded `);
}

function getDecoratorNode(node: AiteHTMLNode): AiteHTMLNode {
	let childrenset = node.dataset;
	if (!childrenset.aite_decorator_node) {
		childrenset = node.dataset;
		while ((node.parentNode as AiteHTMLNode)?.dataset?.aite_editor_root === undefined) {
			node = node.parentNode as AiteHTMLNode;
			if (node.dataset.aite_decorator_node) {
				return node;
			}
		}
	}
	return node;
}

function DiffNodeState(previousState: {[K: string]: any}, nextState: {[K: string]: any}) {
	const statusObj: {[K: string]: any} = {};
	Object.entries(previousState).forEach(([key, value]) => {
		if (nextState[key]) {
			const next = nextState[key];
			if (Array.isArray(next)) {
				// TODO: CURRENT NO USE
			} else if (next !== value) {
				statusObj[key] = "changed";
			}
		} else {
			statusObj[key] = "removed";
		}
	});
	return statusObj;
}

export {
	getIndexPathFromKeyPath,
	getChildrenNodes,
	getDecoratorNode,
	keyCodeValidator,
	DiffNodeState,
	editorWarning,
	findStyle,
	isApple,
	isLeafNode,
	isBackwardRemoveLine,
	isBackwardRemoveWord,
	isForwardBackspace,
	isForwardRemoveWord,
	isForwardRemoveLine,
	isArrow,
	isArrowLeft,
	isArrowRight,
	isArrowUp,
	isArrowDown,
	isDefined,
	isBaseNode,
	isTextNode,
	isHorizontalRuleNode,
	isBlockNode,
	isContentNode,
	isBreakLine,
	isBaseBlockNode,
	isHeadNode,
};
