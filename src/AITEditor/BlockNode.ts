import defaultBlocks from "./defaultStyles/defaultBlocks";
import {STANDART_BLOCK_TYPE, HORIZONTAL_RULE_BLOCK_TYPE} from "./ConstVariables";
import {ClassVariables} from "./Interfaces";

import {TextNode, BreakLine, createTextNode, HeadNode, NodeKeyTypes, LeafNode, LinkNode} from "./nodes/index";
import type {imageNode} from "./packages/AITE_Image/imageNode";

import {createAiteNode, unmountNode, mountNode, ContentNode, NodeInsertionDeriction} from "./index";
import type {AiteNode, AiteNodeOptions} from "./index";
import {isBaseNode, isLeafNode, isDefined} from "./EditorUtils";

type CoreNodes = TextNode | BreakLine;

type NodeTypes = CoreNodes | imageNode | LinkNode;
type BlockTypes = typeof STANDART_BLOCK_TYPE | typeof HORIZONTAL_RULE_BLOCK_TYPE;
type BlockType = BlockNode | HorizontalRuleNode;

type BlockNodeVariables = ClassVariables<BlockNode>;
interface findNodeOffsetData {
	offsetKey: number;
	letterIndex: number;
	key: number | undefined;
}

type allowedToInsert = "all" | "element" | "text";

function createBlockNode(initData?: BlockNodeVariables) {
	initData = initData ?? {};
	if (initData === undefined || initData?.children?.length === 0) {
		initData.children = [new BreakLine()];
	}
	return new BlockNode(initData);
}

function filterNode(this: BlockNode, ...nodes: NodeTypes[]): NodeTypes[] {
	const res: NodeTypes[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (isBaseNode(node) || isLeafNode(node)) {
			node.parent = this;
			res.push(node);
		}
	}
	return res;
}

abstract class BaseBlockNode extends HeadNode {
	blockType: BlockTypes;
	blockInlineStyles: Array<string>;
	parent: ContentNode | BlockNode | null;

	constructor(blockType?: BlockTypes, blockInlineStyles?: Array<string>, parent?: ContentNode | BlockNode, type?: "block" | NodeKeyTypes) {
		super(type ?? "block");
		this.blockType = blockType ?? STANDART_BLOCK_TYPE;
		this.blockInlineStyles = blockInlineStyles ?? [];
		this.parent = parent ?? null;
	}

	previousSibling(): NodeTypes | BlockType | null {
		if (!this.parent) return null;
		const index = this.parent?.children.findIndex((n) => n.key === this.key);
		if (index > -1) {
			return this.parent.children[index - 1];
		}
		return null;
	}

	nextSibling(): NodeTypes | BlockType | null {
		if (!this.parent) return null;
		const index = this.parent?.children.findIndex((n) => n.key === this.key);
		if (index > -1) {
			return this.parent.children[index + 1];
		}
		return null;
	}
}

class BlockNode extends BaseBlockNode {
	plainText: string;
	blockWrapper: string;
	children: NodeTypes[];
	allowedToInsert: allowedToInsert | "all";

	constructor(initData?: BlockNodeVariables, parent?: ContentNode | BlockNode, type?: "block" | NodeKeyTypes | null) {
		super(initData?.blockType, initData?.blockInlineStyles, parent, type ?? "block");
		this.plainText = initData?.plainText ?? "";
		this.blockWrapper = initData?.blockWrapper ?? "unstyled";
		this.children = initData?.children ?? [];
		this.allowedToInsert = initData?.allowedToInsert ?? "all";

		this.children.forEach((child) => {
			child.parent = this;
		});

		return new Proxy(this, {
			set(target: BlockNode, key: string, value: any) {
				if (key === "children") {
					target.children = filterNode.apply(target, value);
					target.children.forEach((node) => {
						node.parent = target;
					});
				} else {
					(target as any)[key] = value;
				}
				return true;
			},
		});
	}

	// ----- NEWEST
	append(...nodes: NodeTypes[]): this {
		const filteredNodes = filterNode.apply(this, nodes);
		this.children.push(...filteredNodes);
		return this;
	}

	getNodesBetween(startKey: number, endKey?: number, returnAllIfNotFound?: boolean, r?: boolean): NodeTypes[] {
		let startFound = false;
		let nodes: NodeTypes[] = [];

		const block = !r ? (isLeafNode(this) ? (this.parent as BlockNode) : this) : this;

		for (let i = 0; i < block.children.length; i++) {
			const node = block.children[i];
			const nodeKey = node.key;
			const isDecorator = isLeafNode(node);
			if (startFound && endKey && isDecorator) {
				const nb = node.getNodesBetween(-1, endKey, false, true);
				nodes = [...nodes, ...nb];
				if (nb.length !== node.children.length) {
					break;
				}
			}

			if (nodeKey === startKey) {
				startFound = true;
				continue;
			} else if (nodeKey === endKey) {
				break;
			}

			if (!isDecorator && (startFound || startKey === -1)) nodes.push(node);
		}

		return returnAllIfNotFound && nodes.length === 0 ? block.children : nodes;
	}

