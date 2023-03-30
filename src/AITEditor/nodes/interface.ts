import {BREAK_LINE_TYPE, TEXT_NODE_TYPE} from "../ConstVariables";
import type {DOMNodeData} from "./BaseNode";

interface DOMTextAttr extends DOMNodeData {
	className?: string;
}

interface TextNodeAttr {
	plainText?: string;
	styles?: string[];
	type?: typeof BREAK_LINE_TYPE | typeof TEXT_NODE_TYPE;
}

interface NodeUpdateOptions {
	removeIfEmpty?: boolean;
}

enum NodeStatus {
	REMOVED = 0,
	MOUNTED = 1,
	UNMOUNTED = 2,
}

export {NodeStatus};
export type {DOMTextAttr, TextNodeAttr, NodeUpdateOptions};
