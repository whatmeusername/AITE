import {HeadNode} from "../nodes";
import {AiteHTML} from "./interface";
import {createDOMElement, getEditorState, returnSingleDOMNode} from "../index";

function remountNode(node: HeadNode, childOnly: boolean = true): HeadNode {
	const nodeState = (node as any)?.$getNodeState();
	if (nodeState) {
		const currentDOMElement: AiteHTML | undefined = getEditorState().EditorDOMState.getNodeFromMap(node.key);
		if (currentDOMElement) {
			const newNodeState = (node as any).$getNodeState();
			if (newNodeState === undefined) {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error("");
			} else if (childOnly === false) {
				currentDOMElement.parentNode?.replaceChild(createDOMElement(newNodeState), currentDOMElement);
			} else if (childOnly === true && newNodeState.children) {
				const newHTMLNode = returnSingleDOMNode(newNodeState.children);
				currentDOMElement.replaceChildren.apply(currentDOMElement, Array.isArray(newHTMLNode) ? newHTMLNode : [newHTMLNode]);
			} else {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error("");
			}
		}
	}
	return node;
}

export {remountNode};
