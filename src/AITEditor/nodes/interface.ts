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

export type {DOMTextAttr, TextNodeAttr, NodeUpdateOptions};
