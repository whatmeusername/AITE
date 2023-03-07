import {BREAK_LINE_TYPE, LINK_NODE_TYPE, TEXT_NODE_TYPE} from "../ConstVariables";
import {isBlockNode, isContentNode} from "../EditorUtils";
import {unmountNode, getEditorState, BlockNode, remountNode, ContentNode, generateKey, BlockType, mountNode, NodeTypes, BaseBlockNode} from "../index";
import {ObservableHeadNode} from "../observers";
import {BaseNode, NodeKeyTypes} from "./index";
import {NodeStatus} from "./interface";

abstract class HeadNode {
	status: NodeStatus;
	key: number;
	protected __type: NodeKeyTypes | "block";

	constructor(type: NodeKeyTypes | "block") {
		this.status = NodeStatus.UNMOUNTED;
		this.key = generateKey();
		this.__type = type;

		// PATCH
		const n = ObservableHeadNode(this).value();
		return n;
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
		return (this as any).parent?.children.indexOf(this as any);
	}

	public getActualType(): string {
		return this.__type;
	}

	// WILL DEPRECATE SOON
	public getType(): string {
		if (this.__type === TEXT_NODE_TYPE || this.__type === LINK_NODE_TYPE) {
			return TEXT_NODE_TYPE;
		} else if (this.__type === BREAK_LINE_TYPE) return BREAK_LINE_TYPE;
		return "element";
	}

	public remove(): NodeStatus {
		const DOMnode = getEditorState().EditorDOMState.getNodeFromMap(this.key);
		if (DOMnode !== undefined && this.key) {
			const parentRef = (DOMnode.$ref as BaseNode).parent;
			if (parentRef && (isBlockNode(parentRef) || isContentNode(parentRef))) {
				unmountNode(this);
				parentRef.removeNodeByKey(this.key);
			}
		}
		return this.status;
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
