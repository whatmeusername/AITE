import {HeadNode} from "../nodes";
import {isTextNode} from "../ContentNode";
import {Nullable} from "../Interfaces";
import {AiteTextNode} from "./AiteTextNode";
import {setProps} from "./helpers";
import {AiteHTMLNode, AiteNodeOptions, AiteNodes, AiteNodeTypes} from "./interface";
import {__nodeMap} from "./EditorDom";
import {isAiteNode} from "./utils";

class AiteNode {
	type: string;
	props: {[K: string]: any};
	children: Array<AiteNodes>;
	childrenLength: number;
	_key: Nullable<number>;
	isAiteWrapper: boolean;
	AiteNodeType: AiteNodeTypes;
	ref: Nullable<HeadNode>;

	constructor(ref: Nullable<HeadNode>, type: string, props: Nullable<{[K: string]: any}>, children: Nullable<Array<AiteNodes>>, options?: AiteNodeOptions) {
		this.type = type;
		this.props = props ?? {};
		this.children = children ?? [];
		this.childrenLength = this.children?.length ?? 0;
		this.isAiteWrapper = options?.isAiteWrapper ?? false;
		this._key = ref?.key;
		this.AiteNodeType = options?.AiteNodeType ?? "unsigned";
		this.ref = ref;
	}
}

function createAiteNode(
	ref: HeadNode | null,
	type: string,
	props: Nullable<{[K: string]: any}>,
	children?: Nullable<Array<AiteNode | string>>,
	options?: AiteNodeOptions,
): AiteNode {
	if (children) {
		const mappedChildren: Array<AiteNodes> = [];

		children.forEach((node) => {
			if (typeof node === "string" && isTextNode(ref)) {
				mappedChildren.push(new AiteTextNode(ref, node, true));
			} else if (isAiteNode(node)) mappedChildren.push(node);
		});

		return new AiteNode(ref, type, props, mappedChildren, options);
	}
	return new AiteNode(ref, type, props, children, options);
}

function createAiteDomNode(node: AiteNode): AiteHTMLNode {
	const htmlNode: AiteHTMLNode = document.createElement(node.type) as AiteHTMLNode;
	setProps(htmlNode, node.props);
	htmlNode.$$isAiteNode = true;
	htmlNode.$$AiteNodeKey = node._key;
	htmlNode.$$AiteNodeType = node.AiteNodeType;
	htmlNode.$$isAiteWrapper = node.isAiteWrapper ?? false;
	htmlNode.$$ref = node.ref;

	if (node._key) {
		__nodeMap.set(node._key.toString(), htmlNode);
	}
	return htmlNode;
}

export {AiteNode, createAiteNode, createAiteDomNode};