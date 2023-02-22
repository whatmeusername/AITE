import {BlockType, NodeTypes} from '../BlockNode';
import {getEditorState} from '../EditorState';
import {createDOMElement} from './reconiliation';

function mountNode(siblingNode: NodeTypes | BlockType, node: NodeTypes | BlockType, insertDirection: 'after' | 'before' = 'before') {
	let currentDOMElement = getEditorState().__editorDOMState.getNodeFromMap(siblingNode.getNodeKey());
	if (currentDOMElement && node.$getNodeStatus() === 1) {
		if (insertDirection === 'after') {
			currentDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), currentDOMElement.nextSibling);
		} else if (insertDirection === 'before') {
			currentDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), currentDOMElement);
		}
	}
}

export {mountNode};
