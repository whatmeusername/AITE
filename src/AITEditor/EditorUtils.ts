import {AiteHTMLNode, BaseNode} from "./index";

import defaultInlineStyles from "./defaultStyles/defaultInlineStyles";
import {StyleData} from "./Interfaces";

function getStyleData(key: string): StyleData {
	const style = defaultInlineStyles.find((style) => style.style === key);
	if (style !== undefined) {
		return {style: style.style, class: style.class ?? ""};
	} else throw new Error(`Can't find inline style with name ${key}, because its not defineded `);
}

function getDecoratorNode(node: AiteHTMLNode): AiteHTMLNode {
	let childrenset = node.dataset;
	if (!childrenset.aite_decorator_node) {
		childrenset = node.dataset;
		while ((node.parentNode as AiteHTMLNode)?.dataset?.aite_editor_root === undefined) {
			node = node.parentNode as AiteHTMLNode;
			if (node.dataset.aite_decorator_node) {
				return node;
			}
		}
	}
	return node;
}

function DiffNodeState(previousState: {[K: string]: any}, nextState: {[K: string]: any}) {
	const statusObj: {[K: string]: any} = {};
	Object.entries(previousState).forEach(([key, value]) => {
		if (nextState[key]) {
			const next = nextState[key];
			if (Array.isArray(next)) {
				// TODO: CURRENT NO USE
			} else if (next !== value) {
				statusObj[key] = "changed";
			}
		} else {
			statusObj[key] = "removed";
		}
	});
	return statusObj;
}

function MergeSameNodes<T extends BaseNode[]>(children: T): T {
	if (children.length <= 1) return children;

	const selection = children[0].domRef?.$editor?.selectionState;
	if (!selection) return children;
	const newChildren: T = [] as unknown as T;

	for (let i = 0; i < children.length; i++) {
		const prevNode = newChildren[newChildren.length - 1];
		const nextNode = children[i];
		if (prevNode && prevNode.constructor === nextNode.constructor && prevNode.tryToMerge) {
			const node = prevNode.tryToMerge(nextNode);
			if (node) {
				if (selection.anchorKey === nextNode.key) {
					selection.setNode(node);
					selection.anchorOffset += prevNode.length;
					selection.focusOffset += prevNode.length;
				} else if (selection.anchorKey === prevNode.key) {
					console.log(node);
					selection.setNode(node);
				}

				newChildren.splice(newChildren.length - 1, 1);
				newChildren.push(node);
			} else {
				newChildren.push(nextNode);
			}
		} else {
			newChildren.push(nextNode);
		}
	}

	return newChildren;
}

export {getDecoratorNode, DiffNodeState, getStyleData, MergeSameNodes};
