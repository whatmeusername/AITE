import {TextNode, HeadNode} from '../AITE_nodes/index';

import type {ContentNode} from '../index';
import {getEditorState, EditorState} from '../index';
import {HTML_TEXT_NODE} from '../ConstVariables';

import {AiteNode, AiteTextNode} from './index';

import type {AiteHTMLNode, AiteHTMLTextNode, AiteNodes, AiteNodeOptions, CSSStyles, StringNumberBool} from './interface';
import {Nullable} from '../Interfaces';

const __nodeMap: Map<string, AiteHTMLNode> = new Map();

function getKeyPathNodeByNode(node: AiteHTMLNode) {
	let pathToNode = [];

	if (node instanceof Text) {
		node = node.parentNode as AiteHTMLNode;
	}

	if (node.$$AiteNodeKey && node.$$isAiteNode) {
		pathToNode.unshift(node.$$AiteNodeKey);
		while (node?.dataset.aite_editor_root === undefined) {
			node = node.parentNode as AiteHTMLNode;
			if (node.$$AiteNodeKey) {
				pathToNode.unshift(node.$$AiteNodeKey);
			}
		}
		return pathToNode;
	}
	return [];
}

function updateTextNodeContent(node: TextNode) {
	let currentDOMElement: AiteHTMLTextNode | undefined = getEditorState().__editorDOMState.getNodeFromMap(node.getNodeKey())?.firstChild as AiteHTMLTextNode;

	if (currentDOMElement && currentDOMElement.nodeType === HTML_TEXT_NODE) {
		if (node.__content !== currentDOMElement.textContent) {
			currentDOMElement.textContent = node.__content;
		}
	}
}

const generateKey = (() => {
	let i = 1;
	return () => {
		return i++;
	};
})();

function isEventProp(name: string) {
	return name.startsWith('on');
}
//eslint-disable-next-line
function addEventListeners($target: AiteHTMLNode, type: string, listener: (...args: any[]) => void) {
	if (isEventProp(type)) {
		$target.addEventListener(type.slice(2).toLowerCase(), listener);
	}
}

