import {isBlockNode, isContentNode} from "../EditorUtils";
import {unmountNode, getEditorState, BlockNode, remountNode, generateKey, BlockType, mountNode, NodeTypes, BaseBlockNode} from "../index";
import {ObservableHeadNode} from "../observers";
import {BaseNode, ContentNode, NodeType} from "./index";
import {NodeStatus} from "./interface";

abstract class HeadNode {
	status: NodeStatus;
	key: number;
	type: NodeType;

	constructor(type: NodeType) {
		this.status = NodeStatus.UNMOUNTED;
		this.key = generateKey();
		this.type = type;

		return ObservableHeadNode(this).value();
	}

	public getContentNode(): {
		contentNode: ContentNode | undefined;
		blockNode: BlockNode | undefined;
		index: number;
	} {
		let c: NodeTypes | BlockType | BaseNode = this as any;
		while (c.parent) {
			if (isContentNode(c.parent)) {
				return {
					contentNode: c.parent,
					blockNode: c as BlockNode,
					index: c.parent.children.findIndex((n) => n.key === c.key),
				};
			}
			c = c.parent;
		}
		return {contentNode: undefined, blockNode: undefined, index: -1};
	}

	public getSelfIndex(): number {
		if (!(this as any).parent) return -1;
		return (this as any).parent?.children.findIndex((n: HeadNode) => n.key === this.key);
	}

	public getActualType(): string {
		return this.type;
	}

	public remove(this: BaseNode | BaseBlockNode) {
		if (this.status === NodeStatus.MOUNTED && this.parent !== undefined && (isBlockNode(this.parent) || isContentNode(this.parent))) {
			unmountNode(this);
		}
	}

	public mount(this: BaseNode | BaseBlockNode): NodeStatus {
		mountNode(this);
		return this.status;
	}

	public remount(): NodeStatus {
		const DOMnode = getEditorState().EditorDOMState.getNodeFromMap(this.key);
		// HERE WE IGNORING SELF TYPE BECAUSE WE DOING DUCK TYPING TO CHECK IF CHILDREN CLASSES HAVE $getNodeState
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
			return (this.parent as any).children[index - 1];
		}

		return null;
	}

	public nextSibling(this: BaseNode | BaseBlockNode): NodeTypes | null {
		if (!this.parent) return null;
		const index = (this.parent as BlockNode | ContentNode)?.children?.findIndex((n) => n.key === this.key);
		if (index > -1) {
			return (this.parent as any).children[index + 1];
		}
		return null;
	}
}

export {HeadNode};
