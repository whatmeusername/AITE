import type {DOMNodeData} from "./BaseNode";

interface DOMTextAttr extends DOMNodeData {
	className?: string;
	"data-aite-node"?: boolean;
}

interface TextNodeAttr {
	plainText: string;
	styles?: Array<string>;
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
