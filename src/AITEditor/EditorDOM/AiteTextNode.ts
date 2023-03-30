import {TextNode} from "../nodes";
import {Nullable} from "../Interfaces";
import {AiteHTMLTextNode} from "./interface";
import {TEXT_NODE_TYPE} from "../ConstVariables";

class AiteTextNode {
	children: string;
	_key: Nullable<number>;
	ref: Nullable<TextNode>;
	constructor(ref: Nullable<TextNode>, children: string) {
		this.children = children;
		this._key = ref?.key;
		this.ref = ref;
	}
}

function createAiteText(string: string, ref?: Nullable<TextNode>): AiteHTMLTextNode {
	const textNode: AiteHTMLTextNode = document.createTextNode(string) as AiteHTMLTextNode;
	textNode.$isAiteNode = true;
	textNode.$isTextNode = true;
	textNode.$AiteNodeType = TEXT_NODE_TYPE;
	textNode.$ref = ref ?? null;
	return textNode;
}

export {AiteTextNode, createAiteText};
