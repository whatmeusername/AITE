import {BaseBlockNode, BlockNode, NodeTypes} from "../BlockNode";
import {TEXT_NODE_TYPE, LINK_NODE_TYPE, BREAK_LINE_TYPE, IMAGE_NODE_TYPE, LIST_NODE_TYPE} from "../ConstVariables";
import {AiteNode, AiteNodeOptions} from "../EditorDOM";
import {isBlockNode} from "../EditorUtils";

import {HeadNode} from "./index";

type NodeKeyTypes = typeof TEXT_NODE_TYPE | typeof IMAGE_NODE_TYPE | typeof LINK_NODE_TYPE | typeof BREAK_LINE_TYPE | typeof LIST_NODE_TYPE | "contentNode";

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
	parent: BlockNode | BaseNode | null;

	constructor(type: NodeKeyTypes) {
		super(type);
		this.parent = null;
	}

	abstract $getNodeState<T extends AiteNodeOptions>(options?: T): AiteNode;
}

export {BaseNode};

export type {DOMattr, DOMNodeData, NodeKeyTypes};