	get isBreakLine(): boolean {
		return this.children.length === 1 && (this.children[0] instanceof BreakLine || (this.children[0] as TextNode).__content === "");
	}

	convertFromBreakLine(): TextNode;
	convertFromBreakLine<T extends NodeTypes>(nodeToSet: T): T;
	convertFromBreakLine<T extends NodeTypes>(nodeToSet?: T): T | TextNode {
		const node = nodeToSet ? nodeToSet : createTextNode("");
		this.children = [node];
		this.remount();
		return node;
	}

	// ------ OLDEST

	$getNodeState(options?: AiteNodeOptions): AiteNode {
		const prepareBlockStyle = (): {n: string; c: null | string} => {
			type data = {n: string; c: string};
			const BlockNodeData: data = {n: "div", c: this.blockInlineStyles.join(" ")};
			const blockWrapper = defaultBlocks.find((obj) => obj.type === this.blockWrapper);
			if (blockWrapper !== undefined) {
				BlockNodeData.n = blockWrapper.tag;
				BlockNodeData.c += blockWrapper.class ? BlockNodeData.c + " " + blockWrapper.class : "";
			}
			return BlockNodeData;
		};

		const tag = defaultBlocks.find((obj) => obj.type === this.blockWrapper)?.tag ?? "div";
		const className = "";
		const props = {
			className: className,
			"data-aite-block-node": true,
		};

		const children: Array<AiteNode> = [];
		this.children.forEach((node) => {
			const $node = node.$getNodeState({...options});
			if ($node) children.push($node);
		});

		return createAiteNode(this, tag, props, children, {...options, isAiteWrapper: false});
	}

	swapNodePosition(FirPosition: number, SecPosition: number): void {
		const CharP1 = this.children[FirPosition];
		this.children[FirPosition] = this.children[SecPosition];
		this.children[SecPosition] = CharP1;
	}

	replaceNode(index: number, newNode: NodeTypes): void {
		this.children[index] = newNode;
	}

	insertBreakLine() {
		if (this.children.length === 0) {
			const breakLine = new BreakLine();
			this.children = [];
			this.replaceNode(0, breakLine);
			this.remount();
		}
	}

	removeNodeByKey(key: number): void {
		const index = this.children.findIndex((node) => node.key === key);
		if (index !== -1) {
			this.children.splice(index, 1);
		}
		if (this.children.length === 0) {
			this.insertBreakLine();
		}
	}

	insertNodeBetween(block: NodeTypes, start: number, end?: number): void {
		if (end !== undefined) {
			this.children = [...this.children.slice(0, start), block, ...this.children.slice(end ?? start)];
		} else {
			this.children = [...this.children.slice(0, start), block];
		}
	}

	insertNodeBefore(index: number, node: NodeTypes): NodeTypes {
		if (this.isBreakLine) {
			this.replaceNode(0, node);
		} else {
			const insertOffset = index > 0 ? index - 1 : index;
			const previousSibling = this.children[index];
			this.insertNodeBetween(node, insertOffset, insertOffset);
			if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
		}
		return node;
	}

	insertNodeAfter(index: number, node: NodeTypes): NodeTypes {
		if (this.isBreakLine) {
			this.replaceNode(0, node);
		} else {
			const insertOffset = index > 0 ? index - 1 : index;
			const previousSibling = this.children[index];
			this.insertNodeBetween(node, insertOffset, insertOffset);
			if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
		}
		return node;
	}

	insertNode(node: NodeTypes, index: number | "last" | "first", direction: NodeInsertionDeriction) {
		index = index >= 0 ? index : 0;
		const blocksLength = this.children.length - 1;
		if (index === 0 || index === "first") {
			this.insertNodeBefore(0, node);
		} else if (index === blocksLength || index === "last") {
			this.insertNodeAfter(blocksLength, node);
		} else {
			const previousSibling = this.children[index + 1];
			this.insertNodeBetween(node, index, index + 1);
			if (previousSibling) mountNode(previousSibling, node, direction);
		}
	}

	insertNodeBetweenText(nodeIndex: number, offset: number, node: NodeTypes): NodeTypes | undefined {
		nodeIndex = nodeIndex >= 0 ? nodeIndex : 0;
		const textNode = this.children[nodeIndex];
		if (textNode instanceof TextNode && !(node instanceof BreakLine)) {
			const textContentLength = textNode.getContentLength();
			if (offset !== 0 && offset !== textContentLength) {
				const Textchildren = textNode.getData(true);
				node = (node as imageNode).createSelfNode((node as imageNode).getData()) as imageNode;

				const leftSideTextNode = createTextNode(textNode.getSlicedContent(true, offset), Textchildren.getStyles());
				const rightSideTextNode = createTextNode(textNode.getSlicedContent(false, offset), Textchildren.getStyles());

				this.splitChild(true, nodeIndex, nodeIndex + 1, [leftSideTextNode, node, rightSideTextNode]);
				return node;
			} else if (offset === 0) {
				return this.insertNodeBefore(nodeIndex, node);
			} else if (offset === textContentLength) {
				return this.insertNodeAfter(nodeIndex, node);
			}
		} else if (this.isBreakLine) {
			this.replaceNode(0, node);
		}
		return;
	}

