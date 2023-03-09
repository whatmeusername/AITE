import {EditorState} from "../index";
import {ContentNode} from "../nodes";

import {AiteNode, AiteTextNode, createAiteNode, isAiteNode, setProps, createAiteDOMNode} from "./index";

import {AiteHTMLNode, AiteHTMLTextNode, AiteNodes, AiteNodeOptions, NodeMap} from "./interface";
import {Nullable} from "../Interfaces";

export const __nodeMap: NodeMap = new Map();

function createDOMElement(node: AiteTextNode | AiteNode): AiteHTMLNode | AiteHTMLTextNode {
	const $node = createAiteDOMNode(node);
	if (isAiteNode(node) && $node instanceof HTMLElement) {
		if (node.props) {
			setProps($node, node.props);
		}
		node.children.map(createDOMElement).forEach($node.appendChild.bind($node));
	}
	return $node;
}

function returnSingleDOMNode(CurrentState: AiteNodes): AiteHTMLNode;
function returnSingleDOMNode(CurrentState: AiteNodes[]): Array<AiteHTMLNode | Text>;
function returnSingleDOMNode(CurrentState: AiteNodes | AiteNodes[]): AiteHTMLNode | Array<AiteHTMLNode | Text> {
	if (Array.isArray(CurrentState)) {
		const childrens: Array<AiteHTMLNode | Text> = [];
		CurrentState.map(createDOMElement).forEach(($node) => childrens.push($node));
		return childrens;
	}
	return createDOMElement(CurrentState as AiteNodes) as AiteHTMLNode;
}

function createAITEContentNode(ContentNode: ContentNode, options?: AiteNodeOptions): Array<AiteNode> {
	const BlockArray: Array<AiteNode> = [];
	for (let i = 0; i < ContentNode.children.length; i++) {
		BlockArray.push(ContentNode.children[i].$getNodeState({...options}));
	}
	return BlockArray;
}

class EditorDOMState {
	private readonly __rootNode: AiteNode;
	private __rootDOMElement: AiteHTMLNode;
	private readonly __nodeMap: Map<string, AiteHTMLNode>;

	constructor(EditorState: EditorState) {
		this.__rootNode = createAiteNode(null, "div", {}, createAITEContentNode(EditorState.contentNode));
		this.__nodeMap = __nodeMap;
		this.__rootDOMElement = createDOMElement(this.__rootNode) as AiteHTMLNode;
	}

	public getNodeFromMap(key: Nullable<number>): AiteHTMLNode | undefined {
		if (key) {
			return this.__nodeMap.get(`${key}`) ?? undefined;
		}
		return undefined;
	}

	public removeNodeFromMap(key: Nullable<number>): void {
		if (key) {
			this.__nodeMap.delete(`${key}`);
		}
	}

	public getRootHTMLNode(): AiteHTMLNode {
		return this.__rootDOMElement;
	}

	public __setDOMElement(node: AiteHTMLNode) {
		this.__rootDOMElement = node;
	}
}

export {EditorDOMState, returnSingleDOMNode, createDOMElement, createAITEContentNode};
