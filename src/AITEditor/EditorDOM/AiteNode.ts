import {HeadNode, NodeType} from "../nodes";
import {Nullable} from "../Interfaces";
import {AiteTextNode} from "./AiteTextNode";
import {setProps} from "./helpers";
import {AiteHTMLNode, AiteNodes} from "./interface";
import {__nodeMap} from "./EditorDom";
import {isAiteNode} from "./utils";
import {isTextNode} from "../typeguards";

class AiteNode {
	type: string;
	props: {[K: string]: any};
	children: Array<AiteNodes>;
	childrenLength: number;
	_key: Nullable<number>;
	AiteNodeType: NodeType;
	ref: Nullable<HeadNode>;

	constructor(ref: Nullable<HeadNode>, type: string, props: Nullable<{[K: string]: any}>, children?: Nullable<Array<AiteNodes>>) {
		this.type = type;
		this.props = props ?? {};
		this.children = children ?? [];
		this.childrenLength = this.children?.length ?? 0;
		this._key = ref?.key;
		this.AiteNodeType = ref?.type ?? "element";
		this.ref = (ref as any)?.["NACT_OBSERVERABLE"]?.instance;
	}
}

function createAiteNode(ref: HeadNode | null, type: string, props?: Nullable<{[K: string]: any}>, children?: Nullable<(AiteNode | string)[]>): AiteNode {
	if (children) {
		const mappedChildren: Array<AiteNodes> = [];

		children.forEach((node) => {
			if (typeof node === "string" && isTextNode(ref)) {
				mappedChildren.push(new AiteTextNode(ref, node));
			} else if (isAiteNode(node)) mappedChildren.push(node);
		});

		return new AiteNode(ref, type, props, mappedChildren);
	}
	return new AiteNode(ref, type, props);
}

function createAiteDomNode(node: AiteNode): AiteHTMLNode {
	const htmlNode: AiteHTMLNode = document.createElement(node.type) as AiteHTMLNode;
	setProps(htmlNode, node.props);
	htmlNode.$isAiteNode = true;
	htmlNode.$AiteNodeKey = node._key;
	htmlNode.$AiteNodeType = node.AiteNodeType;
	htmlNode.$ref = node.ref;

	if (node._key) {
		__nodeMap.set(node._key.toString(), htmlNode);
	}
	return htmlNode;
}

export {AiteNode, createAiteNode, createAiteDomNode};
