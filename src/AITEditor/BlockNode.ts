import defaultBlocks from './defaultStyles/defaultBlocks';
import {STANDART_BLOCK_TYPE, HORIZONTAL_RULE_BLOCK_TYPE} from './ConstVariables';
import {ClassVariables} from './Interfaces';

import {TextNode, LinkNode, BreakLine, createTextNode, HeadNode, NodeKeyTypes} from './AITE_nodes/index';
import type {imageNode} from './packages/AITE_Image/imageNode';

import {createAiteNode, unmountNode, mountNode, ContentNode, NodeInsertionDeriction} from './index';
import type {AiteNode, AiteNodeOptions} from './index';
import {isBaseNode, isLeafNode, isDefined} from './EditorUtils';

type NodeTypes = TextNode | imageNode | BreakLine | LinkNode;
type BlockTypes = typeof STANDART_BLOCK_TYPE | typeof HORIZONTAL_RULE_BLOCK_TYPE;
type BlockType = BlockNode | HorizontalRuleNode;

type BlockNodeVariables = ClassVariables<BlockNode>;
interface findNodeOffsetData {
	offsetKey: number;
	letterIndex: number;
	key: number | undefined;
}

type allowedToInsert = 'all' | 'element' | 'text';

function createBlockNode(initData?: BlockNodeVariables) {
	initData = initData ?? {};
	if (initData === undefined || initData?._children?.length === 0) {
		initData._children = [new BreakLine()];
	}
	return new BlockNode(initData);
}

abstract class BaseBlockNode extends HeadNode {
	blockType: BlockTypes;
	blockInlineStyles: Array<string>;
	__parent: ContentNode | BlockNode | null;

	constructor(blockType?: BlockTypes, blockInlineStyles?: Array<string>, parent?: ContentNode | BlockNode, type?: 'block' | NodeKeyTypes) {
		super(type ?? 'block');
		this.blockType = blockType ?? STANDART_BLOCK_TYPE;
		this.blockInlineStyles = blockInlineStyles ?? [];
		this.__parent = parent ?? null;
	}

	previousSibling(): NodeTypes | BlockType | null {
		if (!this.__parent) return null;
		const index = this.__parent?._children.indexOf(this as any);
		if (index > -1) {
			return this.__parent._children[index - 1];
		}
		return null;
	}

	nextSibling(): NodeTypes | BlockType | null {
		if (!this.__parent) return null;
		const index = this.__parent?._children.indexOf(this as any);
		if (index > -1) {
			return this.__parent._children[index + 1];
		}
		return null;
	}
}

class BlockNode extends BaseBlockNode {
	plainText: string;
	blockWrapper: string;
	_children: NodeTypes[];
	allowedToInsert: allowedToInsert | 'all';

	constructor(initData?: BlockNodeVariables, parent?: ContentNode | BlockNode, type?: 'block' | NodeKeyTypes | null) {
		super(initData?.blockType, initData?.blockInlineStyles, parent, type ?? 'block');
		this.plainText = initData?.plainText ?? '';
		this.blockWrapper = initData?.blockWrapper ?? 'unstyled';
		this._children = initData?._children ?? [];
		this.allowedToInsert = initData?.allowedToInsert ?? 'all';

		this._children.forEach((child) => {
			child.__parent = this;
		});
	}

