import {TextNode, HeadNode} from "./index";

import {BaseBlockNode, BlockNode, NodeInsertionDeriction, createAiteNode, AiteNode} from "../index";
import {ObservableChildren, ObservableChildrenProperty} from "../observers";
import {NodeStatus} from "./interface";
import {isBlockNode, isLeafNode} from "../typeguards";

class ContentNode extends HeadNode {
	children: BaseBlockNode[];

	constructor() {
		super("content");

		this.children = ObservableChildren(this, []);
		return ObservableChildrenProperty(this).value();
	}

	public clone(): ContentNode {
		return new ContentNode();
	}

	get length(): number {
		return this.children.length;
	}

	public append(...nodes: BaseBlockNode[]): this {
		this.children.push(...nodes);
		return this;
	}

	public insertNode(node: BaseBlockNode, index: number, direction: NodeInsertionDeriction = NodeInsertionDeriction.BEFORE): void {
		if (index < 0) return;

		index = direction === NodeInsertionDeriction.AFTER ? index + 1 : index;
		this.children = [...this.children.slice(0, index), node, ...this.children.slice(index)];
	}

	public insertNodeBetween(block: BaseBlockNode, start: number, end?: number): void {
		if (end !== undefined) {
			this.children = [...this.children.slice(0, start), block, ...this.children.slice(end ?? start)];
		} else {
			this.children = [...this.children.slice(0, start), block];
		}
	}

	public getTextNodeOffset(node: TextNode, offset: number): number {
		const TextContentLength = node.length;
		if (offset === -1) {
			offset = TextContentLength;
		} else if (offset > TextContentLength) {
			offset = TextContentLength;
		}
		return offset;
	}

	/**
	 * Adding letters to nodes and then updating them
	 * @param  {KeyboardEvent} KeyBoardEvent
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */

	public getBlockNodesBetween(startNode: BaseBlockNode, endNode: BaseBlockNode, returnAllIfNotFound?: boolean): BaseBlockNode[] {
		let startFound = false;
		const nodes: BaseBlockNode[] = [];

		const startKey = isLeafNode(startNode) ? (startNode.parent as BlockNode).key : startNode.key;
		const endKey = isLeafNode(endNode) ? (endNode.parent as BlockNode).key : endNode.key;

		if (startKey === endKey) return [];

		for (let i = 0; i < this.children.length; i++) {
			const node = this.children[i];

			if (node.key === startKey) {
				startFound = !startFound;
				continue;
			}
			if (node.key === endKey) {
				break;
			}

			if (startFound || startKey === -1) nodes.push(node);
		}

		return returnAllIfNotFound && nodes.length === 0 ? this.children : nodes;
	}

	// TODO: MOVE METHOD TO BLOCK NODE AS METHOD
	public MergeBlockNode(connectingNode: BlockNode, joinNode: BlockNode): void {
		connectingNode = (isLeafNode(connectingNode) ? connectingNode.parent : connectingNode) as BlockNode;
		joinNode = (isLeafNode(joinNode) ? joinNode.parent : joinNode) as BlockNode;

		if (isBlockNode(connectingNode) && isBlockNode(joinNode)) {
			if (connectingNode.isBreakLine) {
				connectingNode.remove();
			} else if (joinNode.isBreakLine) {
				joinNode.remove();
			} else if (connectingNode.status === NodeStatus.MOUNTED && joinNode.status === NodeStatus.MOUNTED) {
				connectingNode.children = [...connectingNode.children, ...joinNode.children];
				joinNode.remove();
				connectingNode.remount();
			}
		}
	}

	public createNodeState(): AiteNode {
		return createAiteNode(
			null,
			"div",
			{},
			this.children.map((node) => node.createNodeState()),
		);
	}
}

function createContentNode() {
	const node = new ContentNode();
	return node;
}

export {createContentNode, ContentNode};
