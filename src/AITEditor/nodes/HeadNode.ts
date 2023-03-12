import {isBlockNode, isContentNode} from "../EditorUtils";
import {unmountNode, getEditorState, BlockNode, remountNode, generateKey, BlockNodeType, mountNode, NodeTypes, BaseBlockNode, AiteNode} from "../index";
import {ObservableHeadNode} from "../observers";
import {BaseNode, ContentNode, createTextNode, NodeType} from "./index";
import {NodeStatus} from "./interface";

abstract class HeadNode {
	public status: NodeStatus;
	public key: number;
	public type: NodeType;
	public initData?: {[K: string]: any};
	public parent: HeadNode | null;

	constructor(type: NodeType, initData?: {[K: string]: any}) {
		this.status = NodeStatus.UNMOUNTED;
		this.key = generateKey();
		this.type = type;
		this.initData = initData;
		this.parent = null;

		return ObservableHeadNode(this).value();
	}

	public abstract get length(): number;

	public getContentNode(): {
		contentNode: ContentNode | undefined;
		blockNode: BlockNode | undefined;
		index: number;
		parentBlockNode: BlockNode | undefined;
	} {
		let c: NodeTypes | BlockNodeType | BaseNode = this as any;
		let parentBlockNode;
		while (c.parent) {
			if (isBlockNode(c) && !parentBlockNode) {
				parentBlockNode = c;
			}
			if (isContentNode(c.parent)) {
				return {
					contentNode: c.parent,
					blockNode: c as BlockNode,
					index: c.parent.children.findIndex((n) => n.key === c.key),
					parentBlockNode: parentBlockNode,
				};
			}
			c = c.parent;
		}
		return {contentNode: undefined, blockNode: undefined, index: -1, parentBlockNode: undefined};
	}

	public getSelfIndex(): number {
		if (!this.parent) return -1;
		return (this as any).parent?.children.findIndex((n: HeadNode) => n.key === this.key);
	}

	public getActualType(): string {
		return this.type;
	}

	public remove() {
		if (this.parent && this.status === NodeStatus.MOUNTED && (isBlockNode(this.parent) || isContentNode(this.parent))) {
			unmountNode(this);
			this.parent.children?.splice(this.getSelfIndex(), 1);
			this.status = NodeStatus.REMOVED;
		}
	}

	public mount(this: BaseNode | BaseBlockNode): NodeStatus {
		mountNode(this);
		return this.status;
	}

	public remount(): NodeStatus {
		const DOMnode = getEditorState().EditorDOMState.getNodeFromMap(this.key);
		// HERE WE IGNORING SELF TYPE BECAUSE WE DOING DUCK TYPING TO CHECK IF CHILDREN CLASSES HAVE createNodeState
		if (DOMnode !== undefined) {
			// if((this as any).collectSameNodes){
			//     (this as any).collectSameNodes();
			// }
			remountNode(this);
		}
		return this.status;
	}

	public previousSibling(this: BaseNode | BaseBlockNode): NodeTypes | null {
		if (!this.parent) return null;
		const index = (this.parent as BlockNode | ContentNode)?.children?.findIndex((n) => n.key === this.key);
		if (index > -1) {
			return (this.parent as BlockNode | ContentNode).children[index - 1];
		}

		return null;
	}

	public nextSibling(this: BaseNode | BaseBlockNode): NodeTypes | null {
		if (!this.parent) return null;
		const index = (this.parent as BlockNode | ContentNode)?.children?.findIndex((n) => n.key === this.key);
		if (index > -1) {
			return (this.parent as BlockNode | ContentNode).children[index + 1];
		}
		return null;
	}

	public abstract clone(): HeadNode;
	public abstract createNodeState(): AiteNode;
	public tryToMerge(node: this): BaseNode | null {
		return null;
	}
}

export {HeadNode};
