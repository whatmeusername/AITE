import defaultBlocks from "../defaultStyles/defaultBlocks";
import {STANDART_BLOCK_TYPE, HORIZONTAL_RULE_BLOCK_TYPE, TEXT_NODE_TYPE} from "../ConstVariables";
import {ClassVariables} from "../Interfaces";

import {HeadNode, TextNode, NodeType, LeafNode, BreakLineNode, ContentNode, BaseNode} from "./index";

import {ObservableChildren} from "../observers";
import {ObservableChildrenProperty} from "../observers";
import {AiteNode, createAiteNode, NodeInsertionDeriction} from "../EditorDOM";
import {isDefined, isLeafNode} from "../typeguards";

type NodeTypes = BaseNode | LeafNode;
type BlockTypes = typeof STANDART_BLOCK_TYPE | typeof HORIZONTAL_RULE_BLOCK_TYPE;

type BlockNodeVariables = Omit<ClassVariables<BlockNode>, "children">;

type allowedToInsert = "all" | "element" | typeof TEXT_NODE_TYPE;

function createBlockNode(initData?: BlockNodeVariables) {
	return new BlockNode(initData);
}

abstract class BaseBlockNode extends HeadNode {
	blockType: BlockTypes;
	blockInlineStyles: Array<string>;
	parent: ContentNode | BlockNode | null;

	constructor(blockType?: BlockTypes, blockInlineStyles?: Array<string>, type?: NodeType, initData?: {[K: string]: any}) {
		super(false, type ?? "block", initData);
		this.blockType = blockType ?? STANDART_BLOCK_TYPE;
		this.blockInlineStyles = blockInlineStyles ?? [];
		this.parent = null;
	}
}

class BlockNode extends BaseBlockNode {
	plainText: string;
	blockWrapper: string;
	children: NodeTypes[];

	// TODO: IMPLEMENT VALIDATOR
	allowedToInsert: allowedToInsert;

	constructor(initData?: BlockNodeVariables, type?: NodeType | null) {
		super(initData?.blockType, initData?.blockInlineStyles, type ?? "block", initData);

		this.plainText = initData?.plainText ?? "";
		this.blockWrapper = initData?.blockWrapper ?? "unstyled";
		this.children = ObservableChildren(this, []);
		this.allowedToInsert = initData?.allowedToInsert ?? "all";

		return ObservableChildrenProperty(this).value();
	}

	get length(): number {
		return this.children.length;
	}

	public clone(): BlockNode {
		return new BlockNode(this.initData);
	}

	// ----- NEWEST

	public replace<T extends this["children"][0], U extends this["children"][0]>(node: T, nodeToInsert: U): this {
		if (node?.parent?.key !== this.key) return this;
		this.insertNode(nodeToInsert, node.getSelfIndex());
		node.remove();
		return this;
	}

	public append(...nodes: NodeTypes[]): this {
		this.children.push(...nodes);
		return this;
	}

	public getNodesBetween(
		startKey: number,
		endKey?: number,
		returnAllIfNotFound?: boolean,
		validateLeaf?: boolean,
		forcePoints?: {start: boolean; end: boolean},
		clone?: boolean,
	): {original: NodeTypes[]; modified: NodeTypes[]} {
		const points = forcePoints ?? {start: false, end: false};
		const nodes: {original: NodeTypes[]; modified: NodeTypes[]} = {original: [], modified: []};

		const block = (!validateLeaf ? (isLeafNode(this) ? this.parent : this) : this) as BlockNode;
		if (!block) return nodes;

		for (let i = 0; i < block.children.length; i++) {
			const node = block.children[i];
			const isDecorator = isLeafNode(node);

			if (endKey && isDecorator) {
				const subNodes = node.getNodesBetween(points.start ? -1 : startKey, endKey, false, true, points);
				if (subNodes.original.length !== node.children.length) {
					if (subNodes.modified.length > 0 && clone) {
						nodes.modified.push(node.clone().append(...subNodes.modified.map((node) => node.clone() as any)));
						nodes.original.push(...subNodes.modified);
					} else {
						nodes.modified.push(...subNodes.original);
						nodes.original.push(...subNodes.modified);
					}
				} else {
					nodes.original.push(node);
					nodes.modified.push(node);
				}

				if (points.end) break;
			}

			if (node.key === startKey) {
				points.start = true;
				continue;
			} else if (node.key === endKey) {
				points.end = true;
				break;
			}

			if (!isDecorator && (points.start || startKey === -1)) {
				nodes.original.push(node);
				nodes.modified.push(node);
			}
		}

		return returnAllIfNotFound && nodes.original.length === 0 ? {original: block.children, modified: block.children} : nodes;
	}

	get isBreakLine(): boolean {
		return (
			this.children.length === 0 || (this.children.length === 1 && (this.children[0] instanceof BreakLineNode || (this.children[0] as TextNode).content === ""))
		);
	}

	// ------ OLDEST

	public createNodeState(): AiteNode {
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
		};

		const children: Array<AiteNode> = this.children.map((node) => node.createNodeState());

		return createAiteNode(this, tag, props, children);
	}

	public insertBreakLine() {
		if (this.children.length === 0) {
			this.children = [new BreakLineNode()];
			this.remount();
		}
	}

	public insertNode(node: NodeTypes, index: number, direction: NodeInsertionDeriction = NodeInsertionDeriction.BEFORE): NodeTypes | null {
		if (index < 0) return null;

		index = direction === NodeInsertionDeriction.AFTER ? index + 1 : index;
		this.children = [...this.children.slice(0, index), node, ...this.children.slice(index)];
		node.parent = this;

		return node;
	}

	public splitChild(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes | Array<NodeTypes>): void {
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

	public getLastChild(depth: true): NodeTypes;
	public getLastChild(depth?: undefined): NodeTypes | LeafNode;
	public getLastChild(depth?: boolean): NodeTypes | LeafNode {
		if (depth) {
			const node = this.children[this.children.length - 1];
			if (isLeafNode(node)) {
				return node.getLastChild();
			}
			return node;
		}
		return this.children[this.children.length - 1];
	}

	public getFirstChild(depth: true): NodeTypes;
	public getFirstChild(depth?: undefined): NodeTypes | LeafNode;
	public getFirstChild(depth?: boolean): NodeTypes | LeafNode {
		if (depth) {
			const node = this.children[0];
			if (isLeafNode(node)) {
				return node.getFirstChild();
			}
			return node;
		}
		return this.children[0];
	}

	public getChildrenByIndex(index: number): NodeTypes {
		return this.children[index];
	}

	public getNodeByKey(key: number): NodeTypes | undefined {
		return this.children.find((node) => node.key === key);
	}
}

export {createBlockNode, BlockNode, BaseBlockNode};

export type {NodeTypes, BlockTypes};