function createAiteDomNode(node: AiteNode): AiteHTMLNode {
	const htmlNode: AiteHTMLNode = document.createElement(node.type) as AiteHTMLNode;
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

function createAiteText(string: string, ref?: TextNode): AiteHTMLTextNode {
	let textNode: AiteHTMLTextNode = document.createTextNode(string) as AiteHTMLTextNode;
	textNode.$$isAiteNode = true;
	textNode.$$isAiteTextNode = true;
	textNode.$$AiteNodeType = 'text';
	textNode.$$ref = ref ?? null;
	return textNode;
}

function isNotEmpty(value: any): boolean {
	if (value === null || value === undefined || value === '') return false;
	return true;
}

function setStyles($target: AiteHTMLNode, styleObject: CSSStyles): void {
	if (typeof styleObject !== 'object') return;
	Object.entries(styleObject).forEach(([key, value]): void => {
		$target.style[key as any] = value;
	});
}

function setProps($target: AiteHTMLNode, props: {[K: string]: any}) {
	Object.entries(props).forEach(([key, value]) => {
		if (isEventProp(key)) {
			addEventListeners($target, key, value);
		} else setAttribute($target, key, value);
	});
}

function setAttribute($target: AiteHTMLNode, attrName: string, value: StringNumberBool | CSSStyles): void {
	if (attrName === 'style' && typeof value === 'object') {
		setStyles($target, value);
	} else if (attrName === 'className' && isNotEmpty(value as StringNumberBool)) {
		$target.setAttribute('class', value.toString());
	} else if (isNotEmpty(value as StringNumberBool)) {
		$target.setAttribute(attrName, value.toString());
	}
}

//eslint-disable-next-line
function removeAttribute($target: AiteHTMLNode, attrName: string, value: StringNumberBool | CSSStyles): void {
	if (attrName === 'className' && isNotEmpty(value as StringNumberBool)) {
		$target.removeAttribute('class');
	} else if (isNotEmpty(value as StringNumberBool)) {
		$target.removeAttribute(attrName);
	}
}

function createDOMElementWithoutChildren(node: AiteNode): AiteHTMLNode;
function createDOMElementWithoutChildren(node: string): AiteHTMLTextNode;
function createDOMElementWithoutChildren(node: AiteNode | string): AiteHTMLNode | AiteHTMLTextNode {
	if (typeof node === 'string') {
		return createAiteText(node);
	} else if (node instanceof AiteNode) {
		let $node: AiteHTMLNode = createAiteDomNode(node);
		if (node.props) {
			setProps($node, node.props);
		}
		return $node;
	} else throw new Error('');
}

function createDOMElement(node: AiteNodes): AiteHTMLNode | Text {
	if (typeof node.children === 'string') {
		return createAiteText(node.children, node.ref as TextNode);
	} else if (node instanceof AiteNode) {
		let $node = createAiteDomNode(node);
		if (node.props) {
			setProps($node, node.props);
		}
		if (node.children) {
			node.children.map(createDOMElement).forEach($node.appendChild.bind($node));
		}
		return $node;
	} else throw new Error('');
}

function appendChildrens(node: AiteNodes): AiteHTMLNode | Text {
	if (node instanceof AiteNode) {
		let currentDOMNode = createDOMElementWithoutChildren(node);
		if (node.children && node.children.length > 0) {
			node.children.map(appendChildrens).forEach(currentDOMNode.appendChild.bind(currentDOMNode));
		}
		return currentDOMNode;
	} else return createAiteText(node.children, node.ref as TextNode);
}

function createNewDOMstate(EditorState: EditorState) {
	return createAiteNode(null, 'div', {}, createAITEContentNode(EditorState.contentNode));
}

function returnSingleDOMNode(CurrentState: AiteNodes | AiteNodes[]): AiteHTMLNode | Array<AiteHTMLNode | Text> {
	if (Array.isArray(CurrentState)) {
		let childrens: Array<AiteHTMLNode | Text> = [];
		CurrentState.map(appendChildrens).forEach(($node) => childrens.push($node));
		return childrens;
	}
	return appendChildrens(CurrentState as AiteNodes) as AiteHTMLNode;
}

function createAITEContentNode($ContentNode: ContentNode, options?: AiteNodeOptions): Array<AiteNode> {
	let BlockNodes = $ContentNode._children;
	let BlockArray: Array<AiteNode> = [];
	for (let i = 0; i < BlockNodes.length; i++) {
		BlockArray.push(BlockNodes[i].$getNodeState({...options}));
	}
	return BlockArray;
}

function createNewObjectState(EditorState: EditorState, offsetPath?: Array<number>): editorObjectState {
	if (offsetPath) {
		let currentNode = EditorState.contentNode.getBlockByPath(offsetPath);
		if (currentNode !== undefined) {
			return new editorObjectState(currentNode.$getNodeState({path: offsetPath}));
		}
	}

	return new editorObjectState(createNewDOMstate(EditorState));
}

class editorObjectState {
	__editorObjectState: AiteNode;
	constructor(objectNode: AiteNode, offsetPath?: Array<number>) {
		this.__editorObjectState = objectNode;
	}

	get() {
		return this.__editorObjectState;
	}

	getObjectNode(path: Array<number>): AiteNodes | undefined {
		if (path.length === 0) {
			return this.__editorObjectState;
		} else if (path.length === 1) {
			return this.__editorObjectState?.children ? (this.__editorObjectState?.children[path[0]] as AiteNode) : undefined;
		} else if (path.length > 1) {
			let node: AiteNodes | undefined = this.__editorObjectState?.children ? (this.__editorObjectState?.children[path[0]] as AiteNode) : undefined;
			if (node) {
				let pathLength = path.length;
				for (let i = 1; i < pathLength; i++) {
					let currentIndex = path[i];
					if (node && node instanceof AiteNode) {
						let childNode: AiteNodes | undefined = node.children ? node.children[currentIndex] : undefined;
						let isDecoratorNode = (childNode as AiteNode)?.props?.hasOwnProperty('data-aite_decorator_node') ?? false;
						if (childNode === undefined) {
							return undefined;
						} else if (childNode.isAiteWrapper === false && isDecoratorNode === false) {
							node = childNode;
						} else if (childNode !== undefined && childNode.children && (childNode.isAiteWrapper === true || isDecoratorNode === true)) {
							let childChildrenLength = childNode.children ? childNode.children.length : 0;
							for (let i = 0; i < childChildrenLength; i++) {
								let nextNode = childNode.children[i] as AiteNodes;
								if (nextNode.isAiteWrapper === false) {
									node = childNode.children[i] as AiteNodes;
									break;
								}
							}
						} else if (childNode) {
							node = childNode;
						}
					}
				}
			}
			return node;
		}
		return undefined;
	}
}

class editorDOMState {
	__editorObjectState: editorObjectState;
	__rootDOMElement: AiteHTMLNode;
	__nodeMap: Map<string, AiteHTMLNode>;

	constructor(EditorState: EditorState) {
		this.__editorObjectState = createNewObjectState(EditorState);
		this.__nodeMap = __nodeMap;
		this.__rootDOMElement = createDOMElement(this.__editorObjectState.get()) as AiteHTMLNode;
	}

	getNodeFromMap(key: Nullable<number>): AiteHTMLNode | undefined {
		if (key) {
			return this.__nodeMap.get(`${key}`) ?? undefined;
		}
		return undefined;
	}

	removeNodeFromMap(key: Nullable<number>): void {
		if (key) {
			this.__nodeMap.delete(`${key}`);
		}
	}

	__setDOMElement(node: AiteHTMLNode) {
		this.__rootDOMElement = node;
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
		const updatedChildren: Array<AiteNodes> = children.map((node, index) => {
			if (typeof node === 'string') {
				return new AiteTextNode(ref, node, true);
			} else return node;
		});
		return new AiteNode(ref, type, props, updatedChildren, options);
	}
	return new AiteNode(ref, type, props, children, options);
}

export {
	editorDOMState,
	updateTextNodeContent,
	getKeyPathNodeByNode,
	createNewDOMstate,
	returnSingleDOMNode,
	createAiteNode,
	createDOMElement,
	createNewObjectState,
	createAITEContentNode,
	generateKey,
};
