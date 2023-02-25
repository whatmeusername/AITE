import {HeadNode} from '../AITE_nodes';
import {AiteHTML} from './interface';
import {createDOMElement, returnSingleDOMNode} from './EditorDom';
import {getEditorState} from '../index';

function remountNode(node: HeadNode, childOnly: boolean = true): HeadNode {
	let nodeState = (node as any)?.$getNodeState() ?? undefined;
	if (nodeState) {
		const currentDOMElement: AiteHTML | undefined = getEditorState().__editorDOMState.getNodeFromMap(node.key);
		if (currentDOMElement) {
			let newNodeState = (node as any).$getNodeState();
			if (newNodeState === undefined) {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error('');
			} else if (childOnly === false) {
				currentDOMElement.parentNode?.replaceChild(createDOMElement(newNodeState), currentDOMElement);
			} else if (childOnly === true && newNodeState.children) {
				const newHTMLNode = returnSingleDOMNode(newNodeState.children);
				currentDOMElement.replaceChildren.apply(currentDOMElement, Array.isArray(newHTMLNode) ? newHTMLNode : [newHTMLNode]);
			} else {
				// TODO: REPLACE WITH ERROR FUNCTION
				throw new Error('');
			}
		}
	}
	return node;
}

export {remountNode};
