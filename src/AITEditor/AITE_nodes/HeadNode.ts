import {unmountNode, getEditorState, BlockNode, remountNode, ContentNode, generateKey, isContentNode, BlockType} from '../index';
import {BaseNode, LinkNode, NodeKeyTypes} from './index';

abstract class HeadNode {
	status: 0 | 1 | 2;
	key: number;
	protected __type: NodeKeyTypes | 'block';

	constructor(type: NodeKeyTypes | 'block') {
		this.status = 1;
		this.key = generateKey();
		this.__type = type;
	}

	getSelfIndexPath(): number[] {
		const path = [];
		let node: any = this;
		while (node.__parent) {
			path.unshift(node.getSelfIndex());
			node = node.__parent;
		}
		return path;
	}

	getContentNode(): {contentNode: ContentNode | undefined; index: number} {
		let c: BaseNode | BlockNode = this as unknown as BaseNode;
		while (c.__parent) {
			if (isContentNode(c.__parent)) {
				return {contentNode: c.__parent, index: c.__parent._children.indexOf(c as BlockType)};
			}
			c = c.__parent;
		}
		return {contentNode: undefined, index: -1};
	}

	getSelfIndex(): number {
		if (!(this as any)?.__parent) return -1;
		return (this as any).__parent._children.indexOf(this as any);
	}

	getActualType(): string {
		return this.__type;
	}

	remove(): void {
		let DOMnode = getEditorState().__editorDOMState.getNodeFromMap(this.key);
		if (DOMnode !== undefined && this.key) {
			const parentRef: BlockNode | BaseNode | ContentNode | null = (DOMnode.$$ref as BaseNode).__parent;
			if (parentRef && (parentRef instanceof BlockNode || parentRef instanceof ContentNode || parentRef instanceof LinkNode)) {
				this.status = 0;
				unmountNode(this);
				parentRef.removeNodeByKey(this.key);
			}
		}
	}

	remount(): void {
		let DOMnode = getEditorState().__editorDOMState.getNodeFromMap(this.key);
		// HERE WE IGNORING SELF TYPE BECAUSE WE DOING DUCK TYPING TO CHECK IF CHILDREN CLASSES HAVE $getNodeState
		if (DOMnode !== undefined && this.key !== undefined && (this as any).$getNodeState) {
			// if((this as any).collectSameNodes){
			//     (this as any).collectSameNodes();
			// }
			remountNode(this);
		}
	}
}

export {HeadNode};
