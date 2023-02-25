import {BlockNode, NodeTypes} from "../BlockNode";
import {TEXT_NODE_TYPE, LINK_NODE_TYPE, BREAK_LINE_TYPE, IMAGE_NODE_TYPE, LIST_NODE_TYPE} from "../ConstVariables";
import {isBlockNode} from "../ContentNode";

import {HeadNode} from "./index";

type NodeKeyTypes = typeof TEXT_NODE_TYPE | typeof IMAGE_NODE_TYPE | typeof LINK_NODE_TYPE | typeof BREAK_LINE_TYPE | typeof LIST_NODE_TYPE;

interface DOMhtml {
	key?: string;
	target?: "_blank" | "_self" | "_parent" | "_top";
}

type DOMattr = {
	html?: {
		key?: string;
		target?: "_blank" | "_self" | "_parent" | "_top";
	};
	other?: {
		isActive?: boolean;
		isActiveFunction?: (charIndex: number, blockIndex: number) => boolean;
	};
};

abstract class BaseNode extends HeadNode {
	protected __status: 0 | 1;
	parent: BlockNode | BaseNode | null;

	constructor(type: NodeKeyTypes, parent?: BlockNode) {
		super(type);
		this.__status = 1;
		this.parent = parent ?? null;
	}

	getType(): string {
		if (this.__type === TEXT_NODE_TYPE || this.__type === LINK_NODE_TYPE) {
			return TEXT_NODE_TYPE;
		} else if (this.__type === BREAK_LINE_TYPE) return BREAK_LINE_TYPE;
		return "element";
	}

	getStatus(): number {
		return this.__status;
	}

	previousSibling(): NodeTypes | null {
		if (!this.parent) return null;
		if (isBlockNode(this.parent)) {
			const index = this.parent.children.indexOf(this as any);
			if (index > -1) {
				return this.parent.children[index - 1];
			}
		}
		return null;
	}

	nextSibling(): NodeTypes | null {
		if (!this.parent) return null;
		if (isBlockNode(this.parent)) {
			const index = this.parent.children.indexOf(this as any);
			if (index > -1) {
				return this.parent.children[index + 1];
			}
		}
		return null;
	}
}

export {BaseNode};

export type {DOMattr, DOMhtml, NodeKeyTypes};
