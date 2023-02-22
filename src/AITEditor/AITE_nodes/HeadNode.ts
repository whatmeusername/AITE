import {unmountNode, getEditorState, BlockNode, remountNode, ContentNode, generateKey, isContentNode, BlockType} from '../index';
import {BaseNode, LinkNode, NodeKeyTypes} from './index';

abstract class HeadNode {
	protected _status: 0 | 1 | 2;
	private _key: number;
	protected __type: NodeKeyTypes | 'block';

	constructor(type: NodeKeyTypes | 'block') {
		this._status = 1;
		this._key = generateKey();
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

	getNodeKey(): number {
		return this._key;
	}

	$getNodeStatus() {
		return this._status;
	}

	remove(): void {
		let DOMnode = getEditorState().__editorDOMState.getNodeFromMap(this._key);
		if (DOMnode !== undefined && this._key) {
			const parentRef: BlockNode | BaseNode | ContentNode | null = (DOMnode.$$ref as BaseNode).__parent;
			if (parentRef && (parentRef instanceof BlockNode || parentRef instanceof ContentNode || parentRef instanceof LinkNode)) {
				this._status = 0;
				unmountNode(this);
				parentRef.removeNodeByKey(this._key);
			}
		}
	}

	remount(): void {
		let DOMnode = getEditorState().__editorDOMState.getNodeFromMap(this._key);
		// HERE WE IGNORING SELF TYPE BECAUSE WE DOING DUCK TYPING TO CHECK IF CHILDREN CLASSES HAVE $getNodeState
		if (DOMnode !== undefined && this._key !== undefined && (this as any).$getNodeState) {
			// if((this as any).collectSameNodes){
			//     (this as any).collectSameNodes();
			// }
			remountNode(this);
		}
	}
}

export {HeadNode};
