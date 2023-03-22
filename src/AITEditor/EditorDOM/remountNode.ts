import {HeadNode} from "../nodes";
import {createDOMElement, PassContext, returnSingleDOMNode} from "../index";

function remountNode(node: HeadNode, childOnly: boolean = true): HeadNode {
	if (node?.createNodeState) {
		if (node.domRef && !(node.domRef instanceof Text)) {
			const newNodeState = PassContext({editor: node.domRef.$editor}, node.createNodeState());
			if (newNodeState === undefined) {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error("");
			} else if (childOnly === false) {
				node.domRef.parentNode?.replaceChild(createDOMElement(newNodeState), node.domRef);
			} else if (childOnly === true && newNodeState.children) {
				const newHTMLNode = returnSingleDOMNode(newNodeState.children);
				node.domRef.replaceChildren.apply(node.domRef, Array.isArray(newHTMLNode) ? newHTMLNode : [newHTMLNode]);
			} else {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error("");
			}
		}
	}
	return node;
}

export {remountNode};
