import type {HeadNode} from "../nodes/index";
import {Nullable} from "../Interfaces";
import type {AiteNode, AiteTextNode} from "./index";
import {EditorState} from "../EditorState";

type StringNumberBool = string | number | boolean;
type AiteNodes = AiteNode | AiteTextNode;

interface AiteBaseHTML {
	$ref: Nullable<HeadNode>;
	$editor?: EditorState;
	$AiteNodeType: string;
	$AiteNodeKey: Nullable<number>;
	$isAiteNode: boolean;
}

interface AiteHTMLNode extends HTMLElement, AiteBaseHTML {
	firstChild: AiteHTML;
	parentNode: AiteHTMLNode;
}

interface AiteHTMLTextNode extends Text, AiteBaseHTML {
	$isTextNode: true;
}

type AiteHTML = AiteHTMLNode | AiteHTMLTextNode;
type NodeMap = Map<string, AiteHTMLNode>;

enum NodeInsertionDeriction {
	AFTER = "after",
	BEFORE = "before",
}

enum ClassAttribute {
	className = "className",
	class = "class",
}

export {NodeInsertionDeriction, ClassAttribute};
export type {AiteHTMLNode, AiteHTMLTextNode, AiteNodes, AiteHTML, StringNumberBool, NodeMap, AiteBaseHTML};
