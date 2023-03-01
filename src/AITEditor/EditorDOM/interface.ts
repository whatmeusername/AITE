import type {TextNode, HeadNode} from "../nodes/index";
import {Nullable} from "../Interfaces";
import type {AiteNode, AiteTextNode} from "./index";

type StringNumberBool = string | number | boolean;
type AiteNodes = AiteNode | AiteTextNode;

interface AiteHTMLNode extends HTMLElement {
	$$AiteNodeType: string;
	$$AiteNodeKey: Nullable<number>;
	$$isAiteNode: true;
	$$isAiteWrapper: boolean;
	$$ref: Nullable<HeadNode>;
}

interface AiteHTMLTextNode extends Text {
	$$AiteNodeType: string;
	$$AiteNodeKey: Nullable<number>;
	$$isAiteNode: true;
	$$isAiteTextNode: true;
	$$ref: Nullable<TextNode>;
}

type AiteNodeTypes = "text" | "breakline" | "element" | "unsigned" | "image/gif";

type AiteHTML = AiteHTMLNode | AiteHTMLTextNode;
type NodeMap = Map<string, AiteHTMLNode>;

interface AiteNodeOptions {
	isAiteTextNode?: boolean;
	isAiteWrapper?: boolean;
	AiteNodeType?: AiteNodeTypes;
}

enum NodeInsertionDeriction {
	AFTER = "after",
	BEFORE = "before",
}

enum ClassAttribute {
	className = "className",
	class = "class",
}

export {NodeInsertionDeriction, ClassAttribute};
export type {AiteHTMLNode, AiteHTMLTextNode, AiteNodes, AiteNodeOptions, AiteNodeTypes, AiteHTML, StringNumberBool, NodeMap};