	splitChild(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes | Array<NodeTypes>): void {
		const StartSlice = startFromZero === true ? this.children.slice(0, start) : this.children.slice(start);
		const EndSlice = isDefined(end) ? this.children.slice(end) : [];

		if (node === undefined) this.children = [...StartSlice, ...EndSlice];
		else {
			if (Array.isArray(node)) {
				this.children = [...StartSlice, ...node, ...EndSlice];
			} else this.children = [...StartSlice, node, ...EndSlice];
		}
		if (this.children.length === 0) {
			this.insertBreakLine();
		}
	}

	collectSameNodes(): void {
		const NodeStylesEqual = (C1: TextNode, C2: TextNode): boolean => {
			const C1Styles = C1.getNodeStyle();
			const C2Styles = C2.getNodeStyle();

			let mismatch = false;

			if (C1Styles.length === 0 && C2Styles.length === 0) return true;
			else if (C1Styles.length === 0 && C2Styles.length !== 0) return false;
			else {
				for (const style of C1Styles) {
					if (C2Styles.includes(style) === false) {
						mismatch = true;
					}
				}
				if (mismatch === true) return false;
				else return true;
			}
		};

		const isSameTextNode = (C: NodeTypes, N: NodeTypes): boolean => {
			return C instanceof TextNode && N instanceof TextNode && NodeStylesEqual(C, N);
		};

		const newchildren: NodeTypes[] = [];
		let currentNode = this.children[0];
		newchildren.push(currentNode);

		for (let i = 1; i < this.children.length; i++) {
			const nextNode = this.children[i];
			if (isSameTextNode(currentNode, nextNode)) {
				(currentNode as TextNode).appendContent((nextNode as TextNode).getContent());
			} else {
				currentNode = this.children[i];
				newchildren.push(currentNode);
			}
		}
		this.children = newchildren;
	}

	countToIndex(index: number): number {
		let Count = 0;
		index = index < 0 ? 1 : index;

		for (let CharIndex = 0; CharIndex < this.children.length; CharIndex++) {
			if (CharIndex <= index) {
				const CurrentElement = this.children[CharIndex];
				Count += CurrentElement.getContentLength();
			}
		}
		return Count;
	}

	findNodeByOffset(offset: number): findNodeOffsetData {
		const data: findNodeOffsetData = {offsetKey: 0, letterIndex: 0, key: undefined};
		let letterCount = 0;
		for (let i = 0; i < this.children.length; i++) {
			const currentNode = this.children[i];
			const currentLetterCount = currentNode.getContentLength();
			letterCount += currentLetterCount;
			if (letterCount >= offset) {
				data.offsetKey = i;
				data.letterIndex = currentLetterCount - (letterCount - offset);
				data.key = currentNode.key;
				return data;
			}
		}
		return data;
	}

	getLastChildIndex(): number {
		return this.children.length - 1;
	}

	getLastChild() {
		return this.children[this.children.length - 1];
	}

	getFirstChild(depth: true): CoreNodes;
	getFirstChild(depth?: undefined): NodeTypes | LeafNode;
	getFirstChild(depth?: boolean): NodeTypes | LeafNode {
		if (depth) {
			const node = this.children[0];
			if (isLeafNode(node)) {
				return node.getFirstChild();
			}
			return node;
		}
		return this.children[0];
	}

	nextNodeSibling(index: number): NodeTypes | undefined {
		const nextSibling = this.children[index + 1];
		if (nextSibling !== undefined) return nextSibling;
		else return undefined;
	}

	previousNodeSibling(index: number): NodeTypes | undefined {
		const previousSibling = this.children[index - 1];
		if (previousSibling !== undefined) return previousSibling;
		else return undefined;
	}

	getChildrenByIndex(index: number): NodeTypes {
		return this.children[index];
	}

	getNodeByKey(key: number): NodeTypes | undefined {
		return this.children.find((node) => node.key === key);
	}

	getType(): string {
		return this.blockType;
	}

	getWrapper(): string {
		return this.blockWrapper;
	}

	getLength(): number {
		return this.children.length;
	}
}

class HorizontalRuleNode extends BaseBlockNode {
	constructor() {
		super(HORIZONTAL_RULE_BLOCK_TYPE, []);
	}

	getType() {
		return this.blockType;
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode {
		const className = "AITE_editor_horizontal-rule";
		const props = {
			class: className,
		};

		return createAiteNode(this, "div", {contenteditable: false}, [createAiteNode(null, "hr", props, [])], {
			...options,
			isAiteWrapper: false,
		});
	}
}

function createHorizontalRule() {
	return new HorizontalRuleNode();
}

export {createBlockNode, createHorizontalRule, BlockNode, HorizontalRuleNode};

export type {NodeTypes, BlockTypes, BlockType, BaseBlockNode};
