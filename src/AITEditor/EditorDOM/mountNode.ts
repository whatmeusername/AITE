import {BlockType, NodeTypes} from '../BlockNode';
import {getEditorState} from '../EditorState';
import {NodeInsertionDeriction} from './interface';
import {createDOMElement} from './reconiliation';

function mountNode(siblingNode: NodeTypes | BlockType, node: NodeTypes | BlockType, insertDirection: NodeInsertionDeriction = NodeInsertionDeriction.before) {
	let currentDOMElement = getEditorState().__editorDOMState.getNodeFromMap(siblingNode.key);
	if (currentDOMElement && node.$getNodeStatus() === 1) {
		if (insertDirection === 'after') {
			currentDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), currentDOMElement.nextSibling);
		} else if (insertDirection === 'before') {
			currentDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), currentDOMElement);
		}
	}
}

export {mountNode};
