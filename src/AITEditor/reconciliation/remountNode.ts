import {HeadNode} from '../AITE_nodes';
import {AiteHTML} from './interface';
import {createDOMElement, returnSingleDOMNode} from './reconiliation';
import {getEditorState} from '../index';

function remountNode(node: HeadNode, childOnly: boolean = true) {
	let nodeState = (node as any)?.$getNodeState() ?? undefined;
	if (nodeState) {
		let currentDOMElement: AiteHTML | undefined = getEditorState().__editorDOMState.getNodeFromMap(node.getNodeKey());
		if (currentDOMElement) {
			let newNodeState = (node as any).$getNodeState();
			if (newNodeState === undefined) {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error('');
			} else if (childOnly === false) {
				currentDOMElement.parentNode?.replaceChild(createDOMElement(newNodeState), currentDOMElement);
			} else if (childOnly === true && newNodeState.children) {
				let updatedAiteHTMLNode = returnSingleDOMNode(newNodeState.children);
				if (Array.isArray(updatedAiteHTMLNode)) currentDOMElement.replaceChildren(...updatedAiteHTMLNode);
				else currentDOMElement.replaceChildren(updatedAiteHTMLNode);
			} else {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error('');
			}
		}
	}
}

export {remountNode};
