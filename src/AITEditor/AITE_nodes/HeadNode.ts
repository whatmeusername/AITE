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
		while (node.parent) {
			path.unshift(node.getSelfIndex());
			node = node.parent;
		}
		return path;
	}

	getContentNode(): {contentNode: ContentNode | undefined; index: number} {
		let c: BaseNode | BlockNode = this as unknown as BaseNode;
		while (c.parent) {
			if (isContentNode(c.parent)) {
				return {contentNode: c.parent, index: c.parent.children.indexOf(c as BlockType)};
			}
			c = c.parent;
		}
		return {contentNode: undefined, index: -1};
	}

	getSelfIndex(): number {
		if (!(this as any)?.parent) return -1;
		return (this as any).parent.children.indexOf(this as any);
	}

	getActualType(): string {
		return this.__type;
	}

	remove(): void {
		let DOMnode = getEditorState().__editorDOMState.getNodeFromMap(this.key);
		if (DOMnode !== undefined && this.key) {
			const parentRef: BlockNode | BaseNode | ContentNode | null = (DOMnode.$$ref as BaseNode).parent;
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
