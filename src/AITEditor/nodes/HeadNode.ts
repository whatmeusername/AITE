import {isContentNode} from "../EditorUtils";
import {unmountNode, getEditorState, BlockNode, remountNode, ContentNode, generateKey, BlockType, internalMountNode} from "../index";
import {BaseNode, LinkNode, NodeKeyTypes} from "./index";

abstract class HeadNode {
	status: 0 | 1 | 2;
	key: number;
	protected __type: NodeKeyTypes | "block";

	constructor(type: NodeKeyTypes | "block") {
		this.status = 1;
		this.key = generateKey();
		this.__type = type;
	}

	getSelfIndexPath(): number[] {
		const path = [];
		let node: any = this;
		while (node.parent) {
			path.unshift(node.getSelfIndex());
			node = node.parent;
		}
		return path;
	}

	getContentNode(): {contentNode: ContentNode | undefined; blockNode: BlockNode | undefined; index: number} {
		let c: BaseNode | BlockNode = this as unknown as BaseNode;
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

	getSelfIndex(): number {
		if (!(this as any)?.parent) return -1;
		return (this as any).parent.children.indexOf(this as any);
	}

	getActualType(): string {
		return this.__type;
	}

	remove(): number {
		const DOMnode = getEditorState().EditorDOMState.getNodeFromMap(this.key);
		if (DOMnode !== undefined && this.key) {
			const parentRef = (DOMnode.$ref as BaseNode).parent;
			if (parentRef && (parentRef instanceof BlockNode || parentRef instanceof ContentNode || parentRef instanceof LinkNode)) {
				this.status = 0;
				unmountNode(this);
				parentRef.removeNodeByKey(this.key);
			}
		}
		return this.status;
	}

	mount(): number {
		// TEMPERARY ANY TYPE
		internalMountNode(this as any);
		return this.status;
	}

	remount(): number {
		const DOMnode = getEditorState().EditorDOMState.getNodeFromMap(this.key);
		// HERE WE IGNORING SELF TYPE BECAUSE WE DOING DUCK TYPING TO CHECK IF CHILDREN CLASSES HAVE $getNodeState
		if (DOMnode !== undefined && this.key !== undefined && (this as any).$getNodeState) {
			// if((this as any).collectSameNodes){
			//     (this as any).collectSameNodes();
			// }
			remountNode(this);
		}
		return this.status;
	}
}

export {HeadNode};