	append(...nodes: NodeTypes[]) {
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			if (isBaseNode(node) || isLeafNode(node)) {
				node.__parent = this;
				this._children.push(node);
			}
		}
		return this;
	}

	getNodesBetween(startKey: number, endKey?: number, returnAllIfNotFound?: boolean, r?: boolean): NodeTypes[] {
		let startFound = false;
		let nodes: NodeTypes[] = [];

		const block = !r ? (isLeafNode(this) ? (this.__parent as BlockNode) : this) : this;

		for (let i = 0; i < block._children.length; i++) {
			const node = block._children[i];
			const nodeKey = node.key;
			const isDecorator = isLeafNode(node);
			if (endKey && isDecorator) {
				const nb = node.getNodesBetween(-1, endKey, false, true);
				nodes = [...nodes, ...nb];
				if (nb.length !== node._children.length) {
					break;
				}
			}

			if (nodeKey === startKey) {
				startFound = !startFound;
				continue;
			} else if (nodeKey === endKey) {
				break;
			}

			if (!isDecorator && (startFound || startKey === -1)) nodes.push(node);
		}

		return returnAllIfNotFound && nodes.length === 0 ? block._children : nodes;
	}

	isBreakLine() {
		return this._children.length === 1 && this._children[0] instanceof BreakLine;
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode {
		const prepareBlockStyle = (): {n: string; c: null | string} => {
			type data = {n: string; c: string};
			let BlockNodeData: data = {n: 'div', c: this.blockInlineStyles.join(' ')};
			let blockWrapper = defaultBlocks.find((obj) => obj.type === this.blockWrapper);
			if (blockWrapper !== undefined) {
				BlockNodeData.n = blockWrapper.tag;
				BlockNodeData.c += blockWrapper.class ? BlockNodeData.c + ' ' + blockWrapper.class : '';
			}
			return BlockNodeData;
		};

		let tag = defaultBlocks.find((obj) => obj.type === this.blockWrapper)?.tag ?? 'div';
		let className = '';
		let props = {
			className: className,
			'data-aite-block-node': true,
		};

		let children: Array<AiteNode> = [];
		this._children.forEach((node, index) => {
			let $node = node.$getNodeState({...options});
			if ($node) children.push($node);
		});

		return createAiteNode(this, tag, props, children, {...options, isAiteWrapper: false});
	}

	swapNodePosition(FirPosition: number, SecPosition: number): void {
		let CharP1 = this._children[FirPosition];
		this._children[FirPosition] = this._children[SecPosition];
		this._children[SecPosition] = CharP1;
	}

	replaceNode(index: number, newNode: NodeTypes): void {
		this._children[index] = newNode;
	}

	insertBreakLine() {
		if (this._children.length === 0) {
			let breakLine = new BreakLine();
			this._children = [];
			this.replaceNode(0, breakLine);
			this.remount();
		}
	}

	removeNodeByKey(key: number): void {
		let index = this._children.findIndex((node) => node.key === key);
		if (index !== -1) {
			this._children.splice(index, 1);
		}
		if (this._children.length === 0) {
			this.insertBreakLine();
		}
	}

	insertNodeBetween(block: NodeTypes, start: number, end?: number): void {
		if (end !== undefined) {
			this._children = [...this._children.slice(0, start), block, ...this._children.slice(end ?? start)];
		} else {
			this._children = [...this._children.slice(0, start), block];
		}
	}

	insertNodeBefore(index: number, node: NodeTypes): NodeTypes {
		if (this.isBreakLine()) {
			this.replaceNode(0, node);
		} else {
			let insertOffset = index > 0 ? index - 1 : index;
			let previousSibling = this._children[index];
			this.insertNodeBetween(node, insertOffset, insertOffset);
			if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
		}
		return node;
	}

	insertNodeAfter(index: number, node: NodeTypes): NodeTypes {
		if (this.isBreakLine()) {
			this.replaceNode(0, node);
		} else {
			let insertOffset = index > 0 ? index - 1 : index;
			let previousSibling = this._children[index];
			this.insertNodeBetween(node, insertOffset, insertOffset);
			if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
		}
		return node;
	}

	insertNode(node: NodeTypes, index: number | 'last' | 'first', direction: NodeInsertionDeriction) {
		index = index >= 0 ? index : 0;
		let blocksLength = this._children.length - 1;
		if (index === 0 || index === 'first') {
			this.insertNodeBefore(0, node);
		} else if (index === blocksLength || index === 'last') {
			this.insertNodeAfter(blocksLength, node);
		} else {
			let previousSibling = this._children[index + 1];
			this.insertNodeBetween(node, index, index + 1);
			if (previousSibling) mountNode(previousSibling, node, direction);
		}
	}

	insertNodeBetweenText(nodeIndex: number, offset: number, node: NodeTypes): NodeTypes | undefined {
		nodeIndex = nodeIndex >= 0 ? nodeIndex : 0;
		let textNode = this._children[nodeIndex];
		if (textNode instanceof TextNode && !(node instanceof BreakLine)) {
			let textContentLength = textNode.getContentLength();
			if (offset !== 0 && offset !== textContentLength) {
				let Text_children = textNode.getData(true);
				node = (node as imageNode).createSelfNode((node as imageNode).getData()) as imageNode;

				let leftSideTextNode = createTextNode(textNode.getSlicedContent(true, offset), Text_children.getStyles());
				let rightSideTextNode = createTextNode(textNode.getSlicedContent(false, offset), Text_children.getStyles());

				this.splitChild(true, nodeIndex, nodeIndex + 1, [leftSideTextNode, node, rightSideTextNode]);
				return node;
			} else if (offset === 0) {
				return this.insertNodeBefore(nodeIndex, node);
			} else if (offset === textContentLength) {
				return this.insertNodeAfter(nodeIndex, node);
			}
		} else if (this.isBreakLine()) {
			this.replaceNode(0, node);
		}
		return;
	}

	removeDomNodes(startFromZero: boolean = true, start: number, end?: number): void {
		let slicedNodes: Array<NodeTypes> = [];
		if (end === undefined) {
			if (startFromZero === false) {
				slicedNodes = this._children.slice(0, start);
				this._children = this._children.slice(start);
			} else if (startFromZero === true) {
				slicedNodes = this._children.slice(start);
				this._children = this._children.slice(0, start);
			}
		} else if (end !== undefined) {
			if (startFromZero === false) {
				slicedNodes = [...this._children.slice(0, start), ...this._children.slice(end)];
				this._children = this._children.slice(start, end);
			} else {
				slicedNodes = this._children.slice(start, end);
				this._children = [...this._children.slice(0, start), ...this._children.slice(end)];
			}
		}

		if (slicedNodes.length > 0) {
			slicedNodes.forEach((node: NodeTypes) => {
				unmountNode(node);
			});
		}
		if (this._children.length === 0) {
			this.insertBreakLine();
		}
	}

	splitChild(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes | Array<NodeTypes>): void {
		let StartSlice = startFromZero === true ? this._children.slice(0, start) : this._children.slice(start);

		let EndSlice = isDefined(end) ? this._children.slice(end) : [];

		if (node === undefined) this._children = [...StartSlice, ...EndSlice];
		else {
			if (Array.isArray(node)) {
				this._children = [...StartSlice, ...node, ...EndSlice];
			} else this._children = [...StartSlice, node, ...EndSlice];
		}
		if (this._children.length === 0) {
			this.insertBreakLine();
		}
	}

	collectSameNodes(): void {
		const NodeStylesEqual = (C1: TextNode, C2: TextNode): boolean => {
			let C1Styles = C1.getNodeStyle();
			let C2Styles = C2.getNodeStyle();

			let mismatch = false;

			if (C1Styles.length === 0 && C2Styles.length === 0) return true;
			else if (C1Styles.length === 0 && C2Styles.length !== 0) return false;
			else {
				for (let style of C1Styles) {
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

		let new_children: NodeTypes[] = [];
		let currentNode = this._children[0];
		new_children.push(currentNode);

		for (let i = 1; i < this._children.length; i++) {
			let nextNode = this._children[i];
			if (isSameTextNode(currentNode, nextNode)) {
				(currentNode as TextNode).appendContent((nextNode as TextNode).getContent());
			} else {
				currentNode = this._children[i];
				new_children.push(currentNode);
			}
		}
		this._children = new_children;
	}

	countToIndex(index: number): number {
		let Count = 0;
		index = index < 0 ? 1 : index;

		for (let CharIndex = 0; CharIndex < this._children.length; CharIndex++) {
			if (CharIndex <= index) {
				let CurrentElement = this._children[CharIndex];
				Count += CurrentElement.getContentLength();
			}
		}
		return Count;
	}

	findNodeByOffset(offset: number): findNodeOffsetData {
		let data: findNodeOffsetData = {offsetKey: 0, letterIndex: 0, key: undefined};
		let letterCount = 0;
		for (let i = 0; i < this._children.length; i++) {
			let currentNode = this._children[i];
			let currentLetterCount = currentNode.getContentLength();
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
		return this._children.length - 1;
	}

	getLastChild() {
		return this._children[this._children.length - 1];
	}

	getFirstChild() {
		return this._children[0];
	}

	nextNodeSibling(index: number): NodeTypes | undefined {
		let nextSibling = this._children[index + 1];
		if (nextSibling !== undefined) return nextSibling;
		else return undefined;
	}

	previousNodeSibling(index: number): NodeTypes | undefined {
		let previousSibling = this._children[index - 1];
		if (previousSibling !== undefined) return previousSibling;
		else return undefined;
	}

	getChildrenByIndex(index: number): NodeTypes {
		return this._children[index];
	}

	getNodeByKey(key: number): NodeTypes | undefined {
		return this._children.find((node) => node.key === key);
	}

	getType(): string {
		return this.blockType;
	}

	getWrapper(): string {
		return this.blockWrapper;
	}

	getLength(): number {
		return this._children.length;
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
		let className = 'AITE_editor_horizontal-rule';
		let props = {
			class: className,
		};

		return createAiteNode(this, 'div', {contenteditable: false}, [createAiteNode(null, 'hr', props, [])], {
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
