import type {TextNode, HeadNode, NodeType} from "../nodes/index";
import {Nullable} from "../Interfaces";
import type {AiteNode, AiteTextNode} from "./index";

type StringNumberBool = string | number | boolean;
type AiteNodes = AiteNode | AiteTextNode;

interface AiteHTMLNode extends HTMLElement {
	$AiteNodeType: string;
	$AiteNodeKey: Nullable<number>;
	$isAiteNode: true;
	$ref: Nullable<HeadNode>;

	firstChild: AiteHTML;
	parentNode: AiteHTMLNode;
}

interface AiteHTMLTextNode extends Text {
	$AiteNodeType: string;
	$AiteNodeKey: Nullable<number>;
	$isAiteNode: true;
	$isTextNode: true;
	$ref: Nullable<TextNode>;
}

type AiteHTML = AiteHTMLNode | AiteHTMLTextNode;
type NodeMap = Map<string, AiteHTMLNode>;

interface AiteNodeOptions {
	isAiteTextNode?: boolean;
	AiteNodeType?: NodeType;
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
export type {AiteHTMLNode, AiteHTMLTextNode, AiteNodes, AiteNodeOptions, AiteHTML, StringNumberBool, NodeMap};
