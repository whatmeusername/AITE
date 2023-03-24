import {BlockNode} from "./BlockNode";
import {TEXT_NODE_TYPE, BREAK_LINE_TYPE} from "../ConstVariables";

import {HeadNode} from "./index";

type NodeType = typeof TEXT_NODE_TYPE | typeof BREAK_LINE_TYPE | "content" | "block" | "leaf" | "element";

interface DOMNodeData {
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
	public parent: BlockNode | BaseNode | null;

	constructor(focusalbe: boolean, type: NodeType, initData?: {[K: string]: any}) {
		super(focusalbe, type, initData);
		this.parent = null;
	}
}

export {BaseNode};

export type {DOMattr, DOMNodeData, NodeType};
