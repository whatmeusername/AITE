import {BlockType} from "./BlockNode";
import type {DOMNodeData} from "./BaseNode";

interface DOMTextAttr extends DOMNodeData {
	className?: string;
}

interface TextNodeAttr {
	plainText?: string;
	styles?: string[];
	type?: "breakline" | "text";
}

interface NodeUpdateOptions {
	removeIfEmpty?: boolean;
}

enum NodeStatus {
	REMOVED = 0,
	MOUNTED = 1,
	UNMOUNTED = 2,
}

interface ContentNodeInit {
	BlockNodes?: BlockType[];
}

export {NodeStatus};
export type {DOMTextAttr, TextNodeAttr, NodeUpdateOptions, ContentNodeInit};
