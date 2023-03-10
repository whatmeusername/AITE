import {AiteNode, createAiteNode} from "../EditorDOM";
import {LeafNode} from "../nodes";
import {BlockNode} from "../nodes/BlockNode";

class ListNode extends BlockNode {
	constructor() {
		super();
	}

	get length(): number {
		return this.children.length;
	}

	public clone(): ListNode {
		return new ListNode();
	}

	createNodeState(): AiteNode {
		return createAiteNode(
			this,
			"ul",
			{},
			this.children.map((node) => node.createNodeState()),
		);
	}
}

class ListNodeItem extends LeafNode {
	constructor() {
		super();
	}

	get length(): number {
		return this.children.length;
	}

	public clone(): ListNodeItem {
		return new ListNodeItem();
	}

	createNodeState(): AiteNode {
		return createAiteNode(
			this,
			"li",
			{},
			this.children.map((node) => node.createNodeState()),
		);
	}
}

function createListNode(): ListNode {
	return new ListNode();
}

function createListNodeItem(): ListNodeItem {
	return new ListNodeItem();
}

export {ListNode, ListNodeItem, createListNode, createListNodeItem};
