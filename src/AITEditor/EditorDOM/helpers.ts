import {TextNode} from "../nodes";
import {NodeStatus} from "../nodes/interface";
import {AiteNode, createAiteDomNode} from "./AiteNode";
import {AiteTextNode, createAiteText} from "./AiteTextNode";
import {AiteHTML, AiteHTMLNode, AiteHTMLTextNode, AiteNodes, ClassAttribute, StringNumberBool} from "./interface";
import {isAiteNode, isAiteTextNode, isEventProp, isNotEmpty} from "./utils";

function addEventListeners<T extends HTMLElement>(target: T, type: string, listener: (...args: any[]) => void): T {
	if (isEventProp(type)) {
		target.addEventListener(type.slice(2).toLowerCase(), listener);
	}
	return target;
}

function setStyles<T extends HTMLElement>(target: T, styleObject: CSSStyleDeclaration): T {
	Object.entries(styleObject).forEach(([key, value]): void => {
		target.style[key as any] = value;
	});
	return target;
}

function setProps<T extends HTMLElement>(target: T, props: {[K: string]: any}): T {
	Object.entries(props).forEach(([key, value]) => {
		//@ts-ignore
		if (key.startsWith("$")) target[key] = value;
		else if (isEventProp(key)) addEventListeners(target, key, value);
		else setAttribute(target, key, value);
	});
	return target;
}

function setAttribute<T extends HTMLElement>(target: T, attrName: string, value: StringNumberBool | CSSStyleDeclaration): T {
	if (attrName === "style" && typeof value === "object") {
		setStyles(target, value);
	} else if ((attrName === ClassAttribute.className || attrName === ClassAttribute.class) && isNotEmpty(value)) {
		target.setAttribute("class", value.toString());
	} else if (isNotEmpty(value)) {
		target.setAttribute(attrName, value.toString());
	}
	return target;
}

function removeAttribute<T extends HTMLElement>(target: T, attrName: string, value: StringNumberBool | CSSStyleDeclaration): T {
	if (attrName === "className" && isNotEmpty(value)) {
		target.removeAttribute("class");
	} else if (isNotEmpty(value as StringNumberBool)) {
		target.removeAttribute(attrName);
	}
	return target;
}

function createDOMElement(node: AiteTextNode | AiteNode, parentNode?: unknown): AiteHTMLNode | AiteHTMLTextNode {
	const isText = isAiteTextNode(node);
	const $node = isText ? createAiteText(node.children, node.ref as TextNode) : createAiteDomNode(node);
	if (node.ref) {
		node.ref.status = NodeStatus.MOUNTED;
		node.ref.domRef = (isText ? parentNode : $node) as AiteHTMLNode;
	}

	if (isAiteNode(node) && $node instanceof HTMLElement) {
		node.children.map((node) => createDOMElement(node, $node)).forEach($node.appendChild.bind($node));
	}
	return $node;
}

function returnSingleDOMNode(CurrentState: AiteNodes): AiteHTMLNode;
function returnSingleDOMNode(CurrentState: AiteNodes[]): (AiteHTMLNode | Text)[];
function returnSingleDOMNode(CurrentState: AiteNodes | AiteNodes[]): AiteHTMLNode | (AiteHTMLNode | Text)[] {
	if (Array.isArray(CurrentState)) {
		const childrens: Array<AiteHTMLNode | Text> = [];
		CurrentState.map(createDOMElement).forEach(($node) => childrens.push($node));
		return childrens;
	}
	return createDOMElement(CurrentState as AiteNodes) as AiteHTMLNode;
}

function PassContext(props: {[K: string]: any}, nodes: AiteNodes[]): AiteNode[];
function PassContext(props: {[K: string]: any}, nodes: AiteNodes): AiteNode;
function PassContext(props: {[K: string]: any}, nodes: AiteNodes | AiteNodes[]): AiteNodes | AiteNodes[] {
	const passProps = (parent: AiteNodes | AiteNodes[]) => {
		if (parent instanceof Text) return parent;

		(Array.isArray(parent) ? parent : [parent]).forEach((child) => {
			if (isAiteNode(child)) {
				if (child.ref) {
					Object.entries(props).forEach(([key, value]) => {
						child.props["$" + key] = value;
					});
				}
				if (child.children) passProps(child.children);
			}
		});
		return parent;
	};

	if (Array.isArray(nodes)) {
		passProps(nodes);
		return nodes;
	}
	return passProps(nodes);
}

export {addEventListeners, setStyles, setProps, setAttribute, removeAttribute, returnSingleDOMNode, createDOMElement, PassContext};
