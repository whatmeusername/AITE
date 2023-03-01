import {TextNode} from "../nodes/index";

import type {ContentNode} from "../index";
import {EditorState} from "../index";

import {AiteNode, AiteTextNode, createAiteDomNode, createAiteNode, createAiteText, isAiteNode, setProps} from "./index";

import {AiteHTMLNode, AiteHTMLTextNode, AiteNodes, AiteNodeOptions, NodeMap} from "./interface";
import {Nullable} from "../Interfaces";

export const __nodeMap: NodeMap = new Map();

function createDOMElementWithoutChildren(node: AiteNode): AiteHTMLNode;
function createDOMElementWithoutChildren(node: string): AiteHTMLTextNode;
function createDOMElementWithoutChildren(node: AiteNode | string): AiteHTMLNode | AiteHTMLTextNode {
	if (typeof node === "string") {
		return createAiteText(node);
	} else if (isAiteNode(node)) {
		const $node: AiteHTMLNode = createAiteDomNode(node);
		if (node.props) {
			setProps($node, node.props);
		}
		return $node;
	} else throw new Error("");
}

function createDOMElement(node: AiteNodes): AiteHTMLNode | Text {
	if (typeof node.children === "string") {
		return createAiteText(node.children, node.ref as TextNode);
	} else if (isAiteNode(node)) {
		const $node = createAiteDomNode(node);
		if (node.props) {
			setProps($node, node.props);
		}
		if (node.children) {
			node.children.map(createDOMElement).forEach($node.appendChild.bind($node));
		}
		return $node;
	} else throw new Error("");
}

function appendChildrens(node: AiteNode | AiteTextNode): AiteHTMLNode | AiteHTMLTextNode {
	if (isAiteNode(node)) {
		const currentDOMNode = createDOMElementWithoutChildren(node);
		if (node.children && node.children.length > 0) {
			node.children.map(appendChildrens).forEach(currentDOMNode.appendChild.bind(currentDOMNode));
		}
		return currentDOMNode;
	} else return createAiteText(node.children, node.ref);
}

function returnSingleDOMNode(CurrentState: AiteNodes): AiteHTMLNode;
function returnSingleDOMNode(CurrentState: AiteNodes[]): Array<AiteHTMLNode | Text>;
function returnSingleDOMNode(CurrentState: AiteNodes | AiteNodes[]): AiteHTMLNode | Array<AiteHTMLNode | Text> {
	if (Array.isArray(CurrentState)) {
		const childrens: Array<AiteHTMLNode | Text> = [];
		CurrentState.map(appendChildrens).forEach(($node) => childrens.push($node));
		return childrens;
	}
	return appendChildrens(CurrentState as AiteNodes) as AiteHTMLNode;
}

function createAITEContentNode(ContentNode: ContentNode, options?: AiteNodeOptions): Array<AiteNode> {
	const BlockNodes = ContentNode.children;
	const BlockArray: Array<AiteNode> = [];
	for (let i = 0; i < BlockNodes.length; i++) {
		BlockArray.push(BlockNodes[i].$getNodeState({...options}));
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
